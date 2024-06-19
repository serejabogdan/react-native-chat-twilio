## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

## Available Scripts

### `npm run dev`

Run the server in development mode.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.

## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`.

## Notes about local scripts

- Create `.env.local` for development
- To make a migration use `migrate-create` command: `npm run migrate-create NAME_OF_NEW_MIGRATION`
- To deploy all migrations use `migrate-deploy` command: `npm run migrate-deploy`
- To restore DB use `migrate-reset` command: `npm run migrate-reset`
- To deploy all migrations to prod use `migrate-deploy:production` command: `npm run migrate-deploy:production`
