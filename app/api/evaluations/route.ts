import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { course_id, student_identifier, rating, comment, semester } =
    body as Record<string, unknown>;

  // Validate required fields
  if (!course_id || typeof course_id !== "string") {
    return NextResponse.json(
      { error: "course_id is required and must be a string." },
      { status: 400 }
    );
  }
  if (!student_identifier || typeof student_identifier !== "string") {
    return NextResponse.json(
      { error: "student_identifier is required and must be a string." },
      { status: 400 }
    );
  }
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "rating must be an integer between 1 and 5." },
      { status: 400 }
    );
  }
  if (!semester || typeof semester !== "string") {
    return NextResponse.json(
      { error: "semester is required and must be a string." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("evaluations")
    .insert({
      course_id,
      student_identifier,
      rating,
      comment: comment ?? null,
      semester,
    })
    .select()
    .single();

  if (error) {
    // Postgres unique constraint violation
    if (error.code === "23505") {
      return NextResponse.json(
        {
          error:
            "You have already submitted an evaluation for this course this semester.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ evaluation: data }, { status: 201 });
}
