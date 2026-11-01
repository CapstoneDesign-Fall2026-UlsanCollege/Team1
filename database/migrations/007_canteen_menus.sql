-- C1: additive; no existing accounts or academic tables are changed.
CREATE TABLE IF NOT EXISTS canteen_menus (
  service_date DATE PRIMARY KEY,
  published TINYINT NOT NULL DEFAULT 0,
  items JSON NOT NULL,
  version INT UNSIGNED NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);
