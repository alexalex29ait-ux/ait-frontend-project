import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  updateExistingProduct,
  clearCurrentProduct,
} from "../../redux/actions/productActions";

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

import CloseIcon from "@mui/icons-material/Close";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { product, loading, error, success } = useSelector(
    (state) => state.products
  );

  // Local state
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  // Fetch product
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      setProductForm({
        name: product.name || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        stock: product.stock?.toString() || "",
      });
    }
  }, [product]);

  // Cleanup previews
  useEffect(() => {
    return () => {
      previewImages.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previewImages]);

  // Navigate after success
  useEffect(() => {
    if (success) {
      navigate("/getproduct");
    }
  }, [success, navigate]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;

      if (name === "images") {
        const fileArray = Array.from(files);

        if (selectedImages.length + fileArray.length > 5) {
          alert(
            `You can only upload 5 images total. Already selected ${selectedImages.length}`
          );
          return;
        }

        setSelectedImages((prev) => [...prev, ...fileArray]);

        const previews = fileArray.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...previews]);
      } else {
        setProductForm((prev) => ({ ...prev, [name]: value }));
      }
    },
    [selectedImages.length]
  );

  const handleRemoveImage = useCallback(
    (index) => {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));

      URL.revokeObjectURL(previewImages[index]);

      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    },
    [previewImages]
  );

  const handleReset = useCallback(() => {
    if (product) {
      setProductForm({
        name: product.name || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        stock: product.stock?.toString() || "",
      });
    }

    previewImages.forEach((preview) => URL.revokeObjectURL(preview));
    setPreviewImages([]);
    setSelectedImages([]);
  }, [product, previewImages]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const formData = new FormData();

      Object.keys(productForm).forEach((key) => {
        formData.append(key, productForm[key]);
      });

      if (selectedImages.length > 0) {
        selectedImages.forEach((img) => {
          formData.append("images", img);
        });
      }

      dispatch(updateExistingProduct(id, formData, navigate));
    },
    [id, productForm, selectedImages, dispatch, navigate]
  );

  if (loading && !product) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6">Loading product details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" mb={4} color="primary">
          Edit Product
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {success && (
          <Alert severity="success">
            Product updated successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit} onReset={handleReset}>
          <Grid container spacing={3}>
            {/* Current Images */}
            {product?.images?.length > 0 && selectedImages.length === 0 && (
              <Grid item xs={12}>
                <Typography>Current Images:</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3000/uploads/products/${img}`}
                      alt={`Current ${index + 1}`}
                      width="100"
                    />
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Product Name"
                name="name"
                fullWidth
                value={productForm.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={productForm.price}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                fullWidth
                value={productForm.stock}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={productForm.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <input
                type="file"
                name="images"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />

              <label htmlFor="image-upload">
                <Button component="span" variant="contained" fullWidth>
                  Choose Images
                </Button>
              </label>
            </Grid>

            {/* Preview */}
            {previewImages.length > 0 && (
              <Grid item xs={12}>
                <Typography>New Images Preview</Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {previewImages.map((preview, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <img src={preview} width="120" alt="preview" />

                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bgcolor: "red",
                          color: "#fff",
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            {/* Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button component={Link} to="/getproduct" variant="outlined">
                  Cancel
                </Button>

                <Button type="reset" variant="outlined">
                  Reset New Images
                </Button>

                <Button type="submit" variant="contained">
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