import { fetchProductById } from '../../api/api';

const ProductDetail = ({ product, error }) => {
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.images[0]} alt={product.title} />
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <p>Category: {product.category}</p>
      {product.tags && <p>Tags: {product.tags.join(', ')}</p>}
      <p>Rating: {product.rating} / 5</p>
      <p>Stock: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>

      <h2>Reviews</h2>
      {product.reviews.length > 0 ? (
        product.reviews.map((review) => (
          <div key={review.id}>
            <p><strong>{review.name}</strong> ({review.date})</p>
            <p>Rating: {review.rating}</p>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet</p>
      )}

      <style jsx>{`
        img {
          max-width: 100%;
          height: auto;
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
