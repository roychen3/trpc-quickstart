import { type AppRouter } from './router/index.js';

import { createStandaloneServer } from './servers/standalone-server.js';
import { createCustomHttpServer } from './servers/custom-http-server.js';
import { createWSServer } from './servers/wsServer.js';

const port = 4000;
const serverType = 'custom-http';

const server = ((serverType: 'standalone' | 'custom-http') => {
  return serverType === 'standalone'
    ? createStandaloneServer({ port })
    : createCustomHttpServer({ port });
})(serverType);

createWSServer({ server });

export type { AppRouter };
