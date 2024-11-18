# payment-api

#### <b> Postgres (`Somente Desenvolvimento`)</b>

<ol>
<li>Setup local</li>

```bash
$ docker run -p 5432:5432 -v /tmp/database:/var/lib/postgresql/data -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=payment-api-tech-challenge -d postgres:16-alpine
```

<li>Migrate </li>

Para executar o migration é preciso ter a conexão com o banco em forma de URL em uma variável de ambiente, conforme o exemplo abaixo:
```bash
$ export DATABASE_URL=postgres://payment-api-tech-challenge:1234@0.0.0.0:5432/postgres
$ npm run migrate up
```