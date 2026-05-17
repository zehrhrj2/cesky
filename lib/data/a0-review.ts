import type { Lesson } from "@/types";

// ── A0 Review Lessons ────────────────────────────────────────────────────────
// Each review covers the two preceding A0 lessons.
// Words are taken directly from those lessons; sentences use only those words
// plus basic connectives (je, mám, jsem, do, a, v) the learner has seen passively.

export const A0_REVIEW: Lesson[] = [

  // ── Review 1: Greetings + Numbers 1–10 ──────────────────────────────────
  {
    icon: "🔄",
    unitKey: "unitReview1",
    title_ua: "Повторення 1 · Привітання + Числа 1–10",
    title_ru: "Повторение 1 · Приветствия + Числа 1–10",
    level: "a0",
    xpReward: 40,
    words: [
      { cz: "Ahoj", en: "Hi / Hello", ua: "Привіт", ru: "Привет", example: "Ahoj, jak se máš?", exampleUa: "Привіт, як справи?", exampleRu: "Привет, как дела?", note_ua: "Неформальне, як «привіт»!", note_ru: "Неформальное, как «привет»!" },
      { cz: "Děkuji", en: "Thank you", ua: "Дякую", ru: "Спасибо", example: "Děkuji, mám se dobře.", exampleUa: "Дякую, я добре.", exampleRu: "Спасибо, я хорошо.", note_ua: "Дуже схоже на «дякую»!", note_ru: "Похоже на украинское «дякую»!" },
      { cz: "Prosím", en: "Please / You're welcome", ua: "Будь ласка", ru: "Пожалуйста", example: "Dva, prosím.", exampleUa: "Два, будь ласка.", exampleRu: "Два, пожалуйста.", note_ua: "Як «прошу» — майже однаково!", note_ru: "Как «прошу» — почти одинаково!" },
      { cz: "Ano", en: "Yes", ua: "Так", ru: "Да", example: "Ano, tři.", exampleUa: "Так, три.", exampleRu: "Да, три.", note_ua: "«Ано» = так — просто!", note_ru: "«Ано» = да — просто!" },
      { cz: "Ne", en: "No", ua: "Ні", ru: "Нет", example: "Ne, děkuji.", exampleUa: "Ні, дякую.", exampleRu: "Нет, спасибо.", note_ua: "«Не» = ні — коротко!", note_ru: "«Не» = нет — коротко!" },
      { cz: "Na shledanou", en: "Goodbye", ua: "До побачення", ru: "До свидания", example: "Na shledanou, nashle.", exampleUa: "До побачення!", exampleRu: "До свидания!", note_ua: "Формальне прощання", note_ru: "Формальное прощание" },
      { cz: "Jeden", en: "One", ua: "Один", ru: "Один", example: "Jeden člověk.", exampleUa: "Одна людина.", exampleRu: "Один человек.", note_ua: "«Єден» — як «один»", note_ru: "«Еден» — как «один»" },
      { cz: "Dva", en: "Two", ua: "Два", ru: "Два", example: "Dva lidi.", exampleUa: "Двоє людей.", exampleRu: "Два человека.", note_ua: "Однаково!", note_ru: "Одинаково!" },
      { cz: "Tři", en: "Three", ua: "Три", ru: "Три", example: "Tři otázky.", exampleUa: "Три питання.", exampleRu: "Три вопроса.", note_ua: "Теж однаково!", note_ru: "Тоже одинаково!" },
      { cz: "Pět", en: "Five", ua: "П'ять", ru: "Пять", example: "Pět minut.", exampleUa: "П'ять хвилин.", exampleRu: "Пять минут.", note_ua: "«Пʼєт» = п'ять", note_ru: "«Пьет» = пять" },
      { cz: "Sedm", en: "Seven", ua: "Сім", ru: "Семь", example: "Sedm dní.", exampleUa: "Сім днів.", exampleRu: "Семь дней.", note_ua: "«Седм» — близько до «сім»", note_ru: "«Седм» — близко к «семь»" },
      { cz: "Deset", en: "Ten", ua: "Десять", ru: "Десять", example: "Deset korun, prosím.", exampleUa: "Десять крон, будь ласка.", exampleRu: "Десять крон, пожалуйста.", note_ua: "Майже однаково!", note_ru: "Почти одинаково!" },
    ],
    sentences: [
      { cz: ["Ahoj", "!", "Mám", "tři", "otázky", "."], correctOrder: [0, 1, 2, 3, 4, 5], hint_ua: "Привіт! Маю три питання.", hint_ru: "Привет! У меня три вопроса." },
      { cz: ["Ano", ",", "prosím", ",", "dva", "."], correctOrder: [0, 1, 2, 3, 4, 5], hint_ua: "Так, будь ласка, два.", hint_ru: "Да, пожалуйста, два." },
      { cz: ["Deset", "korun", ",", "děkuji", "."], correctOrder: [0, 1, 2, 3, 4], hint_ua: "Десять крон, дякую.", hint_ru: "Десять крон, спасибо." },
      { cz: ["Ne", ",", "děkuji", ",", "jeden", "."], correctOrder: [0, 1, 2, 3, 4, 5], hint_ua: "Ні, дякую, один.", hint_ru: "Нет, спасибо, один." },
    ],
    quiz: [
      { question_ua: "Як сказати «Привіт» чеською?", question_ru: "Как сказать «Привет» по-чешски?", options: ["Ne", "Ahoj", "Prosím", "Děkuji"], correct: 1 },
      { question_ua: "Що означає «Děkuji»?", question_ru: "Что означает «Děkuji»?", options_ua: ["Привіт", "Будь ласка", "Так", "Дякую"], options_ru: ["Привет", "Пожалуйста", "Да", "Спасибо"], correct: 3 },
      { question_ua: "Яке число «Sedm»?", question_ru: "Какое число «Sedm»?", options_ua: ["П'ять", "Шість", "Сім", "Вісім"], options_ru: ["Пять", "Шесть", "Семь", "Восемь"], correct: 2 },
      { question_ua: "Як сказати «Ні» чеською?", question_ru: "Как сказать «Нет» по-чешски?", options: ["Ano", "Prosím", "Ne", "Ahoj"], correct: 2 },
      { question_ua: "Яке число «Deset»?", question_ru: "Какое число «Deset»?", options_ua: ["Сім", "Вісім", "Дев'ять", "Десять"], options_ru: ["Семь", "Восемь", "Девять", "Десять"], correct: 3 },
    ],
  },

  // ── Review 2: Numbers 11–100 + Food & Drinks ─────────────────────────────
  {
    icon: "🔄",
    unitKey: "unitReview2",
    title_ua: "Повторення 2 · Числа 11–100 + Їжа та напої",
    title_ru: "Повторение 2 · Числа 11–100 + Еда и напитки",
    level: "a0",
    xpReward: 40,
    words: [
      { cz: "Dvacet", en: "Twenty", ua: "Двадцять", ru: "Двадцать", example: "Dvacet korun.", exampleUa: "Двадцять крон.", exampleRu: "Двадцать крон.", note_ua: "«Двацет» — від «два»", note_ru: "«Двацет» — от «два»" },
      { cz: "Třicet", en: "Thirty", ua: "Тридцять", ru: "Тридцать", example: "Třicet minut.", exampleUa: "Тридцять хвилин.", exampleRu: "Тридцать минут.", note_ua: "«Тршіцет» — від «tři»", note_ru: "«Тршицет» — от «tři»" },
      { cz: "Sto", en: "One hundred", ua: "Сто", ru: "Сто", example: "Sto korun za ovoce.", exampleUa: "Сто крон за фрукти.", exampleRu: "Сто крон за фрукты.", note_ua: "Однаково!", note_ru: "Одинаково!" },
      { cz: "Voda", en: "Water", ua: "Вода", ru: "Вода", example: "Voda, prosím.", exampleUa: "Воду, будь ласка.", exampleRu: "Воды, пожалуйста.", note_ua: "Однаково!", note_ru: "Одинаково!" },
      { cz: "Káva", en: "Coffee", ua: "Кава", ru: "Кофе", example: "Káva za dvacet korun.", exampleUa: "Кава за двадцять крон.", exampleRu: "Кофе за двадцать крон.", note_ua: "Кава = кава!", note_ru: "«Кава» — как украинское «кава»" },
      { cz: "Čaj", en: "Tea", ua: "Чай", ru: "Чай", example: "Čaj s mlékem.", exampleUa: "Чай з молоком.", exampleRu: "Чай с молоком.", note_ua: "Чай = чай!", note_ru: "Чай = чай!" },
      { cz: "Mléko", en: "Milk", ua: "Молоко", ru: "Молоко", example: "Mléko a čaj.", exampleUa: "Молоко і чай.", exampleRu: "Молоко и чай.", note_ua: "«Млеко» = молоко", note_ru: "«Млеко» = молоко" },
      { cz: "Chleba", en: "Bread", ua: "Хліб", ru: "Хлеб", example: "Chleba a voda.", exampleUa: "Хліб і вода.", exampleRu: "Хлеб и вода.", note_ua: "«Хлеба» — дуже схоже!", note_ru: "«Хлеба» — очень похоже!" },
      { cz: "Polévka", en: "Soup", ua: "Суп", ru: "Суп", example: "Polévka za třicet korun.", exampleUa: "Суп за тридцять крон.", exampleRu: "Суп за тридцать крон.", note_ua: "«Полевка» — як «полівка»!", note_ru: "«Полевка» — как «полівка»!" },
      { cz: "Maso", en: "Meat", ua: "М'ясо", ru: "Мясо", example: "Maso a zelenina.", exampleUa: "М'ясо і овочі.", exampleRu: "Мясо и овощи.", note_ua: "«Масо» = м'ясо!", note_ru: "«Масо» = мясо!" },
      { cz: "Zelenina", en: "Vegetables", ua: "Овочі", ru: "Овощи", example: "Zelenina je zdravá.", exampleUa: "Овочі корисні.", exampleRu: "Овощи полезны.", note_ua: "«Зеленина» = овочі", note_ru: "«Зеленина» = овощи" },
      { cz: "Ovoce", en: "Fruit", ua: "Фрукти", ru: "Фрукты", example: "Ovoce a zelenina.", exampleUa: "Фрукти і овочі.", exampleRu: "Фрукты и овощи.", note_ua: "«Овоце» = фрукти", note_ru: "«Овоце» = фрукты" },
    ],
    sentences: [
      { cz: ["Káva", "za", "dvacet", "korun", ",", "prosím", "."], correctOrder: [0, 1, 2, 3, 4, 5, 6], hint_ua: "Кава за двадцять крон, будь ласка.", hint_ru: "Кофе за двадцать крон, пожалуйста." },
      { cz: ["Polévka", "a", "chleba", ",", "prosím", "."], correctOrder: [0, 1, 2, 3, 4, 5], hint_ua: "Суп і хліб, будь ласка.", hint_ru: "Суп и хлеб, пожалуйста." },
      { cz: ["Sto", "korun", "za", "maso", "a", "zeleninu", "."], correctOrder: [0, 1, 2, 3, 4, 5, 6], hint_ua: "Сто крон за м'ясо і овочі.", hint_ru: "Сто крон за мясо и овощи." },
      { cz: ["Čaj", "nebo", "káva", "?"], correctOrder: [0, 1, 2, 3], hint_ua: "Чай або кава?", hint_ru: "Чай или кофе?" },
    ],
    quiz: [
      { question_ua: "Як сказати «двадцять» чеською?", question_ru: "Как сказать «двадцать» по-чешски?", options: ["Deset", "Dvacet", "Třicet", "Sto"], correct: 1 },
      { question_ua: "Що означає «Voda»?", question_ru: "Что означает «Voda»?", options_ua: ["Кава", "Молоко", "Вода", "Чай"], options_ru: ["Кофе", "Молоко", "Вода", "Чай"], correct: 2 },
      { question_ua: "Як сказати «суп» чеською?", question_ru: "Как сказать «суп» по-чешски?", options: ["Maso", "Chleba", "Polévka", "Ovoce"], correct: 2 },
      { question_ua: "Що означає «Sto»?", question_ru: "Что означает «Sto»?", options_ua: ["Десять", "П'ятдесят", "Сто", "Тисяча"], options_ru: ["Десять", "Пятьдесят", "Сто", "Тысяча"], correct: 2 },
      { question_ua: "Що означає «Ovoce»?", question_ru: "Что означает «Ovoce»?", options_ua: ["М'ясо", "Овочі", "Хліб", "Фрукти"], options_ru: ["Мясо", "Овощи", "Хлеб", "Фрукты"], correct: 3 },
    ],
  },

  // ── Review 3: Family + Colors ────────────────────────────────────────────
  {
    icon: "🔄",
    unitKey: "unitReview3",
    title_ua: "Повторення 3 · Сім'я + Кольори",
    title_ru: "Повторение 3 · Семья + Цвета",
    level: "a0",
    xpReward: 40,
    words: [
      { cz: "Máma", en: "Mom", ua: "Мама", ru: "Мама", example: "Máma má červenou tašku.", exampleUa: "Мама має червону сумку.", exampleRu: "Мама носит красную сумку.", note_ua: "Однаково — «мама»!", note_ru: "Одинаково — «мама»!" },
      { cz: "Táta", en: "Dad", ua: "Тато", ru: "Папа", example: "Táta má modré auto.", exampleUa: "Тато має синю машину.", exampleRu: "Папа носит синюю машину.", note_ua: "«Тато» = тато!", note_ru: "«Тата» — как украинское «тато»" },
      { cz: "Bratr", en: "Brother", ua: "Брат", ru: "Брат", example: "Bratr má zelený klobouk.", exampleUa: "Брат має зелений капелюх.", exampleRu: "Брат носит зелёную шляпу.", note_ua: "Братр = брат!", note_ru: "Братр = брат!" },
      { cz: "Sestra", en: "Sister", ua: "Сестра", ru: "Сестра", example: "Moje sestra má modré oči.", exampleUa: "Моя сестра має сині очі.", exampleRu: "Моя сестра носит синие глаза.", note_ua: "Сестра = сестра!", note_ru: "Сестра = сестра!" },
      { cz: "Babička", en: "Grandmother", ua: "Бабуся", ru: "Бабушка", example: "Babička má bílé vlasy.", exampleUa: "Бабуся має біле волосся.", exampleRu: "Бабушка носит белые волосы.", note_ua: "«Бабічка» = бабуся", note_ru: "«Бабичка» = бабушка" },
      { cz: "Děda", en: "Grandfather", ua: "Дідусь", ru: "Дедушка", example: "Děda má šedé vlasy.", exampleUa: "Дідусь має сиве волосся.", exampleRu: "Дедушка носит серые волосы.", note_ua: "«Деда» = дідусь", note_ru: "«Деда» = дедушка" },
      { cz: "Červený", en: "Red", ua: "Червоний", ru: "Красный", example: "Červený svetr.", exampleUa: "Червоний светр.", exampleRu: "Красный свитер.", note_ua: "«Червений» — як «червоний»!", note_ru: "«Червени» — как «червоний»!" },
      { cz: "Modrý", en: "Blue", ua: "Синій", ru: "Синий", example: "Modré auto táty.", exampleUa: "Синя машина тата.", exampleRu: "Синяя машина папы.", note_ua: "«Модрий» = синій", note_ru: "«Модрый» = синий" },
      { cz: "Zelený", en: "Green", ua: "Зелений", ru: "Зелёный", example: "Zelený svetr bratra.", exampleUa: "Зелений светр брата.", exampleRu: "Зелёный свитер брата.", note_ua: "Зелений = зелений!", note_ru: "Зелёный = зелёный!" },
      { cz: "Bílý", en: "White", ua: "Білий", ru: "Белый", example: "Bílé vlasy babičky.", exampleUa: "Біле волосся бабусі.", exampleRu: "Белые волосы бабушки.", note_ua: "«Білий» = білий!", note_ru: "«Билы» = белый!" },
      { cz: "Černý", en: "Black", ua: "Чорний", ru: "Чёрный", example: "Černý kočka sestry.", exampleUa: "Чорна кішка сестри.", exampleRu: "Чёрная кошка сестры.", note_ua: "«Черний» — схоже на «чорний»!", note_ru: "«Черны» — похоже на «чёрный»!" },
      { cz: "Žlutý", en: "Yellow", ua: "Жовтий", ru: "Жёлтый", example: "Žlutý dům mámy.", exampleUa: "Жовтий будинок мами.", exampleRu: "Жёлтый дом мамы.", note_ua: "«Жлутий» — схоже на «жовтий»!", note_ru: "«Жлутый» — похоже на «жёлтый»!" },
    ],
    sentences: [
      { cz: ["Táta", "má", "modré", "auto", "."], correctOrder: [0, 1, 2, 3, 4], hint_ua: "Тато має синю машину.", hint_ru: "Папа носит синюю машину." },
      { cz: ["Moje", "sestra", "má", "černou", "kočku", "."], correctOrder: [0, 1, 2, 3, 4, 5], hint_ua: "Моя сестра має чорну кішку.", hint_ru: "Моя сестра носит чёрную кошку." },
      { cz: ["Babička", "má", "bílé", "vlasy", "."], correctOrder: [0, 1, 2, 3, 4], hint_ua: "Бабуся має біле волосся.", hint_ru: "Бабушка носит белые волосы." },
      { cz: ["Bratr", "má", "zelený", "klobouk", "."], correctOrder: [0, 1, 2, 3, 4], hint_ua: "Брат має зелений капелюх.", hint_ru: "Брат носит зелёную шляпу." },
    ],
    quiz: [
      { question_ua: "Як сказати «брат» чеською?", question_ru: "Как сказать «брат» по-чешски?", options: ["Syn", "Bratr", "Táta", "Děda"], correct: 1 },
      { question_ua: "Що означає «Červený»?", question_ru: "Что означает «Červený»?", options_ua: ["Синій", "Зелений", "Червоний", "Жовтий"], options_ru: ["Синий", "Зелёный", "Красный", "Жёлтый"], correct: 2 },
      { question_ua: "Що означає «Babička»?", question_ru: "Что означает «Babička»?", options_ua: ["Тітка", "Мати", "Бабуся", "Сестра"], options_ru: ["Тётя", "Мать", "Бабушка", "Сестра"], correct: 2 },
      { question_ua: "Який колір «Zelený»?", question_ru: "Какой цвет «Zelený»?", options_ua: ["Жовтий", "Синій", "Зелений", "Білий"], options_ru: ["Жёлтый", "Синий", "Зелёный", "Белый"], correct: 2 },
      { question_ua: "Як сказати «сестра» чеською?", question_ru: "Как сказать «сестра» по-чешски?", options: ["Teta", "Dcera", "Sestra", "Máma"], correct: 2 },
    ],
  },

  // ── Review 4: Transport + School ─────────────────────────────────────────
  {
    icon: "🔄",
    unitKey: "unitReview4",
    title_ua: "Повторення 4 · Транспорт + Школа",
    title_ru: "Повторение 4 · Транспорт + Школа",
    level: "a0",
    xpReward: 40,
    words: [
      { cz: "Auto", en: "Car", ua: "Машина / Авто", ru: "Машина / Авто", example: "Jedu autem do školy.", exampleUa: "Їду машиною до школи.", exampleRu: "Еду на машине в школу.", note_ua: "«Ауто» = авто", note_ru: "«Ауто» = авто" },
      { cz: "Autobus", en: "Bus", ua: "Автобус", ru: "Автобус", example: "Autobus jede do školy.", exampleUa: "Автобус іде до школи.", exampleRu: "Автобус едет в школу.", note_ua: "Автобус = автобус!", note_ru: "Автобус = автобус!" },
      { cz: "Vlak", en: "Train", ua: "Потяг", ru: "Поезд", example: "Učitel jede vlakem.", exampleUa: "Вчитель їде потягом.", exampleRu: "Учитель едет поездом.", note_ua: "«Влак» = потяг", note_ru: "«Влак» = поезд" },
      { cz: "Metro", en: "Metro", ua: "Метро", ru: "Метро", example: "Jdu metrem do školy.", exampleUa: "Йду метро до школи.", exampleRu: "Иду на метро в школу.", note_ua: "Метро = метро!", note_ru: "Метро = метро!" },
      { cz: "Škola", en: "School", ua: "Школа", ru: "Школа", example: "Jedu autobusem do školy.", exampleUa: "Їду автобусом до школи.", exampleRu: "Еду автобусом в школу.", note_ua: "Школа = школа!", note_ru: "Школа = школа!" },
      { cz: "Učitel", en: "Teacher", ua: "Вчитель", ru: "Учитель", example: "Učitel jede vlakem.", exampleUa: "Вчитель їде потягом.", exampleRu: "Учитель едет поездом.", note_ua: "Учитель = учитель!", note_ru: "Учитель = учитель!" },
      { cz: "Kniha", en: "Book", ua: "Книга", ru: "Книга", example: "Zapomněl jsem knihu ve vlaku.", exampleUa: "Забув книгу в потязі.", exampleRu: "Забыл книгу в поезде.", note_ua: "Книга = книга!", note_ru: "Книга = книга!" },
      { cz: "Sešit", en: "Notebook", ua: "Зошит", ru: "Тетрадь", example: "Sešit je v autě.", exampleUa: "Зошит у машині.", exampleRu: "Тетрадь в машине.", note_ua: "«Сешіт» = зошит", note_ru: "«Сешит» = тетрадь" },
      { cz: "Pero", en: "Pen", ua: "Ручка", ru: "Ручка", example: "Pero je ve škole.", exampleUa: "Ручка в школі.", exampleRu: "Ручка в школе.", note_ua: "«Перо» → ручка", note_ru: "«Перо» → ручка" },
      { cz: "Třída", en: "Classroom", ua: "Клас", ru: "Класс", example: "Naše třída je velká.", exampleUa: "Наш клас великий.", exampleRu: "Наш класс большой.", note_ua: "«Тршіда» = клас", note_ru: "«Тршида» = класс" },
      { cz: "Nádraží", en: "Train station", ua: "Вокзал", ru: "Вокзал", example: "Vlak je na nádraží.", exampleUa: "Потяг на вокзалі.", exampleRu: "Поезд на вокзале.", note_ua: "«Нáдражі» = вокзал", note_ru: "«Надражи» = вокзал" },
      { cz: "Domácí úkol", en: "Homework", ua: "Домашнє завдання", ru: "Домашнее задание", example: "Domácí úkol je v sešitu.", exampleUa: "Домашнє завдання в зошиті.", exampleRu: "Домашнее задание в тетради.", note_ua: "«Домáці укол» = домашнє завдання", note_ru: "«Домаци укол» = домашнее задание" },
    ],
    sentences: [
      { cz: ["Jedu", "autobusem", "do", "školy", "."], correctOrder: [0, 1, 2, 3, 4], hint_ua: "Їду автобусом до школи.", hint_ru: "Еду автобусом в школу." },
      { cz: ["Zapomněl", "jsem", "knihu", "ve", "vlaku", "."], correctOrder: [0, 1, 2, 3, 4, 5], hint_ua: "Забув книгу в потязі.", hint_ru: "Забыл книгу в поезде." },
      { cz: ["Učitel", "jede", "metrem", "do", "školy", "."], correctOrder: [0, 1, 2, 3, 4, 5], hint_ua: "Вчитель їде метро до школи.", hint_ru: "Учитель едет на метро в школу." },
      { cz: ["Pero", "a", "sešit", "jsou", "ve", "třídě", "."], correctOrder: [0, 1, 2, 3, 4, 5, 6], hint_ua: "Ручка та зошит у класі.", hint_ru: "Ручка и тетрадь в классе." },
    ],
    quiz: [
      { question_ua: "Як сказати «автобус» чеською?", question_ru: "Как сказать «автобус» по-чешски?", options: ["Vlak", "Metro", "Autobus", "Auto"], correct: 2 },
      { question_ua: "Що означає «Škola»?", question_ru: "Что означает «Škola»?", options_ua: ["Вокзал", "Клас", "Школа", "Книга"], options_ru: ["Вокзал", "Класс", "Школа", "Книга"], correct: 2 },
      { question_ua: "Що означає «Vlak»?", question_ru: "Что означает «Vlak»?", options_ua: ["Метро", "Автобус", "Літак", "Потяг"], options_ru: ["Метро", "Автобус", "Самолёт", "Поезд"], correct: 3 },
      { question_ua: "Як сказати «книга» чеською?", question_ru: "Как сказать «книга» по-чешски?", options: ["Sešit", "Pero", "Kniha", "Tužka"], correct: 2 },
      { question_ua: "Що означає «Učitel»?", question_ru: "Что означает «Učitel»?", options_ua: ["Учень", "Вчитель", "Директор", "Студент"], options_ru: ["Ученик", "Учитель", "Директор", "Студент"], correct: 1 },
    ],
  },

  // ── Review 5: Body + Days & Time ─────────────────────────────────────────
  {
    icon: "🔄",
    unitKey: "unitReview5",
    title_ua: "Повторення 5 · Тіло + Дні та час",
    title_ru: "Повторение 5 · Тело + Дни и время",
    level: "a0",
    xpReward: 40,
    words: [
      { cz: "Hlava", en: "Head", ua: "Голова", ru: "Голова", example: "Dnes bolí hlava.", exampleUa: "Сьогодні болить голова.", exampleRu: "Сегодня болит голова.", note_ua: "«Глава» = голова!", note_ru: "«Глава» = голова!" },
      { cz: "Ruka", en: "Hand / Arm", ua: "Рука", ru: "Рука", example: "Včera jsem si zranil ruku.", exampleUa: "Вчора забив руку.", exampleRu: "Вчера я ударил руку.", note_ua: "Рука = рука!", note_ru: "Рука = рука!" },
      { cz: "Noha", en: "Leg", ua: "Нога", ru: "Нога", example: "Zítra bolí noha.", exampleUa: "Завтра болітиме нога.", exampleRu: "Завтра будет болеть нога.", note_ua: "Нога = нога!", note_ru: "Нога = нога!" },
      { cz: "Srdce", en: "Heart", ua: "Серце", ru: "Сердце", example: "Srdce bije v pondělí i v neděli.", exampleUa: "Серце б'ється і в понеділок, і в неділю.", exampleRu: "Сердце бьётся и в понедельник, и в воскресенье.", note_ua: "Сердце = серце!", note_ru: "Сердце = сердце!" },
      { cz: "Oko", en: "Eye", ua: "Очі", ru: "Глаза", example: "Oči bolí ve středu.", exampleUa: "Очі болять у середу.", exampleRu: "Глаза болят в среду.", note_ua: "Oko = oko!", note_ru: "«Око» = глаз (устар.)" },
      { cz: "Nos", en: "Nose", ua: "Ніс", ru: "Нос", example: "Červený nos v pátek.", exampleUa: "Червоний ніс у п'ятницю.", exampleRu: "Красный нос в пятницу.", note_ua: "Ніс = ніс!", note_ru: "Нос = нос!" },
      { cz: "Pondělí", en: "Monday", ua: "Понеділок", ru: "Понедельник", example: "V pondělí bolí hlava.", exampleUa: "У понеділок болить голова.", exampleRu: "В понедельник болит голова.", note_ua: "«Понделі» — після неділі", note_ru: "«Понедели» — после недели" },
      { cz: "Pátek", en: "Friday", ua: "П'ятниця", ru: "Пятница", example: "V pátek bolí noha.", exampleUa: "У п'ятницю болить нога.", exampleRu: "В пятницу болит нога.", note_ua: "«Пáтек» = п'ятниця!", note_ru: "«Патек» = пятница!" },
      { cz: "Sobota", en: "Saturday", ua: "Субота", ru: "Суббота", example: "V sobotu odpočívám.", exampleUa: "У суботу відпочиваю.", exampleRu: "В субботу отдыхаю.", note_ua: "Субота = субота!", note_ru: "Суббота = суббота!" },
      { cz: "Neděle", en: "Sunday", ua: "Неділя", ru: "Воскресенье", example: "V neděli bolí záda.", exampleUa: "В неділю болить спина.", exampleRu: "В воскресенье болит спина.", note_ua: "«Неделе» = неділя!", note_ru: "«Неделе» = воскресенье" },
      { cz: "Dnes", en: "Today", ua: "Сьогодні", ru: "Сегодня", example: "Dnes bolí hlava.", exampleUa: "Сьогодні болить голова.", exampleRu: "Сегодня болит голова.", note_ua: "«Днес» = сьогодні", note_ru: "«Днес» = сегодня" },
      { cz: "Zítra", en: "Tomorrow", ua: "Завтра", ru: "Завтра", example: "Zítra je sobota.", exampleUa: "Завтра субота.", exampleRu: "Завтра суббота.", note_ua: "«Зітра» — схоже на «завтра»!", note_ru: "«Зитра» — похоже на «завтра»!" },
    ],
    sentences: [
      { cz: ["Dnes", "bolí", "hlava", "."], correctOrder: [0, 1, 2, 3], hint_ua: "Сьогодні болить голова.", hint_ru: "Сегодня болит голова." },
      { cz: ["Zítra", "je", "sobota", "."], correctOrder: [0, 1, 2, 3], hint_ua: "Завтра субота.", hint_ru: "Завтра суббота." },
      { cz: ["V", "pátek", "bolí", "noha", "."], correctOrder: [0, 1, 2, 3, 4], hint_ua: "У п'ятницю болить нога.", hint_ru: "В пятницу болит нога." },
      { cz: ["V", "pondělí", "bolí", "hlava", "a", "ruka", "."], correctOrder: [0, 1, 2, 3, 4, 5, 6], hint_ua: "У понеділок болить голова та рука.", hint_ru: "В понедельник болит голова и рука." },
    ],
    quiz: [
      { question_ua: "Як сказати «голова» чеською?", question_ru: "Как сказать «голова» по-чешски?", options: ["Noha", "Ruka", "Hlava", "Srdce"], correct: 2 },
      { question_ua: "Що означає «Dnes»?", question_ru: "Что означает «Dnes»?", options_ua: ["Вчора", "Завтра", "Сьогодні", "Тиждень"], options_ru: ["Вчера", "Завтра", "Сегодня", "Неделя"], correct: 2 },
      { question_ua: "Як сказати «субота» чеською?", question_ru: "Как сказать «суббота» по-чешски?", options: ["Neděle", "Sobota", "Pátek", "Pondělí"], correct: 1 },
      { question_ua: "Що означає «Srdce»?", question_ru: "Что означает «Srdce»?", options_ua: ["Рука", "Нога", "Серце", "Ніс"], options_ru: ["Рука", "Нога", "Сердце", "Нос"], correct: 2 },
      { question_ua: "Як сказати «п'ятниця» чеською?", question_ru: "Как сказать «пятница» по-чешски?", options: ["Sobota", "Neděle", "Pátek", "Pondělí"], correct: 2 },
    ],
  },
];
