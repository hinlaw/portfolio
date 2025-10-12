'use client';

import { useState, useEffect } from 'react';
import { healthCheck, getCategories, type Category } from '@/lib/api';

export default function ApiStatusSection() {
    const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check health
                const healthResponse = await healthCheck();
                setIsHealthy(healthResponse.success);

                // Get categories
                const categoriesResponse = await getCategories();
                if (categoriesResponse.success && categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setIsHealthy(false);
            } finally {
                setLoading(false);
            }
        };

        checkApiStatus();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Checking API status...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        API Integration Status
                    </h2>
                    <p className="text-lg text-gray-600">
                        This section demonstrates the frontend-backend integration
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* API Health Status */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isHealthy ? 'bg-green-500' : 'bg-red-500'
                                }`}></span>
                            Backend Health Status
                        </h3>
                        <p className={`text-lg ${isHealthy ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {isHealthy ? '✅ Backend is healthy' : '❌ Backend is down'}
                        </p>
                        {error && (
                            <p className="text-red-500 text-sm mt-2">
                                Error: {error}
                            </p>
                        )}
                    </div>

                    {/* Categories from API */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Categories from API
                        </h3>
                        {categories.length > 0 ? (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center p-2 bg-gray-50 rounded">
                                        <span className="text-2xl mr-3">{category.icon}</span>
                                        <div>
                                            <p className="font-medium">{category.title}</p>
                                            <p className="text-sm text-gray-600">{category.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No categories loaded</p>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Development Instructions
                    </h3>
                    <div className="text-blue-800 space-y-2">
                        <p><strong>To run locally:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Start backend: <code className="bg-blue-100 px-1 rounded">cd backend && go run cmd/api/main.go</code></li>
                            <li>Start frontend: <code className="bg-blue-100 px-1 rounded">cd frontend && npm run dev</code></li>
                        </ul>
                        <p className="mt-4"><strong>For hot reload:</strong></p>
                        <p>Install Air: <code className="bg-blue-100 px-1 rounded">go install github.com/cosmtrek/air@latest</code></p>
                        <p>Run: <code className="bg-blue-100 px-1 rounded">cd backend && air</code></p>
                    </div>
                </div>
            </div>
        </section>
    );
}
