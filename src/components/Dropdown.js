// components/DropdownMenu.js
import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import './DropdownMenu.css';

const DropdownMenu = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className="dropdown-menu">
      <FaEllipsisV onClick={toggleMenu} />
      {isOpen && (
        <div className="menu">
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
