import axios, { AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  LoginResponse, 
  SignupCredentials, 
  SignupResponse,
  User 
} from '../types/auth.types';

const API_URL = 'http://localhost:3000/auth';

class AuthServices {
 
  async signup(data: SignupCredentials): Promise<SignupResponse> {
    try {
      console.log("📤 Sending signup request with data:", data);
      
      const response: AxiosResponse<any> = await axios.post(
        `${API_URL}/register`, 
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log("📥 Signup raw response:", response.data);
      
      if (!response.data) {
        throw new Error('No response data received');
      }
      
      const responseData = response.data;
      
     
      if (responseData?.status === true && responseData?.data) {
        return {
          status: true,
          data: responseData.data,
          message: responseData.message || "Signup successful"
        };
      }
      
     
      else if (responseData?._id || responseData?.id) {
        return {
          status: true,
          data: responseData,
          message: "Signup successful"
        };
      }
      
   
      else if (response.status >= 200 && response.status < 300) {
        return {
          status: true,
          data: responseData,
          message: "Signup successful"
        };
      }
      
      else {
        return {
          status: true,
          data: responseData,
          message: "Signup successful"
        };
      }
      
    } catch (error: any) {
      console.error(' Signup error details:', error);
      
      if (error.response) {
        throw {
          status: false,
          message: error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`,
          error: error.response.data
        };
      } else if (error.request) {
        throw {
          status: false,
          message: 'No response from server. Please check if backend is running.',
          error: error.request
        };
      } else {
        throw {
          status: false,
          message: error.message || 'Signup failed',
          error: error
        };
      }
    }
  }

  // Login method
  async login(data: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log(" Sending login request");
      
      const response: AxiosResponse<any> = await axios.post(
        `${API_URL}/login`, 
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log(" Login raw response:", response.data);
      
      if (!response.data) {
        throw new Error('No response data received');
      }
      
      const responseData = response.data;
      
      // Format 1: { status: true, data: { user, token } }
      if (responseData?.status === true && responseData?.data) {
        const { user, token } = responseData.data;
        
        if (token) {
          localStorage.setItem('token', token);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          console.log(" Token saved to localStorage");
        }
        
        return {
          status: true,
          data: { user, token },
          message: responseData.message || "Login successful"
        };
      }
      
     
      else if (responseData?.token) {
        const token = responseData.token;
        const user = responseData.user || { email: data.email };
        
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        console.log(" Token saved to localStorage");
        
        return {
          status: true,
          data: { user, token },
          message: "Login successful"
        };
      }
      
     
      else if (responseData?.access_token) {
        const token = responseData.access_token;
        const user = responseData.user || { email: data.email };
        
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        console.log(" Token saved to localStorage");
        
        return {
          status: true,
          data: { user, token },
          message: "Login successful"
        };
      }
      
    
      else if (response.status >= 200 && response.status < 300) {
        const possibleToken = responseData.token || responseData.access_token || responseData.accessToken;
        const possibleUser = responseData.user || responseData.profile || { email: data.email };
        
        if (possibleToken) {
          localStorage.setItem('token', possibleToken);
          if (possibleUser) {
            localStorage.setItem('user', JSON.stringify(possibleUser));
          }
        }
        
        return {
          status: true,
          data: {
            user: possibleUser,
            token: possibleToken || 'temp-token'
          },
          message: "Login successful"
        };
      }
      
      else {
        console.warn('Unknown response format:', responseData);
        return {
          status: true,
          data: {
            user: { email: data.email },
            token: 'temp-token'
          },
          message: "Login successful (unknown format)"
        };
      }
      
    } catch (error: any) {
      console.error(' Login error details:', error);
      
      if (error.response) {
        throw {
          status: false,
          message: error.response.data?.message || error.response.data?.error || `Login failed (${error.response.status})`,
          error: error.response.data
        };
      } else if (error.request) {
        throw {
          status: false,
          message: 'Cannot connect to server. Please check if backend is running on port 3000',
          error: error.request
        };
      } else {
        throw {
          status: false,
          message: error.message || 'Login failed',
          error: error
        };
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log(" User logged out");
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        return JSON.parse(userStr) as User;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  }

  setAuthHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthHeader(): void {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default new AuthServices();