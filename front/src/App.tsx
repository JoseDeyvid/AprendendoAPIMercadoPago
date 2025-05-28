// import './App.css'
// import Navbar from './components/Navbar'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// import Cart from './pages/Cart'
// import ProductsProvider from './contexts/ProductsContext'
// import Products from './pages/Products'

// function App() {

//   return (
//     <div>
//       <ProductsProvider>
//         <BrowserRouter>
//           <Navbar />
//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/cart' element={<Cart />} />
//             <Route path='/products' element={<Products />} />
//           </Routes>
//         </BrowserRouter>
//       </ProductsProvider>
//     </div>
//   )
// }

// export default App



import { useState } from 'react';
import axios from 'axios';
// import { initMercadoPago } from '@mercadopago/sdk-react';
// initMercadoPago(import.meta.env.VITE_PUBLIC_KEY)
function App() {
  const [qrCode, setQrCode] = useState('');
  const createPreference = async () => {
    const res = await axios.post('http://localhost:4000/create-preference', {
      title: 'Camiseta branca',
      unit_price: 35,
      quantity: 2
    });
    window.location.href = res.data.init_point;
  };

  const createPix = async () => {
    const res = await axios.post('http://localhost:4000/create-pix', {
      transaction_amount: 200,
      description: "Descrição do produto",
      paymentMethodId: "pix",
      email: "email@test.com",
      identificationType: "CPF",
      number: "12345678909"
    });
    console.log(res.data)
    setQrCode(res.data.qr_code_base64);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Escolha a forma de pagamento</h1>

      <button onClick={createPreference}>Pagar com Mercado Pago (Cartão, Boleto, Saldo)</button>

      <br /><br />

      <button onClick={createPix}>Pagar com PIX</button>

      {qrCode && (
        <div>
          <h3>Escaneie o QR Code para pagar com PIX:</h3>
          <img src={`data:image/png;base64,${qrCode}`} alt="QR Code PIX" />
        </div>
      )}
    </div>
  );
}

export default App;

