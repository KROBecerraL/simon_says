// Prueba TS corre en index
let message: string = 'Hello World';
console.log(message);

import express, { Express, Request, Response } from 'express';

// Declaración de variables
const startButton = document.querySelector("#startBtn");
let startBtn = startButton!; //declaración como no null
const sendNom = document.querySelector("#sendName");
var ronda = 0; //en qué ronda del juego va el usuario?
var turno = 0; //0 es el PC y 1 es el usuario
const colores: Array<string> = ["verde", "rojo", "amarillo", "azul"];
var recorrido: Array<number> = []; //array para el orden de colores que se han escogido hasta la ronda actual
var usuarioInput: Array<number> = []; //cuales input ha realizado el usuario en la ronda
var usuarioIndex: number = 0; //cuantos movimientos ha hecho el usuario
const textPagina = document.querySelector("#displayMsg");
var textInstruction = textPagina!; //declaración como no null
var playerName: string; //nombre del jugador
const botones: NodeListOf<Element> = document.querySelectorAll(".sbtn"); //los botones en el doc de los 4 colores

// sonidos que se usarán para cada color
var sonidoAnimal: object = {
    verde: new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_a0bcc0cfed.mp3'), //chicken
    rojo: new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_025fa51a78.mp3'), //dog
    amarillo: new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_596f1a2017.mp3'), //cat
    azul: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_d9241dc887.mp3') //cow
};

class ejecucionJuego {
    //Función del botón de start
    static async startGame() {
        await endGame(); //terminar el juego anterior
        ronda = 1;
        console.log("Inicia el juego");
        ejecucionJuego.startRound();
    }

