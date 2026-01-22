import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyProducts, updateProductAvailability } from "../api/productApi";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getMyProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env?.VITE_API_BASE_URL;
    return base ? base.replace(/\/$/, "") : "http://localhost:5057";
  }, []);

  const resolveImg = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${apiBaseUrl}${url}`;
  };

  const onToggleAvailability = async (productId, nextIsActive) => {
    setUpdatingId(productId);

    try {
      await updateProductAvailability(productId, nextIsActive);
      toast.success("Availability updated!");
      await fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update availability");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Seller Dashboard</h1>
            <div className="text-sm text-gray-600 mt-1">Manage your products and availability</div>
          </div>
          <button
            className="cursor-pointer inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/30"
            onClick={() => navigate("/seller/addproduct")}
          >
            Add Product
          </button>
        </div>

        {isLoading && (
          <div className="border border-gray-200 bg-white rounded-lg p-4 text-gray-700 animate-pulse">
            Loading products...
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="border border-gray-200 bg-white rounded-xl p-6">
            <div className="font-semibold text-gray-900">No products yet</div>
            <div className="text-sm text-gray-600 mt-1">Create your first product to see it here.</div>
            <button
              className="mt-4 cursor-pointer inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              onClick={() => navigate("/seller/addproduct")}
            >
              Add your first product
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const isActive = p?.isActive === 1 || p?.isActive === "Active";
            const cover = p?.images?.[0]?.imageUrl ? resolveImg(p.images[0].imageUrl) : null;

            return (
              <div
                key={p.productId}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-100 shrink-0">
                    {cover ? (
                      <img src={cover} alt={p.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-gray-500">No Image</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-gray-900 truncate">{p.productName}</div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {isActive ? "Active" : "Deactivate"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">Price: {p.price}</div>
                    <div className="text-sm text-gray-700">Qty: {p.quantity}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="cursor-pointer inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    onClick={() => navigate(`/seller/product/${p.productId}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900/15"
                    disabled={updatingId === p.productId}
                    onClick={() => onToggleAvailability(p.productId, 1)}
                  >
                    Set Active
                  </button>
                  <button
                    className="cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900/15"
                    disabled={updatingId === p.productId}
                    onClick={() => onToggleAvailability(p.productId, 2)}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;