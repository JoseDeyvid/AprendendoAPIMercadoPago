import "./Navbar.css"
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <ul className="navbar">
      <li><Link to={"products"}>Produtos</Link></li>
      <li><Link to={"cart"}>Carrinho</Link></li>
    </ul>
  )
}

export default Navbar