// ============================================================
// Normas de Seguridad de la Información — Apps Script Backend
// ISO 27001:2022 | Spreadsheet ID: 1nh4BIZyFYCoUiiz8FxZILUm8Wv4NPB2M3FDiA37JdnA
// ============================================================

var SS_ID          = '1nh4BIZyFYCoUiiz8FxZILUm8Wv4NPB2M3FDiA37JdnA';
var HOJA_CLAUSULAS = '27001_Clausulas';
var HOJA_CONTROLES = '27001_ControlesA';
var HOJA_USUARIOS  = 'Usuarios';


// 27001_Clausulas (A..M)
// A=1 ID | B=2 Nivel | C=3 Titulo | D=4 Descripcion | E=5 Requisitos
// F=6 Evidencia | G=7 Ejemplos_Practicos | H=8 Normas_Relacionadas
// I=9 Documentos_Modelo | J=10 Recomendaciones_Auditoria
// K=11 Hallazgos | L=12 Plan_Accion | M=13 Fecha_Revision

// 27001_ControlesA (A..J)
// A=1 ID | B=2 Dominio | C=3 NombreDominio | D=4 Nombre_Control
// E=5 Proposito | F=6 Atributos | G=7 Estado | H=8 Responsable
// I=9 Evidencia | J=10 Observaciones

// Usuarios (A..E)
// A=1 Email | B=2 Nombre | C=3 Permiso (Lectura/Edicion) | D=4 Estado (Activo/Inactivo) | E=5 FechaAgregado

// ============================================================
// doGet
// ============================================================
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Normas de Seguridad de la Información — ISO 27001:2022')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// SETUP — Ejecutar una sola vez para preparar el Spreadsheet
// ============================================================
function setupHojaClausulas() {
  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_CLAUSULAS);
  if (!hoja) { Logger.log('Hoja no encontrada'); return; }

  var maxCol  = hoja.getLastColumn();
  var headers = maxCol > 0 ? hoja.getRange(1, 1, 1, Math.max(maxCol, 13)).getValues()[0] : [];
  var nuevos  = [
    { col: 8,  nombre: 'Normas_Relacionadas' },
    { col: 9,  nombre: 'Documentos_Modelo' },
    { col: 10, nombre: 'Recomendaciones_Auditoria' },
    { col: 11, nombre: 'Hallazgos' },
    { col: 12, nombre: 'Plan_Accion' },
    { col: 13, nombre: 'Fecha_Revision' }
  ];
  nuevos.forEach(function(n) {
    if (!headers[n.col - 1]) hoja.getRange(1, n.col).setValue(n.nombre);
  });
  Logger.log('Setup clausulas completado.');
}

function setupHojaUsuarios() {
  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_USUARIOS);
  if (hoja) { Logger.log('La hoja Usuarios ya existe.'); return; }

  hoja = ss.insertSheet(HOJA_USUARIOS);
  hoja.getRange(1, 1, 1, 5).setValues([['Email', 'Nombre', 'Permiso', 'Estado', 'FechaAgregado']]);
  hoja.setFrozenRows(1);

  var hr = hoja.getRange(1, 1, 1, 5);
  hr.setBackground('#0f2744');
  hr.setFontColor('#ffffff');
  hr.setFontWeight('bold');

  hoja.setColumnWidth(1, 220);
  hoja.setColumnWidth(2, 180);
  hoja.setColumnWidth(3, 100);
  hoja.setColumnWidth(4, 100);
  hoja.setColumnWidth(5, 120);

  Logger.log('Hoja Usuarios creada correctamente.');
}

// ============================================================
// USUARIOS — Verificacion de acceso
// ============================================================
function getUsuarioActual() {
  var email = Session.getActiveUser().getEmail();
  if (!email) return JSON.stringify(null);

  var ownerEmail = Session.getEffectiveUser().getEmail();
  if (email.toLowerCase() === ownerEmail.toLowerCase()) {
    return JSON.stringify({ email: email, nombre: 'Administrador', permiso: 'Admin' });
  }

  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_USUARIOS);
  if (!hoja) return JSON.stringify(null);

  var data = hoja.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (r[0] && String(r[0]).toLowerCase() === email.toLowerCase() && String(r[3]) === 'Activo') {
      return JSON.stringify({
        email:   String(r[0]),
        nombre:  String(r[1]),
        permiso: String(r[2])
      });
    }
  }

  return JSON.stringify(null);
}

