import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearError } from "../../redux/authSlice";
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Snackbar, 
  Alert, 
  Paper,
  CircularProgress 
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { SignupCredentials } from "../../types/auth.types";
import { RootState, AppDispatch } from "../../redux/store";

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<SignupCredentials>({
    name: "",
    age: 0,
    email: "",
    password: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    age?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/getproduct");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' ? (value ? parseInt(value) : 0) : value 
    }));
    
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.age || formData.age < 1) {
      errors.age = "Valid age is required";
    } else if (formData.age > 120) {
      errors.age = "Please enter a valid age";
    }
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 20) {
      errors.password = "Password must be less than 20 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const resultAction = await dispatch(signupUser(formData));

      if (signupUser.fulfilled.match(resultAction)) {
        setSnackbarMessage(" Account created successfully! Redirecting to login...");
        setOpenSnackbar(true);
        
        setFormData({ name: "", age: 0, email: "", password: "" });
        
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else if (signupUser.rejected.match(resultAction)) {
        const errorMessage = (resultAction.payload as any)?.message || "Signup failed";
        setSnackbarMessage(`❌ ${errorMessage}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Signup failed", err);
      setSnackbarMessage(" Signup failed. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" mb={3} textAlign="center" color="primary" fontWeight="bold">
            Create Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age || ''}
              onChange={handleChange}
              required
              margin="normal"
              error={!!fieldErrors.age}
              helperText={fieldErrors.age}
              disabled={loading}
              inputProps={{ min: 1, max: 120 }}
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              disabled={loading}
            />

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/auth/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Signup;