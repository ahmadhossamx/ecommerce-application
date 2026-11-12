import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { items, clear, total } = useCart();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, qty: i.qty })),
        shippingAddress: { address, city, country },
      });
      setOrder(res.data);
      clear();
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Are you logged in?');
    }
  }

  if (order) {
    return (
      <div className="success">
        <h1>Order placed!</h1>
        <p>Order ID: {order._id}</p>
        <p>Total: ${order.total.toFixed(2)} — status: {order.status}</p>
        <p>This is a mock checkout — no payment was taken.</p>
        <Link to="/">Back to shop</Link>
      </div>
    );
  }
  if (items.length === 0) return <div><h1>Checkout</h1><p>Your cart is empty.</p></div>;
  return (
    <div>
      <h1>Checkout</h1>
      <p>Total: ${total.toFixed(2)}</p>
      <form className="form" onSubmit={submit}>
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" required />
        <button type="submit">Place order</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>You need to be logged in to place an order. <Link to="/login">Login</Link></p>
    </div>
  );
}
