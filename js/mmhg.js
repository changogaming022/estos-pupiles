function evaluarMmhg() {
    const v = parseFloat(document.getElementById("mmhg").value);
    const res = document.getElementById("resultado-mmhg");
    if (isNaN(v)) { res.textContent = "Escribe un valor válido"; res.className = "estado"; return; }
    let texto, clase;
    if (v >= 140)      { texto = "Peligrosamente alta"; clase = "malo"; }
    else if (v >= 121) { texto = "Preocupante"; clase = "alerta"; }
    else if (v >= 90) { texto = "Estable"; clase = "ok"; }
    else if (v >= 80) { texto = "Baja"; clase = "alerta"; }
    else              { texto = "Peligrosamente baja"; clase = "malo"; }
    mostrar("mmhg", "resultado-mmhg", v, texto, clase);
    guardarLectura("mmhg", v);
}
