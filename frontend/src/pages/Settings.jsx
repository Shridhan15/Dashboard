export default function Settings() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Settings & Filters
      </h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
        <p className="text-sm text-gray-500 mb-4">
          Connect your backend endpoints here.
        </p>
        {/* Form fields for settings would go here */}
      </div>
    </div>
  );
}
