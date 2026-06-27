-- ============================================================
--  smart_bus_db — Full Schema + Sample Data (Fixed)
--  Compatible with MySQL 5.7 / 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_bus_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smart_bus_db;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE Users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('admin', 'driver', 'passenger') NOT NULL,
    phone      VARCHAR(20),
    status     ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (name, email, password, role, phone, status) VALUES
('Nimal Perera',         'nimal@smartbus.lk',    '$2b$10$adminHashABCDEFGHIJ1234', 'admin',     '0771234567', 'approved'),
('Sanduni Fernando',     'sanduni@smartbus.lk',  '$2b$10$adminHashABCDEFGHIJ5678', 'admin',     '0772345678', 'approved'),
('Kamal Silva',          'kamal@driver.lk',      '$2b$10$driverHashABCDEFGH1234', 'driver',    '0773456789', 'approved'),
('Ruwan Jayasena',       'ruwan@driver.lk',      '$2b$10$driverHashABCDEFGH5678', 'driver',    '0774567890', 'approved'),
('Asanka Bandara',       'asanka@driver.lk',     '$2b$10$driverHashABCDEFGH9012', 'driver',    '0775678901', 'pending'),
('Priyantha Wijeratne',  'priyantha@driver.lk',  '$2b$10$driverHashABCDEFGH3456', 'driver',    '0776789012', 'rejected'),
('Dilshan Rathnayake',   'dilshan@gmail.com',    '$2b$10$passHashABCDEFGHI1234',  'passenger', '0777890123', 'approved'),
('Nimasha Dissanayake',  'nimasha@gmail.com',    '$2b$10$passHashABCDEFGHI5678',  'passenger', '0778901234', 'approved'),
('Tharaka Seneviratne',  'tharaka@gmail.com',    '$2b$10$passHashABCDEFGHI9012',  'passenger', '0779012345', 'approved'),
('Chathura Madushanka',  'chathura@gmail.com',   '$2b$10$passHashABCDEFGHI3456',  'passenger', '0770123456', 'approved');


-- ============================================================
-- 2. BUSES
-- ============================================================
CREATE TABLE Buses (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    bus_number  VARCHAR(20) UNIQUE NOT NULL,
    type        VARCHAR(50),
    capacity    INT,
    driver_id   INT,                              -- FIX: link bus to driver
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES Users(id) ON DELETE SET NULL
);

INSERT INTO Buses (bus_number, type, capacity, driver_id) VALUES
('NB-1234', 'AC Express',        45, 3),
('NB-5678', 'Semi-Luxury',       50, 4),
('NC-3344', 'Intercity Express', 55, NULL),
('NC-7788', 'Ordinary',          60, NULL),
('ND-2211', 'AC Semi-Luxury',    48, NULL),
('ND-9900', 'Luxury',            40, NULL);


-- ============================================================
-- 3. ROUTES  — FIX: added status + driver_id + created_at
-- ============================================================
CREATE TABLE Routes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    driver_id   INT,                              -- FIX: who submitted this route
    origin      VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    route_name  VARCHAR(200) NOT NULL,
    status      ENUM('pending','approved','rejected') DEFAULT 'pending', -- FIX: was missing
    admin_note  VARCHAR(255),                     -- FIX: admin edit note before approving
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES Users(id) ON DELETE SET NULL
);

INSERT INTO Routes (driver_id, origin, destination, route_name, status) VALUES
(3, 'Kandy',    'Colombo',       'Kandy - Colombo (A1 Highway)',          'approved'),
(4, 'Mawanella','Kegalle',       'Mawanella - Kegalle Local',             'approved'),
(3, 'Colombo',  'Galle',         'Colombo - Galle (Southern Expressway)', 'approved'),
(4, 'Colombo',  'Kurunegala',    'Colombo - Kurunegala (A10)',            'approved'),
(3, 'Kandy',    'Nuwara Eliya',  'Kandy - Nuwara Eliya Scenic Route',     'approved'),
(4, 'Badulla',  'Colombo',       'Badulla - Colombo (A5/A1)',             'approved');


