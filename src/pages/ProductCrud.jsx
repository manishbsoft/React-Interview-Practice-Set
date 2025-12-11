import React, { useEffect, useState } from "react";
import ReusableTable from "../components/Table/ReusableTable";
import useForm from "../hooks/formHook";

const fetchMockData = () =>
    Promise.resolve({
        data: [
            { id: 1, name: "Gold", quantity: 10, price: 10000 },
            { id: 2, name: "Silver", quantity: 5, price: 5000 },
        ]
    })

const ProductCrud = () => {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchMockData().then((res) => setProducts(res.data));
    }, [])

    const columns = [
        { key: "name", label: "Name" },
        { key: "quantity", label: "Quantity" },
        { key: "price", label: "Price" }
    ]

    const filteredProducts = products.filter((p) =>
        Object.values(p)
            .join(" ")
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()))

    const { values, handleChange, resetForm } = useForm({
        name: "",
        quantity: "",
        price: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted: ", values);
        resetForm();
    }

    return (
        <div style={{ margin: 20 }}>
            <h2>Product Management</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Add Product</h2>
                <input type="text" placeholder="Name" value={values.name} onChange={handleChange} style={styles.input} />
                <input type="number" placeholder="Quantity" value={values.quantity} onChange={handleChange} style={styles.input} />
                <input type="number" placeholder="Price" value={values.price} onChange={handleChange} style={styles.input} />
                <button type="submit" style={styles.button}>Submit</button>
            </form>

            <input
                style={{ padding: 8, width: 300, marginBottom: 20 }}
                placeholder="Search Text ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ReusableTable columns={columns} data={filteredProducts} />
        </div>
    )
}

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        width: "280px",
        margin: "20px auto",
        gap: "10px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadious: "8px",
    },
    input: {
        padding: "8px",
        borderRadious: "4px",
        border: "1px solid grey",
    },
    button: {
        padding: "10px",
        background: "black",
        color: "white",
        border: "none",
        borderRadious: "4px",
        cursor: "pointer",
    }
}

export default ProductCrud;
