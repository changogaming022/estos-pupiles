let _db;
const _listo = initSqlJs({ locateFile: f => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/" + f }).then(SQL => {
    const g = localStorage.getItem("overgpt_db");
    _db = g ? new SQL.Database(Uint8Array.from(atob(g), c => c.charCodeAt(0))) : new SQL.Database();
    _db.run(`CREATE TABLE IF NOT EXISTS lecturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT, signo TEXT, valor REAL,
        fecha TEXT DEFAULT (datetime('now','localtime')))`);
    graficar();
});
let _fechaToma = null;

function ahora() {
    const d = new Date(), p = n => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " +
           p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
}

function registrarToma(funcionesEvaluar) {
    _fechaToma = ahora();
    try { funcionesEvaluar.forEach(f => f()); }
    finally { _fechaToma = null; }
}

async function guardarLectura(signo, valor) {
    const fecha = _fechaToma || ahora();
    await _listo;
    _db.run("INSERT INTO lecturas (signo, valor, fecha) VALUES (?, ?, ?)", [signo, valor, fecha]);
    let s = ""; _db.export().forEach(b => s += String.fromCharCode(b));
    localStorage.setItem("overgpt_db", btoa(s));
    graficar();
}
const COLORES = { ok: "#16a34a", alerta: "#d97706", malo: "#dc2626" };

function mostrar(signo, idResultado, valor, texto, clase) {
    const v = document.getElementById("valor-" + signo);
    const r = document.getElementById(idResultado);
    if (v) { v.textContent = valor; v.className = clase; }
    if (r) { r.textContent = texto; r.className = "estado " + clase; }
    const tarjeta = r && r.closest ? r.closest(".tarjeta") : null;
    if (tarjeta) tarjeta.dataset.nivel = clase;
}
function graficar() {
    if (!_db) return;
    const r = _db.exec("SELECT signo, valor FROM lecturas ORDER BY id");
    const filas = r.length ? r[0].values : [];
    const porSigno = {};
    filas.forEach(([s, v]) => (porSigno[s] = porSigno[s] || []).push(v));
    for (const signo in porSigno) {
        _dibujarLinea(document.getElementById("grafica-" + signo), porSigno[signo].slice(-30), signo);
    }
    graficarConjunta();
}

const SERIES = [
    { signo: "oxigeno", nombre: "Oxígeno (%)",           color: "#0ea5e9", eje: "y"  },
    { signo: "mmhg",    nombre: "Presión (mmHg)",        color: "#8b5cf6", eje: "y"  },
    { signo: "bpm",     nombre: "Ritmo cardíaco (BPM)",  color: "#ef4444", eje: "y"  },
    { signo: "rpm",     nombre: "Respiraciones (/min)",  color: "#22c55e", eje: "y1" },
    { signo: "tc",      nombre: "Temperatura (°C)",      color: "#f59e0b", eje: "y1" },
];
const MAX_TOMAS = 30;
let _grafica;

function graficarConjunta() {
    const canvas = document.getElementById("grafica");
    if (!canvas || typeof Chart === "undefined" || !_db) return;
    const r = _db.exec("SELECT fecha, signo, valor FROM lecturas ORDER BY id");
    const filas = r.length ? r[0].values : [];

    const tomas = new Map();
    filas.forEach(([fecha, signo, valor]) => {
        if (!tomas.has(fecha)) tomas.set(fecha, {});
        tomas.get(fecha)[signo] = valor;
    });
    const fechas = [...tomas.keys()].slice(-MAX_TOMAS);
    const etiquetas = fechas.map(f => f.slice(11, 19));   // HH:MM:SS
    const datos = SERIES.map(s => fechas.map(f => tomas.get(f)[s.signo] ?? null));

    if (_grafica) {
        _grafica.data.labels = etiquetas;
        _grafica.data.datasets.forEach((d, i) => d.data = datos[i]);
        _grafica.update("none");
        return;
    }
    _grafica = new Chart(canvas, {
        type: "line",
        data: {
            labels: etiquetas,
            datasets: SERIES.map((s, i) => ({
                label: s.nombre, data: datos[i], yAxisID: s.eje,
                borderColor: s.color, backgroundColor: s.color,
                borderWidth: 2.5, pointRadius: 3, tension: .25, spanGaps: true,
            })),
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { position: "bottom", labels: { font: { size: 14 }, usePointStyle: true } },
                tooltip: { titleFont: { size: 14 }, bodyFont: { size: 14 } },
                title: { display: true, text: "Signos vitales por toma", font: { size: 18 } },
            },
            scales: {
                x:  { title: { display: true, text: "Hora de la toma" } },
                y:  { position: "left",  min: 0, max: 200,
                      title: { display: true, text: "Oxígeno · Presión · BPM" } },
                y1: { position: "right", min: 0, max: 45, grid: { drawOnChartArea: false },
                      title: { display: true, text: "Respiraciones · Temperatura" } },
            },
        },
    });
}

function _dibujarLinea(canvas, datos, signo) {
    if (!canvas || !canvas.getContext || datos.length === 0) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height, m = 6;
    ctx.clearRect(0, 0, w, h);
    let min = Math.min(...datos), max = Math.max(...datos);
    if (max - min < 1) { min -= 1; max += 1; }
    const x = i => m + (datos.length === 1 ? (w - 2 * m) : i * (w - 2 * m) / (datos.length - 1));
    const y = v => h - m - (v - min) * (h - 2 * m) / (max - min);
    const tarjeta = canvas.closest ? canvas.closest(".tarjeta") : null;
    const color = COLORES[tarjeta && tarjeta.dataset.nivel] || "#3b82f6";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    datos.forEach((v, i) => i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)));
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x(datos.length - 1), y(datos[datos.length - 1]), 4, 0, Math.PI * 2);
    ctx.fill();
}
