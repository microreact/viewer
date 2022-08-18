const axios = require("axios");

function getStream(url) {
  return axios({
    method: "get",
    url,
    responseType: "stream",
  })
    .then(
      (response) => ({
        status: response.status,
        headers: response.headers,
        stream: response.data,
      })
    );
}

function fetch(req, res, next) {
  getStream(req.query.url)
    .then((response) => {
      res.status(response.status);
      res.set(response.headers);
      response.stream.pipe(res);
    })
    .catch(next);
}

module.exports = function (app) {
  app.use(
    "/proxy",
    fetch,
  );
};
