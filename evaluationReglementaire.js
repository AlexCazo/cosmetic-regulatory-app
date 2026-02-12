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
        limitsByUsage: {
          "rincé": 1.0,
          "non rincé": 0.5
        }
      },
      BHT: {
        limitsByUsage: {
          "rincé": 0.1
        }
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

    // Si l’ingrédient n’est pas dans la base → hors périmètre de contrôle
    if (!ingredientRule) return;

    const limitsByUsage = ingredientRule.limitsByUsage;

    // On récupère uniquement les usages pour lesquels une limite existe
    const applicableLimits = usages
      .map(u => limitsByUsage[u])
      .filter(limit => limit !== undefined);

    // Si aucune limite définie pour ces usages → pas restreint
    if (applicableLimits.length === 0) return;

    // Sinon on applique la plus restrictive
    const maxAllowed = Math.min(...applicableLimits);

    if (concentration > maxAllowed) {
      issues.push(
        `${normalized} dépasse la limite autorisée (${concentration}% > ${maxAllowed}%)`
      );
    }
  });

  return issues.length > 0
    ? { compliant: false, issues }
    : { compliant: true, message: "Formule conforme pour la zone sélectionnée" };
}
