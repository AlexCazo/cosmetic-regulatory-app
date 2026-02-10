/**
 * Évalue la conformité réglementaire d’une formule cosmétique
 * (version démonstration – périmètre volontairement simplifié)
 */

/**
 * Règles réglementaires simulées
 * Dans un vrai ERP, ces règles viendraient d’une base de données
 */
const REGULATORY_RULES = {
  UE: {
    restrictedIngredients: ["Phenoxyethanol", "BHT"],
    maxConcentration: {
      Phenoxyethanol: 1.0
    }
  }
};

/**
 * Évalue une formule
 * @param {Object[]} ingredients - liste des ingrédients
 * @param {string} zone - zone réglementaire (UE, US, etc.)
 * @param {string[]} usages - usages déclarés (visage, rincé, non rincé, etc.)
 */
export function evaluateFormula(ingredients, zone, usages) {
  const rules = REGULATORY_RULES[zone];

  if (!rules) {
    return {
      compliant: false,
      message: `Zone réglementaire non supportée : ${zone}`
    };
  }

  const issues = [];

  ingredients.forEach(ingredient => {
    const { name, concentration } = ingredient;

    // Vérification ingrédient restreint
    if (rules.restrictedIngredients.includes(name)) {
      const max = rules.maxConcentration[name];

      if (max !== undefined && concentration > max) {
        issues.push(
          `${name} dépasse la concentration autorisée (${concentration}% > ${max}%)`
        );
      }
    }
  });

  if (issues.length > 0) {
    return {
      compliant: false,
      issues
    };
  }

  return {
    compliant: true,
    message: "Formule conforme pour la zone sélectionnée"
  };
}
