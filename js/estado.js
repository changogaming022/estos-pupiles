const NIVELES = {
  normal:  "Normal",
  riesgo:  "En riesgo",
  critico: "Crítico",
  vacio:   "Sin datos"
};

function nivelDeEstado(estado) {
  if (!estado || estado === "inválido" || estado === "invalido") return "vacio";
  if (estado.startsWith("peligrosamente")) return "critico";
  if (["estable", "estables", "adecuada", "adecuado"].includes(estado)) return "normal";
  return "riesgo";
}

function pintarEstado(idCuadro, estado) {
  const nivel = nivelDeEstado(estado);
  const el = document.getElementById(idCuadro);
  if (el) {
    el.classList.remove("vacio", "normal", "riesgo", "critico");
    el.classList.add(nivel);
    el.title = NIVELES[nivel];
    const tarjeta = el.closest(".tarjeta");
    if (tarjeta) tarjeta.dataset.nivel = nivel;
  }
  const pill = document.getElementById(idCuadro.replace("cuadro-", "pill-"));
  if (pill) pill.textContent = NIVELES[nivel];
  return nivel;
}