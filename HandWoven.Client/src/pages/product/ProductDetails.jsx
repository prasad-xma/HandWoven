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
  uploadProductImages,
  deleteProductImage,
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
  const [newImages, setNewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  const handleUploadImages = async () => {
    if (!newImages || newImages.length === 0) return;
    setUploadingImages(true);
    
    try {
      await uploadProductImages(productId, newImages);
      toast.success("Images uploaded");
      setNewImages([]);
      await load();

    } catch (err) {

      toast.error(err?.response?.data?.message || err?.message || "Failed to upload images");
    } finally {

      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (productImageId) => {
    const ok = confirm("Delete this image?");
    if (!ok) return;

    try {
      await deleteProductImage(productImageId);
      toast.success("Image deleted");
      await load();
    } catch (err) {

      toast.error(err?.response?.data?.message || err?.message || "Failed to delete image");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="border border-gray-200 bg-white rounded-lg p-4 text-gray-700 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" onClick={() => navigate(-1)}>Back</button>
          <div className="mt-4 text-red-600">Product not found</div>
        </div>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <button
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <div className="mt-3">
              <div className="text-2xl font-semibold text-gray-900">{product.productName}</div>
              <div className="text-sm text-gray-600 mt-1">Manage details, images and promotions</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editing && (
              <button
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
            <button
              className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="font-semibold text-gray-900">Images</div>
                <div className="text-sm text-gray-600">{images.length} image(s)</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {images.length === 0 && (
                  <div className="col-span-full text-sm text-gray-500">No images</div>
                )}
                {images.map((img) => (
                  <div key={img.productImageId} className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <div className="aspect-video">
                      <img src={resolveImg(img.imageUrl)} alt={product.productName} className="w-full h-full object-cover" />
                    </div>
                    <button
                      className="absolute top-2 right-2 hidden group-hover:inline-flex items-center justify-center rounded-md bg-white/90 text-gray-900 px-2 py-1 text-xs border border-gray-200 hover:bg-white"
                      onClick={() => handleDeleteImage(img.productImageId)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="text-sm font-medium text-gray-900">Add new images</div>
                <div className="text-sm text-gray-600 mt-1">Upload additional images for this product.</div>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    className="block w-full text-sm"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewImages(Array.from(e.target.files || []))}
                  />
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
                    type="button"
                    disabled={uploadingImages || newImages.length === 0}
                    onClick={handleUploadImages}
                  >
                    {uploadingImages ? "Uploading..." : "Upload"}
                  </button>
                </div>
                {newImages.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">Selected: {newImages.length} file(s)</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
          {!editing ? (
            <div className="space-y-2 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div className="text-lg font-semibold text-gray-900">Details</div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{product.description}</div>
              <div className="text-sm text-gray-800">Price: ${product.price}</div>
              <div className="text-sm text-gray-800">Qty: {product.quantity}</div>
              {product.discountPrice != null && (
                <div className="text-sm text-gray-800">Discount: ${product.discountPrice}</div>
              )}
              {product.weight != null && (
                <div className="text-sm text-gray-800">Weight: {product.weight}</div>
              )}
              {product.dimensions && (
                <div className="text-sm text-gray-800">Dimensions: {product.dimensions}</div>
              )}
              {product.materialType && (
                <div className="text-sm text-gray-800">Material: {product.materialType}</div>
              )}
              {product.hashTags && (
                <div className="text-sm text-gray-800"># {product.hashTags}</div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-900">Product Name</label>
                <input className="border border-gray-300 rounded-md p-2 w-full" name="productName" value={form.productName} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Description</label>
                <textarea className="border border-gray-300 rounded-md p-2 w-full" name="description" value={form.description} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Price</label>
                  <input className="border border-gray-300 rounded-md p-2 w-full" type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Quantity</label>
                  <input className="border border-gray-300 rounded-md p-2 w-full" type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Discount Price</label>
                  <input className="border border-gray-300 rounded-md p-2 w-full" type="number" step="0.01" name="discountPrice" value={form.discountPrice} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Weight</label>
                  <input className="border border-gray-300 rounded-md p-2 w-full" type="number" step="0.01" name="weight" value={form.weight} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Dimensions</label>
                  <input className="border border-gray-300 rounded-md p-2 w-full" name="dimensions" value={form.dimensions} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Material Type</label>
                  <input className="border border-gray-300 rounded-md p-2 w-full" name="materialType" value={form.materialType} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Hashtags</label>
                <input className="border border-gray-300 rounded-md p-2 w-full" name="hashTags" value={form.hashTags} onChange={handleChange} />
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                <button className="border border-gray-300 bg-white px-4 py-2 rounded-md hover:bg-gray-50" type="button" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* Promotions */}
          <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
            <div className="font-semibold mb-2 text-gray-900">Promotions</div>
            <PromotionForm onCreate={handleCreatePromotion} />
            <PromotionList promotions={promotions} onDelete={handleDeletePromotion} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductDetails;
