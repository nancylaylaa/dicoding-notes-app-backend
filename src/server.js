const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // menggunakan route configuration pada server
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};


// eslint-disable-next-line eol-last
init();