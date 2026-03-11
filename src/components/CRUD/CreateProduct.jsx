import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { createNewProduct, clearProductError, resetProductSuccess } from '../../redux/actions/productActions';

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.products);

  const initialState = {
    name: '',
    price: '',
    description: '',
    stock: '',
  };

  const [productForm, setProductForm] = useState(initialState);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageCount, setImageCount] = useState(0);

  // Handle success
  useEffect(() => {
    if (success) {
      alert('Product created successfully!');
      navigate('/getproduct');
      dispatch(resetProductSuccess());
    }
  }, [success, navigate, dispatch]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'images') {
      const fileArray = Array.from(files);
      
      // Limit to 5 images (backend limit)
      if (fileArray.length > 5) {
        alert('You can only select up to 5 images');
        return;
      }
      
      // Check total images
      if (selectedImages.length + fileArray.length > 5) {
        alert('Total images cannot exceed 5');
        return;
      }
      
      // Update selected images
      setSelectedImages(prev => [...prev, ...fileArray]);
      
      // Create new previews
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
      
      setImageCount(prev => prev + fileArray.length);
      
      console.log(`${fileArray.length} new images selected, total: ${selectedImages.length + fileArray.length}`);
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
    setProductForm(initialState);
    
    // Clean up previews
    previewImages.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setPreviewImages([]);
    setImageCount(0);
    
    if (error) dispatch(clearProductError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    const formData = new FormData();
    
    Object.keys(productForm).forEach((key) => {
      formData.append(key, productForm[key]);
    });
    
    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    // Debug log
    console.log('Submitting with images:', selectedImages.length);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    dispatch(createNewProduct(formData, navigate));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" mb={4} textAlign="center" color="primary">
          Add New Product
        </Typography>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => dispatch(clearProductError())}
        >
          <Alert severity="error" onClose={() => dispatch(clearProductError())}>
            {error}
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit} onReset={handleReset}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={productForm.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

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
              />
            </Grid>

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
              />
            </Grid>

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
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                name="images"
                id="image-upload"
                onChange={handleChange}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                required={selectedImages.length === 0}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{ py: 1.5 }}
                  color={selectedImages.length > 0 ? 'success' : 'primary'}
                  disabled={loading || selectedImages.length >= 5}
                >
                  {selectedImages.length > 0
                    ? `${selectedImages.length} / 5 Images Selected - Click to Add More`
                    : 'Choose Images (Required - Max 5)'}
                </Button>
              </label>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Hold Ctrl/Cmd to select multiple images. First image will be main display.
              </Typography>
              {selectedImages.length >= 5 && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Maximum 5 images reached. Remove some to add more.
                </Typography>
              )}
            </Grid>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Selected Images ({previewImages.length}/5):
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
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
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
                            fontSize: '0.75rem',
                            py: 0.5,
                          }}
                        >
                          Main Image
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
                          width: 24,
                          height: 24,
                        }}
                        disabled={loading}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button 
                  type="reset" 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                  disabled={loading}
                >
                  Reset All
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  disabled={loading || selectedImages.length === 0}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProduct;