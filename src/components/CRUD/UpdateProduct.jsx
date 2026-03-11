import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, updateExistingProduct, clearCurrentProduct } from "../../redux/actions/productActions";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [formInitialized, setFormInitialized] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  
  const initialState = {
    name: "",
    price: "",
    description: "",
    stock: "",
  };

  const [productForm, setProductForm] = useState(initialState);
  
  // Correct state access
  const productState = useSelector((state) => state.products);
  const productsSlice = productState?.products || {};
  const product = productsSlice?.product;
  const loading = productsSlice?.loading || false;
  const error = productsSlice?.error || null;
  const success = productsSlice?.success || false;
  
  console.log("UpdateProduct - product from state:", product);
  console.log("Selected images count:", selectedImages.length);

  // Fetch product when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearCurrentProduct());
      previewImages.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [id, dispatch]);

  // Update form when product data is loaded
  useEffect(() => {
    if (product && Object.keys(product).length > 0 && !formInitialized) {
      setProductForm({
        name: product.name || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        stock: product.stock?.toString() || "",
      });
      setFormInitialized(true);
    }
  }, [product, formInitialized]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "images") {
      const fileArray = Array.from(files);
      
      // Check total images (existing new images + new selection)
      if (selectedImages.length + fileArray.length > 5) {
        alert(`You can only select up to 5 images total. You already have ${selectedImages.length} images selected.`);
        return;
      }
      
      // Append new images to existing selection (not replace)
      setSelectedImages(prev => [...prev, ...fileArray]);
      
      // Create new previews and append
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
      
      setImageCount(prev => prev + fileArray.length);
      
      console.log(`${fileArray.length} new images added, total: ${selectedImages.length + fileArray.length}`);
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  const handleRemoveImage = useCallback((indexToRemove) => {
    // Remove from selectedImages
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    
    // Remove from previewImages and revoke URL
    URL.revokeObjectURL(previewImages[indexToRemove]);
    setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    
    setImageCount(prev => prev - 1);
  }, [previewImages]);

  const handleReset = () => {
    if (product) {
      setProductForm({
        name: product.name || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        stock: product.stock?.toString() || "",
      });
    }
    
    // Clean up previews
    previewImages.forEach(preview => URL.revokeObjectURL(preview));
    setSelectedImages([]);
    setPreviewImages([]);
    setImageCount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    Object.keys(productForm).forEach(key => {
      if (productForm[key]) {
        formData.append(key, productForm[key]);
      }
    });

    if (selectedImages.length > 0) {
      selectedImages.forEach(image => {
        formData.append("images", image);
      });
    }

    // Debug log
    console.log("Updating with images:", selectedImages.length);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    dispatch(updateExistingProduct(id, formData, navigate));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6">Loading product details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" mb={4} textAlign="center" color="primary">
          Edit Product
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Product updated successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit} onReset={handleReset}>
          <Grid container spacing={3}>
            {/* Display current product images if any - ONLY show if no new images selected */}
            {product?.image && selectedImages.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Image:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={`http://localhost:3000/uploads/products/${product.image}`}
                    alt="Current"
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '2px solid #1976d2'
                    }}
                  />
                </Box>
              </Grid>
            )}

            {product?.images && product.images.length > 0 && selectedImages.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Images:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  {product.images.map((img, index) => (
                    <img 
                      key={index}
                      src={`http://localhost:3000/uploads/products/${img}`}
                      alt={`Current ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 4,
                        border: '1px solid #ccc'
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={productForm.name}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            {/* Price Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={productForm.price}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{ startAdornment: '₹' }}
                disabled={loading}
              />
            </Grid>

            {/* Stock Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={productForm.stock}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            {/* Description Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={productForm.description}
                onChange={handleChange}
                required
                multiline
                rows={3}
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            {/* Image Upload Field */}
            <Grid item xs={12}>
              <input
                type="file"
                name="images"
                id="image-upload"
                onChange={handleChange}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{ py: 1.5 }}
                  color={selectedImages.length > 0 ? "success" : "primary"}
                  disabled={loading || selectedImages.length >= 5}
                >
                  {selectedImages.length > 0 
                    ? `${selectedImages.length} / 5 New Images Selected - Click to Add More` 
                    : "Choose New Images (Optional - Max 5)"}
                </Button>
              </label>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Leave empty to keep existing images. Hold Ctrl/Cmd to select multiple.
              </Typography>
              {selectedImages.length >= 5 && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Maximum 5 images reached. Remove some to add more.
                </Typography>
              )}
            </Grid>

            {/* New Image Previews */}
            {previewImages.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  New Images to Upload ({previewImages.length}/5):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {previewImages.map((preview, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        border: '3px solid',
                        borderColor: index === 0 ? 'primary.main' : 'grey.300',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 2,
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {index === 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'primary.main',
                            color: 'white',
                            textAlign: 'center',
                            py: 0.5,
                          }}
                        >
                          Main New Image
                        </Typography>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'error.dark',
                          },
                          width: 28,
                          height: 28,
                        }}
                        disabled={loading}
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
                <Button
                  component={Link}
                  to="/getproduct"
                  variant="outlined"
                  color="warning"
                  size="large"
                  disabled={loading}
                >
                  Cancel
                </Button>
                
                <Button
                  type="reset"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  disabled={loading}
                >
                  Reset New Images
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateProduct;