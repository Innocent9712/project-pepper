import { useState } from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const session = sessionStorage.getItem('session');
  if (!session) return <Navigate to="/login" />


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} toggle={isSidebarOpen} />
      <div className='flex min-h-screen'>
        <div className='hidden md:block w-[10%]'>
          <div className=" bg-gray-200 h-screen">
            <ul className="py-4">
              <li className="px-4 py-2 text-gray-700 hover:text-gray-500">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="px-4 py-2 text-gray-700 hover:text-gray-500">
                <Link to="/inventory">Inventory</Link>
              </li>
              <li className="px-4 py-2 text-gray-700 hover:text-gray-500">
                <Link to="/create-user">Create User</Link>
              </li>
              <li className="px-4 py-2 text-gray-700 hover:text-gray-500">
                <Link to="/create-role">Create Role</Link>
              </li>
            </ul>
          </div>
        </div>
        <main className="flex-grow bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
