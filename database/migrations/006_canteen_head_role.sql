-- Add the canteen-head role at the end so existing enum values keep their positions.
-- Existing accounts, passwords, active status and student profiles are unchanged.
-- The backend performs this once at startup after checking the existing schema.
ALTER TABLE users
  MODIFY COLUMN role ENUM('admin','student','canteen_head') NOT NULL DEFAULT 'student';

-- Recovery: roll back application code while retaining this extra enum value.
-- Do not shrink the enum after canteen-head accounts have been created.
