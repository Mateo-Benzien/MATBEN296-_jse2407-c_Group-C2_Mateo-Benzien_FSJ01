import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProducts, fetchCategories } from '../api/api';
import ProductList from '../components/ProductList';

export default function ProductListing({ initialProducts, initialCategories, initialPage }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(initialPage || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('asc'); // Default sort option
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await fetchProducts(page, searchQuery, selectedCategory, sortOption);
        setProducts(productData);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, searchQuery, selectedCategory, sortOption]); // Fetch products when any of these change

  useEffect(() => {
    // Update URL query parameters based on current state
    const query = { page, search: searchQuery, category: selectedCategory, sort: sortOption };
    router.push({ pathname: '/', query }, undefined, { shallow: true });
  }, [page, searchQuery, selectedCategory, sortOption]); // Update URL when these values change

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setPage(1); // Reset to first page on sort change
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage = Math.max(page - 1, 1);
    setPage(prevPage);
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
      <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
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
        {categories.map((category) => (
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>
      <select value={sortOption} onChange={handleSortChange} className="sort-select">
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
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
        .search-input,
        .category-select,
        .sort-select {
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
    const selectedCategory = context.query.category || '';
    const sortOption = context.query.sort || 'asc'; // Default sort to ascending
    
    const products = await fetchProducts(page, searchQuery, selectedCategory, sortOption);
    const categories = await fetchCategories(); // Fetch categories for the filter

    return { props: { initialProducts: products, initialCategories: categories, initialPage: page } };
  } catch (error) {
    return { props: { error: "Failed to load products" } };
  }
}
