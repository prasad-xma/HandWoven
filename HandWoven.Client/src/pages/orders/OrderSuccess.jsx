import { CartContext } from "../../context/CartContext";
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react'

const OrderSuccess = () => {

  const [searchParams] = useSearchParams();
  const { resetCart } = useContext(CartContext);
  const navigate = useNavigate();

  const status = searchParams.get('redirect_status');
  const paymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    if (status === 'succeeded') {
      resetCart();
    }
  }, [status, resetCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <div className="text-green-500 text-6xl mb-4">Checkmark Icon</div>
        <h1 className="text-2xl font-bold text-gray-800">Payment Received!</h1>
        <p className="text-gray-600 mt-2">Your order is confirmed.</p>
        <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-500 font-mono">
          ID: {paymentIntent}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Shop
        </button>
      </div>
    </div>
  )
}

export default OrderSuccess;