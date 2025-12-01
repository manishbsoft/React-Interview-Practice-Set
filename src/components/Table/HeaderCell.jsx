import React from "react";

const HeaderCell = ({ column }) => {

    return (
        <th className="users-table-cell header-cell" tabIndex={0}>
            {column}
        </th>
    )
};

export default HeaderCell;