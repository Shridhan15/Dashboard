import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";

export default function OpportunityCard({ data }) {
  const isHighPriority = data.priority === "High";

  return (
    <div
      className={`bg-white rounded-xl border flex flex-col justify-between overflow-hidden shadow-sm transition hover:shadow-md ${isHighPriority ? "border-red-300" : "border-gray-200"}`}
    >
      <div className="p-5 flex-grow">
        {/* Top Header: Category & Priority */}
        <div className="flex justify-between items-start mb-3">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
              data.category === "Selection"
                ? "bg-purple-100 text-purple-700"
                : data.category === "Registration"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {data.category}
          </span>
          {isHighPriority && (
            <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
              <AlertCircle className="w-3 h-3" /> URGENT
            </span>
          )}
        </div>

        {/* Company & Role */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{data.company}</h3>
        <p className="text-sm font-medium text-gray-600 mb-4 bg-gray-50 inline-block px-2 py-1 rounded">
          {data.role !== "Unknown" ? data.role : data.type}
        </p>

        {/* Details List */}
        <div className="space-y-2 mb-4 text-sm text-gray-700">
          {data.deadline && (
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>
                <strong className="text-gray-900">Deadline/Date:</strong>{" "}
                {data.deadline}
              </span>
            </div>
          )}
          {data.location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>{data.location}</span>
            </div>
          )}
        </div>

        {/* AI Description / Summary */}
        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>

      {/* Footer: Date Received & Action Button */}
      <div className="border-t border-gray-100 bg-gray-50 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
          <Clock className="w-3.5 h-3.5" />
          Received: {data.email_date} at {data.email_time}
        </div>

        {data.link ? (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Open Registration Link <LinkIcon className="w-4 h-4" />
          </a>
        ) : (
          <button
            disabled
            className="w-full py-2.5 bg-gray-200 text-gray-500 rounded-lg text-sm font-semibold cursor-not-allowed"
          >
            No Link Provided
          </button>
        )}
      </div>
    </div>
  );
}
