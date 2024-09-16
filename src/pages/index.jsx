import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProducts } from '../api/api';
import ProductList from '../components/ProductList';

export default function ProductListing({ initialProducts, initialPage }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(initialPage || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await fetchProducts(page, searchQuery, category);
        setProducts(productData);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, searchQuery, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="container">
      <h1 className="title">Our Products</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search by title" 
          className="search-input" 
        />
        <select value={category} onChange={handleCategoryChange} className="category-select">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          {/* Add more categories as needed */}
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>

      {error ? (
        <div className="error-message">{error}</div>
      ) : loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <>
          <ProductList products={products} />
          <div className="pagination">
            <button className="btn" onClick={() => setPage(page - 1)} disabled={page === 1}>
              &larr; Previous
            </button>
            <span className="page-number">Page {page}</span>
            <button className="btn" onClick={() => setPage(page + 1)}>
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
        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .search-input, .category-select {
          padding: 10px;
          margin-right: 10px;
          font-size: 1rem;
        }
        .search-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
        }
        .search-button:hover {
          background-color: #005bb5;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .btn {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
        .btn:disabled {
          background-color: #ccc;
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
