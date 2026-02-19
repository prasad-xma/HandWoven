import { CartContext } from "../../context/CartContext";
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react'
import { confirmPayment } from "../../api/paymentApi";

const OrderSuccess = () => {

  const [searchParams] = useSearchParams();
  const { resetCart } = useContext(CartContext);
  const navigate = useNavigate();

  // var [confirmationStatus, setConfirmationStatus] = useState('pending');

  const status = searchParams.get('redirect_status');
  const paymentIntent = searchParams.get('payment_intent');
  // const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

  const [confirmationStatus, setConfirmationStatus] = useState(() => {
    if (status === 'succeeded' && paymentIntent){
      return 'pending';
    }
    return 'error';
  });

  useEffect(() => {
    if (status === 'succeeded' && paymentIntent && confirmationStatus === 'pending') {
      confirmPayment(paymentIntent)
        .then(() => {
          setConfirmationStatus('success');
          resetCart();
        })
        .catch((err) => {
          console.error('Failed to confim payment...', err);
          setConfirmationStatus('error');
        });

    }
  }, [status, paymentIntent, resetCart, confirmationStatus]);

  return (
    /*
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
    */
   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        {confirmationStatus === 'pending' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Confirming your payment...</h2>
          </>
        )}
        {confirmationStatus === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Received!</h1>
            <p className="text-gray-600 mt-2">Your order is confirmed and will be processed shortly.</p>
            <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-500 font-mono break-all">
              ID: {paymentIntent}
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Shop
            </button>
          </>
        )}
        {confirmationStatus === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Issue</h1>
            <p className="text-gray-600 mt-2">
              We couldn't confirm your payment. Please check your email for order details or contact support.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderSuccess;