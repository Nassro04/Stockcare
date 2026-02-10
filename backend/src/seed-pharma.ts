// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { Batch } from './stock/entities/batch.entity';
import { StockMovement } from './stock/entities/stock-movement.entity';
import { User, UserRole } from './users/entities/user.entity';
import { Location } from './stock/entities/location.entity';
import * as bcrypt from 'bcrypt';

async function seedPharma() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    try {
        const productRepo = dataSource.getRepository(Product);
        const batchRepo = dataSource.getRepository(Batch);
        const stockMovementRepo = dataSource.getRepository(StockMovement);
        const userRepo = dataSource.getRepository(User);
        const locationRepo = dataSource.getRepository(Location);

        console.log('🌱 Seeding StockCare (Pharma)...');

        // 1. Users & Roles
        const roles = [UserRole.ADMIN, UserRole.PHARMACIEN, UserRole.MAGASINIER, UserRole.AUDITEUR, UserRole.ADMIN_IT];
        const password = await bcrypt.hash('stockcare', 10);

        for (const role of roles) {
            const username = role.toLowerCase();
            let user = await userRepo.findOne({ where: { username } });
            if (!user) {
                user = userRepo.create({
                    username,
                    email: `${username}@stockcare.hospital`,
                    password,
                    role: role,
                    isActive: true
                });
                await userRepo.save(user);
                console.log(`✅ User created: ${username} (${role})`);
            }
        }

        const admin = await userRepo.findOne({ where: { username: 'admin' } });

        // 2. Locations
        const locations = ['Pharmacie Centrale', 'Bloc Opératoire', 'Urgences', 'Réserve Sous-sol'];
        const savedLocations = [];
        for (const locName of locations) {
            let loc = await locationRepo.findOne({ where: { name: locName } });
            if (!loc) {
                loc = locationRepo.create({ name: locName, description: 'Zone de stockage' });
                await locationRepo.save(loc);
                console.log(`✅ Location created: ${locName}`);
            }
            savedLocations.push(loc);
        }

        // 3. Products (Pharma with Constraints)
        const products = [
            { name: 'Doliprane 1000mg', sku: 'DOL-1000', price: 2.50, minThreshold: 100, isPrescriptionNeeded: false },
            { name: 'Amoxicilline 500mg', sku: 'AMX-500', price: 5.90, minThreshold: 50, isPrescriptionNeeded: true },
            { name: 'Morphine Injectable', sku: 'MOR-INJ', price: 15.00, minThreshold: 10, isPrescriptionNeeded: true },
            { name: 'Serum Phy Utils', sku: 'SER-PHY', price: 1.50, minThreshold: 200, isPrescriptionNeeded: false },
        ];

        const savedProducts = [];
        for (const p of products) {
            let prod = await productRepo.findOne({ where: { sku: p.sku } });
            if (!prod) {
                prod = productRepo.create(p);
                await productRepo.save(prod);
                console.log(`✅ Product created: ${p.name}`);
            }
            savedProducts.push(prod);
        }

        // 4. Batches (FEFO Test Setup)
        // Create multipel batches for Amoxicilline with different expiry dates
        const amox = savedProducts.find(p => p.sku === 'AMX-500');
        const loc = savedLocations[0];

        if (amox && loc) {
            const batches = [
                { batchNumber: 'LOT-EXP-SOON', qty: 50, exp: new Date(new Date().setDate(new Date().getDate() + 10)) }, // Expire in 10 days
                { batchNumber: 'LOT-EXP-LATER', qty: 50, exp: new Date(new Date().setDate(new Date().getDate() + 100)) }, // Expire in 100 days
            ];

            for (const b of batches) {
                let batch = await batchRepo.findOne({ where: { batchNumber: b.batchNumber } });
                if (!batch) {
                    batch = batchRepo.create({
                        product: amox,
                        batchNumber: b.batchNumber,
                        quantity: b.qty,
                        expirationDate: b.exp,
                        location: loc
                    });
                    await batchRepo.save(batch);
                    console.log(`✅ Batch created: ${b.batchNumber} (Exp: ${b.exp.toISOString().split('T')[0]})`);

                    // Initial Log
                    await stockMovementRepo.save(stockMovementRepo.create({
                        batch: batch,
                        user: admin,
                        type: 'IN',
                        quantityChange: b.qty,
                        reason: 'Initial Seeding'
                    }));
                }
            }
        }

        console.log('🚀 StockCare Seed Completed!');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await app.close();
    }
}

seedPharma();
