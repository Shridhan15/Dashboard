import { useState } from "react";
import { RefreshCw, Mail } from "lucide-react";
import OpportunityCard from "../components/dashboard/OpportunityCard";

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calling your FastAPI backend
      const response = await fetch("http://localhost:8000/api/sync", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to fetch from backend");

      const data = await response.json();
      console.log("Raw Data from Backend:", data);
      setOpportunities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <Mail className="w-8 h-8 text-blue-600" />
              SyncMail Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              AI-Powered VIT Placement Tracker
            </p>
          </div>

          <button
            onClick={syncEmails}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Scanning Inbox..." : "Sync Latest Emails"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            Error: {error}
          </div>
        )}

        {/* The Grid of Cards */}
        {opportunities.length === 0 && !loading ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            No new opportunities found in the last 24 hours.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <OpportunityCard key={idx} data={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
