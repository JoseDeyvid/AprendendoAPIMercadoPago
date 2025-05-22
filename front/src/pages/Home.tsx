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

import { initMercadoPago, CardPayment, } from '@mercadopago/sdk-react';
import type { ICardPaymentFormData, ICardPaymentBrickPayer } from '@mercadopago/sdk-react/esm/bricks/cardPayment/type';
import axios from 'axios';
initMercadoPago(import.meta.env.VITE_PUBLIC_KEY);

const Home = () => {

    const handlePayment = async (param: ICardPaymentFormData<ICardPaymentBrickPayer>) => {
        console.log("Chegando aqui!")
        try {
            await axios.post("http://localhost:3000/credit", param)
        } catch (error) {
            console.log("Erro: ", error)
        }

    }

    return (
        <CardPayment
            initialization={{ amount: 2000 }}
            onSubmit={async (param) => handlePayment(param)}
        />
    );
}

export default Home;