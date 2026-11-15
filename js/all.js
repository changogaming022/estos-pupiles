const NOMBRES = { oxigeno: "Oxígeno", mmhg: "Presión", bpm: "Pulso", rpm: "Respiración", tc: "Temperatura" };

function evaluarTodo() {
  const signos = {
    oxigeno: evaluarOxigeno(),
    mmhg:    evaluarMmhg(),
    bpm:     evaluarBpm(),
    rpm:     evaluarRpm(),
    tc:      evaluarTc()
  };
  const resumen = document.getElementById("resumen");
  resumen.innerHTML = "";
  Object.entries(signos).forEach(([clave, s]) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.dataset.nivel = nivelDeEstado(s.estado);
    chip.textContent = `${NOMBRES[clave]}: ${s.valor} · ${s.estado}`;
    resumen.appendChild(chip);
  });
  const niveles = Object.values(signos).map(s => nivelDeEstado(s.estado));
  let global = "vacio";
  if (niveles.includes("critico"))     global = "critico";
  else if (niveles.includes("riesgo")) global = "riesgo";
  else if (niveles.includes("normal")) global = "normal";

  pintarEstado("cuadro-global",
      global === "critico" ? "peligrosamente" :
      global === "riesgo"  ? "preocupante" :
      global === "normal"  ? "estable" : "inválido");
  document.getElementById("texto-global").textContent = NIVELES[global];
}