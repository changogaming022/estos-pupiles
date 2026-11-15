function evaluarTc() {
    const v = parseFloat(document.getElementById("tc").value);
    const res = document.getElementById("resultado-tc");
    if (isNaN(v)) { res.textContent = "Escribe un valor válido"; res.className = "estado"; return; }
    let texto, clase;
    if (v >= 38.9)      { texto = "Peligrosamente alta"; clase = "malo"; }
    else if (v >= 37.3) { texto = "Preocupante"; clase = "alerta"; }
    else if (v >= 36.1) { texto = "Estable"; clase = "ok"; }
    else if (v >= 35.0) { texto = "Baja"; clase = "alerta"; }
    else              { texto = "Peligrosamente baja"; clase = "malo"; }
    mostrar("tc", "resultado-tc", v, texto, clase);
    guardarLectura("tc", v);
}
