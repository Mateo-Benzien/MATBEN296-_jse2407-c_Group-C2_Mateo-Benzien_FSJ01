import Link from 'next/link';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`}>
        <img src={product.images[0]} alt={product.title} />
        <h2>{product.title}</h2>
        <p>{product.price}</p>
        <p>{product.category}</p>
      </Link>
      <style jsx>{`
        .product-card {
          border: 1px solid #ddd;
          padding: 20px;
          text-align: center;
          transition: transform 0.2s;
        }
        .product-card:hover {
          transform: scale(1.05);
        }
        .product-card img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
