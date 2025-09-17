const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

/**
 * Observar se não existir o arquivo .env, não vai funcjonar o teste
 */

const loginUser = require('../../../src/models/user');

describe('Register', () => {
    describe('POST /registro', () => {        
        beforeEach(async () => {
            const respostaLogin = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/users/login')
                .send({
                    query: `mutation {login(email: "barbara@hotmail.com", password: "123456") {token}}`
                });
            token = respostaLogin.body.data.login.token;    
        });

        it('Retorna um erro se o e-mail já for cadastrado e tentamos cadastrar novamente', async () => {
            const respostaFinal = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/register')
                .send({
                    query: `mutation {register(name: "Barbara", email: "barbara@hotmail.com", password: "123456") {name email}}`
                });                    
            expect(respostaFinal.status).to.equal(200);
            expect(respostaFinal.body.errors[0].message).to.equal("Email já cadastrado");
        });

        it('Retorna um erro se as credenciais forem invalidas', async () => {
            const respostaLoginTeste = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/users/login')
                .send({
                    query: `mutation {login(email: "naoexiste@email.com", password: "errado") {token}}`
                });                    
            expect(respostaLoginTeste.status).to.equal(200);
            expect(respostaLoginTeste.body.errors[0].message).to.equal("Credenciais inválidas");
        });     
    });
});