import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(() => setError('Product not found.'));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Loading…</p>;
  return (
    <div className="detail">
      {product.image && <img src={product.image} alt={product.name} />}
      <div>
        <h1>{product.name}</h1>
        <p>{product.category} · ★ {product.rating}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <button disabled={product.stock === 0} onClick={() => add(product)}>Add to cart</button>
      </div>
    </div>
  );
}
