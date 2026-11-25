import { randomInt } from 'node:crypto';

// Sem l, I, 1, O, o e 0, que se confundem quando o código é digitado à mão.
export const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const TAMANHO = 7;

export function gerarCodigo() {
  return Array.from({ length: TAMANHO }, () => CARACTERES[randomInt(CARACTERES.length)]).join('');
}
