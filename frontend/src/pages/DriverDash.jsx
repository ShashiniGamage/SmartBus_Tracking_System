import { useState } from 'react';

const DriverDash = () => {
  const [isTripActive, setIsTripActive] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState('');
  const [delayReason, setDelayReason] = useState('');

  const startTrip = () => {
    setIsTripActive(true);
    alert("Trip started! GPS tracking is running in the background.");
  };

  const reportDelay = (e) => {
    e.preventDefault();
    alert(`Delay of ${delayMinutes} minutes reported due to: ${delayReason}`);
    setDelayMinutes('');
    setDelayReason('');
  };

  const endTrip = () => {
    setIsTripActive(false);
    alert("Trip ended successfully!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-darkGray mb-6 border-b-2 pb-2 text-center">Driver <span className="text-primaryRed">Console</span></h1>
      
      {/* Bus Registration Status View */}
      <div className="bg-pureWhite p-6 rounded-lg shadow border border-gray-200 text-center mb-6">
        <p className="text-gray-500 uppercase font-bold text-xs">Assigned Vehicle</p>
        <p className="text-xl font-extrabold text-primaryRed">WP ND-4521 (Leyland Luxury)</p>
        <p className="text-sm text-green-600 font-semibold mt-1">Route Approved: Kandy ⇄ Colombo</p>
      </div>

      {/* Action Controls */}
      <div className="bg-pureWhite p-6 rounded-lg shadow border border-gray-200 text-center mb-6">
        {!isTripActive ? (
          <button onClick={startTrip} className="w-full bg-green-600 text-pureWhite py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg transition">
            🏁 START ACTIVE TRIP
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-100 text-green-800 rounded font-bold animate-pulse">
              📡 Trip is Live (GPS Syncing...)
            </div>
            <button onClick={endTrip} className="w-full bg-primaryRed text-pureWhite py-4 rounded-xl font-bold text-xl hover:bg-darkRed shadow-lg transition">
              🛑 END CURRENT TRIP
            </button>
          </div>
        )}
      </div>

      {/* Delay Reporting Form */}
      {isTripActive && (
        <div className="bg-pureWhite p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold text-darkGray mb-3">⚠️ Report Traffic / Delay</h3>
          <form onSubmit={reportDelay} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Extra Minutes Needed</label>
              <input type="number" value={delayMinutes} onChange={(e) => setDelayMinutes(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Reason for Delay</label>
              <input type="text" value={delayReason} onChange={(e) => setDelayReason(e.target.value)} placeholder="e.g., Heavy traffic at Kegalle" className="w-full p-2 border rounded" required />
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-pureWhite py-2 rounded font-bold hover:bg-yellow-600">Submit Delay</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DriverDash;