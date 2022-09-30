import axios from "axios";

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

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function (req, res) {
  const response = await getStream(req.query.url);

  res.status(response.status ?? 200);

  if (response.headers) {
    for (const [ key, value ] of Object.entries(response.headers)) {
      res.setHeader(key, value);
    }
  }

  response.stream.pipe(res);
}
