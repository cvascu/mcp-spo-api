import * as path from 'path';
import * as fs from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const moduleDir = dirname(fileURLToPath(import.meta.url));
const openApiPath = path.join(moduleDir, '../openapi/tiers/tiers-openapi.json');
let contrat;
export async function getOpenAPISpec() {
    if (!contrat) {
        // If the contract is not already loaded, load it from the file
        try {
            contrat = await fs.readFile(openApiPath, 'utf-8');
        }
        catch (error) {
            console.error(`Error reading OpenAPI spec file: ${error}`);
            throw error;
        }
    }
    return contrat;
}
