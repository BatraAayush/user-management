import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex gap-8 bg-blue-400 text-white p-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "font-bold" : "hover:font-bold"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/create-user"
        className={({ isActive }) =>
          isActive ? "font-bold" : "hover:font-bold"
        }
      >
        Create User
      </NavLink>
    </nav>
  );
};

export default Navbar;
