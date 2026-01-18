import React, { useState } from 'react';
import { register } from "../auth/AuthService";

const Register = () => {
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    role: "User"
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);
      alert("Registration Successful!");
      
    } catch (err) {
      alert("Registration Failed!");
      console.log(err);
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input type="text" name="firstName" placeholder='John' onChange={handleChange} />
      <input type="text" name="lastName" placeholder='Doe' onChange={handleChange} />
      <input type="email" name="email" onChange={handleChange} />
      <input type="password" name="password" onChange={handleChange} />
      <input type="text" name="address" placeholder='Your Address...' onChange={handleChange} />

      <button type="submit">Register</button>
    </form>
  )
}

export default Register;