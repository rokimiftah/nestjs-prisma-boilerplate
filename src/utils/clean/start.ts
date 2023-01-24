/* eslint-disable no-console */

import 'dotenv/config';

import MySQL from './mysql';
import PostgreSQL from './postgresql';
import SQLite from './sqlite';

const provider = process.env.PROVIDER;

switch (provider) {
  case 'mysql':
    MySQL.clean();
    break;
  case 'postgresql':
    PostgreSQL.clean();
    break;
  case 'sqlite':
    SQLite.clean();
    break;
  default:
    console.error('Database provider not match!');
}
