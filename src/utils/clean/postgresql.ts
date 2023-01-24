/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';

/**
 * Clean all the tables and types created by Prisma in the database PostgreSQL
 */

export default class PostgreSQL {
  static async getTables(prisma: PrismaClient): Promise<string[]> {
    const results: Array<{
      tablename: string;
    }> = await prisma.$queryRaw`
      SELECT
          tablename
      FROM
          pg_tables
      WHERE
          schemaname = 'public';
    `;
    return results.map((result) => result.tablename);
  }

  static async getTypes(prisma: PrismaClient): Promise<string[]> {
    const results: Array<{
      typname: string;
    }> = await prisma.$queryRaw`
      SELECT
          t.typname
      FROM
          pg_type t
          JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE
          n.nspname = 'public';
    `;
    return results.map((result) => result.typname);
  }

  static async dropTables(
    prisma: PrismaClient,
    tables: string[],
  ): Promise<void> {
    tables.forEach(async (table) => {
      await prisma.$executeRawUnsafe(`DROP TABLE public."${table}";`);
    });
  }

  static async dropTypes(prisma: PrismaClient, types: string[]) {
    types.forEach(async (type) => {
      await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "${type}";`);
    });
  }

  static async clean() {
    try {
      console.info('Dropping all tables in the database PostgreSQL...');
      const prisma = new PrismaClient();
      const tables = await this.getTables(prisma);
      const types = await this.getTypes(prisma);
      await this.dropTables(prisma, tables);
      await this.dropTypes(prisma, types);
      await prisma.$disconnect();
      console.info('Successfully cleared the database!');
    } catch (error) {
      console.error(error);
    }
  }
}
