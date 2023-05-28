import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderInterface {
  toggle: boolean;
  toggleSidebar: () => void;
}

const Header = ({ toggle, toggleSidebar }: HeaderInterface) => {
  return (
    <header className="relative">
      <div className="flex justify-between items-center bg-white text-gray-900 py-4 px-6 shadow">
        <Link to="/">
          <h1 className="text-2xl font-bold">Project Pepper</h1>
        </Link>
        <button
          className="text-white focus:outline-none focus:text-gray-300 md:hidden bg-gray-700"
          onClick={toggleSidebar}
        >
          {!toggle ? (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6H20M4 12H20M4 18H20" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>
      <div className={`bg-gray-200 h-screen absolute mx-auto right-0 w-48 shadow-md shadow-gray-400 ${!toggle && "hidden"}`}>
        <ul className="py-4">
          <li className="px-4 py-2 text-gray-700">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="px-4 py-2 text-gray-700">
            <Link to="/inventory">Inventory</Link>
          </li>
          <li className="px-4 py-2 text-gray-700">
            <Link to="/create-user">Create User</Link>
          </li>
          <li className="px-4 py-2 text-gray-700">
            <Link to="/create-role">Create Role</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
