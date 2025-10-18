import { Client } from 'node-postgres';

export const client = new Client({
  user: process.env.EXPO_PUBLIC_DB_USERNAME,
  password: process.env.EXPO_PUBLIC_DB_PASSWORD,
  host:  process.env.EXPO_PUBLIC_HOST_URL,
  port: 5432,
  database:process.env.EXPO_PUBLIC_DB_NAME, 
  });