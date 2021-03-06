const { query } = require('express');
const express = require('express');
const { append } = require('express/lib/response');
const fs = require('fs');
const mysql = require('mysql');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);
const connection = mysql.createConnection(credentials);

connection.connect(error => {
	if (error) {
		console.error(error);
		process.exit(1);
	}
});

// helper function for showing a row's info on the console
function rowToMemory(row) {
	return {
		registry: row.regNo + ' an ' + row.class + ' at ' + row.location,
		lastMove: row.dateLastMoved,
	};
}

// function create(row) {
// 	const insertQuery = 'INSERT INTO Vehicles(regNo, class, location, dateLastMoved, deadlined) VALUES (?, ?, ?, ?, ?)';
// 	// get parameters from user
// 	connection.query(insertQuery, parameters, (error, result) => {
// 		if (error) {
// 			console.error(error);
// 		} else {
// 			const vehicle = row.map(rowToMemory);
// 			console.log(result);
// 		}
// 	});
// }

// function readAll() {
// 	connection.query('SELECT * FROM Vehicles', (error, rows) => {
// 		if (error) {
// 			console.error(error);
// 		} else {
// 			const vehicles = rows.map(rowToMemory);
// 			console.log(vehicles);
// 		}
// 	});
// }

// function readOne(id) {
// 	connection.query('SELECT * FROM Vehicles WHERE id=?', (error, row) => {
// 		if (error) {
// 			console.error(error);
// 		} else {
// 			const vehicle = row.map(rowToMemory); // make a full row to memory function
// 			console.log(vehicle);
// 		}
// 	});
// }

// function update(row) {
// 	connection.query('UPDATE Vehicles SET regNo=?, class=?, location=?, dateLastMoved=?, deadlined=? WHERE id=?', (error, row) => {
// 		if (error) {
// 			console.error(error);
// 		} else {
// 			const vehicle = row.map(rowToMemory);
// 			console.log(row);
// 		}
// 	});
// }

// function deleteRow(row) {
// 	connection.query('UPDATE Vehicles SET deleted=1 WHERE id=?', (error, row) => {
// 		if (error) {
// 			console.error(error);
// 		} else {
// 			const vehicle = row.map(rowToMemory);
// 			console.log(row);
// 		}
// 	});
// }

// define endpoints...

// express.static('p2');

const service = express();
service.use(express.json()); // ADDED FROM STACKOVERFLOW

// SERVE REPORT.HTML
service.get('/report.html', (request, response) => {
	console.log('request for report.html');
	const path = require('path');
	const projDir = '/home/james_schader/p2/';
	response.sendFile(path.join(projDir, 'public/report.html'));
});

// CREATE
service.post('/vehicles/create', (request, response) => {
	console.log('it is a CREATE request!');
	console.log(request.body);
	if (request.body.hasOwnProperty('regNo') &&
		request.body.hasOwnProperty('class') &&
		request.body.hasOwnProperty('location') &&
		request.body.hasOwnProperty('dateLastMoved') &&
		request.body.hasOwnProperty('deadlined')) {
  
	  const parameters = [
		request.body.regNo,
		request.body.class,
		request.body.location,
		request.body.dateLastMoved,
		request.body.deadlined,
	  ];
  
	  const query = 'INSERT INTO Vehicles(regNo, class, location, dateLastMoved, deadlined) VALUES (?, ?, ?, ?, ?)';
	  connection.query(query, parameters, (error, result) => {
		if (error) {
		  response.status(500);
		  response.json({
			ok: false,
			results: error.message,
		  });
		} else {
		  response.json({
			ok: true,
			results: result.insertId,
		  });
		}
	  });
  
	} else {
	  response.status(400);
	  response.json({
		ok: false,
		results: 'Incomplete vehicle.',
	  });
	}
  });

// READ ALL
service.get('/vehicles/', (request, response) => {
	const query = 'SELECT * FROM Vehicles WHERE deleted=false';
	connection.query(query, (error, rows) => {
		if (error) {
			console.error(error);
			response.status(500);
			response.json({
				ok: false,
				results: error.message,
			});
		} else {
			const vehicles = rows.map(rowToMemory);
			console.log(vehicles);
			response.json({
				ok: true,
				results: vehicles,
			});
		}
	});
});

// READ ONE
service.get('/vehicles/:id', (request, response) => {
	console.log('hey it is a READ ONE request');
	const parameters = [parseInt(request.params.id)];

	const query = 'SELECT * FROM Vehicles WHERE id=?';
	connection.query(query, parameters, (error, row) => {
		if (error) {
			console.error(error);
			response.status(500);
			response.json({
				ok: false,
				results: error.message,
			});
		} else {
			const vehicle = row.rowToMemory;
			console.log('single row: ' + row.id);
			console.log('single vehicle: ' + vehicle);
			response.json({
				ok: true,
				results: vehicle,
			});
		}
	});
});

// UPDATE
service.patch('/vehicles/update/:id', (request, response) => {
	console.log('it is an UPDATE request');
	console.log(request.body);
	const parameters = [
		request.body.regNo,
		request.body.class,
		request.body.location,
		request.body.dateLastMoved,
		request.body.deadlined,
		parseInt(request.params.id),
	];

	const query = 'UPDATE Vehicles SET regNo=?, class=?, location=?, dateLastMoved=?, deadlined=? WHERE id=?';
	connection.query(query, parameters, (error, result) => {
		if (error) {
			console.error(error);
			response.status(500);
			response.json({
				ok: false,
				results: error.message,
			});
		} else {
			console.log(result);
			response.json({
				ok: true,
				results: result,
			});
		}
	});
});

// DELETE
service.delete('/vehicles/delete/:id', (request, response) => {
	console.log('hey it is a delete request');
	const parameters = [parseInt(request.params.id)];

	const query = 'UPDATE Vehicles SET deleted=TRUE WHERE id=?';
	connection.query(query, parameters, (error, result) => {
		if (error) {
			console.error(error);
			response.status(500);
			response.json({
				ok: false,
				results: error.message,
			});
		} else {
			const deletedVehicle = result;
			console.log('deleted vehicle:' + deletedVehicle);
			response.json({
				ok: true,
				results: 'deleted vehicle:' + deletedVehicle,
			});
		}
	});
});

// OPTIONS
service.options('*', (request, response) => {
	response.set('Access-Control-Allow-Headers', 'Content-Type');
	response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
	response.sendStatus(200);
  });

const port = 5001;
service.listen(port, () => {
	console.log(`We're live in port ${port}!`);
});
