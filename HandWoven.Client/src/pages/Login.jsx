import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../auth/AuthService";
import { AuthContext } from "../context/AuthContext";
import authImage from "../assets/img/auth/colorful-masks-ceylon-traditional.png";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      loginUser(res.token);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden lg:block relative">
            <img
              src={authImage}
              alt="Traditional Sri Lankan masks"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-white text-2xl font-semibold">Welcome back</div>
              <div className="text-white/90 mt-2 text-sm">Sign in to manage your profile, products and promotions.</div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="max-w-md mx-auto">
              <div className="text-2xl font-semibold text-gray-900">Sign in</div>
              <div className="text-sm text-gray-600 mt-1">Enter your details to continue.</div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/15"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/15"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-black disabled:opacity-50"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>

                <div className="text-sm text-gray-600 text-center">
                  Don&apos;t have an account?{" "}
                  <Link className="text-gray-900 font-medium hover:underline" to="/register">
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;