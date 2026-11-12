import { Link, Route, Routes } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const token = localStorage.getItem('token');
  return (
    <div>
      <header className="header">
        <Link to="/" className="logo">Shop</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart ({count})</Link>
          {token ? <span className="nav-user">Signed in</span> : <Link to="/login">Login</Link>}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}
