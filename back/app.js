require('dotenv').config()
const express = require('express');
const cors = require('cors')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')
const app = express();
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN })
const preference = new Preference(client);
const payment = new Payment(client);
const baseUrl = 'https://3b6a-2804-d56-2a0-d400-dd7d-94af-6e27-bbb7.ngrok-free.app'
app.use(cors());
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/webhook', (req, res) => {
    console.log('🔔 Webhook recebido!');
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));

    const payment = req.body;

    // Aqui você poderia:
    // - Consultar o status do pagamento na API do Mercado Pago usando payment.data.id
    // - Atualizar o status do pedido no seu banco de dados

    res.sendStatus(200); // Sempre responde 200 para dizer que recebeu
});


app.post('/create-preference', (req, res) => {
    const { title, quantity, unit_price } = req.body
    preference.create({
        body: {
            items: [
                {
                    title,
                    quantity,
                    unit_price,
                    currency_id: 'BRL'
                }
            ],
            notification_url: baseUrl+'/webhook',
            back_urls: {
                success: baseUrl
            },
            auto_return: "approved"
        }
    })
        .then((data) => {
            console.log("Data: ", data)
            res.json({ "init_point": data.init_point })
        })
        .catch((err) => {
            console.log("Erro: ", err)
            res.json(err)
        })
})

app.post('/create-pix', (req, res) => {
    const { transaction_amount, description, paymentMethodId, email, identificationType, number } = req.body
    payment.create({
        body: {
            transaction_amount: transaction_amount,
            description: description,
            payment_method_id: paymentMethodId,
            payer: {
                email: email,
                identification: {
                    type: identificationType,
                    number: number
                }
            },
            notification_url: baseUrl+'/webhook',
        },
        requestOptions: { idempotencyKey: uuidv4() }
    })
        .then((result) => {
            console.log("Data: ", result)
            const { qr_code_base64, qr_code } = result.point_of_interaction.transaction_data
            res.json({ qr_code_base64, qr_code })
        })
        .catch((error) => res.json(error));


})

app.post('/create-plan', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.mercadopago.com/preapproval_plan',
            {
                reason: 'Academia',
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    repetitions: 12,
                    transaction_amount: 70,
                    currency_id: 'BRL',
                    
                },
                back_url: baseUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );
        console.log("Response: ", response.data)
        res.json(response.data);
    } catch (error) {
        console.error("Erro ocorrido: ",error.response.data);
        res.status(500).send('Erro ao criar plano');
    }
});

app.post('/create-subscription', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.mercadopago.com/preapproval',
            {
                preapproval_plan_id: '2c93808497030fc701971ba69a5708df',  // ID do plano
                payer_email: 'test_user_2105246737@testuser.com',
                card_token_id: '5c954a350126f4b60d43a6b5243b310a',
                back_url: baseUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );
        console.log("Response subscription: ", response.data)
        res.json(response.data);
    } catch (error) {
        console.error("Erro ocorrido: ",error.response.data);
        res.status(500).send('Erro ao criar assinatura');
    }
});

app.post('/create-direct-subscription', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.mercadopago.com/preapproval',
            {
                reason: "Assinatura Anual",
                auto_recurring: {
                    frequency: 12,
                    frequency_type: "months",
                    transaction_amount: 200,
                    currency_id: "BRL",
                },
                payer_email: "test_user_2105246737@testuser.com",
                back_url: baseUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );
        console.log("Response direct subscription: ", response.data)
        res.json(response.data);
    } catch (error) {
        console.error("Erro ocorrido: ", error.response.data);
        res.status(500).send('Erro na assinatura direta');
    }
});


app.listen(4000, console.log("Rodando na porta 4000"));