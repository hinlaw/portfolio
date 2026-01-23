// API client for communicating with Go backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Category {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

// API client class
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Health check
    async healthCheck(): Promise<ApiResponse> {
        return this.request('/health');
    }

    // Get categories
    async getCategories(): Promise<ApiResponse<Category[]>> {
        return this.request('/categories');
    }

    // Submit contact form
    async submitContactForm(data: ContactFormData): Promise<ApiResponse> {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual functions for convenience
export const healthCheck = () => apiClient.healthCheck();
export const getCategories = () => apiClient.getCategories();
export const submitContactForm = (data: ContactFormData) =>
    apiClient.submitContactForm(data);
