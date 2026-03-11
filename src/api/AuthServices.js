import axios from "axios";

const AuthServices = {
  signup: async (data) => {
    const response = await axios.post("http://localhost:3000/auth/register", data);
    return response.data;
  },
  login: async (data) => {
    const response = await axios.post("http://localhost:3000/auth/login", data);
    return response.data;
  },
};

export default AuthServices;