import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/authSlice";
import { Container, Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(signupUser(formData));

      if (signupUser.fulfilled.match(resultAction)) {
        setOpenSnackbar(true); 
        setFormData({ name: "", age: "", email: "", password: "" }); // reset form
      }
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" mb={3}>Sign Up</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            margin="normal"
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
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          {error && <Typography color="error" mt={1}>{error}</Typography>}
        </form>

        <Typography mt={2}>
          Already have an account? <Link to="/auth/login">Login</Link>
        </Typography>
      </Box>

      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Registered successfully! You can now login.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Signup;