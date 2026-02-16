import api from "./api";

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
    } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
export const profileUser = async (token) => {
  try {
    const response = await api.get("/api/auth/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
    }
    catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfileUser = async (token, profileData) => {
  try {
    const response = await api.put("/api/auth/profile", profileData, {
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });
    return response.data;
    }
    catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const logoutUser = async (token) => {
    try {
        const response = await api.post("/api/auth/logout", {}, {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};