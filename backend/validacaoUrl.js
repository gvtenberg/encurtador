const TAMANHO_MAXIMO = 2048;
const PROTOCOLOS_ACEITOS = ['http:', 'https:'];

export class ErroUrlInvalida extends Error {}

// Devolve a URL normalizada; lança ErroUrlInvalida se ela não puder ser encurtada.
export function validarUrl(texto) {
  if (typeof texto !== 'string' || texto.trim() === '') {
    throw new ErroUrlInvalida('Informe o link que deseja encurtar.');
  }
  const url = URL.parse(texto.trim());
  if (url === null || !PROTOCOLOS_ACEITOS.includes(url.protocol)) {
    throw new ErroUrlInvalida('O link precisa ser um endereço válido, começando com http:// ou https://.');
  }
  if (url.href.length > TAMANHO_MAXIMO) {
    throw new ErroUrlInvalida(`O link pode ter no máximo ${TAMANHO_MAXIMO} caracteres.`);
  }
  return url.href;
}
