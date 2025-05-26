export const testQuestions = [
  {
    question: "Цього дня я хочу почуватися ...",
    options: [
      {
        text: "легко та безтурботно",
        image: require("../assets/images/test/relief.png"),
        result: { mood: "calm", color: 1 },
      },
      {
        text: "енергійно та драйвово",
        image: require("../assets/images/test/active.png"),
        result: { mood: "dynamic", color: 2 },
      },
      {
        text: "спокійно і впевнено",
        image: require("../assets/images/test/role-model.png"),
        result: { mood: "confident", color: 2 },
      },
      {
        text: "мрійливо та ніжно",
        image: require("../assets/images/test/ticket.png"),
        result: { mood: "romantic", color: 1 },
      },
    ],
  },
  {
    question: "Який вайб ти наслідуєш?",
    options: [
      {
        text: "містична загадковість",
        image: require("../assets/images/test/mysterious.png"),
        result: { style: "romaitic" },
      },
      {
        text: "природна простота",
        image: require("../assets/images/test/growth.png"),
        result: { style: "casual" },
      },
      {
        text: "витонченість і стриманість",
        image: require("../assets/images/test/vintage.png"),
        result: { style: "minimalist" },
      },
      {
        text: "елегантна розкіш",
        image: require("../assets/images/test/actress.png"),
        result: { style: "classic" },
      },
    ],
  },
  {
    question: "Як би ти описав(-ла) свій бажаний ритм?",
    options: [
      {
        text: "плавний і рівний",
        image: require("../assets/images/test/calm.png"),
        result: { pattern: "plain" },
      },
      {
        text: "з чітким пульсом",
        image: require("../assets/images/test/busy.png"),
        result: { pattern: "striped" },
      },
      {
        text: "органічний і хаотичний",
        image: require("../assets/images/test/employee.png"),
        result: { pattern: "tiedyed" },
      },
      {
        text: "ритмічний і повторюваний",
        image: require("../assets/images/test/metronome.png"),
        result: { pattern: "checked" },
      },
    ],
  },
  {
    question: "Музика твого дня — яка вона?",
    options: [
      {
        text: "lo-fi",
        image: require("../assets/images/test/chill-out.png"),
        result: { formality: "casual" },
      },
      {
        text: "джаз",
        image: require("../assets/images/test/jazz.png"),
        result: { formality: "semiformal" },
      },
      {
        text: "диско",
        image: require("../assets/images/test/disco-ball.png"),
        result: { formality: "casual" },
      },
      {
        text: "симфонія",
        image: require("../assets/images/test/grand-piano.png"),
        result: { formality: "formal" },
      },
    ],
  },
  {
    question: "Яке місце найбільше підходить?",
    options: [
      {
        text: "місце для натхнення і спокою",
        image: require("../assets/images/test/shelf.png"),
        result: { purpose: "home_party" },
      },
      {
        text: "зустрічі з друзями",
        image: require("../assets/images/test/park.png"),
        result: { purpose: "walk" },
      },
      {
        text: "офіс або важливі справи",
        image: require("../assets/images/test/workspace.png"),
        result: { purpose: "office_job" },
      },
      {
        text: "нічне місто або вечірка",
        image: require("../assets/images/test/dance.png"),
        result: { purpose: "going_out" },
      },
    ],
  },
  {
    question: "Які у тебе плани на цей день?",
    options: [
      {
        text: "повна свобода і комфорт",
        image: require("../assets/images/test/yoga-pose.png"),
        result: { material: "cotton" },
      },
      {
        text: "щось тепле і м’яке",
        image: require("../assets/images/test/comfort.png"),
        result: { material: "cashmere" },
      },
      {
        text: "легкість і дихаючі тканини",
        image: require("../assets/images/test/hot.png"),
        result: { material: "linen" },
      },
      {
        text: "захист і функціональність",
        image: require("../assets/images/test/wind.png"),
        result: { material: "nylon" },
      },
    ],
  },
  {
    question: "Бажана сезоність",
    options: [
      {
        text: "тепло, сонячно",
        image: require("../assets/images/test/sun.png"),
        result: { season: "summer" },
      },
      {
        text: "прохолодна весна/осінь",
        image: require("../assets/images/test/old-woman.png"),
        result: { season: "spring" },
      },
      {
        text: "похмуро і вітряно",
        image: require("../assets/images/test/windy.png"),
        result: { season: "fall" },
      },
      {
        text: "морози і сніг",
        image: require("../assets/images/test/cold.png"),
        result: { season: "winter" },
      },
    ],
  },
  {
    question: "Враховуємо погоду,",
    options: [
      {
        text: "Так",
        image: require("../assets/images/test/conditions.png"),
        result: {
          weather: 1,
        },
      },
      {
        text: "Ні",
        image: require("../assets/images/test/no-sun.png"),
        result: {
          weather: 0,
        },
      },
    ],
  },
];
