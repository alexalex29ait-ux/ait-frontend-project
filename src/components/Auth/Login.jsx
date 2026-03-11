import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography,
  Snackbar,
  Alert,
  CircularProgress 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const resultAction = await dispatch(loginUser(formData));
      
      // Check if login was successful
      if (loginUser.fulfilled.match(resultAction)) {
        // ✅ Show success message
        setSuccessMessage("Login successful! Redirecting...");
        setSnackbarOpen(true);
        
        // Redirect after 2 seconds
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
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" mb={3} textAlign="center" color="primary">
          Login
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
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, py: 1.5 }}
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
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>

      {/* ✅ Success Snackbar */}
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