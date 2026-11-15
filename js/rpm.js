function evaluarRpm() {
    const rpm = parseFloat(document.getElementById("rpm").value);
    const res = document.getElementById("resultado-rpm");
    if (isNaN(rpm)) { res.textContent = "Escribe un valor válido"; return; }
    let texto;
    if (rpm >= 25)      texto = "peligrosamente altas";
    else if (rpm >= 21) texto = "preocupantes";
    else if (rpm >= 12) texto = "estables";
    else if (rpm >= 9)  texto = "bajas";
    else                texto = "peligrosamente bajas";
    res.textContent = "Respiraciones por minuto " + texto + " con " + rpm + " RPM";
    guardarLectura("rpm", rpm);
}