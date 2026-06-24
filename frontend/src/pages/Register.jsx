import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'passenger' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightRed px-4 py-10">
      <div className="bg-pureWhite p-8 rounded-lg shadow-xl border border-red-100 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-darkGray mb-6">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primaryRed" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
            <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primaryRed" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primaryRed" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Register As</label>
            <select onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primaryRed">
              <option value="passenger">Passenger (User)</option>
              <option value="driver">Bus Driver</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-primaryRed text-pureWhite py-2 rounded font-bold hover:bg-darkRed transition duration-300">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;