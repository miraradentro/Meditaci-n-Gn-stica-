import { MeditationTrack, PreciseIndication, SacredFigure } from '../types/meditation';

export const HERO_SANCTUARY_IMAGE = '/src/assets/images/santuario_meditacion_portada_1791751511612.jpg';

export const SACRED_FIGURES: SacredFigure[] = [
  {
    id: 'cristo',
    name: 'Jesús el Cristo',
    title: 'El Salvador Interior y Maestro de Maestros',
    imageUrl: '/src/assets/images/jesus_el_cristo_retrato_1791751522830.jpg',
    quote: '«El Reino de Dios está dentro de vosotros. Buscad primero el Reino y su Justicia, y todo lo demás os será añadido.»',
    teaching:
      'En la meditación gnóstica, el Cristo Íntimo es la luz viva que habita en el fondo del corazón tranquilo. A través del silencio interior y la devoción consciente, el practicante abre su templo interno a la paz que sobrepasa todo entendimiento.'
  },
  {
    id: 'samael',
    name: 'V.M. Samael Aun Weor',
    title: 'Patriarca de la Gnosis Contemporánea',
    imageUrl: '/src/assets/images/maestro_samael_aun_weor_1791751531651.jpg',
    quote: '«Cuando la mente está quieta y en silencio, libre de los afanes del día, adviene a nosotros eso que es lo Real, el Ser.»',
    teaching:
      'El Venerable Maestro Samael Aun Weor enseñó la ciencia precisa de la meditación en fases ordenadas: asana (postura), relajación total del cuerpo físico, concentración serena, meditación profunda (Dhyana) y éxtasis o iluminación interior (Samadhi).'
  },
  {
    id: 'lakhsmi',
    name: 'V.M. Lakhsmi Daimon',
    title: 'Guía de la Regeneración y la Paz del Corazón',
    imageUrl: '/src/assets/images/maestro_lakhsmi_daimon_1791751542797.jpg',
    quote: '«La meditación debe convertirse en el pan diario del estudiante que anhela sentir a Dios en su propio corazón.»',
    teaching:
      'El Venerable Maestro Lakhsmi Daimon enfatizó la sencillez, la ternura espiritual y la continuidad en la práctica diaria: aprender a relajar los tres cerebros (intelectual, emocional y motor) para escuchar la voz silenciosa del Padre y de la Divina Madre Interior.'
  }
];

