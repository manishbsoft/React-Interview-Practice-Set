import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <div className="search-bar">
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Search by name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
