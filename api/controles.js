const cors = require('../lib/cors');
const { getSheetsClient, SHEET_ID } = require('../lib/sheets');

module.exports = async function(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {

    const sheets = getSheetsClient();
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: '27001_ControlesA!A:J',
    });

    const rows = (resp.data.values || []).slice(1);
    const controles = rows
      .filter(r => r[0])
      .map((r, i) => ({
        fila: i + 2,
        id: r[0] || '',
        dominio: r[1] || '',
        nombreDominio: r[2] || '',
        nombre: r[3] || '',
        proposito: r[4] || '',
        atributos: r[5] || '',
        estado: r[6] || '',
        responsable: r[7] || '',
        evidencia: r[8] || '',
        obs: r[9] || '',
      }));

    res.json(controles);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
