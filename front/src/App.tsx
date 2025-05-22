import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import ProductsProvider from './contexts/ProductsContext'

function App() {

  return (
    <div>
      <ProductsProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </ProductsProvider>
    </div>
  )
}

export default App
