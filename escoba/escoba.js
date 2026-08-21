// ========================================
// ROYAL PLAY - ESCOBA DE 15
// ========================================


// ========================================
// PALOS
// ========================================

const palos = [
    "oro",
    "copas",
    "espada",
    "palo"
];


// ========================================
// VALORES
// ========================================

const valores = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "sota",
    "caballo",
    "rey"
];


// ========================================
// VARIABLES
// ========================================

let baraja = [];

let jugador = [];
let computadora = [];
let mesa = [];

let cartasSeleccionadas = [];
let cartasMesaSeleccionadas = [];

let puntos = 0;
let puntosPC = 0;

let escobas = 0;
let escobasPC = 0;

let turno = "jugador";


// Número de reparto actual
let repartoActual = 1;

// Máximo 3 repartos
const MAX_REPARTOS = 3;


// ========================================
// CREAR BARAJA
// ========================================

function crearBaraja() {

    baraja = [];

    for (let palo of palos) {

        for (let valor of valores) {

            if (
                valor === "8" ||
                valor === "9"
            ) {
                continue;
            }

            let numero;

            if (valor === "sota") {

                numero = 8;

            } else if (valor === "caballo") {

                numero = 9;

            } else if (valor === "rey") {

                numero = 10;

            } else {

                numero = Number(valor);

            }

            let carta = {

                nombre:
                    valor + "_" + palo,

                valor: numero,

                palo: palo,

                imagen:
                    "img/" +
                    valor +
                    "_" +
                    palo +
                    ".png"
            };

            baraja.push(carta);
        }
    }
}

function irInicio() {
    window.location.href = "/index/index.html";
}

// ========================================
// MEZCLAR
// ========================================

function mezclar() {

    for (
        let i = baraja.length - 1;
        i > 0;
        i--
    ) {

        let j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            baraja[i],
            baraja[j]
        ] =
        [
            baraja[j],
            baraja[i]
        ];
    }
}


// ========================================
// REPARTIR 3 CARTAS
// ========================================

function repartirTresCartas() {

    // Limpiar selecciones de la ronda anterior
    cartasSeleccionadas = [];
    cartasMesaSeleccionadas = [];

    // Repartir 3 cartas a cada jugador
    jugador = baraja.splice(0, 3);
    computadora = baraja.splice(0, 3);

    // Actualizar pantalla
    mostrarTodo();

    actualizarMazo();

    // Reiniciar el recuadro de suma
    document.getElementById("sumaSeleccionada").innerHTML =
        "Selecciona una carta";

    console.log("Ronda:", repartoActual);
    console.log("Cartas jugador:", jugador);
    console.log("Cartas computadora:", computadora);
}


// ========================================
// PRIMER REPARTO
// ========================================

function repartirInicial() {

    jugador = baraja.splice(0, 3);

    computadora = baraja.splice(0, 3);

    mesa = baraja.splice(0, 4);

    repartoActual = 1;

    mostrarTodo();

    actualizarMazo();
}


// ========================================
// MOSTRAR TODO
// ========================================

function mostrarTodo() {

    mostrarCartas(
        "cartasJugador",
        jugador,
        true
    );

    mostrarCartas(
        "cartasPC",
        computadora,
        false
    );

    mostrarCartasMesa();
}


// ========================================
// MOSTRAR CARTAS JUGADOR / PC
// ========================================

function mostrarCartas(
    id,
    cartas,
    seleccionable
) {

    let zona =
        document.getElementById(id);

    zona.innerHTML = "";

    cartas.forEach(
        (carta, index) => {

            let div =
                document.createElement("div");

            div.className = "carta";


            let imagen =
                document.createElement("img");


            // ========================================
            // CARTAS DEL JUGADOR
            // ========================================

            if (seleccionable) {

                imagen.src =
                    carta.imagen;

                imagen.alt =
                    carta.nombre;

                imagen.className =
                    "imagenCarta";

                div.appendChild(imagen);


                div.onclick =
                    function () {

                        seleccionarCarta(
                            index,
                            div
                        );

                    };

            }


            // ========================================
            // CARTAS DE LA COMPUTADORA
            // ========================================

            else {

                imagen.src =
                    "img/parte de atras.png";

                imagen.alt =
                    "Carta boca abajo";

                imagen.className =
                    "imagenCarta";

                div.appendChild(imagen);
            }


            zona.appendChild(div);

        }
    );
}


