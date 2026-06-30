const cors = require('../lib/cors');
const { getSheetsClient, SHEET_ID } = require('../lib/sheets');

module.exports = async function(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {

    const sheets = getSheetsClient();
    const [clauRes, ctrlRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: '27001_Clausulas!A:M' }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: '27001_ControlesA!A:J' }),
    ]);

    const clauRows = (clauRes.data.values || []).slice(1).filter(r => r[0]);
    const ctrlRows = (ctrlRes.data.values || []).slice(1).filter(r => r[0]);

    const clausulas = {
      total: clauRows.length,
      conEvidencia: clauRows.filter(r => r[5]).length,
      conHallazgos: clauRows.filter(r => r[10]).length,
      conPlan: clauRows.filter(r => r[11]).length,
      conRecomendaciones: clauRows.filter(r => r[9]).length,
    };

    const controles = {
      total: ctrlRows.length,
      conforme:   ctrlRows.filter(r => r[6] === 'Conforme').length,
      enProceso:  ctrlRows.filter(r => r[6] === 'En proceso').length,
      noConforme: ctrlRows.filter(r => r[6] === 'No conforme').length,
      noAplica:   ctrlRows.filter(r => r[6] === 'No aplica').length,
    };
    controles.pct = controles.total > 0 ? Math.round(controles.conforme * 100 / controles.total) : 0;

    const porDominio = {};
    ctrlRows.forEach(r => {
      const dn = r[2] || 'Sin dominio';
      if (!porDominio[dn]) porDominio[dn] = { conforme: 0, enProceso: 0, noConforme: 0, noAplica: 0, total: 0 };
      porDominio[dn].total++;
      if (r[6] === 'Conforme')    porDominio[dn].conforme++;
      if (r[6] === 'En proceso')  porDominio[dn].enProceso++;
      if (r[6] === 'No conforme') porDominio[dn].noConforme++;
      if (r[6] === 'No aplica')   porDominio[dn].noAplica++;
    });

    res.json({ clausulas, controles, porDominio });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