// ============================================================
// USUARIOS — CRUD
// ============================================================
function getUsuarios() {
  if (!esAdmin_()) return JSON.stringify({ ok: false, msg: 'Sin permisos de administrador' });

  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_USUARIOS);
  if (!hoja) return JSON.stringify({ ok: true, usuarios: [] });

  var data   = hoja.getDataRange().getValues();
  var lista  = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[0]) continue;
    lista.push({
      email:         String(r[0] || ''),
      nombre:        String(r[1] || ''),
      permiso:       String(r[2] || 'Lectura'),
      estado:        String(r[3] || 'Activo'),
      fechaAgregado: String(r[4] || '')
    });
  }
  return JSON.stringify({ ok: true, usuarios: lista });
}

function agregarUsuario(email, nombre, permiso) {
  if (!esAdmin_()) return JSON.stringify({ ok: false, msg: 'Solo el administrador puede agregar usuarios' });

  email   = String(email).trim().toLowerCase();
  nombre  = String(nombre).trim();
  permiso = (permiso === 'Edicion') ? 'Edicion' : 'Lectura';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return JSON.stringify({ ok: false, msg: 'Email invalido' });
  }
  if (!nombre) {
    return JSON.stringify({ ok: false, msg: 'El nombre es requerido' });
  }

  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_USUARIOS);
  if (!hoja) return JSON.stringify({ ok: false, msg: 'Hoja Usuarios no existe. Ejecuta setupHojaUsuarios() primero.' });

  var data = hoja.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && String(data[i][0]).toLowerCase() === email) {
      return JSON.stringify({ ok: false, msg: 'Este email ya existe en la lista' });
    }
  }

  var fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  hoja.appendRow([email, nombre, permiso, 'Activo', fecha]);
  SpreadsheetApp.flush();

  try {
    enviarEmailAcceso_({ email: email, nombre: nombre, permiso: permiso });
  } catch(e) {
    return JSON.stringify({ ok: true, msg: 'Usuario agregado. No se pudo enviar el email: ' + e.message });
  }

  return JSON.stringify({ ok: true });
}

function actualizarUsuario(email, campo, valor) {
  if (!esAdmin_()) return JSON.stringify({ ok: false, msg: 'Sin permisos' });

  var colMap = { nombre: 2, permiso: 3, estado: 4 };
  var col    = colMap[campo];
  if (!col) return JSON.stringify({ ok: false, msg: 'Campo invalido' });

  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_USUARIOS);
  if (!hoja) return JSON.stringify({ ok: false, msg: 'Hoja no encontrada' });

  var data = hoja.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && String(data[i][0]).toLowerCase() === String(email).toLowerCase()) {
      hoja.getRange(i + 1, col).setValue(valor);
      SpreadsheetApp.flush();
      return JSON.stringify({ ok: true });
    }
  }
  return JSON.stringify({ ok: false, msg: 'Usuario no encontrado' });
}

function eliminarUsuario(email) {
  if (!esAdmin_()) return JSON.stringify({ ok: false, msg: 'Sin permisos' });

  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_USUARIOS);
  if (!hoja) return JSON.stringify({ ok: false, msg: 'Hoja no encontrada' });

  var data = hoja.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && String(data[i][0]).toLowerCase() === String(email).toLowerCase()) {
      hoja.deleteRow(i + 1);
      SpreadsheetApp.flush();
      return JSON.stringify({ ok: true });
    }
  }
  return JSON.stringify({ ok: false, msg: 'Usuario no encontrado' });
}

function reenviarInvitacion(email) {
  if (!esAdmin_()) return JSON.stringify({ ok: false, msg: 'Sin permisos' });


  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_USUARIOS);
  if (!hoja) return JSON.stringify({ ok: false, msg: 'Hoja no encontrada' });

  var data = hoja.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && String(data[i][0]).toLowerCase() === String(email).toLowerCase()) {
      try {
        enviarEmailAcceso_({
          email:   String(data[i][0]),
          nombre:  String(data[i][1]),
          permiso: String(data[i][2])
        });
        return JSON.stringify({ ok: true });
      } catch(e) {
        return JSON.stringify({ ok: false, msg: e.message });
      }
    }
  }
  return JSON.stringify({ ok: false, msg: 'Usuario no encontrado' });
}

