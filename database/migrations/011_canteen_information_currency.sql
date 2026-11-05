-- School canteen information and preserved per-date currency.
-- Back up privately before migrating existing data. Server startup also ensures this schema.
CREATE TABLE IF NOT EXISTS canteen_info (
 id TINYINT PRIMARY KEY, name VARCHAR(100) NOT NULL, location VARCHAR(250) NOT NULL,
 hours JSON NOT NULL, notice_date DATE NULL, notice VARCHAR(500) NOT NULL,
 closed_for_notice TINYINT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 0,
 version INT UNSIGNED NOT NULL DEFAULT 0,
 updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;
SET @currency_ddl = IF(
 (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='canteen_menus' AND COLUMN_NAME='currency')=0,
 'ALTER TABLE canteen_menus ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT ''KRW''',
 'SELECT 1');
PREPARE canteen_currency_migration FROM @currency_ddl;
EXECUTE canteen_currency_migration;
DEALLOCATE PREPARE canteen_currency_migration;
