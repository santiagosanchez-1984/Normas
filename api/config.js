const cors = require('../lib/cors');

module.exports = async function(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
};
