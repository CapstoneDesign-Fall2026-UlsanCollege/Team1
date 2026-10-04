-- Existing offerings remain unassigned until an administrator classifies them.
-- Their IDs and linked class schedules are preserved.
ALTER TABLE course_offerings
  ADD COLUMN major VARCHAR(150) COLLATE utf8mb4_unicode_ci NULL,
  DROP INDEX uq_course_offering,
  ADD UNIQUE KEY uq_course_offering (course_id,semester_id,major,section);
