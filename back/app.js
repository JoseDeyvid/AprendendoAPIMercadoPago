// const express = require("express")
// const cors = require('cors');
// const { Payment, MercadoPagoConfig, Order, Preference } = require('mercadopago');
// require('dotenv').config();
// const { v4: uuidv4 } = require('uuid');
// const app = express();
// app.use(cors({ origin: 'http://localhost:5173' }));
// app.use(express.json())
// const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });
// const payment = new Payment(client);
// const order = new Order(client);
// const preference = new Preference(client);

// const port = 3000;

// preference.create({
//     body: {
//         items: [
//             {
//                 title: 'Camiseta branca',
//                 quantity: 3,
//                 unit_price: 35,
//                 currency_id: 'BRL'
//             }
//         ],
//         back_urls: {
//             success: "https://5c16-2804-d56-2a0-d400-5b8-ea9f-c90f-8919.ngrok-free.app/cart",
//             failure: "https://5c16-2804-d56-2a0-d400-5b8-ea9f-c90f-8919.ngrok-free.app",
//             pending: "https://5c16-2804-d56-2a0-d400-5b8-ea9f-c90f-8919.ngrok-free.app/products"
//         },
//         "auto_return": "approved",
//     }
// })
//     .then(console.log)
//     .catch(console.log);

// app.get("/", (req, res) => {
//     res.send("Hello World!")
// })

// app.post("/pix", (req, res) => {
//     payment.create({
//         body: {
//             transaction_amount: req.body.transaction_amount,
//             description: req.body.description,
//             payment_method_id: req.body.paymentMethodId,
//             payer: {
//                 email: req.body.email,
//                 identification: {
//                     type: req.body.identificationType,
//                     number: req.body.number
//                 }
//             }
//         },
//         requestOptions: { idempotencyKey: uuidv4() }
//     })
//         .then((result) => res.json(result))
//         .catch((error) => res.json(error));

// })

// app.post("/credit", (req, res) => {
//     console.log("env: ", process.env.ACCESS_TOKEN)
//     console.log("Body: ", req.body)
//     payment.create({
//         body: {
//             token: req.body.token,
//             issuer_id: req.body.issuer_id,
//             payment_method_id: req.body.payment_method_id,
//             transaction_amount: req.body.transaction_amount,
//             installments: req.body.installments,
//             description: "descrição de teste",
//             payer: {
//                 email: req.body.payer.email,
//                 identification: {
//                     type: req.body.payer.identification.type,
//                     number: req.body.payer.identification.number
//                 }
//             }
//         },
//         requestOptions: { idempotencyKey: uuidv4() }
//     })
//         .then((result) => {
//             console.log("Result: ", result)
//             res.json(result)
//         })
//         .catch((error) => {
//             console.log("Error: ", error)
//             res.json(error)
//         });
// })

// app.listen(port, () => {
//     console.log("Server started now!")
// })


// // const  requestOptions = {
// // 'integratorId': 'INTEGRATOR_ID',
// // };


// CHAT GPT
import express from 'express';
import cors from 'cors';
import mercadopago from 'mercadopago';

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
    access_token: 'SEU_ACCESS_TOKEN' // Substitua pelo seu
});

// ================================
// 🔗 Checkout Pro (cartão, boleto, saldo)
// ================================
app.post('/create_preference', async (req, res) => {
    try {
        const { description, price, quantity } = req.body;

        const preference = {
            items: [
                {
                    title: description,
                    quantity: Number(quantity),
                    unit_price: Number(price),
                    currency_id: 'BRL'
                }
            ],
            back_urls: {
                success: "https://seu-site.com/success",
                failure: "https://seu-site.com/failure",
                pending: "https://seu-site.com/pending"
            },
            auto_return: 'approved'
        };

        const response = await mercadopago.preferences.create(preference);

        return res.json({ init_point: response.body.init_point });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ================================
// 🔗 Checkout Transparente — PIX
// ================================
app.post('/create_pix', async (req, res) => {
    try {
        const { description, price, email, cpf } = req.body;

        const payment_data = {
            transaction_amount: Number(price),
            description: description,
            payment_method_id: 'pix',
            payer: {
                email: email,
                first_name: 'Cliente',
                last_name: 'Test',
                identification: {
                    type: 'CPF',
                    number: cpf // CPF no formato: 00000000000
                }
            }
        };

        const payment = await mercadopago.payment.create(payment_data);

        const { qr_code, qr_code_base64 } = payment.response.point_of_interaction.transaction_data;

        return res.json({
            qr_code,
            qr_code_base64,
            payment_id: payment.response.id
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
