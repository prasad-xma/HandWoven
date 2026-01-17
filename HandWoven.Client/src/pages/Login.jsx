import React, { useState } from 'react';
import {login} from "../auth/AuthService";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({email, password});
      localStorage.setItem("token", res.token);
      alert("Login Successful");
      
    } catch (err) {
      alert("Login Failed");
      console.log(err);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {/* Email */}
      <input type="email" placeholder='your email...' onChange={e => setEmail(e.target.value)} />
      {/* password */}
      <input type="password" placeholder='Your password...' onChange={e => setPassword(e.target.value)} />
    </form>
  );
};

export default Login;