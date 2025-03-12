// API service for handling all fetch requests
const API_BASE_URL = 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Check if user is logged in
const isLoggedIn = () => !!getAuthToken();

// Handle API errors consistently
const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.message === 'Failed to fetch') {
        return { error: 'Network error - Check your connection and try again' };
    }
    
    // Use the actual error message from the server instead of a generic message
    if (error.status === 401) {
        // For non-login endpoints, this might be a session expiration
        if (!error.url || !error.url.includes('/auth/login')) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return { error: 'Session expired. Please log in again.' };
        }
        
        // For login endpoint, return the actual error message
        return { error: error.message || 'Invalid credentials' };
    }
    
    return { error: error.message || 'Unknown error occurred' };
};

// Base fetch function with error handling
const fetchApi = async (endpoint, options = {}) => {
    try {
        const token = getAuthToken();
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });
        
        // Handle HTTP error responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw { status: response.status, message: errorData.error || `HTTP Error ${response.status}` };
        }
        
        // Parse JSON response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return await response.text();
    } catch (error) {
        return handleApiError(error);
    }
};

// API methods
const api = {
    // Auth endpoints
    auth: {
        login: (credentials) => fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        
        register: (userData) => fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        
        // Verify current token
        verify: () => fetchApi('/auth/verify')
    },
    
    // Inward operations
    inward: {
        create: (data) => fetchApi('/inward', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        
        getAll: () => fetchApi('/inward')
    },
    
    // Outward operations
    outward: {
        create: (data) => fetchApi('/outward', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        
        getAll: () => fetchApi('/outward')
    },
    
    // Dashboard data
    dashboard: {
        getData: () => fetchApi('/dashboard')
    }
};

// Protection mechanism for pages that require authentication
const requireAuth = () => {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}; 