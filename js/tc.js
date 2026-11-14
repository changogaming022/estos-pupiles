while (true) {
    let tc = Number(prompt("Ingresa la temperatura corporal en °C:"));
    if (tc >= 36.1 && tc <= 37.2) {
        console.log("Temperatura corporal estable con " + tc + "°C");
    }
    if (tc >= 37.3 && tc <= 38.8) {
        console.log("Temperatura corporal preocupante con " + tc + "°C. Si sigue subiendo podría llegar a sufrir hipertermia.");
    }
    if (tc >= 35.0 && tc < 36.1) {
        console.log("Temperatura corporal baja con " + tc + "°C. Si continúa bajando, el cuerpo puede llegar a sufrir hipotermia.");
    }
    if (tc < 35.0) {
        console.log("Temperatura corporal peligrosamente baja con " + tc + "°C. Necesita atención médica.");
    }
}
