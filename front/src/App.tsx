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



// CHAT GPT
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [qrCode, setQrCode] = useState('');
  // const [checkoutUrl, setCheckoutUrl] = useState('');

  const createPreference = async () => {
    const res = await axios.post('http://localhost:4000/create_preference', {
      description: 'Camiseta branca',
      price: 35,
      quantity: 1
    });
    window.location.href = res.data.init_point; // Redireciona para Checkout Pro
  };

  const createPix = async () => {
    const res = await axios.post('http://localhost:4000/create_pix', {
      description: 'Camiseta branca',
      price: 35,
      email: 'cliente@test.com',
      cpf: '19119119100' // CPF válido de teste
    });
    setQrCode(res.data.qr_code_base64); // Exibe o QR Code PIX
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

