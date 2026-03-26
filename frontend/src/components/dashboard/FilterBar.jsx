export default function FilterBar() {
  const filters = ["All", "Internships", "Webinars", "Hackathons"];

  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            filter === "All"
              ? "bg-gray-900 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
