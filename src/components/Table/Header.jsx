import React from "react";
import HeaderCell from "./HeaderCell";

const Headers = ({ columns }) => {
    return (
        <thead>
            <tr>
                {columns.map((col) => (
                    <HeaderCell
                        key={col} 
                        column={col} 
                    />
                ))}
                <th>Actions</th>
            </tr>
        </thead>
    )
};

export default Headers;