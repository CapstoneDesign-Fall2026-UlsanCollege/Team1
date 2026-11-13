-- Existing installations: run once after 010. Server startup performs the
-- guarded/idempotent equivalent in ensureSchoolSchema; do not run both blindly.
-- Internal room IDs and all existing foreign keys remain unchanged.
ALTER TABLE school_rooms ADD COLUMN room_number VARCHAR(32) NULL UNIQUE;
UPDATE school_rooms SET room_number=CAST(id AS CHAR) WHERE room_number IS NULL;
CREATE TABLE IF NOT EXISTS school_floors (
  floor_number INT PRIMARY KEY, label VARCHAR(60) NOT NULL
) ENGINE=InnoDB;
INSERT IGNORE INTO school_floors(floor_number,label)
SELECT DISTINCT floor_number,CONCAT('Floor ',floor_number) FROM school_rooms;
CREATE TABLE IF NOT EXISTS school_building_settings (
  id INT PRIMARY KEY, initialized TINYINT NOT NULL DEFAULT 0
) ENGINE=InnoDB;
INSERT IGNORE INTO school_building_settings(id,initialized) VALUES(1,1);
CREATE TABLE IF NOT EXISTS school_transfer_identity (
  id INT PRIMARY KEY, identity CHAR(36) NOT NULL
) ENGINE=InnoDB;
INSERT IGNORE INTO school_transfer_identity(id,identity) VALUES(1,UUID());
