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
    question: "Який сьогодні у тебе вайб?",
    options: [
      {
        text: "загадковість",
        image: require("../assets/images/test/mysterious.png"),
        result: { style: "romaitic" },
      },
      {
        text: "простота",
        image: require("../assets/images/test/growth.png"),
        result: { style: "casual" },
      },
      {
        text: "стриманість",
        image: require("../assets/images/test/vintage.png"),
        result: { style: "minimalist" },
      },
      {
        text: "елегантність",
        image: require("../assets/images/test/actress.png"),
        result: { style: "classic" },
      },
    ],
  },
  {
    question: "Який сьогоднішній ритм?",
    options: [
      {
        text: "плавний",
        image: require("../assets/images/test/calm.png"),
        result: { pattern: "plain" },
      },
      {
        text: "чіткий",
        image: require("../assets/images/test/busy.png"),
        result: { pattern: "striped" },
      },
      {
        text: "хаотичний",
        image: require("../assets/images/test/employee.png"),
        result: { pattern: "tiedyed" },
      },
      {
        text: "повторюваний",
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
        text: "поп",
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
        text: "дім",
        image: require("../assets/images/test/shelf.png"),
        result: { purpose: "home_party" },
      },
      {
        text: "парк",
        image: require("../assets/images/test/park.png"),
        result: { purpose: "walk" },
      },
      {
        text: "офіс",
        image: require("../assets/images/test/workspace.png"),
        result: { purpose: "office_job" },
      },
      {
        text: "вечірка",
        image: require("../assets/images/test/dance.png"),
        result: { purpose: "going_out" },
      },
    ],
  },
  {
    question: "Яка функціональність сьогоднішнього одягу?",
    options: [
      {
        text: "комфорт",
        image: require("../assets/images/test/yoga-pose.png"),
        result: { material: "cotton" },
      },
      {
        text: "затишок",
        image: require("../assets/images/test/comfort.png"),
        result: { material: "cashmere" },
      },
      {
        text: "легкість",
        image: require("../assets/images/test/hot.png"),
        result: { material: "linen" },
      },
      {
        text: "захист",
        image: require("../assets/images/test/wind.png"),
        result: { material: "nylon" },
      },
    ],
  },
  {
    question: "Що ти хочеш транслювати?",
    options: [
      {
        text: "хороший настрій",
        image: require("../assets/images/test/sun.png"),
        result: { season: "summer" },
      },
      {
        text: "безтурботність",
        image: require("../assets/images/test/old-woman.png"),
        result: { season: "spring" },
      },
      {
        text: "непохитність",
        image: require("../assets/images/test/windy.png"),
        result: { season: "fall" },
      },
      {
        text: "переживання",
        image: require("../assets/images/test/cold.png"),
        result: { season: "winter" },
      },
    ],
  },
  {
    question: "Враховуємо погоду?",
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
