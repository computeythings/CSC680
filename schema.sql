--
-- Table structure for table customer
--

CREATE TABLE customer (
  id int(11) NOT NULL AUTO_INCREMENT,
  firstname varchar(64) NOT NULL,
  lastname varchar(64) NOT NULL,
  licenseplate varchar(16) NOT NULL,
  make varchar(32) NOT NULL,
  model varchar(32) NOT NULL,
  carwash boolean NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id)
);

--
-- Table structure for table floor
--

CREATE TABLE floor (
  id int(11) NOT NULL AUTO_INCREMENT,
  lot int(11) NOT NULL,
  level int(11) NOT NULL,
  PRIMARY KEY (id),
  KEY lot (lot),
  FOREIGN KEY (lot) REFERENCES parking_lot (id)
);

--
-- Table structure for table parking_lot
--

CREATE TABLE parking_lot (
  id int(11) NOT NULL AUTO_INCREMENT,
  zip_code varchar(20) NOT NULL,
  city varchar(100) NOT NULL,
  state varchar(100) NOT NULL,
  street varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

--
-- Table structure for table parking_slip
--

CREATE TABLE parking_slip (
  id int(11) NOT NULL AUTO_INCREMENT,
  slot int(11) NOT NULL,
  customer int(11) NOT NULL,
  start timestamp NOT NULL,
  end timestamp,
  valet boolean NOT NULL DEFAULT FALSE,
  carwash boolean NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  KEY slot (slot),
  KEY customer (customer),
  FOREIGN KEY (slot) REFERENCES parking_slot (id),
  FOREIGN KEY (customer) REFERENCES customer (id)
);
--
-- Table structure for table parking_slot
--

CREATE TABLE parking_slot (
  id int(11) NOT NULL AUTO_INCREMENT,
  floor int(11) NOT NULL,
  spot_number varchar(8) NOT NULL,
  PRIMARY KEY (id),
  KEY floor (floor),
  FOREIGN KEY (floor) REFERENCES floor (id)
);

--
-- Table structure for table user
--

CREATE TABLE user (
  id int(11) NOT NULL AUTO_INCREMENT,
  user varchar(64) NOT NULL,
  passwordstring varchar(64) NOT NULL,
  password varchar(60) NOT NULL,
  firstname varchar(64) NOT NULL,
  lastname varchar(64) NOT NULL,
  role varchar(64) NOT NULL,
  FOREIGN KEY (role) REFERENCES role (name)
  PRIMARY KEY (id),
  UNIQUE (user)
);

--
-- Table structure for user roles
--

CREATE TABLE role (
  name varchar(64) NOT NULL,
  PRIMARY KEY (name)
);

--
-- View for parking info
--

CREATE VIEW parking AS
SELECT
    lot.id AS lot_id,
    slot.id AS slot_id,
    f.id AS floor_id,
    f.level AS level,
    slot.spot_number AS spot,
    slip.id AS parked
FROM parking_slot slot
JOIN floor f ON slot.floor = f.id
JOIN parking_lot lot ON f.lot = lot.id
LEFT JOIN parking_slip slip ON slip.slot = slot.id AND slip.end IS NULL;

--
-- View for valet info
--

CREATE VIEW valet AS
SELECT
    slot.id AS slot_id,
    slot.spot_number AS spot,
    lot.id AS lot_id,
    slip.id AS slip_id,
    c.firstname,
    c.lastname,
    c.licenseplate,
    c.make,
    c.model,
    slip.carwash,
    c.carwash AS washed,
    slip.start
FROM parking_slot slot
JOIN floor f ON slot.floor = f.id AND f.level = 1
JOIN parking_lot lot ON f.lot = lot.id
LEFT JOIN parking_slip slip ON slip.slot = slot.id AND slip.end IS NULL AND slip.valet
LEFT JOIN customer c ON slip.customer = c.id;