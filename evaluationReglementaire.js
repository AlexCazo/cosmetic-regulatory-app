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

  ingredients.forEach(({ name, concentration }) => {
    const normalized = name.trim();

    const rule = rules.ingredients?.[normalized];

    if (!rule) return;

    // Vérification concentration
    if (
      rule.maxConcentration !== undefined &&
      concentration > rule.maxConcentration
    ) {
      issues.push(
        `${normalized} dépasse la concentration autorisée (${concentration}% > ${rule.maxConcentration}%)`
      );
    }

    // Vérification usages
    if (rule.allowedIn) {
      const usageAllowed = usages.some(u =>
        rule.allowedIn.includes(u)
      );

      if (!usageAllowed) {
        issues.push(
          `${normalized} non autorisé pour les usages sélectionnés`
        );
      }
    }
  });

  return issues.length > 0
    ? { compliant: false, issues }
    : { compliant: true, message: "Formule conforme pour la zone sélectionnée" };
}


