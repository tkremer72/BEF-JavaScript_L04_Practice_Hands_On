var express = require('express');
var router = express.Router();
//require mysql
const mysql = require('mysql');
//add the mysql database connection
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password1!',
  database: 'sakila'
}); 
connection.connect(function(err) {
  if(err) {
    console.error(err.message);
    return;
  }
  console.log('Yay! You are connected to the database!');
});


/* Get  the list of  films from the database*/
router.get('/film', function(req, res, next) {
  let filmQuery = `SELECT * FROM film`;

  connection.query(filmQuery, function(err, result) {
    if(err) {
      console.log(err);
      res.render('error', { message: err.message });
    }else{
      res.render('film', {films: result});
    }
  });
});
//Get the film title with associated actors 
router.get('/film/:id', function(req, res, next) {
  let filmId = parseInt(req.params.id);
  let filmActorQuery = `
  SELECT film.title, actor.first_name, actor.last_name
  FROM film INNER JOIN film_actor ON film.film_id = film_actor.film_id
  INNER JOIN actor ON film_actor.actor_id = actor.actor_id
  WHERE film.film_id = ${filmId}`;

  connection.query(filmActorQuery, function(err, result) {
    if(err) {
      res.render('error', { message: err.message });
    }else{
      console.log(result);
      res.render('filmDetails', {
        filmTitle: result[0].title, //only need the title of the first record
        films: result
      });
    }
  });
});
module.exports = router;
