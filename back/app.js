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
            back_urls: {
                success: 'https://6fec-2804-d56-2a0-d400-b1bc-5f35-103-3f9f.ngrok-free.app'
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
            }
        },
        requestOptions: { idempotencyKey: uuidv4() }
    })
        // .then((result) => res.json({ "qr_code_base64": result.qr_code_base64, "qr_code": result.qr_code }))
        .then((result) => {
            console.log("Data: ", result)
            const { qr_code_base64, qr_code } = result.point_of_interaction.transaction_data
            res.json({ qr_code_base64, qr_code })
        })
        .catch((error) => res.json(error));


})


app.listen(4000, console.log("Rodando na porta 4000"));