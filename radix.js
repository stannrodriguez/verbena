/* ============================================================
   Radix — a herbarium of Latin roots
   Faithful implementation of the Radix design doc.

   Everything is local: no accounts, no analytics. Settings
   persist to localStorage; the rest lives for the session.
   ============================================================ */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     sprig(stage, w, h) — the growing-plant mark.
     Ported verbatim from the design's DCLogic.sprig, React ->
     inline SVG. stage 1 seedling … 4 in bloom (petals appear).
     ----------------------------------------------------------- */
  function sprig(stage, w, h) {
    const cx = w / 2;
    let s = `<path d="M ${cx} ${h - 4} C ${cx - 4} ${h * 0.62}, ${cx + 4} ${h * 0.34}, ${cx} ${h * 0.1}" stroke="#55643F" fill="none" stroke-width="1.3"/>`;
    const n = Math.min(stage, 3) * 2;
    for (let i = 0; i < n; i++) {
      const t = 0.82 - i * (0.55 / Math.max(n - 1, 1));
      const y = h * t, side = i % 2 ? 1 : -1, lx = cx + side * (w * 0.14);
      s += `<ellipse cx="${lx}" cy="${y}" rx="${w * 0.14}" ry="${w * 0.062}" fill="#55643F" opacity="0.8" transform="rotate(${side * -34} ${lx} ${y})"/>`;
    }
    if (stage >= 4) for (let p = 0; p < 5; p++) {
      const a = (p * 72 - 90) * Math.PI / 180;
      s += `<circle cx="${cx + Math.cos(a) * w * 0.07}" cy="${h * 0.1 + Math.sin(a) * w * 0.07}" r="${w * 0.045}" fill="#A56A54"/>`;
    }
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${s}</svg>`;
  }

  /* -----------------------------------------------------------
     The roots — the herbarium's specimens.
     ----------------------------------------------------------- */
  const ROOTS = {
    spect: {
      latin: 'spectāre', mean: 'to look, to watch', tag: 'learned', stage: 4,
      kids: 'inspect · respect · spectacle · circumspect',
      derivs: [
        ['inspect', 'in + spect — to look into'],
        ['respect', 're + spect — to look back at, regard'],
        ['suspect', 'sub + spect — to look at from below'],
        ['spectacle', 'spect + acle — a thing to look at'],
        ['retrospect', 'retro + spect — a look backward'],
        ['circumspect', 'circum + spect — looking around'],
      ],
      delight: 'A <em>speculum</em> is “a little looking-thing” — Romans named the mirror after the act.',
      planted: 'planted june 30 · reviewed 8 times · in bloom',
    },
    port: {
      latin: 'portāre', mean: 'to carry', tag: 'learned', stage: 4,
      kids: 'transport · import · portable · report',
      derivs: [
        ['transport', 'trans + port — to carry across'],
        ['import', 'in + port — to carry in'],
        ['export', 'ex + port — to carry out'],
        ['report', 're + port — to carry back'],
        ['portable', 'port + able — able to be carried'],
        ['support', 'sub + port — to carry from beneath'],
      ],
      delight: 'A <em>porter</em> carries your bags; a <em>portfolio</em> once meant leaves you carry.',
      planted: 'planted june 28 · reviewed 9 times · in bloom',
    },
    dic: {
      latin: 'dīcere', mean: 'to say, to speak', tag: 'learned', stage: 2,
      kids: 'dictate · predict · verdict · contradict',
      derivs: [
        ['dictate', 'dict + ate — to say for writing'],
        ['predict', 'pre + dict — to say beforehand'],
        ['verdict', 'ver + dict — a true saying'],
        ['contradict', 'contra + dict — to speak against'],
        ['dictionary', 'dict + ionary — a book of sayings'],
        ['edict', 'e + dict — an order spoken out'],
      ],
      delight: 'A <em>dictator</em> was one whose word alone was law — he only had to say it.',
      planted: 'planted july 12 · reviewed 3 times · growing',
    },
    duc: {
      latin: 'dūcere', mean: 'to lead', tag: 'learned', stage: 4,
      kids: 'conduct · produce · educate · duct',
      derivs: [
        ['conduct', 'con + duct — to lead together'],
        ['produce', 'pro + duce — to lead forth'],
        ['educate', 'e + duc — to lead out of ignorance'],
        ['induce', 'in + duce — to lead into'],
        ['reduce', 're + duce — to lead back'],
        ['aqueduct', 'aqua + duct — a leading of water'],
      ],
      delight: 'A <em>duke</em> (dux) was simply a leader; a <em>duct</em> leads air the same way.',
      planted: 'planted june 30 · reviewed 8 times · in bloom',
    },
    mitt: {
      latin: 'mittere', mean: 'to send', tag: 'learned', stage: 3,
      kids: 'transmit · submit · dismiss · mission',
      derivs: [
        ['transmit', 'trans + mitt — to send across'],
        ['submit', 'sub + mitt — to send under'],
        ['dismiss', 'dis + miss — to send away'],
        ['mission', 'miss + ion — a sending-forth'],
        ['admit', 'ad + mitt — to send toward, let in'],
        ['emit', 'e + mitt — to send out'],
      ],
      delight: 'A <em>missile</em> is simply “a thing sent”; a <em>message</em> is what’s sent.',
      planted: 'planted july 6 · reviewed 5 times · growing',
    },
    scrib: {
      latin: 'scrībere', mean: 'to write', tag: 'learned', stage: 2,
      kids: 'describe · inscribe · script · scribble',
      derivs: [
        ['describe', 'de + scrib — to write down'],
        ['inscribe', 'in + scrib — to write into'],
        ['prescribe', 'pre + scrib — to write beforehand'],
        ['script', 'script — a thing written'],
        ['subscribe', 'sub + scrib — to write one’s name under'],
        ['manuscript', 'manu + script — written by hand'],
      ],
      delight: 'A <em>scribe</em> wrote by hand; to <em>scribble</em> is writing gone wild.',
      planted: 'planted july 10 · reviewed 3 times · growing',
    },
    cap: {
      latin: 'capere', mean: 'to take, to seize', tag: 'unopened', stage: 2,
      kids: 'capture · concept · receive · capable',
      derivs: [
        ['capture', 'capt + ure — a taking'],
        ['concept', 'con + cept — a taking-together, in the mind'],
        ['receive', 're + cip — to take back'],
        ['capable', 'cap + able — able to take, to hold'],
        ['accept', 'ad + cept — to take toward oneself'],
        ['escape', 'ex + cape — to slip out of one’s cape'],
      ],
      delight: 'To <em>escape</em> is literally to leave your cape in the captor’s hands.',
      planted: 'not yet planted · unopened',
    },
    fer: {
      latin: 'ferre', mean: 'to bear, to carry', tag: 'unopened', stage: 1,
      kids: 'transfer · refer · fertile · relate',
      derivs: [
        ['transfer', 'trans + fer — to carry across'],
        ['refer', 're + fer — to carry back to'],
        ['fertile', 'fer + tile — bearing fruit'],
        ['confer', 'con + fer — to bring together'],
        ['offer', 'ob + fer — to carry toward'],
        ['prefer', 'pre + fer — to carry before, in favor'],
      ],
      delight: 'A <em>conifer</em> is a “cone-bearer”; roots turn up in the strangest woods.',
      planted: 'not yet planted · unopened',
    },
    vid: {
      latin: 'vidēre', mean: 'to see', tag: 'unopened', stage: 2,
      kids: 'video · evident · provide · vision',
      derivs: [
        ['video', 'vid + eo — I see'],
        ['evident', 'e + vid — seen out plainly'],
        ['provide', 'pro + vid — to see ahead'],
        ['vision', 'vis + ion — a seeing'],
        ['revise', 're + vis — to see again'],
        ['supervise', 'super + vis — to see from above'],
      ],
      delight: '<em>Déjà vu</em> — already seen — borrows the root the Romans watched with.',
      planted: 'not yet planted · unopened',
    },
    vert: {
      latin: 'vertere', mean: 'to turn', tag: 'unopened', stage: 1,
      kids: 'convert · reverse · versatile · vertigo',
      derivs: [
        ['convert', 'con + vert — to turn wholly'],
        ['reverse', 're + vers — to turn back'],
        ['versatile', 'vers + atile — turning easily'],
        ['divert', 'di + vert — to turn aside'],
        ['invert', 'in + vert — to turn upside down'],
        ['anniversary', 'anni + vers — the year’s turning'],
      ],
      delight: 'A <em>verse</em> turns at the line’s end, like a plough turning the furrow.',
      planted: 'not yet planted · unopened',
    },
    ten: {
      latin: 'tenēre', mean: 'to hold', tag: 'unopened', stage: 1,
      kids: 'contain · tenant · retain · tenacious',
      derivs: [
        ['contain', 'con + tain — to hold together'],
        ['retain', 're + tain — to hold back'],
        ['tenant', 'ten + ant — one who holds land'],
        ['tenacious', 'ten + acious — holding fast'],
        ['sustain', 'sub + tain — to hold up from beneath'],
        ['tenure', 'ten + ure — a holding'],
      ],
      delight: 'A <em>tenet</em> is a belief you hold; the <em>tenor</em> holds the melody’s line.',
      planted: 'not yet planted · unopened',
    },
    cur: {
      latin: 'currere', mean: 'to run', tag: 'unopened', stage: 1,
      kids: 'current · occur · cursor · excursion',
      derivs: [
        ['current', 'curr + ent — running, of water or now'],
        ['occur', 'ob + cur — to run toward, to befall'],
        ['cursor', 'curs + or — a runner across the screen'],
        ['excursion', 'ex + curs — a running-out, a trip'],
        ['recur', 're + cur — to run back, to happen again'],
        ['curriculum', 'curr + iculum — a course to run'],
      ],
      delight: 'A <em>courier</em> runs your message; a <em>corridor</em> is a running-place.',
      planted: 'not yet planted · unopened',
    },
  };
  const DETAILED_ORDER = ['spect', 'port', 'dic', 'duc', 'mitt', 'scrib', 'cap', 'fer', 'vid', 'vert', 'ten', 'cur'];

  /* The rest of the folio — [id, latin, meaning, [four derivatives]].
     Real Latin roots; each derivative genuinely descends from its root. */
  const MORE_ROOTS = [
    ['audi', 'audīre', 'to hear', ['audio', 'audible', 'audience', 'auditorium']],
    ['ven', 'venīre', 'to come', ['convene', 'invent', 'prevent', 'avenue']],
    ['voc', 'vocāre', 'to call', ['vocal', 'invoke', 'advocate', 'vocation']],
    ['fac', 'facere', 'to make, to do', ['factory', 'manufacture', 'faculty', 'benefactor']],
    ['jac', 'jacere', 'to throw', ['reject', 'project', 'inject', 'eject']],
    ['spir', 'spīrāre', 'to breathe', ['inspire', 'respire', 'conspire', 'expire']],
    ['grad', 'gradī', 'to step', ['gradual', 'progress', 'degrade', 'retrograde']],
    ['ced', 'cēdere', 'to go, to yield', ['precede', 'recede', 'proceed', 'concede']],
    ['flu', 'fluere', 'to flow', ['fluent', 'influence', 'fluid', 'superfluous']],
    ['struct', 'struere', 'to build', ['structure', 'construct', 'instruct', 'obstruct']],
    ['rupt', 'rumpere', 'to break', ['rupture', 'interrupt', 'erupt', 'corrupt']],
    ['tract', 'trahere', 'to drag, to pull', ['attract', 'extract', 'contract', 'subtract']],
    ['sent', 'sentīre', 'to feel', ['sentiment', 'consent', 'resent', 'dissent']],
    ['vol', 'velle', 'to wish', ['voluntary', 'benevolent', 'volition', 'malevolent']],
    ['cred', 'crēdere', 'to believe', ['credit', 'incredible', 'creed', 'credential']],
    ['nasc', 'nāscī', 'to be born', ['native', 'nascent', 'innate', 'renaissance']],
    ['mort', 'morī', 'to die', ['mortal', 'mortuary', 'immortal', 'mortician']],
    ['pon', 'pōnere', 'to place, to put', ['component', 'postpone', 'opponent', 'proponent']],
    ['sequ', 'sequī', 'to follow', ['sequel', 'consequence', 'sequence', 'subsequent']],
    ['tang', 'tangere', 'to touch', ['tangent', 'tangible', 'contingent', 'contact']],
    ['plic', 'plicāre', 'to fold', ['complicate', 'replicate', 'implicate', 'duplicate']],
    ['reg', 'regere', 'to rule, to guide', ['regent', 'direct', 'correct', 'regime']],
    ['solv', 'solvere', 'to loosen', ['solve', 'dissolve', 'resolve', 'absolve']],
    ['sci', 'scīre', 'to know', ['science', 'conscious', 'omniscient', 'prescient']],
    ['sta', 'stāre', 'to stand', ['stable', 'status', 'constant', 'stationary']],
    ['mov', 'movēre', 'to move', ['remove', 'motion', 'motive', 'commotion']],
    ['leg', 'legere', 'to read, to choose', ['legible', 'elect', 'collect', 'lecture']],
    ['nunc', 'nūntiāre', 'to announce', ['announce', 'pronounce', 'denounce', 'enunciate']],
    ['clud', 'claudere', 'to close', ['include', 'exclude', 'conclude', 'seclude']],
    ['flect', 'flectere', 'to bend', ['reflect', 'deflect', 'flexible', 'inflection']],
    ['pel', 'pellere', 'to drive', ['compel', 'repel', 'expel', 'propel']],
    ['pend', 'pendēre', 'to hang, to weigh', ['depend', 'suspend', 'pendant', 'appendix']],
    ['spond', 'spondēre', 'to pledge', ['respond', 'sponsor', 'correspond', 'despondent']],
    ['fund', 'fundere', 'to pour', ['refund', 'profuse', 'confound', 'fusion']],
    ['gen', 'genus', 'birth, kind', ['generate', 'genesis', 'genre', 'genetic']],
    ['lev', 'levāre', 'to lift, to lighten', ['elevate', 'relieve', 'alleviate', 'levity']],
    ['loc', 'locus', 'place', ['local', 'locate', 'dislocate', 'allocate']],
    ['luc', 'lūcēre', 'to shine', ['lucid', 'translucent', 'elucidate', 'lucent']],
    ['mand', 'mandāre', 'to order, to entrust', ['command', 'demand', 'mandate', 'remand']],
    ['nov', 'novus', 'new', ['novel', 'innovate', 'renovate', 'novice']],
    ['par', 'parāre', 'to prepare', ['prepare', 'repair', 'apparatus', 'preparation']],
    ['pat', 'patī', 'to suffer, to endure', ['patient', 'passion', 'compassion', 'passive']],
    ['ple', 'plēre', 'to fill', ['complete', 'supplement', 'deplete', 'replete']],
    ['prim', 'prīmus', 'first', ['primary', 'prime', 'primitive', 'primate']],
    ['sect', 'secāre', 'to cut', ['section', 'dissect', 'intersect', 'bisect']],
    ['serv', 'servāre', 'to keep, to save', ['preserve', 'conserve', 'reserve', 'observe']],
    ['sign', 'signum', 'sign, mark', ['signal', 'signature', 'design', 'assign']],
    ['tempor', 'tempus', 'time', ['temporary', 'contemporary', 'tempo', 'temporal']],
    ['terr', 'terra', 'earth, land', ['terrain', 'territory', 'terrestrial', 'subterranean']],
    ['tort', 'torquēre', 'to twist', ['distort', 'contort', 'torture', 'extort']],
    ['urb', 'urbs', 'city', ['urban', 'suburb', 'urbane', 'suburban']],
    ['vac', 'vacāre', 'to be empty', ['vacant', 'evacuate', 'vacuum', 'vacate']],
    ['viv', 'vīvere', 'to live', ['survive', 'revive', 'vivid', 'vivacious']],
    ['am', 'amāre', 'to love', ['amateur', 'amiable', 'enamored', 'amorous']],
    ['anim', 'anima', 'breath, spirit', ['animal', 'animate', 'unanimous', 'magnanimous']],
    ['aqua', 'aqua', 'water', ['aquarium', 'aquatic', 'aqueduct', 'aquamarine']],
    ['bene', 'bene', 'well, good', ['benefit', 'benevolent', 'benefactor', 'benediction']],
    ['brev', 'brevis', 'short', ['brief', 'abbreviate', 'brevity', 'breve']],
    ['capit', 'caput', 'head', ['capital', 'captain', 'decapitate', 'capitulate']],
    ['carn', 'carō', 'flesh', ['carnivore', 'incarnate', 'carnal', 'carnival']],
    ['cor', 'cor', 'heart', ['cordial', 'courage', 'accord', 'discord']],
    ['corp', 'corpus', 'body', ['corpse', 'corporate', 'incorporate', 'corps']],
    ['dent', 'dēns', 'tooth', ['dentist', 'dental', 'trident', 'indent']],
    ['domin', 'dominus', 'master, lord', ['dominate', 'dominion', 'predominant', 'domain']],
    ['equ', 'aequus', 'equal, level', ['equal', 'equator', 'equivalent', 'equity']],
    ['fin', 'fīnis', 'end, limit', ['final', 'finish', 'define', 'infinite']],
    ['firm', 'firmus', 'firm, strong', ['confirm', 'affirm', 'firmament', 'infirmary']],
    ['flor', 'flōs', 'flower', ['floral', 'flourish', 'florist', 'flora']],
    ['form', 'forma', 'shape', ['reform', 'transform', 'uniform', 'formation']],
    ['fort', 'fortis', 'strong', ['fortitude', 'fortress', 'effort', 'comfort']],
    ['frag', 'frangere', 'to break', ['fragile', 'fragment', 'fracture', 'fraction']],
    ['grat', 'grātus', 'pleasing, thankful', ['grateful', 'gratitude', 'congratulate', 'gratuity']],
    ['host', 'hostis', 'enemy, stranger', ['hostile', 'hostage', 'hospitable', 'host']],
    ['hum', 'humus', 'ground, earth', ['humble', 'humus', 'exhume', 'humiliate']],
    ['jud', 'jūdex', 'judge', ['judge', 'judicial', 'prejudice', 'judicious']],
    ['junct', 'jungere', 'to join', ['junction', 'conjunction', 'juncture', 'adjunct']],
    ['later', 'latus', 'side', ['lateral', 'bilateral', 'equilateral', 'collateral']],
    ['liber', 'līber', 'free', ['liberty', 'liberal', 'liberate', 'deliver']],
    ['lingu', 'lingua', 'tongue, language', ['language', 'linguist', 'bilingual', 'lingo']],
    ['liter', 'littera', 'letter', ['literate', 'literature', 'literal', 'obliterate']],
    ['magn', 'magnus', 'great, large', ['magnify', 'magnitude', 'magnificent', 'magnate']],
    ['man', 'manus', 'hand', ['manual', 'manage', 'manuscript', 'manipulate']],
    ['mar', 'mare', 'sea', ['marine', 'maritime', 'submarine', 'mariner']],
    ['matr', 'māter', 'mother', ['maternal', 'matron', 'matrimony', 'matriarch']],
    ['medi', 'medius', 'middle', ['medium', 'median', 'mediate', 'medieval']],
    ['mem', 'memor', 'mindful', ['memory', 'memorial', 'commemorate', 'memorable']],
    ['min', 'minor', 'less, smaller', ['minor', 'minimum', 'diminish', 'minority']],
    ['mon', 'monēre', 'to warn, to remind', ['monitor', 'admonish', 'premonition', 'summon']],
    ['nom', 'nōmen', 'name', ['nominate', 'nominal', 'denominate', 'ignominy']],
    ['omni', 'omnis', 'all', ['omnivore', 'omnipotent', 'omnipresent', 'omniscient']],
    ['pac', 'pāx', 'peace', ['pacify', 'pacific', 'pact', 'appease']],
    ['patr', 'pater', 'father', ['paternal', 'patriot', 'patron', 'patriarch']],
    ['ped', 'pēs', 'foot', ['pedal', 'pedestrian', 'impede', 'centipede']],
    ['pet', 'petere', 'to seek', ['appetite', 'compete', 'petition', 'impetus']],
    ['rex', 'rēx', 'king', ['regal', 'regalia', 'reign', 'interregnum']],
    ['rid', 'rīdēre', 'to laugh', ['ridicule', 'deride', 'ridiculous', 'derision']],
    ['rog', 'rogāre', 'to ask', ['interrogate', 'arrogant', 'prerogative', 'derogatory']],
    ['sal', 'salīre', 'to leap', ['salient', 'assail', 'resilient', 'somersault']],
  ];
  MORE_ROOTS.forEach((r, i) => {
    const id = r[0], latin = r[1], mean = r[2], kids = r[3];
    ROOTS[id] = {
      latin: latin, mean: mean, tag: i < 24 ? 'learned' : 'unopened', stage: 4,
      kids: kids.join(' · '),
      derivs: kids.map((w) => [w, 'from ' + latin]),
    };
  });
  const LIB_ORDER = DETAILED_ORDER.concat(MORE_ROOTS.map((r) => r[0]));

  /* Prefixes & suffixes — [form, meaning, examples] */
  const PREFIXES = [
    ['ab–', 'away, from', 'absent · abduct · abnormal'],
    ['ad–', 'to, toward', 'adhere · adjacent · advance'],
    ['ante–', 'before', 'antecedent · anterior · antebellum'],
    ['anti–', 'against', 'antidote · antibody · antisocial'],
    ['bi–', 'two', 'bicycle · bilateral · bisect'],
    ['circum–', 'around', 'circumference · circumspect · circumvent'],
    ['con–', 'with, together', 'connect · concur · construct'],
    ['contra–', 'against', 'contradict · contrast · contravene'],
    ['de–', 'down, from', 'descend · deduct · depart'],
    ['dis–', 'apart, not', 'disperse · dislike · disconnect'],
    ['ex–', 'out', 'exit · export · extract'],
    ['extra–', 'beyond', 'extraordinary · extract · extraterrestrial'],
    ['in–', 'in, into', 'include · inject · import'],
    ['in–', 'not', 'invisible · inactive · incapable'],
    ['inter–', 'between', 'interact · intersect · international'],
    ['intra–', 'within', 'intramural · intravenous · intranet'],
    ['mal–', 'bad', 'malfunction · malice · malnutrition'],
    ['mis–', 'wrong', 'mistake · misplace · misjudge'],
    ['non–', 'not', 'nonsense · nonstop · nonprofit'],
    ['ob–', 'against, toward', 'object · obstruct · obtain'],
    ['per–', 'through', 'perceive · persist · pervade'],
    ['post–', 'after', 'postpone · postscript · postwar'],
    ['pre–', 'before', 'predict · prevent · preview'],
    ['pro–', 'forward, for', 'proceed · project · promote'],
    ['re–', 'back, again', 'return · rewind · reflect'],
    ['retro–', 'backward', 'retrospect · retrograde · retroactive'],
    ['sub–', 'under', 'submarine · submit · subway'],
    ['super–', 'above', 'superior · supervise · superhuman'],
    ['trans–', 'across', 'transport · translate · transfer'],
    ['ultra–', 'beyond', 'ultraviolet · ultrasound · ultramodern'],
  ];
  const SUFFIXES = [
    ['–able', 'able to be', 'portable · readable · flexible'],
    ['–acy', 'state or quality', 'privacy · accuracy · democracy'],
    ['–al', 'relating to', 'natural · legal · musical'],
    ['–ance', 'state or action', 'importance · distance · guidance'],
    ['–ate', 'to make, to act', 'activate · educate · dominate'],
    ['–ence', 'state or quality', 'presence · silence · confidence'],
    ['–er', 'one who', 'teacher · builder · runner'],
    ['–fy', 'to make', 'clarify · simplify · purify'],
    ['–ic', 'relating to', 'historic · poetic · organic'],
    ['–ify', 'to make', 'beautify · identify · justify'],
    ['–ion', 'act or process', 'action · creation · tension'],
    ['–ism', 'doctrine, belief', 'realism · heroism · criticism'],
    ['–ist', 'one who', 'artist · scientist · novelist'],
    ['–ity', 'state or quality', 'clarity · gravity · unity'],
    ['–ive', 'tending to', 'active · creative · massive'],
    ['–ize', 'to make', 'realize · modernize · organize'],
    ['–ment', 'result or means', 'movement · argument · judgment'],
    ['–or', 'one who', 'actor · inventor · narrator'],
    ['–ous', 'full of', 'famous · nervous · curious'],
    ['–tion', 'act or state', 'motion · nation · relation'],
  ];

  /* The garden — pressed specimens, in the design's order. */
  const GARDEN = [
    { id: 'spect', tag: 'in bloom', stage: 4 }, { id: 'port', tag: 'in bloom', stage: 4 }, { id: 'duc', tag: 'in bloom', stage: 4 },
    { id: 'mitt', tag: 'growing', stage: 3 }, { id: 'scrib', tag: 'growing', stage: 2 }, { id: 'dic', tag: 'growing', stage: 2 },
    { id: 'cap', tag: 'growing', stage: 2 }, { id: 'fer', tag: 'dormant', stage: 1, dormant: true }, { id: 'vid', tag: 'dormant', stage: 2, dormant: true },
    { id: 'vert', tag: 'seedling', stage: 1 }, { id: 'ten', tag: 'seedling', stage: 1 }, { id: 'cur', tag: 'dormant', stage: 1, dormant: true },
  ];

  /* -----------------------------------------------------------
     Today's session — a queue of cards.
       decompose: reveal a word's roots
       compose:   assemble a meaning from prefix + root
     ----------------------------------------------------------- */
  const SESSION = [
    { type: 'decompose', word: 'circumspect',
      segs: [['circum', 'circum', 'around'], ['spect', 'spectāre', 'to look']],
      sense: 'Looking around before acting; careful, unhurried.' },
    { type: 'compose', meaning: '“to carry across”', word: 'transport',
      prefix: 'trans', answer: 'port', tray: ['port', 'duc', 'mitt', 'fer', 'scrib'] },
    { type: 'decompose', word: 'inspect',
      segs: [['in', 'in', 'into'], ['spect', 'spectāre', 'to look']],
      sense: 'To look closely into a thing.' },
    { type: 'compose', meaning: '“to send under — to yield”', word: 'submit',
      prefix: 'sub', answer: 'mitt', tray: ['mitt', 'duc', 'port', 'dic', 'fer'] },
    { type: 'decompose', word: 'eradicate',
      segs: [['e', 'ex', 'out'], ['radic', 'radix', 'root'], ['ate', '-āre', 'verb-maker']],
      sense: 'To pull out by the roots.' },
    { type: 'compose', meaning: '“to see ahead — to supply”', word: 'provide',
      prefix: 'pro', answer: 'vid', tray: ['vid', 'duc', 'spect', 'scrib', 'port'] },
    { type: 'decompose', word: 'conduct',
      segs: [['con', 'con', 'together'], ['duct', 'dūcere', 'to lead']],
      sense: 'To lead together — to guide or direct.' },
    { type: 'compose', meaning: '“to hold back — to keep”', word: 'retain',
      prefix: 're', answer: 'ten', tray: ['ten', 'mitt', 'vert', 'cur', 'port'] },
    { type: 'decompose', word: 'transcribe',
      segs: [['trans', 'trans', 'across'], ['scrib', 'scrībere', 'to write']],
      sense: 'To write out; to copy across.' },
  ];

  /* Tray tile labels are the combining forms. */
  const TILE_LABEL = { port: 'port', duc: 'duc', mitt: 'mitt', fer: 'fer', scrib: 'scrib', dic: 'dic', vid: 'vid', spect: 'spect', vert: 'vert', cur: 'cur', ten: 'ten' };

  /* -----------------------------------------------------------
     Persistent settings — everything lives on this device.
     ----------------------------------------------------------- */
  const KEY = 'radix.v1';
  const DEFAULTS = { newPerDay: 1, reviewsPerDay: 20 };
  function loadSettings() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function saveSettings() {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch (e) { /* private mode */ }
  }

  /* -----------------------------------------------------------
     App state
     ----------------------------------------------------------- */
  const state = {
    screen: 'today',
    session: { idx: 0, parsed: false, solved: false, wrong: false, done: false },
    gardenSel: 'spect',      // desktop side-panel selection
    lib: { q: '', cat: 'roots' },
    planted: 0,
  };
  let settings = loadSettings();

  const screenEl = document.getElementById('screen');
  const toastEl = document.getElementById('toast');
  const views = {};          // screen -> element
  let overlay = null;        // plate sheet

  const isDesktop = () => window.matchMedia('(min-width: 860px)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ===========================================================
     TODAY — session flow
     =========================================================== */
  function progressDots(n, total, doneCount) {
    let d = '';
    for (let i = 0; i < total; i++) {
      const cls = i < doneCount ? 'dot done' : (i === doneCount ? 'dot now' : 'dot');
      d += `<span class="${cls}"></span>`;
    }
    return `<div class="dots">${d}</div>`;
  }

  function renderToday() {
    const v = views.today;
    const s = state.session;

    if (s.done) { v.innerHTML = closingHTML(); wireClosing(v); return; }

    const item = SESSION[s.idx];
    const total = SESSION.length;
    const label = `today · ${s.idx + 1} of ${total}`;
    let inner;

    if (item.type === 'decompose') inner = decomposeHTML(item, s);
    else inner = composeHTML(item, s);

    v.innerHTML = `
      <div class="scroll">
        <div class="session">
          <div class="session-card">
            <div class="sess-head">
              <div class="eyebrow">${label}</div>
              ${progressDots(s.idx, total, s.idx)}
            </div>
            ${inner}
          </div>
        </div>
      </div>`;

    if (item.type === 'decompose') wireDecompose(v, item);
    else wireCompose(v, item);
  }

  function segHTML(seg, big) {
    const fs = big ? 46 : 46;
    return `
      <div class="seg">
        <div class="surface">${esc(seg[0])}</div>
        <div class="leader"></div>
        <div class="root">${esc(seg[1])}</div>
        <div class="gl">${esc(seg[2])}</div>
      </div>`;
  }

  function decomposeHTML(item, s) {
    if (!s.parsed) {
      return `
        <div class="stage-body">
          <div class="mode-label">decompose</div>
          <div class="whole">${esc(item.word)}</div>
          <div class="ask">What does it break into?</div>
        </div>
        <div class="foot">
          <button class="btn block" data-act="parse">Parse it</button>
        </div>`;
    }
    return `
      <div class="stage-body">
        <div class="mode-label">decompose</div>
        <div class="parse-row" data-parse>${item.segs.map((sg) => segHTML(sg)).join('')}</div>
        <div class="sense" data-sense>${esc(item.sense)}</div>
      </div>
      <div class="foot">
        <div class="rate">
          <button class="btn" data-rate="again">Again<small>tomorrow</small></button>
          <button class="btn leaf" data-rate="good">Good<small>4 days</small></button>
          <button class="btn" data-rate="easy">Easy<small>9 days</small></button>
        </div>
      </div>`;
  }

  function composeHTML(item, s) {
    const rootSlot = s.solved
      ? `<div class="slot-drop filled">${esc(TILE_LABEL[item.answer])}</div>`
      : `<div class="slot-drop${s.wrong ? ' wrong' : ''}" data-slot>root</div>`;
    const tiles = item.tray.map((id) => {
      const used = s.solved && id === item.answer;
      return `<button class="tile${used ? ' used' : ''}" data-tile="${id}">${esc(TILE_LABEL[id])}</button>`;
    }).join('');
    const cta = s.solved
      ? `<button class="btn leaf block" data-act="next-compose">${esc(item.word)} &nbsp;·&nbsp; continue</button>`
      : `<button class="btn block" disabled>Place a root to check</button>`;
    return `
      <div class="stage-body">
        <div class="mode-label">compose</div>
        <div class="compose-meaning">${esc(item.meaning)}</div>
        <div class="slots">
          <div class="slot-fixed">${esc(item.prefix)}</div>
          ${rootSlot}
        </div>
        <div class="tray-label">From the tray:</div>
        <div class="tray">${tiles}</div>
      </div>
      <div class="foot" style="display:flex;flex-direction:column;gap:10px">
        ${cta}
        <div class="hint-link"><a data-act="show-root">show me the root</a></div>
      </div>`;
  }

  function closingHTML() {
    return `
      <div class="scroll">
        <div class="session"><div class="session-card">
          <div class="closing">
            <div>${sprig(4, 64, 88)}</div>
            <div class="said">That’s the session.</div>
            <div class="motto">festina lente</div>
            <div class="trans">make haste slowly</div>
            <div class="divider"></div>
            <div class="tally">your garden: ${23 + state.planted} roots, 4 in bloom</div>
            <button class="btn leaf again" data-act="restart">Begin another</button>
          </div>
        </div></div>
      </div>`;
  }

  function advance() {
    const s = state.session;
    if (s.idx + 1 >= SESSION.length) { s.done = true; }
    else { s.idx++; }
    s.parsed = false; s.solved = false; s.wrong = false;
    renderToday();
  }

  function wireDecompose(v, item) {
    const parseBtn = v.querySelector('[data-act="parse"]');
    if (parseBtn) parseBtn.addEventListener('click', () => {
      state.session.parsed = true;
      renderToday();
      // trigger reveal animation next frame
      requestAnimationFrame(() => {
        const row = v.querySelector('[data-parse]');
        const sense = v.querySelector('[data-sense]');
        if (row) row.classList.add('revealed');
        if (sense) sense.classList.add('revealed');
      });
    });
    v.querySelectorAll('[data-rate]').forEach((b) =>
      b.addEventListener('click', () => { toast(rateWord(b.dataset.rate, item.word)); advance(); }));
    // if already parsed on (re)render, keep it revealed
    if (state.session.parsed) requestAnimationFrame(() => {
      const row = v.querySelector('[data-parse]'); const sense = v.querySelector('[data-sense]');
      if (row) row.classList.add('revealed'); if (sense) sense.classList.add('revealed');
    });
  }
  function rateWord(rate, word) {
    if (rate === 'again') return word + ' — again tomorrow';
    if (rate === 'easy') return word + ' — see you in 9 days';
    return word + ' — pressed. good.';
  }

  function wireCompose(v, item) {
    const s = state.session;
    v.querySelectorAll('[data-tile]').forEach((t) => t.addEventListener('click', () => {
      if (s.solved) return;
      if (t.dataset.tile === item.answer) {
        s.solved = true; s.wrong = false; renderToday();
      } else {
        s.wrong = true; renderToday();
        setTimeout(() => { s.wrong = false; }, 500);
      }
    }));
    const next = v.querySelector('[data-act="next-compose"]');
    if (next) next.addEventListener('click', advance);
    const show = v.querySelector('[data-act="show-root"]');
    if (show) show.addEventListener('click', () => openPlate('spect'));
  }

  function wireClosing(v) {
    const r = v.querySelector('[data-act="restart"]');
    if (r) r.addEventListener('click', () => {
      state.session = { idx: 0, parsed: false, solved: false, wrong: false, done: false };
      renderToday();
    });
  }

  /* ===========================================================
     GARDEN
     =========================================================== */
  function specimenHTML(p, selected) {
    return `
      <button class="specimen${p.dormant ? ' dormant' : ''}${selected ? ' sel' : ''}" data-root="${p.id}">
        ${sprig(p.stage, 52, 64)}
        <div class="lat-s">${esc(ROOTS[p.id].latin)}</div>
        <div class="tag">${esc(p.tag)}</div>
      </button>`;
  }

  function gardenHeadHTML() {
    return `
      <div class="garden-head">
        <div class="title">Garden</div>
        <div class="sub">Welcome back. The garden kept.</div>
        <div class="count">${12 + state.planted} roots · 3 in bloom · 3 dormant</div>
      </div>`;
  }

  function renderGarden() {
    const v = views.garden;
    const gridInner = GARDEN.map((p) => specimenHTML(p, isDesktop() && p.id === state.gardenSel)).join('');

    if (isDesktop()) {
      v.innerHTML = `
        <div class="garden-layout">
          <div class="garden-main">
            ${gardenHeadHTML()}
            <div class="garden-grid">${gridInner}</div>
          </div>
          <div class="garden-plate" id="gardenPlate">${plateHTML(state.gardenSel, { compact: true })}</div>
        </div>`;
      v.querySelectorAll('[data-root]').forEach((b) => b.addEventListener('click', () => {
        state.gardenSel = b.dataset.root;
        document.getElementById('gardenPlate').innerHTML = plateHTML(state.gardenSel, { compact: true });
        v.querySelectorAll('.specimen').forEach((s) => s.classList.remove('sel'));
        b.classList.add('sel');
      }));
    } else {
      v.innerHTML = `
        <div class="scroll">
          ${gardenHeadHTML()}
          <div class="garden-grid">${gridInner}</div>
        </div>`;
      v.querySelectorAll('[data-root]').forEach((b) =>
        b.addEventListener('click', () => openPlate(b.dataset.root)));
    }
  }

  /* ===========================================================
     SPECIMEN PLATE (shared)
     =========================================================== */
  function plateHTML(id, opts) {
    opts = opts || {};
    const r = ROOTS[id];
    const num = LIB_ORDER.indexOf(id) + 24;               // whimsical specimen numbering
    const roman = toRoman(num);
    const sprigMark = opts.compact ? sprig(4, 66, 92) : sprig(4, 84, 118);
    const derivs = r.derivs.map((d) => `
      <div class="deriv"><div class="w">${esc(d[0])}</div><div class="g">${esc(d[1])}</div></div>`).join('');
    return `
      <div class="plate">
        <div class="plate-top">
          <div>
            <div class="spec-label">radix · specimen ${roman} · verb</div>
            <div class="lat-big">${esc(r.latin)}</div>
            <div class="en">${esc(r.mean)}</div>
          </div>
          <div class="sprig">${sprigMark}</div>
        </div>
        <div class="derivs">${derivs}</div>
        ${r.delight ? `<div class="delight">
          <div class="tag">delight</div>
          <p>${r.delight}</p>
        </div>` : ''}
        ${opts.compact && r.planted ? `<div class="provenance">${esc(r.planted)}</div>` : ''}
      </div>`;
  }

  function toRoman(n) {
    const map = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
    let out = '';
    for (const [val, sym] of map) while (n >= val) { out += sym; n -= val; }
    return out;
  }

  /* Overlay plate sheet — used for taps on mobile & from Library. */
  function openPlate(id) {
    if (isDesktop() && state.screen === 'garden') {
      state.gardenSel = id; renderGarden(); return;
    }
    const r = ROOTS[id];
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'plate-overlay';
      screenEl.appendChild(overlay);
    }
    const isRod = id === 'spect';
    overlay.innerHTML = `
      <div class="scroll">
        <div class="rod-head">
          <div class="eyebrow">${isRod ? 'root of the day' : 'specimen'}</div>
        </div>
        <div class="rod-plate-wrap">${plateHTML(id)}</div>
        <div class="rod-foot" style="display:flex;flex-direction:column;gap:10px">
          <button class="btn leaf block" data-act="plant">Plant it</button>
          <button class="btn block" data-act="close-plate">Back</button>
        </div>
      </div>`;
    overlay.classList.add('show');
    overlay.querySelector('[data-act="plant"]').addEventListener('click', () => {
      state.planted++; toast(r.latin + ' — planted'); closePlate();
    });
    overlay.querySelector('[data-act="close-plate"]').addEventListener('click', closePlate);
  }
  function closePlate() { if (overlay) overlay.classList.remove('show'); }

  /* ===========================================================
     LIBRARY
     =========================================================== */
  const CATS = [
    { key: 'roots', label: 'roots', count: () => LIB_ORDER.length },
    { key: 'prefixes', label: 'prefixes', count: () => PREFIXES.length },
    { key: 'suffixes', label: 'suffixes', count: () => SUFFIXES.length },
  ];

  function libCardHTML(id) {
    const r = ROOTS[id];
    const unopened = r.tag === 'unopened';
    return `
      <button class="lib-card${unopened ? ' unopened' : ''}" data-root="${id}">
        <div class="r-top">
          <div class="r-latin">${esc(r.latin)}</div>
          <div class="r-tag">${esc(r.tag)}</div>
        </div>
        <div class="r-mean">${esc(r.mean)}</div>
        <div class="r-kids">${esc(r.kids)}</div>
      </button>`;
  }

  function affixCardHTML(a) {
    return `
      <div class="lib-card affix">
        <div class="r-top"><div class="r-latin">${esc(a[0])}</div></div>
        <div class="r-mean">${esc(a[1])}</div>
        <div class="r-kids">${esc(a[2])}</div>
      </div>`;
  }

  function libGridHTML() {
    const q = state.lib.q.trim().toLowerCase();
    if (state.lib.cat === 'roots') {
      const ids = q
        ? LIB_ORDER.filter((id) => (ROOTS[id].latin + ' ' + ROOTS[id].mean + ' ' + ROOTS[id].kids).toLowerCase().includes(q))
        : LIB_ORDER.slice();
      return ids.length ? ids.map(libCardHTML).join('') : libEmpty();
    }
    const src = state.lib.cat === 'prefixes' ? PREFIXES : SUFFIXES;
    const items = q ? src.filter((a) => a.join(' ').toLowerCase().includes(q)) : src;
    return items.length ? items.map(affixCardHTML).join('') : libEmpty();
  }
  function libEmpty() { return `<div class="lib-empty">Nothing in the folio matches “${esc(state.lib.q)}”.</div>`; }

  function renderLibrary() {
    const v = views.library;
    const cats = CATS.map((c) =>
      `<button class="lib-cat${c.key === state.lib.cat ? ' active' : ''}" data-cat="${c.key}">${c.label} · ${c.count()}</button>`).join('');

    v.innerHTML = `
      <div class="lib-wrap">
        <div class="lib-head">
          <div><div class="title">Library</div><div class="sub">A folio of roots, prefixes and suffixes.</div></div>
          <div class="lib-search">
            <span class="eyebrow faint">⌕</span>
            <input type="search" id="libq" placeholder="Search roots, prefixes, suffixes" value="${esc(state.lib.q)}" autocomplete="off">
          </div>
        </div>
        <div class="lib-cats">${cats}</div>
        <div class="scroll" style="flex:1">
          <div class="lib-grid">${libGridHTML()}</div>
        </div>
      </div>`;

    const input = v.querySelector('#libq');
    input.addEventListener('input', () => {
      state.lib.q = input.value;
      v.querySelector('.lib-grid').innerHTML = libGridHTML();   // re-render grid, keep focus
      wireLibCards(v);
    });
    v.querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => {
      state.lib.cat = b.dataset.cat; renderLibrary();
    }));
    wireLibCards(v);
  }
  function wireLibCards(v) {
    v.querySelectorAll('[data-root]').forEach((b) =>
      b.addEventListener('click', () => openPlate(b.dataset.root)));
  }

  /* ===========================================================
     SETTINGS
     =========================================================== */
  /* The four screens, explained in the herbarium's voice. */
  const ABOUT_SCREENS = [
    ['Today', 'A short session of cards. <em>Decompose</em> reveals the roots hidden inside a word; <em>Compose</em> asks you to build one from a prefix and a root. Rate how well it came back — <b>Again</b>, <b>Good</b>, or <b>Easy</b> — and the next review is scheduled for you.'],
    ['Garden', 'Every root you plant is pressed here like a specimen, drawn as a plant that grows from seedling to bloom as you review it. Let one lapse and it goes dormant, waiting to be tended again.'],
    ['Library', 'The whole folio — 110 Latin roots, 30 prefixes, 20 suffixes — to browse and search. Tap any root to open its plate: its family of derivatives and a small etymological delight.'],
  ];

  function aboutHTML() {
    const grow = [1, 2, 3, 4].map((st) => `<span class="grow-step">${sprig(st, 34, 46)}</span>`).join('');
    const steps = ABOUT_SCREENS.map(([name, body]) => `
      <div class="about-item">
        <div class="about-name">${name}</div>
        <p>${body}</p>
      </div>`).join('');
    return `
      <div class="about-head">
        <div class="eyebrow">radix · about</div>
        <div class="title">A herbarium of roots</div>
        <p class="about-lede">Most English words grow from Latin roots. Radix teaches you to see them — to press a word like a specimen, read the roots within, and grow a garden of what you know.</p>
      </div>
      <div class="about-grow">
        ${grow}
        <div class="about-grow-cap">seedling → in bloom, as a root is reviewed</div>
      </div>
      <div class="about-list">${steps}</div>
      <div class="about-note">
        <div class="tag">the method</div>
        <p>Radix uses <em>spaced review</em>: roots you know well return rarely, ones you stumble on return soon. One new root a day is plenty — each brings its whole family with it. Everything lives on this device: no accounts, no analytics.</p>
      </div>`;
  }

  function renderSettings() {
    const v = views.settings;
    v.innerHTML = `
      <div class="scroll">
        <div class="set-wrap">
          ${aboutHTML()}
          <div class="set-head"><div class="title">Settings</div></div>
          <div class="set-list">
            <div class="set-row">
              <div><div class="label">New roots per day</div><div class="hint">One is plenty; each root brings its family.</div></div>
              <div class="stepper">
                <button class="step-btn" data-step="new" data-dir="-1" aria-label="fewer">−</button>
                <div class="step-val" id="v-new">${settings.newPerDay}</div>
                <button class="step-btn" data-step="new" data-dir="1" aria-label="more">+</button>
              </div>
            </div>
            <div class="set-row">
              <div><div class="label">Reviews per day</div><div class="hint">Overflow waits quietly for tomorrow.</div></div>
              <div class="stepper">
                <button class="step-btn" data-step="rev" data-dir="-1" aria-label="fewer">−</button>
                <div class="step-val" id="v-rev">${settings.reviewsPerDay}</div>
                <button class="step-btn" data-step="rev" data-dir="1" aria-label="more">+</button>
              </div>
            </div>
            <div class="set-row">
              <div><div class="label">Progress</div><div class="hint">Everything lives on this device.</div></div>
              <div class="set-actions">
                <button class="mini-btn" data-act="export">Export</button>
                <button class="mini-btn" data-act="import">Import</button>
              </div>
            </div>
            <div class="set-row">
              <div><div class="label">Start over</div><div class="hint">Clears the garden. Asks twice.</div></div>
              <button class="mini-btn danger" data-act="reset">Reset</button>
            </div>
          </div>
          <div class="set-foot">
            radix · local only · no accounts, no analytics<br>
            <a href="styleguide.html">visual system</a>
          </div>
        </div>
      </div>
      <input type="file" id="importFile" accept="application/json" hidden>`;

    v.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
      const dir = parseInt(b.dataset.dir, 10);
      if (b.dataset.step === 'new') {
        settings.newPerDay = clamp(settings.newPerDay + dir, 0, 20);
        v.querySelector('#v-new').textContent = settings.newPerDay;
      } else {
        settings.reviewsPerDay = clamp(settings.reviewsPerDay + dir, 0, 200);
        v.querySelector('#v-rev').textContent = settings.reviewsPerDay;
      }
      saveSettings();
    }));

    v.querySelector('[data-act="export"]').addEventListener('click', exportProgress);
    const fileInput = v.querySelector('#importFile');
    v.querySelector('[data-act="import"]').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => importProgress(e.target.files[0]));

    let armed = false;
    const resetBtn = v.querySelector('[data-act="reset"]');
    resetBtn.addEventListener('click', () => {
      if (!armed) { armed = true; resetBtn.textContent = 'Really reset?'; toast('tap again to clear the garden'); setTimeout(() => { armed = false; resetBtn.textContent = 'Reset'; }, 3000); return; }
      settings = Object.assign({}, DEFAULTS); saveSettings(); state.planted = 0;
      renderSettings(); toast('garden cleared');
    });
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function exportProgress() {
    const blob = new Blob([JSON.stringify({ settings, planted: state.planted }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'radix-garden.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('garden exported');
  }
  function importProgress(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.settings) settings = Object.assign({}, DEFAULTS, data.settings);
        if (typeof data.planted === 'number') state.planted = data.planted;
        saveSettings(); renderSettings(); toast('garden imported');
      } catch (e) { toast('could not read that file'); }
    };
    reader.readAsText(file);
  }

  /* ===========================================================
     Router / boot
     =========================================================== */
  const RENDERERS = { today: renderToday, garden: renderGarden, library: renderLibrary, settings: renderSettings };

  function buildViews() {
    ['today', 'garden', 'library', 'settings'].forEach((name) => {
      const el = document.createElement('div');
      el.className = 'view';
      el.dataset.screen = name;
      screenEl.appendChild(el);
      views[name] = el;
    });
  }

  function show(screen) {
    if (!RENDERERS[screen]) screen = 'today';
    state.screen = screen;
    closePlate();
    RENDERERS[screen]();
    Object.keys(views).forEach((k) => views[k].classList.toggle('is-active', k === screen));
    document.querySelectorAll('.tab, .tlink').forEach((b) =>
      b.classList.toggle('active', b.dataset.tab === screen));
    if (location.hash !== '#/' + screen) history.replaceState(null, '', '#/' + screen);
  }

  function routeFromHash() {
    const m = (location.hash || '').match(/^#\/(\w+)/);
    show(m ? m[1] : 'today');
  }

  function init() {
    buildViews();
    document.querySelectorAll('.tab, .tlink').forEach((b) =>
      b.addEventListener('click', () => show(b.dataset.tab)));
    document.querySelector('.wordmark').addEventListener('click', (e) => { e.preventDefault(); show('today'); });
    window.addEventListener('hashchange', routeFromHash);

    // Re-render current screen on breakpoint changes (garden layout differs)
    let wasDesktop = isDesktop();
    window.addEventListener('resize', () => {
      const now = isDesktop();
      if (now !== wasDesktop) { wasDesktop = now; RENDERERS[state.screen](); }
    });

    routeFromHash();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
