import { useContext, useEffect, useState } from "react";
import { getCart } from "../api/cartApi";
import { AuthContext } from "./AuthContext";

import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {

        const fetchCartCount = async () => {

            if (!user) {
                setCartItemCount(0);
                return;
            }

            try {
                const cart = await getCart();
                setCartItemCount(cart.totalItems || 0);

            } catch (err) {
                console.error("Fail to fetch cart count:", err);
                setCartItemCount(0);
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
            const cart = await getCart();
            setCartItemCount(cart.totalItems || 0);

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
};
