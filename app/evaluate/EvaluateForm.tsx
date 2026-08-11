"use client";

import { useState } from "react";
import type { Course } from "@/lib/types";
import StarRating from "@/components/StarRating";

interface EvaluateFormProps {
  courses: Course[];
}

type Status = "idle" | "submitting" | "success" | "error" | "duplicate";

export default function EvaluateForm({ courses }: EvaluateFormProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId) {
      setStatus("error");
      setErrorMessage("Please select a course.");
      return;
    }
    if (!studentId.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your Student ID.");
      return;
    }
    if (rating === 0) {
      setStatus("error");
      setErrorMessage("Please select a star rating.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: selectedCourseId,
          student_identifier: studentId.trim(),
          rating,
          comment: comment.trim() || null,
          semester: selectedCourse!.semester,
        }),
      });

      if (res.status === 201) {
        setStatus("success");
        // Reset form
        setSelectedCourseId("");
        setStudentId("");
        setRating(0);
        setComment("");
        return;
      }

      const json = await res.json();
      if (res.status === 409) {
        setStatus("duplicate");
        setErrorMessage(
          json.error ??
            "You have already submitted an evaluation for this course this semester."
        );
      } else {
        setStatus("error");
        setErrorMessage(
          json.error ?? "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Success banner */}
      {status === "success" && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3"
        >
          <span className="text-xl leading-none mt-0.5" aria-hidden="true">✅</span>
          <div>
            <p className="font-semibold">Evaluation submitted!</p>
            <p className="text-sm text-green-700 mt-0.5">
              Thank you for your feedback. It helps improve the quality of
              teaching.
            </p>
          </div>
        </div>
      )}

      {/* Error / duplicate banner */}
      {(status === "error" || status === "duplicate") && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3"
        >
          <span className="text-xl leading-none mt-0.5" aria-hidden="true">
            {status === "duplicate" ? "⚠️" : "❌"}
          </span>
          <div>
            <p className="font-semibold">
              {status === "duplicate"
                ? "Duplicate Evaluation"
                : "Submission Error"}
            </p>
            <p className="text-sm text-red-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Course selection */}
      <div className="space-y-1.5">
        <label
          htmlFor="course"
          className="block text-sm font-semibold text-gray-700"
        >
          Course <span className="text-red-500">*</span>
        </label>
        <select
          id="course"
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setStatus("idle");
          }}
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
        >
          <option value="">— Select a course —</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              [{course.code}] {course.name} — {course.semester}
            </option>
          ))}
        </select>

        {/* Selected course details */}
        {selectedCourse && (
          <p className="text-xs text-gray-400 pl-1">
            Instructor:{" "}
            <span className="text-gray-600 font-medium">
              {selectedCourse.instructor_name}
            </span>
          </p>
        )}
      </div>

      {/* Student ID */}
      <div className="space-y-1.5">
        <label
          htmlFor="studentId"
          className="block text-sm font-semibold text-gray-700"
        >
          Student ID <span className="text-red-500">*</span>
        </label>
        <input
          id="studentId"
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g. S1234567"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
          autoComplete="off"
        />
      </div>

      {/* Star Rating */}
      <div className="space-y-1.5">
        <p className="block text-sm font-semibold text-gray-700">
          Rating <span className="text-red-500">*</span>
        </p>
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating > 0 && (
            <span className="text-sm text-gray-500">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-1.5">
        <label
          htmlFor="comment"
          className="block text-sm font-semibold text-gray-700"
        >
          Comment{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share any additional feedback about the course or instructor…"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
      >
        {status === "submitting" ? "Submitting…" : "Submit Evaluation"}
      </button>
    </form>
  );
}
