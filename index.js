const express = require('express');
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

function create(row) {
	const insertQuery = 'INSERT INTO Vehicles(regNo, class, location, dateLastMoved, deadlined) VALUES (?, ?, ?, ?, ?)';
	// get parameters from user
	connection.query(insertQuery, parameters, (error, result) => {
		if (error) {
			console.error(error);
		} else {
			const vehicle = row.map(rowToMemory);
			console.log(result);
		}
	});
}

function readAll() {
	connection.query('SELECT * FROM Vehicles', (error, rows) => {
		if (error) {
			console.error(error);
		} else {
			const vehicles = rows.map(rowToMemory);
			console.log(vehicles);
		}
	});
}

function readOne(id) {
	connection.query('SELECT * FROM Vehicles WHERE id=?', (error, row) => {
		if (error) {
			console.error(error);
		} else {
			const vehicle = row.map(rowToMemory); // make a full row to memory function
			console.log(vehicle);
		}
	});
}

function update(row) {
	connection.query('UPDATE Vehicles SET regNo=?, class=?, location=?, dateLastMoved=?, deadlined=? WHERE id=?', (error, row) => {
		if (error) {
			console.error(error);
		} else {
			const vehicle = row.map(rowToMemory);
			console.log(row);
		}
	});
}

function deleteRow(row) {
	connection.query('UPDATE Vehicles SET deleted=1 WHERE id=?', (error, row) => {
		if (error) {
			console.error(error);
		} else {
			const vehicle = row.map(rowToMemory);
			console.log(row);
		}
	});
}

// define endpoints...

const service = express();

// CREATE
service.post('/vehicles/:regNo:class:location:dateLastMoved:deadlined', (request, response) => {
	connection.query('INSERT INTO Vehicles(regNo, class, location, dateLastMoved, deadlined) VALUES (?, ?, ?, ?, ?)', (error, rows) => {
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

// READ ALL
service.get('/vehicles/', (request, response) => {
	connection.query('SELECT * FROM Vehicles WHERE deleted=false', (error, rows) => {
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
	connection.query('SELECT * FROM Vehicles WHERE id=?', (error, rows) => {
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

// UPDATE
service.patch('/vehicles/:regNo:class:location:dateLastMoved:deadlined:id', (request, response) => {
	connection.query('UPDATE Vehicles SET regNo=?, class=?, location=?, dateLastMoved=?, deadlined=? WHERE id=?', (error, rows) => {
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

// DELETE
service.delete('/vehicles/delete/:id', (request, response) => {
	const parameters = [parseInt(request.params.id)];
		connection.query('UPDATE Vehicles SET deleted=TRUE WHERE id=?', (error, rows) => {
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

const port = 5001;
service.listen(port, () => {
	console.log(`We're live in port ${port}!`);
});

// connection.end();
