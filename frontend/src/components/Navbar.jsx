import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-primaryRed text-pureWhite shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wider">
              SMART<span className="text-gray-200">BUS</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-gray-200 transition duration-300">Home</Link>
            <Link to="/live-route" className="hover:text-gray-200 transition duration-300">Live Route</Link>
            <Link to="/about" className="hover:text-gray-200 transition duration-300">About</Link>
            <Link to="/services" className="hover:text-gray-200 transition duration-300">Services</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="bg-pureWhite text-primaryRed px-4 py-2 rounded font-semibold hover:bg-gray-100 transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;