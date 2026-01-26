import { useCallback, useContext, useEffect, useState } from "react";
import { getCart } from "../api/cartApi";
import { AuthContext } from "./AuthContext";

import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [cart, setCart] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCart(null);
            setCartItemCount(0);
            return;
        }

        try {
            const data = await getCart();
            setCart(data);
            setCartItemCount(data.totalItems || 0);
        } catch (err) {
            console.error("Fail to fetch cart:", err);
            setCart(null);
            setCartItemCount(0);
        }
    }, [user]);

    useEffect(() => {
        const loadCart = async () => {
            await fetchCart();
        };

        loadCart();
    
    }, [fetchCart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                fetchCart,
                cartItemCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};



/*
export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    //const [cart, setCart] = useState(null); // to set the cart data for stripe
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {

        const fetchCartCount = async () => {

            if (!user) {
                // setCart(null);
                setCartItemCount(0);
                return;
            }

            try {
                const data = await getCart();
                // setCart(data); // set the cart data
                setCartItemCount(data.totalItems || 0);

            } catch (err) {
                console.error("Fail to fetch cart count:", err);
                setCartItemCount(0);
                // setCart(null);
            }
        };

        fetchCartCount();

    }, [user]);


    const refreshCartCount = async () => {
        if (!user) {
            setCartItemCount(0);
            return;
        };
        
        try {
            const data = await getCart();
            setCartItemCount(data.totalItems || 0);

        } catch (err) {
            console.error("Fail to fetch cart count:", err);
            setCartItemCount(0);
        }
    }

    return (
        <CartContext.Provider value={{ cartItemCount, refreshCartCount }}>
            {children}
        </CartContext.Provider>
    );
}; */
