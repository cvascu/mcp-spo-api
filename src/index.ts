import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getOpenAPISpec } from "./openapi.js";


// import open api json 
// Create server instance
const server = new McpServer({
    name: "tiers",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});

server.tool(
    "getOpenAPISpec",
    "Obtenir la spécification OpenAPI de l'api tiers sur le serveur SPO. Les apis sont compatible avec un sous-set odata pour l'intérogation. Il ne faut pas utiliser $filter sur les sous-entites. La reponse est en format json.",
    {},
    async () => {
        try {
            const contract = await getOpenAPISpec();

            return {
                content: [{
                    type: "text",
                    text: contract,
                }],
            };
        }
        catch (error) {
            return {
                content: [{
                    type: "text",
                    text: "Erreur lors de la récupération de la spécification OpenAPI.",
                }],
                isError: true,
            };
        }
    });

server.tool(
    "getTiers",
    `Obtenir les informations des tiers en appelant l'API tiers sur le serveur SPO. Le resultat est en format json et spécifié par le contrat OpenAPI de l'api tiers sur le serveur SPO.L'implementation odata du serveur ne supporte pas le $filter sur les sous-entités. Le $expand doit être utilisé pour les sous-entités. Le $filter ne doit pas être utilisé sur les sous-entités. Le $expand doit être utilisé pour les sous-entités. Le $filter ne doit pas être utilisé sur les sous-entités par exemple $filter=adresses/any(a:a.ville eq 'test') n'est pas supporté`,
    {
        path: z.string().describe("le chemin de l'api, par exemple /api/tiers/tiers"),
        odata: z.string().optional().describe("OData parameters par exemple $filter=...,$expand mais pas $select. $filter ne doit pas être utilisé sur les sous-entités. $expand doit être utilisé pour les sous-entités."),
    },
    async ({ path, odata }) => {
        const baseUrl = 'http://localhost:3000';
        let apiUrl = `${baseUrl}${path}`;
        if (odata) {
            apiUrl += `?${odata}`;
        }

        // Fetch the data from the API using native fetch function from node
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            return {
                content: [{
                    type: "text",
                    text: `Erreur lors de la récupération des données de l'API ${apiUrl} : ${response.statusText}`,
                }],
                isError: true,
            };
        }
        try{
            let text = await response.text();
            text = JSON.stringify(JSON.parse(text));
            return {
                content: [{
                    type: "text",
                    text,
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: `Erreur lors de la récupération des données de l'API ${apiUrl} : ${error}`,
                }],
                isError: true,
            };
        }
    }
);

async function main() {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Tiers MCP Server running on stdio");
    }

main().catch((error) => {
        console.error("Fatal error in main():", error);
        process.exit(1);
    });