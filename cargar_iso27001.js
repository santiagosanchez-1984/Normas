// ============================================================
// cargar_iso27001.js — Carga datos ISO 27001:2022 al Spreadsheet
// Ejecutar desde: C:\Users\SantiagoSanchez\claude-sheets\Normas\
// Comando: node cargar_iso27001.js
// ============================================================

const { google } = require('googleapis');
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

// Auth — usa paths absolutos para no depender del CWD
const CREDS_PATH = path.join(__dirname, '..', 'credentials.json');
const TOKEN_PATH = path.join(__dirname, '..', 'token.json');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive'
];

async function authenticate() {
  const credentials = JSON.parse(fs.readFileSync(CREDS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    oAuth2Client.on('tokens', (tokens) => {
      const current = JSON.parse(fs.readFileSync(TOKEN_PATH));
      fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...current, ...tokens }));
    });
    return oAuth2Client;
  }

  // Flujo interactivo si no hay token
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('\nAbrí esta URL en el navegador:\n', authUrl);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => { rl.question('\nPegá el código de autorización: ', resolve); });
  rl.close();
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('Token guardado en token.json');
  return oAuth2Client;
}

const SPREADSHEET_ID = '1nh4BIZyFYCoUiiz8FxZILUm8Wv4NPB2M3FDiA37JdnA';
const HOJA_CLAUSULAS  = '27001_Clausulas';
const HOJA_CONTROLES  = '27001_ControlesA';

// ============================================================
// DATOS: 27001_Clausulas
// Columnas: ID_Clausula | Nivel | Titulo | Descripcion | Requisitos | Estado | Responsable | Observaciones
// ============================================================

