import { DatabaseSync } from 'node:sqlite';

// Única camada que conhece o SQLite.
export function criarRepositorioLinks(caminhoBanco) {
  const banco = new DatabaseSync(caminhoBanco);
  banco.exec(`
    CREATE TABLE IF NOT EXISTS links (
      codigo TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      criado_em TEXT NOT NULL
    )
  `);

  const comandoInserir = banco.prepare(
    'INSERT INTO links (codigo, url, criado_em) VALUES (?, ?, ?) ON CONFLICT (codigo) DO NOTHING',
  );
  const comandoBuscar = banco.prepare('SELECT url FROM links WHERE codigo = ?');

  return {
    // Devolve true se gravou; false se o código já existia.
    inserir({ codigo, url, criadoEm }) {
      return comandoInserir.run(codigo, url, criadoEm).changes === 1;
    },
    // Devolve a URL original ou null se o código não existir.
    buscarUrl(codigo) {
      return comandoBuscar.get(codigo)?.url ?? null;
    },
    fechar() {
      banco.close();
    },
  };
}
