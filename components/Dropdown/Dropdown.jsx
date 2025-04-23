"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css"; // ← 改成 CSS module

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
    <div className={`${styles.wrapper} ${className}`} ref={dropdownRef}>
      <div
        className={`${styles.selected} ${value ? styles.blackText : styles.grayText}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || placeholder}
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <ul className={styles.options}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
