function evaluarMmhg() {
    const mmHg = parseFloat(document.getElementById("mmhg").value);
    const res = document.getElementById("resultado-mmhg");
    if (isNaN(mmHg)) { res.textContent = "Escribe un valor válido"; return; }
    let texto;
    if (mmHg >= 140)      texto = "peligrosamente alta";
    else if (mmHg >= 121) texto = "preocupante";
    else if (mmHg >= 90)  texto = "estable";
    else if (mmHg >= 80)  texto = "baja";
    else                  texto = "peligrosamente baja";
    res.textContent = "Presión sistólica " + texto + " con " + mmHg + " mmHg";
    guardarLectura("mmhg", mmHg);
}