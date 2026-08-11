import { getCourses } from "@/lib/getCourses";
import EvaluateForm from "./EvaluateForm";

export default async function EvaluatePage() {
  const courses = await getCourses();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit a Course Evaluation
        </h1>
        <p className="text-gray-500">
          Select the course you want to evaluate, enter your student ID, and
          share your feedback.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block" aria-hidden="true">📭</span>
            <p className="text-gray-500 font-medium">
              No courses are available at this time.
            </p>
          </div>
        ) : (
          <EvaluateForm courses={courses} />
        )}
      </div>
    </div>
  );
}
