import Card from '../components/Card';
import { useProducts } from '../contexts/ProductsContext';

const Home = () => {
    const { products, setProducts } = useProducts();
    return (
        <div>
            <h1>Produtos</h1>
            <ul>
                {products.map((product) => (
                    <Card key={product.id} product={product} products={products} setProducts={setProducts} />
                ))}
            </ul>
        </div>
    )
}

export default Home