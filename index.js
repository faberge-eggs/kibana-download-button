const fetch = require("node-fetch");

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'download_button',
    uiExports: {
      navbarExtensions: ['plugins/download_button/downloadButton']
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) {
      server.route({
        path: '/app/api/download',
        method: 'POST',
        async handler(req, reply) {
          const esHost = server.config().get('elasticsearch.hosts')[0]
          console.log(esHost)
          let resp = await fetch(`${esHost}/_search?scroll=5m`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.payload)
          })
          return resp.body
        }
      });

      server.route({
        path: '/app/api/download/scroll',
        method: 'POST',
        async handler(req, reply) {
          const esHost = server.config().get('elasticsearch.hosts')[0]
          console.log(esHost)
          let resp = await fetch(`${esHost}/_search/scroll`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.payload)
          })
          return resp.body
        }
      });
    }
  });
}
