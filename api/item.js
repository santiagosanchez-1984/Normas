const cors = require('../lib/cors');
const { getSheetsClient, SHEET_ID } = require('../lib/sheets');

const CLAU_COL = {
  descripcion: 4, requisitos: 5, evidencia: 6, ejemplosPracticos: 7,
  normasRelacionadas: 8, documentosModelo: 9, recomendacionesAuditoria: 10,
  hallazgos: 11, planAccion: 12, fechaRevision: 13,
};
const CTRL_COL = { estado: 7, responsable: 8, evidencia: 9, obs: 10 };

const HOJAS = { clausulas: '27001_Clausulas', controles: '27001_ControlesA' };

module.exports = async function(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tipo, fila, campo, valor } = req.body;
    const colMap = tipo === 'clausulas' ? CLAU_COL : CTRL_COL;
    const hoja   = HOJAS[tipo];

    if (!colMap[campo] || !hoja) return res.status(400).json({ ok: false, msg: 'Parametros invalidos' });

    const col   = colMap[campo];
    const letra = String.fromCharCode(64 + col);
    const range = `${hoja}!${letra}${fila}`;

    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[valor]] },
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(e.status || 500).json({ ok: false, msg: e.message });
  }
};
