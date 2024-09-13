import { fetchProductById } from '../../api/api';

const ProductDetail = ({ product, error }) => {
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-detail-container">
      <div className="product-image">
        <img src={product.images[0]} alt={product.title} />
      </div>
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="category">{product.category}</p>
        <p className="description">{product.description}</p>
        {product.tags && <p className="tags">Tags: {product.tags.join(', ')}</p>}
        <p className="rating">Rating: {product.rating} / 5</p>
        <p className="stock">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>

        <div className="reviews">
          <h2>Reviews</h2>
          {product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="review">
                <p><strong>{review.name}</strong> ({review.date})</p>
                <p>Rating: {review.rating}</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .product-detail-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          margin: auto;
        }

        .product-image {
          flex: 1;
          max-width: 600px;
        }

        .product-image img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .product-info {
          flex: 2;
          max-width: 600px;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #333;
        }

        .price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #e74c3c;
          margin: 10px 0;
        }

        .category {
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .description {
          font-size: 1rem;
          margin: 20px 0;
          color: #555;
        }

        .tags {
          font-size: 1rem;
          margin: 10px 0;
        }

        .rating {
          font-size: 1rem;
          margin: 10px 0;
        }

        .stock {
          font-size: 1.1rem;
          font-weight: bold;
          color: ${product.stock > 0 ? '#27ae60' : '#e74c3c'};
          margin: 10px 0;
        }

        .reviews {
          margin-top: 20px;
        }

        .review {
          border-top: 1px solid #e1e1e1;
          padding-top: 10px;
          margin-top: 10px;
        }

        .error {
          color: #e74c3c;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .product-detail-container {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const product = await fetchProductById(id);
    return { props: { product } };
  } catch (error) {
    return { props: { error: "Failed to load product" } };
  }
}

export default ProductDetail;
