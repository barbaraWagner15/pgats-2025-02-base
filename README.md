# API Checkout Rest e GraphQL

Se você é aluno da Pós-Graduação em Automação de Testes de Software (Turma 2), faça um fork desse repositório e boa sorte em seu trabalho de conclusão da disciplina.

## Instalação

```bash
npm install express jsonwebtoken swagger-ui-express apollo-server-express graphql
```

## Exemplos de chamadas

### REST

#### Registro de usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Novo Usuário","email":"novo@email.com","password":"senha123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"novo@email.com","password":"senha123"}'
```

#### Checkout (boleto)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":1,"quantity":2}],
		"freight": 20,
		"paymentMethod": "boleto"
	}'
```

#### Checkout (cartão de crédito)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":2,"quantity":1}],
		"freight": 15,
		"paymentMethod": "credit_card",
		"cardData": {
			"number": "4111111111111111",
			"name": "Nome do Titular",
			"expiry": "12/30",
			"cvv": "123"
		}
	}'
```

### GraphQL

#### Registro de usuário
Mutation:
```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    email
    name
  }
}

Variables:
{
  "name": "Julio",
  "email": "julio@abc.com",
  "password": "123456"
}
```

#### Login
Mutation:
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
  }
}

Variables:
{
  "email": "alice@email.com",
  "password": "123456"
}
```


#### Checkout (boleto)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {
  checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {
    freight
    items {
      productId
      quantity
    }
    paymentMethod
    userId
    valorFinal
  }
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "boleto"
}
```

#### Checkout (cartão de crédito)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation {
	checkout(
		items: [{productId: 2, quantity: 1}],
		freight: 15,
		paymentMethod: "credit_card",
		cardData: {
			number: "4111111111111111",
			name: "Nome do Titular",
			expiry: "12/30",
			cvv: "123"
		}
	) {
		valorFinal
		paymentMethod
		freight
		items { productId quantity }
	}
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "credit_card",
  "cardData": {
    "cvv": "123",
    "expiry": "10/04",
    "name": "Julio Costa",
    "number": "1234432112344321"
  }
}
```

#### Consulta de usuários
Query:
```graphql
query Users {
  users {
    email
    name
  }
}
```

## Como rodar

