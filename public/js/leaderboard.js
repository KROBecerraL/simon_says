"use strict";
/* se mostrará el JSON almacenando todos los usuarios y sus puntajes
ordenados de mayor a menor. */
fetch('../database/scoreboard.json')
    .then(function (response) {
    return response.json();
})
    .then(function (data) {
    escribirDatos(data);
    console.log(data);
})
    .catch(function (err) {
    console.log('error: ' + err);
});
function escribirDatos(data) {
    var contenedorPrincipal = document.querySelector('#userScores');
    var mainCont = contenedorPrincipal;
    Object.keys(data).forEach(function (key) {
        console.log('Usuario: ' + key + ', Puntos: ' + data[key]);
        var div = document.createElement("div");
        div.innerHTML = 'Nombre: ' + key + ', Puntos: ' + data[key];
        mainCont.appendChild(div);
    });
}
