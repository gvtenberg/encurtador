# Encurtador (URL shortener)

**Sections**: Project · Status · Language · How we work · Engineering principles · Code style · Conventions · Commands · File map

Updated on 24/11/2026.

## Project
Website where the user pastes a long link and gets a short one; opening the short link redirects to the original address.
Technology: Node.js, Express and SQLite (database in a single file).

## Status
- Done: backend API without authentication or request limit (create link and redirect), random 7-character codes without confusing characters, Swagger UI.
- Done: frontend (`frontend/`): page to create a link and copy it, light and dark theme, friendly "link not found" page.
- Before publishing: set `ENDERECO_BASE`; decide on a request limit and CORS.
- History: `docs/historico.md`.

## Language
- Chat replies and `.md` docs: plain English.
- Portuguese: texts shown to users, `README.md`, manual tests file, code comments and identifiers.

## How we work
- The user is a student, not from IT: simple language, exact commands to type.
- Do only what was asked; ask before anything extra or any new dependency.
- Read only what the task needs. No subagents unless asked.
- Every change must be reversible.
- Commit once per real change, after the user confirms it works. Never `git push` without being asked.

## Engineering principles
When principles conflict or in doubt, **KISS and YAGNI come first**.

- **SOLID**:
  - **S**ingle responsibility: each module or class has only one reason to change.
  - **O**pen/closed: extend behavior without modifying code that already works.
  - **L**iskov substitution: an implementation can replace another of the same type without breaking its callers.
  - **I**nterface segregation: small, specific interfaces; no one depends on what they do not use.
  - **D**ependency inversion: business rules depend on abstractions, not on details such as Express or SQLite.
- **Separation into layers**: the project is divided into three layers, each with its own code:
  - **Frontend**: pages and what the user sees; talks only to the backend, never to the database.
  - **Backend**: Express routes and business rules; reaches the database only through the data access layer.
  - **Data access**: the only layer that contains SQL and talks to SQLite; no business rules.
- **KISS** (keep it simple): choose the simplest solution that solves the problem.
- **YAGNI** (you aren't gonna need it): do not build anything before it is really needed.
- **DRY** (don't repeat yourself): each rule or piece of knowledge lives in only one place.
- **Composition over inheritance**: combine small parts instead of creating class hierarchies.
- **Design by contract**: each function makes clear what it requires (preconditions), what it guarantees (postconditions) and what must always stay true (invariants); a broken contract fails early with a clear error.
- **High cohesion**: keep together what belongs to the same subject; each module deals with a single subject.

## Code style
- Do not nest ternaries.
- To choose among many options, use a map from id to function.

## Conventions
- Accept only `http://` and `https://` links; validate on the server.
- SQL always with parameters, never by joining text.
- Escape any user-provided text shown on a page.
- Passwords, keys, `.env`, the database file and `node_modules/` never in git.

## Commands
- Install: `npm install`
- Start: `npm start` (API at `http://localhost:3000`, Swagger at `http://localhost:3000/api/docs/`)
- Test: `npm test`
- Optional environment variables: `PORTA`, `ENDERECO_BASE`, `CAMINHO_BANCO`

## File map
- `backend/`: Express routes (`app.js`), business rules (`encurtador.js`, `codigo.js`, `validacaoUrl.js`), Swagger description (`documentacao.js`), startup (`servidor.js`).
- `dados/`: data access, with Node's built-in SQLite (`node:sqlite`); the database `encurtador.db` is created here.
- `frontend/`: static web page served by the backend (`index.html`, `principal.js`, `api.js`, `estilo.css`, `icone.svg`) and the "link not found" page (`nao-encontrado.html`).
- `testes/`: automated tests (Node's test runner).
