function evaluarBpm() {
    const v = parseFloat(document.getElementById("bpm").value);
    const res = document.getElementById("resultado-bpm");
    if (isNaN(v)) { res.textContent = "Escribe un valor válido"; res.className = "estado"; return; }
    let texto, clase;
    if (v >= 121)      { texto = "Peligrosamente alto"; clase = "malo"; }
    else if (v >= 101) { texto = "Preocupante"; clase = "alerta"; }
    else if (v >= 60) { texto = "Estable"; clase = "ok"; }
    else if (v >= 40) { texto = "Bajo"; clase = "alerta"; }
    else              { texto = "Peligrosamente bajo"; clase = "malo"; }
    mostrar("bpm", "resultado-bpm", v, texto, clase);
    guardarLectura("bpm", v);
}
