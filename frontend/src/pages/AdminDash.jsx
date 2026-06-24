import { useState } from 'react';

const AdminDash = () => {
  // Sample Data for UI Testing
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Sunil Perera", email: "sunil@gmail.com", status: "pending" },
    { id: 2, name: "Kamil Asanka", email: "kamil@gmail.com", status: "approved" }
  ]);

  const [trips, setTrips] = useState([
    { id: 101, bus: "WP ND-4521", route: "Kandy - Colombo", status: "Active" },
    { id: 102, bus: "SP PB-8822", route: "Mawanella - Kegalle", status: "Delayed (15 mins)" },
    { id: 103, bus: "CP NB-1102", route: "Galle - Matara", status: "Cancelled" }
  ]);

  const handleApproval = (id, newStatus) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, status: newStatus } : d));
    alert(`Driver registration ${newStatus}!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-darkGray mb-6 border-b-2 pb-2">Admin <span className="text-primaryRed">Control Panel</span></h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-pureWhite p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 font-bold uppercase text-sm">Active Trips Today</h3>
          <p className="text-3xl font-extrabold text-darkGray">12</p>
        </div>
        <div className="bg-pureWhite p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500 font-bold uppercase text-sm">Delayed Trips</h3>
          <p className="text-3xl font-extrabold text-darkGray">2</p>
        </div>
        <div className="bg-pureWhite p-6 rounded-lg shadow border-l-4 border-primaryRed">
          <h3 className="text-gray-500 font-bold uppercase text-sm">Cancelled Trips</h3>
          <p className="text-3xl font-extrabold text-darkGray">1</p>
        </div>
      </div>

      {/* Driver Registration Approval Section */}
      <div className="bg-pureWhite p-6 rounded-lg shadow mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-darkGray mb-4">Driver Approvals</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(driver => (
                <tr key={driver.id} className="border-b">
                  <td className="p-3 font-semibold">{driver.name}</td>
                  <td className="p-3 text-gray-600">{driver.email}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${driver.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{driver.status}</span></td>
                  <td className="p-3 text-center space-x-2">
                    {driver.status === 'pending' && (
                      <>
                        <button onClick={() => handleApproval(driver.id, 'approved')} className="bg-green-500 text-pureWhite px-3 py-1 rounded text-sm hover:bg-green-600">Approve</button>
                        <button onClick={() => handleApproval(driver.id, 'rejected')} className="bg-primaryRed text-pureWhite px-3 py-1 rounded text-sm hover:bg-darkRed">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Active Trips Monitoring */}
      <div className="bg-pureWhite p-6 rounded-lg shadow border border-gray-100">
        <h2 className="text-xl font-bold text-darkGray mb-4">Live Trip Monitor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map(trip => (
            <div key={trip.id} className="p-4 border rounded-lg flex justify-between items-center bg-lightRed">
              <div>
                <p className="font-bold text-darkGray">{trip.bus}</p>
                <p className="text-sm text-gray-600">{trip.route}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'Active' ? 'bg-green-500 text-pureWhite' : trip.status.includes('Delayed') ? 'bg-yellow-500 text-pureWhite' : 'bg-primaryRed text-pureWhite'}`}>{trip.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;