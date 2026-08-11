# Database Schema — University Course Evaluation System

## Platform
**Supabase** (PostgreSQL 15)

---

## Tables

### `courses`

Stores every course offered in the university system.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique course identifier |
| `code` | `text` | NOT NULL | Course code (e.g. `CS401`) |
| `name` | `text` | NOT NULL | Full course name |
| `instructor_name` | `text` | NOT NULL | Name of the assigned instructor |
| `semester` | `text` | NOT NULL | Semester label (e.g. `Fall 2025`) |

---

### `evaluations`

Stores one evaluation per student per course per semester.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique evaluation identifier |
| `course_id` | `uuid` | NOT NULL, FOREIGN KEY → `courses(id)` | The evaluated course |
| `student_identifier` | `text` | NOT NULL | Student ID string (e.g. `S1234567`) |
| `rating` | `integer` | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Star rating from 1 to 5 |
| `comment` | `text` | NULLABLE | Optional free-text feedback |
| `semester` | `text` | NOT NULL | Semester at time of submission |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Timestamp of submission |

**Unique constraint:** `(course_id, student_identifier, semester)` — prevents duplicate submissions.

---

## SQL Script (recreate from scratch)

```sql
-- courses table
CREATE TABLE courses (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text        NOT NULL,
  name             text        NOT NULL,
  instructor_name  text        NOT NULL,
  semester         text        NOT NULL
);

-- evaluations table
CREATE TABLE evaluations (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id            uuid        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_identifier   text        NOT NULL,
  rating               integer     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment              text,
  semester             text        NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT unique_student_course_semester
    UNIQUE (course_id, student_identifier, semester)
);
```

---

## Entity-Relationship Diagram

```
┌─────────────────────────────┐         ┌──────────────────────────────────────┐
│           courses            │         │              evaluations              │
├─────────────────────────────┤         ├──────────────────────────────────────┤
│ PK  id              uuid    │ 1     N │ PK  id                  uuid         │
│     code            text    │─────────│ FK  course_id           uuid         │
│     name            text    │         │     student_identifier  text         │
│     instructor_name text    │         │     rating              integer (1-5)│
│     semester        text    │         │     comment             text (null)  │
└─────────────────────────────┘         │     semester            text         │
                                        │     created_at          timestamptz  │
                                        └──────────────────────────────────────┘
                                         UNIQUE (course_id, student_identifier,
                                                 semester)
```

**Relationship:** One `course` → many `evaluations`. Each evaluation belongs to exactly one course.

---

## Data Models (TypeScript — `lib/types.ts`)

```typescript
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
  rating: number;          // 1–5
  comment: string | null;
  semester: string;
  created_at: string;      // ISO 8601
}

export interface EvaluationSummary {
  course_id: string;
  course_name: string;
  course_code: string;
  instructor_name: string;
  semester: string;
  average_rating: number;  // rounded to 1 decimal
  evaluation_count: number;
  comments: string[];      // non-null comments only
}
```
