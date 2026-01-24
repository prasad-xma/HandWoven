import React, { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const role = user?.role;

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
      links.push({ label: "Cart", to: "/cart" });
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
