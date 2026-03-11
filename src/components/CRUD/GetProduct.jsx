
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchProducts, 
  deleteExistingProduct,
  updateFilters,
  updateSort,
  resetAllFilters 
} from "../../redux/actions/productActions";
import { loadFiltersFromSession, loadSortFromSession } from "../../utils/sessionStorage";
import Loader from "../Loader";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardMedia,
  Alert,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Divider,
  Collapse,
  Pagination,
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InventoryIcon from '@mui/icons-material/Inventory';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function GetProduct() {
  const dispatch = useDispatch();
  
 
  const isMounted = useRef(false);
  const prevFiltersRef = useRef({});
  const prevSortRef = useRef({});
  const sessionLoaded = useRef(false);
  
 
  const productState = useSelector((state) => state.products);
  
 
  console.log(" Component rendering...");
  console.log(" Full Product State:", productState);
  
 
  const products = productState?.products || [];
  const filteredProducts = productState?.filteredProducts || [];
  const loading = productState?.products?.loading || false;
  const error = productState?.products?.error || null;
  
  const filters = productState?.products?.filters || {
    name: '',
    fromDate: '',
    toDate: '',
    inStock: '',
    minPrice: '',
    maxPrice: ''
  };
  
  const sort = productState?.products?.sort || {
    field: 'createdAt',
    order: 'desc'
  };
  
  console.log(" Products count:", products.length);
  console.log(" Filtered count:", filteredProducts.length);
  console.log(" Filters from Redux:", filters);
  console.log(" Sort from Redux:", sort);
  
 
  useEffect(() => {
    if (!sessionLoaded.current) {
      const savedFilters = loadFiltersFromSession();
      const savedSort = loadSortFromSession();
      
      console.log(" Session loaded - Filters:", savedFilters);
      console.log(" Session loaded - Sort:", savedSort);
      
      
      if (savedFilters && Object.keys(savedFilters).length > 0) {
        console.log(" Applying saved filters from session");
        dispatch(updateFilters(savedFilters));
      }
      
      if (savedSort) {
        console.log(" Applying saved sort from session");
        dispatch(updateSort(savedSort));
      }
      
      sessionLoaded.current = true;
    }
  }, [dispatch]);
  
  
  const [localFilters, setLocalFilters] = useState({
    name: filters.name || '',
    fromDate: filters.fromDate || null,
    toDate: filters.toDate || null,
    inStock: filters.inStock || '',
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || ''
  });
  
  
  const [localSort, setLocalSort] = useState({
    field: sort.field || 'createdAt',
    order: sort.order || 'desc'
  });
  
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  
  useEffect(() => {
    console.log(" Fetching products...");
    dispatch(fetchProducts());
  }, [dispatch]);


  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    
    const filtersChanged = 
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    
    if (filtersChanged) {
      console.log(" Filters changed, updating local filters:", filters);
      setLocalFilters({
        name: filters.name || '',
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        inStock: filters.inStock || '',
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || ''
      });
      prevFiltersRef.current = { ...filters };
    }
  }, [filters]);

 
  useEffect(() => {
    const sortChanged = 
      prevSortRef.current.field !== sort.field ||
      prevSortRef.current.order !== sort.order;
    
    if (sortChanged) {
      console.log(" Sort changed, updating local sort:", sort);
      setLocalSort({
        field: sort.field || 'createdAt',
        order: sort.order || 'desc'
      });
      prevSortRef.current = { ...sort };
    }
  }, [sort]);


  const handleFilterChange = useCallback((field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    const cleanedFilters = {};
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '' && value !== 'null') {
        cleanedFilters[key] = value;
      }
    });
    console.log(" Applying filters:", cleanedFilters);
    dispatch(updateFilters(cleanedFilters));
    setPage(1);
  }, [localFilters, dispatch]);

  const handleSortChange = useCallback((field, value) => {
    setLocalSort(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleApplySort = useCallback(() => {
    console.log(" Applying sort:", localSort);
    dispatch(updateSort(localSort));
  }, [localSort, dispatch]);

  const handleResetFilters = useCallback(() => {
    console.log(" Resetting all filters");
    setLocalFilters({
      name: '',
      fromDate: null,
      toDate: null,
      inStock: '',
      minPrice: '',
      maxPrice: ''
    });
    setLocalSort({
      field: 'createdAt',
      order: 'desc'
    });
    dispatch(resetAllFilters());
    setPage(1);
  }, [dispatch]);

  const handleRemoveFilter = useCallback((filterKey) => {
    setLocalFilters(prev => {
      const updated = { ...prev, [filterKey]: '' };
      
      const cleanedFilters = {};
      Object.entries(updated).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          cleanedFilters[key] = value;
        }
      });
      
     
      setTimeout(() => {
        dispatch(updateFilters(cleanedFilters));
      }, 0);
      
      return updated;
    });
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteExistingProduct(id));
    }
  };

  const getProductImages = useCallback((product) => {
    const images = [];
    
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (typeof img === 'string') {
          images.push(`http://localhost:3000/uploads/products/${img}`);
        } else if (img?.url) {
          images.push(img.url);
        } else if (img?.filename) {
          images.push(`http://localhost:3000/uploads/products/${img.filename}`);
        }
      });
    }
    
    if (product.image) {
      images.push(`http://localhost:3000/uploads/products/${product.image}`);
    }
    
    if (images.length === 0) {
      images.push("https://via.placeholder.com/200?text=No+Image");
    }
    
    return images;
  }, []);

  const nextImage = useCallback((productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  }, []);

  const prevImage = useCallback((productId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  }, []);

  
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  }, [filteredProducts, page, rowsPerPage]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(localFilters).filter(v => v && v !== '').length;
  }, [localFilters]);

 
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  
  if (loading && products.length === 0) {
    console.log(" Loading...");
    return <Loader />;
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const hasProducts = displayProducts.length > 0;
  console.log(" Displaying products:", displayProducts.length);

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
    
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Products List
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? "primary" : "inherit"}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
          <Button 
            variant="contained" 
            component={Link} 
            to="/CreateProduct"
            size="large"
          >
            Add Product
          </Button>
        </Box>
      </Box>

    
      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Filter & Sort Products
            </Typography>
            <Button 
              variant="text" 
              color="error" 
              onClick={handleResetFilters}
              startIcon={<ClearIcon />}
            >
              Reset All
            </Button>
          </Box>

          <Grid container spacing={3}>
          
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                fullWidth
                label="Search by name"
                value={localFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                size="small"
              />
            </Grid>

        
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} md={6} lg={4}>
                <DatePicker
                  label="From Date"
                  value={localFilters.fromDate}
                  onChange={(date) => handleFilterChange('fromDate', date)}
                  slotProps={{ textField: { 
                    fullWidth: true, 
                    size: "small",
                    InputProps: {
                      startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }
                  }}}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <DatePicker
                  label="To Date"
                  value={localFilters.toDate}
                  onChange={(date) => handleFilterChange('toDate', date)}
                  slotProps={{ textField: { 
                    fullWidth: true, 
                    size: "small",
                    InputProps: {
                      startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }
                  }}}
                />
              </Grid>
            </LocalizationProvider>

        
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={localFilters.inStock}
                  label="Stock Status"
                  onChange={(e) => handleFilterChange('inStock', e.target.value)}
                  startAdornment={<InventoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">In Stock</MenuItem>
                  <MenuItem value="false">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>

          
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                size="small"
              />
            </Grid>

           
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={localSort.field}
                  label="Sort By"
                  onChange={(e) => handleSortChange('field', e.target.value)}
                  startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="createdAt">Date Added</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="stock">Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Order</InputLabel>
                <Select
                  value={localSort.order}
                  label="Order"
                  onChange={(e) => handleSortChange('order', e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

           
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button 
                  variant="contained" 
                  onClick={() => {
                    handleApplyFilters();
                    handleApplySort();
                  }}
                >
                  Apply
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowFilters(false)}
                >
                  Close
                </Button>
              </Box>
            </Grid>
          </Grid>

         
          {activeFilterCount > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Active filters:
                </Typography>
                {localFilters.name && (
                  <Chip
                    label={`Name: ${localFilters.name}`}
                    onDelete={() => handleRemoveFilter('name')}
                    size="small"
                    color="primary"
                  />
                )}
                {localFilters.fromDate && (
                  <Chip
                    label={`From: ${new Date(localFilters.fromDate).toLocaleDateString()}`}
                    onDelete={() => handleRemoveFilter('fromDate')}
                    size="small"
                    color="primary"
                  />
                )}
                {localFilters.toDate && (
                  <Chip
                    label={`To: ${new Date(localFilters.toDate).toLocaleDateString()}`}
                    onDelete={() => handleRemoveFilter('toDate')}
                    size="small"
                    color="primary"
                  />
                )}
                {localFilters.inStock && (
                  <Chip
                    label={`Stock: ${localFilters.inStock === 'true' ? 'In Stock' : 'Out of Stock'}`}
                    onDelete={() => handleRemoveFilter('inStock')}
                    size="small"
                    color="primary"
                  />
                )}
                {localFilters.minPrice && (
                  <Chip
                    label={`Min: ₹${localFilters.minPrice}`}
                    onDelete={() => handleRemoveFilter('minPrice')}
                    size="small"
                    color="primary"
                  />
                )}
                {localFilters.maxPrice && (
                  <Chip
                    label={`Max: ₹${localFilters.maxPrice}`}
                    onDelete={() => handleRemoveFilter('maxPrice')}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>
            </>
          )}
        </Paper>
      </Collapse>

    
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Found {displayProducts.length} products
          {activeFilterCount > 0 && ' (filtered)'}
        </Typography>
        {activeFilterCount > 0 && (
          <Button 
            size="small" 
            onClick={handleResetFilters}
            startIcon={<ClearIcon />}
          >
            Clear all
          </Button>
        )}
      </Box>

      {!hasProducts ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="50vh"
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {activeFilterCount > 0 
              ? 'Try adjusting your filters' 
              : 'Click "Add Product" to create your first product'}
          </Typography>
          {activeFilterCount > 0 && (
            <Button 
              variant="outlined" 
              onClick={handleResetFilters}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedProducts.map((product) => {
              const images = getProductImages(product);
              const currentIndex = currentImageIndex[product._id] || 0;
              const hasMultipleImages = images.length > 1;
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 3,
                      },
                      position: 'relative',
                    }}
                  >
                    
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={images[currentIndex]}
                        alt={product.name}
                        sx={{ 
                          objectFit: "cover",
                          backgroundColor: '#f5f5f5'
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200?text=No+Image";
                          e.target.onerror = null;
                        }}
                      />
                      
                      {hasMultipleImages && (
                        <>
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            {currentIndex + 1} / {images.length}
                          </Typography>
                          
                          <IconButton
                            size="small"
                            onClick={() => prevImage(product._id, images.length)}
                            sx={{
                              position: 'absolute',
                              left: 4,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(255,255,255,0.8)',
                              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                              padding: '4px',
                            }}
                          >
                            <ArrowBackIosIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => nextImage(product._id, images.length)}
                            sx={{
                              position: 'absolute',
                              right: 4,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(255,255,255,0.8)',
                              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                              padding: '4px',
                            }}
                          >
                            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {product.name}
                      </Typography>
                      
                      <Typography variant="h6" color="primary" gutterBottom>
                        ₹{product.price}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color={product.stock > 0 ? "success.main" : "error.main"}
                        gutterBottom
                      >
                        Stock: {product.stock} {product.stock > 0 ? '✓' : '✗'}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: "40px",
                        }}
                      >
                        {product.description || 'No description'}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Added: {new Date(product.createdAt).toLocaleDateString()}
                      </Typography>

                      <Box mt={2} display="flex" gap={1} justifyContent="space-between">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(product._id)}
                          sx={{ flex: 1 }}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          component={Link}
                          to={`/updateproduct/${product._id}`}
                          sx={{ flex: 1 }}
                        >
                          Update
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

         
          {filteredProducts.length > rowsPerPage && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(filteredProducts.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default GetProduct;