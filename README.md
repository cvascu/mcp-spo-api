# MCP SPO API
POC pour serveur MCP avec 2 outils:
- getOpenAPISpec: permet de récuperer le contrat OpenAPI
- getTiers: client api tiers SPO avec 2 paramètres
1. path: chemin rélatif api
2. paramètres ODATA

## Conclusion:
- Très consomateur, il n'est pas utilisable avec Claude Desktop gratuit
- Avec OpenAI quota depassé pour tokens/min (>30000tokens/min)
- Le filtre ODATA généré est trop complex pour notre implementation (spécialement sous-entités)

## A faire:
- Tester pour les apis reporting sans sous-entites
- Créer(étudier) un mcp client qui gere les depassements
- Simplifier le contrat OPENAPI fourni

