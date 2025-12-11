import React, { useEffect, useState } from "react";
import ReusableTable from "../components/Table/ReusableTable";

const fetchMockData = () =>
    Promise.resolve({
        data: [
            { id: 1, name: "Gold", quantity: 10, price: 10000 },
            { id: 2, name: "Silver", quantity: 5, price: 5000 },
        ]
    })

const ProductPage = () => {

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

    return (
        <div style={{ margin: 20 }}>
            <h2>Product Management</h2>
            
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

export default ProductPage;
