let _db;
    const _listo = initSqlJs().then(SQL => {
    const g = localStorage.getItem("overgpt_db");
    _db = g ? new SQL.Database(Uint8Array.from(atob(g), c => c.charCodeAt(0))) : new SQL.Database();
    _db.run(`CREATE TABLE IF NOT EXISTS lecturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT, signo TEXT, valor REAL,
        fecha TEXT DEFAULT (datetime('now','localtime')))`);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", graficar);
    else graficar();
});
async function guardarLectura(signo, valor) {
    await _listo;
    _db.run("INSERT INTO lecturas (signo, valor) VALUES (?, ?)", [signo, valor]);
    let s = ""; _db.export().forEach(b => s += String.fromCharCode(b));
    localStorage.setItem("overgpt_db", btoa(s));
    graficar();
}
let _grafica;
function graficar() {
    const r = _db.exec("SELECT signo, valor, fecha FROM lecturas ORDER BY id");
    const filas = r.length ? r[0].values : [];
    const signos = [...new Set(filas.map(f => f[0]))];
    const fechas = filas.map(f => f[2].slice(5, 16));
    const COLORES = { oxigeno: "#38bdf8", mmhg: "#f472b6", bpm: "#fb7185", rpm: "#a78bfa", tc: "#fbbf24" };
    Chart.defaults.color = "#cbd5e1";
    Chart.defaults.borderColor = "rgba(255,255,255,.08)";
    if (_grafica) _grafica.destroy();
    _grafica = new Chart(document.getElementById("grafica"), {
        type: "line",
        data: { labels: fechas, datasets: signos.map(s => ({
            label: s, spanGaps: true, tension: .3, borderColor: COLORES[s], backgroundColor: COLORES[s], pointRadius: 3, borderWidth: 2,
            data: filas.map(f => f[0] === s ? f[1] : null) })) }
            ,options: { aspectRatio: window.innerWidth < 600 ? 1.2 : 2.6, interaction: { mode: "index", intersect: false }, plugins: { legend: { labels: { usePointStyle: true } } } }
    });
}