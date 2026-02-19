import { loadStripe } from "@stripe/stripe-js";

import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

// api
// import { createPaymentIntent } from "../../api/paymentApi";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// console.log(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY || ""
);

// form 
const CheckOutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:5173/order-success",

            },
        });

        if (result.error) {
            alert(result.error.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />

            <button disabled={!stripe || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
                {loading ? "Processing..." : `Pay $${amount}`}
            </button>
        </form>
    );
};



// ------------ page -----------------------

export default function Checkout() {

    const location = useLocation();
    const navigate = useNavigate();
    
    console.log('Checkout - location.state:', location.state);
    
    const [clientSecret, _setClientSecret] = useState(() => location.state?.clientSecret || null);
    const [amount, _setAmount] = useState(() => location.state?.amount || null);


    useEffect(() => {
        console.log('Checkout useEffect - clientSecret:', clientSecret, 'location.state?.clientSecret:', location.state?.clientSecret);
        if (!location.state?.clientSecret) {
            console.log('Redirecting to shipping - no clientSecret found');
            navigate('/shipping');
        }
    }, [location, navigate, clientSecret]);


    if (!clientSecret || !amount) {
        /* return (
            <div className="flex flex-col items-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p>Initializing secure payment...</p>
            </div>
        ); */

        return (
            <>
                <div className="flex flex-col items-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2">

                    </div>

                    <p>Loading payment details...</p>
                </div>
            </>
        );
    }

    /*
    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-10">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckOutForm amount={cart.total} />
            </Elements>
        </div>
    ); */

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-10">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckOutForm amount={amount} />
            </Elements>
        </div>
    );

}