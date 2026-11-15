// Simulador de lecturas automáticas de signos vitales.
// Genera valores realistas cada INTERVALO_MS, los escribe en cada casilla
// y llama a la función de evaluación correspondiente, que además guarda
// la lectura en la base de datos y actualiza la gráfica.

const INTERVALO_MS = 3000;      // cada cuánto llega una lectura nueva
const PROB_ANOMALIA = 0.08;     // probabilidad de un valor fuera de rango

// Para cada signo: valor normal, variación por paso, límites físicos,
// rango de una anomalía, decimales y la función que lo evalúa.
const SIGNOS = {
    oxigeno: { normal: 97,   paso: 0.6, min: 70, max: 100, anomalia: [82, 92],   decimales: 0, evaluar: () => evaluar() },
    mmhg:    { normal: 115,  paso: 3,   min: 60, max: 200, anomalia: [142, 170], decimales: 0, evaluar: () => evaluarMmhg() },
    bpm:     { normal: 75,   paso: 3,   min: 30, max: 200, anomalia: [125, 150], decimales: 0, evaluar: () => evaluarBpm() },
    rpm:     { normal: 16,   paso: 1,   min: 5,  max: 30,  anomalia: [25, 29],   decimales: 0, evaluar: () => evaluarRpm() },
    tc:      { normal: 36.7, paso: 0.1, min: 33, max: 42,  anomalia: [38.9, 39.8], decimales: 1, evaluar: () => evaluarTc() },
};

const _actual = {};
for (const k in SIGNOS) _actual[k] = SIGNOS[k].normal;

let _temporizador = null;

function _aleatorio(a, b) { return a + Math.random() * (b - a); }

function _siguienteValor(clave) {
    const s = SIGNOS[clave];
    let v;
    if (Math.random() < PROB_ANOMALIA) {
        v = _aleatorio(s.anomalia[0], s.anomalia[1]);
    } else {
        // Caminata aleatoria que tiende a regresar al valor normal
        const regreso = (s.normal - _actual[clave]) * 0.3;
        v = _actual[clave] + regreso + _aleatorio(-s.paso, s.paso);
    }
    v = Math.min(s.max, Math.max(s.min, v));
    _actual[clave] = v;
    return Number(v.toFixed(s.decimales));
}

function tomarLectura() {
    // Escribir los 5 valores y registrarlos juntos, con la misma fecha y hora
    for (const clave in SIGNOS) document.getElementById(clave).value = _siguienteValor(clave);
    registrarToma(Object.values(SIGNOS).map(s => s.evaluar));
    const estado = document.getElementById("estado-simulador");
    if (estado) estado.textContent = "Última lectura: " + new Date().toLocaleTimeString();
}

function iniciarSimulador() {
    if (_temporizador) return;
    tomarLectura();
    _temporizador = setInterval(tomarLectura, INTERVALO_MS);
    _actualizarBoton();
}

function detenerSimulador() {
    clearInterval(_temporizador);
    _temporizador = null;
    _actualizarBoton();
}

function alternarSimulador() {
    _temporizador ? detenerSimulador() : iniciarSimulador();
}

function _actualizarBoton() {
    const b = document.getElementById("boton-simulador");
    if (b) b.textContent = _temporizador ? "Detener monitoreo automático" : "Iniciar monitoreo automático";
}

// Registra juntos todos los valores escritos a mano (los vacíos se omiten)
function registrarTodos() {
    const llenos = Object.keys(SIGNOS).filter(k => document.getElementById(k).value !== "");
    registrarToma(llenos.map(k => SIGNOS[k].evaluar));
}
