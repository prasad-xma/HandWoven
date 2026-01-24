import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../api/cartApi';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    // const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:0000";
    const apiBaseUrl = "http://localhost:5057";

    useEffect(() => {
        fetchCart();

    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await getCart();
            setCart(data);
            setError('');

        } catch (err) {
            console.error('Failed to fetch cart:', err);
            if (err.response?.status === 401) {
                setError('Please log in to view your cart');
            } else {
                setError('Failed to load cart. Please try again.');
            }

        } finally {
            setLoading(false);

        }
    };

    const handleQuantityChange = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            setUpdating(true);
            await updateCartItem(cartId, newQuantity);
            await fetchCart(); // Refresh cart
        } catch (err) {
            console.error('Failed to update quantity:', err);
            setError('Failed to update quantity. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    // remove item from cart
    const handleRemoveItem = async (cartId) => {
        if (!window.confirm('Are you sure you want to remove this item?')) return;
        
        try {
            setUpdating(true);
            await removeFromCart(cartId);
            await fetchCart(); // Refresh cart

        } catch (err) {
            console.error('Failed to remove item:', err);
            setError('Failed to remove item. Please try again.');

        } finally {
            setUpdating(false);
        }
    };

    // clear cart
    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
        
        try {
            setUpdating(true);
            await clearCart();
            await fetchCart(); // Refresh cart
            // setError('');

        } catch (err) {
            console.error('Failed to clear cart:', err);
            setError('Failed to clear cart. Please try again.');

        } finally {
            setUpdating(false);
        }
    };

    // continue shopping button
    const handleContinueShopping = () => {
        navigate('/');

    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        return imageUrl.startsWith("http://") || imageUrl.startsWith("https://") 
            ? imageUrl 
            : `${apiBaseUrl}${imageUrl}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && error.includes('Please log in')) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="mb-6">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to view your shopping cart</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                        <button
                            onClick={handleContinueShopping}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {!cart || !cart.items || cart.items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some products to get started!</p>
                        <button
                            onClick={handleContinueShopping}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {cart.totalItems} {cart.totalItems === 1 ? 'Item' : 'Items'}
                                        </h2>
                                        {cart.items.length > 0 && (
                                            <button
                                                onClick={handleClearCart}
                                                disabled={updating}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                            >
                                                Clear Cart
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {cart.items.map((item) => {
                                            const imageUrl = getImageUrl(item.imageUrl);
                                            return (
                                                <div key={item.cartId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                                    {/* Product Image */}
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                            {item.productName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-lg font-semibold text-gray-900">
                                                                ${item.totalPrice.toFixed(2)}
                                                            </span>
                                                            {item.discountPrice && item.discountPrice < item.price && (
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    ${(item.quantity * item.price).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                                                            disabled={updating || item.quantity <= 1}
                                                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="w-12 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                                                            disabled={updating}
                                                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleRemoveItem(item.cartId)}
                                                        disabled={updating}
                                                        className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                                        <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                                    </div>
                                    {cart.totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Discount</span>
                                            <span className="font-medium text-green-600">-${cart.totalDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-semibold text-gray-900">${cart.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                                    disabled={updating}
                                >
                                    Proceed to Checkout
                                </button>

                                <div className="mt-4 text-center">
                                    <button
                                        onClick={handleContinueShopping}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
