import React, { useState, useEffect, useId, startTransition, useMemo } from "react";
import ReusableTable from "../components/Table/ReusableTable";
import { fetchMockData } from "./fetchMockData";
import ProductForm from "./ProductForm";
import SearchBar from "../components/Table/SearchBar";

const ProductPage = () => {
    // core data
    const [products, setProducts] = React.useState([]);
    // form state
    const [form, setForm] = useState({ name: "", quantity: "", price: "" });

    // editing: stores id being edited (null if adding)
    const [editingId, setEditingId] = useState(null);

    // search & sort state
    const [searchValue, setSearchValue] = useState("");
    const [sorting, setSorting] = useState({ column: "id", order: "asc" });

    // Load mock data on component mount
    useEffect(() => {
        fetchMockData().then((response) => {
            setProducts(response.data);
        });
    }, []);

    const handleEdit = (id) => {
        const toEdit = products.find((p) => p.id === id);
        if (!toEdit) return;
        setForm({ name: toEdit.name, quantity: String(toEdit.quantity), price: String(toEdit.price) });
        setEditingId(id);
    };

    const handleDelete = (id) => {
        // confirm removal (optional)
        if (!window.confirm("Delete this product?")) return;
        console.log("Delete product with id:", id);
        setProducts((prevProducts) => prevProducts.filter((prod) => prod.id !== id));
    };

    const handleSearch = (value) => {
        startTransition(() => {
            setSearchValue(value);
            //   setPage(1); // reset page
        });
    };
    console.log("Search value:", searchValue);

    // derived: filtered + sorted
    const filteredSorted = useMemo(() => {
        const s = searchValue.toLowerCase();

        const filtered = products.filter((p) => p.name.toLowerCase().includes(s));

        const sorted = [...filtered].sort((a, b) => {
            const val1 = a[sorting.column];
            const val2 = b[sorting.column];

            // numeric compare if both numbers
            if (typeof val1 === "number" && typeof val2 === "number") {
                return sorting.order === "asc" ? val1 - val2 : val2 - val1;
            }

            // fallback string compare
            return sorting.order === "asc"
                ? String(val1).localeCompare(String(val2))
                : String(val2).localeCompare(String(val1));
        });

        return sorted;
    }, [products, searchValue, sorting]);

    // table columns
    const columns = ["Id", "Name", "Quantity", "Price"];
    // const products = [
    //     { id: 1, name: "Gold Ring", price: 5000, quantity: 10 },
    //     { id: 2, name: "Silver Chain", price: 1500, quantity: 20 },
    //     { id: 3, name: "Diamond Earrings", price: 25000, quantity: 5 },
    // ];
    return (
        <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
            <h2>Product Inventory</h2>

            <ProductForm
                products={products}
                setProducts={setProducts}
                form={form}
                setForm={setForm}
                editingId={editingId}
                setEditingId={setEditingId} />

            <SearchBar onSearch={handleSearch} />
            <ReusableTable
                data={products}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
};

export default ProductPage;
