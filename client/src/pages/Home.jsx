import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { demoProducts } from '../data/demoProducts.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { search: search || undefined, category: category || undefined } })
      .then((res) => setProducts(res.data))
      .catch(() => {
        // No backend (e.g. GitHub Pages demo): fall back to local demo products.
        const filtered = demoProducts.filter(
          (p) =>
            (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
            (!category || p.category === category)
        );
        setProducts(filtered);
        setError('Demo mode — showing sample products, no server connected.');
      })
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div>
      <h1>Shop</h1>
      <div className="filters">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home</option>
        </select>
      </div>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {products.map((p) => (
          <div key={p._id} className="card">
            {p.image && <img src={p.image} alt={p.name} />}
            <div className="card-body">
              <h3><Link to={`/product/${p._id}`}>{p.name}</Link></h3>
              <p>{p.category} · ★ {p.rating}</p>
              <p className="price">${p.price.toFixed(2)}</p>
              <button onClick={() => add(p)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
      {!loading && products.length === 0 && <p>No products found.</p>}
    </div>
  );
}
