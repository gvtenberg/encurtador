// Descrição da API no padrão OpenAPI, usada pelo Swagger.
export function criarDocumentacao(enderecoBase) {
  const respostaErro = (descricao) => ({
    description: descricao,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
  });

  return {
    openapi: '3.0.3',
    info: {
      title: 'Encurtador de links',
      version: '0.1.0',
      description: 'API aberta e pública para encurtar links.',
    },
    servers: [{ url: enderecoBase }],
    paths: {
      '/api/links': {
        post: {
          tags: ['Links'],
          summary: 'Cria um link curto',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/NovoLink' } } },
          },
          responses: {
            201: {
              description: 'Link curto criado.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Link' } } },
            },
            400: respostaErro('Link inválido ou pedido mal formado.'),
            413: respostaErro('Pedido grande demais.'),
            415: respostaErro('Formato do pedido não aceito.'),
            500: respostaErro('Erro inesperado.'),
          },
        },
      },
      '/{codigo}': {
        get: {
          tags: ['Links'],
          summary: 'Redireciona para o link original',
          description:
            'Para testar, abra o link curto em outra aba: por segurança, o navegador costuma impedir que esta página siga o redirecionamento para outro site.',
          parameters: [
            {
              name: 'codigo',
              in: 'path',
              required: true,
              schema: { type: 'string', example: 'aB3xK9z' },
            },
          ],
          responses: {
            302: {
              description: 'Redireciona para o link original.',
              headers: { Location: { description: 'Link original.', schema: { type: 'string' } } },
            },
            400: respostaErro('Pedido mal formado.'),
            404: respostaErro('Link não encontrado.'),
            500: respostaErro('Erro inesperado.'),
          },
        },
      },
    },
    components: {
      schemas: {
        NovoLink: {
          type: 'object',
          required: ['url'],
          properties: {
            url: {
              type: 'string',
              maxLength: 2048,
              description: 'Link começando com http:// ou https://.',
              example: 'https://www.wikipedia.org/',
            },
          },
        },
        Link: {
          type: 'object',
          required: ['codigo', 'url', 'urlCurta'],
          properties: {
            codigo: { type: 'string', example: 'aB3xK9z' },
            url: { type: 'string', example: 'https://www.wikipedia.org/' },
            urlCurta: { type: 'string', example: `${enderecoBase}/aB3xK9z` },
          },
        },
        Erro: {
          type: 'object',
          required: ['erro'],
          properties: { erro: { type: 'string', example: 'Link não encontrado.' } },
        },
      },
    },
  };
}
