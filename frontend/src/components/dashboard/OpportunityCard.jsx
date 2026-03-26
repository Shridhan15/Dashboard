import {
  Building2,
  Calendar,
  ExternalLink,
  GraduationCap,
  MapPin,
} from "lucide-react";

export default function OpportunityCard({ data }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{data.role}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1 gap-1">
            <Building2 className="w-4 h-4" />
            <span>{data.company}</span>
          </div>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            data.type === "Webinar"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {data.type}
        </span>
      </div>

      <div className="space-y-2 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-500" />
          <span>
            Deadline: <strong className="text-gray-900">{data.deadline}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-500" />
          <span>Eligibility: {data.eligibility}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={data.link}
        target="_blank"
        rel="noreferrer"
        className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
      >
        <span>View Details</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
