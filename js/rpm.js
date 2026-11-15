function evaluarRpm() {
    const v = parseFloat(document.getElementById("rpm").value);
    const res = document.getElementById("resultado-rpm");
    if (isNaN(v)) { res.textContent = "Escribe un valor válido"; res.className = "estado"; return; }
    let texto, clase;
    if (v >= 25)      { texto = "Peligrosamente altas"; clase = "malo"; }
    else if (v >= 21) { texto = "Preocupantes"; clase = "alerta"; }
    else if (v >= 12) { texto = "Estables"; clase = "ok"; }
    else if (v >= 9) { texto = "Bajas"; clase = "alerta"; }
    else              { texto = "Peligrosamente bajas"; clase = "malo"; }
    mostrar("rpm", "resultado-rpm", v, texto, clase);
    guardarLectura("rpm", v);
}
