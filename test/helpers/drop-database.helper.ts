import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(configService: ConfigService): Promise<void> {
    // Create the connection datasource
    const AppDataSource = await new DataSource({
        type: 'postgres',
        // entities: [User],
        synchronize: true,
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.pass'),
        host: configService.get('database.host'),
        database: configService.get('database.name')
    }).initialize();
    // Drop all tables
    await AppDataSource.dropDatabase();
    // Close the connection
    await AppDataSource.destroy();
}