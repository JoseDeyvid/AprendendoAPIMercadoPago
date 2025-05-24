// import Card from '../components/Card';
// import { useProducts } from '../contexts/ProductsContext';


// const Home = () => {
//     const { products, setProducts } = useProducts();
//     return (
//         <div>
//             <h1>Produtos</h1>
//             <ul>
//                 {products.map((product) => (
//                     <Card key={product.id} product={product} products={products} setProducts={setProducts} />
//                 ))}
//             </ul>
//         </div>
//     )
// }

// export default Home

import { initMercadoPago, CardPayment, Wallet, } from '@mercadopago/sdk-react';
import type { ICardPaymentFormData, ICardPaymentBrickPayer } from '@mercadopago/sdk-react/esm/bricks/cardPayment/type';
import axios from 'axios';
initMercadoPago(import.meta.env.VITE_PUBLIC_KEY);

const Home = () => {

    const handlePayment = async (param: ICardPaymentFormData<ICardPaymentBrickPayer>) => {
        console.log("env: ", import.meta.env.VITE_PUBLIC_KEY)
        try {
            await axios.post("http://localhost:3000/credit", param)
        } catch (error) {
            console.log("Erro: ", error)
        }

    }

    return (
        <>
            <CardPayment
                initialization={{ amount: 20.00 }}
                onSubmit={async (param) => handlePayment(param)}
            />
            <Wallet initialization={{ preferenceId: '2449707344-9cde95df-8400-4082-8b51-4f794018d2cf' }} />
        </>
    );
}

export default Home;