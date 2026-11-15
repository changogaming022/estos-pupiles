function evaluar() {
    const O = parseFloat(document.getElementById("oxigeno").value);
    const res = document.getElementById("resultado");
    const adv = document.getElementById("advertencia");
    adv.classList.add("oculto");
    if (isNaN(O)) {
        res.textContent = "Escribe un valor valido";
        res.className = "estado";
        return;
    }
    let texto, clase;
    if (O >= 95)      { texto = "Adecuada";            clase = "ok"; }
    else if (O >= 93) { texto = "Preocupante";         clase = "alerta"; }
    else if (O >= 90) { texto = "Baja";                clase = "alerta"; }
    else              { texto = "Peligrosamente baja"; clase = "malo"; }
    mostrar("oxigeno", "resultado", O, texto, clase);
    if (O < 90) {
        adv.textContent = "¡Atención! Saturación de oxígeno peligrosamente baja (" + O + "%). Busca atención médica de inmediato.";
        adv.classList.remove("oculto");
    } else if (O < 93) {
        adv.textContent = "Saturación de oxígeno baja (" + O + "%). Repite la medición y consulta a un médico.";
        adv.classList.remove("oculto");
    }
    guardarLectura("oxigeno", O);
}
