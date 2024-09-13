import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(250px, 1fr)); /* Allow columns to be wider */
          gap: 90px; /* Increased space between cards */
          padding: 60px; /* Padding around the grid */
        }

        @media (max-width: 1200px) {
          .product-grid {
            grid-template-columns: repeat(3, minmax(250px, 1fr)); /* 3 columns on medium screens */
            gap: 50px; /* Adjust spacing for medium screens */
          }
        }

        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: repeat(2, minmax(250px, 1fr)); /* 2 columns on smaller screens */
            gap: 40px; /* Adjust spacing for smaller screens */
          }
        }

        @media (max-width: 600px) {
          .product-grid {
            grid-template-columns: 1fr; /* 1 column on mobile */
            gap: 30px; /* Adjust spacing for mobile screens */
          }
        }
      `}</style>
    </div>
  );
};

export default ProductList;
