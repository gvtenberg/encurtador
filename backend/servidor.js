import { fileURLToPath } from 'node:url';
import { criarRepositorioLinks } from '../dados/repositorioLinks.js';
import { criarApp } from './app.js';
import { criarEncurtador } from './encurtador.js';

const porta = Number(process.env.PORTA ?? 3000);
const enderecoBase = (process.env.ENDERECO_BASE ?? `http://localhost:${porta}`).replace(/\/+$/, '');
const caminhoBanco =
  process.env.CAMINHO_BANCO ?? fileURLToPath(new URL('../dados/encurtador.db', import.meta.url));

const repositorio = criarRepositorioLinks(caminhoBanco);
const encurtador = criarEncurtador({ repositorio });

criarApp({ encurtador, enderecoBase }).listen(porta, (erro) => {
  if (erro) {
    console.error(`Não foi possível iniciar na porta ${porta}:`, erro.message);
    process.exit(1);
  }
  console.log(`Encurtador funcionando em ${enderecoBase}`);
});
