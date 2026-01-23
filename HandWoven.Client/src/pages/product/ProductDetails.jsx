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

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="text-lg font-medium text-gray-900">Loading product details...</div>
              <div className="text-sm text-gray-500 mt-2">Please wait while we fetch your product information</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <button
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 group"
                onClick={() => navigate(-1)}
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {product.productName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Manage product details, images and promotions
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!editing && (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  onClick={() => setEditing(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L15 7m-4 4v8m0 0l4-4m-4 4h8" />
                  </svg>
                  Edit Product
                </button>
              )}
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
                onClick={handleDelete}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-7V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Product
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Images Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l4.586-4.586a2 2 0 012.828 0L16 16" />
                    </svg>
                  </div>
                  Product Images
                  <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l4.586-4.586a2 2 0 012.828 0L16 16" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
                      <p className="text-gray-600 text-sm">Add images to showcase your product to customers</p>
                    </div>
                  )}
                  {images.map((img) => (
                    <div key={img.productImageId} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                      <div className="aspect-square">
                        <img 
                          src={resolveImg(img.imageUrl)} 
                          alt={product.productName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <button
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-3 py-2 text-sm font-medium hover:bg-red-700 shadow-lg"
                        onClick={() => handleDeleteImage(img.productImageId)}
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-7V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Section */}
                <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload New Images</h3>
                    <p className="text-sm text-gray-600 mb-4">Drag and drop or click to select images</p>
                    <input
                      className="block w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-all"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setNewImages(Array.from(e.target.files || []))}
                    />
                    {newImages.length > 0 && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {newImages.length} file{newImages.length > 1 ? 's' : ''} selected
                      </div>
                    )}
                    <button
                      className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      type="button"
                      disabled={uploadingImages || newImages.length === 0}
                      onClick={handleUploadImages}
                    >
                      {uploadingImages ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading Images...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Images
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
              </div>
              
              {!editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Name</label>
                    <input 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                      name="productName" 
                      value={form.productName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                      rows="4" 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Price</label>
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        type="number" 
                        step="0.01" 
                        name="price" 
                        value={form.price} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        type="number" 
                        name="quantity" 
                        value={form.quantity} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Discount Price</label>
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        type="number" 
                        step="0.01" 
                        name="discountPrice" 
                        value={form.discountPrice} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Weight (kg)</label>
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        type="number" 
                        step="0.01" 
                        name="weight" 
                        value={form.weight} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Dimensions</label>
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        name="dimensions" 
                        value={form.dimensions} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Material Type</label>
                      <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        name="materialType" 
                        value={form.materialType} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Hashtags</label>
                    <input 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                      name="hashTags" 
                      value={form.hashTags} 
                      onChange={handleChange} 
                      placeholder="handmade, artisan, craft" 
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg disabled:opacity-50 font-medium" 
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      className="px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors" 
                      type="button" 
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg">{product.description}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-semibold text-gray-900">${product.price}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="font-semibold text-gray-900">{product.quantity}</span>
                    </div>
                    {product.discountPrice != null && (
                      <div className="col-span-2 flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-green-700">Discount Price:</span>
                        <span className="font-semibold text-green-600">${product.discountPrice}</span>
                      </div>
                    )}
                    {product.weight != null && (
                      <div className="col-span-2 flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Weight:</span>
                        <span className="font-semibold text-gray-900">{product.weight} kg</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="col-span-2 flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Dimensions:</span>
                        <span className="font-semibold text-gray-900">{product.dimensions}</span>
                      </div>
                    )}
                    {product.materialType && (
                      <div className="col-span-2 flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Material:</span>
                        <span className="font-semibold text-gray-900">{product.materialType}</span>
                      </div>
                    )}
                    {product.hashTags && (
                      <div className="col-span-2 flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-700">Tags:</span>
                        <span className="font-semibold text-blue-600">#{product.hashTags}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Promotions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-2 1.343-2 3-2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Promotions</h3>
              </div>
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