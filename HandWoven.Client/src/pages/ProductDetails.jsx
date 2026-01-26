import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { AuthContext } from '../context/AuthContext';

import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  // cart context
  const { fetchCart } = useContext(CartContext); 


  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env?.VITE_API_BASE_URL;
    return base ? base.replace(/\/$/, "") : "http://localhost:5057";
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await getPublicProductById(productId);
        
        if (data) {
          setProduct(data);
        } else {
          
          throw new Error('Product not found');
        }

      } catch (error) {
        console.error('Failed to fetch product details:', error);
        
        setProduct({
          productId: productId,
          productName: "Handwoven Test Product",
          description: "Beautiful handwoven product with intricate details and premium materials.",
          price: 1200,
          discountPrice: 100,
          isActive: 1,
          images: [
            { imageUrl: "/uploads/products/sample.jpg" }
          ],
          promotions: [
            {
              promotionId: 1,
              discountPercentage: 0.83,
              startDate: "2026-01-22T00:00:00",
              endDate: "2026-01-29T00:00:00",
              isActive: true
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const calculateDiscountedPrice = (product) => {
    if (!product.promotions || product.promotions.length === 0) {
      return product.discountPrice || product.price;
    }
    
    const activePromotion = product.promotions.find(promo => 
      promo.isActive && new Date(promo.startDate) <= new Date() && new Date(promo.endDate) >= new Date()
    );
    
    if (!activePromotion) return product.discountPrice || product.price;
    
    const discount = activePromotion.discountPercentage || 0;
    return product.price * (1 - discount / 100);
  };

  const getActivePromotion = (product) => {
    if (!product.promotions || product.promotions.length === 0) return null;
    
    const promotion = product.promotions.find(promo => 
      promo.isActive && new Date(promo.startDate) <= new Date() && new Date(promo.endDate) >= new Date()
    );
    
    if (promotion && promotion.discountPercentage) {
      promotion.discountPercentage = Math.round(promotion.discountPercentage * 100) / 100;
    }
    
    return promotion;
  };

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!user) {
      setCartMessage('Please log in to add items to cart');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    if (!product || !isActive) {
      setCartMessage('Product is not available');
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage('');
      
      await addToCart(parseInt(productId), quantity);
      await fetchCart();
      setCartMessage(`Successfully added ${quantity} item(s) to cart!`);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setCartMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (error.response?.status === 401) {
        setCartMessage('Please log in to add items to cart');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setCartMessage('Failed to add item to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const cover = product?.images?.[0]?.imageUrl || null;
  const coverUrl = cover
    ? (cover.startsWith("http://") || cover.startsWith("https://") ? cover : `${apiBaseUrl}${cover}`)
    : null;
  
  const originalPrice = product.price;
  const discountedPrice = calculateDiscountedPrice(product);
  const hasDiscount = discountedPrice < originalPrice;
  const activePromotion = getActivePromotion(product);
  const isActive = product?.isActive === 1 || product?.isActive === "Active";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="p-6">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {coverUrl ? (
                  <img 
                    src={coverUrl} 
                    alt={product.productName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.productName}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm ${isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                    {isActive ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                
                {/* Price Section */}
                <div className="flex items-center gap-3 mb-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-green-600">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold">
                        Save ${(originalPrice - discountedPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Promotion Info */}
                {activePromotion && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      <span className="font-semibold">Limited Time Offer!</span>
                      <br />
                      {activePromotion.discountPercentage}% off - Ends {new Date(activePromotion.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Cart Message */}
              {cartMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  cartMessage.includes('Successfully') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {cartMessage}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !isActive}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    !isActive 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : addingToCart 
                        ? 'bg-gray-400 text-gray-200 cursor-wait'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : !isActive ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Product ID:</span>
                    <span className="ml-2 text-gray-900">#{product.productId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Availability:</span>
                    <span className="ml-2 text-green-600">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
