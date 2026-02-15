export interface Rule {
  id: number;
  description: string;
  validate: (password: string) => boolean;
  hint?: string;
}

const COUNTRIES = [
  "afghanistan","albania","algeria","andorra","angola","argentina","armenia","australia",
  "austria","azerbaijan","bahamas","bahrain","bangladesh","barbados","belarus","belgium",
  "belize","benin","bhutan","bolivia","bosnia","botswana","brazil","brunei","bulgaria",
  "burkina","burundi","cambodia","cameroon","canada","chad","chile","china","colombia",
  "comoros","congo","costa rica","croatia","cuba","cyprus","czech","denmark","djibouti",
  "dominica","ecuador","egypt","eritrea","estonia","ethiopia","fiji","finland","france",
  "gabon","gambia","georgia","germany","ghana","greece","grenada","guatemala","guinea",
  "guyana","haiti","honduras","hungary","iceland","india","indonesia","iran","iraq",
  "ireland","israel","italy","jamaica","japan","jordan","kazakhstan","kenya","kiribati",
  "korea","kosovo","kuwait","kyrgyzstan","laos","latvia","lebanon","lesotho","liberia",
  "libya","liechtenstein","lithuania","luxembourg","madagascar","malawi","malaysia",
  "maldives","mali","malta","mauritania","mauritius","mexico","micronesia","moldova",
  "monaco","mongolia","montenegro","morocco","mozambique","myanmar","namibia","nauru",
  "nepal","netherlands","new zealand","nicaragua","niger","nigeria","norway","oman",
  "pakistan","palau","palestine","panama","papua","paraguay","peru","philippines","poland",
  "portugal","qatar","romania","russia","rwanda","samoa","san marino","saudi arabia",
  "senegal","serbia","seychelles","sierra leone","singapore","slovakia","slovenia",
  "solomon","somalia","south africa","spain","sri lanka","sudan","suriname","sweden",
  "switzerland","syria","taiwan","tajikistan","tanzania","thailand","togo","tonga",
  "trinidad","tunisia","turkey","turkmenistan","tuvalu","uganda","ukraine",
  "united arab emirates","united kingdom","united states","uruguay","uzbekistan",
  "vanuatu","vatican","venezuela","vietnam","yemen","zambia","zimbabwe"
];

const CHESS_MOVES = [
  "e4","d4","nf3","nc3","bb5","bc4","o-o","qd1","re1","bf4","bg5","nd5","ne5",
  "c4","f4","g3","b3","a4","h4","e5","d5","c5","f5","nf6","nc6","bb4","bc5",
  "be7","bd6","bg7","ke2","kd2","qe2","qf3","ra1","rg1","bxc6","nxe5","exd5",
  "cxd4","fxe4","gxf3","axb5","hxg5","o-o-o","qh5","qg4","qa4","rb1","rd1",
  "rf1","bh6","ng5","nh4","nb5","na4","nd2","ne2","nge2",
];

const PERIODIC_ELEMENTS = [
  "h","he","li","be","b","c","n","o","f","ne","na","mg","al","si","p","s","cl",
  "ar","k","ca","sc","ti","v","cr","mn","fe","co","ni","cu","zn","ga","ge","as",
  "se","br","kr","rb","sr","y","zr","nb","mo","tc","ru","rh","pd","ag","cd","in",
  "sn","sb","te","i","xe","cs","ba","la","ce","pr","nd","pm","sm","eu","gd","tb",
  "dy","ho","er","tm","yb","lu","hf","ta","w","re","os","ir","pt","au","hg","tl",
  "pb","bi","po","at","rn","fr","ra","ac","th","pa","u","np","pu","am","cm","bk",
  "cf","es","fm","md","no","lr","rf","db","sg","bh","hs","mt","ds","rg","cn","nh",
  "fl","mc","lv","ts","og"
];

const MOON_EMOJIS = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];

function getMoonPhaseEmoji(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // Simple moon phase calculation
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.53058867;
  const phaseIndex = Math.round((phase - Math.floor(phase)) * 8) % 8;
  
  return MOON_EMOJIS[phaseIndex];
}

export function getTodaysMoonEmoji(): string {
  return getMoonPhaseEmoji();
}