// ============================================================
// EMAIL
// ============================================================
function enviarEmailAcceso_(usuario) {
  var url          = ScriptApp.getService().getUrl();
  var permisoTexto = usuario.permiso === 'Edicion' ? 'Edicion' : 'Lectura';
  var permisoBadge = usuario.permiso === 'Edicion'
    ? '<span style="background:#dbeafe;color:#1d4ed8;padding:3px 10px;border-radius:20px;font-size:13px;font-weight:600">Edicion</span>'
    : '<span style="background:#f1f5f9;color:#475569;padding:3px 10px;border-radius:20px;font-size:13px;font-weight:600">Lectura</span>';

  var bodyText =
    'Hola ' + usuario.nombre + ',\n\n' +
    'Se te agregó al sistema de Normas de Seguridad de la Información (ISO 27001:2022).\n' +
    'Permiso: ' + permisoTexto + '\n' +
    'Cuenta: ' + usuario.email + '\n\n' +
    'Accedé en: ' + url + '\n\n' +
    '---\nNBCH — Ciberseguridad y Cumplimiento Normativo';

  var htmlBody =
    '<div style="font-family:Segoe UI,Arial,sans-serif;max-width:500px;margin:0 auto">' +
      '<div style="background:#0f2744;padding:18px 24px;border-radius:8px 8px 0 0">' +
        '<span style="color:#fff;font-size:15px;font-weight:700">Normas de <span style="color:#60a5fa">Seguridad SI</span></span>' +
      '</div>' +
      '<div style="background:#fff;padding:24px 28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">' +
        '<p style="font-size:15px;color:#1a2332;margin:0 0 14px">Hola <strong>' + usuario.nombre + '</strong>,</p>' +
        '<p style="color:#334155;line-height:1.6;margin:0 0 20px">Se te ha agregado al sistema de gestión de <strong>Normas de Seguridad de la Información — ISO 27001:2022</strong>.</p>' +
        '<div style="background:#f8fafc;border-radius:7px;padding:14px 18px;margin-bottom:22px">' +
          '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#64748b;margin-bottom:8px">Permiso asignado</div>' +
          permisoBadge +
          '<div style="font-size:12px;color:#94a3b8;margin-top:10px">Cuenta de acceso: ' + usuario.email + '</div>' +
        '</div>' +
        '<a href="' + url + '" style="display:inline-block;background:#0f2744;color:#fff;padding:10px 24px;border-radius:7px;text-decoration:none;font-weight:600;font-size:14px">Ir al sistema</a>' +
        '<hr style="margin:22px 0;border:none;border-top:1px solid #f1f5f9">' +
        '<p style="font-size:12px;color:#94a3b8;margin:0">NBCH — Ciberseguridad y Cumplimiento Normativo</p>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to:       usuario.email,
    subject:  'Acceso — Sistema de Normas de Seguridad SI (ISO 27001:2022)',
    body:     bodyText,
    htmlBody: htmlBody
  });
}

// ============================================================
// CLAUSULAS
// ============================================================
function getArbolClausulas() {
  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_CLAUSULAS);
  if (!hoja) return JSON.stringify([]);

  var data = hoja.getDataRange().getValues();
  if (data.length < 2) return JSON.stringify([]);

  var items = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[0]) continue;
    items.push({
      id:                       String(r[0]  || ''),
      nivel:                    Number(r[1]  || 1),
      titulo:                   String(r[2]  || ''),
      descripcion:              String(r[3]  || ''),
      requisitos:               String(r[4]  || ''),
      evidencia:                String(r[5]  || ''),
      ejemplosPracticos:        String(r[6]  || ''),
      normasRelacionadas:       String(r[7]  || ''),
      documentosModelo:         String(r[8]  || ''),
      recomendacionesAuditoria: String(r[9]  || ''),
      hallazgos:                String(r[10] || ''),
      planAccion:               String(r[11] || ''),
      fechaRevision:            String(r[12] || ''),
      fila:                     i + 1
    });
  }
  return JSON.stringify(items);
}

// ============================================================
// CONTROLES A
// ============================================================
function getControlesA() {
  var ss   = SpreadsheetApp.openById(SS_ID);
  var hoja = ss.getSheetByName(HOJA_CONTROLES);
  if (!hoja) return JSON.stringify([]);

  var data = hoja.getDataRange().getValues();
  if (data.length < 2) return JSON.stringify([]);

  var controles = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[0]) continue;
    controles.push({
      id:            String(r[0] || ''),
      dominio:       String(r[1] || ''),
      nombreDominio: String(r[2] || ''),
      nombre:        String(r[3] || ''),
      proposito:     String(r[4] || ''),
      atributos:     String(r[5] || ''),
      estado:        String(r[6] || ''),
      responsable:   String(r[7] || ''),
      evidencia:     String(r[8] || ''),
      obs:           String(r[9] || ''),
      fila:          i + 1
    });
  }
  return JSON.stringify(controles);
}

