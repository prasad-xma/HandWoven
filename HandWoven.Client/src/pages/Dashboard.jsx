import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyProfile, updateMyProfile, uploadMyProfileImage } from '../api/userApi';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
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

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getMyProfile();
      setProfile(data);
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
      });

      if (selectedImage) {
        await uploadMyProfileImage(selectedImage);
      }

      toast.success("Profile updated");
      setEditing(false);
      setSelectedImage(null);
      await loadProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{user?.role === "Admin" ? "Dashboard" : "Profile"}</h2>
            <div className="text-sm text-gray-600 mt-1">Manage your account information</div>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-black"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        {loading && (
          <div className="border border-gray-200 bg-white rounded-lg p-4 text-gray-700 animate-pulse">Loading...</div>
        )}

        {!loading && profile && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {profile.profileImgUrl ? (
                    <img
                      src={resolveImg(profile.profileImgUrl)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">No Image</div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</div>
                  <div className="text-sm text-gray-600">{profile.email}</div>
                  <div className="text-xs text-gray-500 mt-1">Role: {profile.role}</div>
                </div>
              </div>

              {!editing && (
                <button
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!editing ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-sm"><span className="font-medium text-gray-900">Phone:</span> <span className="text-gray-700">{profile.phone}</span></div>
                <div className="text-sm"><span className="font-medium text-gray-900">Address:</span> <span className="text-gray-700">{profile.address}</span></div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">First Name</label>
                    <input className="mt-1 w-full border border-gray-300 rounded-md p-2" name="firstName" value={form.firstName} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Last Name</label>
                    <input className="mt-1 w-full border border-gray-300 rounded-md p-2" name="lastName" value={form.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Phone</label>
                    <input className="mt-1 w-full border border-gray-300 rounded-md p-2" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Address</label>
                    <input className="mt-1 w-full border border-gray-300 rounded-md p-2" name="address" value={form.address} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Profile Image (single)</label>
                  <input
                    className="mt-1 block w-full text-sm"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage((e.target.files && e.target.files[0]) || null)}
                  />
                  {selectedImage && (
                    <div className="text-xs text-gray-600 mt-1">Selected: {selectedImage.name}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setSelectedImage(null);
                      setForm({
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        phone: profile.phone || "",
                        address: profile.address || "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {user?.role === "User" && (
            <button
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
              onClick={() => navigate("/seller/register")}
            >
              Create Seller Account
            </button>
          )}

          {user?.role === "Seller" && (
            <button
              className="inline-flex items-center justify-center rounded-md bg-green-600 text-white px-4 py-2 hover:bg-green-700"
              onClick={() => navigate("/seller/s-dashboard")}
            >
              Seller Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;