import React, { useContext, useState } from 'react';
import {login} from "../auth/AuthService";
// import { AuthProvider } from '../context/AuthProvider';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({email, password});
      loginUser(res.token);
      // console.log(res.token);
      navigate("/dashboard");
      
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
      <br />
      <input type="password" placeholder='Your password...' onChange={e => setPassword(e.target.value)} />
      <br /><button type="submit">Submit</button>
    </form>
  );
};

export default Login;