-- ============================================================
-- 4. ROUTE STOPS
-- ============================================================
CREATE TABLE Route_Stops (
    id                        INT AUTO_INCREMENT PRIMARY KEY,
    route_id                  INT NOT NULL,
    stop_name                 VARCHAR(100) NOT NULL,
    latitude                  DECIMAL(10,8),
    longitude                 DECIMAL(10,8),
    stop_order                INT NOT NULL,
    estimated_time_from_start INT,
    FOREIGN KEY (route_id) REFERENCES Routes(id) ON DELETE CASCADE
);

-- Route 1: Kandy → Colombo
INSERT INTO Route_Stops (route_id, stop_name, latitude, longitude, stop_order, estimated_time_from_start) VALUES
(1,'Kandy',       7.29176300,80.63563200,1,  0),
(1,'Mawanella',   7.25429900,80.45129700,2, 35),
(1,'Kegalle',     7.25154500,80.34609000,3, 55),
(1,'Warakapola',  7.24781300,80.13756400,4, 80),
(1,'Ambepussa',   7.18910000,80.09930000,5, 95),
(1,'Veyangoda',   7.16202700,79.99832300,6,110),
(1,'Ja-Ela',      7.08097500,79.89226800,7,130),
(1,'Colombo',     6.92702100,79.86126900,8,155);

-- Route 2: Mawanella → Kegalle
INSERT INTO Route_Stops (route_id, stop_name, latitude, longitude, stop_order, estimated_time_from_start) VALUES
(2,'Mawanella',   7.25429900,80.45129700,1, 0),
(2,'Anwarama',    7.25800000,80.40200000,2,12),
(2,'Uthuwankanda',7.25900000,80.37500000,3,22),
(2,'Kegalle',     7.25154500,80.34609000,4,35);

-- Route 3: Colombo → Galle
INSERT INTO Route_Stops (route_id, stop_name, latitude, longitude, stop_order, estimated_time_from_start) VALUES
(3,'Colombo',     6.92702100,79.86126900,1,  0),
(3,'Moratuwa',    6.77366100,79.88226900,2, 30),
(3,'Panadura',    6.71390000,79.90500000,3, 45),
(3,'Aluthgama',   6.42900000,80.00600000,4, 90),
(3,'Hikkaduwa',   6.13964900,80.10552200,5,120),
(3,'Galle',       6.05305200,80.22087800,6,135);

-- Route 4: Colombo → Kurunegala
INSERT INTO Route_Stops (route_id, stop_name, latitude, longitude, stop_order, estimated_time_from_start) VALUES
(4,'Colombo',     6.92702100,79.86126900,1,  0),
(4,'Kelaniya',    6.95433700,79.92066900,2, 20),
(4,'Gampaha',     7.08987100,79.99957400,3, 45),
(4,'Veyangoda',   7.16202700,79.99832300,4, 60),
(4,'Mirigama',    7.24673900,80.02963400,5, 80),
(4,'Kurunegala',  7.48606200,80.36337000,6,130);

-- Route 5: Kandy → Nuwara Eliya
INSERT INTO Route_Stops (route_id, stop_name, latitude, longitude, stop_order, estimated_time_from_start) VALUES
(5,'Kandy',       7.29176300,80.63563200,1,  0),
(5,'Peradeniya',  7.26817000,80.59445000,2, 15),
(5,'Gampola',     7.16340000,80.57540000,3, 35),
(5,'Nawalapitiya',7.05360000,80.53580000,4, 60),
(5,'Hatton',      6.89010000,80.59510000,5, 95),
(5,'Nuwara Eliya',6.94981300,80.78862200,6,135);