// ============================================================
// actualizarItem — Escribe un campo en el Spreadsheet
// ============================================================
function actualizarItem(hoja, fila, campo, valor) {
  var ss = SpreadsheetApp.openById(SS_ID);
  var sh, colMap;

  if (hoja === 'clausulas') {
    sh     = ss.getSheetByName(HOJA_CLAUSULAS);
    colMap = {
      descripcion:              4,
      requisitos:               5,
      evidencia:                6,
      ejemplosPracticos:        7,
      normasRelacionadas:       8,
      documentosModelo:         9,
      recomendacionesAuditoria: 10,
      hallazgos:                11,
      planAccion:               12,
      fechaRevision:            13
    };
  } else if (hoja === 'controles') {
    sh     = ss.getSheetByName(HOJA_CONTROLES);
    colMap = { estado: 7, responsable: 8, evidencia: 9, obs: 10 };
  } else {
    return JSON.stringify({ ok: false, msg: 'Hoja invalida' });
  }

  if (!sh) return JSON.stringify({ ok: false, msg: 'Hoja no encontrada' });

  var col = colMap[campo];
  if (!col) return JSON.stringify({ ok: false, msg: 'Campo invalido: ' + campo });

  try {
    sh.getRange(fila, col).setValue(valor);
    SpreadsheetApp.flush();
    return JSON.stringify({ ok: true });
  } catch(e) {
    return JSON.stringify({ ok: false, msg: e.message });
  }
}

// ============================================================
// DASHBOARD
// ============================================================
function getDashboard27001() {
  var ss     = SpreadsheetApp.openById(SS_ID);
  var shClau = ss.getSheetByName(HOJA_CLAUSULAS);
  var shCtrl = ss.getSheetByName(HOJA_CONTROLES);

  var result = {
    clausulas: { total: 0, conEvidencia: 0, conHallazgos: 0, conPlan: 0, conRecomendaciones: 0 },
    controles: { total: 0, conforme: 0, enProceso: 0, noConforme: 0, noAplica: 0, sinEstado: 0, pct: 0 },
    porDominio: {}
  };

  if (shClau) {
    var dc = shClau.getDataRange().getValues();
    for (var i = 1; i < dc.length; i++) {
      var r = dc[i];
      if (!r[0]) continue;
      result.clausulas.total++;
      if (r[5])  result.clausulas.conEvidencia++;
      if (r[10]) result.clausulas.conHallazgos++;
      if (r[11]) result.clausulas.conPlan++;
      if (r[9])  result.clausulas.conRecomendaciones++;
    }
  }

  if (shCtrl) {
    var dct = shCtrl.getDataRange().getValues();
    for (var j = 1; j < dct.length; j++) {
      var rc = dct[j];
      if (!rc[0]) continue;
      result.controles.total++;
      var est = String(rc[6] || '');
      var dom = String(rc[2] || '');
      if (!result.porDominio[dom]) {
        result.porDominio[dom] = { total: 0, conforme: 0, enProceso: 0, noConforme: 0, noAplica: 0 };
      }
      result.porDominio[dom].total++;
      if      (est === 'Conforme')    { result.controles.conforme++;   result.porDominio[dom].conforme++;   }
      else if (est === 'En proceso')  { result.controles.enProceso++;  result.porDominio[dom].enProceso++;  }
      else if (est === 'No conforme') { result.controles.noConforme++; result.porDominio[dom].noConforme++; }
      else if (est === 'No aplica')   { result.controles.noAplica++;   result.porDominio[dom].noAplica++;   }
      else                            { result.controles.sinEstado++;                                        }
    }
    var activos = result.controles.total - result.controles.noAplica;
    result.controles.pct = activos > 0 ? Math.round(result.controles.conforme * 100 / activos) : 0;
  }

  return JSON.stringify(result);
}

// ============================================================
// HELPERS INTERNOS
// ============================================================
function esAdmin_() {
  var email      = Session.getActiveUser().getEmail();
  var ownerEmail = Session.getEffectiveUser().getEmail();
  return email && email.toLowerCase() === ownerEmail.toLowerCase();
}
