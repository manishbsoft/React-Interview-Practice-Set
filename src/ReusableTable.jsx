import { useState } from "react";

const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text
        .toString()
        .replace(regex, (match) => `<mark style="background: yellow;">${match}</mark>`);
};

export default function ReusableTable({
    columns,
    data,
    onEdit,
    onDelete,
    pageSize = 5,
    search = ""
}) {
    const [sortKey, setSortKey] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState(1);

    const handleSort = (key) => {
        const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortOrder(order);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;

        const x = a[sortKey];
        const y = b[sortKey];

        // If values are numbers → numeric sorting
        if (typeof x === "number" && typeof y === "number") {
            return sortOrder === "asc" ? x - y : y - x;
        }

        // Convert both to strings to avoid localeCompare crashes
        return sortOrder === "asc"
            ? String(x).localeCompare(String(y))
            : String(y).localeCompare(String(x));
    });


    const totalPages = Math.ceil(sortedData.length / pageSize);
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
                                {sortKey === col.key ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={index}>
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    dangerouslySetInnerHTML={{
                                        __html: highlightText(row[col.key], search),
                                    }}
                                />
                            ))}
                            <td>
                                <button onClick={() => onEdit(row, start + index)}>Edit</button>
                                <button onClick={() => onDelete(start + index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: 10 }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    {page} / {totalPages}
                </span>

                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}
