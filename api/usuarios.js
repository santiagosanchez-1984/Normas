const cors = require('../lib/cors');
const { getUsuarioActual, tokenFromReq } = require('../lib/auth');
const { getSheetsClient, SHEET_ID } = require('../lib/sheets');
const { Resend } = require('resend');

const HOJA = 'Usuarios';
// Columnas: A=Email B=Nombre C=Permiso D=Estado E=FechaAgregado
const CAMPO_COL = { nombre: 2, permiso: 3, estado: 4 };

async function getRows(sheets) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${HOJA}!A:E`,
  });
  return res.data.values || [];
}

async function enviarEmail({ email, nombre, permiso }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const url = process.env.APP_URL || 'https://tu-app.vercel.app';
  await resend.emails.send({
    from: 'Normas SI <onboarding@resend.dev>',
    to: email,
    subject: 'Acceso — Sistema de Normas de Seguridad SI',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">
        <div style="background:#0f2744;padding:28px 32px">
          <div style="color:#fff;font-size:18px;font-weight:700">Normas de <span style="color:#60a5fa">Seguridad SI</span></div>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:15px;color:#1e293b;margin:0 0 12px">Hola <strong>${nombre}</strong>,</p>
          <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px">Se te otorgo acceso al sistema de gestion de Normas ISO 27001:2022 con permiso de <strong>${permiso}</strong>.</p>
          <a href="${url}" style="display:inline-block;background:#0f2744;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">Ingresar al sistema &rarr;</a>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8">NBCH &mdash; Sistema de Seguridad de la Informacion</div>
      </div>
    `,
  });
}

module.exports = async function(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const user = await getUsuarioActual(tokenFromReq(req));
    if (!user) return res.status(403).json({ error: 'Sin acceso' });
    if (user.permiso !== 'Admin') return res.status(403).json({ error: 'Solo Admin' });

    const sheets = getSheetsClient();

    // GET — listar usuarios
    if (req.method === 'GET') {
      const rows = await getRows(sheets);
      const usuarios = rows.slice(1).map(r => ({
        email: r[0] || '',
        nombre: r[1] || '',
        permiso: r[2] || '',
        estado: r[3] || '',
        fechaAgregado: r[4] || '',
      }));
      return res.json({ ok: true, usuarios });
    }

    // POST — agregar usuario o reenviar email
    if (req.method === 'POST') {
      const { action, email, nombre, permiso } = req.body || {};

      if (action === 'reenviar') {
        const rows = await getRows(sheets);
        const row = rows.find((r, i) => i > 0 && r[0] === email);
        if (!row) return res.json({ ok: false, msg: 'Usuario no encontrado' });
        await enviarEmail({ email: row[0], nombre: row[1], permiso: row[2] });
        return res.json({ ok: true });
      }

      if (!email || !nombre || !permiso) return res.json({ ok: false, msg: 'Faltan datos' });

      const rows = await getRows(sheets);
      if (rows.find((r, i) => i > 0 && r[0] === email)) {
        return res.json({ ok: false, msg: 'El email ya existe' });
      }

      const fecha = new Date().toLocaleDateString('es-AR');
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${HOJA}!A:E`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[email, nombre, permiso, 'Activo', fecha]] },
      });

      try {
        await enviarEmail({ email, nombre, permiso });
        return res.json({ ok: true, msg: 'Email de bienvenida enviado.' });
      } catch (e) {
        return res.json({ ok: true, msg: 'Usuario agregado. No se pudo enviar email: ' + e.message });
      }
    }

    // PUT — actualizar campo de usuario
    if (req.method === 'PUT') {
      const { email, campo, valor } = req.body || {};
      if (!CAMPO_COL[campo]) return res.json({ ok: false, msg: 'Campo invalido' });

      const rows = await getRows(sheets);
      const idx = rows.findIndex((r, i) => i > 0 && r[0] === email);
      if (idx < 0) return res.json({ ok: false, msg: 'Usuario no encontrado' });

      const letra = String.fromCharCode(64 + CAMPO_COL[campo]);
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${HOJA}!${letra}${idx + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[valor]] },
      });
      return res.json({ ok: true });
    }

    // DELETE — eliminar usuario
    if (req.method === 'DELETE') {
      const { email } = req.body || {};
      const rows = await getRows(sheets);
      const idx = rows.findIndex((r, i) => i > 0 && r[0] === email);
      if (idx < 0) return res.json({ ok: false, msg: 'Usuario no encontrado' });

      const metaRes = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID, fields: 'sheets.properties' });
      const sheet = metaRes.data.sheets.find(s => s.properties.title === HOJA);
      if (!sheet) return res.json({ ok: false, msg: 'Hoja Usuarios no encontrada' });

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: 'ROWS',
                startIndex: idx,
                endIndex: idx + 1,
              },
            },
          }],
        },
      });
      return res.json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(e.status || 500).json({ ok: false, msg: e.message });
  }
};
