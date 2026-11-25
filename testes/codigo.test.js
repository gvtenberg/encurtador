import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CARACTERES, gerarCodigo } from '../backend/codigo.js';

test('o alfabeto não tem caracteres que se confundem', () => {
  for (const proibido of 'lI1Oo0') {
    assert.ok(!CARACTERES.includes(proibido), `não deveria conter ${proibido}`);
  }
});

test('o alfabeto tem exatamente os 56 caracteres permitidos', () => {
  const regex = /^[A-HJ-NP-Za-kmnp-z2-9]$/;
  const todos = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];
  assert.deepEqual([...CARACTERES].sort(), todos.filter((c) => regex.test(c)).sort());
  assert.equal(CARACTERES.length, 56);
});

test('os códigos novos têm 7 caracteres permitidos', () => {
  for (let i = 0; i < 2000; i++) {
    assert.match(gerarCodigo(), /^[A-HJ-NP-Za-kmnp-z2-9]{7}$/);
  }
});
