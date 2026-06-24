import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView'; 
import Cards from '../components/Cards';     
import { Bus } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lightRed px-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-darkGray mb-4">
          Next-Level <span className="text-primaryRed">Transit</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 italic">
          "Connecting destinations, empowering journeys."
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link to="/live-route">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primaryRed text-pureWhite px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-darkRed transition"
            >
              Track Your Bus
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;