const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

/**
 * Observar se não existir o arquivo .env, não vai funcjonar o teste
 */

describe('Checkout', () => {
    describe('POST /checkout', () => {
        
        beforeEach(async () => {
            const respostaLogin = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/users/login')
                .send({
                    query: `mutation {login(email: "barbara@hotmail.com", password: "123456") {token}}`
                });
            token = respostaLogin.body.data.login.token;    
        });

        it('Calcula o valor final informando a quantidade, frete e produto', async () => {
            const respostaFinal = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `mutation {checkout(items: [{ productId: 1, quantity: 2 }],freight: 10, paymentMethod: "boleto") {valorFinal}}`
                });
                    
            expect(respostaFinal.status).to.equal(200);
            expect(respostaFinal.body.data.checkout.valorFinal).to.equal(210)
        });
    });
});