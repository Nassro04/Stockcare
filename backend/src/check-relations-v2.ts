
// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Category } from './products/entities/category.entity';
import { Product } from './products/entities/product.entity';

async function check() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const catRepo = dataSource.getRepository(Category);
    const prodRepo = dataSource.getRepository(Product);

    console.log("--- PRODUCTS (id: name -> catId) ---");
    const prods = await prodRepo.find({ relations: ['category'] });
    prods.forEach(p => {
        console.log(`${p.id}: ${p.name} -> ${p.category ? p.category.id : 'NULL'}`);
    });

    console.log("\n--- CATEGORIES (id: name -> count) ---");
    const cats = await catRepo.find({ relations: ['products'] });
    cats.forEach(c => {
        console.log(`${c.id}: ${c.name} -> ${c.products ? c.products.length : 0}`);
    });

    await app.close();
}
check();
