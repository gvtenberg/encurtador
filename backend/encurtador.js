import { gerarCodigo as gerarCodigoPadrao } from './codigo.js';
import { validarUrl } from './validacaoUrl.js';

const MAXIMO_TENTATIVAS = 5;

// Regras de negócio. O repositório precisa ter inserir() e buscarUrl().
export function criarEncurtador({ repositorio, gerarCodigo = gerarCodigoPadrao }) {
  return {
    // Garante um código único gravado; lança erro se a URL for inválida.
    encurtar(texto) {
      const url = validarUrl(texto);
      const criadoEm = new Date().toISOString();
      for (let tentativa = 0; tentativa < MAXIMO_TENTATIVAS; tentativa++) {
        const codigo = gerarCodigo();
        if (repositorio.inserir({ codigo, url, criadoEm })) {
          return { codigo, url };
        }
      }
      throw new Error('Não foi possível gerar um código único.');
    },
    // Devolve a URL original ou null.
    buscarUrl(codigo) {
      return repositorio.buscarUrl(codigo);
    },
  };
}
