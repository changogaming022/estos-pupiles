while (true) {
    let rpm = Number(prompt("Ingresa las respiraciones por minuto:"));

    if (rpm >= 12 && rpm <= 20) {
        console.log("Respiraciones por minuto estables con " + rpm + " BPM");
    }
    if (rpm >= 21 && rpm <= 24) {
        console.log("Respiraciones por minuto preocupantes con " + rpm + " BPM");
    }
    if (rpm >= 9 && rpm <= 11) {
        console.log("Respiraciones por minuto bajas con " + rpm + " BPM");
    }
    if (rpm <= 8) {
        console.log("Respiraciones por minuto peligrosamente bajas con " + rpm + " BPM");
    }
}