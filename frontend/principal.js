import { criarLink } from './api.js';

const formulario = document.querySelector('#formulario');
const campoUrl = document.querySelector('#campo-url');
const botaoEncurtar = document.querySelector('#botao-encurtar');
const erro = document.querySelector('#erro');
const resultado = document.querySelector('#resultado');
const linkCurto = document.querySelector('#link-curto');
const botaoCopiar = document.querySelector('#botao-copiar');
const aviso = document.querySelector('#aviso');

function mostrarErro(mensagem) {
  erro.textContent = mensagem;
  campoUrl.setAttribute('aria-invalid', 'true');
  campoUrl.focus();
}

function limpar() {
  erro.textContent = '';
  aviso.textContent = '';
  campoUrl.removeAttribute('aria-invalid');
  resultado.hidden = true;
}

function mostrarLink(urlCurta) {
  linkCurto.href = urlCurta;
  linkCurto.textContent = urlCurta;
  resultado.hidden = false;
  aviso.textContent = 'Link curto criado.';
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (botaoEncurtar.disabled) return;
  limpar();
  botaoEncurtar.disabled = true;
  botaoEncurtar.textContent = 'Encurtando…';
  try {
    const { urlCurta } = await criarLink(campoUrl.value);
    mostrarLink(urlCurta);
  } catch (falha) {
    mostrarErro(falha.message);
  } finally {
    botaoEncurtar.disabled = false;
    botaoEncurtar.textContent = 'Encurtar';
  }
});

botaoCopiar.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(linkCurto.href);
    aviso.textContent = 'Link copiado.';
  } catch {
    // Sem permissão para copiar: deixa o link selecionado para a pessoa copiar.
    window.getSelection().selectAllChildren(linkCurto);
    aviso.textContent = 'Não foi possível copiar sozinho. O link está selecionado: aperte Ctrl+C ou use a opção Copiar do celular.';
  }
});
