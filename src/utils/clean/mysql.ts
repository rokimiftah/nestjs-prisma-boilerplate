/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';

/**
 * Clean all the tables created by Prisma in the database MySQL
 */

export default class MySQL {
  static async getTables(prisma: PrismaClient): Promise<string[]> {
    const results: Array<{
      TABLE_NAME: string;
    }> = await prisma.$queryRaw`
      SELECT
          TABLE_NAME
      FROM
          INFORMATION_SCHEMA.TABLES
      WHERE
          TABLE_SCHEMA = 'development';
    `;
    return results.map((result) => result.TABLE_NAME);
  }

  static async dropTables(
    prisma: PrismaClient,
    tables: string[],
  ): Promise<void> {
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=0;`);
    tables.forEach(async (table) => {
      await prisma.$executeRawUnsafe(`DROP TABLE ${table};`);
    });
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=1;`);
  }

  static async clean() {
    try {
      console.info('Dropping all tables in the database MySQL...');
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
