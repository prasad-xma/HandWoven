import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerSeller } from '../api/sellerApi';

const SellerRegister = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        BusinessName: "",
        BusinessAddress: "",
        ContactPhone: "",
        ShopName: "",
        Address: "",
        ShopContact: "",
        ShopEmail: "",
        ImgUrl: "",
        SocialAcc: "",
        Bio: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // register the user as a seller
            await registerSeller(form);
            localStorage.removeItem("token"); // remove the jwt token
            navigate("/login"); // navigate back to login page

        } catch (err) {
            alert(err.response?.data?.message || "Seller registration faild!");
        }
    };
    
    return (
        <div>
            <h2>Seller Registration</h2>

            <form onSubmit={handleSubmit}>
                <h4>Business Info</h4><br />
                <label htmlFor="BusinessName">BusinessName:</label><br />
                <input type="text" required placeholder='BusinessName' onChange={handleChange} name="BusinessName" id="BusinessName" />
                <br /><br />
                <label htmlFor="BusinessAddress">BusinessAddress:</label> <br />
                <input type="text" name="BusinessAddress" id="BusinessAddress" placeholder='BusinessAddress' required />
                <br /><br />
                <label htmlFor="contactPhone">contactPhone:</label><br />
                <input name="contactPhone" placeholder="Contact Phone" onChange={handleChange} />
                <br /><br />
                
                <h4>====== Shop Info ==========</h4>
                <input type="text" name="ShopName" onChange={handleChange} placeholder='ShopName...' required />
                <br />
                <input type="text" name="Address" onChange={handleChange} placeholder='Address' required />
                <br />
                <input type="text" name="ShopContact" onChange={handleChange} placeholder='ShopContact' required />
                <br />
                <input type="text" name="ShopEmail" placeholder='ShopEmail' onChange={handleChange} required />
                <br />
                <input type="text" name="ImgUrl" placeholder='ImgUrl' onChange={handleChange} />
                <br />
                <input type="text" name="SocialAcc" onChange={handleChange} placeholder='SocialAcc..' />
                <br />
                <textarea name='bio' placeholder='Shop Bio...' onChange={handleChange} />

            </form>
        </div>
    );
}

export default SellerRegister;