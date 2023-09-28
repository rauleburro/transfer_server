import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/constants/EnvVars';
import initializeApp from './server';

// **** Run **** //

(async () => {
  const SERVER_START_MSG =
    'Express server started on port: ' + EnvVars.Port.toString();

  const server = await initializeApp();

  server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
})();
