
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { Location } from './stock/entities/location.entity';
import { Batch } from './stock/entities/batch.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('Starting stock distribution...');

    const productRepo = dataSource.getRepository(Product);
    const locationRepo = dataSource.getRepository(Location);
    const batchRepo = dataSource.getRepository(Batch);

    // 1. Get Locations
    let allLocations = await locationRepo.find();
    if (allLocations.length === 0) {
        console.error('No locations found to distribute to! Creating defaults...');
        await locationRepo.save([
            { name: 'Bloc Opératoire', description: 'Salle de chirurgie' },
            { name: 'Pharmacie Centrale', description: 'Stockage principal' },
            { name: 'Réserve Sous-sol', description: 'Stockage long terme' },
            { name: 'Urgences', description: 'Service des urgences' }
        ]);
        allLocations = await locationRepo.find();
    }
    console.log(`Found ${allLocations.length} locations.`);

    // 2. Get Products (take first 20 as requested)
    const products = await productRepo.find({ take: 20 });
    if (products.length === 0) {
        console.error('No products found!');
        await app.close();
        return;
    }
    console.log(`Distributing ${products.length} products...`);

    // 3. Create Batches
    for (const product of products) {
        for (const location of allLocations) {
            // Check if stock already exists to avoid dupes
            const existing = await batchRepo.findOne({ where: { product: { id: product.id }, location: { id: location.id } } });

            if (existing) {
                existing.quantity += 5; // Add more if exists
                await batchRepo.save(existing);
                console.log(`Updated ${product.name} in ${location.name} (+5)`);
            } else {
                const batch = batchRepo.create({
                    product: product,
                    location: location,
                    batchNumber: `DIST-${product.id}-${location.id}-${Math.floor(Math.random() * 1000)}`,
                    quantity: Math.floor(Math.random() * 10) + 5, // 5 to 15 items
                    expirationDate: new Date('2026-06-01'),
                });
                await batchRepo.save(batch);
                console.log(`Added ${batch.quantity} of ${product.name} to ${location.name}`);
            }
        }
    }

    console.log('Stock distribution complete.');
    await app.close();
}

bootstrap();
