import React, { useState } from "react";

const highlightText = (text, search) => {
  if (!search) return text;

  const t = text.toString();
  const s = search.toLowerCase();
  const i = t.toLowerCase().indexOf(s);

  return i === -1
    ? t
    : [
        t.slice(0, i),
        <mark key={crypto.randomUUID()}>{t.slice(i, i + s.length)}</mark>,
        ...highlightText(t.slice(i + s.length), search),
      ];
};

const ReusableTable = ({
  columns,
  data,
  pageSize = 5,
  search = "",
  onEdit,
  onDelete,
}) => {
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  // sorting logic
  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
  };

  // Batter option for interview purpose
  const sortData = (data = [], key, order) => {
    return [...data].sort((a, b) => {
      const x = a[key];
      const y = b[key];

      // If values are equal → no change
      if (x === y) return 0;

      // Compare numbers or strings safely
      const result = x > y ? 1 : -1;

      // Reverse result if descending
      return order === "asc" ? result : -result;
    });
  };

  // const sortData = (arr, key, order) =>
  //   key
  //     ? [...arr].sort((a, b) =>
  //         (a[key] > b[key] ? 1 : -1) * (order === "asc" ? 1 : -1)
  //       )
  //     : arr;

  const sortedData = sortData(data, sortKey, sortOrder);

  // pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginatedData = sortedData.slice(start, start + pageSize);

  return (
    <div style={{ marginTop: 20 }}>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{ cursor: "pointer" }}
              >
                {col.label}
                {sortKey === col.key ? (sortOrder === "asc" ? " \u25B2" : " \u25BC") : ""}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={`${row.id}-${col.key}`}>
                  {highlightText(row[col.key], search)}
                </td>
              ))}

              <td>
                <button onClick={() => onEdit(row)}>Edit</button>
                <button onClick={() => onDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReusableTable;
