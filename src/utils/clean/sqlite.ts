/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';

/**
 * Clean all the tables created by Prisma in the database SQLite
 */

export default class SQLite {
  static async getTables(prisma: PrismaClient): Promise<string[]> {
    const results: Array<{
      name: string;
    }> = await prisma.$queryRaw`
      SELECT
          name
      FROM
          sqlite_schema
      WHERE
          type = 'table';
    `;
    return results.map((result) => result.name);
  }

  static async dropTables(
    prisma: PrismaClient,
    tables: string[],
  ): Promise<void> {
    tables.forEach(async (table) => {
      await prisma.$executeRawUnsafe(`DROP TABLE ${table};`);
    });
  }

  static async clean() {
    try {
      console.info('Dropping all tables in the database SQLite...');
      const prisma = new PrismaClient();
      const tables = await this.getTables(prisma);
      await this.dropTables(prisma, tables);
      await prisma.$disconnect();
      console.info('Successfully cleared the database!');
    } catch (error) {
      console.error(error);
    }
  }
}
