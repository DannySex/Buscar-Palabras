// Obtenemos el campo donde el usuario escribirá o pegará el texto.
const textoInput = document.getElementById('textoInput');

// Obtenemos el campo donde se escribirá la palabra que se desea buscar.
const palabraInput = document.getElementById('palabraInput');

// Obtenemos el botón que ejecutará la búsqueda.
const btnBuscar = document.getElementById('btnBuscar');

// Obtenemos el botón que limpiará todos los campos.
const btnLimpiar = document.getElementById('btnLimpiar');

// Obtenemos el elemento donde se mostrará el número de coincidencias.
const contadorResultados = document.getElementById('contadorResultados');

// Obtenemos el elemento donde se mostrará el texto con las coincidencias resaltadas.
const resultadoTexto = document.getElementById('resultadoTexto');

// Obtenemos el contenedor donde aparecerán los mensajes de alerta.
const alertaBox = document.getElementById('alertaBox');


/* =========================================================
   2. FUNCIÓN PARA MOSTRAR ALERTAS
   ========================================================= */

// Creamos una función que recibe el mensaje y el tipo de alerta.
// El tipo será "danger" por defecto si no se proporciona otro.
function mostrarAlerta(mensaje, tipo = 'danger') {

    // Asignamos las clases de Bootstrap para mostrar la alerta.
    // "alert" aplica el diseño, "alert-tipo" define su color
    // y "d-block" hace visible el elemento.
    alertaBox.className = `alert alert-${tipo} d-block`;

    // Colocamos el mensaje recibido dentro de la alerta.
    alertaBox.textContent = mensaje;

    // Creamos un temporizador de 3500 milisegundos (3.5 segundos).
    setTimeout(() => {

        // Ocultamos la alerta cuando transcurre el tiempo.
        alertaBox.className = 'alert d-none';

    }, 3500); // Tiempo que tarda en ocultarse la alerta.
}


/* =========================================================
   3. FUNCIÓN PRINCIPAL PARA BUSCAR UNA PALABRA
   ========================================================= */

