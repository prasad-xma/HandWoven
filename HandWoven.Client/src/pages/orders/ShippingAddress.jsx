import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import api from '../../api/axios';

const ShippingAddress = () => {

    const navigate = useNavigate();
    const { cart } = useContext(CartContext);

    const [formData, setFormData] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        additionalPhoneNo: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // refirect if cart is empty
    useEffect(() => {
        if (cart && cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleChanges = (e) => {
        setFormData({ ...formData, [e.formData.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/checkout/create-order', {
                ShippingAddress: formData
            });

            const { ClientSecret, OrderId } = response.data;

            // pass data via query params
            navigate(`/checkout/payment?clientSecret=${encodeURIComponent(ClientSecret)}&OrderId`);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Fail to create order, please try again...');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>
                    {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address Line 1 *</label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChanges}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChanges}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City *</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChanges}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChanges}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country *</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChanges}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postal Code *</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChanges}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Additional Phone No</label>
                            <input
                                type="text"
                                name="additionalPhoneNo"
                                value={formData.additionalPhoneNo}
                                onChange={handleChanges}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/cart')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Back to Cart
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Continue to Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ShippingAddress;