function sumOfDigits(s: string): number {
  return s.split('').reduce((sum, ch) => {
    const n = parseInt(ch);
    return isNaN(n) ? sum : sum + n;
  }, 0);
}

function containsRomanNumeral(s: string): boolean {
  return /(?:^|[^a-zA-Z])(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{1,3})(?=[^a-zA-Z]|$)/i.test(s);
}

function containsCountry(s: string): boolean {
  const lower = s.toLowerCase();
  return COUNTRIES.some(c => lower.includes(c));
}

function containsChessMove(s: string): boolean {
  const lower = s.toLowerCase();
  return CHESS_MOVES.some(m => lower.includes(m));
}

function containsPeriodicElement(s: string): boolean {
  const lower = s.toLowerCase();
  return PERIODIC_ELEMENTS.some(el => {
    const idx = lower.indexOf(el);
    return idx !== -1;
  });
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function containsLeapYear(s: string): boolean {
  const years = s.match(/\d{4}/g);
  if (!years) return false;
  return years.some(y => {
    const n = parseInt(y);
    return n > 0 && n < 3000 && (n % 400 === 0 || (n % 4 === 0 && n % 100 !== 0));
  });
}

export const rules: Rule[] = [
  {
    id: 1,
    description: "Your password must be at least 5 characters",
    validate: (p) => p.length >= 5,
  },
  {
    id: 2,
    description: "Your password must include a number",
    validate: (p) => /\d/.test(p),
  },
  {
    id: 3,
    description: "Your password must include an uppercase letter",
    validate: (p) => /[A-Z]/.test(p),
  },
  {
    id: 4,
    description: "Your password must include a special character (!@#$%^&*)",
    validate: (p) => /[!@#$%^&*]/.test(p),
  },
  {
    id: 5,
    description: "Your password must contain a Roman numeral (I, V, X, L, C, D, M)",
    validate: containsRomanNumeral,
    hint: "e.g. VII, XIV, etc.",
  },
  {
    id: 6,
    description: "The digits in your password must add up to 25",
    validate: (p) => sumOfDigits(p) === 25,
    hint: "Add up all the numbers. They need to equal exactly 25.",
  },
  {
    id: 7,
    description: "Your password must include a month of the year",
    validate: (p) => {
      const months = ["january","february","march","april","may","june","july",
        "august","september","october","november","december"];
      const lower = p.toLowerCase();
      return months.some(m => lower.includes(m));
    },
  },
  {
    id: 8,
    description: "Your password must contain the name of a country",
    validate: containsCountry,
    hint: "Any recognized country works.",
  },
  {
    id: 9,
    description: "Your password must include a chess move in algebraic notation",
    validate: containsChessMove,
    hint: "e.g. e4, Nf3, O-O, Bb5",
  },
  {
    id: 10,
    description: "Your password must contain a periodic table element symbol",
    validate: containsPeriodicElement,
    hint: "e.g. Fe, Au, He, Na (case insensitive)",
  },
  {
    id: 11,
    description: "Your password must be at least 30 characters long",
    validate: (p) => p.length >= 30,
  },
  {
    id: 12,
    description: "Your password must contain a leap year",
    validate: containsLeapYear,
    hint: "Include a 4-digit leap year like 2024, 2000, etc.",
  },
  {
    id: 13,
    description: `Your password must include today's moon phase emoji: ${getMoonPhaseEmoji()}`,
    validate: (p) => p.includes(getMoonPhaseEmoji()),
    hint: "Copy and paste it!",
  },
  {
    id: 14,
    description: "The length of your password must be a prime number",
    validate: (p) => isPrime(p.length),
    hint: "Prime numbers: 31, 37, 41, 43, 47...",
  },
  {
    id: 15,
    description: "Your password must contain at least 3 words (spaces count!)",
    validate: (p) => wordCount(p) >= 3,
  },
  {
    id: 16,
    description: "Your password must include a hex color code (e.g. #ff00aa)",
    validate: (p) => /#[0-9a-fA-F]{6}/.test(p),
  },
  {
    id: 17,
    description: "Your password must contain the word 'password'",
    validate: (p) => p.toLowerCase().includes("password"),
    hint: "Yes, really. Include the word 'password' in your password.",
  },
  {
    id: 18,
    description: "Your password must include an emoji (any emoji)",
    validate: (p) => /\p{Emoji_Presentation}/u.test(p),
  },
];
