const { OAuth2Client } = require('google-auth-library');
const { getSheetsClient, SHEET_ID } = require('./sheets');

const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function getUsuarioActual(token) {
  if (!token) {
    const err = new Error('No token'); err.status = 401; throw err;
  }

  let payload;
  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    const err = new Error('Token invalido o expirado'); err.status = 401; throw err;
  }

  const email = payload.email;

  if (email === process.env.OWNER_EMAIL) {
    return { email, nombre: payload.name || 'Admin', permiso: 'Admin' };
  }

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Usuarios!A:E',
  });

  const rows = (res.data.values || []).slice(1);
  const row = rows.find(r => r[0] === email && r[3] === 'Activo');
  if (!row) return null;

  return { email: row[0], nombre: row[1], permiso: row[2] };
}

function tokenFromReq(req) {
  const auth = req.headers.authorization || '';
  return auth.replace(/^Bearer\s+/i, '').trim();
}

module.exports = { getUsuarioActual, tokenFromReq };