### REST
```bash
node rest/server.js
```
Acesse a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### GraphQL
```bash
node graphql/app.js
```
Acesse o playground GraphQL em [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Endpoints REST
- POST `/api/users/register` — Registro de usuário
- POST `/api/users/login` — Login (retorna token JWT)
- POST `/api/checkout` — Checkout (requer token JWT)

## Regras de Checkout
- Só pode fazer checkout com token JWT válido
- Informe lista de produtos, quantidades, valor do frete, método de pagamento e dados do cartão se necessário
- 5% de desconto no valor total se pagar com cartão
- Resposta do checkout contém valor final

## Banco de dados
- Usuários e produtos em memória (veja arquivos em `src/models`)

## Testes
- Para testes automatizados, importe o `app` de `rest/app.js` ou `graphql/app.js` sem o método `listen()`

## Documentação
- Swagger disponível em `/api-docs`
- Playground GraphQL disponível em `/graphql`


# Teste de Performance com k6

## Como rodar
-Para executar o teste de performance: k6 run test/k6/test/login.test.js 
-Para executar com dashboard web e exportar relatório HTML: K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIODO=100ms k6 run test/k6/test/login.test.js 

## Documentação
-Swagger disponível em: http://localhost:3000/api-docs/

## Conceitos Empregados

FAKER
O faker é uma biblioteca que gera dados fictícios (fake data) para testes e desenvolvimento, como nomes, e-mails, endereços, números de telefone, datas, textos, entre outros.
É muito usada para criar dados aleatórios e realistas em ambientes de teste.

Utilizei no projeto o faker, para gerar um e-mail aleatório. 
O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\helpers\random.email.helpers.js

Trecho do código:
import faker from "k6/x/faker"

export function randomEmail() {
    const timestamp = Date.now();
    return faker.internet.email(`user${timestamp}`);
}


THRESHOLDS
Thresholds são limites ou critérios de desempenho definidos em testes automatizados (como no K6) para determinar se um teste passou ou falhou.

No código as validações foram realizadas:
'p(90)<=500': 90% das requisições devem durar no máximo 500ms.
'p(95)<600': 95% das requisições devem durar menos de 600ms.

O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\test\login.test.js

Trecho do código:
export const options = {
  vus: 3,  
  duration: '90s',
  thresholds: {
   http\_req\_duration: \['p(90)<=500', 'p(95) < 600']
  }
};


GROUPS
Ajuda a ter grupos de ações.
Utilizei no projeto para agrupar a execução da função login(email, password) dentro de um bloco chamado "User Login" usando o recurso group do K6.
O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\test\login.test.js

Trecho do código:
  group('User Login', () => {
        **login(email, password);
    });


CHECKS
Checks são funções de validação usadas em testes automatizados (como no K6) para verificar se as respostas das requisições atendem a determinados critérios, como status code, conteúdo ou tempo de resposta.

No código, esses dois trechos usam a função check do K6 para validar se a resposta HTTP tem o status esperado:
O primeiro verifica se o status da resposta do registro de usuário é 201 (criado com sucesso).
O segundo verifica se o status da resposta do login de usuário é 200 (login bem-sucedido).
O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\helpers\login.helpers.js

Trecho do código:
  check(response, {
    'registerUser: status code is 201': (r) => r.status === 201
  });

  check(response, {
    'login: status code is 200': (r) => r.status === 200
  });


TOKEN DE AUTENTICAÇÃO
É uma “chave” temporária que comprova que o usuário está autenticado no sistema.

No código extrai a propriedade token do objeto retornado por response.json().
Se token não existir, atribui null como valor padrão.
Retorna o valor de token (ou null se não existir).
O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\helpers\login.helpers.js

Trecho do código:
 const { token = null } = response.json() || {};
 return token;


HELPERS
Helpers servem para organizar e centralizar funções utilitárias que podem ser usadas em várias partes do projeto.

No códido abaixo faz parte do helpers (config.base.helpers):
Retorna a URL base configurada via ambiente ou, se não houver, usa http://localhost:3000
O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\helpers\config.base.helpers.js

Trecho do código:
export function getBase() {
  return \_\_ENV.BASE\_URL || 'http://localhost:3000';
}


TRENDS
Trends são métricas no K6 usadas para registrar e acompanhar valores numéricos ao longo do tempo durante os testes, como duração de requisições, tempo de resposta, etc.
Elas permitem analisar a evolução e o comportamento dessas métricas nos relatórios de teste de carga.

No código, registra quanto tempo a requisição levou para ser concluída, permitindo analisar a performance dos logins nos relatórios do teste de carga.
O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\helpers\login.helpers.js

Trecho do código:
trendLogin.add(response.timings.duration);


VARIÁVEL DE AMBIENTE
No código, a variável de ambiente BASE\_URL serve para definir a URL base que será usada nos testes.
O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\helpers\config.base.helpers.js

Trecho do código:
export function getBase() {
  return \_\_ENV.BASE\_URL || 'http://localhost:3000';
}


REAPROVEITAMENTO DE RESPOSTA
Reaproveitamento de resposta é o ato de utilizar a mesma resposta de uma requisição (por exemplo, HTTP) em diferentes partes do código.

No código a resposta da requisição (response) é reaproveitada em diferentes etapas dentro da função, evitando múltiplas chamadas ou repetições.

O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\helpers\login.helpers.js

Trecho do código:
const response = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  trendLogin.add(response.timings.duration);

  check(response, {
    'login: status code is 200': (r) => r.status === 200
  });

 const { token = null } = response.json() || {};
 return token;


DATA-DRIVEN TESTING
No Data Driven Testing, os dados de teste (como email e password) são separados da lógica do teste e geralmente armazenados em arrays, arquivos ou bancos de dados.

No código abaixo, loginData contém diferentes conjuntos de dados, e cada usuário virtual (\_\_VU) pega um conjunto diferente para executar o teste.

O código abaixo está armazenado em: C:\projetosGit\7\pgats-2025-02-base\test\k6\test\login.test.js

Trecho do código:
const { email, password } = loginData\[\_\_VU - 1];