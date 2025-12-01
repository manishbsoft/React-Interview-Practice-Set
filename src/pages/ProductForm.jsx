import React, { useId, useState } from "react";

const ProductForm = ({
    products,
    setProducts,
    form,
    setForm,
    editingId,
    setEditingId
}) => {

    // TODO - see how to use useId for unique ids
    // const id = useId();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleAddOrUpdate = () => {
        // basic validation
        if (!form.name || !form.quantity || !form.price) return;

        if (editingId !== null) {
            // Update existing row
            setProducts((prevProducts) =>
                prevProducts.map((prod) =>
                    prod.id === editingId
                        ? { ...prod, name: form.name, quantity: parseInt(form.quantity, 10), price: parseFloat(form.price) }
                        : prod
                )
            );
            setEditingId(null);
            setForm({ name: "", quantity: "", price: "" });
            return;
        } else {
            // Add new row
            const newRow = {
                id: products.length + 1,
                name: form.name,
                quantity: parseInt(form.quantity, 10),
                price: parseFloat(form.price),
            };
            setProducts((prevProducts) => [...prevProducts, newRow]);
        }
    };

    return (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
                name="name"
                placeholder="Product name"
                value={form.name}
                onChange={handleChange}
            />
            <input
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
            />
            <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
            />
            <button onClick={handleAddOrUpdate}>{editingId ? "Update" : "Add"}</button>
            {editingId && (
                <button
                    onClick={() => {
                        setEditingId(null);
                        setForm({ name: "", quantity: "", price: "" });
                    }}
                >
                    Cancel
                </button>
            )}
        </div>
    )
};

export default ProductForm;