const CLAUSULAS = [
  // ---- Nivel 1 ----
  ['0',   1, 'Introducción',
   'La norma ISO/IEC 27001:2022 especifica los requisitos para establecer, implementar, mantener y mejorar continuamente un sistema de gestión de seguridad de la información (SGSI).',
   'No contiene requisitos normativos (SHALL). Provee contexto y orientación sobre el propósito y estructura de la norma.',
   '', '', ''],

  ['1',   1, 'Objeto y campo de aplicación',
   'Esta norma especifica los requisitos para establecer, implementar, mantener y mejorar continuamente un SGSI en el contexto de la organización.',
   'La norma es aplicable a cualquier tipo de organización, independientemente de su naturaleza, tamaño o sector. Los requisitos son genéricos y aplicables a todas las organizaciones.',
   '', '', ''],

  ['2',   1, 'Referencias normativas',
   'Los documentos indicados a continuación son indispensables para la aplicación de este documento. Para las referencias con fecha, solo se aplica la edición citada.',
   'ISO/IEC 27000 es referencia normativa indispensable. La organización debe tener acceso a la edición vigente de la misma.',
   '', '', ''],

  ['3',   1, 'Términos y definiciones',
   'Para los fines de este documento, se aplican los términos y definiciones que figuran en la norma ISO/IEC 27000.',
   'Los términos y definiciones de ISO/IEC 27000 son de aplicación obligatoria en el contexto de esta norma.',
   '', '', ''],

  ['4',   1, 'Contexto de la organización',
   'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su SGSI.',
   'La organización debe determinar el contexto interno y externo, las partes interesadas y sus requisitos, el alcance del SGSI, y establecer y mantener el SGSI.',
   '', '', ''],

  ['5',   1, 'Liderazgo',
   'La alta dirección debe demostrar liderazgo y compromiso con respecto al sistema de gestión de seguridad de la información.',
   'La alta dirección debe establecer la política de seguridad, asignar roles y responsabilidades, y asegurar la integración de los requisitos del SGSI en los procesos de la organización.',
   '', '', ''],

  ['6',   1, 'Planificación',
   'La organización debe planificar las acciones para tratar los riesgos y oportunidades, establecer objetivos de seguridad de la información y planificar los cambios al SGSI.',
   'La organización debe realizar la apreciación y el tratamiento de riesgos, establecer objetivos medibles de seguridad de la información y planificar cómo lograrlos.',
   '', '', ''],

  ['7',   1, 'Apoyo',
   'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del SGSI.',
   'La organización debe proporcionar recursos, asegurar competencia del personal, crear concienciación, establecer comunicaciones y controlar la información documentada.',
   '', '', ''],

  ['8',   1, 'Operación',
   'La organización debe planificar, implementar y controlar los procesos necesarios para cumplir los requisitos de seguridad de la información y llevar a cabo el tratamiento de riesgos.',
   'La organización debe planificar y controlar los procesos operacionales, llevar a cabo la apreciación y el tratamiento de los riesgos de seguridad de la información.',
   '', '', ''],

  ['9',   1, 'Evaluación del desempeño',
   'La organización debe evaluar el desempeño de la seguridad de la información y la eficacia del sistema de gestión de seguridad de la información.',
   'La organización debe realizar seguimiento, medición, análisis y evaluación, auditorías internas y revisiones por la dirección del SGSI.',
   '', '', ''],

  ['10',  1, 'Mejora',
   'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia del sistema de gestión de seguridad de la información.',
   'La organización debe tratar las no conformidades y tomar acciones correctivas, y mejorar continuamente el SGSI.',
   '', '', ''],

  // ---- Nivel 2 ----
  ['4.1', 2, 'Comprensión de la organización y su contexto',
   'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su SGSI.',
   'La organización debe determinar las cuestiones externas e internas que son relevantes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su SGSI. Nota: La determinación de estas cuestiones se refiere al establecimiento del contexto externo e interno de la organización considerado en la cláusula 5.4.1 de ISO 31000.',
   '', '', ''],

  ['4.2', 2, 'Comprensión de las necesidades y expectativas de las partes interesadas',
   'La organización debe determinar las partes interesadas que son relevantes para el SGSI y los requisitos de estas partes interesadas relevantes para la seguridad de la información.',
   'La organización debe determinar: a) las partes interesadas que son relevantes para el sistema de gestión de seguridad de la información; b) los requisitos pertinentes de estas partes interesadas para la seguridad de la información; c) cuáles de estos requisitos se abordarán a través del SGSI.',
   '', '', ''],

  ['4.3', 2, 'Determinación del alcance del sistema de gestión de seguridad de la información',
   'La organización debe determinar los límites y la aplicabilidad del sistema de gestión de seguridad de la información para establecer su alcance.',
   'Al determinar el alcance, la organización debe considerar: a) las cuestiones externas e internas referidas en 4.1; b) los requisitos referidos en 4.2; c) las interfaces y dependencias entre las actividades realizadas por la organización y las que realizan otras organizaciones. El alcance debe estar disponible como información documentada.',
   '', '', ''],

  ['4.4', 2, 'Sistema de gestión de seguridad de la información',
   'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de seguridad de la información, incluidos los procesos necesarios y sus interacciones.',
   'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de seguridad de la información, de acuerdo con los requisitos de este documento.',
   '', '', ''],

  ['5.1', 2, 'Liderazgo y compromiso',
   'La alta dirección debe demostrar liderazgo y compromiso con respecto al sistema de gestión de seguridad de la información.',
   'La alta dirección debe: a) asegurar que se establecen la política y los objetivos de seguridad de la información compatibles con la dirección estratégica de la organización; b) asegurar la integración de los requisitos del SGSI en los procesos de la organización; c) asegurar que los recursos necesarios para el SGSI estén disponibles; d) comunicar la importancia de una gestión de la seguridad de la información eficaz; e) asegurar que el SGSI logre los resultados previstos; f) dirigir y apoyar a las personas para contribuir a la eficacia del SGSI; g) promover la mejora continua; h) apoyar otros roles de gestión relevantes para demostrar su liderazgo.',
   '', '', ''],

  ['5.2', 2, 'Política',
   'La alta dirección debe establecer una política de seguridad de la información.',
   'La alta dirección debe establecer una política de seguridad de la información que: a) sea adecuada al propósito de la organización; b) incluya objetivos de seguridad de la información o proporcione el marco para establecerlos; c) incluya un compromiso de cumplir los requisitos aplicables relacionados con la seguridad de la información; d) incluya un compromiso de mejora continua del SGSI. La política de seguridad de la información debe: estar disponible como información documentada; comunicarse dentro de la organización; estar disponible para las partes interesadas cuando sea apropiado.',
   '', '', ''],

  ['5.3', 2, 'Roles, responsabilidades y autoridades en la organización',
   'La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles relevantes para la seguridad de la información se asignen y comuniquen.',
   'La alta dirección debe asignar la responsabilidad y autoridad para: a) asegurar que el SGSI es conforme con los requisitos de este documento; b) informar a la alta dirección sobre el desempeño del SGSI.',
   '', '', ''],

  ['6.1', 2, 'Acciones para tratar riesgos y oportunidades',
   'Al planificar el sistema de gestión de seguridad de la información, la organización debe considerar las cuestiones de 4.1 y los requisitos de 4.2, y determinar los riesgos y oportunidades que es necesario tratar.',
   'La organización debe planificar acciones para tratar estos riesgos y oportunidades, e integrar e implementar estas acciones en los procesos del SGSI, y evaluar la eficacia de estas acciones. Véase subcláusulas 6.1.1, 6.1.2 y 6.1.3 para requisitos detallados.',
   '', '', ''],

  ['6.2', 2, 'Objetivos de seguridad de la información y planificación para lograrlos',
   'La organización debe establecer objetivos de seguridad de la información para las funciones y niveles pertinentes.',
   'Los objetivos de seguridad de la información deben: a) ser coherentes con la política de seguridad de la información; b) ser medibles (si es factible); c) tener en cuenta los requisitos de seguridad de la información aplicables y los resultados de la apreciación y el tratamiento de riesgos; d) ser objeto de seguimiento; e) comunicarse; f) actualizarse según sea apropiado; g) estar disponibles como información documentada. La organización debe determinar qué se hará, qué recursos se requerirán, quién será responsable, cuándo se completará y cómo se evaluarán los resultados.',
   '', '', ''],

  ['6.3', 2, 'Planificación de los cambios',
   'Cuando la organización determine la necesidad de cambios en el SGSI, los cambios deben llevarse a cabo de manera planificada.',
   'La organización debe determinar la necesidad de cambios en el SGSI y asegurarse de que dichos cambios se lleven a cabo de manera planificada, considerando el propósito de los cambios y sus consecuencias potenciales, la integridad continua del SGSI, la disponibilidad de recursos y la asignación o reasignación de responsabilidades y autoridades.',
   '', '', ''],

  ['7.1', 2, 'Recursos',
   'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de seguridad de la información.',
   'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del SGSI.',
   '', '', ''],

  ['7.2', 2, 'Competencia',
   'La organización debe determinar la competencia necesaria de las personas que realizan trabajos bajo su control que afecten al desempeño de la seguridad de la información.',
   'La organización debe: a) determinar la competencia necesaria de las personas; b) asegurarse de que estas personas sean competentes, basándose en la educación, formación o experiencia apropiadas; c) cuando sea aplicable, tomar acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones tomadas; d) conservar información documentada apropiada como evidencia de la competencia.',
   '', '', ''],

  ['7.3', 2, 'Concienciación',
   'Las personas que realizan trabajos bajo el control de la organización deben tomar conciencia de la política de seguridad de la información, su contribución a la eficacia del SGSI y las implicaciones de no cumplir los requisitos del SGSI.',
   'Las personas que trabajan bajo el control de la organización deben ser conscientes de: a) la política de seguridad de la información; b) su contribución a la eficacia del SGSI, incluidos los beneficios de una mayor seguridad de la información; c) las implicaciones de no cumplir los requisitos del SGSI.',
   '', '', ''],

  ['7.4', 2, 'Comunicación',
   'La organización debe determinar la necesidad de comunicaciones internas y externas pertinentes al sistema de gestión de seguridad de la información.',
   'La organización debe determinar: a) sobre qué comunicar; b) cuándo comunicar; c) a quién comunicar; d) cómo comunicar; e) quién debe comunicar, en relación a la seguridad de la información y al SGSI.',
   '', '', ''],

  ['7.5', 2, 'Información documentada',
   'El sistema de gestión de seguridad de la información de la organización debe incluir la información documentada requerida por este documento y la determinada por la organización como necesaria para la eficacia del SGSI.',
   'La organización debe controlar la información documentada requerida para el SGSI. Véase subcláusulas 7.5.1, 7.5.2 y 7.5.3 para requisitos de creación, actualización y control.',
   '', '', ''],

  ['8.1', 2, 'Planificación y control operacional',
   'La organización debe planificar, implementar, controlar, hacer seguimiento y revisar los procesos necesarios para cumplir los requisitos de seguridad de la información.',
   'La organización debe planificar, implementar y controlar los procesos necesarios para cumplir los requisitos de seguridad de la información y para implementar las acciones determinadas en la cláusula 6. La organización también debe implementar los planes para lograr los objetivos de seguridad de la información y controlar los cambios planificados y revisar las consecuencias de los cambios no previstos, tomando acciones para mitigar los efectos adversos cuando sea necesario. La organización debe asegurarse de que los procesos externalizados se determinan y controlan.',
   '', '', ''],

  ['8.2', 2, 'Apreciación de los riesgos de seguridad de la información',
   'La organización debe realizar apreciaciones de los riesgos de seguridad de la información a intervalos planificados o cuando se propongan u ocurran cambios significativos.',
   'La organización debe realizar apreciaciones de los riesgos de seguridad de la información a intervalos planificados o cuando se propongan u ocurran cambios significativos, teniendo en cuenta los criterios establecidos en 6.1.2 a). La organización debe conservar información documentada de los resultados de la apreciación de los riesgos de seguridad de la información.',
   '', '', ''],

  ['8.3', 2, 'Tratamiento de los riesgos de seguridad de la información',
   'La organización debe implementar el plan de tratamiento de los riesgos de seguridad de la información.',
   'La organización debe implementar el plan de tratamiento de los riesgos de seguridad de la información y conservar información documentada de los resultados del tratamiento de los riesgos de seguridad de la información.',
   '', '', ''],

  ['9.1', 2, 'Seguimiento, medición, análisis y evaluación',
   'La organización debe evaluar el desempeño de la seguridad de la información y la eficacia del sistema de gestión de seguridad de la información.',
   'La organización debe determinar: a) qué necesita seguimiento y medición, incluyendo los procesos y controles de seguridad de la información; b) los métodos de seguimiento, medición, análisis y evaluación aplicables para asegurar resultados válidos; c) cuándo se llevarán a cabo el seguimiento y la medición; d) quién realizará el seguimiento y la medición; e) cuándo se analizarán y evaluarán los resultados del seguimiento y la medición; f) quién analizará y evaluará estos resultados. La organización debe conservar información documentada apropiada como evidencia de los resultados.',
   '', '', ''],

  ['9.2', 2, 'Auditoría interna',
   'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información acerca de si el sistema de gestión de seguridad de la información es conforme con los requisitos y se implementa y mantiene eficazmente.',
   'Véase subcláusulas 9.2.1 y 9.2.2 para los requisitos detallados sobre generalidades del programa de auditoría interna.',
   '', '', ''],

  ['9.3', 2, 'Revisión por la dirección',
   'La alta dirección debe revisar el sistema de gestión de seguridad de la información de la organización a intervalos planificados para asegurarse de su conveniencia, adecuación y eficacia continuas.',
   'Véase subcláusulas 9.3.1, 9.3.2 y 9.3.3 para los requisitos detallados sobre generalidades, entradas y resultados de la revisión por la dirección.',
   '', '', ''],

  ['10.1', 2, 'Mejora continua',
   'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia del sistema de gestión de seguridad de la información.',
   'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia del SGSI.',
   '', '', ''],

  ['10.2', 2, 'No conformidad y acción correctiva',
   'Cuando ocurra una no conformidad, la organización debe reaccionar ante la no conformidad, tomar acciones para controlarla y corregirla, y hacer frente a sus consecuencias.',
   'Cuando ocurra una no conformidad, la organización debe: a) reaccionar ante la no conformidad y, cuando sea aplicable, tomar acciones para controlarla y corregirla, y hacer frente a sus consecuencias; b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad; c) implementar las acciones necesarias; d) revisar la eficacia de las acciones correctivas tomadas; e) hacer cambios en el SGSI si fuera necesario. Las acciones correctivas deben ser apropiadas a los efectos de las no conformidades encontradas. La organización debe conservar información documentada como evidencia.',
   '', '', ''],

  // ---- Nivel 3 ----
  ['6.1.1', 3, 'Generalidades',
   'Al planificar el SGSI, la organización debe considerar las cuestiones de 4.1 y los requisitos de 4.2 y determinar los riesgos y oportunidades que es necesario tratar para asegurar que el SGSI pueda lograr los resultados previstos, prevenir o reducir efectos indeseados y lograr la mejora continua.',
   'La organización debe planificar acciones para tratar estos riesgos y oportunidades, e integrar e implementar las acciones en sus procesos del SGSI y evaluar la eficacia de estas acciones.',
   '', '', ''],

  ['6.1.2', 3, 'Apreciación de los riesgos de seguridad de la información',
   'La organización debe definir y aplicar un proceso de apreciación de los riesgos de seguridad de la información que establezca y mantenga criterios de riesgo.',
   'La organización debe: a) establecer y mantener criterios de riesgo de seguridad de la información que incluyan los criterios de aceptación del riesgo y los criterios para realizar las apreciaciones de riesgos de seguridad de la información; b) asegurarse de que las sucesivas apreciaciones de riesgos de seguridad de la información produzcan resultados coherentes, válidos y comparables; c) identificar los riesgos de seguridad de la información; d) analizar los riesgos de seguridad de la información; e) evaluar los riesgos de seguridad de la información. La organización debe conservar información documentada sobre el proceso de apreciación de riesgos.',
   '', '', ''],

  ['6.1.3', 3, 'Tratamiento de los riesgos de seguridad de la información',
   'La organización debe definir y aplicar un proceso de tratamiento de los riesgos de seguridad de la información para seleccionar las opciones apropiadas de tratamiento del riesgo.',
   'La organización debe: a) seleccionar las opciones apropiadas de tratamiento del riesgo de seguridad de la información, teniendo en cuenta los resultados de la apreciación del riesgo; b) determinar todos los controles que sean necesarios para implementar las opciones de tratamiento del riesgo de seguridad de la información elegidas; c) comparar los controles determinados con los del Anexo A y verificar que no se han omitido controles necesarios; d) elaborar una declaración de aplicabilidad; e) elaborar un plan de tratamiento de los riesgos de seguridad de la información; f) obtener la aprobación de los propietarios del riesgo del plan de tratamiento de los riesgos y la aceptación de los riesgos residuales. La organización debe conservar información documentada sobre el proceso de tratamiento de riesgos.',
   '', '', ''],

  ['7.5.1', 3, 'Generalidades',
   'El sistema de gestión de seguridad de la información de la organización debe incluir la información documentada requerida por esta norma y la determinada por la organización como necesaria para la eficacia del SGSI.',
   'Al crear y actualizar la información documentada, la organización debe asegurar que sea apropiada de acuerdo con su naturaleza y complejidad, y la eficacia del SGSI.',
   '', '', ''],

  ['7.5.2', 3, 'Creación y actualización',
   'Al crear y actualizar la información documentada, la organización debe asegurarse de que la identificación y descripción, el formato y los medios de soporte sean apropiados.',
   'La organización debe asegurarse de que al crear y actualizar la información documentada sea apropiada la: a) identificación y descripción (por ejemplo, título, fecha, autor o número de referencia); b) formato (por ejemplo, idioma, versión del software, gráficos) y sus medios de soporte (por ejemplo, papel, electrónico); c) revisión y aprobación con respecto a la conveniencia y adecuación.',
   '', '', ''],

  ['7.5.3', 3, 'Control de la información documentada',
   'La información documentada requerida por el sistema de gestión de seguridad de la información y por esta norma debe controlarse para asegurarse de que esté disponible y sea idónea para su uso, donde y cuando se necesite, y esté protegida adecuadamente.',
   'Para el control de la información documentada, la organización debe abordar las siguientes actividades, según corresponda: a) distribución, acceso, recuperación y uso; b) almacenamiento y preservación, incluida la preservación de la legibilidad; c) control de cambios (por ejemplo, control de versión); d) conservación y disposición. La información documentada de origen externo que la organización ha determinado como necesaria para la planificación y operación del SGSI debe identificarse, según sea apropiado, y controlarse.',
   '', '', ''],

  ['9.2.1', 3, 'Generalidades',
   'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información acerca de si el SGSI es conforme con los requisitos propios y con los de esta norma, y se implementa y mantiene eficazmente.',
   'La organización debe: a) planificar, establecer, implementar y mantener uno o varios programas de auditoría que incluyan la frecuencia, los métodos, las responsabilidades, los requisitos de planificación y la elaboración de informes; b) definir los criterios de auditoría y el alcance para cada auditoría; c) seleccionar los auditores y llevar a cabo auditorías para asegurarse de la objetividad e imparcialidad del proceso de auditoría; d) asegurarse de que los resultados de las auditorías se informen a la dirección pertinente; e) conservar información documentada como evidencia de los programas de auditoría y de los resultados de la auditoría.',
   '', '', ''],

  ['9.2.2', 3, 'Programa de auditoría interna',
   'La organización debe planificar, establecer, implementar y mantener uno o varios programas de auditoría.',
   'Al establecer los programas de auditoría interna, la organización debe considerar la importancia de los procesos involucrados y los resultados de las auditorías anteriores. La organización debe: definir los criterios y el alcance de cada auditoría; seleccionar auditores objetivos e imparciales; reportar resultados a la dirección pertinente; conservar registros como evidencia.',
   '', '', ''],

  ['9.3.1', 3, 'Generalidades',
   'La alta dirección debe revisar el sistema de gestión de seguridad de la información de la organización a intervalos planificados para asegurarse de su conveniencia, adecuación y eficacia continuas.',
   'La revisión por la dirección debe incluir la consideración de la información de las entradas de revisión (9.3.2) y debe producir decisiones y acciones relacionadas con los resultados (9.3.3).',
   '', '', ''],

  ['9.3.2', 3, 'Entradas de la revisión por la dirección',
   'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideración de las entradas definidas en esta subcláusula.',
   'La revisión por la dirección debe tener en cuenta: a) el estado de las acciones de las revisiones por la dirección previas; b) los cambios en las cuestiones externas e internas que sean pertinentes para el SGSI; c) cambios en las necesidades y expectativas de las partes interesadas pertinentes para el SGSI; d) retroalimentación sobre el desempeño de la seguridad de la información; e) retroalimentación de las partes interesadas; f) resultados de la apreciación del riesgo y estado del plan de tratamiento del riesgo; g) oportunidades de mejora continua.',
   '', '', ''],

  ['9.3.3', 3, 'Resultados de la revisión por la dirección',
   'Los resultados de la revisión por la dirección deben incluir decisiones relacionadas con las oportunidades de mejora continua y cualquier necesidad de cambios en el sistema de gestión de seguridad de la información.',
   'La organización debe conservar información documentada como evidencia de los resultados de las revisiones por la dirección. Los resultados deben incluir decisiones y acciones relacionadas con oportunidades de mejora continua y necesidades de cambios en el SGSI, incluyendo recursos necesarios.',
   '', '', ''],

  // ---- Anexo A ----
  ['A',    1, 'Anexo A (Normativo): Controles de referencia de seguridad de la información',
   'El Anexo A de la norma ISO/IEC 27001:2022 contiene una lista de 93 controles de referencia de seguridad de la información organizados en cuatro dominios: Controles organizacionales (5), Controles de personas (6), Controles físicos (7) y Controles tecnológicos (8).',
   'La organización debe determinar qué controles son necesarios mediante el proceso de tratamiento de riesgos (6.1.3) y debe elaborar una Declaración de Aplicabilidad que incluya todos los controles del Anexo A, justificando las inclusiones y exclusiones. Los controles del Anexo A son controles de referencia y no una lista exhaustiva.',
   '', '', ''],
];

