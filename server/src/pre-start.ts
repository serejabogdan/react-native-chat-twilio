/**
 * Pre-start is where we want to place things that must run BEFORE the express
 * server is started. This is useful for environment variables, command-line
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// eslint-disable-next-line node/no-process-env
const NODE_ENV = process.env.NODE_ENV;

// Set the env file
if (!NODE_ENV) {
  dotenv.config();
} else {
  const envFileName = `.env.${NODE_ENV}`;
  const envPath = path.resolve(process.cwd(), envFileName);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envFileName });
  } else {
    throw Error(`File ${envFileName} does not exist`);
  }
}
