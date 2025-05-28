require('dotenv').config()
const express = require('express');
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')
const app = express();
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN })
const preference = new Preference(client);
const payment = new Payment(client);
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
            notification_url: 'https://1f62-2804-d56-290-3b00-24d3-43-d916-99c7.ngrok-free.app/webhook',
            back_urls: {
                success: 'https://5f74-2804-d56-290-3b00-24d3-43-d916-99c7.ngrok-free.app'
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
            notification_url: 'https://1f62-2804-d56-290-3b00-24d3-43-d916-99c7.ngrok-free.app/webhook',
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


app.listen(4000, console.log("Rodando na porta 4000"));