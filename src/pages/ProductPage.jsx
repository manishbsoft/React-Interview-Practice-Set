import React, { Suspense, useEffect, useState } from "react";
import ReusableTable from "../components/ReusableTable";

const fetchMockData = () =>
  Promise.resolve({
    data: [
      { id: 1, name: "Gold", quantity: 10, price: 10000 },
      { id: 2, name: "Silver", quantity: 10, price: 5000 },
      { id: 3, name: "Platinum", quantity: 10, price: 7000 },
    ],
  });

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMockData().then((res) => setProducts(res.data));
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "quantity", label: "Quantity" },
    { key: "price", label: "Price" },
  ];

  const filteredProducts = products.filter((product) =>
    Object.values(product)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (!form.name || !form.quantity || !form.price) return;

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
      setEditingId(null);
    } else {
      setProducts([...products, { ...form, id: crypto.randomUUID() }]);
    }

    setForm({ name: "", quantity: "", price: "" });
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Product Management</h2>

      <input
        placeholder="Search Text..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br />

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="quantity"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
      />
      <input
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <button onClick={handleAddOrUpdate}>
        {editingId ? "Update" : "Add"}
      </button>

      <Suspense fallback={"Loading..."}>
        <ReusableTable
          columns={columns}
          data={filteredProducts}
          search={search}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pageSize={5}
        />
      </Suspense>
    </div>
  );
};

export default ProductPage;
