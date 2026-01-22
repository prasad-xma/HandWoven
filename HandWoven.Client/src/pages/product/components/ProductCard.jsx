import React, { useMemo } from "react";

const ProductCard = ({ product, onClick, footer }) => {
  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env?.VITE_API_BASE_URL;
    
    return base ? base.replace(/\/$/, "") : "http://localhost:5057";
  }, []);

  const cover = product?.images?.[0]?.imageUrl || null;
  const coverUrl = cover
    ? (cover.startsWith("http://") || cover.startsWith("https://") ? cover : `${apiBaseUrl}${cover}`)
    : null;

  const isActive = product?.isActive === 1 || product?.isActive === "Active";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.();
      }}
      className="group border rounded-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
    >
      <div className="w-full aspect-video bg-gray-100 overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold line-clamp-1">{product.productName}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
            {isActive ? "Active" : "Deactivate"}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-1">${product.price}</div>
        {footer && <div className="mt-3" onClick={(e) => e.stopPropagation()}>{footer}</div>}
      </div>
    </div>
  );
};

export default ProductCard;
