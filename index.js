const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const db = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b0fa1f50f8ee7c',
    password: '1dcbdead',
    database: 'heroku_06e238fa8dcde39',
    multipleStatements: true
});


// Permission do enable CORS
app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,PATCH');
    app.use(cors());
    next();
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to goodluck application." });
});

app.get('/users', function (req, res) {
	db.query('SELECT * FROM user ORDER BY idUser DESC', function (error, results, fields) {
		if (error) throw error;
		res.send(results)
	});
});

app.get('/users/profile/:email', function (req, res) {
	var email = req.params.email;
	db.query('SELECT * FROM user where email=? ',[email], function (error, results, fields) {
		if (error) throw error;
		res.send(results)
	});
});


app.post('/users/auth', function (request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT * FROM user WHERE email = ? AND password = ?', [username, password], function (error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				// request.session.loggedin = true;
				// request.session.username = username;
				// Redirect to home page
				response.redirect("/users");
			} else {
				response.send({ message: 'Incorrect Username and/or Password!' });
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/user/create', function (request, response) {
	// Capture the input fields
	let name = request.body.name;
	let username = request.body.username;
	let password = request.body.password;
	let userId = request.body.userId;

	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query(`Select email from user WHERE email=?`, [username], function (error, results, fields) {
			// If there is an issue with the query, output the error
			//if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				response.status(400).json({
					title: 'Ops...'
				})
			} else {
				db.query(`INSERT into user ( idUser, name, email, password ) VALUES (?,?,?,?)`, [userId, name, username, password], function (error, results, fields) {
					response.send()

				});
			}
			response.end();
		});
	} else {
		response.send('Entre com usuario e senha.');
		response.end();
	}
});

////SORTEIO

app.post('/raffle/create', function (request, response) {
	// Capture the input fields
	let idRaffle = request.body.idRaffle
	let RaffleName = request.body.nomeSorteio;
	let RaffleParticipants = request.body.participantes;
	let RaffleUserDrawn = ''
	let date = request.body.data;
	let description = request.body.description
	let User_idUser = 1

	// Execute SQL query that'll select the account from the database based on the specified username and password
	db.query(`INSERT into raffle (idRaffle, RaffleName, RaffleParticipants, RaffleUserDrawn, date, description, User_idUser ) VALUES (?,?,?,?,?,?,?)`, [idRaffle, RaffleName, RaffleParticipants, RaffleUserDrawn, date, description, User_idUser], function (error, results, fields) {
		// If there is an issue with the query, output the error
		if (error) throw error;
		// If the account exists
		if (results.length > 0) {
			response.statusCode(200);
		} else {
			response.send({ message: 'Usuario ja existente' });
		}
		response.end();
	});
}
);

app.get('/raffle/all', function (request, response) {

	// Execute SQL query that'll select the account from the database based on the specified username and password
	db.query(`SELECT * FROM raffle ORDER BY idRaffle DESC`, function (error, results, fields) {
		// If there is an issue with the query, output the error
		if (error) throw error;
		// If the account exists
		if (results.length > 0) {
			response.send(results)
		} else {
			response.send({ message: 'Não existe dados' });
		}
		response.end();
	});
}
);

app.put('/raffle/raffle/:id?', function (request, response) {
	// Capture the input fields
	let idRaffle = request.body.idRaffle
	let RaffleUserDrawn = request.body.numeroSorteado
	// Execute SQL query that'll select the account from the database based on the specified username and password
	db.query(`UPDATE raffle SET RaffleUserDrawn = ? WHERE idRaffle = ?`, [RaffleUserDrawn, idRaffle], function (error, results, fields) {
		// If there is an issue with the query, output the error
		if (error) throw error;
		// If the account exists
		if (results.length > 0) {
			response.statusCode(200);
		} else {
			response.send({ message: 'Não foi possivel atualizar' });
		}
		response.end();
	});
}
);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});




// app.post('/user/create', function(request, response) {
// 	// Capture the input fields
// 	let name = request.body.name;
// 	let username = request.body.username;
// 	let password = request.body.password;
// 	let userId = request.body.userId;

// 	// Ensure the input fields exists and are not empty
// 	if (username && password) {
// 		// Execute SQL query that'll select the account from the database based on the specified username and password
// 		db.query(`INSERT into user ( idUser, name, email, password ) VALUES (?,?,?,?)`, [userId, name, username, password], function(error, results, fields) {
// 			// If there is an issue with the query, output the error
// 			if (error) throw error;
// 			// If the account exists
// 			if (results.length > 0) {
// 				// Authenticate the user
// 				// request.session.loggedin = true;
// 				// request.session.username = username;
// 				// Redirect to home page
// 				response.redirect("/login");
// 			} else {
// 				response.send({message:'Usuario ja existente'});
// 			}			
// 			response.end();
// 		});
// 	} else {
// 		response.send('Entre com usuario e senha.');
// 		response.end();
// 	}
// });