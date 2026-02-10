
// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Category } from './products/entities/category.entity';

async function cleanup() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const catRepo = dataSource.getRepository(Category);

    const toDelete = ['First Aid', 'Pain killers', 'Vitamins', 'Antibiotics'];

    for (const name of toDelete) {
        const cat = await catRepo.findOne({ where: { name } });
        if (cat) {
            // Verify it's empty just in case logic was wrong, though typically we just delete
            const count = await dataSource.createQueryBuilder()
                .relation(Category, "products")
                .of(cat)
                .loadMany();

            if (count.length === 0) {
                await catRepo.remove(cat);
                console.log(`🗑️ Deleted empty category: ${name}`);
            } else {
                console.log(`⚠️ Skipped ${name} (contains ${count.length} products)`);
            }
        }
    }

    await app.close();
}
cleanup();
