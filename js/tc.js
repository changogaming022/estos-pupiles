function evaluarTc() {
    const tc = parseFloat(document.getElementById("tc").value);
    const res = document.getElementById("resultado-tc");
    if (isNaN(tc)) { res.textContent = "Escribe un valor válido"; return; }
    let texto;
    if (tc >= 38.9)      texto = "peligrosamente alta";
    else if (tc >= 37.3) texto = "preocupante";
    else if (tc >= 36.1) texto = "estable";
    else if (tc >= 35.0) texto = "baja";
    else                 texto = "peligrosamente baja";
    res.textContent = "Temperatura corporal " + texto + " con " + tc + "°C";
    guardarLectura("tc", tc);
}