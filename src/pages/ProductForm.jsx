import React from "react";
import useForm from "../hooks/formHook";

export default function ProductForm() {
  const validate = (name, value) => {
    if (name === "name" && !value.trim()) 
      return "Name is required";

    if (name === "quantity") {
      if (!value) return "Quantity is required";
      if (value <= 0) return "Quantity must be greater than 0";
    }

    if (name === "price") {
      if (!value) return "Price is required";
      if (value <= 0) return "Price must be greater than 0";
    }

    return "";
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
    { name: "", quantity: "", price: "" },
    validate
  );

  const onSubmit = (formValues) => {
    console.log("Form Submitted:", formValues);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <h2>Add Product</h2>

      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={values.name}
        onChange={handleChange}
        style={styles.input}
      />
      {errors.name && <p style={styles.error}>{errors.name}</p>}

      <label>Quantity:</label>
      <input
        type="number"
        name="quantity"
        value={values.quantity}
        onChange={handleChange}
        style={styles.input}
      />
      {errors.quantity && <p style={styles.error}>{errors.quantity}</p>}

      <label>Price:</label>
      <input
        type="number"
        name="price"
        value={values.price}
        onChange={handleChange}
        style={styles.input}
      />
      {errors.price && <p style={styles.error}>{errors.price}</p>}

      <button type="submit" style={styles.button}>Submit</button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    margin: "20px auto",
    gap: "10px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid gray",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "-8px",
  },
  button: {
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
