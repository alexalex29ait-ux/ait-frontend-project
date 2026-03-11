import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Paper
} from "@mui/material";
import { LoginCredentials } from "../../types/auth.types";
import { RootState } from "../../redux/store"; 

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<LoginCredentials>({ 
    email: "", 
    password: "" 
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string}>({});

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
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {email?: string; password?: string} = {};
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const resultAction = await dispatch(loginUser(formData));
      
      if (loginUser.fulfilled.match(resultAction)) {
        setSuccessMessage(" Login successful! Redirecting...");
        setSnackbarOpen(true);
        
        setTimeout(() => {
          navigate("/getproduct");
        }, 2000);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 10, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" mb={3} textAlign="center" color="primary" fontWeight="bold">
            Welcome Back
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label="Email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              margin="normal" 
              required 
              type="email"
              disabled={loading}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              variant="outlined"
            />
            
            <TextField 
              fullWidth 
              label="Password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              margin="normal" 
              type="password" 
              required 
              disabled={loading}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              variant="outlined"
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
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Logging in...
                </>
              ) : (
                "Login"
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
              Don't have an account?{' '}
              <Link to="/auth/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
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
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;