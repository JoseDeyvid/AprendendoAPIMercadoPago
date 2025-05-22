import type { Product } from "../contexts/ProductsContext"
import "./Card.css"

type Props = {
  product: Product,
  products: Product[]
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>,
}

const Card = ({ product, products, setProducts }: Props) => {

  const handleToggleSelected = () => {
    const newProducts = products.map((p) => p.id === product.id ? { ...p, selected: !p.selected } : p)
    if (setProducts)
      setProducts(newProducts);
  }

  return (
    <div className={`card ${product.selected ? "selected" : ""}`} onClick={handleToggleSelected}>
      <h3>{product.name}</h3>
      <h4>R$ {product.price.toFixed(2)}</h4>
    </div>
  )
}

export default Card