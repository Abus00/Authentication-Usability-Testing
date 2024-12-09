import React, { useState, useEffect } from "react";

export default function PersonalInfoForm({ onNext, email }) {
  const [formData, setFormData] = useState({
    name: "",
    email: email || "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, email }));
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form className="personal-info-form" onSubmit={handleSubmit}>
      <h2>Personal Information</h2>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      </label>
      <label>
        Gender:
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>
      <button type="submit">Next</button>
    </form>
  );
}