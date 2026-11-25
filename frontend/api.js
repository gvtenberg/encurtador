const TEMPO_LIMITE_MS = 10000;
const MENSAGEM_FALHA = 'Não foi possível encurtar agora. Verifique sua conexão e tente de novo.';

// Devolve { codigo, url, urlCurta }; lança Error com mensagem pronta para mostrar na tela.
export async function criarLink(url) {
  let resposta;
  let corpo;
  try {
    resposta = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    });
    corpo = await resposta.json();
  } catch {
    throw new Error(MENSAGEM_FALHA);
  }
  if (!resposta.ok) {
    throw new Error(corpo?.erro ?? MENSAGEM_FALHA);
  }
  return corpo;
}
