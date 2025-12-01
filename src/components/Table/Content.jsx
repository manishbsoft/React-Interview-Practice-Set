import React from "react";

const Content = ({ entries, columns, onEdit, onDelete }) => {
    return (
        <tbody>
            {entries.map((row) => (
                <tr key={row.id || Math.random()}>
                    {columns.map((col) => (
                        <td key={col} className="users-table-cell">
                            {row[col.toLowerCase()]}
                        </td>
                    ))}
                    <td className="action-buttons">
                        <button className="icon-btn edit" onClick={() => onEdit(row.id)}>Edit</button>
                        <button className="icon-btn delete" onClick={() => onDelete(row.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    )
};

export default Content; 
