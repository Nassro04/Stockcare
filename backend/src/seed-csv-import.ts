// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';

async function seedCsvImport() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    try {
        const productRepo = dataSource.getRepository(Product);

        console.log('🌱 Imported Products CSV Seeding...');

        const csvData = `
Doliprane 1000mg,Boîte de 8 comprimés,DOLI1000,10,N/A
Amoxicilline 500mg,Boîte de 12 gélules,AMOX500,15,N/A
Morphine Injectable 10mg,Flacon 10ml,MORPH10,5,N/A
Serum Physiologique 0.9%,Flacon 500ml,SERUM500,20,N/A
Gants Nitrile Taille M,Boîte de 100 unités,GNTM100,30,N/A
Gants Latex Taille L,Boîte de 100 unités,GNTL100,25,N/A
Masques FFP2,Boîte de 20 unités,FFP2-20,40,N/A
Masques Chirurgicaux,Boîte de 50 unités,MSK50,50,N/A
Compresses Stériles 10x10,Paquet de 50,CPS1010,20,N/A
Soluté Glucosé 5%,Sac 500ml,GLUC500,10,N/A
Soluté Salé 0.9%,Sac 500ml,SAL500,10,N/A
Cathéter 18G,Boîte de 50,CT18G50,15,N/A
Cathéter 20G,Boîte de 50,CT20G50,15,N/A
Perfuseur Standard,Boîte de 25,PERF25,10,N/A
Set de Suture 3/0,Kit complet,SUT30K,5,N/A
Aiguilles 21G,Boîte de 100,AIG21G100,20,N/A
Aiguilles 23G,Boîte de 100,AIG23G100,20,N/A
Tubes EDTA,Boîte de 200,TEDTA200,30,N/A
Tubes Citrate,Boîte de 200,TCIT200,30,N/A
Gels Ultrasons 250ml,Flacon 250ml,GELUS250,10,N/A
Thermomètre Digital,Unité,THERMDIG,5,N/A
Défibrillateur Électrodes,Paire d'électrodes,DEFEL,5,N/A
Draps d’Examen,Rouleau de 100 DR,DRAP100,10,N/A
Champs Stériles,Lot de 20,CHST20,10,N/A
Champ Opératoire Adhésif,Unité,CHOPAD,10,N/A`.trim();

        const lines = csvData.split('\n');

        for (const line of lines) {
            const [name, description, sku, thresholdStr, supplier] = line.split(',');
            if (!name || !sku) continue;

            const minThreshold = parseInt(thresholdStr) || 10;

            // Check if exists
            let product = await productRepo.findOne({ where: { sku: sku.trim() } });

            if (product) {
                console.log(`⚠️  Product already exists: ${name} (${sku}) - Updating...`);
                product.minThreshold = minThreshold;
                product.description = description;
                // Don't overwrite name if it exists to preserve edits? Or should we? Let's overwrite for now.
                product.name = name;
                await productRepo.save(product);
            } else {
                console.log(`✅ Creating Product: ${name} (${sku})`);
                product = productRepo.create({
                    name: name.trim(),
                    description: description.trim(),
                    sku: sku.trim(),
                    minThreshold: minThreshold,
                    price: 0, // Default price
                    isPrescriptionNeeded: name.toLowerCase().includes('morphine') || name.toLowerCase().includes('amoxicilline') // Simple heuristic
                });
                await productRepo.save(product);
            }
        }

        console.log('🚀 CSV Import Completed!');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await app.close();
    }
}

seedCsvImport();
