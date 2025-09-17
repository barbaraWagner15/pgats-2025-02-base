const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

/**
 * Observar se não existir o arquivo .env, não vai funcjonar o teste
 */

describe('Checkout', () => {
    describe('POST /checkout', () => {

        beforeEach(async () => {
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/api/users/login')
                .send({
                    email: 'barbara@hotmail.com',
                    password: '123456'
                });
            token = respostaLogin.body.token;    
        });

        it('Realiza corretamente o checkout com sucesso informando a quantidade e o produto', async () => {
            const respostaFinal = await request(process.env.BASE_URL_REST)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send(
                    {items: [
                        {
                        productId: 2,
                        quantity: 1
                        }
                    ],
                    freight: 0,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "string",
                        name: "string",
                        expiry: "string",
                        cvv: "string"
                    }
                });            
            expect(respostaFinal.status).to.equal(200)
        });

         it('Ocorre um erro se o token não é informado', async () => {
            const respostaFinal = await request(process.env.BASE_URL_REST)
                .post('/api/checkout')
                .send(
                    {items: [
                        {
                        productId: 0,
                        quantity: 1
                        }
                    ],
                    freight: 0,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "string",
                        name: "string",
                        expiry: "string",
                        cvv: "string"
                    }
                });
            expect(respostaFinal.status).to.equal(401);
            expect(respostaFinal.body).to.have.property('error', 'Token inválido')
        });
        
        it('Retorna um erro se as credenciais forem invalidas', async () => {
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/api/users/login')
                .send({
                    email: 'naoexiste@email.com',
                    password: 'errado'
                });
            expect(respostaLogin.status).to.equal(401);
            expect(respostaLogin.body).to.have.property('error', 'Credenciais inválidas')   
        });
    });
});