// src/redux/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { 
  loadFiltersFromSession, 
  loadSortFromSession,
  saveFiltersToSession,
  saveSortToSession 
} from '../../utils/sessionStorage';

// Load saved filters from session storage
const savedFilters = loadFiltersFromSession();
const savedSort = loadSortFromSession();

const initialState = {
  products: [],           
  filteredProducts: [],  
  product: null,          
  loading: false,
  error: null,
  success: false,
  filters: savedFilters || {  // Session la irunthu load pannu
    name: '',
    fromDate: '',
    toDate: '',
    inStock: '',
    minPrice: '',
    maxPrice: ''
  },
  sort: savedSort || {        // Session la irunthu load pannu
    field: 'createdAt',
    order: 'desc'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setProducts: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.products = action.payload;
        state.filteredProducts = action.payload;
      } else {
        state.products = [];
        state.filteredProducts = [];
      }
      state.loading = false;
      state.error = null;
      state.pagination.total = state.products.length;
    },
    
    setProduct: (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    addProduct: (state, action) => {
      if (Array.isArray(state.products)) {
        state.products.push(action.payload);
        state.filteredProducts.push(action.payload);
      }
      state.loading = false;
      state.success = true;
      state.error = null;
      state.pagination.total = state.products.length;
    },
    
    updateProduct: (state, action) => {
      if (Array.isArray(state.products)) {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
          
          const filteredIndex = state.filteredProducts.findIndex(p => p._id === action.payload._id);
          if (filteredIndex !== -1) {
            state.filteredProducts[filteredIndex] = action.payload;
          }
        }
      }
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    
    removeProduct: (state, action) => {
      if (Array.isArray(state.products)) {
        state.products = state.products.filter(p => p._id !== action.payload);
        state.filteredProducts = state.filteredProducts.filter(p => p._id !== action.payload);
      }
      state.loading = false;
      state.success = true;
      state.error = null;
      state.pagination.total = state.products.length;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.success = false;
    },
    
    resetSuccess: (state) => {
      state.success = false;
    },
    
    clearProduct: (state) => {
      state.product = null;
    },
    
    // FILTER ACTIONS
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Session la save pannu
      saveFiltersToSession(state.filters);
    },
    
    applyFilters: (state) => {
      let filtered = [...state.products];
      
      // Apply name filter
      if (state.filters.name && state.filters.name.trim() !== '') {
        filtered = filtered.filter(p => 
          p.name?.toLowerCase().includes(state.filters.name.toLowerCase().trim())
        );
      }
      
      // Apply from date filter
      if (state.filters.fromDate) {
        const fromDate = new Date(state.filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(p => {
          const productDate = new Date(p.createdAt);
          return productDate >= fromDate;
        });
      }
      
      // Apply to date filter
      if (state.filters.toDate) {
        const toDate = new Date(state.filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(p => {
          const productDate = new Date(p.createdAt);
          return productDate <= toDate;
        });
      }
      
      // Apply stock filter
      if (state.filters.inStock) {
        const inStock = state.filters.inStock === 'true';
        filtered = filtered.filter(p => {
          if (inStock) {
            return p.stock > 0;
          } else {
            return p.stock <= 0;
          }
        });
      }

      // Apply min price filter
      if (state.filters.minPrice && state.filters.minPrice !== '') {
        filtered = filtered.filter(p => p.price >= Number(state.filters.minPrice));
      }
      
      // Apply max price filter
      if (state.filters.maxPrice && state.filters.maxPrice !== '') {
        filtered = filtered.filter(p => p.price <= Number(state.filters.maxPrice));
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;
        
        if (state.sort.field === 'name') {
          comparison = (a.name || '').localeCompare(b.name || '');
        } else if (state.sort.field === 'price') {
          comparison = (a.price || 0) - (b.price || 0);
        } else if (state.sort.field === 'createdAt') {
          comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        } else if (state.sort.field === 'stock') {
          comparison = (a.stock || 0) - (b.stock || 0);
        }
        
        return state.sort.order === 'asc' ? comparison : -comparison;
      });
      
      state.filteredProducts = filtered;
      state.pagination.total = filtered.length;
    },
    
    resetFilters: (state) => {
      state.filters = {
        name: '',
        fromDate: '',
        toDate: '',
        inStock: '',
        minPrice: '',
        maxPrice: ''
      };
      state.sort = {
        field: 'createdAt',
        order: 'desc'
      };
      state.filteredProducts = [...state.products];
      state.pagination.total = state.products.length;
      
      // Session la irunthu clear pannu
      sessionStorage.removeItem('productFilters');
      sessionStorage.removeItem('productSort');
    },
    
    setSort: (state, action) => {
      state.sort = { ...state.sort, ...action.payload };
      // Session la save pannu
      saveSortToSession(state.sort);
    },
    
    clearProductState: (state) => {
      state.products = [];
      state.filteredProducts = [];
      state.product = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.filters = {
        name: '',
        fromDate: '',
        toDate: '',
        inStock: '',
        minPrice: '',
        maxPrice: ''
      };
      state.sort = {
        field: 'createdAt',
        order: 'desc'
      };
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0
      };
      
      // Session la irunthu clear pannu
      sessionStorage.removeItem('productFilters');
      sessionStorage.removeItem('productSort');
    }
  }
});

export const {
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
  setSort,
  clearProductState
} = productSlice.actions;

export default productSlice.reducer;