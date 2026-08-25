import fs from 'fs/promises';
import path from 'path';

export interface ResourceItem {
    id: string;
    title: string;
    description: string;
    category: 'Fiche Mémo' | 'Cheat Sheet' | 'Template Soutenance' | 'Code & Infra' | 'Méthodologie PBL' | 'Maths & Physique';
    promo: string;
    specialty: string;
    author: string;
    campus: string;
    downloads: number;
    fileSize: string;
    fileType: 'PDF' | 'MD' | 'PPTX' | 'ZIP' | 'YAML';
    content: string;
    createdAt?: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'resources.json');

export const SEED_RESOURCES: ResourceItem[] = [
    {
        id: 'res-sql-perf',
        title: 'Cheat Sheet : Optimisation SQL & Indexation B-Tree',
        description: 'Guide complet pour structurer les requêtes PostgreSQL, analyser les EXPLAIN ANALYZE et maîtriser les index composites.',
        category: 'Cheat Sheet',
        promo: 'A3',
        specialty: 'Informatique',
        author: 'Major Promo FISE',
        campus: 'Rouen',
        downloads: 142,
        fileSize: '45 KB',
        fileType: 'MD',
        content: `# Optimisation SQL & PostgreSQL
## 1. Comprendre EXPLAIN ANALYZE
- **Seq Scan** : Balayage complet de table.
- **Index Scan** : Utilisation de l'arbre B-Tree.
- **Index Only Scan** : Données extraites directement de l'index.

## 2. Création d'index efficaces
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date DESC);
\`\`\`
`
    },
    {
        id: 'res-docker-prod',
        title: 'Fiche Mémo : Dockerfile Multi-Stage & Compose Sécurisé',
        description: 'Template de conteneurisation durcie pour applications Node.js, Spring Boot et Python en environnement de production.',
        category: 'Code & Infra',
        promo: 'A3',
        specialty: 'Informatique',
        author: 'Paul THOMAS (Admin)',
        campus: 'Nanterre',
        downloads: 215,
        fileSize: '12 KB',
        fileType: 'YAML',
        content: `# Dockerfile Multi-stage Node.js Production
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
`
    },
    {
        id: 'res-pbl-7-steps',
        title: 'Méthodologie PBL : Guide de survie aux 7 étapes CESI',
        description: 'Fiche méthodologique pas-à-pas pour réussir les animations de séances aller/retour et structurer les livrables d\'ingénierie.',
        category: 'Méthodologie PBL',
        promo: 'A1',
        specialty: 'Généraliste',
        author: 'Tuteur CESI',
        campus: 'Tous Campus',
        downloads: 389,
        fileSize: '18 KB',
        fileType: 'MD',
        content: `# Méthode PBL en 7 étapes
1. Mots-clés & Vocabulaire
2. Contexte & Définition du problème
3. Problématique centrale
4. Contraintes techniques & organisationnelles
5. Hypothèses explicatives
6. Plan d'action & Répartition des rôles
7. Synthèse & Livrables attendus
`
    }
];

async function ensureResourceFile(): Promise<ResourceItem[]> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        let existing: ResourceItem[] = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            existing = JSON.parse(data);
        } catch {
            existing = SEED_RESOURCES;
            await fs.writeFile(DATA_FILE, JSON.stringify(SEED_RESOURCES, null, 2), 'utf-8');
        }

        return existing;
    } catch (e) {
        console.error('Error ensuring resource data file:', e);
        return SEED_RESOURCES;
    }
}

export async function getAllResources(): Promise<ResourceItem[]> {
    const entries = await ensureResourceFile();
    return entries;
}

export async function getResourceById(id: string): Promise<ResourceItem | null> {
    const entries = await ensureResourceFile();
    return entries.find(r => r.id === id) || null;
}

export async function publishResource(resource: Omit<ResourceItem, 'id' | 'downloads'>): Promise<ResourceItem> {
    const entries = await ensureResourceFile();

    const id = `res-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newEntry: ResourceItem = {
        ...resource,
        id,
        downloads: 0,
        createdAt: new Date().toISOString()
    };

    entries.unshift(newEntry);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    return newEntry;
}

export async function updateResource(id: string, updates: Partial<ResourceItem>): Promise<ResourceItem | null> {
    const entries = await ensureResourceFile();
    const entry = entries.find(r => r.id === id);
    if (!entry) return null;

    Object.assign(entry, updates);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    return entry;
}

export async function deleteResource(id: string): Promise<boolean> {
    const entries = await ensureResourceFile();
    const initLen = entries.length;
    const filtered = entries.filter(r => r.id !== id);

    if (filtered.length !== initLen) {
        await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
        return true;
    }
    return false;
}
