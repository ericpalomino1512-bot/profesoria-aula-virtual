import type { Course } from '../types/course';

export const DEMO_COURSE: Course = {
  id: 'curso-quimica-organica-ebau',
  title: 'Maestría en Química Orgánica: De la Estructura Molecular a las Reacciones de Selectividad',
  subtitle: 'Un itinerario intensivo y visual diseñado para comprender la reactividad del carbono, predecir mecanismos y superar con solvencia cualquier prueba de acceso universitario o examen avanzado.',
  level: 'Intermedio',
  estimatedDuration: '4 semanas (30 min al día)',
  targetProfile: 'Estudiante de bachillerato preparando la EBAU',
  mainGoal: 'Dominar la formulación, isomería y mecanismos de reacción para resolver los problemas de Química Orgánica con máxima nota.',
  preferredFormat: 'Lecturas + ejercicios',
  createdAt: new Date().toISOString(),
  learningObjectives: [
    'Dominar la nomenclatura IUPAC en moléculas monofuncionales y polifuncionales con rapidez y sin vacilaciones.',
    'Diferenciar con precisión los tipos de isomería estructural y espacial (geométrica y óptica) reconociendo centros estereogénicos.',
    'Predecir los productos mayoritarios en reacciones de adición y eliminación aplicando las reglas de Markovnikov y Zaitsev.',
    'Interpretar los efectos inductivo y resonante para justificar la acidez y basicidad de compuestos orgánicos.',
    'Diseñar rutas de síntesis sencillas mediante oxidación, reducción, esterificación y sustitución nucleofílica.',
    'Resolver problemas complejos de exámenes oficiales de acceso a la universidad con metodología analítica paso a paso.'
  ],
  units: [
    {
      id: 'u1',
      unitNumber: 1,
      title: 'Fundamentos del Carbono e Hibridación',
      summary: 'Comprende la geometría tridimensional de los orbitales del carbono para entender por qué las moléculas orgánicas reaccionan como lo hacen.',
      lessons: [
        {
          id: 'u1-l1',
          lessonNumber: '1.1',
          title: 'El átomo de carbono y los tipos de hibridación (sp³, sp², sp)',
          durationMinutes: 20,
          keyIdea: 'El carbono posee 4 electrones en su capa de valencia, pero en su estado fundamental solo podría formar dos enlaces covalentes. Mediante el fenómeno de hibridación, reorganiza sus orbitales s y p para formar nuevos orbitales híbridos degenerados. La hibridación sp³ produce una geometría tetraédrica con ángulos de 109,5º, típica de los alcanos. La sp² genera una geometría trigonal plana con ángulos de 120º en alquenos, dejando un orbital p puro libre para el enlace pi (π). Por último, la hibridación sp confiere geometría lineal (180º) en alquinos. Conocer la hibridación te permite deducir al instante la forma espacial y la rigidez de cualquier molécula.',
          appliedExample: 'Observa una molécula de polietileno (plástico común de bolsas) frente al caucho vulcanizado de un neumático. En el polietileno, los enlaces sencillos C-C (sp³) permiten rotación libre, dando flexibilidad. En cambio, cuando forzamos enlaces dobles o puentes rígidos, la molécula pierde libertad conformacional, haciéndose mucho más dura y elástica.',
          practicalActivity: 'Dibuja en una hoja la molécula de propadieno (aleno, H₂C=C=CH₂) e indica la hibridación y geometría de cada uno de sus tres átomos de carbono. Presta especial atención al carbono central.',
          quickQuiz: [
            {
              id: 'q1-1-1',
              question: '¿Qué tipo de hibridación presenta el átomo de carbono en el etileno (eteno, H₂C=CH₂)?',
              options: ['sp³', 'sp²', 'sp', 'sp³d'],
              correctOptionIndex: 1,
              explanation: 'Cada carbono del eteno está unido a dos hidrógenos y mediante doble enlace al otro carbono; posee 3 regiones de densidad electrónica, lo que corresponde a hibridación sp² y geometría trigonal plana.'
            },
            {
              id: 'q1-1-2',
              question: '¿Cuál es el ángulo característico entre los enlaces formados por un carbono con hibridación sp³?',
              options: ['90°', '120°', '109,5°', '180°'],
              correctOptionIndex: 2,
              explanation: 'La geometría tetraédrica regular de un carbono sp³ minimiza la repulsión electrónica a un ángulo de 109,5° (o 109° 28\').'
            },
            {
              id: 'q1-1-3',
              question: 'En un enlace triple entre dos carbonos (alquino), ¿cuántos enlaces sigma (σ) y cuántos pi (π) existen?',
              options: [
                'Tres enlaces sigma (σ)',
                'Dos enlaces sigma (σ) y un pi (π)',
                'Un enlace sigma (σ) y dos enlaces pi (π)',
                'Tres enlaces pi (π)'
              ],
              correctOptionIndex: 2,
              explanation: 'El primer enlace que une axialmente los núcleos es de tipo sigma (σ). Los dos solapamientos laterales de orbitales p puros perpendiculares forman dos enlaces pi (π).'
            }
          ]
        },
        {
          id: 'u1-l2',
          lessonNumber: '1.2',
          title: 'Polaridad, electronegatividad y fuerzas intermoleculares',
          durationMinutes: 25,
          keyIdea: 'Aunque los enlaces C-C y C-H se consideran prácticamente apolares, la presencia de heteroátomos como oxígeno, nitrógeno o halógenos rompe la simetría electrónica generando momentos dipolares permanentes. La magnitud de esta polaridad determina las fuerzas intermoleculares en juego: desde las débiles fuerzas de dispersión de London en alcanos hasta las fuertes interacciones por puentes de hidrógeno en alcoholes y ácidos carboxílicos. Estas fuerzas gobiernan el punto de ebullición, la solubilidad en agua y el punto de fusión.',
          appliedExample: 'Compara el propano (gas a temperatura ambiente, masa molar 44 g/mol) con el etanol (líquido que hierve a 78 ºC, masa molar 46 g/mol). Tienen masas prácticamente idénticas, pero el etanol posee el grupo -OH capaz de tejer una red de puentes de hidrógeno.',
          practicalActivity: 'Ordena de menor a mayor punto de ebullición razonando con base en sus fuerzas intermoleculares: butano, 1-butanol y dietiléter.',
          quickQuiz: [
            {
              id: 'q1-2-1',
              question: '¿Qué compuesto de los siguientes tiene mayor punto de ebullición a presión estándar?',
              options: ['Pentano', '1-Pentanol', 'Pentanal', 'Cloropentano'],
              correctOptionIndex: 1,
              explanation: 'El 1-pentanol forma enlaces por puente de hidrógeno intermoleculares, los cuales requieren mucha más energía térmica para romperse que las fuerzas dipolo-dipolo o de London.'
            },
            {
              id: 'q1-2-2',
              question: '¿Por qué los hidrocarburos alifáticos puros son insolubles en agua?',
              options: [
                'Porque son más densos que el agua',
                'Porque son moléculas no polares y no pueden formar interacciones favorables con el agua polar',
                'Porque reaccionan violentamente con el oxígeno disuelto',
                'Porque su masa molecular es excesivamente baja'
              ],
              correctOptionIndex: 1,
              explanation: 'El principio de "lo semejante disuelve a lo semejante" se aplica aquí: el agua fuertemente enlazada por puentes de hidrógeno no puede interactuar energéticamente con las colas apolares hidrofóbicas.'
            },
            {
              id: 'q1-2-3',
              question: '¿Qué tipo de fuerza intermolecular predomina exclusivamente entre moléculas de metano (CH₄)?',
              options: ['Fuerzas ion-dipolo', 'Puentes de hidrógeno', 'Fuerzas de dispersión de London', 'Enlaces covalentes dativos'],
              correctOptionIndex: 2,
              explanation: 'El metano es una molécula perfectamente simétrica y apolar, por lo que solo experimenta fluctuaciones instantáneas de carga (dispersión de London).'
            }
          ]
        },
        {
          id: 'u1-l3',
          lessonNumber: '1.3',
          title: 'Nomenclatura sistemática y jerarquía de grupos funcionales',
          durationMinutes: 30,
          keyIdea: 'Para nombrar una molécula compleja, la IUPAC establece un orden riguroso de preferencia: ácido carboxílico > anhídrido > éster > haluro de acilo > amida > nitrilo > aldehído > cetona > alcohol > tiol > amina > éter > alqueno > alquino > halógeno / nitro / radical alquílico. El grupo de mayor jerarquía define el sufijo principal de la cadena principal y fija la numeración más baja posible. El resto de grupos se nombran como prefijos sustituyentes en estricto orden alfabético.',
          appliedExample: 'En la molécula de ácido acetilsalicílico (aspirina) conviven un ácido carboxílico y un éster sobre un anillo aromático. El grupo de mayor jerarquía es el ácido carboxílico, por lo que el nombre base siempre terminará en ácido ...benzoico.',
          practicalActivity: 'Localiza el grupo principal y formula el siguiente compuesto: ácido 3-hidroxi-4-oxopentanoico.',
          quickQuiz: [
            {
              id: 'q1-3-1',
              question: 'Entre un aldehído (-CHO) y un alcohol (-OH) en la misma cadena, ¿cuál determina el sufijo principal?',
              options: ['El alcohol (-ol)', 'El aldehído (-al)', 'Cualquiera según decida el autor', 'El que tenga el carbono en posición 1'],
              correctOptionIndex: 1,
              explanation: 'En la escala de prioridades IUPAC, los carbonilos (aldehídos y cetonas) tienen mayor jerarquía que los grupos hidroxilo (alcoholes).'
            },
            {
              id: 'q1-3-2',
              question: '¿Cómo se nombra el grupo -NH₂ cuando actúa como sustituyente secundario?',
              options: ['Amida', 'Azo', 'Amino', 'Nitrilo'],
              correctOptionIndex: 2,
              explanation: 'Cuando la amina no es el grupo principal con mayor jerarquía, pasa a nombrarse con el prefijo "amino-".'
            },
            {
              id: 'q1-3-3',
              question: '¿Cuál es el nombre IUPAC de CH₃-CH(OH)-CH₂-COOH?',
              options: [
                'Ácido 3-hidroxibutanoico',
                'Ácido 2-hidroxibutanoico',
                '3-hidroxibutanal',
                'Ácido butanolcarboxílico'
              ],
              correctOptionIndex: 0,
              explanation: 'El carbono del grupo ácido (-COOH) es el C1, por lo que el grupo hidroxilo (-OH) queda unido al carbono 3: ácido 3-hidroxibutanoico.'
            }
          ]
        }
      ]
    },
    {
      id: 'u2',
      unitNumber: 2,
      title: 'Isomería Estructural y Estereoisomería',
      summary: 'Descubre cómo la misma fórmula molecular puede dar lugar a moléculas con propiedades biológicas y químicas completamente distintas.',
      lessons: [
        {
          id: 'u2-l1',
          lessonNumber: '2.1',
          title: 'Isomería constitucional: de cadena, de posición y de función',
          durationMinutes: 20,
          keyIdea: 'Dos o más compuestos son isómeros constitucionales cuando comparten la misma fórmula molecular pero difieren en la conectividad de sus átomos. En la isomería de cadena cambia el esqueleto carbonado (lineal vs. ramificado). En la isomería de posición, la cadena y los grupos funcionales son idénticos, pero el grupo funcional o la insaturación se ubica en diferente carbono. En la isomería de función, los mismos átomos se reordenan para formar grupos funcionales distintos (como un alcohol y un éter, o un aldehído y una cetona). En exámenes de acceso a la universidad, identificar los isómeros de función de C₃H₆O o C₄H₁₀O es un ejercicio clásico recurrente.',
          appliedExample: 'La glucosa y la fructosa comparten exactamente la misma fórmula molecular C₆H₁₂O₆. Sin embargo, la glucosa es una aldohexosa (posee un aldehído) mientras que la fructosa es una cetohexosa (posee una cetona). Esta diferencia en el grupo funcional hace que la fructosa se sienta casi el doble de dulce en el paladar humano.',
          practicalActivity: 'Escribe las fórmulas semidesarrolladas de todos los isómeros constitucionales posibles con fórmula molecular C₃H₈O y clasifica el tipo de isomería que existe entre ellos.',
          quickQuiz: [
            {
              id: 'q2-1-1',
              question: '¿Qué tipo de isomería existe entre el propanal y la propanona (acetona)?',
              options: ['Isomería de cadena', 'Isomería geométrica', 'Isomería de función', 'Isomería óptica'],
              correctOptionIndex: 2,
              explanation: 'Ambos tienen fórmula C₃H₆O, pero uno es un aldehído y el otro es una cetona; difieren en el grupo funcional presente.'
            },
            {
              id: 'q2-1-2',
              question: '¿Qué par de moléculas representan isómeros de posición?',
              options: [
                'Pentano y 2-metilbutano',
                '1-Butanol y 2-butanol',
                'Etanol y dimetiléter',
                'Ácido propanoico y acetato de metilo'
              ],
              correctOptionIndex: 1,
              explanation: 'Ambas son alcoholes de 4 carbonos lineales, pero el grupo -OH cambia de estar en el carbono 1 al carbono 2.'
            },
            {
              id: 'q2-1-3',
              question: '¿Cuántos isómeros de cadena tiene el alcano C₄H₁₀?',
              options: ['1', '2 (butano e isobutano)', '3', '4'],
              correctOptionIndex: 1,
              explanation: 'Solo existen dos disposiciones de la cadena de 4 carbonos: la lineal (butano) y la ramificada (2-metilpropano o isobutano).'
            }
          ]
        },
        {
          id: 'u2-l2',
          lessonNumber: '2.2',
          title: 'Isomería geométrica cis-trans (Z/E) en alquenos',
          durationMinutes: 25,
          keyIdea: 'El doble enlace carbono-carbono posee un enlace pi (π) formado por solapamiento lateral de orbitales p. Romper ese solapamiento requeriría unos 260 kJ/mol, impidiendo la rotación libre a temperatura ambiente. Cuando cada uno de los carbonos del doble enlace porta dos sustituyentes distintos, surgen dos disposiciones espaciales no interconvertibles: cis (o Z, cuando los grupos prioritarios están hacia el mismo lado) y trans (o E, cuando están en lados opuestos). Esta diferencia geométrica altera drásticamente el momento dipolar y el empaquetamiento cristalino.',
          appliedExample: 'Las grasas trans en la industria alimentaria surgen de hidrogenar aceites vegetales parcialmente. Al pasar de configuración cis a trans, las colas de ácidos grasos se vuelven rectas y rígidas, empaquetándose con facilidad en nuestras arterias, lo que incrementa notablemente el riesgo cardiovascular.',
          practicalActivity: 'Justifica por qué el 2-buteno presenta isomería geométrica cis/trans, mientras que el 1-buteno no la presenta bajo ninguna condición.',
          quickQuiz: [
            {
              id: 'q2-2-1',
              question: '¿Cuál es la condición fundamental para que un alqueno presente isomería cis-trans?',
              options: [
                'Tener al menos 5 átomos de carbono',
                'Que cada carbono del doble enlace tenga dos sustituyentes distintos entre sí',
                'Tener al menos un triple enlace adyacente',
                'Estar en disolución acuosa concentrada'
              ],
              correctOptionIndex: 1,
              explanation: 'Si uno de los carbonos del doble enlace tiene dos grupos idénticos (por ejemplo, dos hidrógenos como en el 1-buteno =CH₂), al girar no se genera una nueva disposición espacial distinta.'
            },
            {
              id: 'q2-2-2',
              question: 'Entre el cis-1,2-dicloroeteno y el trans-1,2-dicloroeteno, ¿cuál tiene momento dipolar neto igual a cero (μ = 0)?',
              options: ['El isómero cis', 'El isómero trans', 'Ambos son polares', 'Ninguno existe en la naturaleza'],
              correctOptionIndex: 1,
              explanation: 'En el isómero trans, los dipolos de los dos enlaces C-Cl apuntan en sentidos exactamente opuestos y se cancelan vectorialmente.'
            },
            {
              id: 'q2-2-3',
              question: '¿Qué notación IUPAC universal sustituye y perfecciona al cis/trans para olefinas polisustituidas?',
              options: ['R / S', 'D / L', 'Z / E (Zusammen / Entgegen)', 'Alfa / Beta'],
              correctOptionIndex: 2,
              explanation: 'El sistema Z/E, basado en las reglas de prioridad de Cahn-Ingold-Prelog, clasifica cualquier alqueno sin ambigüedad.'
            }
          ]
        },
        {
          id: 'u2-l3',
          lessonNumber: '2.3',
          title: 'Quiralidad, centros estereogénicos y actividad óptica',
          durationMinutes: 30,
          keyIdea: 'Un carbono se denomina asimétrico o quiral (C*) cuando se encuentra enlazado a cuatro sustituyentes químicamente diferentes. Una molécula quiral carece de plano o centro de simetría interna y no es superponible con su imagen especular, existiendo en forma de dos enantiómeros. Los enantiómeros tienen idénticas propiedades físicas convencionales (punto de ebullición, densidad, etc.), pero desvían el plano de la luz polarizada en sentidos opuestos (dextrógiro y levógiro) y reaccionan de forma muy dispar frente a receptores biológicos quirales.',
          appliedExample: 'El caso más trágico de la historia farmacológica fue la talidomida: el enantiómero (R) es un sedante eficaz contra las náuseas matutinas en el embarazo, mientras que el enantiómero (S) es un potente teratógeno causante de malformaciones fetales.',
          practicalActivity: 'Indica si el ácido láctico (ácido 2-hidroxipropanoico) es una molécula quiral. Si lo es, identifica su carbono asimétrico y sus cuatro sustituyentes.',
          quickQuiz: [
            {
              id: 'q2-3-1',
              question: '¿Cuántos sustituyentes distintos debe tener un átomo de carbono para ser un centro quiral o asimétrico?',
              options: ['2', '3', '4', '6'],
              correctOptionIndex: 2,
              explanation: 'Un átomo de carbono sp³ debe estar unido a 4 grupos o átomos diferentes para carecer de plano de simetría y ser quiral.'
            },
            {
              id: 'q2-3-2',
              question: '¿Cómo se denomina a una mezcla equimolecular (50:50) de dos enantiómeros que no desvía la luz polarizada?',
              options: ['Forma meso', 'Mezcla racémica o racemato', 'Diastereómero', 'Polímero óptico'],
              correctOptionIndex: 1,
              explanation: 'La mezcla racémica contiene iguales cantidades de enantiómero dextrógiro (+) y levógiro (-), anulándose mutuamente la desviación óptica.'
            },
            {
              id: 'q2-3-3',
              question: '¿Cuál de los siguientes compuestos posee al menos un carbono asimétrico?',
              options: ['Etanol', '2-Clorobutano', 'Propanona', 'Ácido acético'],
              correctOptionIndex: 1,
              explanation: 'El C2 del 2-clorobutano está unido a: -H, -Cl, -CH₃ y -CH₂CH₃; los cuatro grupos son distintos.'
            }
          ]
        }
      ]
    },
    {
      id: 'u3',
      unitNumber: 3,
      title: 'Reactividad Orgánica y Mecanismos de Reacción',
      summary: 'Aprende a pensar como los electrones: identifica reactivos nucleófilos, electrófilos y los factores termodinámicos que dirigen la reacción.',
      lessons: [
        {
          id: 'u3-l1',
          lessonNumber: '3.1',
          title: 'Rupturas de enlace, nucleófilos y electrófilos',
          durationMinutes: 20,
          keyIdea: 'Las reacciones orgánicas ocurren cuando los electrones fluyen desde una zona rica en carga negativa hacia una zona deficiente. Un nucleófilo ("amante de núcleos") es una especie neutra o cargada con pares solitarios o enlaces pi lista para ceder densidad electrónica (ej. OH⁻, NH₃, H₂O). Un electrófilo ("amante de electrones") posee una deficiencia de carga o un orbital vacío (ej. H⁺, carbocationes, el carbono de un grupo carbonilo C=O). En las rupturas heterolíticas, el par de electrones se lo queda el átomo más electronegativo, generando iones reactivos.',
          appliedExample: 'En la respiración celular y en el metabolismo de los azúcares, el grupo carbonilo de la glucosa actúa como un electrófilo que es atacado por nucleófilos celulares (como residuos enzimáticos de lisina o serina) para formar intermediarios que liberan energía de manera controlada.',
          practicalActivity: 'Clasifica las siguientes especies en nucleófilos o electrófilos: Br⁻, AlCl₃, NH₃, CH₃⁺, CN⁻ y H₃O⁺.',
          quickQuiz: [
            {
              id: 'q3-1-1',
              question: '¿Cuál de las siguientes especies químicas actúa como un electrófilo típico?',
              options: ['Ion hidróxido (OH⁻)', 'Ion carbocatión (R₃C⁺)', 'Amoníaco (NH₃)', 'Ion cianuro (CN⁻)'],
              correctOptionIndex: 1,
              explanation: 'El carbocatión tiene un carbono con solo seis electrones y carga positiva neta, lo que lo hace ávido de aceptar electrones.'
            },
            {
              id: 'q3-1-2',
              question: 'En una ruptura homolítica de un enlace covalente simple, ¿qué intermediarios reactivos se producen?',
              options: ['Un catión y un anión', 'Dos radicales libres', 'Una molécula neutra y un fotón', 'Un polímero lineal'],
              correctOptionIndex: 1,
              explanation: 'En la ruptura homolítica, cada átomo se queda con uno de los dos electrones del enlace, generando dos especies con electrones desapareados llamadas radicales libres.'
            },
            {
              id: 'q3-1-3',
              question: '¿Por qué el carbono del enlace C=O es vulnerable al ataque de un nucleófilo?',
              options: [
                'Porque el oxígeno atrae los electrones por electronegatividad, dejando el carbono con carga parcial positiva (δ+)',
                'Porque el carbono es el elemento más electronegativo del sistema periódico',
                'Porque tiene un par de electrones no compartidos',
                'Porque no puede formar más de tres enlaces'
              ],
              correctOptionIndex: 0,
              explanation: 'El enlace carbonilo está polarizado hacia el oxígeno (δ-), lo que deja al carbono como un centro electrofílico excelente.'
            }
          ]
        },
        {
          id: 'u3-l2',
          lessonNumber: '3.2',
          title: 'Efectos electrónicos: inductivo y resonante (mesómero)',
          durationMinutes: 25,
          keyIdea: 'La reactividad y estabilidad de los intermedios depende de cómo se distribuye la carga en la molécula. El efecto inductivo (I) opera a través de los enlaces sigma (σ) por diferencia de electronegatividad y decae rápidamente con la distancia. El efecto resonante o mesómero (M) opera a través de sistemas conjugados de enlaces pi (π) o pares libres, deslocalizando la carga por toda la estructura. Un carbocatión terciario es mucho más estable que uno primario debido al efecto inductivo dador (+I) e hiperconjugación de los tres grupos alquilo adyacentes.',
          appliedExample: 'El ácido tricloroacético (Cl₃C-COOH) es unas 10.000 veces más ácido que el ácido acético corriente (CH₃-COOH). Los tres átomos de cloro retiran densidad electrónica por fuerte efecto inductivo atrayente (-I), estabilizando enormemente la base conjugada carboxilato.',
          practicalActivity: 'Justifica por qué el fenol (C₆H₅OH) es mucho más ácido que el ciclohexanol usando estructuras de resonancia.',
          quickQuiz: [
            {
              id: 'q3-2-1',
              question: '¿Cuál es el orden de estabilidad decreciente para los carbocationes simples?',
              options: [
                'Primario > Secundario > Terciario > Metilo',
                'Terciario > Secundario > Primario > Metilo',
                'Metilo > Primario > Secundario > Terciario',
                'Todos los carbocationes poseen idéntica estabilidad'
              ],
              correctOptionIndex: 1,
              explanation: 'Los grupos alquilo ceden densidad electrónica (+I) al carbono con carga positiva; cuantos más sustituyentes alquilo tenga (terciario > secundario > primario), más dispersa y estable es la carga.'
            },
            {
              id: 'q3-2-2',
              question: '¿A través de qué tipo de enlaces se transmite el efecto mesómero o de resonancia?',
              options: ['Enlaces iónicos únicamente', 'Enlaces sigma sin dobles enlaces', 'Sistemas conjugados con enlaces pi (π) o pares solitarios', 'Fuerzas de Van der Waals'],
              correctOptionIndex: 2,
              explanation: 'La resonancia requiere solapamiento de orbitales p paralelos para permitir el libre flujo y deslocalización de electrones pi.'
            },
            {
              id: 'q3-2-3',
              question: '¿Qué efecto ejerce el grupo nitro (-NO₂) sobre un anillo de benceno?',
              options: ['Dador de electrones fuertemente activante', 'Atractor de electrones fuertemente desactivante (-I, -M)', 'Neutral sin influencia', 'Aumenta la densidad electrónica orto/para'],
              correctOptionIndex: 1,
              explanation: 'El grupo nitro retira carga tanto por inducción electrostática como por resonancia, desactivando el anillo aromático frente a sustituciones electrofílicas.'
            }
          ]
        }
      ]
    },
    {
      id: 'u4',
      unitNumber: 4,
      title: 'Reacciones de Adición y Eliminación: Markovnikov y Zaitsev',
      summary: 'Domina las dos grandes reglas de oro que deciden los productos mayoritarios en los exámenes de química orgánica.',
      lessons: [
        {
          id: 'u4-l1',
          lessonNumber: '4.1',
          title: 'Reacciones de adición electrófila y la Regla de Markovnikov',
          durationMinutes: 25,
          keyIdea: 'En los alquenos, la nube pi (π) de alta densidad electrónica actúa como nucleófilo atacando a especies electrófilas (como HBr, HCl, H₂O en medio ácido). El protón (H⁺) se adiciona primero formando el carbocatión intermedio más estable posible. De esta observación empírica surge la célebre Regla de Markovnikov: "En la adición de un reactivo asimétrico H-X a un alqueno asimétrico, el hidrógeno se une al carbono del doble enlace que ya tiene más hidrógenos unidos". El halógeno o nucleófilo restante ataca después al carbocatión más sustituido.',
          appliedExample: 'Si hacemos reaccionar propeno (CH₃-CH=CH₂) con ácido clorhídrico (HCl), se obtiene casi exclusivamente 2-cloropropano (producto Markovnikov), y apenas trazas de 1-cloropropano. Esto se debe a que el carbocatión secundario intermedio se forma a una velocidad inmensamente mayor que el carbocatión primario.',
          practicalActivity: 'Escribe la reacción completa de hidratación en medio ácido del 2-metil-2-buteno y predice el alcohol mayoritario formado justificando el mecanismo.',
          quickQuiz: [
            {
              id: 'q4-1-1',
              question: 'Al adicionar ácido bromhídrico (HBr) a 1-buteno, ¿cuál es el producto mayoritario según Markovnikov?',
              options: ['1-Bromobutano', '2-Bromobutano', '1,2-Dibromobutano', 'Butano'],
              correctOptionIndex: 1,
              explanation: 'El H⁺ se une al carbono 1 (que tiene dos hidrógenos), formando un carbocatión secundario en C2, donde posteriormente entra el Br⁻ para rendir 2-bromobutano.'
            },
            {
              id: 'q4-1-2',
              question: '¿Por qué se cumple la regla de Markovnikov a nivel mecanístico?',
              options: [
                'Porque favorece la formación del carbocatión intermedio más estable',
                'Porque el hidrógeno es repelido por los carbonos sustituidos',
                'Porque las moléculas siempre buscan el mayor volumen',
                'Por efecto del campo magnético terrestre'
              ],
              correctOptionIndex: 0,
              explanation: 'La energía de activación para generar el carbocatión más sustituido (terciario o secundario) es mucho más baja que para generar uno primario menos estable.'
            },
            {
              id: 'q4-1-3',
              question: '¿Qué reactivo se utiliza típicamente para hidrogenar un alqueno y convertirlo en alcano?',
              options: ['H₂O en medio ácido concentrado', 'H₂ gaseoso con catalizador metálico (Pt, Pd o Ni)', 'NaOH concentrado a reflujo', 'KMnO₄ en frío'],
              correctOptionIndex: 1,
              explanation: 'La hidrogenación catalítica de alquenos utiliza hidrógeno gaseoso absorbido sobre la superficie de metales de transición como platino o paladio.'
            }
          ]
        },
        {
          id: 'u4-l2',
          lessonNumber: '4.2',
          title: 'Reacciones de eliminación y la Regla de Zaitsev',
          durationMinutes: 25,
          keyIdea: 'Las reacciones de eliminación son el proceso inverso a las adiciones: una molécula pierde dos átomos o grupos de carbonos vecinos, generándose una insaturación (doble enlace). Ocurre típicamente al deshidratar alcoholes en medio ácido caliente (H₂SO₄) o al deshidrohalogenar haluros de alquilo con base fuerte. La Regla de Zaitsev (Saytzeff) establece que: "El producto mayoritario es el alqueno más estable, que corresponde al alqueno más sustituido (con más grupos alquilo unidos a los carbonos del doble enlace)".',
          appliedExample: 'Al calentar 2-butanol con ácido sulfúrico concentrado, se pueden formar dos alquenos: 1-buteno o 2-buteno. El 2-buteno es un alqueno disustituido (más estable), mientras que el 1-buteno es monosustituido. El 2-buteno se obtiene en más del 85% del rendimiento total.',
          practicalActivity: 'Plantea la reacción de deshidrohalogenación del 2-bromo-2-metilbutano en presencia de KOH alcohólico e identifica el producto mayoritario y el minoritario.',
          quickQuiz: [
            {
              id: 'q4-2-1',
              question: 'Según la regla de Zaitsev, ¿cuál de los siguientes alquenos es el más estable y producto mayoritario en una eliminación?',
              options: ['Alqueno no sustituido (eteno)', 'Alqueno monosustituido', 'Alqueno disustituido', 'Alqueno tetrasustituido'],
              correctOptionIndex: 3,
              explanation: 'Cuantos más grupos alquilo estén unidos a los carbonos del doble enlace, mayor es la hiperconjugación estabilizadora; por ende, tetrasustituido > trisustituido > disustituido > monosustituido.'
            },
            {
              id: 'q4-2-2',
              question: '¿Qué se obtiene al calentar etanol con exceso de ácido sulfúrico a 180 ºC?',
              options: ['Ácido etanoico', 'Eteno', 'Etano', 'Metiléter'],
              correctOptionIndex: 1,
              explanation: 'A 180 ºC ocurre la deshidratación intramolecular del etanol para formar eteno (etileno) y agua.'
            },
            {
              id: 'q4-2-3',
              question: '¿Qué base favorecería el producto de eliminación menos sustituido (producto Hofmann) frente al de Zaitsev por impedimento estérico?',
              options: ['Hidróxido de sodio (NaOH)', 'Ion metóxido (CH₃O⁻)', 'Terbutóxido de potasio (t-BuOK)', 'Amoníaco'],
              correctOptionIndex: 2,
              explanation: 'El terbutóxido es una base sumamente voluminosa; su tamaño le impide arrancar el protón más interno, viéndose obligada a extraer el protón del carbono menos impedido exterior.'
            }
          ]
        }
      ]
    },
    {
      id: 'u5',
      unitNumber: 5,
      title: 'Sustitución, Oxidación, Reducción y Condensación',
      summary: 'Descubre el repertorio de transformaciones funcionales que permiten sintetizar ésteres, amidas, ácidos y aldehídos.',
      lessons: [
        {
          id: 'u5-l1',
          lessonNumber: '5.1',
          title: 'Reacciones de esterificación y saponificación',
          durationMinutes: 25,
          keyIdea: 'La esterificación de Fischer es una reacción de condensación reversible en la que un ácido carboxílico reacciona con un alcohol en presencia de un catalizador ácido para dar un éster y agua. El proceso involucra el ataque nucleofílico del alcohol al carbono carbonílico activado. El proceso inverso en medio básico se denomina saponificación (hidrólisis alcalina de ésteres), que es irreversible y rinde la sal del ácido carboxílico (jabón) y el alcohol correspondiente.',
          appliedExample: 'La fabricación tradicional del jabón a partir de grasa animal o aceite de oliva y sosa cáustica (NaOH) es una reacción directa de saponificación de los triglicéridos (triésteres de glicerina).',
          practicalActivity: 'Escribe la ecuación química balanceada de la reacción entre el ácido etanoico (acético) y el 1-propanol en medio ácido, indicando el nombre del éster producido.',
          quickQuiz: [
            {
              id: 'q5-1-1',
              question: '¿Qué dos compuestos reaccionan en la esterificación de Fischer para generar un éster?',
              options: [
                'Un alcohol y una amina primaria',
                'Un ácido carboxílico y un alcohol',
                'Un aldehído y un haluro de alquilo',
                'Dos cetonas simétricas'
              ],
              correctOptionIndex: 1,
              explanation: 'Ácido carboxílico + alcohol ⇌ éster + agua, catalizado por un ácido inorgánico como H₂SO₄.'
            },
            {
              id: 'q5-1-2',
              question: '¿Qué compuesto resulta de la hidrólisis básica (saponificación) del acetato de etilo con NaOH?',
              options: [
                'Ácido acético y cloruro de etilo',
                'Acetato de sodio y etanol',
                'Etanol y dióxido de carbono',
                'Metanoato de sodio y acetona'
              ],
              correctOptionIndex: 1,
              explanation: 'El ataque del ion hidróxido libera la sal del ácido carboxílico (acetato de sodio) y el alcohol libre (etanol).'
            },
            {
              id: 'q5-1-3',
              question: '¿Por qué se añade a menudo un agente desecante o se retira agua durante una esterificación industrial?',
              options: [
                'Para evitar explosiones',
                'Para desplazar el equilibrio químico hacia la formación de productos según el principio de Le Chatelier',
                'Para acidificar la disolución',
                'Para inactivar el catalizador'
              ],
              correctOptionIndex: 1,
              explanation: 'Al ser un equilibrio reversible, la retirada continua de agua desplaza la reacción hacia el éster aumentando el rendimiento.'
            }
          ]
        },
        {
          id: 'u5-l2',
          lessonNumber: '5.2',
          title: 'Oxidación y reducción de alcoholes y compuestos carbonílicos',
          durationMinutes: 25,
          keyIdea: 'La oxidación en química orgánica implica un aumento en el número de enlaces C-O o una disminución de enlaces C-H. Los alcoholes primarios se oxidan primero a aldehídos y, con oxidantes fuertes (como KMnO₄ o K₂Cr₂O₇), continúan oxidándose a ácidos carboxílicos. Los alcoholes secundarios se oxidan exclusivamente a cetonas. Los alcoholes terciarios no se oxidan en condiciones suaves porque el carbono portador del grupo -OH carece de hidrógenos enlazados para abstraer. En sentido inverso, agentes reductores como NaBH₄ o LiAlH₄ reducen aldehídos y cetonas a sus alcoholes precursores.',
          appliedExample: 'El etilómetro utilizado por la policía de tráfico para medir la alcoholemia basaba históricamente su funcionamiento en la oxidación del etanol exhalado mediante una disolución anaranjada de dicromato potásico, que al reaccionar cambia visualmente a color verde por la formación de iones cromo(III).',
          practicalActivity: 'Indica qué productos se obtienen al someter 2-propanol y metanol a oxidación vigorosa con permanganato potásico en caliente.',
          quickQuiz: [
            {
              id: 'q5-2-1',
              question: '¿Qué se produce de forma directa al oxidar un alcohol secundario como el 2-butanol?',
              options: ['Un ácido carboxílico', 'Un aldehído', 'Una cetona (butanona)', 'Un éter disustituido'],
              correctOptionIndex: 2,
              explanation: 'La pérdida de los dos hidrógenos (uno del OH y otro del carbono C2) genera el enlace doble carbonilo C=O en posición interna, resultando en una cetona.'
            },
            {
              id: 'q5-2-2',
              question: '¿Por qué un alcohol terciario como el 2-metil-2-propanol es resistente a la oxidación suave?',
              options: [
                'Porque tiene demasiados carbonos',
                'Porque el carbono unido al grupo hidroxilo no tiene ningún hidrógeno enlazado',
                'Porque es un compuesto iónico',
                'Porque es sumamente ácido'
              ],
              correctOptionIndex: 1,
              explanation: 'Para que ocurra la deshidrogenación característica de la oxidación es imprescindible la presencia de un hidrógeno unido al carbono portador del oxígeno.'
            },
            {
              id: 'q5-2-3',
              question: '¿Qué reactivo se utiliza para reducir selectivamente una cetona a alcohol secundario?',
              options: ['Dicromato de potasio (K₂Cr₂O₇)', 'Tetrahidruroborato de sodio (NaBH₄)', 'Ácido sulfúrico fumante', 'Oxígeno puro'],
              correctOptionIndex: 1,
              explanation: 'El NaBH₄ es un reductor suave que aporta iones hidruro (H⁻) al carbono carbonílico electrofílico reduciéndolo a alcohol.'
            }
          ]
        }
      ]
    },
    {
      id: 'u6',
      unitNumber: 6,
      title: 'Polímeros, Biomoléculas y Estrategia EBAU',
      summary: 'Aterriza los conceptos en la síntesis de polímeros de adición y condensación, y domina la metodología analítica para resolver exámenes oficiales.',
      lessons: [
        {
          id: 'u6-l1',
          lessonNumber: '6.1',
          title: 'Polímeros de adición y de condensación en la vida moderna',
          durationMinutes: 25,
          keyIdea: 'Los polímeros son macromoléculas formadas por la unión repetitiva de pequeñas unidades llamadas monómeros. En los polímeros de adición, monómeros insaturados (con dobles enlaces como etileno, propileno, cloruro de vinilo o estireno) se abren y enlazan sucesivamente sin pérdida de ningún átomo secundario. En los polímeros de condensación, monómeros bifuncionales reaccionan entre sí liberando en cada unión una molécula pequeña (habitualmente agua o HCl). Ejemplos clave son el nailon-6,6 (poliamida) o el PET (poliéster).',
          appliedExample: 'El nailon de las cuerdas de escalada o los tejidos deportivos se produce uniendo hexametilendiamina (con dos grupos amina) y ácido adípico (con dos grupos carboxilo). Cada unión forma un enlace amida análogo al enlace peptídico que une los aminoácidos en las proteínas.',
          practicalActivity: 'Escribe la reacción de polimerización del cloruro de vinilo (cloroeteno) para formar policloruro de vinilo (PVC) e identifica la unidad repetitiva.',
          quickQuiz: [
            {
              id: 'q6-1-1',
              question: '¿Cuál es la principal diferencia entre una polimerización de adición y una de condensación?',
              options: [
                'La de adición usa catalizadores de oro',
                'La de condensación desprende una molécula pequeña (como agua) en cada unión, mientras que la de adición conserva todos los átomos',
                'La de adición solo ocurre en el espacio exterior',
                'La de condensación produce solo gases'
              ],
              correctOptionIndex: 1,
              explanation: 'En las polimerizaciones por condensación se forma un enlace covalente entre dos grupos funcionales con eliminación simultánea de agua u otra molécula pequeña.'
            },
            {
              id: 'q6-1-2',
              question: '¿Qué tipo de enlace covalente se forma al polimerizar un diácido con un diol para obtener PET?',
              options: ['Enlace peptídico', 'Enlace éster', 'Enlace éter', 'Enlace disulfuro'],
              correctOptionIndex: 1,
              explanation: 'La reacción entre grupos -COOH y -OH genera enlaces éster, resultando en un poliéster.'
            },
            {
              id: 'q6-1-3',
              question: '¿Cuál es el monómero de partida para la síntesis industrial del teflón (politetrafluoroetileno)?',
              options: ['Tetrafluoroeteno (CF₂=CF₂)', 'Fluorometano', 'Cloroformo', 'Difluorobenceno'],
              correctOptionIndex: 0,
              explanation: 'El tetrafluoroetileno polimeriza por apertura del doble enlace C=C rindiendo la cadena -(CF₂-CF₂)n- extraordinariamente inerte y antiadherente.'
            }
          ]
        },
        {
          id: 'u6-l2',
          lessonNumber: '6.2',
          title: 'Tácticas de resolución analítica de problemas tipo EBAU',
          durationMinutes: 30,
          keyIdea: 'Los problemas de química orgánica en las pruebas de acceso a la universidad suelen seguir un patrón deductivo: te proporcionan datos de análisis elemental cuantitativo para calcular la fórmula empírica y molecular; a continuación, describen reacciones de caracterización (como decoloración de bromo, reacción con Tollens o prueba de esterificación) para deducir la fórmula semidesarrollada y nombrar todos los compuestos. Para asegurar la máxima puntuación: 1) Escribe siempre todas las ecuaciones químicas completas y ajustadas; 2) Justifica explícitamente la presencia de isomería o centros quirales; 3) Cita textualmente la regla de Markovnikov o Zaitsev cuando predigas un producto mayoritario.',
          appliedExample: 'Un enunciado típico: "Un compuesto A (C₄H₈) reacciona con HBr para dar B mayoritario y C minoritario. Al tratar B con KOH acuoso se obtiene un alcohol D que no se oxida con dicromato. Deduce la estructura de A, B, C y D". Razonamiento: Al no oxidarse, D debe ser un alcohol terciario (2-metil-2-propanol); por tanto, A es el 2-metilpropeno.',
          practicalActivity: 'Resuelve el problema del ejemplo paso a paso en tu cuaderno, nombrando cada sustancia según la IUPAC y señalando si alguna presenta centros asimétricos.',
          quickQuiz: [
            {
              id: 'q6-2-1',
              question: 'Si un compuesto orgánico con fórmula C₃H₆O da positiva la prueba de Tollens (forma un espejo de plata), ¿de qué compuesto se trata?',
              options: ['Propanona (cetona)', 'Propanal (aldehído)', '1-Propanol', 'Ciclopropanol'],
              correctOptionIndex: 1,
              explanation: 'El reactivo de Tollens solo es reducido por los aldehídos, oxidándolos a ácidos carboxílicos y precipitando plata metálica brillante; las cetonas no reaccionan.'
            },
            {
              id: 'q6-2-2',
              question: 'Si un hidrocarburo decolora instantáneamente una disolución de bromo en tetracloruro de carbono sin luz UV, ¿qué indica?',
              options: [
                'La presencia de un enlace múltiple (insaturación carbono-carbono)',
                'Que es un alcano saturado de cadena lineal',
                'Que contiene un átomo de nitrógeno',
                'Que es agua destilada'
              ],
              correctOptionIndex: 0,
              explanation: 'El bromo se adiciona rápidamente al doble o triple enlace C=C / C≡C formando un derivado dibromado incoloro, siendo la prueba cualitativa clásica de insaturación.'
            },
            {
              id: 'q6-2-3',
              question: '¿Qué elemento clave jamás debe faltar al responder una pregunta sobre productos de adición a un alqueno asimétrico en un examen oficial?',
              options: [
                'Dibujar el matraz de vidrio',
                'Citar y justificar la Regla de Markovnikov con la estabilidad del carbocatión intermedio',
                'Calcular el coste económico de los reactivos',
                'Indicar el nombre del descubridor del bromo'
              ],
              correctOptionIndex: 1,
              explanation: 'Los correctores buscan explícitamente el nombre de la regla y la explicación mecanística basada en la estabilidad del intermediario reactivo.'
            }
          ]
        }
      ]
    }
  ],
  finalAssessment: [
    {
      id: 'fa-1',
      question: '¿Cuál es la hibridación y geometría esperada del carbono central en el ion formiato (HCOO⁻)?',
      options: [
        'sp³ y tetraédrica',
        'sp² y trigonal plana',
        'sp y lineal',
        'sp³d y bipiramidal'
      ],
      correctOptionIndex: 1,
      explanation: 'El carbono central forma tres enlaces sigma (uno con H y dos con los oxígenos deslocalizados por resonancia), adoptando hibridación sp² y disposición planar trigonal.'
    },
    {
      id: 'fa-2',
      question: '¿Cuál de los siguientes pares de sustancias representa isómeros de función?',
      options: [
        'Etanol y metoximetano (dimetiléter)',
        '1-Cloropropano y 2-cloropropano',
        'cis-2-Buteno y trans-2-buteno',
        'Butano y 2-metilpropano'
      ],
      correctOptionIndex: 0,
      explanation: 'Ambos tienen fórmula empírica C₂H₆O, pero uno es un alcohol (-OH) y el otro es un éter (-O-).'
    },
    {
      id: 'fa-3',
      question: '¿Cuántos estereoisómeros ópticamente activos tiene una molécula con un único carbono asimétrico?',
      options: ['1', '2 (un par de enantiómeros)', '4', '8'],
      correctOptionIndex: 1,
      explanation: 'Según la regla de Van\'t Hoff (2ⁿ), para n=1 centros quirales existen exactamente 2¹ = 2 estereoisómeros enantioméricos no superponibles.'
    },
    {
      id: 'fa-4',
      question: 'Al adicionar agua en medio ácido sulfúrico diluido al 1-metilciclohexeno, ¿cuál es el producto mayoritario obtenido?',
      options: [
        '1-Metilciclohexanol',
        '2-Metilciclohexanol',
        'Ciclohexilmetanol',
        'Cicloheptanol'
      ],
      correctOptionIndex: 0,
      explanation: 'Siguiendo la regla de Markovnikov, el protón se une al C2 (más hidrogenado) formando un carbocatión terciario en C1, donde entra el agua rindiendo el alcohol terciario 1-metilciclohexanol.'
    },
    {
      id: 'fa-5',
      question: '¿Qué reactivo y condiciones permiten deshidratar el 2-propanol para obtener propeno?',
      options: [
        'Ácido sulfúrico concentrado y calor (~170 ºC)',
        'Agua oxigenada a 0 ºC',
        'Sosa cáustica concentrada fría',
        'Disolución diluida de NaCl'
      ],
      correctOptionIndex: 0,
      explanation: 'El ácido sulfúrico actúa como catalizador y agente deshidratante a alta temperatura para promover la eliminación E1/E2 de agua.'
    },
    {
      id: 'fa-6',
      question: '¿Cuál es el producto principal de la reacción entre el ácido benzoico y el metanol con catálisis ácida?',
      options: ['Benzoato de metilo', 'Acetato de fenilo', 'Benzaldehído', 'Metilbenceno'],
      correctOptionIndex: 0,
      explanation: 'Es una clásica esterificación de Fischer entre un ácido carboxílico aromático y un alcohol primario.'
    },
    {
      id: 'fa-7',
      question: '¿Por qué el ácido cloroacético (Cl-CH₂-COOH) es más ácido que el ácido acético (CH₃-COOH)?',
      options: [
        'Porque el cloro tiene mayor masa atómica',
        'Por el efecto inductivo atractor de electrones (-I) del cloro, que estabiliza el anión carboxilato resultante',
        'Porque el cloro aporta electrones por resonancia al grupo carboxilo',
        'Porque se disuelve peor en agua'
      ],
      correctOptionIndex: 1,
      explanation: 'El cloro retira densidad electrónica a través de los enlaces sigma, dispersando la carga negativa del oxígeno desprotonado y aumentando la constante de acidez Ka.'
    },
    {
      id: 'fa-8',
      question: '¿Qué tipo de polímero es el polietileno de alta densidad (HDPE)?',
      options: [
        'Un polímero de adición obtenido a partir de eteno (etileno)',
        'Un polímero de condensación obtenido de glicol y diácido',
        'Una proteína globular sintética',
        'Un copolímero ramificado de condensación'
      ],
      correctOptionIndex: 0,
      explanation: 'Se obtiene por polimerización por adición y apertura del doble enlace del etileno, habitualmente mediante catalizadores Ziegler-Natta.'
    }
  ],
  finalProjects: [
    {
      id: 'proj-1',
      title: 'Dossier de Resolución Integral de Problemas EBAU de los Últimos 5 Años',
      description: 'Recopila y resuelve paso a paso 6 problemas reales de Química Orgánica extraídos de convocatorias de pruebas de acceso a la universidad de diferentes comunidades autónomas (con al menos 2 ejercicios de deducción de fórmulas, 2 de síntesis y 2 de isomería).',
      deliverable: 'Documento en PDF o cuaderno estructurado con enunciado, análisis de pistas, ecuaciones químicas completas balanceadas, justificación mecanística (Markovnikov/Zaitsev) y nombres IUPAC.',
      evaluationCriteria: [
        'Precisión en la nomenclatura sistemática IUPAC de todas las especies.',
        'Justificación rigurosa de los mecanismos e intermediarios carbocatiónicos.',
        'Claridad en la representación de fórmulas semidesarrolladas e isomería espacial.'
      ]
    },
    {
      id: 'proj-2',
      title: 'Mapa de Rutas de Síntesis Orgánica Multietapa',
      description: 'Diseña un póster conceptual o infografía técnica interactiva que conecte 12 grupos funcionales orgánicos diferentes mediante flechas de reacción directa (indicando reactivos, catalizadores, temperatura y reglas de selectividad aplicables).',
      deliverable: 'Póster esquemático digital o físico con tabla de reactivos y condiciones experimentales de laboratorio.',
      evaluationCriteria: [
        'Exactitud química en las condiciones de reacción (ácidos, bases, oxidantes y reductores).',
        'Inclusión de ejemplos con productos mayoritarios y minoritarios.',
        'Valor pedagógico y síntesis visual como herramienta de repaso rápido.'
      ]
    }
  ],
  sourcesAndReferences: [
    {
      title: 'Química Orgánica - L.G. Wade Jr. (Pearson Educación)',
      type: 'libro',
      description: 'El manual universitario de referencia internacional más didáctico, con explicaciones claras de mecanismos y problemas visuales de gran calidad.'
    },
    {
      title: 'Nomenclatura de las Sustancias Químicas - IUPAC Red Book & Blue Book',
      type: 'documentación oficial',
      description: 'Recomendaciones oficiales de la Unión Internacional de Química Pura y Aplicada para la nomenclatura y formulación sistemática.'
    },
    {
      title: 'Química 2º de Bachillerato - Ediciones Santillana / SM / Edebé',
      type: 'libro',
      description: 'Textos curriculares oficiales adaptados a las directrices de la EBAU y pruebas de acceso a la universidad en España.'
    },
    {
      title: 'Chemguide: Helping You to Understand Chemistry - Jim Clark',
      type: 'sitio web',
      description: 'Portal académico británico ampliamente reconocido por su claridad pedagógica en la explicación de mecanismos y reactividad orgánica.',
      url: 'https://www.chemguide.co.uk'
    },
    {
      title: 'LibreTexts Chemistry - Organic Chemistry Open Educational Resource',
      type: 'recurso académico',
      description: 'Repositorio abierto de química respaldado por la Universidad de California Davis con centenares de casos aplicados y ejercicios interactivos.',
      url: 'https://chem.libretexts.org'
    }
  ]
};
