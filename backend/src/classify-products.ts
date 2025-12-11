
// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { Category } from './products/entities/category.entity';

async function classify() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    const productRepo = dataSource.getRepository(Product);
    const categoryRepo = dataSource.getRepository(Category);

    console.log("🚀 Starting Smart Classification...");

    // 1. Ensure Categories Exist
    const requiredCategories = [
        { name: 'Antibiotiques', keywords: ['amoxicilline', 'antibio', 'augmentin', 'clamoxyl'] },
        { name: 'Antalgiques & Anti-inflammatoires', keywords: ['doliprane', 'paracetamol', 'morphine', 'ibuprofene', 'aspirine', 'pain killer'] },
        { name: 'Premiers Secours', keywords: ['serum', 'pansement', 'compresse', 'bande', 'sparadrap', 'first aid', 'betadine', 'biseptine'] },
        { name: 'Vitamines & Compléments', keywords: ['vitamine', 'magnesium', 'fer', 'calcium'] },
        { name: 'Protection & Hygiène', keywords: ['gants', 'masque', 'blouse', 'charlotte', 'gel', 'savon'] },
        { name: 'Matériel Médical', keywords: ['thermometre', 'tensiometre', 'stethoscope', 'seringue', 'aiguille', 'catheter'] },
        { name: 'Urgences & Réanimation', keywords: ['adrenaline', 'atropine', 'lidocaine'] }
    ];

    let categoryMap = new Map();

    for (const catDef of requiredCategories) {
        let cat = await categoryRepo.findOne({ where: { name: catDef.name } });
        if (!cat) {
            // Check fuzzy match (e.g. "Pain killers" -> replace with "Antalgiques...")
            // Actually, let's keep it simple: create if strict name doesn't exist.
            // Or if we find "Pain killers", maybe we rename it? Let's just create new preferred ones.
            cat = categoryRepo.create({ name: catDef.name });
            await categoryRepo.save(cat);
            console.log(`✨ Created Category: ${cat.name}`);
        }
        categoryMap.set(catDef.name, { entity: cat, keywords: catDef.keywords });
    }

    // 2. Classify Products
    const products = await productRepo.find({ relations: ['category'] });
    let assignedCount = 0;

    for (const product of products) {
        const pName = product.name.toLowerCase();
        let bestMatch = null;

        // Scan all categories
        for (const [catName, data] of categoryMap.entries()) {
            if (data.keywords.some(k => pName.includes(k))) {
                bestMatch = data.entity;
                break; // First match wins
            }
        }

        if (bestMatch) {
            if (product.category?.id !== bestMatch.id) {
                product.category = bestMatch;
                await productRepo.save(product);
                console.log(`✅ Assigned '${product.name}' -> ${bestMatch.name}`);
                assignedCount++;
            }
        } else {
            console.log(`⚠️ Unclassified: ${product.name}`);
        }
    }

    console.log(`🎉 Classification Complete. ${assignedCount} products updated.`);
    await app.close();
}

classify();
