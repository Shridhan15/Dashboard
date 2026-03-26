import { useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import OpportunityCard from "../components/dashboard/OpportunityCard";
import FilterBar from "../components/dashboard/FilterBar";

export default function Dashboard() {
  // Mock data representing the JSON your Python backend will return
  const [opportunities] = useState([
    {
      id: 1,
      company: "Google",
      role: "Software Engineering Intern",
      type: "Internship",
      deadline: "April 15, 2026",
      eligibility: "B.Tech CSE/IT",
      tags: ["React", "Python", "Full-stack"],
      link: "#",
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Cloud Architecture Workshop",
      type: "Webinar",
      deadline: "March 28, 2026",
      eligibility: "All Tech Branches",
      tags: ["Azure", "Node.js"],
      link: "#",
    },
    {
      id: 3,
      company: "Amazon",
      role: "SDE 6-Month Intern",
      type: "Internship",
      deadline: "April 02, 2026",
      eligibility: "B.Tech CSE",
      tags: ["AWS", "Java", "Generative AI"],
      link: "#",
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inbox Sync</h1>
          <p className="text-gray-500 text-sm mt-1">
            Showing active opportunities from your college mail.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm">
          <RefreshCw className="w-4 h-4" />
          <span>Sync Emails</span>
        </button>
      </div>

      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} data={opp} />
        ))}
      </div>
    </div>
  );
}
