// src/pages/index.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProducts } from '../api/api';
import ProductList from '../components/ProductList';

export default function ProductListing({ initialProducts, initialPage }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(initialPage || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { search = '', category = '', sortBy = 'price', sortOrder = 'asc', page = 1 } = router.query;
    setSearchQuery(search);
    setCategory(category);
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    setPage(Number(page));
  }, [router.query]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await fetchProducts(page, searchQuery, category, sortBy, sortOrder);
        setProducts(productData);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, searchQuery, category, sortBy, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateUrl();
  };

  const updateUrl = () => {
    router.push({
      pathname: '/',
      query: {
        search: searchQuery,
        category: category,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: 1
      },
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    updateUrl();
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
    updateUrl();
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
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
          <option value="">All Categories</option>
          <option value="kitchen-accessories">kitchen-accessories</option>
          <option value="groceries">groceries</option>
          <option value="sports-accessories">sports-accessories</option>
          <option value="beauty">beauty</option>
          <option value="skin-care">skin-care</option>
          <option value="mobile-accessories">mobile-accessories</option>
          <option value="home-decoration">home-decoration</option>
          <option value="sunglasses">sunglasses</option>
          <option value="womens-shoes">womens-shoes</option>
          <option value="mens-shirts">mens-shirts</option>
          <option value="tops">tops</option>
          <option value="womens-jewellery">womens-jewellery</option>
          <option value="womens-bags">womens-bags</option>
          <option value="fragrances">fragrances</option>
          <option value="smartphones">smartphones</option>
          <option value="furniture">Furniture</option>
        </select>
        <select value={sortBy} onChange={handleSortChange} className="sort-select">
          <option value="price">Price</option>
          <option value="title">Title</option>
        </select>
        <select value={sortOrder} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
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
          margin: auto;
          padding: 20px;
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          gap: 10px;
        }

        .search-input {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          flex: 1;
        }

        .category-select,
        .sort-select {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .search-button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .search-button:hover {
          background-color: #005bb5;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .btn {
          padding: 10px 15px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 0 10px;
        }

        .btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #e74c3c;
          text-align: center;
        }

        .loading-message {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { page = 1, search = '', category = '', sortBy = 'price', sortOrder = 'asc' } = query;
  try {
    const products = await fetchProducts(page, search, category, sortBy, sortOrder);
    return { props: { initialProducts: products, initialPage: Number(page) } };
  } catch (error) {
    return { props: { error: "Failed to load products" } };
  }
}
