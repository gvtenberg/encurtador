import assert from 'node:assert/strict';
import { test } from 'node:test';
import { criarEncurtador } from '../backend/encurtador.js';
import { CARACTERES, gerarCodigo } from '../backend/codigo.js';
import { criarRepositorioLinks } from '../dados/repositorioLinks.js';

test('o alfabeto não tem caracteres que se confundem', () => {
  for (const proibido of 'lI1Oo0') {
    assert.ok(!CARACTERES.includes(proibido), `não deveria conter ${proibido}`);
  }
});

test('os códigos novos têm 7 caracteres permitidos', () => {
  for (let i = 0; i < 2000; i++) {
    assert.match(gerarCodigo(), /^[A-HJ-NP-Za-km-z2-9]{7}$/);
  }
});

test('um código antigo, com caracteres que se confundem, continua redirecionando', () => {
  const repositorio = criarRepositorioLinks(':memory:');
  try {
    repositorio.inserir({ codigo: 'l1IO0o7', url: 'https://exemplo.com/', criadoEm: 1 });
    const encurtador = criarEncurtador({ repositorio });
    assert.equal(encurtador.buscarUrl('l1IO0o7'), 'https://exemplo.com/');
  } finally {
    repositorio.fechar();
  }
});