export const PRECISE_INDICATIONS: PreciseIndication[] = [
  {
    number: '01',
    title: 'Preparación del Lugar y Postura (Asana)',
    subtitle: 'Quietud del cuerpo físico sin rigidez ni tensión',
    body: 'Elija un espacio tranquilo, limpio y ventilado donde no sea interrumpido. Puede sentarse en un sillón cómodo con la columna vertebral recta y las manos descansando suavemente sobre las piernas, o recostarse en decúbito dorsal (boca arriba) con los talones juntos y las puntas de los pies en abanico, o en figura de estrella de cinco puntas.',
    keyPractice: 'Cierre los ojos físicos suavemente para que las impresiones externas dejen de distraer los sentidos.'
  },
  {
    number: '02',
    title: 'Relajación de los Tres Cerebros',
    subtitle: 'Distensión progresiva física, emocional y mental',
    body: 'Antes de intentar silenciar el pensamiento, recorra con su imaginación consciente cada parte del cuerpo desde la punta de los pies hasta la coronilla. Ordene con cariño a cada músculo, nervio y órgano que se relaje. Suelte las preocupaciones del día (centro intelectual) y las agitaciones del ánimo (centro emocional).',
    keyPractice: 'Ninguna tensión debe quedar en el rostro, mandíbula, hombros, espalda ni plexo solar.'
  },
  {
    number: '03',
    title: 'Armonización mediante la Respiración (Pranayama)',
    subtitle: 'El puente entre el cuerpo físico y la conciencia',
    body: 'Inhale lentamente por la nariz imaginando que la luz dorada de la vida (Prana) inunda sus pulmones y su sangre; retenga el aliento unos instantes en paz y exhale suavemente por la boca o nariz liberando todo cansancio y pesadez. Tres a siete respiraciones profundas preparan el ritmo cardíaco para la interiorización.',
    keyPractice: 'Al inhalar sienta paz y vida; al exhalar deseche toda fatiga e inquietud.'
  },
  {
    number: '04',
    title: 'Recogimiento y Petición al Ser Interior',
    subtitle: 'Orientación devocional hacia el Padre y la Divina Madre',
    body: 'Con humildad y sincero anhelo espiritual, eleve una breve oración desde el fondo de su corazón a su Padre que está en secreto, a su Divina Madre Kundalini y a los Venerables Maestros Jesús el Cristo, Samael Aun Weor y Lakhsmi Daimon, pidiendo asistencia para mantener la atención despierta durante toda la práctica.',
    keyPractice: 'La devoción sincera aporta calidez al corazón y evita la frialdad puramente intelectual.'
  },
  {
    number: '05',
    title: 'Observación Serena sin Identificación',
    subtitle: 'Dejar pasar las formas mentales sin luchar contra ellas',
    body: 'Durante los audios dirigidos, si surge un recuerdo, imagen o pensamiento ajeno a la práctica, no pelee contra él ni lo rechace con violencia: simplemente obsérvelo como un espectador sereno que ve pasar una nube en el cielo, y vuelva con suavidad a la voz guía y al latido tranquilo de su corazón.',
    keyPractice: 'Donde está su atención está su conciencia; regrese siempre al centro del corazón.'
  },
  {
    number: '06',
    title: 'Reproducción Continua y Uso Sin Conexión',
    subtitle: 'Cómo aprovechar la secuencia de audios de esta aplicación',
    body: 'Los audios están diseñados para escucharse de forma individual o en secuencia continua (uno detrás del otro) formando una sesión completa de meditación. Puede descargar cada audio a su dispositivo o guardarlo en la memoria sin conexión de la aplicación para practicar en retiros, montañas o lugares sin señal.',
    keyPractice: 'Active la opción «Continuar uno detrás del otro» en la página de Audios para no abrir los ojos entre etapas.'
  }
];

