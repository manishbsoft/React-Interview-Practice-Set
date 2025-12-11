import React, { useState } from "react";

const ReusableTable = ({ columns, data, pageSize = 5 }) => {

    const [sortKey, setSortKey] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [page, setPage] = useState(1);

    const handleSort = (key) => {
        const order = key === sortKey && sortOrder === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortOrder(order);
    }

    const sortData = (data, key, order) => {
        return [...data].sort((a, b) => {
            const x = a[key];
            const y = b[key];

            if (x === y) return 0;

            const result = x > y ? 1 : -1;

            return order === "asc" ? result : -result;
        })
    }
    const sortedData = sortData(data, sortKey, sortOrder);

    const totalPages = Math.max(Math.ceil(sortedData.length / pageSize));
    const start = (page - 1) * pageSize;
    const paginatedData = sortedData.slice(start, start + pageSize);


    return (
        <div>
            <table border={1} width={800} style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} onClick={() => handleSort(col.key)}>{col.label}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.map((row) => (
                        <tr key={row.id}>
                            {columns.map((col) => (
                                <td key={`${col.key}-${row.id}`}>{row[col.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ReusableTable;
