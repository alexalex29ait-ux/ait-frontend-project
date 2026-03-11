
import productServices from '../../services/productService';
import {
  setLoading,
  setProducts,
  setProduct,
  addProduct,
  updateProduct,
  removeProduct,
  setError,
  resetSuccess,
  clearProduct,
  setFilters,
  applyFilters,
  resetFilters,
  setSort
} from '../slices/productSlice';
import {
  saveFiltersToSession,
  saveSortToSession,
  clearFilterSession
} from '../../utils/sessionStorage';


export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await productServices.getProducts();
    
    console.log("API Response in fetchProducts:", response);
    
 
    let productsData = [];
    
    if (response?.status === true && Array.isArray(response.data)) {
      productsData = response.data;  
    } else if (Array.isArray(response)) {
      productsData = response;     
    } else if (response?.data && Array.isArray(response.data)) {
      productsData = response.data;
    }
    
    console.log("Extracted products data:", productsData.length);
    
   
    dispatch(setProducts(productsData));
    
   
    dispatch(applyFilters());
    
    return { success: true, data: productsData };
    
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Error fetching products';
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};


export const fetchProductById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await productServices.getProductById(id);
    
    console.log("API Response in fetchProductById:", response);
    
    let productData = null;
    
    if (response?.data?._id) {
      productData = response.data;
    } else if (response?._id) {
      productData = response;
    } else if (response?.data?.data?._id) {
      productData = response.data.data;
    } else if (response?.data && typeof response.data === 'object') {
      productData = response.data;
    }
    
    if (productData) {
      dispatch(setProduct(productData));
      return { success: true, data: productData };
    } else {
      dispatch(setError('Product not found'));
      return { success: false, error: 'Product not found' };
    }
    
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Error fetching product';
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};


export const createNewProduct = (formData, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await productServices.createProduct(formData);
    
    console.log("API Response in createNewProduct:", response);
    
    let newProduct = null;
    
    if (response?.data?._id) {
      newProduct = response.data;
    } else if (response?._id) {
      newProduct = response;
    } else if (response?.data && typeof response.data === 'object') {
      newProduct = response.data;
    }
    
    if (newProduct) {
      dispatch(addProduct(newProduct));
      dispatch(applyFilters()); 
      
      alert(' Product created successfully!');
      if (navigate) navigate('/getproduct');
      return { success: true, data: newProduct };
    } else {
      throw new Error('Failed to create product - invalid response');
    }
    
  } catch (error) {
    console.error("Error in createNewProduct:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Error creating product';
    dispatch(setError(errorMessage));
    alert('❌ ' + errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};


export const updateExistingProduct = (id, formData, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await productServices.updateProduct(id, formData);
    
    console.log("API Response in updateExistingProduct:", response);
    
    let updatedProduct = null;
    
    if (response?.data?._id) {
      updatedProduct = response.data;
    } else if (response?._id) {
      updatedProduct = response;
    } else if (response?.data && typeof response.data === 'object') {
      updatedProduct = response.data;
    }
    
    if (updatedProduct) {
      dispatch(updateProduct(updatedProduct));
      dispatch(applyFilters()); 
      
      alert('✅ Product updated successfully!');
      if (navigate) navigate('/getproduct');
      return { success: true, data: updatedProduct };
    } else {
      throw new Error('Failed to update product - invalid response');
    }
    
  } catch (error) {
    console.error("Error in updateExistingProduct:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Error updating product';
    dispatch(setError(errorMessage));
    alert('❌ ' + errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};


export const deleteExistingProduct = (id) => async (dispatch) => {
  try {
    if (!window.confirm(' Are you sure you want to delete this product?')) {
      return { success: false, cancelled: true };
    }
    
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    await productServices.deleteProduct(id);
    
    dispatch(removeProduct(id));
    dispatch(applyFilters()); 
    
    alert('✅ Product deleted successfully!');
    return { success: true };
    
  } catch (error) {
    console.error("Error in deleteExistingProduct:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Error deleting product';
    dispatch(setError(errorMessage));
    alert('❌ ' + errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};




export const updateFilters = (filters) => async (dispatch) => {

  const cleanedFilters = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.toString().trim() !== '' && value !== 'null' && value !== 'undefined') {
      cleanedFilters[key] = value;
    }
  });
  
  console.log(" Updating filters:", cleanedFilters);
  

  saveFiltersToSession(cleanedFilters);
  

  dispatch(setFilters(cleanedFilters));
  
 
  dispatch(applyFilters());
  
  return { success: true };
};


export const updateSort = (sort) => async (dispatch) => {
  console.log(" Updating sort:", sort);
  
 
  saveSortToSession(sort);
  
 
  dispatch(setSort(sort));
  
  
  dispatch(applyFilters());
  
  return { success: true };
};


export const resetAllFilters = () => async (dispatch) => {
  console.log(" Resetting all filters");
  

  clearFilterSession();
  
 
  dispatch(resetFilters());
  
  return { success: true };
};


export const filterProducts = (filters) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    
    saveFiltersToSession(filters);
    
    
    const response = await productServices.filterProducts(filters);
    
    console.log("API Response in filterProducts:", response);
    
    let productsData = [];
    
    if (response?.data && Array.isArray(response.data)) {
      productsData = response.data;
    } else if (Array.isArray(response)) {
      productsData = response;
    } else if (response?.status === true && Array.isArray(response.data)) {
      productsData = response.data;
    }
    
    dispatch(setProducts(productsData));
    dispatch(setFilters(filters));
    
    return { success: true, data: productsData };
    
  } catch (error) {
    console.error("Error in filterProducts:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to filter products';
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};




export const resetProductSuccess = () => (dispatch) => {
  dispatch(resetSuccess());
};


export const clearCurrentProduct = () => (dispatch) => {
  dispatch(clearProduct());
};


export const clearProductError = () => (dispatch) => {
  dispatch(setError(null));
};


export const refreshProducts = () => async (dispatch) => {
  await dispatch(fetchProducts());
  dispatch(applyFilters());
};


export const fetchWithCurrentFilters = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    
    const state = getState();
    const { filters } = state.products;
    

    const hasActiveFilters = Object.values(filters).some(value => value && value !== '');
    
    let response;
    if (hasActiveFilters) {
      response = await productServices.filterProducts(filters);
    } else {
      response = await productServices.getAllProducts();
    }
    
    let productsData = [];
    if (response?.data && Array.isArray(response.data)) {
      productsData = response.data;
    } else if (Array.isArray(response)) {
      productsData = response;
    } else if (response?.status === true && Array.isArray(response.data)) {
      productsData = response.data;
    }
    
    dispatch(setProducts(productsData));
    return { success: true, data: productsData };
    
  } catch (error) {
    console.error("Error in fetchWithCurrentFilters:", error);
    dispatch(setError(error.message || 'Failed to fetch products'));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};  