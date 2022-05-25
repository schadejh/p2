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

// TODO: issue queries.
/*  -- EXAMPLE OF AN INSERT QUERY 
const insertQuery = 'INSERT INTO vehicles(id, regNo, class, location) VALUES (?, ?, ?, ?)';
const parameters = [666, '420', 'M14', 'Hell'];
connection.query(insertQuery, parameters, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});
*/

function rowToMemory(row) {
  return {
    registry: row.regNo + ' an ' + row.class + ' at ' + row.location,
    lastMove: row.dateLastMoved,
  };
}

connection.query('SELECT * FROM vehicles', (error, rows) => {
  if (error) {
    console.error(error);
  } else {
    const vehicles = rows.map(rowToMemory);
    console.log(vehicles);
  }
});

connection.end();
