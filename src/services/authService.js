const API_BASE_URL = "http://localhost:8080"; // Update if needed

const authService = {
  registerEmployee: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Registration failed");

      return await response.json();
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw error;
    }
  },

  login: async (loginData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Store token & role properly
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      return data; // Return data to be used for navigation
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/"; // Redirect to login after logout
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getUserRole: () => {
    return localStorage.getItem("role");
  },
};

export default authService;
