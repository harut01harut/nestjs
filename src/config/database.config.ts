import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    host: process.env.DATABASE_HOST || 'localhost',
    port: 5432,
    user: process.env.DATABASE_USER,
    name: process.env.DATABASE_NAME,
    pass: process.env.DATABASE_PASS,
    sync: process.env.DATABASE_SYNC === 'true' ? true : false,
    auto: process.env.DATABASE_AUTO === 'true' ? true : false,
}))