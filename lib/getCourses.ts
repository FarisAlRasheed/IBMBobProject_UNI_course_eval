import { supabase } from "@/lib/supabase";
import type { Course } from "@/lib/types";

/**
 * Fetch all courses directly from Supabase.
 * Use this in Server Components instead of fetching /api/courses,
 * which requires a live HTTP server and fails on Vercel at build/runtime.
 */
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("name", { ascending: true });

  if (error) return [];
  return data ?? [];
}
