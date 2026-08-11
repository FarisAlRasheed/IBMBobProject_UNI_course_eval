import type { EvaluationSummary } from "@/lib/types";
import StarRating from "./StarRating";

interface CourseCardProps {
  summary: EvaluationSummary;
}

export default function CourseCard({ summary }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-700 px-5 py-4">
        <span className="inline-block bg-blue-600 text-blue-100 text-xs font-semibold px-2 py-0.5 rounded mb-2 tracking-wide uppercase">
          {summary.course_code}
        </span>
        <h3 className="text-white text-lg font-bold leading-tight">
          {summary.course_name}
        </h3>
        <p className="text-blue-200 text-sm mt-0.5">{summary.instructor_name}</p>
        <p className="text-blue-300 text-xs mt-0.5">{summary.semester}</p>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StarRating value={summary.average_rating} readOnly size="md" />
            <span className="text-2xl font-bold text-gray-800">
              {summary.evaluation_count > 0
                ? summary.average_rating.toFixed(1)
                : "—"}
            </span>
            <span className="text-sm text-gray-400">/ 5</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-700">
              {summary.evaluation_count}
            </span>
            <p className="text-xs text-gray-400 leading-tight">
              {summary.evaluation_count === 1 ? "evaluation" : "evaluations"}
            </p>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-5 py-4 flex-1">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Student Comments
        </h4>
        {summary.comments.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No comments yet.</p>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {summary.comments.map((comment, i) => (
              <li
                key={i}
                className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border-l-2 border-blue-300"
              >
                &ldquo;{comment}&rdquo;
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
