/**
 * Évalue la conformité réglementaire d’une formule cosmétique
 * Version démonstration : périmètre volontairement simplifié
 * Hypothèses :
 * - Les règles sont supposées complètes pour la zone étudiée
 * - Absence de limite = ingrédient non restreint pour cet usage
 * - En cas d’usages cumulés, on applique la limite la plus restrictive
 */


/**
 * Base réglementaire simulée.
 * Dans un système réel, ces données proviendraient
 * d’une base réglementaire versionnée.
 */
const REGULATORY_RULES = {
  UE: {
    ingredients: {
      Phenoxyethanol: {
        // Limites dépendantes du type d’usage
        // Si un produit cumule plusieurs usages,
        // la limite applicable sera la plus restrictive.
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
 * Évalue une formule cosmétique.
 *
 * @param {Object[]} ingredients - Liste des ingrédients avec concentration
 * Exemple : [{ name: "Phenoxyethanol", concentration: 0.8 }]
 *
 * @param {string} zone - Zone réglementaire (ex : "UE")
 *
 * @param {string[]} usages - Usages déclarés du produit
 * Exemple : ["rincé", "non rincé"]
 */
export function evaluateFormula(ingredients, zone, usages) {

  // 1️⃣ On récupère les règles correspondant à la zone sélectionnée
  const rules = REGULATORY_RULES[zone];

  // Si la zone n’est pas supportée, on bloque immédiatement
  if (!rules) {
    return {
      compliant: false,
      message: `Zone réglementaire non supportée : ${zone}`
    };
  }

  // Tableau qui collectera toutes les non-conformités détectées
  const issues = [];

  // 2️⃣ Analyse de chaque ingrédient individuellement
  ingredients.forEach(({ name, concentration }) => {

    // Normalisation minimale (évite les espaces parasites)
    const normalized = name.trim();

    // On vérifie si l’ingrédient est connu dans la base réglementaire
    const ingredientRule = rules.ingredients?.[normalized];

    // Si l’ingrédient n’est pas dans la base :
    // → on considère qu’il n’est pas restreint
    // → il sort du périmètre de contrôle de cette démo
    if (!ingredientRule) return;

    const limitsByUsage = ingredientRule.limitsByUsage;

    // 3️⃣ On identifie les limites applicables aux usages déclarés
    // On récupère les seuils existants pour chaque usage
    const applicableLimits = usages
      .map(u => limitsByUsage[u])
      .filter(limit => limit !== undefined);

    // Si aucun seuil n’est défini pour ces usages :
    // → on considère l’ingrédient non restreint
    // (choix permissif cohérent avec notre hypothèse simplifiée)
    if (applicableLimits.length === 0) return;

    // 4️⃣ En cas d’usages cumulés,
    // on applique la limite la plus restrictive
    const maxAllowed = Math.min(...applicableLimits);

    // 5️⃣ Vérification de la concentration réelle
    if (concentration > maxAllowed) {
      issues.push(
        `${normalized} dépasse la limite autorisée (${concentration}% > ${maxAllowed}%)`
      );
    }
  });

  // 6️⃣ Décision finale
  // Si au moins une non-conformité est détectée → formule non conforme
  return issues.length > 0
    ? { compliant: false, issues }
    : { compliant: true, message: "Formule conforme pour la zone sélectionnée" };
}
