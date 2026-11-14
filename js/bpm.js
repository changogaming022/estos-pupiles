while (true) {
    let BPM = Number(prompt("Ingresa el ritmo cardiaco en BPM:"));

    if (BPM >= 60 && BPM <= 100) {
        console.log("Ritmo cardiaco estable con " + BPM + " BPM");
    }

    if (BPM >= 101 && BPM <= 120) {
        console.log("Ritmo cardiaco preocupante con " + BPM + " BPM");
    }

    if (BPM >= 40 && BPM <= 59) {
        console.log("Ritmo cardiaco bajo con " + BPM + " BPM");
    }

    if (BPM < 40) {
        console.log("Ritmo cardiaco peligrosamente bajo con " + BPM + " BPM");
    }
}
