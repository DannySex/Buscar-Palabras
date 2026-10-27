/* =========================================================
   1. SELECCIÓN DE ELEMENTOS DEL DOM
   ========================================================= */

const textoInput = document.getElementById('textoInput');
const palabraInput = document.getElementById('palabraInput');

// NUEVOS ELEMENTOS
const reemplazoInput = document.getElementById('reemplazoInput');
const btnReemplazar = document.getElementById('btnReemplazar');

const btnBuscar = document.getElementById('btnBuscar');
const btnLimpiar = document.getElementById('btnLimpiar');
const contadorResultados = document.getElementById('contadorResultados');
const resultadoTexto = document.getElementById('resultadoTexto');
const alertaBox = document.getElementById('alertaBox');


/* =========================================================
   2. FUNCIÓN PARA MOSTRAR ALERTAS
   ========================================================= */

function mostrarAlerta(mensaje, tipo = 'danger') {
    alertaBox.className = `alert alert-${tipo} d-block`;
    alertaBox.textContent = mensaje;

    setTimeout(() => {
        alertaBox.className = 'alert d-none';
    }, 3500);
}


/* =========================================================
   3. FUNCIÓN PRINCIPAL PARA BUSCAR UNA PALABRA
   ========================================================= */

function realizarBusqueda() {
    const texto = textoInput.value;
    const buscar = palabraInput.value.trim();

    if (texto === '') {
        mostrarAlerta('Por favor, ingresa o pega un texto válido.', 'warning');
        textoInput.focus();
        return;
    }

    if (buscar === '') {
        mostrarAlerta('Debes escribir una palabra o carácter para buscar.', 'warning');
        palabraInput.focus();
        return;
    }

    const palabraEscapada = buscar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(palabraEscapada, 'gi');

    const coincidencias = texto.match(regex);
    const total = coincidencias ? coincidencias.length : 0;
    contadorResultados.textContent = total;

    // Escapar HTML en el texto para evitar vulnerabilidades XSS
    const textoSeguro = texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const regexSegura = new RegExp(palabraEscapada, 'gi');
    const textoResaltado = textoSeguro.replace(
        regexSegura,
        (match) => `<mark>${match}</mark>`
    );

    resultadoTexto.innerHTML = textoResaltado;

    if (total > 0) {
        mostrarAlerta(`Se encontró la palabra "${buscar}" un total de ${total} veces.`, 'success');
    } else {
        mostrarAlerta(`No se encontraron coincidencias para "${buscar}".`, 'info');
    }
}


/* =========================================================
   4. NUEVA FUNCIÓN PARA REEMPLAZAR PALABRAS
   ========================================================= */

function realizarReemplazo() {
    const texto = textoInput.value;
    const buscar = palabraInput.value.trim();
    const reemplazo = reemplazoInput.value; // Se puede dejar vacío si desea eliminar la palabra

    if (texto === '') {
        mostrarAlerta('Por favor, ingresa o pega un texto válido.', 'warning');
        textoInput.focus();
        return;
    }

    if (buscar === '') {
        mostrarAlerta('Debes escribir la palabra que deseas reemplazar.', 'warning');
        palabraInput.focus();
        return;
    }

    const palabraEscapada = buscar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(palabraEscapada, 'gi');

    const coincidencias = texto.match(regex);
    const total = coincidencias ? coincidencias.length : 0;

    if (total === 0) {
        mostrarAlerta(`No se encontró la palabra "${buscar}" para reemplazar.`, 'info');
        return;
    }

    // Realizamos el reemplazo en el texto original del textarea
    const nuevoTexto = texto.replace(regex, reemplazo);
    textoInput.value = nuevoTexto;

    // Actualizamos la visualización resaltando la nueva palabra ingresada
    if (reemplazo !== '') {
        palabraInput.value = reemplazo;
        realizarBusqueda();
    } else {
        contadorResultados.textContent = '0';
        resultadoTexto.textContent = nuevoTexto;
    }

    mostrarAlerta(`Se han reemplazado ${total} coincidencia(s) exitosamente.`, 'success');
}


/* =========================================================
   5. FUNCIÓN PARA LIMPIAR LA PANTALLA
   ========================================================= */

function limpiarPantalla() {
    textoInput.value = '';
    palabraInput.value = '';
    reemplazoInput.value = ''; // Limpiamos el nuevo campo
    contadorResultados.textContent = '0';
    resultadoTexto.innerHTML = '';
    alertaBox.className = 'alert d-none';
    textoInput.focus();
}


/* =========================================================
   6. ASIGNAR EVENTOS A LOS BOTONES
   ========================================================= */

btnBuscar.addEventListener('click', realizarBusqueda);
btnReemplazar.addEventListener('click', realizarReemplazo); // Asignación de evento para Reemplazar
btnLimpiar.addEventListener('click', limpiarPantalla);

palabraInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        realizarBusqueda();
    }
});

reemplazoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        realizarReemplazo();
    }
});