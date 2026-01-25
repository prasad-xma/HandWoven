import React, { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// import { getCart } from "../../api/cartApi";

import { CartContext } from "../../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  // const [cartItemCount, setCartItemCount] = useState(0);

  const role = user?.role;

  const { cartItemCount } = useContext(CartContext);

  /*
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const cart = await getCart();
          setCartItemCount(cart.totalItems || 0);
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, [user]); */

  const items = useMemo(() => {
    const links = [{ label: "Home", to: "/" }];

    if (!user) {
      links.push({ label: "Sign in", to: "/login" });
      links.push({ label: "Sign up", to: "/register" });
      return links;
    }

    if (role === "Admin" || role === "SysManager") {
      links.push({ label: "Dashboard", to: "/dashboard" });
    } else {
      links.push({ label: "Profile", to: "/dashboard" });
    }

    if (role === "User") {
      links.push({ label: "Become Seller", to: "/seller/register" });
    }

    if (role === "Seller") {
      links.push({ label: "Seller Dashboard", to: "/seller/s-dashboard" });
      links.push({ label: "Add Product", to: "/seller/addproduct" });
    }

    return links;
  }, [user, role]);

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          <button
            className="font-semibold text-gray-900"
            onClick={() => navigate("/")}
            type="button"
          >
            HandWoven
          </button>

          <div className="flex items-center gap-2">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                {it.label}
              </Link>
            ))}

            {user && (
              <>
                {/* Order Icon */}
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Orders"
                  onClick={() => navigate('/orders')}
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </button>

                {/* Shopping Cart Icon */}
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                  title="Shopping Cart"
                  onClick={() => navigate('/cart')}
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {/* Cart Badge */}
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {user && (
              <button
                className="ml-2 px-3 py-2 rounded-md text-sm bg-gray-900 text-white hover:bg-black"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                type="button"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
