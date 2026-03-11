import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getAuthorizationConfig = (isMultipart = false) => {
  const token = localStorage.getItem('token'); // Token local storage irundhu eduthukom
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  // Multipart form data ku contentType set panna koodadhu
  if (!isMultipart) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
};

const ProductService = {
  
  getProducts: async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(`${API_URL}/products`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID - Public API (token optional)
  async getProductById(id) {
    try {
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(
        `${API_URL}/products/${id}`, 
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  },


   
  filterProducts: async (filters) => {
    try {
     
      const queryParams = new URLSearchParams();
      
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.inStock) queryParams.append('inStock', filters.inStock);
      
      const response = await axios.get(`${API_URL}/filter?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Create new product - Private API (token required)
  async createProduct(formData) {
    try {
      const response = await axios.post(
        `${API_URL}/products`,
        formData,
        getAuthorizationConfig(true) // Multipart = true
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product - Private API (token required)
  async updateProduct(id, formData) {
    try {
      const response = await axios.put(
        `${API_URL}/products/${id}`,
        formData,
        getAuthorizationConfig(true) // Multipart = true
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product - Private API (token required)
  async deleteProduct(id) {
    try {
      const response = await axios.delete(
        `${API_URL}/products/${id}`, 
        getAuthorizationConfig() // Multipart = false
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Upload multiple images (separate API irundhu)
  async uploadImages(productId, formData) {
    try {
      const response = await axios.post(
        `${API_URL}/products/${productId}/images`,
        formData,
        getAuthorizationConfig(true)
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },

  // Delete image (separate API irundhu)
  async deleteImage(productId, imageName) {
    try {
      const response = await axios.delete(
        `${API_URL}/products/${productId}/images/${imageName}`,
        getAuthorizationConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }
};

export default ProductService;