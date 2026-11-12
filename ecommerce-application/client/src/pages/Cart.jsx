import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, remove, clear, total } = useCart();
  if (items.length === 0) return <div><h1>Cart</h1><p>Your cart is empty. <Link to="/">Continue shopping</Link></p></div>;
  return (
    <div>
      <h1>Cart</h1>
      {items.map((item) => (
        <div key={item.product} className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong> × {item.qty} — ${(item.price * item.qty).toFixed(2)}
          </div>
          <button className="secondary" onClick={() => remove(item.product)}>Remove</button>
        </div>
      ))}
      <p className="price">Total: ${total.toFixed(2)}</p>
      <button className="secondary" onClick={clear}>Clear cart</button>{' '}
      <Link to="/checkout"><button>Checkout</button></Link>
    </div>
  );
}
