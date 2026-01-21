import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct, uploadProductImages } from "../../api/productApi";

const AddProduct = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createdProductId, setCreatedProductId] = useState(null);

  const [form, setForm] = useState({
    ProductName: "",
    Description: "",
    Price: "",
    Quantity: "",
    DiscountPrice: "",
    Weight: "",
    Dimensions: "",
    MaterialType: "",
    HashTags: "",
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const productPayload = useMemo(() => {
    const price = form.Price === "" ? "" : Number(form.Price);
    const quantity = form.Quantity === "" ? "" : Number(form.Quantity);

    return {
      ProductName: form.ProductName,
      Description: form.Description,
      Price: price,
      Quantity: quantity,
      DiscountPrice: form.DiscountPrice === "" ? null : Number(form.DiscountPrice),
      Weight: form.Weight === "" ? null : Number(form.Weight),
      Dimensions: form.Dimensions === "" ? null : form.Dimensions,
      MaterialType: form.MaterialType === "" ? null : form.MaterialType,
      HashTags: form.HashTags === "" ? null : form.HashTags,
    };
  }, [form]);

  const onCreateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createProduct(productPayload);
      const productId = res?.productId;

      if (!productId) {
        throw new Error("Missing productId from API response");
      }

      setCreatedProductId(productId);
      toast.success(res?.message || "Product created");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSelectFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const onUploadImages = async () => {
    if (!createdProductId) {
      toast.error("Please create the product first");
      return;
    }

    if (!files.length) {
      toast.error("Please select at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await uploadProductImages(createdProductId, files);
      toast.success(res?.message || "Images uploaded");
      navigate("/seller/s-dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to upload images");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Add Product</h2>
        <button className="cursor-pointer" onClick={() => navigate("/seller/s-dashboard")}>Back</button>
      </div>

      {step === 1 && (
        <form onSubmit={onCreateProduct} className="space-y-3">
          <div>
            <label className="block">Product Name</label>
            <input
              className="border p-2 w-full"
              name="ProductName"
              value={form.ProductName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block">Description</label>
            <textarea
              className="border p-2 w-full"
              name="Description"
              value={form.Description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block">Price</label>
              <input
                className="border p-2 w-full"
                type="number"
                step="0.01"
                name="Price"
                value={form.Price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block">Quantity</label>
              <input
                className="border p-2 w-full"
                type="number"
                name="Quantity"
                value={form.Quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block">Discount Price (optional)</label>
              <input
                className="border p-2 w-full"
                type="number"
                step="0.01"
                name="DiscountPrice"
                value={form.DiscountPrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block">Weight (optional)</label>
              <input
                className="border p-2 w-full"
                type="number"
                step="0.01"
                name="Weight"
                value={form.Weight}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block">Dimensions (optional)</label>
              <input
                className="border p-2 w-full"
                name="Dimensions"
                value={form.Dimensions}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block">Material Type (optional)</label>
              <input
                className="border p-2 w-full"
                name="MaterialType"
                value={form.MaterialType}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block">Hashtags (optional)</label>
            <input
              className="border p-2 w-full"
              name="HashTags"
              value={form.HashTags}
              onChange={handleChange}
              placeholder="#handmade #woven"
            />
          </div>

          <div className="flex gap-2">
            <button
              className="cursor-pointer bg-green-600 text-white px-4 py-2 disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Next"}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="p-3 border">
            <div className="font-semibold">Product created</div>
            <div>ProductId: {createdProductId}</div>
          </div>

          <div>
            <label className="block">Upload product images</label>
            <input className="border p-2 w-full" type="file" accept="image/*" multiple onChange={onSelectFiles} />
          </div>

          {previews.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="w-24 h-24 object-cover border" />
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              className="cursor-pointer border px-4 py-2"
              type="button"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
              type="button"
              onClick={onUploadImages}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;