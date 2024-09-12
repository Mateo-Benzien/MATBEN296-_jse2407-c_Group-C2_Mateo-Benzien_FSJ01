export const fetchProducts = async (page = 1) => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products?skip=${(page-1)*20}&limit=20`);
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
