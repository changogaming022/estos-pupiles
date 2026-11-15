let _db;
const _listo = initSqlJs({ locateFile: f => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/" + f }).then(SQL => {
    const g = localStorage.getItem("overgpt_db");
    _db = g ? new SQL.Database(Uint8Array.from(atob(g), c => c.charCodeAt(0))) : new SQL.Database();
    _db.run(`CREATE TABLE IF NOT EXISTS lecturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT, signo TEXT, valor REAL,
        fecha TEXT DEFAULT (datetime('now','localtime')))`);
    graficar();
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
    if (_grafica) _grafica.destroy();
    _grafica = new Chart(document.getElementById("grafica"), {
        type: "line",
        data: { labels: fechas, datasets: signos.map(s => ({
            label: s, spanGaps: true, tension: .25,
            data: filas.map(f => f[0] === s ? f[1] : null) })) }
    });
}