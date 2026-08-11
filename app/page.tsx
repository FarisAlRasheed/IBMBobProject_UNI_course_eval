import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
          <span className="text-3xl" aria-hidden="true">🎓</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
          University Course<br />Evaluation System
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Share your feedback on courses or review aggregated results. Select
          your role below to get started.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Student Card */}
        <Link
          href="/evaluate"
          className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col items-start gap-4"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-200 transition-colors">
            📝
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
              I&apos;m a Student
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Select a course and submit your anonymous evaluation. Rate your
              experience and leave optional feedback.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
            Submit Evaluation <span aria-hidden="true">→</span>
          </span>
        </Link>

        {/* Admin Card */}
        <Link
          href="/dashboard"
          className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col items-start gap-4"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-200 transition-colors">
            📊
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
              I&apos;m an Admin
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              View aggregated evaluation results across all courses. Cards are
              sorted from highest to lowest average rating.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
            View Dashboard <span aria-hidden="true">→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
