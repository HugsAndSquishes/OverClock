import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ENDPOINTS } from "../utils/api";
import { motion } from "framer-motion";

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLogoAnimating, setIsLogoAnimating] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLogoAnimating(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await apiFetch(ENDPOINTS.LOGIN, {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Login failed.");
            }

            const userRes = await apiFetch(ENDPOINTS.AUTHENTICATED);
            if (userRes.ok) {
                const userData = await userRes.json();
                localStorage.setItem("username", userData.username);
                localStorage.setItem("logged_in", "yes");
                setIsAuthenticated(true);
                navigate("/home", { replace: true });
            } else {
                throw new Error("Login succeeded but failed to verify user session.");
            }
        } catch (err) {
            localStorage.removeItem("logged_in");
            localStorage.removeItem("username");
            setIsAuthenticated(false);
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-700 rounded-xl shadow-lg border border-gray-600 overflow-hidden"
                >
                    <div className="px-8 py-10">
                        {/* Logo Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                animate={{ scale: isLogoAnimating ? [1, 1.1, 1] : 1 }}
                                transition={{ duration: 1 }}
                                className="inline-block mb-4"
                            >
                                <img 
                                    src="/favicon.ico" 
                                    alt="Company Logo" 
                                    className="h-16 w-16 mx-auto rounded-lg border border-gray-500"
                                />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-gray-100">Welcome Back</h1>
                            <p className="text-gray-400 mt-1">Sign in to your account</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/30 text-red-300 p-3 rounded-lg mb-6 border border-red-700 flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="bg-gray-800 border border-gray-600 w-full pl-10 pr-3 py-3 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        Password
                                    </label>                                
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-gray-800 border border-gray-600 w-full pl-10 pr-3 py-3 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                                    isLoading
                                        ? "bg-blue-700 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : "Sign in"}
                            </motion.button>
                        </form>
                    </div>
                    <div className="px-8 py-4 bg-gray-800/50 text-center border-t border-gray-600">
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Login;
