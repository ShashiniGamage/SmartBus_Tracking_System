import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default App;