import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Course, Evaluation, EvaluationSummary } from "@/lib/types";

export async function GET() {
  const [coursesResult, evaluationsResult] = await Promise.all([
    supabase.from("courses").select("*"),
    supabase.from("evaluations").select("*"),
  ]);

  if (coursesResult.error) {
    return NextResponse.json(
      { error: coursesResult.error.message },
      { status: 500 }
    );
  }
  if (evaluationsResult.error) {
    return NextResponse.json(
      { error: evaluationsResult.error.message },
      { status: 500 }
    );
  }

  const courses: Course[] = coursesResult.data ?? [];
  const evaluations: Evaluation[] = evaluationsResult.data ?? [];

  // Group evaluations by course_id
  const evalsByCourse = new Map<string, Evaluation[]>();
  for (const ev of evaluations) {
    const list = evalsByCourse.get(ev.course_id) ?? [];
    list.push(ev);
    evalsByCourse.set(ev.course_id, list);
  }

  const summary: EvaluationSummary[] = courses.map((course) => {
    const courseEvals = evalsByCourse.get(course.id) ?? [];
    const count = courseEvals.length;
    const avg =
      count > 0
        ? Math.round(
            (courseEvals.reduce((sum, e) => sum + e.rating, 0) / count) * 10
          ) / 10
        : 0;
    const comments = courseEvals
      .map((e) => e.comment)
      .filter((c): c is string => c !== null && c.trim() !== "");

    return {
      course_id: course.id,
      course_name: course.name,
      course_code: course.code,
      instructor_name: course.instructor_name,
      semester: course.semester,
      average_rating: avg,
      evaluation_count: count,
      comments,
    };
  });

  // Sort by average rating descending, then alphabetically by name as tiebreaker
  summary.sort((a, b) =>
    b.average_rating !== a.average_rating
      ? b.average_rating - a.average_rating
      : a.course_name.localeCompare(b.course_name)
  );

  return NextResponse.json({ summary });
}
