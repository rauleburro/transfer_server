/**
 * Setup express server.
 */

import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import { resolvers, typeDefs } from './graphql';

const initializeApp = async () => {
  // **** Variables **** //

  const app = express();

  // **** Setup **** //

  // Add error handler
  app.use(
    (
      err: Error,
      _: Request,
      res: Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: NextFunction,
    ) => {
      if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
        logger.err(err, true);
      }
      let status = HttpStatusCodes.BAD_REQUEST;
      if (err instanceof RouteError) {
        status = err.status;
      }
      return res.status(status).json({ error: err.message });
    },
  );

  // ** Front-End Content ** //

  // Nav to users pg by default
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server),
  );

  app.get('/', (_, res) => {
    res.redirect('/graphql');
  });

  app.get('/health', (_, res) => {
    res.status(HttpStatusCodes.OK).send('OK');
  });

  return app;
};

export default initializeApp;
