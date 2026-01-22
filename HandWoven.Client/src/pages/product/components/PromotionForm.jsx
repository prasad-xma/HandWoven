import React, { useState } from "react";

const PromotionForm = ({ onCreate }) => {
  const [values, setValues] = useState({
    discountValue: "",
    validFrom: "",
    validUntil: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.discountValue || !values.validFrom || !values.validUntil) return;

    await onCreate({
      discountValue: Number(values.discountValue),
      validFrom: values.validFrom,
      validUntil: values.validUntil,

    });

    setValues({ discountValue: "", validFrom: "", validUntil: "" });
    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="block text-sm">Discount</label>
          <input
            className="border p-2 w-full"
            type="number"
            step="0.01"
            name="discountValue"
            value={values.discountValue}
            onChange={handleChange}
            placeholder="e.g. 10.00"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Valid From</label>
          <input
            className="border p-2 w-full"
            type="date"
            name="validFrom"
            value={values.validFrom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Valid Until</label>
          <input
            className="border p-2 w-full"
            type="date"
            name="validUntil"
            value={values.validUntil}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <button className="bg-green-600 text-white px-4 py-2" type="submit">Add Promotion</button>
    </form>
  );
};

export default PromotionForm;
