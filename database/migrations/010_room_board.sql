-- Fixed building layout; editable names are preserved on rerun.
CREATE TABLE IF NOT EXISTS school_rooms (
    id INT UNSIGNED PRIMARY KEY, floor_number INT NOT NULL, position_number INT NOT NULL,
    kind ENUM('regular','special') NOT NULL, name VARCHAR(100) NOT NULL,
    UNIQUE KEY uq_room_position(floor_number,position_number)
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_class_rooms (
    year_id INT UNSIGNED NOT NULL, class_id INT UNSIGNED NOT NULL, room_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(year_id,class_id), UNIQUE KEY uq_year_room(year_id,room_id),
    FOREIGN KEY(year_id) REFERENCES school_years(id), FOREIGN KEY(class_id) REFERENCES school_classes(id), FOREIGN KEY(room_id) REFERENCES school_rooms(id)
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school_room_bookings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, room_id INT UNSIGNED NOT NULL, class_id INT UNSIGNED NOT NULL,
    offering_id INT UNSIGNED NOT NULL, teacher_id INT UNSIGNED NOT NULL, day_of_week INT NOT NULL,
    start_time TIME NOT NULL, end_time TIME NOT NULL, starts_on DATE NOT NULL, ends_on DATE NOT NULL,
    repeats_weekly TINYINT NOT NULL, is_cancelled TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY(room_id) REFERENCES school_rooms(id), FOREIGN KEY(class_id) REFERENCES school_classes(id),
    FOREIGN KEY(offering_id) REFERENCES course_offerings(id), FOREIGN KEY(teacher_id) REFERENCES school_teachers(id)
  ) ENGINE=InnoDB;
INSERT IGNORE INTO school_rooms(id,floor_number,position_number,kind,name) VALUES
(101,1,1,'regular','Classroom 101'),
(102,1,2,'regular','Classroom 102'),
(103,1,3,'regular','Classroom 103'),
(104,1,4,'regular','Classroom 104'),
(105,1,5,'regular','Classroom 105'),
(106,1,6,'regular','Classroom 106'),
(107,1,7,'special','Physics lab'),
(108,1,8,'special','Chemistry lab'),
(201,2,1,'regular','Classroom 201'),
(202,2,2,'regular','Classroom 202'),
(203,2,3,'regular','Classroom 203'),
(204,2,4,'regular','Classroom 204'),
(205,2,5,'regular','Classroom 205'),
(206,2,6,'regular','Classroom 206'),
(207,2,7,'special','Computer lab'),
(208,2,8,'special','Science lab'),
(301,3,1,'regular','Classroom 301'),
(302,3,2,'regular','Classroom 302'),
(303,3,3,'regular','Classroom 303'),
(304,3,4,'regular','Classroom 304'),
(305,3,5,'regular','Classroom 305'),
(306,3,6,'regular','Classroom 306'),
(307,3,7,'special','Dance room'),
(308,3,8,'special','Music room'),
(401,4,1,'regular','Classroom 401'),
(402,4,2,'regular','Classroom 402'),
(403,4,3,'regular','Classroom 403'),
(404,4,4,'regular','Classroom 404'),
(405,4,5,'regular','Classroom 405'),
(406,4,6,'regular','Classroom 406'),
(407,4,7,'special','Art room'),
(408,4,8,'special','Biology lab'),
(501,5,1,'regular','Classroom 501'),
(502,5,2,'regular','Classroom 502'),
(503,5,3,'regular','Classroom 503'),
(504,5,4,'regular','Classroom 504'),
(505,5,5,'regular','Classroom 505'),
(506,5,6,'regular','Classroom 506'),
(507,5,7,'special','Library'),
(508,5,8,'special','Activity room');
