// components/common/Dropdown.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

const Dropdown = ({ options = [], value, onSelect, placeholder = "請選擇", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`dropdown-wrapper ${className}`} ref={dropdownRef}>
    <div
      className={`dropdown-selected ${value ? "black-text" : "gray-text"}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {value || placeholder}
      <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
    </div>


      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option, index) => (
            <li key={index} className="dropdown-option" onClick={() => { onSelect(option); setIsOpen(false); }}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
