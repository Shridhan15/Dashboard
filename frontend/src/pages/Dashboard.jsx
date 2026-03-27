import { useState, useEffect } from "react";
import { RefreshCw, Mail, Database } from "lucide-react";
import OpportunityCard from "../components/dashboard/OpportunityCard";

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [syncMessage, setSyncMessage] = useState("");

  // 1. Fetch data from the database instantly when the page loads
  const fetchDatabaseRecords = async () => {
    setIsFetching(true);
    try {
      const response = await fetch("http://localhost:8000/api/opportunities");
      if (!response.ok) throw new Error("Failed to fetch from database");
      const data = await response.json();
      setOpportunities(data);
    } catch (err) {
      setError("Could not load saved opportunities.");
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchDatabaseRecords();
  }, []);

  // 2. Trigger the Gmail/AI Sync, then refresh the list
  const syncEmails = async () => {
    setIsSyncing(true);
    setError(null);
    setSyncMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/sync", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to sync new emails");

      const result = await response.json();

      // Show a temporary success message
      setSyncMessage(
        `Sync complete! Added ${result.new_items_added} new emails.`,
      );

      // Refresh the UI with the newly updated database
      await fetchDatabaseRecords();

      // Clear the success message after 5 seconds
      setTimeout(() => setSyncMessage(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
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
            <p className="text-gray-500 mt-1 flex items-center gap-1">
              <Database className="w-4 h-4" /> Connected to local SQLite
            </p>
          </div>

          <button
            onClick={syncEmails}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Scanning Gmail..." : "Sync Latest Emails"}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            Error: {error}
          </div>
        )}

        {syncMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200 font-medium">
            {syncMessage}
          </div>
        )}

        {/* The Grid of Cards */}
        {isFetching ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">
            Loading your database...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            Your database is empty. Click "Sync Latest Emails" to fetch from
            Gmail.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <OpportunityCard key={opp.id || idx} data={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
