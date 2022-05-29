DROP TABLE IF EXISTS Vehicles;

CREATE TABLE Vehicles
(
	id INT PRIMARY KEY AUTO_INCREMENT, -- primary keys are automatically unique and not null
	regNo VARCHAR(8),
	class VARCHAR(16),
	location VARCHAR(32),
	dateLastMoved DATE,
	deadlined BOOLEAN NOT NULL DEFAULT FALSE,
	deleted BOOLEAN NOT NULL DEFAULT FALSE
	-- FOREIGN KEY (class) REFERENCES Classes(class)
);

INSERT INTO Vehicles (regNo, class, location, dateLastMoved, deadlined) VALUES
-- first platoon
('111',	'M915A3',	'Leonard',	"2022-05-15",	FALSE	),
('112',	'M915A3',	'Leonard',	"2022-05-15",	FALSE	),
('113',	'M915A3',	'Emporia',	"2022-05-15",	FALSE	),
('114',	'M915A3',	'Emporia',	"2021-10-12",	TRUE	),

('121',	'M915A3',	'Emporia',	"2022-05-15",	FALSE	),
('122',	'M915A5',	'Leonard',	"2022-05-15",	FALSE	),
('123',	'M984A2',	'Emporia',	"2022-05-15",	FALSE	),
('124',	'M984A2',	'Emporia',	"2021-10-12",	TRUE	),

('131',	'M915A3',	'Emporia',	"2022-03-14",	FALSE	),
('132',	'M915A3',	'Leonard',	"2022-03-14",	TRUE	),
('133',	'M915A3',	'Emporia',	"2022-03-14",	TRUE	),
('134',	'M915A5',	'Leonard',	"2022-05-15",	FALSE	),

-- second platoon
('211',	'M915A3',	'Emporia',	"2022-05-15",	FALSE	),
('212',	'M915A3',	'Emporia',	"2022-01-07",	TRUE	),
('213',	'M915A5',	'Emporia',	"2021-06-12",	TRUE	),
('214',	'M915A3',	'Emporia',	"2022-01-07",	TRUE	),

('221',	'M915A5',	'Emporia',	"2022-02-13",	TRUE	),
('222',	'M915A5',	'Emporia',	"2022-02-13",	FALSE	),
('223',	'M915A5',	'Emporia',	"2022-05-15",	FALSE	),
('224',	'M915A3',	'Emporia',	"2022-05-15",	FALSE	),

('231',	'M915A3',	'Emporia',	"2022-05-15",	FALSE	),
('232',	'M984A4',	'Emporia',	"2022-05-15",	FALSE	),
('233',	'M984A2',	'Emporia',	"2022-02-13",	TRUE	),
('234',	'M915A3',	'Emporia',	"2022-02-12",	TRUE	);



DROP TABLE IF EXISTS Classes;

CREATE TABLE Classes
(
	id INT PRIMARY KEY AUTO_INCREMENT,
	family VARCHAR(8),
	revision VARCHAR(8),
	description VARCHAR(32)
);

INSERT INTO Classes (family, revision, description) VALUES
('915', '3', 'long range, line-haul, A3'),
('915', '5', 'long range, line-haul, A5'),
('984', '2', 'wrecker'),
('1120', '4', 'load handling system (LHS)');
