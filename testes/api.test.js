import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { criarApp } from '../backend/app.js';
import { criarEncurtador } from '../backend/encurtador.js';
import { criarRepositorioLinks } from '../dados/repositorioLinks.js';

let repositorio;
let servidor;
let endereco;

before(async () => {
  repositorio = criarRepositorioLinks(':memory:');
  const encurtador = criarEncurtador({ repositorio });
  const app = criarApp({ encurtador, enderecoBase: 'https://curto.exemplo' });
  await new Promise((resolver) => {
    servidor = app.listen(0, '127.0.0.1', resolver);
  });
  endereco = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  servidor.closeAllConnections();
  await new Promise((resolver) => servidor.close(resolver));
  repositorio.fechar();
});

function enviar(corpo) {
  return fetch(`${endereco}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: corpo,
  });
}

test('cria um link curto e redireciona para o original', async () => {
  const original = 'https://exemplo.com/pagina?a=1&b=2';
  const resposta = await enviar(JSON.stringify({ url: original }));
  assert.equal(resposta.status, 201);
  const link = await resposta.json();
  assert.match(link.codigo, /^[A-Za-z0-9]{7}$/);
  assert.equal(link.url, original);
  assert.equal(link.urlCurta, `https://curto.exemplo/${link.codigo}`);

  const acesso = await fetch(`${endereco}/${link.codigo}`, { redirect: 'manual' });
  assert.equal(acesso.status, 302);
  assert.equal(acesso.headers.get('location'), original);
});

test('um código antigo, com caracteres que se confundem, continua redirecionando', async () => {
  repositorio.inserir({ codigo: 'l1IO0o7', url: 'https://exemplo.com/antigo', criadoEm: 1 });
  const acesso = await fetch(`${endereco}/l1IO0o7`, { redirect: 'manual' });
  assert.equal(acesso.status, 302);
  assert.equal(acesso.headers.get('location'), 'https://exemplo.com/antigo');
});

test('a mesma URL enviada duas vezes recebe códigos diferentes', async () => {
  const corpo = JSON.stringify({ url: 'https://exemplo.com' });
  const primeiro = await (await enviar(corpo)).json();
  const segundo = await (await enviar(corpo)).json();
  assert.notEqual(primeiro.codigo, segundo.codigo);
});

const urlsInvalidas = [undefined, null, 123, '', '   ', 'exemplo.com', 'javascript:alert(1)',
  'ftp://exemplo.com', 'http://', `https://exemplo.com/${'a'.repeat(2048)}`];
for (const url of urlsInvalidas) {
  test(`recusa URL inválida: ${String(url).slice(0, 30)}`, async () => {
    const resposta = await enviar(JSON.stringify({ url }));
    assert.equal(resposta.status, 400);
    assert.ok((await resposta.json()).erro);
  });
}

test('recusa pedido com JSON mal formado', async () => {
  const resposta = await enviar('{');
  assert.equal(resposta.status, 400);
  assert.ok((await resposta.json()).erro);
});

test('recusa pedido grande demais', async () => {
  const resposta = await enviar(JSON.stringify({ url: 'a'.repeat(20000) }));
  assert.equal(resposta.status, 413);
});

test('recusa pedido sem corpo', async () => {
  const resposta = await fetch(`${endereco}/api/links`, { method: 'POST' });
  assert.equal(resposta.status, 400);
});

test('responde 404 para código inexistente', async () => {
  const resposta = await fetch(`${endereco}/naoexiste`);
  assert.equal(resposta.status, 404);
});

test('tenta outro código quando o primeiro já existe', () => {
  const codigos = ['repetid', 'repetid', 'novo123'];
  const encurtador = criarEncurtador({ repositorio, gerarCodigo: () => codigos.shift() });
  encurtador.encurtar('https://exemplo.com/1');
  assert.equal(encurtador.encurtar('https://exemplo.com/2').codigo, 'novo123');
  assert.equal(encurtador.buscarUrl('repetid'), 'https://exemplo.com/1');
});

test('desiste com erro quando só há códigos repetidos', () => {
  const encurtador = criarEncurtador({ repositorio, gerarCodigo: () => 'sempre1' });
  encurtador.encurtar('https://exemplo.com');
  assert.throws(() => encurtador.encurtar('https://exemplo.com'), /código único/);
});

test('mostra a documentação da API', async () => {
  const pagina = await fetch(`${endereco}/api/docs/`);
  assert.equal(pagina.status, 200);
  assert.match(await pagina.text(), /swagger-ui/);

  const configuracao = await (await fetch(`${endereco}/api/docs/swagger-ui-init.js`)).text();
  assert.match(configuracao, /Encurtador de links/);
});
