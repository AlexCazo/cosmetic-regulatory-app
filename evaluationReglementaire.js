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
    ingredients: {
      Phenoxyethanol: {
        limits: [
          {
            max: 1.0,
            allowedUsages: ["rincé", "non rincé"]
          }
        ]
      },
      BHT: {
        limits: [
          {
            max: 0.1,
            allowedUsages: ["rincé"]
          }
        ]
      }
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
    const ingredientRule = rules.ingredients?.[normalized];

    if (!ingredientRule) return;

    ingredientRule.limits.forEach(limit => {
      const allUsagesCovered = usages.every(u =>
        limit.allowedUsages.includes(u)
      );

      if (!allUsagesCovered) {
        issues.push(
          `${normalized} non autorisé pour l’ensemble des usages sélectionnés`
        );
        return;
      }

      if (concentration > limit.max) {
        issues.push(
          `${normalized} dépasse la concentration autorisée (${concentration}% > ${limit.max}%)`
        );
      }
    });
  });

  return issues.length > 0
    ? { compliant: false, issues }
    : { compliant: true, message: "Formule conforme pour la zone sélectionnée" };
}


