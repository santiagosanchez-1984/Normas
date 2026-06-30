const cors = require('../lib/cors');
const { getSheetsClient, SHEET_ID } = require('../lib/sheets');

module.exports = async function(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {

    const sheets = getSheetsClient();
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: '27001_Clausulas!A:M',
    });

    const rows = (resp.data.values || []).slice(1);
    const clausulas = rows
      .filter(r => r[0])
      .map((r, i) => ({
        fila: i + 2,
        id: r[0] || '',
        nivel: parseInt(r[1]) || 1,
        titulo: r[2] || '',
        descripcion: r[3] || '',
        requisitos: r[4] || '',
        evidencia: r[5] || '',
        ejemplosPracticos: r[6] || '',
        normasRelacionadas: r[7] || '',
        documentosModelo: r[8] || '',
        recomendacionesAuditoria: r[9] || '',
        hallazgos: r[10] || '',
        planAccion: r[11] || '',
        fechaRevision: r[12] || '',
      }));

    res.json(clausulas);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
