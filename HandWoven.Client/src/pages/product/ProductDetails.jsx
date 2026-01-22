import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  listPromotions,
  createPromotion,
  deletePromotion,
} from "../../api/productApi";

import PromotionForm from "./components/PromotionForm";
import PromotionList from "./components/PromotionList";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    discountPrice: "",
    weight: "",
    dimensions: "",
    materialType: "",
    hashTags: "",
  });

  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env?.VITE_API_BASE_URL;
    return base ? base.replace(/\/$/, "") : "http://localhost:5057";
  }, []);

  const resolveImg = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${apiBaseUrl}${url}`;
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProductById(productId);
      setProduct(data);
      setForm({
        productName: data.productName || "",
        description: data.description || "",
        price: data.price ?? "",
        quantity: data.quantity ?? "",
        discountPrice: data.discountPrice ?? "",
        weight: data.weight ?? "",
        dimensions: data.dimensions || "",
        materialType: data.materialType || "",
        hashTags: data.hashTags || "",
      });
      const promoData = await listPromotions(productId);
      setPromotions(Array.isArray(promoData) ? promoData : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        productName: form.productName,
        description: form.description,
        price: form.price === "" ? undefined : Number(form.price),
        quantity: form.quantity === "" ? undefined : Number(form.quantity),
        discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
        weight: form.weight === "" ? undefined : Number(form.weight),
        dimensions: form.dimensions || undefined,
        materialType: form.materialType || undefined,
        hashTags: form.hashTags || undefined,
      };
      await updateProduct(productId, payload);
      toast.success("Product updated");
      setEditing(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = confirm("Delete this product? This cannot be undone.");
    if (!ok) return;

    try {
      await deleteProduct(productId);
      toast.success("Product deleted");
      navigate("/seller/s-dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
    }
  };

  const handleCreatePromotion = async (values) => {
    try {
      await createPromotion(productId, values);
      toast.success("Promotion created");
      const data = await listPromotions(productId);
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create promotion");
    }
  };

  const handleDeletePromotion = async (promoId) => {
    try {
      await deletePromotion(productId, promoId);
      toast.success("Promotion deleted");
      const data = await listPromotions(productId);
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete promotion");
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="p-4">
        <button className="border px-3 py-2" onClick={() => navigate(-1)}>Back</button>
        <div className="mt-4 text-red-600">Product not found</div>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button className="border px-3 py-2" onClick={() => navigate(-1)}>Back</button>
        <div className="flex items-center gap-2">
          {!editing && (
            <button className="border px-3 py-2" onClick={() => setEditing(true)}>Edit</button>
          )}
          <button className="border px-3 py-2 text-white bg-red-600" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.length === 0 && (
              <div className="col-span-full text-sm text-gray-500">No images</div>
            )}
            {images.map((img) => (
              <div key={img.productImageId} className="aspect-video bg-gray-100 overflow-hidden">
                <img src={resolveImg(img.imageUrl)} alt={product.productName} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-1">
          {!editing ? (
            <div className="space-y-2 p-3 border rounded-md bg-white">
              <div className="text-lg font-semibold">{product.productName}</div>
              <div className="text-gray-700 whitespace-pre-wrap">{product.description}</div>
              <div className="text-sm">Price: ${product.price}</div>
              <div className="text-sm">Qty: {product.quantity}</div>
              {product.discountPrice != null && (
                <div className="text-sm">Discount: ${product.discountPrice}</div>
              )}
              {product.weight != null && (
                <div className="text-sm">Weight: {product.weight}</div>
              )}
              {product.dimensions && (
                <div className="text-sm">Dimensions: {product.dimensions}</div>
              )}
              {product.materialType && (
                <div className="text-sm">Material: {product.materialType}</div>
              )}
              {product.hashTags && (
                <div className="text-sm"># {product.hashTags}</div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3 p-3 border rounded-md bg-white">
              <div>
                <label className="block">Product Name</label>
                <input className="border p-2 w-full" name="productName" value={form.productName} onChange={handleChange} required />
              </div>
              <div>
                <label className="block">Description</label>
                <textarea className="border p-2 w-full" name="description" value={form.description} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block">Price</label>
                  <input className="border p-2 w-full" type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block">Quantity</label>
                  <input className="border p-2 w-full" type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block">Discount Price</label>
                  <input className="border p-2 w-full" type="number" step="0.01" name="discountPrice" value={form.discountPrice} onChange={handleChange} />
                </div>
                <div>
                  <label className="block">Weight</label>
                  <input className="border p-2 w-full" type="number" step="0.01" name="weight" value={form.weight} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block">Dimensions</label>
                  <input className="border p-2 w-full" name="dimensions" value={form.dimensions} onChange={handleChange} />
                </div>
                <div>
                  <label className="block">Material Type</label>
                  <input className="border p-2 w-full" name="materialType" value={form.materialType} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block">Hashtags</label>
                <input className="border p-2 w-full" name="hashTags" value={form.hashTags} onChange={handleChange} />
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                <button className="border px-4 py-2" type="button" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* Promotions */}
          <div className="mt-6 p-3 border rounded-md bg-white">
            <div className="font-semibold mb-2">Promotions</div>
            <PromotionForm onCreate={handleCreatePromotion} />
            <PromotionList promotions={promotions} onDelete={handleDeletePromotion} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
