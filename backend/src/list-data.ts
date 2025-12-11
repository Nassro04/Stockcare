
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { Category } from './products/entities/category.entity';

async function listData() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    const productRepo = dataSource.getRepository(Product);
    const categoryRepo = dataSource.getRepository(Category);

    const products = await productRepo.find();
    const categories = await categoryRepo.find();

    console.log('--- CATEGORIES ---');
    categories.forEach(c => console.log(`${c.id}: ${c.name}`));

    console.log('--- PRODUCTS ---');
    products.forEach(p => console.log(`${p.id}: ${p.name} (Current Cat: ${p.category?.id})`));

    await app.close();
}

listData();
