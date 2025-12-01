import React from "react";
import "./ReusableTable.css";
import Headers from "./Header";
import Content from "./Content";

const ReusableTable = ({ data, columns, onEdit, onDelete }) => {
    return (
        <table className="users-table">
            <Headers columns={columns} />
            <Content entries={data} columns={columns} onEdit={onEdit} onDelete={onDelete} />
        </table>
    )
};

export default ReusableTable;
