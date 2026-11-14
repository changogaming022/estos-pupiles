function evaluar() {
      const O = parseFloat(document.getElementById("oxigeno").value);
      let texto;
      if (O >= 95)      texto = "adecuada";
      else if (O >= 93) texto = "preocupante";
      else if (O >= 90) texto = "baja";
      else              texto = "peligrosamente baja";
      document.getElementById("resultado").textContent =
        "Saturación de oxígeno " + texto + " con " + O + "%";
}