const cors = require('../lib/cors');
const { getUsuarioActual, tokenFromReq } = require('../lib/auth');

module.exports = async function(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const user = await getUsuarioActual(tokenFromReq(req));
    if (!user) return res.status(403).json({ error: 'Sin acceso' });
    res.json(user);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
