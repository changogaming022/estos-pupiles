function evaluarOxigeno() {
    const O = parseFloat(document.getElementById("oxigeno").value);
    const res = document.getElementById("resultado-oxigeno");
    const adv = document.getElementById("advertencia");
    adv.classList.add("oculto");
    if (isNaN(O)) {
        res.textContent = "Escribe un valor valido";
        res.className = "resultado";
        pintarEstado("cuadro-oxigeno", "inválido");
        return { valor: "-", estado: "inválido" };
    }
    let texto, clase;
    if (O >= 95)      { texto = "adecuada";            clase = "ok"; }
    else if (O >= 93) { texto = "preocupante";         clase = "alerta"; }
    else if (O >= 90) { texto = "baja";                clase = "alerta"; }
    else              { texto = "peligrosamente baja"; clase = "malo"; }
    res.textContent = "Saturacion de oxigeno " + texto + " con " + O + "%";
    res.className = "resultado " + clase;
    if (O < 90) {
        adv.textContent = "Atencion! Saturacion peligrosamente baja. Busca atencion medica de inmediato.";
        adv.classList.remove("oculto");
    } else if (O < 93) {
        adv.textContent = "Saturacion baja. Repite la medición y consulta a un medico.";
        adv.classList.remove("oculto");
    }
    pintarEstado("cuadro-oxigeno", texto);
    guardarLectura("oxigeno", O);
    return { valor: O, estado: texto };
}