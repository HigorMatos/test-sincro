# Inventário (Fullstack) — Teste Sincro

Aplicação fullstack para gerenciamento de **itens** e **categorias** de inventário.

- **Backend:** Java 21 + Spring Boot + JPA  
- **Frontend:** Next.js (TypeScript)  
- **Banco:** PostgreSQL (Docker)

---

## Pré-requisitos
- Docker + Docker Compose
- Java 21+
- Node.js 18+
- Git

---

## Como executar

### 1) Banco de dados (Docker)
Na raiz do repositório (onde está o `docker-compose.yml`):

Testes (API)

Os endpoints foram validados via Postman:

GET /api/categories

POST /api/categories

GET /api/items

POST /api/items

GET /api/items/{id}

PUT /api/items/{id}

DELETE /api/items/{id}

------

```bash
docker-compose up -d

Verifique se o container subiu:

docker ps

Para reset total do banco (apaga o volume):

docker-compose down -v
docker-compose up -d

Credenciais do Postgres (Docker):

Host: localhost

Porta: 5432

Database: inventario

User: postgres

Password: postgres

2) Backend (Spring Boot)

Em um terminal:

cd backend/inventario-api
./mvnw spring-boot:run

No Windows:

cd backend/inventario-api
mvnw.cmd spring-boot:run

API disponível em:

http://localhost:8080/api

3) Frontend (Next.js)

Em outro terminal:

cd frontend
npm install
npm run dev

Frontend disponível em:

http://localhost:3000/items

Endpoints principais
Categorias

GET /api/categories — listar

POST /api/categories — criar

Itens

GET /api/items — listar (filtro opcional: ?categoriaId=1)

POST /api/items — criar

GET /api/items/{id} — detalhar

PUT /api/items/{id} — atualizar

DELETE /api/items/{id} — remover

Configurações
Frontend (.env.local)

Crie o arquivo frontend/.env.local:

NEXT_PUBLIC_API_URL=http://localhost:8080/api

Após alterar o .env.local, reinicie o frontend.

Backend (application.yml)

O backend está configurado para acessar o Postgres via:

jdbc:postgresql://localhost:5432/inventario

Troubleshooting
Backend não conecta no banco

Confirme que o Postgres está rodando:

docker ps

Verifique logs do banco:

docker-compose logs -f db

Reset do banco (se necessário):

docker-compose down -v
docker-compose up -d
Frontend com ERR_CONNECTION_REFUSED

Confirme que o backend está rodando em http://localhost:8080/api

Confirme o NEXT_PUBLIC_API_URL em frontend/.env.local

Reinicie o frontend após alterações

Autor

Higor Matos


---

