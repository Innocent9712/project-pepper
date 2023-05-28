import inventory from "../assets/inventory.jpg"
import landingBg from "../assets/landing-bg.jpg"
import { loginStore } from '../store';

const LandingPage = () => {
  const isLoggedIn = loginStore((state) => state.login)
  console.log(isLoggedIn)

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <span className="text-xl font-bold text-gray-800">Project Pepper</span>
            </div>
            <div>
              <ul className="flex space-x-4">
                {!isLoggedIn && (
                  <li>
                    <a href="/login" className="text-gray-600 hover:text-gray-800">Login</a>
                  </li>
                )}
                {isLoggedIn && (
                  <li>
                    <a href="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div 
        className="md:mt-12 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col-reverse lg:flex-row items-center gap-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingBg})` }}
      >
        <div className="absolute inset-0 bg-white opacity-60 z-0"></div>
        <div className="lg:w-1/2 z-10">
          <img
            src={inventory}
            alt="Inventory Management"
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="lg:w-1/2 z-10">
          <div className="lg:text-left text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Project Pepper</h1>
            <p className="text-gray-600">Project Pepper is a comprehensive inventory management platform designed to help businesses streamline their inventory operations. Whether you run a small retail store or a large-scale warehouse, Project Pepper provides you with the tools and insights you need to effectively manage your inventory.</p>
            <p className="text-gray-600">With Project Pepper, you can easily track inventory levels, monitor stock movements, and generate detailed reports. Our intuitive dashboard allows you to view real-time data, set up automated alerts for low stock items, and optimize your inventory management processes.</p>
            <p className="text-gray-600">Experience the power of Project Pepper today and take control of your inventory like never before. Sign up now or log in to access your personalized dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
