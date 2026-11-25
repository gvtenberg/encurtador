import { randomInt } from 'node:crypto';

const CARACTERES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const TAMANHO = 7;

export function gerarCodigo() {
  return Array.from({ length: TAMANHO }, () => CARACTERES[randomInt(CARACTERES.length)]).join('');
}