// ========================================
// MOSTRAR CARTAS DE LA MESA
// ========================================

function mostrarCartasMesa() {

    const zona = document.getElementById("mesaCartas");

    zona.innerHTML = "";

    mesa.forEach((carta, index) => {

        const div = document.createElement("div");

        div.className = "carta";

        const imagen = document.createElement("img");

        imagen.src = carta.imagen;
        imagen.alt = carta.nombre;
        imagen.className = "imagenCarta";

        div.appendChild(imagen);

        // TODAS las cartas de la mesa se pueden seleccionar
        div.addEventListener("click", function () {

            seleccionarCartaMesa(index, div);

        });

        zona.appendChild(div);
    });
}

// ========================================
// SELECCIONAR CARTA DEL JUGADOR
// ========================================

function seleccionarCarta(
    index,
    elemento
) {

    cartasSeleccionadas = [index];


    document
        .querySelectorAll(
            "#cartasJugador .carta"
        )
        .forEach(
            carta => {

                carta.classList.remove(
                    "seleccionada"
                );

            }
        );


    elemento.classList.add(
        "seleccionada"
    );


    // Limpiar selección anterior de mesa

    cartasMesaSeleccionadas = [];

    document
        .querySelectorAll(
            "#mesaCartas .carta"
        )
        .forEach(
            carta => {

                carta.classList.remove(
                    "seleccionada-mesa"
                );

            }
        );


    actualizarSuma();

    document.getElementById(
        "mensaje"
    ).innerHTML =
        "Ahora selecciona cartas de la mesa que completen 15";
}


// ========================================
// SELECCIONAR CARTA DE LA MESA
// ========================================

function seleccionarCartaMesa(index, elemento) {

    // Primero debes seleccionar una carta de tu mano
    if (cartasSeleccionadas.length === 0) {

        document.getElementById("mensaje").innerHTML =
            "Primero selecciona una carta de tu mano";

        return;
    }

    // ========================================
    // SI YA ESTÁ SELECCIONADA
    // LA QUITAMOS
    // ========================================

    if (cartasMesaSeleccionadas.includes(index)) {

        cartasMesaSeleccionadas =
            cartasMesaSeleccionadas.filter(
                i => i !== index
            );

        elemento.classList.remove(
            "seleccionada-mesa"
        );

    }

    // ========================================
    // SI NO ESTÁ SELECCIONADA
    // LA AGREGAMOS
    // ========================================

    else {

        cartasMesaSeleccionadas.push(index);

        elemento.classList.add(
            "seleccionada-mesa"
        );
    }

    // ACTUALIZAR LA SUMA
    actualizarSuma();


    // Mostrar qué cartas están seleccionadas
    mostrarCartasSeleccionadas();
}

function mostrarCartasSeleccionadas() {

    if (cartasMesaSeleccionadas.length === 0) {

        document.getElementById("mensaje").innerHTML =
            "Ahora selecciona cartas de la mesa";

        return;
    }

    let nombres = [];

    for (let index of cartasMesaSeleccionadas) {

        if (mesa[index]) {

            nombres.push(
                mesa[index].valor
            );
        }
    }

    document.getElementById("mensaje").innerHTML =
        "Cartas seleccionadas: " +
        nombres.join(" + ");
}


// ========================================
// MOSTRAR SUMA
// ========================================

function actualizarSuma() {

    const caja =
        document.getElementById("sumaSeleccionada");

    let suma = 0;

    if (cartasSeleccionadas.length > 0) {

        const indiceJugador =
            cartasSeleccionadas[0];

        const cartaJugador =
            jugador[indiceJugador];

        if (cartaJugador) {

            suma += cartaJugador.valor;

        }
    }

    for (
        const indiceMesa
        of cartasMesaSeleccionadas
    ) {

        if (mesa[indiceMesa]) {

            suma += mesa[indiceMesa].valor;

        }
    }


    if (
        cartasSeleccionadas.length > 0
    ) {

        caja.innerHTML =
            "Suma: " + suma;

    } else {

        caja.innerHTML =
            "Suma: 0";
    }
}


// ========================================
// JUGAR
// ========================================

