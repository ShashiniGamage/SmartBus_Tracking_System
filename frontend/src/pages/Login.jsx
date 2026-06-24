import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      alert(res.data.message);
      
      // Role එක අනුව අදාළ Dashboard එකට යවනවා
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'driver') navigate('/driver');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightRed">
      <div className="bg-pureWhite p-8 rounded-lg shadow-xl border border-red-100 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-darkGray mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primaryRed" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primaryRed" required />
          </div>
          <button type="submit" className="w-full bg-primaryRed text-pureWhite py-2 rounded font-bold hover:bg-darkRed transition duration-300">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;