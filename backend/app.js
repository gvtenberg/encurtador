import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { criarDocumentacao } from './documentacao.js';
import { ErroUrlInvalida } from './validacaoUrl.js';

// Erros causados por quem enviou o pedido, por código HTTP.
const MENSAGENS_PEDIDO_INVALIDO = {
  400: 'O pedido está mal formado.',
  413: 'O pedido é grande demais.',
  415: 'O formato do pedido não é aceito.',
};

export function criarApp({ encurtador, enderecoBase }) {
  const app = express();
  app.use(express.json({ limit: '16kb' }));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(criarDocumentacao(enderecoBase)));

  app.post('/api/links', (req, res) => {
    const { codigo, url } = encurtador.encurtar(req.body?.url);
    res.status(201).json({ codigo, url, urlCurta: `${enderecoBase}/${codigo}` });
  });

  app.get('/:codigo', (req, res, next) => {
    const url = encurtador.buscarUrl(req.params.codigo);
    if (url === null) {
      next();
      return;
    }
    res.redirect(302, url);
  });

  app.use((req, res) => {
    res.status(404).json({ erro: 'Link não encontrado.' });
  });

  // O Express só reconhece o tratador de erros se ele tiver quatro parâmetros.
  app.use((erro, req, res, next) => {
    if (res.headersSent) {
      next(erro);
      return;
    }
    if (erro instanceof ErroUrlInvalida) {
      res.status(400).json({ erro: erro.message });
      return;
    }
    const mensagem = MENSAGENS_PEDIDO_INVALIDO[erro.status];
    if (mensagem) {
      res.status(erro.status).json({ erro: mensagem });
      return;
    }
    console.error(erro);
    res.status(500).json({ erro: 'Algo deu errado. Tente novamente mais tarde.' });
  });

  return app;
}
