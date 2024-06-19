require('dotenv').config({ path: '.env.local' });
const { exec } = require('child_process');

const SHADOW_DATABASE_URL = process.env.SHADOW_DATABASE_URL;

if (!SHADOW_DATABASE_URL) {
  console.error('Error: SHADOW_DATABASE_URL is not set in the .env file.');
  process.exit(1);
}

const command = `npx prisma migrate diff --from-schema-datamodel ./prisma/schema.prisma --to-migrations ./prisma/migrations --shadow-database-url ${SHADOW_DATABASE_URL} --script > prisma/down.sql`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating down migration script: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log('Down migration script generated successfully.');
});
