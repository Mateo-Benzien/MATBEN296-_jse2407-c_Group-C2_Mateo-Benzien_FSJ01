export const fetchProducts = async (page = 1, query = '', category = '', sort = '') => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products?skip=${(page-1)*20}&limit=20&search=${query}&category=${category}&sort=${sort}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data;
};

export const fetchProductById = async (id) => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  const data = await response.json();
  return data;
};

export const fetchCategories = async () => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return data;
};