function jugar() {

    if (juegoPausado) {
        return;
    }

    if (turno !== "jugador") {
        return;
    }

    // Tiene que seleccionar una carta de su mano
    if (cartasSeleccionadas.length !== 1) {

        document.getElementById("mensaje").innerHTML =
            "Selecciona una carta de tu mano";

        return;
    }

    let indiceJugador = cartasSeleccionadas[0];

    let cartaJugador = jugador[indiceJugador];

    let suma = cartaJugador.valor;


    // ========================================
    // SUMAR TODAS LAS CARTAS DE LA MESA
    // ========================================

    for (let indiceMesa of cartasMesaSeleccionadas) {

        if (mesa[indiceMesa]) {

            suma += mesa[indiceMesa].valor;

        }
    }


    // ========================================
    // SI LA SUMA ES 15 → CAPTURA
    // ========================================

    if (
        cartasMesaSeleccionadas.length > 0 &&
        suma === 15
    ) {

        capturarCartas();

        mostrarTodo();

        actualizarMazo();

        comprobarFinReparto();

        if (turno === "jugador") {
            cambiarTurno();
        }

        return;
    }


    // ========================================
    // SI NO ES 15
    // ========================================

    if (
        cartasMesaSeleccionadas.length > 0 &&
        suma !== 15
    ) {

        document.getElementById("mensaje").innerHTML =
            "❌ La suma es " + suma +
            ". No puedes capturar. Tu carta debe ir a la mesa.";


        // ========================================
        // OBLIGAR A TIRAR LA CARTA
        // ========================================

        jugador.splice(
            indiceJugador,
            1
        );

        mesa.push(
            cartaJugador
        );


        // Limpiar selecciones
        limpiarSeleccion();


        mostrarTodo();

        actualizarMazo();


        // Pasar turno
        cambiarTurno();

        return;
    }


    // ========================================
    // SI NO SE SELECCIONARON CARTAS DE LA MESA
    // ========================================

    if (
        cartasMesaSeleccionadas.length === 0
    ) {

        jugador.splice(
            indiceJugador,
            1
        );

        mesa.push(
            cartaJugador
        );


        document.getElementById("mensaje").innerHTML =
            "🃏 Carta colocada en la mesa";


        limpiarSeleccion();

        mostrarTodo();

        actualizarMazo();

        comprobarFinReparto();


        if (turno === "jugador") {
            cambiarTurno();
        }

        return;
    }
}
// ========================================
// CAPTURAR CARTAS
// ========================================

function capturarCartas() {

    let indiceJugador =
        cartasSeleccionadas[0];

    let cartaJugador =
        jugador[indiceJugador];


    // Eliminar carta del jugador

    jugador.splice(
        indiceJugador,
        1
    );


    // Guardar cartas capturadas

    let capturadas = [];


    // IMPORTANTE:
    // La primera seleccionada queda primero

    for (
        let indice
        of cartasMesaSeleccionadas
    ) {

        capturadas.push(
            mesa[indice]
        );

    }


    // Eliminar de la mesa

    mesa =
        mesa.filter(
            (carta, index) =>
                !cartasMesaSeleccionadas.includes(
                    index
                )
        );


    puntos++;


    // ========================================
    // ESCOBA
    // ========================================

    if (
        mesa.length === 0
    ) {

        escobas++;

        puntos++;

        document.getElementById(
            "mensaje"
        ).innerHTML =
            "🧹 ¡ESCOBA!";

    } else {

        document.getElementById(
            "mensaje"
        ).innerHTML =
            "🎴 ¡Cartas capturadas!";

    }


    actualizarPuntos();

    limpiarSeleccion();
}


// ========================================
// LIMPIAR SELECCIONES
// ========================================

function limpiarSeleccion() {

    cartasSeleccionadas = [];

    cartasMesaSeleccionadas = [];


    document
        .querySelectorAll(
            ".seleccionada"
        )
        .forEach(
            carta =>
                carta.classList.remove(
                    "seleccionada"
                )
        );


    document
        .querySelectorAll(
            ".seleccionada-mesa"
        )
        .forEach(
            carta =>
                carta.classList.remove(
                    "seleccionada-mesa"
                )
        );


    document.getElementById(
        "sumaSeleccionada"
    ).innerHTML =
        "Selecciona una carta";
}


// ========================================
// PUNTOS
// ========================================

function actualizarPuntos() {

    document.getElementById(
        "puntos"
    ).innerHTML =
        puntos;


    document.getElementById(
        "escobas"
    ).innerHTML =
        escobas;
}


// ========================================
// ACTUALIZAR MAZO
// ========================================

function actualizarMazo() {

    document.getElementById(
        "cartasRestantes"
    ).innerHTML =
        baraja.length;
}


