const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const checkoutService = require('../../../src/services/checkoutService');
const app = require('../../../rest/app');
const userService = require('../../../src/services/userService');

describe('Checkout Controller', () => {
    describe('POST /checkout', () => {
        beforeEach(async () => {
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'barbara@hotmail.com',
                    password: '123456'
                });
            token = respostaLogin.body.token;    
        });

        it('Realiza corretamente o checkout com sucesso informando a quantidade e o produto', async () => {
            const respostaFinal = await request(app)
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
            const checkout = sinon.stub(checkoutService, 'checkout');
            checkout.throws({ status: 401, message: 'Token inválido' });
            const respostaFinal = await request(app)
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

        it('Login com Falha de email', async () => {            
            const transferService = sinon.stub(userService, 'authenticate');
            transferService.throws(new Error('E-mail inválido'));            
            const respostaLogin1 = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'usuarioInvalido@email.com',
                    password: 'errado'
                });
            expect(respostaLogin1.status).to.equal(500);
            expect(respostaLogin1.body).to.have.property('error', 'E-mail inválido')
             })
        
        afterEach(() => {
        sinon.restore();        
        });

    });
});