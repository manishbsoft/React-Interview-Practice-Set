import { useEffect, useState } from "react";
import ReusableTable from "./ReusableTable";

const fetchMockData = () =>
  Promise.resolve({
    data: [{ name: "Test Product name", quantity: 5, price: 12.5 }],
  });

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMockData().then((res) => setProducts(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (!form.name || !form.quantity || !form.price) return;

    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = form;
      setProducts(updated);
      setEditingIndex(null);
    } else {
      setProducts([...products, form]);
    }

    setForm({ name: "", quantity: "", price: "" });
  };

  const handleEdit = (row, index) => {
    setForm(row);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "price", label: "Price" }
  ];

  const filteredProducts = products.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ margin: 40 }}>
      <h2>Product Management</h2>

      {/* Search box */}
      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10, padding: 6 }}
      />

      <br />

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
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <button onClick={handleAddOrUpdate}>
        {editingIndex !== null ? "Update" : "Add"}
      </button>

      <ReusableTable
        columns={columns}
        data={filteredProducts}   // 🔥 searching applied here
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSize={5}
        search={search}   // 🔥 search passed here
      />
    </div>
  );
}