// ========================================
// IA
// ========================================

function turnoComputadora() {

    if (juegoPausado) {
        return;
    }

    if (
        computadora.length === 0
    ) {

        comprobarFinReparto();

        return;
    }


    let mejorJugada = null;


    // Buscar capturas

    for (
        let i = 0;
        i < computadora.length;
        i++
    ) {

        let carta =
            computadora[i];


        let combinacion =
            encontrarCombinacion(
                15 - carta.valor,
                mesa
            );


        if (
            combinacion.length > 0
        ) {

            let puntuacionJugada = 0;


            for (
                let cartaMesa
                of combinacion
            ) {

                puntuacionJugada +=
                    cartaMesa.valor;

            }


            puntuacionJugada +=
                combinacion.length * 5;


            if (
                combinacion.length ===
                mesa.length
            ) {

                puntuacionJugada += 20;

            }


            if (
                mejorJugada === null ||
                puntuacionJugada >
                mejorJugada.puntuacion
            ) {

                mejorJugada = {

                    indice: i,

                    carta: carta,

                    combinacion:
                        combinacion,

                    puntuacion:
                        puntuacionJugada

                };
            }
        }
    }


    // ========================================
    // SI PUEDE CAPTURAR
    // ========================================

    if (
        mejorJugada !== null
    ) {

        let carta =
            mejorJugada.carta;


        let combinacion =
            mejorJugada.combinacion;


        computadora.splice(
            mejorJugada.indice,
            1
        );


        combinacion.forEach(
            cartaMesa => {

                mesa =
                    mesa.filter(
                        carta =>
                            carta.nombre !==
                            cartaMesa.nombre
                    );

            }
        );


        puntosPC++;


        if (
            mesa.length === 0
        ) {

            escobasPC++;

            puntosPC++;

            document.getElementById(
                "mensaje"
            ).innerHTML =
                "🤖 ¡La computadora hizo ESCOBA! 🧹";

        } else {

            document.getElementById(
                "mensaje"
            ).innerHTML =
                "🤖 La computadora capturó cartas";

        }

    }


    // ========================================
    // SI NO PUEDE CAPTURAR
    // ========================================

    else {

        let carta =
            elegirCartaIA();


        let indice =
            computadora.indexOf(
                carta
            );


        computadora.splice(
            indice,
            1
        );


        mesa.push(
            carta
        );


        document.getElementById(
            "mensaje"
        ).innerHTML =
            "🤖 La computadora colocó una carta";

    }


    actualizarPuntos();

    mostrarTodo();

    actualizarMazo();


    turno = "jugador";


    document.getElementById(
        "mensaje"
    ).innerHTML +=
        "<br>Tu turno";


    comprobarFinReparto();
}


// ========================================
// COMBINACIÓN IA
// ========================================

function encontrarCombinacion(
    objetivo,
    cartasMesa
) {

    let resultado = [];


    function buscar(
        inicio,
        suma,
        seleccion
    ) {
        if (
            suma === objetivo
        ) {
            resultado =
                seleccion;
            return true;
        }
        if (
            suma > objetivo
        ) {
            return false;
        }
        for (
            let i = inicio;
            i < cartasMesa.length;
            i++
        ) {
            if (
                buscar(
                    i + 1,
                    suma +
                        cartasMesa[i].valor,
                    [...seleccion,cartasMesa[i]]
                )
            ) {
                return true;
            }
        }
        return false;
    }


    buscar(
        0,
        0,
        []
    );


    return resultado;
}


// ========================================
// CARTA IA
// ========================================

function elegirCartaIA() {

    let mejorCarta =
        computadora[0];


    for (
        let carta
        of computadora
    ) {

        if (
            carta.valor <
            mejorCarta.valor
        ) {

            mejorCarta = carta;

        }
    }


    return mejorCarta;
}


// ========================================
// CAMBIAR TURNO
// ========================================

function cambiarTurno() {

    turno = "computadora";


    setTimeout(
        turnoComputadora,
        1000
    );
}


// ========================================
// COMPROBAR FIN DEL REPARTO
// ========================================

