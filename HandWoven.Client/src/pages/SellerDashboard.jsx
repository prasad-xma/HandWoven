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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Seller Dashboard</h1>
        <button className="cursor-pointer border px-3 py-2" onClick={() => navigate("/seller/addproduct")}>Add Product</button>
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && products.length === 0 && (
        <div className="border p-4">
          <div className="font-semibold">No products yet</div>
          <div className="text-sm">Create your first product to see it here.</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => {
          const isActive = p?.isActive === 1 || p?.isActive === "Active";
          const cover = p?.images?.[0]?.imageUrl ? resolveImg(p.images[0].imageUrl) : null;

          return (
            <div key={p.productId} className="border p-3">
              <div className="flex gap-3">
                <div className="w-24 h-24 border flex items-center justify-center overflow-hidden bg-gray-50">
                  {cover ? (
                    <img src={cover} alt={p.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-gray-500">No Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold">{p.productName}</div>
                  <div className="text-sm">Price: {p.price}</div>
                  <div className="text-sm">Qty: {p.quantity}</div>
                  <div className="text-sm">Status: {isActive ? "Active" : "Deactivate"}</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="cursor-pointer border px-3 py-2 disabled:opacity-50"
                  disabled={updatingId === p.productId}
                  onClick={() => onToggleAvailability(p.productId, 1)}
                >
                  Set Active
                </button>
                <button
                  className="cursor-pointer border px-3 py-2 disabled:opacity-50"
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
  );
};

export default SellerDashboard;