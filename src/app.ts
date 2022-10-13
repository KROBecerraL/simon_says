var fs = require('fs');
var path = require('path');
//importar los datos en el JSON
var jsonPath = path.join(__dirname, '../database/scoreboard.json');
var data = fs.readFileSync(jsonPath);
var scores = JSON.parse(data);
//verificar datos importados
console.log(scores);

const express = require('express');

const app = express();

//servidor inicializado en el puerto 3000
var server = app.listen(3000,listening);

//función para mostrar un mensaje que me indique que la conexión está funcionando
function listening() {
    console.log("listening...");
}

//tomar el html de la carpeta public
let publicPath = path.join(__dirname, '../');
app.use(express.static(publicPath));
let indexPath = path.join(__dirname, '../');
app.set('views', indexPath);

//usar ejs
app.engine('html', require('ejs').renderFile);

//añadir nombre y puntaje
app.post('/add/:user/:score?', addWord);

//función que agrega nombre y puntaje
function addWord(request, response) {
    console.log(request);
    var data = request.params;
    var user = data.user;
    var score = Number(data.score);
    var reply;
    if (!user || !score) {
        reply = {
            msg: "No ha jugado o no digitó un nombre."
        }
        response.send(reply);
    } else {
        scores[user] = score;
        scores = sortObject(scores);
        data = JSON.stringify(scores, null, 2);
        console.log("sort complete: " +data);
        fs.writeFileSync(jsonPath, data, finished);
        function finished (err) {
            console.log("agregado");
        }
        reply = {
            msg: "Puntaje añadido."
        }
        response.send(reply);
    }
}

//página localhost:3000 me muestra index
app.get('/', renderIndex);

function renderIndex(request, response) {
    response.render('index.html');
}

//programo que la página /leaderboard me llevará a una página que me muestre la tabla de puntajes
app.get('/leaderboard', sendBoard);

//función que importe el JSON en la página /leaderboard
function sendBoard(request, response) {
    response.render('leaderboard.html');
}

//función para convertir objeto en array y organizarlo de mayor a menor, luego devolverlo en formato de objeto
function sortObject(nombreObjeto : object) {
    let sortable : any[] = [];
    for (var username in nombreObjeto) {
        sortable.push([username, nombreObjeto[username]]);
    }
    //se organiza el array en orden descendiente para que muestre los puntajes más altos primero
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    })
    //se convierte el array en un objeto y se devuelve el objeto
    let sorted = {};
    sortable.forEach(function(item) {
        sorted[item[0]]=item[1];
    })
    return sorted;
}

/*
En el momento en el que presione enviar agrego su registro al JSON y lo redirecciono 
a /leaderboard donde se mostrará el JSON almacenando todos los usuarios y sus puntajes 
ordenados de mayor a menor.
*/