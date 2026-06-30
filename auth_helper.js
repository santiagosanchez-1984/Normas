// ============================================================
// auth_helper.js — Re-autenticacion OAuth con servidor local
// Ejecutar: node auth_helper.js
// (Solo necesario cuando el token expira)
// ============================================================
const { google } = require('googleapis');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const cp    = require('child_process');

const CREDS_PATH = path.join(__dirname, '..', 'credentials.json');
const TOKEN_PATH = path.join(__dirname, '..', 'token.json');
const PORT       = 8080;

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive'
];

async function main() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH));
  const { client_id, client_secret } = creds.installed;
  const redirectUri = `http://localhost:${PORT}`;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  console.log('\n=== Autenticacion Google OAuth ===');
  console.log(`Iniciando servidor en http://localhost:${PORT} ...`);

  // Crear servidor que captura el redirect
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h2>Error: ' + error + '</h2><p>Cerrar esta ventana.</p>');
        server.close();
        console.error('Error en auth:', error);
        process.exit(1);
      }

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <html><body style="font-family:Arial;padding:40px;background:#f0f4f8">
          <h2 style="color:#0f2744">Autorizacion exitosa!</h2>
          <p>Podes cerrar esta ventana y volver al terminal.</p>
          <p style="color:#22c55e;font-weight:bold">Token guardado correctamente.</p>
          </body></html>
        `);

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('\nToken guardado en:', TOKEN_PATH);
        console.log('\nAhora podes correr el script de carga:');
        console.log('  node cargar_iso27001.js');

        server.close(() => process.exit(0));
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Esperando autorizacion...');
      }
    } catch (e) {
      res.writeHead(500);
      res.end('Error: ' + e.message);
      server.close();
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log(`Servidor activo. Abriendo navegador...`);
    // Abrir el navegador automaticamente en Windows
    cp.exec(`start "" "${authUrl}"`, (err) => {
      if (err) {
        console.log('\nNo se pudo abrir el navegador automaticamente.');
        console.log('Abri esta URL manualmente:\n');
        console.log(authUrl);
      }
    });
    console.log('\nEsperando que autorices en el navegador...');
    console.log('(Presiona Ctrl+C para cancelar)\n');
  });
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
