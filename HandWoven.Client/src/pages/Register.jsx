import React, { useState } from 'react';
import { register } from "../auth/AuthService";

const Register = () => {
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
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
    <div className='p-4'>
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <br />
      <label htmlFor="firstName">firstName:</label><br />
      <input type="text" id='firstName' name="firstName" placeholder='John' onChange={handleChange} />
      <br /> <br />
      <label htmlFor="lastName">LastName:</label> <br />
      <input type="text" id='lastName' name="lastName" placeholder='Doe' onChange={handleChange} />
      <br /><br />
      <label htmlFor="email">email:</label><br />
      <input type="email" id='email' name="email" onChange={handleChange} />
      <br /><br />
      <label htmlFor="password">Password:</label><br />
      <input type="password" id='password' name="password" onChange={handleChange} />
      <br /><br />
      <label htmlFor="phone">phone:</label><br />
      <input type="text" placeholder='enter phone...' name="phone" id="phone" onChange={handleChange} />
      <br /> <br />
      <label htmlFor="address">address:</label><br />
      <input type="text" id='address' name="address" placeholder='Your Address...' onChange={handleChange} />
      <br />
      <br /><button type="submit">Register</button>
    </form>
    </div>
  );
}

export default Register;