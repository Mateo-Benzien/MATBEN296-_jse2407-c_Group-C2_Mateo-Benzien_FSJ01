// src/components/ProductCard.jsx
import Link from 'next/link';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`}>
        <div className="product-image-container">
          <img src={product.images[0]} alt={product.title} />
        </div>
        <h2>{product.title}</h2>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-category">{product.category}</p>
      </Link>
      <style jsx>{`
        .product-card {
          background-color: #fff;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 40px;
          text-align: center;
          max-width: 320px;
          width: 100%;
        }

        .product-card:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .product-image-container {
          width: 100%;
          height: 300px;
          overflow: hidden;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .product-image-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .product-image-container:hover img {
          transform: scale(1.1);
        }

        h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 10px 0;
          color: #333;
        }

        .product-price {
          font-size: 1.2rem;
          font-weight: bold;
          color: #27ae60;
          margin-bottom: 10px;
        }

        .product-category {
          font-size: 0.9rem;
          color: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