-- Route 6: Badulla → Colombo
INSERT INTO Route_Stops (route_id, stop_name, latitude, longitude, stop_order, estimated_time_from_start) VALUES
(6,'Badulla',     6.99350000,81.05526000,1,  0),
(6,'Bandarawela', 6.83277000,80.98883000,2, 30),
(6,'Welimada',    6.90540000,80.91000000,3, 55),
(6,'Nuwara Eliya',6.94981300,80.78862200,4, 80),
(6,'Kandy',       7.29176300,80.63563200,5,160),
(6,'Colombo',     6.92702100,79.86126900,6,320);


-- ============================================================
-- 5. SCHEDULES  — FIX: new table (was missing)
-- ============================================================
CREATE TABLE Schedules (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    route_id       INT NOT NULL,
    bus_id         INT NOT NULL,
    driver_id      INT NOT NULL,
    departure_time TIME NOT NULL,
    days_of_week   SET('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id)  REFERENCES Routes(id)  ON DELETE CASCADE,
    FOREIGN KEY (bus_id)    REFERENCES Buses(id)   ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES Users(id)   ON DELETE CASCADE
);

INSERT INTO Schedules (route_id, bus_id, driver_id, departure_time, days_of_week) VALUES
(1, 1, 3, '06:00:00', 'Mon,Tue,Wed,Thu,Fri,Sat'),
(1, 2, 4, '14:00:00', 'Mon,Tue,Wed,Thu,Fri'),
(3, 2, 4, '07:30:00', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'),
(4, 3, 3, '08:00:00', 'Mon,Wed,Fri'),
(5, 5, 3, '09:00:00', 'Sat,Sun');


-- ============================================================
-- 6. TRIPS / TRACKING  — FIX: added extra_minutes + started_at + ended_at
-- ============================================================
CREATE TABLE Trips (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    bus_id        INT,
    driver_id     INT,
    route_id      INT,
    schedule_id   INT,
    status        ENUM('scheduled','active','delayed','completed','cancelled') DEFAULT 'scheduled',
    current_lat   DECIMAL(10,8),
    current_lng   DECIMAL(10,8),
    delay_reason  VARCHAR(255),
    extra_minutes INT DEFAULT 0,              -- FIX: was missing
    started_at    TIMESTAMP NULL,             -- FIX: was missing
    ended_at      TIMESTAMP NULL,             -- FIX: was missing
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id)      REFERENCES Buses(id)     ON DELETE SET NULL,
    FOREIGN KEY (driver_id)   REFERENCES Users(id)     ON DELETE SET NULL,
    FOREIGN KEY (route_id)    REFERENCES Routes(id)    ON DELETE SET NULL,
    FOREIGN KEY (schedule_id) REFERENCES Schedules(id) ON DELETE SET NULL
);

INSERT INTO Trips (bus_id, driver_id, route_id, status, current_lat, current_lng, delay_reason, extra_minutes, started_at) VALUES
(1, 3, 1, 'active',    7.25154500, 80.34609000, NULL, 0, NOW()),
(2, 4, 3, 'delayed',   6.77366100, 79.88226900, 'Heavy traffic due to road accident', 20, NOW()),
(3, 3, 4, 'scheduled', NULL, NULL, NULL, 0, NULL),
(4, 4, 2, 'scheduled', NULL, NULL, NULL, 0, NULL),
(5, 3, 5, 'scheduled', NULL, NULL, NULL, 0, NULL),
(1, 3, 6, 'completed', 6.92702100, 79.86126900, NULL, 0, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(2, 4, 1, 'completed', 6.92702100, 79.86126900, NULL, 0, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(6, 4, 3, 'cancelled', NULL, NULL, 'Driver unavailable', 0, NULL);


-- ============================================================
-- 7. PASSENGER TRACKING SUBSCRIPTIONS  — FIX: new table (was missing)
-- ============================================================
CREATE TABLE Subscriptions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id    INT NOT NULL,
    trip_id         INT NOT NULL,
    boarding_stop   VARCHAR(100) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    subscribed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES Users(id)  ON DELETE CASCADE,
    FOREIGN KEY (trip_id)      REFERENCES Trips(id)  ON DELETE CASCADE
);

-- ============================================================
-- END OF SCRIPT
-- ============================================================
