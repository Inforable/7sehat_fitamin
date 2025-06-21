const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
    // User Registration
    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            return await response.json();
        } catch (error) {
            return {success: false, message: 'Network error'}
        }
    }

    // User Login
    static async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })

            return await response.json();
        } catch (error) {
            return {success: false, message: 'Network error'}
        }
    }

    // Get User Profile
    static async getUserProfile() {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return {success: false, message: 'No token found'}
            }

            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            return await response.json();
        } catch (error) {
            return {success: false, message: 'Network error'}
        }
    }

    // Update User Profile
    static async updateUserProfile(profileData) {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return {success: false, message: 'No token found'}
            }

            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            })

            return await response.json();
        } catch (error) {
            return {success: false, message: 'Network error'}
        }
    }
}

export default ApiClient