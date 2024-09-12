import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProducts } from '../api/api';
import ProductList from '../components/ProductList';

export default function ProductListing({ initialProducts, initialPage }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(initialPage || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (page !== initialPage) {
      const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          const productData = await fetchProducts(page);
          setProducts(productData);
        } catch (err) {
          setError("Failed to load products");
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }
  }, [page]);

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    router.push(`/?page=${nextPage}`, undefined, { shallow: true });
  };

  const handlePrevPage = () => {
    const prevPage = Math.max(page - 1, 1);
    setPage(prevPage);
    router.push(`/?page=${prevPage}`, undefined, { shallow: true });
  };

  return (
    <div>
      <h1>Products</h1>
      {error ? (
        <div>{error}</div>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="product-grid">
            <ProductList products={products} />
          </div>
          <div>
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <button onClick={handleNextPage}>
              Next
            </button>
          </div>
        </>
      )}
      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const page = 1;
    const products = await fetchProducts(page);
    return { props: { initialProducts: products, initialPage: page } };
  } catch (error) {
    return { props: { error: "Failed to load products" } };
  }
}