function comprobarFinReparto() {

    if (
        jugador.length === 0 &&
        computadora.length === 0
    ) {

        // Todavía quedan cartas para otra ronda
        if (
            repartoActual < MAX_REPARTOS &&
            baraja.length >= 6
        ) {

            repartoActual++;

            turno = "jugador";

            document.getElementById("mensaje").innerHTML =
                "🃏 Preparando ronda " + repartoActual + "...";

            setTimeout(function () {

                repartirTresCartas();

                document.getElementById("mensaje").innerHTML =
                    "Tu turno";

            }, 1000);

        } else {

            // Ya no quedan rondas
            mostrarGanador();
        }
    }
}


// ========================================
// GANADOR
// ========================================

function mostrarGanador() {

    let mensaje;

    if (puntos > puntosPC) {

        mensaje = "🏆 ¡GANASTE!";

    } else if (puntosPC > puntos) {

        mensaje = "🤖 Ganó la computadora";

    } else {

        mensaje = "🤝 ¡EMPATE!";

    }

    document.getElementById("mensaje").innerHTML =
        mensaje +
        "<br><br>" +
        "Jugador: " + puntos + " puntos" +
        "<br>" +
        "Computadora: " + puntosPC + " puntos";

    document.getElementById("botonJugar").style.display = "none";

    document.getElementById("botonNuevaPartida").style.display = "inline-block";

    document.getElementById("botonNuevaPartidaMenu").style.display = "block";

    turno = "fin";

}


// ========================================
// NUEVA PARTIDA
// ========================================

function nuevaPartida() {

    juegoPausado = false;

    document.getElementById(
        "botonJugar"
    ).style.display = "inline-block";

    document.getElementById(
        "botonNuevaPartida"
    ).style.display = "none";

    puntos = 0;
    puntosPC = 0;

    escobas = 0;
    escobasPC = 0;

    turno = "jugador";

    repartoActual = 1;

    jugador = [];
    computadora = [];
    mesa = [];

    cartasSeleccionadas = [];
    cartasMesaSeleccionadas = [];

    crearBaraja();

    mezclar();

    repartirInicial();

    actualizarPuntos();

    actualizarMazo();

    document.getElementById("sumaSeleccionada").innerHTML =
        "Selecciona una carta";

    document.getElementById("mensaje").innerHTML =
        "Tu turno";

    document.getElementById("botonNuevaPartidaMenu").style.display = "none";

}

// ========================================
// CENTRO DE AYUDA
// ========================================

function abrirAyuda() {

    document.getElementById(
        "ventanaAyuda"
    ).style.display = "block";

}


// ========================================
// CERRAR AYUDA
// ========================================

function cerrarAyuda() {

    document.getElementById(
        "ventanaAyuda"
    ).style.display = "none";

}

// ========================================
// ABRIR / CERRAR MENÚ
// ========================================

function abrirMenu() {

    const menu =
        document.getElementById("menuOpciones");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    } else {

        menu.style.display = "block";

    }
}


// ========================================
// PAUSAR JUEGO
// ========================================

let juegoPausado = false;

function pausarJuego() {

    juegoPausado = !juegoPausado;

    const boton =
        document.querySelector(
            ".menu-opciones button"
        );

    if (juegoPausado) {

        boton.innerHTML = "▶️ Continuar";

        document.getElementById("mensaje").innerHTML =
            "⏸️ Juego pausado";

    } else {

        boton.innerHTML = "⏸️ Pausa";

        document.getElementById("mensaje").innerHTML =
            "▶️ Tu turno";

    }
}

function actualizarMazoVisual(cartasEnMazo) {
    const imgMazo = document.getElementById('imgMazo');
    const mazoContainer = document.getElementById('mazoVisual');
    const textoMazo = document.getElementById('textoMazo');

    if (cartasEnMazo > 0) {
        imgMazo.style.display = 'block';
        mazoContainer.classList.remove('vacio');
        textoMazo.innerHTML = `Cartas restantes: <span id="cartasRestantes">${cartasEnMazo}</span>`;
    } else {
        imgMazo.style.display = 'none';
        mazoContainer.classList.add('vacio');
        textoMazo.innerText = 'Sin cartas restantes';
    }
}

// Ejemplo de actualización por rondas (partiendo de 40 cartas - 4 mesa - 6 iniciales = 30 restantes / o según tu reparto):
// Inicio: 12 cartas en el mazo principal
// Reparto Ronda 1: actualizarMazoVisual(6);
// Reparto Ronda 2: actualizarMazoVisual(0);

// ========================================
// INICIAR JUEGO
// ========================================

crearBaraja();

mezclar();

repartirInicial();

actualizarPuntos();

actualizarMazo();