import type { EvaluationSummary } from "@/lib/types";
import CourseCard from "@/components/CourseCard";

async function getSummary(): Promise<EvaluationSummary[] | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/evaluations/summary`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.summary ?? [];
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const summary = await getSummary();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Evaluation Dashboard
        </h1>
        <p className="text-gray-500">
          Aggregated student feedback for all courses, sorted from
          highest to lowest average rating.
        </p>
      </div>

      {/* Error state */}
      {summary === null && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <span className="text-4xl mb-3 block" aria-hidden="true">⚠️</span>
          <p className="text-red-700 font-semibold">
            Failed to load evaluation data.
          </p>
          <p className="text-red-500 text-sm mt-1">
            Please check your connection or try refreshing the page.
          </p>
        </div>
      )}

      {/* Empty state */}
      {summary !== null && summary.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <span className="text-5xl mb-4 block" aria-hidden="true">📭</span>
          <p className="text-gray-600 font-semibold text-lg">
            No courses found.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Add courses to the database to see them here.
          </p>
        </div>
      )}

      {/* No evaluations yet (courses exist but no submissions) */}
      {summary !== null &&
        summary.length > 0 &&
        summary.every((s) => s.evaluation_count === 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">ℹ️</span>
            <p className="text-blue-700 text-sm">
              No evaluations have been submitted yet. Cards show all
              available courses.
            </p>
          </div>
        )}

      {/* Course cards grid */}
      {summary !== null && summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {summary.map((item) => (
            <CourseCard key={item.course_id} summary={item} />
          ))}
        </div>
      )}
    </div>
  );
}
