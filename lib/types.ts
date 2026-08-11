export interface Course {
  id: string;
  code: string;
  name: string;
  instructor_name: string;
  semester: string;
}

export interface Evaluation {
  id: string;
  course_id: string;
  student_identifier: string;
  rating: number;
  comment: string | null;
  semester: string;
  created_at: string;
}

export interface EvaluationSummary {
  course_id: string;
  course_name: string;
  course_code: string;
  instructor_name: string;
  semester: string;
  average_rating: number;
  evaluation_count: number;
  comments: string[];
}
