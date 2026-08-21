const ruleta = document.getElementById("ruleta");
const contenedorNumeros = document.getElementById("numerosRuleta");
const bola = document.getElementById("bola");
const botonGirar = document.getElementById("girar");
const resultado = document.getElementById("resultado");
const prediccionTexto = document.getElementById("prediccion");
const partidasTexto = document.getElementById("partidas");
const aciertosTexto = document.getElementById("aciertos");

let girando = false;
let prediccion = null;
let tipoPrediccion = null;
let partidas = 0;
let aciertos = 0;
let anguloRuletaActual = 0;

// Orden exacto de la ruleta europea de la imagen (37 casillas)
const numeros = [
  "0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27", "13",
  "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1", "20", "14",
  "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"
];

const rojos = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const negros = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

/* DIBUJAR NÚMEROS Y GUARDAR SUS ÁNGULOS EXACTOS */
function crearNumeros() {
  contenedorNumeros.innerHTML = "";
  const radio = 165;
  const total = numeros.length;
  const paso = 360 / total;

  numeros.forEach((numero, index) => {
    const elemento = document.createElement("div");
    elemento.classList.add("numero");

    if (numero === "0") {
      elemento.classList.add("verde");
    } else if (rojos.includes(Number(numero))) {
      elemento.classList.add("rojo");
    } else {
      elemento.classList.add("negro");
    }

    elemento.textContent = numero;

    // Angulo individual de cada número (El "0" está arriba en -90deg)
    const angulo = index * paso - 90;
    const rad = (angulo * Math.PI) / 180;
    const x = Math.cos(rad) * radio;
    const y = Math.sin(rad) * radio;

    elemento.style.transform = `translate(${x}px, ${y}px)`;
    elemento.dataset.angulo = angulo;

    elemento.addEventListener("click", () => {
      if (girando) return;
      seleccionar("numero", numero, elemento);
    });

    contenedorNumeros.appendChild(elemento);
  });
}

/* SELECCIÓN DE APUESTAS */
document.querySelectorAll(".docenas button, .externas button, .columnas-2to1 button, .cero-box button").forEach((boton) => {
  boton.addEventListener("click", () => {
    if (girando) return;
    seleccionar(boton.dataset.tipo, boton.dataset.valor, boton);
  });
});

function seleccionar(tipo, valor, elemento) {
  document.querySelectorAll(".numero, .docenas button, .externas button, .columnas-2to1 button, .cero-box button").forEach((e) => {
    e.classList.remove("seleccionada");
  });

  elemento.classList.add("seleccionada");
  tipoPrediccion = tipo;
  prediccion = valor;

  prediccionTexto.textContent = textoPrediccion();
  resultado.textContent = "Predicción seleccionada. ¡Gira la ruleta!";
}

function textoPrediccion() {
  if (tipoPrediccion === "numero") return "Número " + prediccion;
  if (tipoPrediccion === "color") return prediccion.toUpperCase();
  if (tipoPrediccion === "paridad") return prediccion === "par" ? "PAR" : "IMPAR";
  if (tipoPrediccion === "docena") return "Docena " + prediccion;
  if (tipoPrediccion === "rango") return prediccion === "1-18" ? "1 a 18" : "19 a 36";
  if (tipoPrediccion === "columna") return "Columna " + prediccion;
  return "Ninguna";
}

/* GIRAR CON CALCULO EXACTO */
let girosTotales = 0;

botonGirar.addEventListener("click", () => {
  if (girando) return;
  if (prediccion === null) {
    resultado.textContent = "Primero selecciona una predicción";
    return;
  }

  girando = true;
  botonGirar.disabled = true;
  resultado.textContent = "🎰 La bolita está girando...";

  const total = numeros.length;
  const paso = 360 / total;

  // Elegir número ganador aleatorio
  const indiceGanador = Math.floor(Math.random() * total);
  const ganador = numeros[indiceGanador];

  // Calcular el ángulo en el que se ubica exactamente el centro de esa casilla
  const anguloTarget = indiceGanador * paso - 90;

  girosTotales += 8; // Vueltas completas
  const anguloFinal = (girosTotales * 360) + anguloTarget;

  // Animación de la bolita alineada exactamente al centro del radio
  bola.style.transform = `rotate(${anguloFinal}deg) translateY(-165px)`;

  setTimeout(() => {
    mostrarResultado(ganador);
  }, 5000);
});

/* RESULTADO */
function mostrarResultado(ganador) {
  partidas++;
  const acerto = comprobar(ganador);

  if (acerto) {
    aciertos++;
    resultado.innerHTML = `🎉 ¡ACERTASTE!<br>La bolita cayó exactamente en el <strong>${ganador}</strong>`;
  } else {
    resultado.innerHTML = `La bolita cayó en el <strong>${ganador}</strong>`;
  }

  partidasTexto.textContent = partidas;
  aciertosTexto.textContent = aciertos;

  prediccion = null;
  tipoPrediccion = null;
  prediccionTexto.textContent = "Ninguna";

  document.querySelectorAll(".numero, .docenas button, .externas button, .columnas-2to1 button, .cero-box button").forEach((e) => {
    e.classList.remove("seleccionada");
  });

  setTimeout(() => {
    girando = false;
    botonGirar.disabled = false;
  }, 1000);
}

function comprobar(numero) {
  const n = Number(numero);

  if (tipoPrediccion === "numero") return numero === prediccion;

  if (tipoPrediccion === "color") {
    if (numero === "0") return false;
    if (prediccion === "rojo") return rojos.includes(n);
    if (prediccion === "negro") return negros.includes(n);
  }

  if (tipoPrediccion === "paridad") {
    if (numero === "0") return false;
    return prediccion === "par" ? n % 2 === 0 : n % 2 !== 0;
  }

  if (tipoPrediccion === "docena") {
    if (n === 0) return false;
    if (prediccion === "1") return n >= 1 && n <= 12;
    if (prediccion === "2") return n >= 13 && n <= 24;
    if (prediccion === "3") return n >= 25 && n <= 36;
  }

  if (tipoPrediccion === "rango") {
    if (n === 0) return false;
    return prediccion === "1-18" ? n >= 1 && n <= 18 : n >= 19 && n <= 36;
  }

  if (tipoPrediccion === "columna") {
    if (n === 0) return false;
    if (prediccion === "3") return n % 3 === 0;
    if (prediccion === "2") return n % 3 === 2;
    if (prediccion === "1") return n % 3 === 1;
  }

  return false;
}

crearNumeros();