--
-- Table structure for table customer
--

CREATE TABLE customer (
  id int(11) NOT NULL AUTO_INCREMENT,
  vehicle varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

--
-- Table structure for table vehicle
--

CREATE TABLE vehicle (
  id int(11) NOT NULL AUTO_INCREMENT,
  licenseplate varchar(16) NOT NULL,
  make varchar(32) NOT NULL,
  model varchar(32) NOT NULL,
  owner int(11),
  PRIMARY KEY (id),
  UNIQUE (licenseplate),
  KEY owner (owner),
  FOREIGN KEY (owner) REFERENCES customer (id)
);

--
-- Table structure for table floor
--

CREATE TABLE floor (
  id int(11) NOT NULL AUTO_INCREMENT,
  lot int(11) NOT NULL,
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
  licenseplate varchar(16) NOT NULL,
  duration time NOT NULL,
  start timestamp NOT NULL,
  PRIMARY KEY (id),
  KEY slot (slot),
  KEY licenseplate (licenseplate),
  FOREIGN KEY (slot) REFERENCES parking_slot (id),
  FOREIGN KEY (licenseplate) REFERENCES vehicle (licenseplate)
);

--
-- Table structure for table parking_slot
--

CREATE TABLE parking_slot (
  id int(11) NOT NULL AUTO_INCREMENT,
  floor int(11) NOT NULL,
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
  PRIMARY KEY (id),
  UNIQUE (user)
);

INSERT INTO `user` (`user`, `passwordstring`, `password`, `firstname`, `lastname`)
VALUES ('test', 'password123', '$2y$05$/7b8NYtWzMw6miqucX40LuJBtOSZ4GUoS8U.UrV70rEaWzhSQvIM2', 'test', 'user');