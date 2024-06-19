import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import server from './server';
import { ENV_VARS } from '@src/constants/env-vars';


// **** Run **** //

const SERVER_START_MSG = (`Express server started on port: ${ENV_VARS.PORT}`);

server.listen(ENV_VARS.PORT, () => logger.info(SERVER_START_MSG));
