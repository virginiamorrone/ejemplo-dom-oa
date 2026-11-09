

const PUNTOS_POR_ACIERTO = 10;

const preguntas = document.querySelectorAll(".pregunta");
const puntosEl = document.querySelector("#puntos");
const progresoEl = document.querySelector("#progreso");
const textoProgreso = document.querySelector("#texto-progreso");

// Estado del juego: los datos viven en variables, el DOM solo los muestra
let puntos = 0;
let correctas = 0;

// Recorrer todas las preguntas y configurar cada una
for (let i = 0; i < preguntas.length; i++) {
  configurarPregunta(preguntas[i]);
}

// Conecta el botón de UNA pregunta con su lógica
function configurarPregunta(pregunta) {
  const boton = pregunta.querySelector(".responder");
  const feedback = pregunta.querySelector(".feedback");

  boton.addEventListener("click", function () {
    // 1. Obtener la respuesta de la persona, según el tipo de pregunta
    const campoTexto = pregunta.querySelector("input[type='text']");
    let respuesta = "";

    if (campoTexto) {
      // Pregunta para completar: leer lo escrito
      respuesta = campoTexto.value.trim().toLowerCase();
    } else {
      // Pregunta con radio: leer el radio marcado
      const elegida = pregunta.querySelector("input[type='radio']:checked");
      if (elegida) {
        respuesta = elegida.value;
      }
    }

    // 2. ¿No respondió nada?
    if (respuesta === "") {
      feedback.textContent = "Respondé primero.";
      feedback.className = "feedback aviso";
      return;
    }

    // 3. Comparar con la respuesta correcta guardada en data-correcta
    const esCorrecta = respuesta === pregunta.dataset.correcta;

    if (esCorrecta) {
      // Acierto: suma puntos, avanza la barra y se bloquea la pregunta
      puntos = puntos + PUNTOS_POR_ACIERTO;
      correctas = correctas + 1;
      feedback.textContent = "¡Correcto! +" + PUNTOS_POR_ACIERTO + " puntos";
      feedback.className = "feedback ok";

      // Bloquear todos los inputs de esta pregunta
      const inputs = pregunta.querySelectorAll("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].disabled = true;
      }
      boton.disabled = true;

      actualizarMarcador();
    } else {
      // Error: no suma ni avanza la barra, y puede volver a intentar
      let mensaje = "Todavía no. Probá de nuevo.";
      if (pregunta.dataset.pista) {
        mensaje = mensaje + " Pista: " + pregunta.dataset.pista + ".";
      }
      feedback.textContent = mensaje;
      feedback.className = "feedback error";
    }
  });
}

function actualizarMarcador() {
  puntosEl.textContent = puntos;

  const porcentaje = (correctas / preguntas.length) * 100;
  progresoEl.style.width = porcentaje + "%";
  textoProgreso.textContent = correctas + " de " + preguntas.length + " correctas";
}

// Mostrar el estado inicial correcto al cargar la página
actualizarMarcador();

