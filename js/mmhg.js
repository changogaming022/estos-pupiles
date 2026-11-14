
while (true) {
    let mmHg = parseFloat(prompt("Ingresa la presión sistólica en mmHg:"));
    if (mmHg >= 90 && mmHg <= 120) {
        console.log("Presión sistólica estable con " + mmHg + " mmHg");
    }
    if (mmHg >= 121 && mmHg <= 139) {
        console.log("Presión sistólica preocupante con " + mmHg + " mmHg");
    }
    if (mmHg >= 80 && mmHg <= 89) {
        console.log("Presión sistólica baja con " + mmHg + " mmHg");
    }
    if (mmHg < 80) {
        console.log("Presión sistólica peligrosamente baja con " + mmHg + " mmHg");
    }
}