export const INITIAL_MEDITATION_TRACKS: MeditationTrack[] = [
  {
    id: 'med-01-relajacion',
    order: 1,
    title: '01. Relajación del Cuerpo Físico y los Tres Cerebros',
    authorCredit: 'V.M. Lakhsmi Daimon · Escuela de Regeneración Gnóstica',
    masterReference: 'lakhsmi',
    category: 'Fase I · Preparación y Relajación',
    durationSeconds: 90,
    updatedAt: '11 oct 2026',
    isNewUpdate: true,
    updateSummary: 'Actualizado con campanas armónicas de inicio y guía progresiva de pies a cabeza.',
    description:
      'Audio dirigido para aflojar metódicamente cada grupo muscular, aquietar el plexo solar y establecer una paz profunda en los centros motor, emocional e intelectual.',
    baseFrequencyHz: 432,
    harmonicFrequencyHz: 216,
    steps: [
      {
        atSecond: 0,
        phaseTitle: 'Postura y Cierre de Ojos',
        instruction: 'Adopte una postura cómoda. Cierre suavemente sus ojos físicos y tome conciencia del peso de su cuerpo descansando en paz.'
      },
      {
        atSecond: 20,
        phaseTitle: 'Relajación de Extremidades',
        instruction: 'Dirija su atención a los pies, tobillos, pantorrillas y muslos. Sienta una onda cálida de luz que afloja cada músculo y nervio.'
      },
      {
        atSecond: 45,
        phaseTitle: 'Distensión del Tronco y Corazón',
        instruction: 'Relaje el abdomen, el plexo solar, el pecho y la espalda. Su respiración se vuelve cada vez más serena, lenta y silenciosa.'
      },
      {
        atSecond: 70,
        phaseTitle: 'Paz en el Rostro y la Mente',
        instruction: 'Suelte los hombros, el cuello, la mandíbula, los párpados y la frente. Sus tres cerebros reposan ahora en completa armonía.'
      }
    ]
  },
  {
    id: 'med-02-pranayama',
    order: 2,
    title: '02. Armonización Pránica y Respiración Consciente',
    authorCredit: 'V.M. Samael Aun Weor · Ciencia del Pranayama',
    masterReference: 'samael',
    category: 'Fase II · Ritmo y Prana',
    durationSeconds: 95,
    updatedAt: '11 oct 2026',
    isNewUpdate: true,
    updateSummary: 'Nueva cadencia sonora para acompañar la inhalación, retención y exhalación consciente.',
    description:
      'Práctica dirigida de transmutación y armonización mediante el aliento vital, preparando el sistema nervioso para la interiorización profunda.',
    baseFrequencyHz: 528,
    harmonicFrequencyHz: 264,
    steps: [
      {
        atSecond: 0,
        phaseTitle: 'Conciencia del Aliento Vital',
        instruction: 'Observe el flujo natural de su respiración. Cada aliento nos conecta con el océano universal de la vida.'
      },
      {
        atSecond: 22,
        phaseTitle: 'Inhalación de Luz Dorada',
        instruction: 'Inhale profundamente por la nariz imaginando una luz cálida y dorada que desciende hasta sus pulmones y su corazón.'
      },
      {
        atSecond: 48,
        phaseTitle: 'Retención en Quietud Interior',
        instruction: 'Retenga el aire suavemente sintiendo cómo esa energía vital renueva cada célula y despierta la conciencia.'
      },
      {
        atSecond: 72,
        phaseTitle: 'Exhalación Liberadora',
        instruction: 'Exhale lentamente soltando toda preocupación, toda prisa y toda sombra. Permanezca en serena vigilancia.'
      }
    ]
  },
  {
    id: 'med-03-silencio-mental',
    order: 3,
    title: '03. El Silencio de la Mente y la Observación Serena',
    authorCredit: 'V.M. Samael Aun Weor · La Revolución de la Dialéctica',
    masterReference: 'samael',
    category: 'Fase III · Interiorización (Dharana)',
    durationSeconds: 100,
    updatedAt: '10 oct 2026',
    isNewUpdate: true,
    updateSummary: 'Incorporación de intervalos de silencio profundo con resonancia de templo en 396 Hz.',
    description:
      'Guía práctica para desidentificarse del parloteo interior de los sentidos y reposar en la atención consciente sin dualidad.',
    baseFrequencyHz: 396,
    harmonicFrequencyHz: 198,
    steps: [
      {
        atSecond: 0,
        phaseTitle: 'El Mirador de la Conciencia',
        instruction: 'Ubíquese como observador silencioso dentro de sí mismo. Usted no es el tumulto de pensamientos: usted es la Conciencia que observa.'
      },
      {
        atSecond: 25,
        phaseTitle: 'Comprensión sin Lucha',
        instruction: 'Si aparece una imagen, recuerdo o pendiente del día, no lo combata. Obsérvelo con serenidad y déjelo pasar como agua que fluye.'
      },
      {
        atSecond: 55,
        phaseTitle: 'El Lago Cristalino de la Mente',
        instruction: 'Imagine su mente como un lago de alta montaña sin una sola ola, reflejando únicamente la inmensidad del cielo estrellado.'
      },
      {
        atSecond: 80,
        phaseTitle: 'Quietud Profunda',
        instruction: 'Repose en ese silencio vivo y luminoso. Ningún deseo, ningún temor; sólo presencia consciente en el aquí y ahora.'
      }
    ]
  },
  {
    id: 'med-04-cristo-intimo',
    order: 4,
    title: '04. Contemplación en el Amor y la Paz de Jesús el Cristo',
    authorCredit: 'Inspirado en las Enseñanzas de Jesús el Cristo · Tradición Cristocéntrica',
    masterReference: 'cristo',
    category: 'Fase IV · Devoción y Meditación (Dhyana)',
    durationSeconds: 110,
    updatedAt: '11 oct 2026',
    isNewUpdate: true,
    updateSummary: 'Nuevo audio dirigido dedicado al Templo-Corazón y la luz del Cristo Íntimo.',
    description:
      'Meditación profunda en el santuario del corazón para sentir la presencia viva, la misericordia y la paz infinita del Cristo Interior.',
    baseFrequencyHz: 432,
    harmonicFrequencyHz: 648,
    steps: [
      {
        atSecond: 0,
        phaseTitle: 'Ingreso al Templo-Corazón',
        instruction: 'Lleve toda su atención al centro de su pecho, al santuario sagrado de su corazón, donde arde una llama cálida e inextinguible.'
      },
      {
        atSecond: 28,
        phaseTitle: 'La Presencia del Gran Maestro',
        instruction: 'Sienta la infinita compasión, dulzura y fortaleza de Jesús el Cristo irradiando como un sol espiritual dentro de su alma.'
      },
      {
        atSecond: 60,
        phaseTitle: '«Mi Paz os dejo, mi Paz os doy»',
        instruction: 'Deje que esa luz dorada y cálida purifique todo dolor, perdone toda ofensa y llene su ser de una paz que el mundo no puede dar.'
      },
      {
        atSecond: 88,
        phaseTitle: 'Unión en el Amor Consciente',
        instruction: 'Permanezca en adoración silenciosa, fundido en el amor divino que sostiene todos los mundos.'
      }
    ]
  },
  {
    id: 'med-05-mantram-om',
    order: 5,
    title: '05. Vocalización Interior del Mantram OM y el Vacío Iluminador',
    authorCredit: 'V.M. Samael Aun Weor · Tratado de Meditación',
    masterReference: 'samael',
    category: 'Fase V · Éxtasis e Iluminación (Samadhi)',
    durationSeconds: 95,
    updatedAt: '09 oct 2026',
    isNewUpdate: false,
    updateSummary: 'Frecuencia armónica afinada para la vibración de la sílaba sagrada OM en el cardias.',
    description:
      'Práctica del sonido silencioso (Anahata) mediante el mantram OM, abriendo la conciencia a la experiencia de lo Real.',
    baseFrequencyHz: 432,
    harmonicFrequencyHz: 324,
    steps: [
      {
        atSecond: 0,
        phaseTitle: 'Sintonía con el Verbo Interior',
        instruction: 'Escuche la vibración armónica del sonido sagrado. En el principio era el Verbo, y el Verbo vibra en el fondo de la conciencia.'
      },
      {
        atSecond: 24,
        phaseTitle: 'Resonancia de la Sílaba OM',
        instruction: 'Entone mentalmente o con un murmullo suave de labios cerrados: OOOOOOMMMMMM... sintiendo la O en el corazón y la M en la glándula pineal.'
      },
      {
        atSecond: 52,
        phaseTitle: 'Apertura al Vacío Iluminador',
        instruction: 'Más allá de la forma y del tiempo, la esencia libre experimenta la dicha de la luz increada.'
      },
      {
        atSecond: 76,
        phaseTitle: 'Silencio Posterior al Sonido',
        instruction: 'Cese la vocalización y escuche el eco espiritual que permanece vibrando en su interior.'
      }
    ]
  },
  {
    id: 'med-06-gratitud-lakhsmi',
    order: 6,
    title: '06. Gratitud al Ser e Irradiación de Paz a la Humanidad',
    authorCredit: 'V.M. Lakhsmi Daimon · Mensaje de Paz al Corazón',
    masterReference: 'lakhsmi',
    category: 'Fase VI · Cierre y Bendición',
    durationSeconds: 85,
    updatedAt: '08 oct 2026',
    isNewUpdate: false,
    updateSummary: 'Oración final de cierre para conservar el estado de recuerdo de sí durante el día.',
    description:
      'Conclusión serena de la cadena de meditación, agradeciendo al Padre y a la Divina Madre e irradiando armonía a todos los seres.',
    baseFrequencyHz: 528,
    harmonicFrequencyHz: 396,
    steps: [
      {
        atSecond: 0,
        phaseTitle: 'Acción de Gracias Íntima',
        instruction: 'Desde su corazón tranquilo, dé gracias a su Padre Interno, a su Divina Madre Kundalini y a los Venerables Maestros por la paz recibida.'
      },
      {
        atSecond: 25,
        phaseTitle: 'Irradiación de Paz Universal',
        instruction: 'Imagine que desde su corazón brotan ondas cálidas de luz dorada y azul que bendicen su hogar, la naturaleza y toda la humanidad.'
      },
      {
        atSecond: 52,
        phaseTitle: 'Retorno Consciente y Alerta Novedad',
        instruction: 'Respire profundamente, mueva suavemente sus manos y pies, y cuando esté listo abra sus ojos conservando esta paz en cada acto del día.'
      }
    ]
  }
];
