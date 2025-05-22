import React from 'react'
import { useProducts } from '../contexts/ProductsContext'
import Card from '../components/Card';

const Cart = () => {
    const { products } = useProducts();
    const productsInCart = products.filter((p) => p.selected ? p : "")
    return (
        <div>
            <h1>Carrinho</h1>
            <ul>
                {productsInCart.map((product) => (
                    <Card key={product.id} product={product} products={products} />
                ))}
            </ul>

            <button>Comprar</button>
        </div>
    )
}

export default Cart