    static wait(time: number): Promise<null> {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    static async startRound() {
        textInstruction.textContent = "Observe la secuencia";
        //inicia la ronda, se escoge un nuevo botón para presionar y se muestra todo el patrón
        let randNum = randomNum(0, 3);
        console.log(randNum); //nuevo movimiento escogido aleatoriamente
        recorrido = await patronModif(randNum);
        console.log(recorrido);
        //reproducción de todo el patrón incluyendo el nuevo movimiento
        for (const ciclo of recorrido) {
            botones[ciclo].classList.add("clicked");
            sonidoBoton(botones[ciclo]);
            await ejecucionJuego.wait(1400);
            botones[ciclo].classList.remove("clicked");
            await ejecucionJuego.wait(200);
        }
        //ahora se escucha al usuario para verificar si repite correctamente la secuencia
        turno = 1; //es el turno del usuario
        textInstruction.textContent = "Repita la secuencia";
    }

    //Función para verificar si el usuario perdio o pasa a la siguiente ronda
    static async winCheck() {
        if (usuarioInput.length == recorrido.length) {
            let userL = usuarioInput.length;
            let gameL = recorrido.length;
            if (usuarioInput[userL - 1] == recorrido[gameL - 1]) {
                //el usuario ganó la ronda
                console.log("GANADOR DE RONDA");
                ronda += 1;
                usuarioIndex = 0; //inicia nueva ronda asi que el usuario no ha hecho movimientos
                usuarioInput = [];
                await ejecucionJuego.wait(1400);
                ejecucionJuego.startRound();
            } else {
                //el usuario perdió la ronda
                console.log("PERDEDOR. DEBE TERMINAR");
                await ejecucionJuego.wait(200);
                textInstruction.textContent = "Ha perdido. Intentelo otra vez";
                await endGame();
            }
        } else {
            //el usuario perdió la ronda
            console.log("PERDEDOR. DEBE TERMINAR");
            await ejecucionJuego.wait(200);
            textInstruction.textContent = "Ha perdido. Intentelo otra vez";
            await endGame();
        }
    }

    //Función de click
    static async marcarMovimiento(event: any) {
        let colorSonido: string = event.target.id;
        console.log(colorSonido);
        sonidoAnimal[colorSonido].currentTime = 0; // propiedad para que deje volver a reproducirlo antes de que acabe de sonar
        sonidoAnimal[colorSonido].play();
        //verificar si es el turno del usuario
        if (turno == 1) {
            //es el turno del usuario
            let digitado = 10;
            switch (colorSonido) {
                case 'verde':
                    digitado = 0;
                    break;
                case 'rojo':
                    digitado = 1;
                    break;
                case 'amarillo':
                    digitado = 2;
                    break;
                case 'azul':
                    digitado = 3;
                    break;
            }
            console.log("Input del usuario: ", digitado, colorSonido);
            let indexActual = usuarioIndex; //index que se verificará al patrón de la ronda
            usuarioIndex += 1; //el usuario hizo un movimiento
            usuarioInput = await playerModif(digitado); //esperar a que se agregue el movimiento del jugador al arreglo userinput
            console.log("SELECCIONADO: ", usuarioInput);
            console.log("PATRÓN: ", recorrido);
            if (usuarioInput[indexActual] == recorrido[indexActual]) {
                //movimiento correcto
                console.log("CORRECTO!!!!");
                if (usuarioIndex == recorrido.length) {
                    //ya completo los input requeridos, pasar a siguiente ronda
                    ejecucionJuego.winCheck();
                }
            } else {
                //movimiento incorrecto
                console.log("INCORRECTO!!!");
                await ejecucionJuego.wait(200);
                textInstruction.textContent = "Ha perdido. Intentelo otra vez";
                await endGame();
            }
        }
    }
}

//Función para generar un número entre 0 y 3 (representan los indices del arreglo colores)
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Función para terminar el juego y declarar variables en 0 otra vez
function endGame(): void {
    usuarioIndex = 0; //el usuario ha hecho 0 movimientos
    recorrido = []; //vaciar el patrón de la ronda
    usuarioInput = []; //vaciar movimientos del usuario
    turno = 0; //turno del pc
}

//Función de sonido reproducción
function sonidoBoton(botonz: Element): void {
    let colorSonido: string = botonz.id;
    sonidoAnimal[colorSonido].currentTime = 0;
    sonidoAnimal[colorSonido].play();
}

//Función para añadir movimiento CPU al recorrido de la ronda actual
function patronModif(movimiento: number) {
    recorrido.push(movimiento);
    return recorrido;
}

//Función para añadir movimiento PLAYER al recorrido de la ronda actual
function playerModif(movimiento: number) {
    usuarioInput.push(movimiento);
    return usuarioInput;
}

// Asignar sonido a los botones de los colores cuando el usuario les hace click
botones[0].addEventListener("click", ejecucionJuego.marcarMovimiento);
botones[1].addEventListener("click", ejecucionJuego.marcarMovimiento);
botones[2].addEventListener("click", ejecucionJuego.marcarMovimiento);
botones[3].addEventListener("click", ejecucionJuego.marcarMovimiento);

//Asignar función al botón start
startBtn.addEventListener("click", ejecucionJuego.startGame);

//Función de guardar nombre y puntos
function enviarNom(): void {
    playerName = (<HTMLInputElement>document.querySelector("#pName")).value;
    if (!playerName || ronda == 0) {
        console.log("No se ingresó un nombre o no  tiene un puntaje. No se hace nada")
        return alert('Por favor ingrese su nombre o juegue una partida');
    } else {
        let puntaje = (ronda-1)*10;
        console.log(playerName, puntaje);
        const registro = {playerName, puntaje}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(registro)
        }
        fetch('/add/'+playerName+'/'+puntaje, options);
        document.location.href="/leaderboard";
    }
}

/* GET SCORES FROM JSON
function get_scores (callback) {
    // High Score Data
    let file = "scoreboard.json";
  
    // Fetch High Score Data
    fetch(file, {cache: 'no-cache'})
      .then(function(response) {
          //  If the response isn't OK
          if (response.status !== 200) {
            return alert(response.status);
          }
          // If the response is OK
          response.json().then(function(data) {
            let scores = JSON.stringify(data);
            console.log(scores);
            callback (scores);
          });
        })
      // If there is an error
      .catch(function(err) {
          return alert(err);
      });
*/

function quitarComas(conjunto) {
    let datosArray = conjunto.split('},').join("\n");
    return datosArray;
}


//Asignar función de guardar nombre al botón enviar
sendNom?.addEventListener("click", enviarNom);