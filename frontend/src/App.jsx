/**import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Placeholder components for other pages to avoid errors initially
const LiveRoute = () => <div className="text-center mt-20 text-2xl">Live Route Map Coming Soon...</div>;
const AdminDash = () => <div className="text-center mt-20 text-2xl">Admin Dashboard</div>;
const DriverDash = () => <div className="text-center mt-20 text-2xl">Driver Dashboard</div>;

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live-route" element={<LiveRoute />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/driver" element={<DriverDash />} />
      </Routes>
    </Router>
  );
}

export default App;**/


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import LiveRoute from './pages/LiveRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen justify-between">
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live-route" element={<LiveRoute />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;