// Declaramos la función que realizará todo el proceso de búsqueda.
function realizarBusqueda() {

    // Obtenemos el texto completo escrito en el primer campo.
    const texto = textoInput.value;

    // Obtenemos la palabra que se desea buscar.
    // trim() elimina los espacios al principio y al final.
    const buscar = palabraInput.value.trim();


    // ---------- VALIDACIONES ----------

    // Comprobamos si el campo de texto está vacío.
    if (texto === '') {

        // Mostramos una alerta amarilla indicando que falta el texto.
        mostrarAlerta(
            'Por favor, ingresa o pega un texto válido.',
            'warning'
        );

        // Colocamos el cursor en el campo del texto.
        textoInput.focus();

        // Detenemos la función para no continuar con la búsqueda.
        return;
    }

    // Comprobamos si el usuario no escribió una palabra para buscar.
    if (buscar === '') {

        // Mostramos una alerta indicando que falta la palabra.
        mostrarAlerta(
            'Debes escribir una palabra o carácter para buscar.',
            'warning'
        );

        // Colocamos el cursor en el campo de búsqueda.
        palabraInput.focus();

        // Detenemos la función porque no hay nada que buscar.
        return;
    }


    // ---------- PREPARAR LA BÚSQUEDA ----------

    // Escapamos los caracteres especiales que tienen significado
    // dentro de una expresión regular.
    // Así, por ejemplo, un punto se busca como un punto literal.
    const palabraEscapada = buscar.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
    );

    // Creamos una expresión regular para encontrar las coincidencias.
    // La letra "g" busca todas las coincidencias.
    // La letra "i" ignora las diferencias entre mayúsculas y minúsculas.
    const regex = new RegExp(palabraEscapada, 'gi');


    // ---------- CONTAR LAS COINCIDENCIAS ----------

    // Buscamos todas las apariciones de la palabra en el texto.
    // match() devuelve las coincidencias encontradas o null si no hay.
    const coincidencias = texto.match(regex);

    // Si existen coincidencias, contamos cuántas hay.
    // Si match() devuelve null, el total será cero.
    const total = coincidencias ? coincidencias.length : 0;


    // ---------- ACTUALIZAR EL CONTADOR ----------

    // Mostramos el número total de coincidencias en el HTML.
    // textContent convierte el número en texto para visualizarlo.
    contadorResultados.textContent = total;


    // ---------- PROTEGER EL TEXTO ----------

    // Escapamos el carácter "&" para que no se interprete como HTML.
    const textoSeguro = texto
        .replace(/&/g, "&amp;")

        // Convertimos los signos "<" en entidades HTML.
        // Esto evita que se interpreten como etiquetas HTML.
        .replace(/</g, "&lt;")

        // Convertimos los signos ">" en entidades HTML.
        .replace(/>/g, "&gt;");


    // ---------- RESALTAR LAS COINCIDENCIAS ----------

    // Creamos otra expresión regular para resaltar los resultados.
    // Se utilizan los mismos indicadores: global e insensible a mayúsculas.
    const regexSegura = new RegExp(palabraEscapada, 'gi');

    // Buscamos cada coincidencia dentro del texto protegido.
    // La función de reemplazo recibe el texto que coincide.
    const textoResaltado = textoSeguro.replace(
        regexSegura,

        // Envolvemos cada coincidencia en una etiqueta <mark>.
        // La etiqueta <mark> permite resaltar el texto visualmente.
        (match) => `<mark>${match}</mark>`
    );


    // Insertamos el texto resaltado en el elemento de resultados.
    // innerHTML permite interpretar las etiquetas <mark> generadas.
    // El texto original ya fue protegido contra etiquetas HTML.
    resultadoTexto.innerHTML = textoResaltado;


    // ---------- MOSTRAR EL RESULTADO DE LA BÚSQUEDA ----------

    // Comprobamos si se encontró al menos una coincidencia.
    if (total > 0) {

        // Mostramos una alerta verde con la cantidad encontrada.
        mostrarAlerta(
            `Se encontró la palabra "${buscar}" un total de ${total} veces.`,
            'success'
        );

    } else {

        // Si no hubo coincidencias, mostramos una alerta informativa.
        mostrarAlerta(
            `No se encontraron coincidencias para "${buscar}".`,
            'info'
        );
    }
}


/* =========================================================
   4. FUNCIÓN PARA LIMPIAR LA PANTALLA
   ========================================================= */

// Declaramos la función que restablecerá la interfaz.
function limpiarPantalla() {

    // Vaciamos el campo donde se escribe el texto.
    textoInput.value = '';

    // Vaciamos el campo donde se escribe la palabra de búsqueda.
    palabraInput.value = '';

    // Restablecemos el contador de coincidencias a cero.
    contadorResultados.textContent = '0';

    // Eliminamos el texto que se mostraba en los resultados.
    resultadoTexto.innerHTML = '';

    // Ocultamos cualquier alerta que esté visible.
    alertaBox.className = 'alert d-none';

    // Colocamos el cursor nuevamente en el campo de texto.
    textoInput.focus();
}


/* =========================================================
   5. ASIGNAR EVENTOS A LOS BOTONES
   ========================================================= */

// Escuchamos el evento "click" del botón Buscar.
// Cuando el usuario hace clic, ejecutamos realizarBusqueda().
btnBuscar.addEventListener('click', realizarBusqueda);

// Escuchamos el evento "click" del botón Limpiar.
// Cuando el usuario hace clic, ejecutamos limpiarPantalla().
btnLimpiar.addEventListener('click', limpiarPantalla);


/* =========================================================
   6. PERMITIR BUSCAR CON LA TECLA ENTER
   ========================================================= */

// Escuchamos el evento "keypress" en el campo de búsqueda.
palabraInput.addEventListener('keypress', (e) => {

    // Comprobamos si la tecla presionada fue Enter.
    if (e.key === 'Enter') {

        // Ejecutamos la misma función que utiliza el botón Buscar.
        realizarBusqueda();
    }
});