// ============================================================
// DATOS: 27001_ControlesA
// Columnas: ID_Control | Dominio | NombreDominio | Nombre_Control | Proposito | Atributos | Estado | Responsable | Evidencia | Observaciones
// ============================================================

const CONTROLES_A = [
  // ===== 5 - CONTROLES ORGANIZACIONALES (37) =====
  ['5.1',  '5', 'Controles Organizacionales', 'Políticas para la seguridad de la información',
   'Definir la dirección y el apoyo de la gestión para la seguridad de la información de acuerdo con los requisitos del negocio y las leyes y regulaciones pertinentes.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.2',  '5', 'Controles Organizacionales', 'Roles y responsabilidades de seguridad de la información',
   'Establecer una estructura de responsabilidades claras para proteger los activos de información y ejecutar procesos de seguridad de la información específicos.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.3',  '5', 'Controles Organizacionales', 'Segregación de tareas',
   'Reducir el riesgo de fraude y error asegurando que ningún individuo pueda acceder, modificar o usar activos sin la autorización o detección adecuada.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.4',  '5', 'Controles Organizacionales', 'Responsabilidades de la dirección',
   'Asegurar que la dirección apoye la seguridad de la información dentro de la organización de acuerdo con las políticas y procedimientos establecidos.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.5',  '5', 'Controles Organizacionales', 'Contacto con las autoridades',
   'Asegurar que se transmite la información apropiada cuando ocurre un incidente de seguridad de la información y que se mantienen los contactos pertinentes con las autoridades competentes.',
   'Correctivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.6',  '5', 'Controles Organizacionales', 'Contacto con grupos de interés especial',
   'Asegurar que se transmite la información apropiada sobre seguridad de la información y que los conocimientos de seguridad de la información se intercambian con grupos de interés especial.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.7',  '5', 'Controles Organizacionales', 'Inteligencia sobre amenazas',
   'Proporcionar conciencia sobre el entorno de amenazas de la organización para que se puedan tomar las acciones de mitigación adecuadas.',
   'Preventivo, Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.8',  '5', 'Controles Organizacionales', 'Seguridad de la información en la gestión de proyectos',
   'Asegurar que los riesgos de seguridad de la información asociados con los proyectos y las entregas se identifican y abordan durante la gestión de proyectos.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.9',  '5', 'Controles Organizacionales', 'Inventario de información y otros activos asociados',
   'Identificar los activos de la organización y definir las responsabilidades de protección apropiadas.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.10', '5', 'Controles Organizacionales', 'Uso aceptable de la información y otros activos asociados',
   'Asegurar que la información y otros activos asociados estén adecuadamente protegidos, utilizados y gestionados.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.11', '5', 'Controles Organizacionales', 'Devolución de activos',
   'Proteger los intereses de la organización como parte del proceso de cambio o cese del empleo.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.12', '5', 'Controles Organizacionales', 'Clasificación de la información',
   'Asegurar que la información recibe un nivel adecuado de protección de acuerdo con su importancia para la organización.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.13', '5', 'Controles Organizacionales', 'Etiquetado de la información',
   'Facilitar la comunicación de la clasificación de la información y apoyar la automatización del manejo y el procesamiento de la información.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.14', '5', 'Controles Organizacionales', 'Transferencia de información',
   'Mantener la seguridad de la información transferida dentro de la organización y con cualquier parte interesada externa.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.15', '5', 'Controles Organizacionales', 'Control de acceso',
   'Asegurar el acceso autorizado y prevenir el acceso no autorizado a la información y a otros activos asociados.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.16', '5', 'Controles Organizacionales', 'Gestión de identidades',
   'Permitir la identificación única de las personas y sistemas que acceden a la información y otros activos de la organización, y para permitir la asignación adecuada de derechos de acceso.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.17', '5', 'Controles Organizacionales', 'Información de autenticación',
   'Asegurar la autenticación adecuada de la identidad y prevenir fallos en los procesos de autenticación.',
   'Preventivo | Confidencialidad', '', '', '', ''],
  ['5.18', '5', 'Controles Organizacionales', 'Derechos de acceso',
   'Asegurar que el acceso a la información y otros activos asociados es definido y autorizado de acuerdo con los requisitos del negocio.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.19', '5', 'Controles Organizacionales', 'Seguridad de la información en las relaciones con los proveedores',
   'Mantener el nivel acordado de seguridad de la información en las relaciones con los proveedores.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.20', '5', 'Controles Organizacionales', 'Tratamiento de la seguridad de la información en los acuerdos con proveedores',
   'Mantener el nivel acordado de seguridad de la información y prestación de servicios de acuerdo con los acuerdos con los proveedores.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.21', '5', 'Controles Organizacionales', 'Gestión de la seguridad de la información en la cadena de suministro de las TIC',
   'Mantener el nivel acordado de seguridad de la información en la cadena de suministro de productos y servicios de TIC.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.22', '5', 'Controles Organizacionales', 'Seguimiento, revisión y gestión del cambio de los servicios de proveedores',
   'Mantener el nivel acordado de seguridad de la información y prestación de servicios en línea con los acuerdos con los proveedores.',
   'Preventivo, Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.23', '5', 'Controles Organizacionales', 'Seguridad de la información para el uso de servicios en la nube',
   'Especificar y gestionar la seguridad de la información para el uso de servicios en la nube.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.24', '5', 'Controles Organizacionales', 'Planificación y preparación de la gestión de incidentes de seguridad de la información',
   'Asegurar una respuesta rápida, eficaz, coherente y ordenada a los incidentes de seguridad de la información.',
   'Correctivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.25', '5', 'Controles Organizacionales', 'Evaluación y decisión sobre eventos de seguridad de la información',
   'Asegurar que los eventos de seguridad de la información se evalúan y que se decide si se clasifican como incidentes de seguridad de la información.',
   'Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.26', '5', 'Controles Organizacionales', 'Respuesta a incidentes de seguridad de la información',
   'Asegurar que los incidentes de seguridad de la información se gestionan de manera eficaz y apropiada.',
   'Correctivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.27', '5', 'Controles Organizacionales', 'Aprendizaje de los incidentes de seguridad de la información',
   'Reducir la probabilidad o las consecuencias de futuros incidentes mediante el conocimiento obtenido a partir de incidentes de seguridad de la información.',
   'Correctivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.28', '5', 'Controles Organizacionales', 'Recopilación de evidencias',
   'Asegurar la gestión consistente y eficaz de la evidencia relacionada con incidentes de seguridad de la información a efectos de acciones disciplinarias y legales.',
   'Correctivo, Detectivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.29', '5', 'Controles Organizacionales', 'Seguridad de la información durante las interrupciones',
   'Proteger la información y otros activos asociados durante una interrupción.',
   'Preventivo, Correctivo | Disponibilidad, Integridad', '', '', '', ''],
  ['5.30', '5', 'Controles Organizacionales', 'Preparación de las TIC para la continuidad del negocio',
   'Asegurar la disponibilidad de la información y otros activos asociados de la organización durante la interrupción del negocio.',
   'Preventivo, Correctivo | Disponibilidad', '', '', '', ''],
  ['5.31', '5', 'Controles Organizacionales', 'Requisitos legales, estatutarios, reglamentarios y contractuales',
   'Asegurar el cumplimiento de los requisitos legales, estatutarios, reglamentarios y contractuales relacionados con la seguridad de la información.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.32', '5', 'Controles Organizacionales', 'Derechos de propiedad intelectual',
   'Asegurar el cumplimiento de los requisitos legales, reglamentarios y contractuales relacionados con los derechos de propiedad intelectual y el uso de productos de software propietario.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['5.33', '5', 'Controles Organizacionales', 'Protección de los registros',
   'Asegurar que los registros estén protegidos de la pérdida, destrucción, falsificación, acceso no autorizado y liberación no autorizada.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.34', '5', 'Controles Organizacionales', 'Privacidad y protección de la información de identificación personal',
   'Asegurar el cumplimiento de los requisitos legales, estatutarios, reglamentarios y contractuales relacionados con los aspectos de seguridad de la información referentes a la protección de la información de identificación personal.',
   'Preventivo | Confidencialidad', '', '', '', ''],
  ['5.35', '5', 'Controles Organizacionales', 'Revisión independiente de la seguridad de la información',
   'Asegurar la conveniencia, adecuación y eficacia continuas del enfoque de la organización para gestionar y mejorar la seguridad de la información.',
   'Preventivo, Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.36', '5', 'Controles Organizacionales', 'Cumplimiento de las políticas, normas y estándares de seguridad de la información',
   'Asegurar que la seguridad de la información se implementa y opera de acuerdo con las políticas, normas y estándares de seguridad de la información de la organización.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['5.37', '5', 'Controles Organizacionales', 'Procedimientos de operación documentados',
   'Asegurar el funcionamiento correcto y seguro de los recursos de procesamiento de la información.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],

  // ===== 6 - CONTROLES DE PERSONAS (8) =====
  ['6.1',  '6', 'Controles de Personas', 'Investigación de antecedentes',
   'Asegurar que todos los empleados son elegibles y apropiados para los roles para los que son considerados, de acuerdo con la legislación, regulación y ética aplicables.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['6.2',  '6', 'Controles de Personas', 'Términos y condiciones de contratación',
   'Asegurar que los empleados y contratistas comprenden sus responsabilidades de seguridad de la información tal y como se aplica a su rol.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['6.3',  '6', 'Controles de Personas', 'Concienciación, educación y capacitación en seguridad de la información',
   'Asegurar que los empleados y contratistas son conscientes de y cumplen con sus responsabilidades de seguridad de la información.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['6.4',  '6', 'Controles de Personas', 'Proceso disciplinario',
   'Asegurar que los empleados y otras partes interesadas comprenden las consecuencias de las violaciones de la política de seguridad de la información, para disuadir y gestionar adecuadamente las violaciones.',
   'Preventivo, Correctivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['6.5',  '6', 'Controles de Personas', 'Responsabilidades tras el cese o cambio de empleo',
   'Proteger los intereses de la organización como parte del proceso de cambio o cese del empleo o del contrato.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['6.6',  '6', 'Controles de Personas', 'Acuerdos de confidencialidad o de no divulgación',
   'Mantener la confidencialidad de la información accesible por el personal y las partes externas.',
   'Preventivo | Confidencialidad', '', '', '', ''],
  ['6.7',  '6', 'Controles de Personas', 'Trabajo a distancia',
   'Proteger la información a la que se accede, procesa o almacena fuera de las instalaciones de la organización.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['6.8',  '6', 'Controles de Personas', 'Notificación de eventos de seguridad de la información',
   'Apoyar la detección y notificación oportunas de los eventos de seguridad de la información que puedan identificarse por el personal.',
   'Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],

  // ===== 7 - CONTROLES FÍSICOS (14) =====
  ['7.1',  '7', 'Controles Físicos', 'Perímetros de seguridad física',
   'Prevenir el acceso físico no autorizado, daño e interferencia a la información y otros activos de la organización.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['7.2',  '7', 'Controles Físicos', 'Controles de entrada física',
   'Asegurar que solo el personal autorizado tiene acceso a las instalaciones.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['7.3',  '7', 'Controles Físicos', 'Seguridad de oficinas, despachos e instalaciones',
   'Prevenir el acceso físico no autorizado, daño e interferencia a la información y otros activos de la organización en oficinas, despachos e instalaciones.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['7.4',  '7', 'Controles Físicos', 'Supervisión de la seguridad física',
   'Detectar e impedir el acceso físico no autorizado.',
   'Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['7.5',  '7', 'Controles Físicos', 'Protección contra amenazas físicas y ambientales',
   'Prevenir o reducir las consecuencias de eventos originados por amenazas físicas y ambientales.',
   'Preventivo | Disponibilidad, Integridad', '', '', '', ''],
  ['7.6',  '7', 'Controles Físicos', 'Trabajo en áreas seguras',
   'Proteger la información y otros activos de la organización de los daños y las interferencias causados por las personas que trabajan en áreas seguras.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['7.7',  '7', 'Controles Físicos', 'Escritorio despejado y pantalla despejada',
   'Reducir los riesgos de acceso no autorizado, pérdida y daño a la información en escritorios, pantallas y en otras ubicaciones accesibles durante y fuera de las horas de trabajo normales.',
   'Preventivo | Confidencialidad', '', '', '', ''],
  ['7.8',  '7', 'Controles Físicos', 'Emplazamiento y protección de los equipos',
   'Reducir los riesgos de amenazas físicas y ambientales y de acceso no autorizado a los equipos.',
   'Preventivo | Disponibilidad, Integridad, Confidencialidad', '', '', '', ''],
  ['7.9',  '7', 'Controles Físicos', 'Seguridad de los activos fuera de las instalaciones',
   'Prevenir la pérdida, daño, robo o compromiso de los activos fuera de las instalaciones y la interrupción de las operaciones de la organización.',
   'Preventivo | Disponibilidad, Confidencialidad, Integridad', '', '', '', ''],
  ['7.10', '7', 'Controles Físicos', 'Soportes de almacenamiento',
   'Asegurar que solo se revele, modifique, elimine o destruya información cuando sea apropiado para los soportes de almacenamiento durante su ciclo de vida.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['7.11', '7', 'Controles Físicos', 'Servicios de suministro',
   'Prevenir la pérdida, daño o compromiso de la información y otros activos, o la interrupción de las operaciones de la organización, debidos a fallos y perturbaciones en los servicios de suministro.',
   'Preventivo | Disponibilidad', '', '', '', ''],
  ['7.12', '7', 'Controles Físicos', 'Seguridad del cableado',
   'Prevenir la pérdida, daño o compromiso de la información y otros activos, o la interrupción de las operaciones de la organización relacionadas con el cableado.',
   'Preventivo | Disponibilidad, Confidencialidad, Integridad', '', '', '', ''],
  ['7.13', '7', 'Controles Físicos', 'Mantenimiento de los equipos',
   'Prevenir la pérdida, daño, robo o compromiso de la información y otros activos, y la interrupción de las operaciones de la organización, causados por la falta de mantenimiento.',
   'Preventivo | Disponibilidad', '', '', '', ''],
  ['7.14', '7', 'Controles Físicos', 'Eliminación segura o reutilización de los equipos',
   'Prevenir la fuga de información de los equipos que van a ser eliminados o reutilizados.',
   'Preventivo | Confidencialidad', '', '', '', ''],

  // ===== 8 - CONTROLES TECNOLÓGICOS (34) =====
  ['8.1',  '8', 'Controles Tecnológicos', 'Dispositivos de punto de acceso de usuario',
   'Proteger la información a la que se accede, procesa o almacena en dispositivos de punto de acceso de usuario.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.2',  '8', 'Controles Tecnológicos', 'Derechos de acceso privilegiado',
   'Asegurar que solo los usuarios, componentes de software y servicios autorizados cuenten con derechos de acceso privilegiado.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.3',  '8', 'Controles Tecnológicos', 'Restricción del acceso a la información',
   'Asegurar el acceso solo autorizado y prevenir el acceso no autorizado a la información y otros activos.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['8.4',  '8', 'Controles Tecnológicos', 'Acceso al código fuente',
   'Prevenir la introducción de funcionalidades no autorizadas, evitar cambios involuntarios o malintencionados y mantener la confidencialidad de la propiedad intelectual valiosa.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['8.5',  '8', 'Controles Tecnológicos', 'Autenticación segura',
   'Asegurar que un usuario, componente o servicio solo se autentique de manera segura.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['8.6',  '8', 'Controles Tecnológicos', 'Gestión de la capacidad',
   'Asegurar la capacidad requerida de los recursos de procesamiento de la información, recursos humanos, oficinas e instalaciones.',
   'Preventivo | Disponibilidad', '', '', '', ''],
  ['8.7',  '8', 'Controles Tecnológicos', 'Protección contra malware',
   'Asegurar que la información y otros activos están protegidos contra el malware.',
   'Preventivo, Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.8',  '8', 'Controles Tecnológicos', 'Gestión de las vulnerabilidades técnicas',
   'Prevenir la explotación de las vulnerabilidades técnicas.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.9',  '8', 'Controles Tecnológicos', 'Gestión de la configuración',
   'Asegurar que el hardware, el software, los servicios y las redes funcionan correctamente con los parámetros de seguridad requeridos, y que la configuración no es alterada por cambios no autorizados o incorrectos.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.10', '8', 'Controles Tecnológicos', 'Eliminación de información',
   'Prevenir la exposición innecesaria de información sensible y cumplir los requisitos legales, estatutarios, reglamentarios y contractuales para la eliminación de información.',
   'Preventivo | Confidencialidad', '', '', '', ''],
  ['8.11', '8', 'Controles Tecnológicos', 'Enmascaramiento de datos',
   'Limitar la exposición de datos sensibles, incluyendo los datos de carácter personal, y cumplir con los requisitos legales, estatutarios, reglamentarios y contractuales.',
   'Preventivo | Confidencialidad', '', '', '', ''],
  ['8.12', '8', 'Controles Tecnológicos', 'Prevención de la fuga de datos',
   'Detectar y prevenir la divulgación y extracción no autorizadas de información por parte de individuos o sistemas.',
   'Preventivo, Detectivo | Confidencialidad', '', '', '', ''],
  ['8.13', '8', 'Controles Tecnológicos', 'Copia de seguridad de la información',
   'Permitir la recuperación de la pérdida de datos.',
   'Correctivo | Disponibilidad, Integridad', '', '', '', ''],
  ['8.14', '8', 'Controles Tecnológicos', 'Redundancia de los recursos de procesamiento de la información',
   'Asegurar el funcionamiento continuado de los recursos de procesamiento de la información.',
   'Preventivo | Disponibilidad', '', '', '', ''],
  ['8.15', '8', 'Controles Tecnológicos', 'Registro de actividad',
   'Registrar eventos, generar evidencias, asegurar la integridad de la información de registro y evitar el acceso no autorizado para detectar actividades inusuales/anómalas.',
   'Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.16', '8', 'Controles Tecnológicos', 'Actividades de supervisión',
   'Detectar comportamientos anómalos y posibles incidentes de seguridad de la información.',
   'Detectivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.17', '8', 'Controles Tecnológicos', 'Sincronización de relojes',
   'Permitir la correlación y el análisis de eventos relacionados con la seguridad y otros datos registrados, y apoyar la investigación de incidentes de seguridad de la información.',
   'Detectivo | Integridad', '', '', '', ''],
  ['8.18', '8', 'Controles Tecnológicos', 'Uso de programas de utilidad con privilegios',
   'Asegurar que el uso de programas de utilidad no comprometa los controles del sistema de información.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.19', '8', 'Controles Tecnológicos', 'Instalación de software en sistemas en producción',
   'Asegurar la integridad de los sistemas operativos e impedir la explotación de vulnerabilidades técnicas.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.20', '8', 'Controles Tecnológicos', 'Seguridad en las redes',
   'Proteger la información en las redes y sus recursos de procesamiento de la información de soporte contra compromisos mediante la red.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.21', '8', 'Controles Tecnológicos', 'Seguridad de los servicios de red',
   'Asegurar la seguridad en el uso de los servicios de red.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.22', '8', 'Controles Tecnológicos', 'Segregación de redes',
   'Dividir la red en grupos de servicios de información, usuarios y sistemas de información.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.23', '8', 'Controles Tecnológicos', 'Filtrado web',
   'Proteger los sistemas de información de verse comprometidos por malware y prevenir el acceso a recursos web no autorizados.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.24', '8', 'Controles Tecnológicos', 'Uso de la criptografía',
   'Asegurar el uso adecuado y eficaz de la criptografía para proteger la confidencialidad, autenticidad e integridad de la información de acuerdo con los requisitos del negocio y de seguridad de la información.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['8.25', '8', 'Controles Tecnológicos', 'Ciclo de vida de desarrollo seguro',
   'Asegurar que la seguridad de la información está diseñada e implementada dentro del ciclo de vida de desarrollo del software y los sistemas de información.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.26', '8', 'Controles Tecnológicos', 'Requisitos de seguridad de las aplicaciones',
   'Asegurar que todos los requisitos de seguridad de la información se identifican y abordan al desarrollar o adquirir aplicaciones.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.27', '8', 'Controles Tecnológicos', 'Principios de arquitectura de sistemas seguros e ingeniería',
   'Asegurar que los sistemas de información están diseñados, implementados y operados de forma segura durante todo el ciclo de vida de desarrollo del sistema.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.28', '8', 'Controles Tecnológicos', 'Codificación segura',
   'Asegurar que el software está escrito de forma segura, reduciendo así el número de posibles vulnerabilidades de seguridad de la información en el software.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.29', '8', 'Controles Tecnológicos', 'Pruebas de seguridad en el desarrollo y la aceptación',
   'Validar que los requisitos de seguridad de la información se cumplen cuando las aplicaciones o el código se despliegan en el entorno de producción.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.30', '8', 'Controles Tecnológicos', 'Desarrollo externalizado',
   'Asegurar que la organización implementa y mantiene la seguridad de la información acordada y los controles de seguridad del software cuando el desarrollo de software y sistemas se externaliza.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.31', '8', 'Controles Tecnológicos', 'Separación de los entornos de desarrollo, prueba y producción',
   'Proteger el entorno de producción y sus datos de compromisos debidos a las actividades de desarrollo y prueba.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.32', '8', 'Controles Tecnológicos', 'Gestión de cambios',
   'Preservar la seguridad de la información cuando se realizan cambios.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
  ['8.33', '8', 'Controles Tecnológicos', 'Información de prueba',
   'Asegurar la relevancia de las pruebas y la protección de los datos de producción usados para pruebas.',
   'Preventivo | Confidencialidad, Integridad', '', '', '', ''],
  ['8.34', '8', 'Controles Tecnológicos', 'Protección de los sistemas de información durante las pruebas de auditoría',
   'Minimizar el impacto de las actividades de auditoría en los sistemas operativos.',
   'Preventivo | Confidencialidad, Integridad, Disponibilidad', '', '', '', ''],
];

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================


async function main() {
  console.log('Autenticando con Google...');
  const auth = await authenticate();
  const sheets = google.sheets({ version: 'v4', auth });

  // --- Obtener metadatos del spreadsheet ---
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const hojas = meta.data.sheets.map(s => ({
    title: s.properties.title,
    sheetId: s.properties.sheetId
  }));

  const requests = [];

  // --- Preparar hoja 27001_Clausulas ---
  console.log(`\nPreparando hoja "${HOJA_CLAUSULAS}"...`);
  const hojaClaus = hojas.find(h => h.title === HOJA_CLAUSULAS);
  if (hojaClaus) {
    requests.push({ deleteSheet: { sheetId: hojaClaus.sheetId } });
  }
  requests.push({
    addSheet: { properties: { title: HOJA_CLAUSULAS } }
  });

  // --- Preparar hoja 27001_ControlesA ---
  console.log(`Preparando hoja "${HOJA_CONTROLES}"...`);
  const hojaCtrl = hojas.find(h => h.title === HOJA_CONTROLES);
  if (hojaCtrl) {
    requests.push({ deleteSheet: { sheetId: hojaCtrl.sheetId } });
  }
  requests.push({
    addSheet: { properties: { title: HOJA_CONTROLES } }
  });

  // Ejecutar batch de creación
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests }
  });
  console.log('Hojas creadas.');

  // Obtener IDs de las nuevas hojas
  const metaPost = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const hojasPost = metaPost.data.sheets.map(s => ({
    title: s.properties.title,
    sheetId: s.properties.sheetId
  }));

  // ============================================================
  // Cargar 27001_Clausulas
  // ============================================================
  console.log(`\nCargando ${CLAUSULAS.length} cláusulas en "${HOJA_CLAUSULAS}"...`);

  const headerClaus = [['ID_Clausula', 'Nivel', 'Titulo', 'Descripcion', 'Requisitos', 'Estado', 'Responsable', 'Observaciones']];
  const rowsClaus   = CLAUSULAS.map(r => r);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${HOJA_CLAUSULAS}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [...headerClaus, ...rowsClaus] }
  });

  // Dar formato al encabezado de Clausulas
  const clausSheetId = hojasPost.find(h => h.title === HOJA_CLAUSULAS).sheetId;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { sheetId: clausSheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.059, green: 0.153, blue: 0.267 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        },
        {
          updateSheetProperties: {
            properties: { sheetId: clausSheetId, gridProperties: { frozenRowCount: 1 } },
            fields: 'gridProperties.frozenRowCount'
          }
        }
      ]
    }
  });
  console.log(`  OK — ${CLAUSULAS.length} clausulas cargadas.`);

  // ============================================================
  // Cargar 27001_ControlesA
  // ============================================================
  console.log(`\nCargando ${CONTROLES_A.length} controles en "${HOJA_CONTROLES}"...`);

  const headerCtrl = [['ID_Control', 'Dominio', 'NombreDominio', 'Nombre_Control', 'Proposito', 'Atributos', 'Estado', 'Responsable', 'Evidencia', 'Observaciones']];
  const rowsCtrl   = CONTROLES_A.map(r => r);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${HOJA_CONTROLES}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [...headerCtrl, ...rowsCtrl] }
  });

  // Dar formato al encabezado de Controles
  const ctrlSheetId = hojasPost.find(h => h.title === HOJA_CONTROLES).sheetId;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { sheetId: ctrlSheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.059, green: 0.153, blue: 0.267 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        },
        {
          updateSheetProperties: {
            properties: { sheetId: ctrlSheetId, gridProperties: { frozenRowCount: 1 } },
            fields: 'gridProperties.frozenRowCount'
          }
        }
      ]
    }
  });
  console.log(`  OK — ${CONTROLES_A.length} controles cargados.`);

  console.log('\n¡Listo! Datos ISO 27001:2022 cargados exitosamente.');
  console.log(`Spreadsheet: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
}

main().catch(async err => {
  // Si el token expiró, borrarlo y reiniciar con flujo OAuth
  if (err.message && err.message.includes('invalid_grant')) {
    console.warn('\nToken expirado o revocado. Eliminando token y reiniciando autenticacion...');
    if (fs.existsSync(TOKEN_PATH)) fs.unlinkSync(TOKEN_PATH);
    console.log('Ejecuta nuevamente el script: node cargar_iso27001.js');
    console.log('Te pedira que abras una URL en el navegador para autorizar la app.');
    process.exit(2);
  }
  console.error('Error:', err.message || err);
  process.exit(1);
});
