const express = require("express")
const { Payment, MercadoPagoConfig } = require('mercadopago');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json())
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });
const payment = new Payment(client);

const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/pix", (req, res) => {
    payment.create({
        body: {
            transaction_amount: req.body.transaction_amount,
            description: req.body.description,
            payment_method_id: req.body.paymentMethodId,
            payer: {
                email: req.body.email,
                identification: {
                    type: req.body.identificationType,
                    number: req.body.number
                }
            }
        },
        requestOptions: { idempotencyKey: uuidv4() }
    })
        .then((result) => res.json(result))
        .catch((error) => res.json(error));

})

app.post("/credit", (req, res) => {
    payment.create({
        body: {
            transaction_amount: req.body.transaction_amount,
            token: req.body.token,
            description: req.body.description,
            installments: req.body.installments,
            payment_method_id: req.body.paymentMethodId,
            issuer_id: req.body.issuer,
            payer: {
                email: req.body.email,
                identification: {
                    type: req.body.identificationType,
                    number: req.body.number
                }
            }
        },
        requestOptions: { idempotencyKey: '<SOME_UNIQUE_VALUE>' }
    })
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
})

app.listen(port, () => {
    console.log("Server started now!")
})


// const  requestOptions = {
// 'integratorId': 'INTEGRATOR_ID',
// };
