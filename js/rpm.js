function evaluarRpm() {
    const rpm = parseFloat(document.getElementById("rpm").value);
    const res = document.getElementById("resultado-rpm");
    if (isNaN(rpm)) { res.textContent = "Escribe un valor válido"; pintarEstado("cuadro-rpm", "inválido"); return { valor: "-", estado: "inválido" }; }
    let texto;
    if (rpm >= 25)      texto = "peligrosamente altas";
    else if (rpm >= 21) texto = "preocupantes";
    else if (rpm >= 12) texto = "estables";
    else if (rpm >= 9)  texto = "bajas";
    else                texto = "peligrosamente bajas";
    res.textContent = "Respiraciones por minuto " + texto + " con " + rpm + " RPM";
    pintarEstado("cuadro-rpm", texto);
    guardarLectura("rpm", rpm);
    return { valor: rpm, estado: texto };
}