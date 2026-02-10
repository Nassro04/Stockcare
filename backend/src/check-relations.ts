
// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Category } from './products/entities/category.entity';

async function check() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const repo = dataSource.getRepository(Category);

    console.log("Checking Categories with Relations...");
    const cats = await repo.find({ relations: ['products'] }); // <--- The critical part

    cats.forEach(c => {
        console.log(`[${c.id}] ${c.name} -> ${c.products ? c.products.length : 'UNDEFINED'} products`);
        if (c.products && c.products.length > 0) {
            console.log(`   Sample: ${c.products[0].name} (Category ID in obj: ${c.products[0].category?.id})`);
        }
    });

    await app.close();
}
check();
