import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, apiBaseUrl }) => {
  const navigate = useNavigate();

  const cover = product?.images?.[0]?.imageUrl || null;
  const coverUrl = cover
    ? (cover.startsWith("http://") || cover.startsWith("https://") ? cover : `${apiBaseUrl}${cover}`)
    : null;
  
  const originalPrice = product.price;
  const discountedPrice = calculateDiscountedPrice(product);
  const hasDiscount = discountedPrice < originalPrice;
  const activePromotion = getActivePromotion(product);
  const isActive = product?.isActive === 1 || product?.isActive === "Active";

  function calculateDiscountedPrice(product) {
    if (!product.promotions || product.promotions.length === 0) {
      return product.discountPrice || product.price;
    }
    
    const activePromotion = product.promotions.find(promo => 
      promo.isActive && new Date(promo.startDate) <= new Date() && new Date(promo.endDate) >= new Date()
    );
    
    if (!activePromotion) return product.discountPrice || product.price;
    
    const discount = activePromotion.discountPercentage || 0;
    return product.price * (1 - discount / 100);
  }

  function getActivePromotion(product) {
    if (!product.promotions || product.promotions.length === 0) return null;
    
    const promotion = product.promotions.find(promo => 
      promo.isActive && new Date(promo.startDate) <= new Date() && new Date(promo.endDate) >= new Date()
    );
    
    // Round the discount percentage to 2 decimal places
    if (promotion && promotion.discountPercentage) {
      promotion.discountPercentage = Math.round(promotion.discountPercentage * 100) / 100;
    }
    
    return promotion;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/product/${product.productId}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/product/${product.productId}`);
      }}
      // className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white relative"
      className="group rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white relative"
    >
      {/* Promotion Badge */}
      {activePromotion && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {activePromotion.discountPercentage}% OFF
        </div>
      )}
      
      {/* Product Image */}
      <div className="w-full aspect-video bg-gray-100 overflow-hidden relative">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={product.productName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
            {isActive ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.productName}
          </h3>
        </div>
        
        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-green-600">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                Save ${(originalPrice - discountedPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Promotion Info */}
        {activePromotion && (
          <div className="mb-3 p-2 bg-yellow-200 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700">
              <span className="font-semibold">Limited Time Offer!</span>
              <br />
              {activePromotion.discountPercentage}% off - Ends {new Date(activePromotion.endDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
