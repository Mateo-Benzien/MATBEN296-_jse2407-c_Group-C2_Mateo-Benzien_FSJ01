import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProducts } from '../api/api';
import ProductList from '../components/ProductList';

export default function ProductListing({ initialProducts, initialPage }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(initialPage || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await fetchProducts(page, searchQuery);
        setProducts(productData);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
    router.push(`/?page=1&search=${event.target.value}`, undefined, { shallow: true });
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    router.push(`/?page=${nextPage}&search=${searchQuery}`, undefined, { shallow: true });
  };

  const handlePrevPage = () => {
    const prevPage = Math.max(page - 1, 1);
    setPage(prevPage);
    router.push(`/?page=${prevPage}&search=${searchQuery}`, undefined, { shallow: true });
  };

  return (
    <div className="container">
      <h1 className="title">Our Products</h1>
      <input 
        type="text" 
        value={searchQuery} 
        onChange={handleSearch} 
        placeholder="Search for products..." 
        className="search-input" 
      />
      {error ? (
        <div className="error-message">{error}</div>
      ) : loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <>
          <div className="product-grid">
            <ProductList products={products} />
          </div>
          <div className="pagination">
            <button className="btn" onClick={handlePrevPage} disabled={page === 1}>
              &larr; Previous
            </button>
            <span className="page-number">Page {page}</span>
            <button className="btn" onClick={handleNextPage}>
              Next &rarr;
            </button>
          </div>
        </>
      )}
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .title {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2.5rem;
          font-weight: bold;
          color: #333;
        }
        .search-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }
        .pagination {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .btn {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          margin: 0 10px;
          transition: background-color 0.3s ease;
        }
        .btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .btn:hover:not(:disabled) {
          background-color: #005bb5;
        }
        .page-number {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .loading-message,
        .error-message {
          text-align: center;
          margin-top: 50px;
          font-size: 1.5rem;
        }

        @media (max-width: 1200px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const page = parseInt(context.query.page) || 1;
    const searchQuery = context.query.search || '';
    const products = await fetchProducts(page, searchQuery);
    return { props: { initialProducts: products, initialPage: page } };
  } catch (error) {
    return { props: { error: "Failed to load products" } };
  }
}
