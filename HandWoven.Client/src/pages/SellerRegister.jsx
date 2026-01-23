import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSeller } from '../api/sellerApi';
import sellerRegImage from '../assets/img/auth/register/seller_reg/seller_reg.png';

const SellerRegister = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        BusinessName: "",
        BusinessAddress: "",
        ContactPhone: "",
        ShopName: "",
        Address: "",
        ShopContact: "",
        ShopEmail: "",
        ImgUrl: "",
        SocialAcc: "",
        Bio: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!form.BusinessName.trim()) newErrors.BusinessName = 'Business name is required';
            if (!form.BusinessAddress.trim()) newErrors.BusinessAddress = 'Business address is required';
            if (!form.ContactPhone.trim()) newErrors.ContactPhone = 'Contact phone is required';
        } else if (step === 2) {
            if (!form.ShopName.trim()) newErrors.ShopName = 'Shop name is required';
            if (!form.Address.trim()) newErrors.Address = 'Shop address is required';
            if (!form.ShopContact.trim()) newErrors.ShopContact = 'Shop contact is required';
            if (!form.ShopEmail.trim()) {
                newErrors.ShopEmail = 'Shop email is required';
            } else if (!/\S+@\S+\.\S+/.test(form.ShopEmail)) {
                newErrors.ShopEmail = 'Please enter a valid email';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(2)) return;
        
        setLoading(true);
        try {
            await registerSeller(form);
            localStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Seller registration failed!");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h3>
                            <p className="text-gray-600">Tell us about your business</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Name *
                                </label>
                                <input
                                    type="text"
                                    name="BusinessName"
                                    value={form.BusinessName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.BusinessName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your business name"
                                />
                                {errors.BusinessName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.BusinessName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Address *
                                </label>
                                <textarea
                                    name="BusinessAddress"
                                    value={form.BusinessAddress}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.BusinessAddress ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your business address"
                                />
                                {errors.BusinessAddress && (
                                    <p className="mt-1 text-sm text-red-600">{errors.BusinessAddress}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="ContactPhone"
                                    value={form.ContactPhone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.ContactPhone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your contact phone number"
                                />
                                {errors.ContactPhone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ContactPhone}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
                
            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Shop Details</h3>
                            <p className="text-gray-600">Set up your shop profile</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    name="ShopName"
                                    value={form.ShopName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.ShopName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your shop name"
                                />
                                {errors.ShopName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ShopName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shop Address *
                                </label>
                                <textarea
                                    name="Address"
                                    value={form.Address}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.Address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your shop address"
                                />
                                {errors.Address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.Address}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shop Contact *
                                    </label>
                                    <input
                                        type="tel"
                                        name="ShopContact"
                                        value={form.ShopContact}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.ShopContact ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Shop phone number"
                                    />
                                    {errors.ShopContact && (
                                        <p className="mt-1 text-sm text-red-600">{errors.ShopContact}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shop Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="ShopEmail"
                                        value={form.ShopEmail}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.ShopEmail ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="shop@example.com"
                                    />
                                    {errors.ShopEmail && (
                                        <p className="mt-1 text-sm text-red-600">{errors.ShopEmail}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shop Image URL
                                </label>
                                <input
                                    type="url"
                                    name="ImgUrl"
                                    value={form.ImgUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com/shop-image.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Social Media Account
                                </label>
                                <input
                                    type="text"
                                    name="SocialAcc"
                                    value={form.SocialAcc}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="@yourshop"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shop Bio
                                </label>
                                <textarea
                                    name="Bio"
                                    value={form.Bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tell customers about your shop..."
                                />
                            </div>
                        </div>
                    </div>
                );
                
            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h3>
                            <p className="text-gray-600">Please review your information before submitting</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Business Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Business Name:</span>
                                        <p className="font-medium text-gray-900">{form.BusinessName || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Contact Phone:</span>
                                        <p className="font-medium text-gray-900">{form.ContactPhone || 'Not provided'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500">Business Address:</span>
                                        <p className="font-medium text-gray-900">{form.BusinessAddress || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t pt-6">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Shop Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Shop Name:</span>
                                        <p className="font-medium text-gray-900">{form.ShopName || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Shop Contact:</span>
                                        <p className="font-medium text-gray-900">{form.ShopContact || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Shop Email:</span>
                                        <p className="font-medium text-gray-900">{form.ShopEmail || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Social Account:</span>
                                        <p className="font-medium text-gray-900">{form.SocialAcc || 'Not provided'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-gray-500">Shop Address:</span>
                                        <p className="font-medium text-gray-900">{form.Address || 'Not provided'}</p>
                                    </div>
                                    {form.ImgUrl && (
                                        <div className="md:col-span-2">
                                            <span className="text-gray-500">Shop Image:</span>
                                            <p className="font-medium text-gray-900">{form.ImgUrl}</p>
                                        </div>
                                    )}
                                    {form.Bio && (
                                        <div className="md:col-span-2">
                                            <span className="text-gray-500">Shop Bio:</span>
                                            <p className="font-medium text-gray-900">{form.Bio}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> By submitting this form, you agree to our terms and conditions for sellers.
                            </p>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Back to Dashboard */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Side - Image */}
                        <div className="hidden lg:block relative">
                            <img
                                src={sellerRegImage}
                                alt="Seller Registration"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <h2 className="text-3xl font-bold mb-2">Join Our Seller Community</h2>
                                    <p className="text-blue-100">Start selling your handmade products to customers worldwide</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="p-8 lg:p-12">
                            {/* Progress Steps */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                                                    currentStep === step
                                                        ? 'bg-blue-600 text-white'
                                                        : currentStep > step
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}
                                            >
                                                {currentStep > step ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    step
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <p className={`text-sm font-medium ${
                                                    currentStep >= step ? 'text-gray-900' : 'text-gray-500'
                                                }`}>
                                                    {step === 1 ? 'Business Info' : step === 2 ? 'Shop Details' : 'Review'}
                                                </p>
                                            </div>
                                            {step < 3 && (
                                                <div className={`w-12 h-1 mx-4 ${
                                                    currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                                                }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {renderStep()}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-6">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    
                                    <div className="ml-auto">
                                        {currentStep < 3 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                                            >
                                                Next
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Submit Registration
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerRegister;