function evaluarBpm() {
    const BPM = parseFloat(document.getElementById("bpm").value);
    const res = document.getElementById("resultado-bpm");
    if (isNaN(BPM)) { res.textContent = "Escribe un valor válido"; return; }
    let texto;
    if (BPM >= 121)      texto = "peligrosamente alto";
    else if (BPM >= 101) texto = "preocupante";
    else if (BPM >= 60)  texto = "estable";
    else if (BPM >= 40)  texto = "bajo";
    else                 texto = "peligrosamente bajo";
    res.textContent = "Ritmo cardiaco " + texto + " con " + BPM + " BPM";
    guardarLectura("bpm", BPM);
}