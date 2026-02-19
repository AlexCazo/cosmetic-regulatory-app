import { evaluateFormula } from "./evaluationReglementaire.js";

const ingredientInput = document.getElementById("ingredientName");
const concentrationInput = document.getElementById("concentration");
const usagesSelect = document.getElementById("usages");
const resultDisplay = document.getElementById("result");
const button = document.getElementById("evaluateBtn");

button.addEventListener("click", () => {
  const name = ingredientInput.value;
  const concentration = parseFloat(concentrationInput.value);

  const usages = Array.from(usagesSelect.selectedOptions).map(
    option => option.value
  );

  const ingredients = [
    {
      name,
      concentration
    }
  ];

  const evaluation = evaluateFormula(ingredients, "UE", usages);

  if (evaluation.compliant) {
    resultDisplay.textContent = "✅ Formule conforme";
  } else {
    resultDisplay.textContent =
      "❌ Non conforme :\n" + evaluation.issues.join("\n");
  }
});
