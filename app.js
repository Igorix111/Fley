const API_KEY = "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"; // Вставьте ключ Groq сюда
const GOOGLE_CLIENT_ID = "489570663546-fr6r6vccuu2nrl4k8f88m2lncm6c60cv.apps.googleusercontent.com"; // Вставьте Google Client ID сюда
const ASSISTANT_NAME = "Fley";
const AIRFORCE_API_KEY = "sk-air-RDQqozmszW5DmC9RM4gBKfed1oUVMwVQJKR46QgYxVhSl4qz5OJaNFg17IFnNlBS"; // Вставьте ключ Airforce сюда

const AIRFORCE_IMAGE_MODEL = "grok-imagine";
const REQUEST_TIMEOUT_MS = 30000;
const IMAGE_LOAD_TIMEOUT_MS = 12000;
const POLLINATIONS_FALLBACK_TIMEOUT_MS = 30000;

const modelSelect = document.getElementById("model");
const systemInput = document.getElementById("system");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send");
const stopBtn = document.getElementById("stop");
const messagesEl = document.getElementById("messages");
const statusEl = document.getElementById("status");
const counterEl = document.getElementById("counter");
const welcomeEl = document.getElementById("welcome");
const newChatBtn = document.getElementById("newChat");
const chatListEl = document.getElementById("chatList");
const liveTimeEl = document.getElementById("liveTime");
const liveDateEl = document.getElementById("liveDate");
const liveYearEl = document.getElementById("liveYear");
const liveLabelTimeEl = document.getElementById("liveLabelTime");
const liveLabelDateEl = document.getElementById("liveLabelDate");
const liveLabelYearEl = document.getElementById("liveLabelYear");
const liveLabelConditionEl = document.getElementById("liveLabelCondition");
const liveConditionEl = document.getElementById("liveCondition");
const liveLabelUpdatedEl = document.getElementById("liveLabelUpdated");
const liveUpdatedEl = document.getElementById("liveUpdated");
const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");
const weatherResult = document.getElementById("weatherResult");
const chatSearchInput = document.getElementById("chatSearch");
const signinEl = document.getElementById("g_id_signin");
const userPill = document.getElementById("userPill");
const userNameEl = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const accountEl = document.querySelector(".account");
const accountToggleBtn = document.getElementById("accountToggle");
const accountMenuEl = document.getElementById("accountMenu");
const accountAvatarEl = document.getElementById("accountAvatar");
const imagePromptInput = document.getElementById("imagePrompt");
const imageRatioSelect = document.getElementById("imageRatio");
const imageRatioSwitchEl = document.getElementById("imageRatioSwitch");
const imageRatioToggle = document.getElementById("imageRatioToggle");
const imageRatioCurrent = document.getElementById("imageRatioCurrent");
const imageRatioMenu = document.getElementById("imageRatioMenu");
const imageRatioButtons = Array.from(document.querySelectorAll(".image-ratio-btn"));
const generateImageBtn = document.getElementById("generateImage");
const imageStatusEl = document.getElementById("imageStatus");
const imageOutputEl = document.getElementById("imageOutput");
const langSelect = document.getElementById("lang");
const taskProfileSelect = document.getElementById("taskProfile");
const recentTitleEl = document.getElementById("recentTitle");
const settingsTitleEl = document.getElementById("settingsTitle");
const modelLabelEl = document.getElementById("modelLabel");
const systemLabelEl = document.getElementById("systemLabel");
const langLabelEl = document.getElementById("langLabel");
const taskProfileLabelEl = document.getElementById("taskProfileLabel");
const keyNoteEl = document.getElementById("keyNote");
const liveTitleEl = document.getElementById("liveTitle");
const limitNoteEl = document.getElementById("limitNote");
const welcomeTitleEl = document.getElementById("welcomeTitle");
const heroTitleEl = document.getElementById("heroTitle");
const imageHeadEl = document.getElementById("imageHead");
const imageModal = document.getElementById("imageModal");
const imageModalImg = document.getElementById("imageModalImg");
const imageModalCaption = document.getElementById("imageModalCaption");
const imageModalClose = document.getElementById("imageModalClose");
const imageDownload = document.getElementById("imageDownload");
const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("fileInput");
const attachmentBar = document.getElementById("attachmentBar");
const voiceBtn = document.getElementById("voiceBtn");
const speakBtn = document.getElementById("speakBtn");
const webSearchToggle = document.getElementById("webSearchToggle");
const autoSpeakToggle = document.getElementById("autoSpeakToggle");
const webSearchLabel = document.getElementById("webSearchLabel");
const autoSpeakLabel = document.getElementById("autoSpeakLabel");
const exportJsonBtn = document.getElementById("exportJson");
const imagesNavBtn = document.getElementById("imagesNavBtn");
const modelSwitchEl = document.getElementById("modelSwitch");
const modelSwitchButtons = Array.from(document.querySelectorAll(".model-switch-btn"));
const langSwitchEl = document.getElementById("langSwitch");
const langSwitchToggle = document.getElementById("langSwitchToggle");
const langSwitchCurrent = document.getElementById("langSwitchCurrent");
const langSwitchMenu = document.getElementById("langSwitchMenu");
const langSwitchButtons = Array.from(document.querySelectorAll(".lang-switch-btn"));
const taskSwitchEl = document.getElementById("taskSwitch");
const taskSwitchToggle = document.getElementById("taskSwitchToggle");
const taskSwitchCurrent = document.getElementById("taskSwitchCurrent");
const taskSwitchMenu = document.getElementById("taskSwitchMenu");
const taskSwitchButtons = Array.from(document.querySelectorAll(".task-switch-btn"));
const appEl = document.querySelector(".app");
const sidebarEl = document.querySelector(".sidebar");
const sidebarToggleBtn = document.getElementById("sidebarToggle");
const sidebarDockToggleBtn = document.getElementById("sidebarDockToggle");
const sidebarCloseBtn = document.getElementById("sidebarClose");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const conversationEl = document.querySelector(".conversation");
const mainEl = document.querySelector(".main");
const MODEL_LIMITS = {
  "llama-3.1-8b-instant": 100,
  "llama-3.3-70b-versatile": 50
};
const USER_MEMORY_KEY = "fley_user_memory";
const SIDEBAR_COLLAPSED_KEY = "fley_sidebar_collapsed";
const QUOTA_BUCKET_KEY = "fley_bucket";
const QUOTA_COUNTS_KEY = "fley_quota_counts";
let messageCount = 0;
let lastWeather = null;
let weatherRefreshTimer = null;
let isWeatherRequestInFlight = false;
let modelQuotaCounts = {};
let chats = [];
let currentChatId = null;
let currentLang = "ru";
let lastImageObjectUrl = null;
let imageGenerationInFlight = false;
let imageRetryAt = 0;
let isChatRequestInFlight = false;
let activeChatAbortController = null;
let pendingAttachments = [];
let webSearchEnabled = false;
let autoSpeakEnabled = false;
let isListening = false;
let recognition = null;
let lastAssistantReply = "";
let currentView = localStorage.getItem("fley_view") === "images" ? "images" : "chat";
let heroRotationTimer = null;
let lastHeroIndex = -1;
const mobileSidebarQuery = window.matchMedia("(max-width: 900px)");
let speechVoices = [];
let userMemory = { name: "" };

const HERO_VARIANTS = {
  ru: [
    "Чем я могу тебе помочь?",
    "Что сделаем сегодня?",
    "Над чем ты работаешь?",
    "С чего начнем?",
    "Расскажи задачу, разберем."
  ],
  uk: [
    "Чим я можу тобі допомогти?",
    "Що робимо сьогодні?",
    "Над чим ти працюєш?",
    "З чого почнемо?",
    "Опиши задачу, розберемо."
  ],
  en: [
    "How can I help you today?",
    "What are you working on?",
    "What should we build next?",
    "Where do you want to start?",
    "Tell me the task, we will figure it out."
  ]
};

const I18N = {
  ru: {
    new_chat: "Новый чат",
    new_chat_title: "Новый чат",
    recent: "Недавні",
    settings: "Настройки",
    model: "Модель",
    system: "Системная инструкция",
    language: "Язык",
    task_profile: "Профиль задач",
    profile_general: "Универсальный",
    profile_code: "Код",
    profile_study: "Учёба",
    profile_texts: "Тексты",
    profile_translation: "Перевод",
    key_note: "Groq ключ в app.js, Airforce ключ в .env или server.js",
    live: "Live",
    time: "Время",
    date: "Дата",
    year: "Год",
    weather: "Погода",
    weather_not_loaded: "Погода не загружена",
    limit_note: "лимит обновляется каждый час",
    status_ready: "Готов",
    welcome_title: "Подсказки для старта",
    hero_title: "Над чем ты работаешь?",
    send: "Отправить",
    stop: "Стоп",
    stopped: "Ответ остановлен",
    images_tab: "Изображения",
    image_head: "Генерация Изображений",
    image_prompt: "Опишите изображение...",
    prompt_placeholder: "Введите сообщение...",
    search_chats: "Искать в чатах",
    city_placeholder: "Город или страна",
    create: "Создать",
    logout: "Выйти",
    delete_chat: "Удалить",
    messages_counter: "Сообщения: {count} / {max}",
    greeting: "Привет! Напиши запрос и я помогу.",
    no_reply: "Нет ответа",
    identity_system: "Ты ассистент {name}. Не повторяй фразу 'Я {name}' в каждом ответе. Представляйся только в начале нового диалога или когда пользователь прямо спрашивает: 'кто ты?'.",
    identity_user: "Пользователь: {user}.",
    memory_name_system: "Имя пользователя: {name}. Можешь обращаться по имени уместно, но не в каждом сообщении.",
    language_system: "Отвечай на русском языке. Если пользователь пишет на другом языке, отвечай на его языке.",
    behavior_system: "Ты ассистент Fley. Отвечай как живой человек: естественно, понятно и без канцелярита. Пиши разговорно, но грамотно; без фраз в стиле робота и без шаблонных повторов. Если запрос неясный, задай один короткий уточняющий вопрос. Если пользователь пишет с матами, не обижайся: отвечай спокойно, уважительно и по делу, можно шутливо в мягкой форме. Не оскорбляй людей и не используй слишком грубую лексику. Не добавляй в ответ погоду, время, дату и самопредставление без прямого запроса.",
    model_v1_label: "Fley v1 - быстрее",
    model_v2_label: "Fley v2 - умнее",
    model_preset_v1: "Режим Fley v1: отвечай максимально быстро, коротко и по сути. Обычно 1-2 предложения без длинных объяснений.",
    model_preset_v2: "Режим Fley v2: отвечай подробнее и глубже, объясняй как человек, добавляй полезный контекст и примеры без лишней воды.",
    task_preset_general: "Профиль задач: Универсальный. Обычный режим: отвечай сбалансированно, ясно и по делу.",
    task_preset_code: "Профиль задач: Код. Давай решения для программирования: код-блоки, шаги, причины ошибок, улучшения и безопасные практики.",
    task_preset_study: "Профиль задач: Учёба. Объясняй простыми словами, структурируй по шагам, добавляй примеры и мини-проверку понимания.",
    task_preset_texts: "Профиль задач: Тексты. Помогай с постами, идеями, статьями и формулировками. Учитывай цель, аудиторию и тон.",
    task_preset_translation: "Профиль задач: Перевод. Переводи точно и естественно, сохраняй смысл и стиль, при необходимости давай варианты.",
    live_context: "Реальное время: {time} ({tz}). Сегодня: {date}. Год: {year}. Используй эти данные без выдумок, только если запрос про время или дату.",
    weather_context: "Погода: {place}, {country}, {temp}°C, ветер {wind} м/с, время измерения {time}. Используй это только для ответа на вопрос о погоде.",
    weather_line: "{place}, {country}: {temp}°C, {condition}, ветер {wind} м/с",
    live_condition: "Состояние",
    live_updated: "Обновлено",
    weather_clear: "Ясно",
    weather_partly: "Переменная облачность",
    weather_overcast: "Пасмурно",
    weather_fog: "Туман",
    weather_drizzle: "Морось",
    weather_rain: "Дождь",
    weather_snow: "Снег",
    weather_showers: "Ливень",
    weather_thunder: "Гроза",
    weather_unknown: "Неизвестно",
    limit_reset: "Лимит обновлен",
    open_localhost_status: "Откройте через http://localhost:5173",
    open_localhost_msg: "Сайт открыт как file://. Запросы к API будут заблокированы. Откройте http://localhost:5173.",
    need_groq_status: "Нужен Groq ключ в app.js",
    need_groq_msg: "Не вижу Groq ключ. Вставьте ключ в app.js и обновите страницу.",
    key_found: "Ключ найден",
    set_groq_status: "Укажите Groq ключ в app.js",
    set_groq_msg: "Не вижу Groq ключ. Вставьте ключ в app.js и перезапустите страницу.",
    check_groq_status: "Проверьте ключ Groq (обычно начинается с gsk_)",
    limit_reached: "Лимит {max} сообщений в час для {model} достигнут",
    select_model: "Выберите модель",
    sending: "Отправка...",
    switching_model: "Переключаю модель...",
    groq_limit_msg: "Лимит исчерпан. Подождите сброс лимита Groq.",
    groq_limit_status: "Лимит Groq (429)",
    api_error_status: "Ошибка API",
    network_error_status: "Ошибка сети",
    network_error_msg: "Ошибка сети: {message}",
    network_file_msg: "Ошибка сети. Откройте сайт через http://localhost:5173 и проверьте интернет.",
    weather_enter_city: "Введите город",
    weather_loading: "Загрузка...",
    weather_not_found: "Город не найден",
    weather_no_data: "Нет данных погоды",
    weather_updated: "Погода обновлена",
    weather_error: "Ошибка загрузки",
    weather_error_status: "Ошибка погоды",
    image_need_key: "Нужен AIRFORCE_API_KEY в app.js или server.js.",
    image_ready: "Готово к генерации через Grok Imagine (api.airforce).",
    image_prompt_needed: "Введите описание изображения.",
    image_sending: "Генерируется",
    image_task_missing: "Не удалось получить taskId.",
    image_generating: "Генерация... (задача создана)",
    image_no_results: "Нет готовых изображений.",
    image_done: "Готово.",
    image_limit: "Лимит Grok Imagine (api.airforce). Попробуйте позже.",
    image_cooldown: "Слишком часто. Повторите через {sec} сек.",
    image_error: "Ошибка генерации: {message}",
    image_error_status: "Ошибка генерации",
    image_status_error: "Ошибка статуса",
    image_timeout: "Превышено время ожидания",
    image_generating_progress: "Генерация... {pct}%",
    open_image: "Открыть",
    download_image: "Скачать",
    google_error: "Ошибка входа Google",
    user_fallback: "Пользователь",
    image_alt: "Изображение",
    web_search: "Интернет-поиск",
    tts_toggle: "Озвучка ответов",
    export_txt: "Экспорт .txt",
    export_json: "Экспорт .json",
    attach_file: "Прикрепить файл",
    voice_input: "Голосовой ввод",
    speak_last: "Озвучить последний ответ",
    listening_on: "Слушаю...",
    listening_off: "Голосовой ввод остановлен",
    speech_not_supported: "Голосовой ввод не поддерживается в этом браузере",
    web_searching: "Поиск в интернете...",
    sources_title: "Источники",
    attached_files: "Прикрепленные файлы",
    files_ready: "Файлы добавлены: {count}",
    no_reply_to_speak: "Нет ответа для озвучки",
    export_done: "Экспорт готов"
  },
  uk: {
    new_chat: "Новий чат",
    new_chat_title: "Новий чат",
    recent: "Нещодавні",
    settings: "Налаштування",
    model: "Модель",
    system: "Системна інструкція",
    language: "Мова",
    task_profile: "Профіль задач",
    profile_general: "Універсальний",
    profile_code: "Код",
    profile_study: "Навчання",
    profile_texts: "Тексти",
    profile_translation: "Переклад",
    key_note: "Groq ключ у app.js, Airforce ключ у .env або server.js",
    live: "Live",
    time: "Час",
    date: "Дата",
    year: "Рік",
    weather: "Погода",
    weather_not_loaded: "Погода не завантажена",
    limit_note: "ліміт оновлюється щогодини",
    status_ready: "Готово",
    welcome_title: "Підказки для старту",
    hero_title: "Над чим ти працюєш?",
    send: "Надіслати",
    stop: "Стоп",
    stopped: "Відповідь зупинено",
    images_tab: "Зображення",
    image_head: "Генерація зображень",
    image_prompt: "Опишіть зображення...",
    prompt_placeholder: "Введіть повідомлення...",
    search_chats: "Шукати в чатах",
    city_placeholder: "Місто або країна",
    create: "Створити",
    logout: "Вийти",
    delete_chat: "Видалити",
    messages_counter: "Повідомлення: {count} / {max}",
    greeting: "Привіт! Напиши запит і я допоможу.",
    no_reply: "Немає відповіді",
    identity_system: "Ти асистент {name}. Не повторюй фразу 'Я {name}' у кожній відповіді. Представляйся лише на початку нового діалогу або коли користувач прямо питає: 'хто ти?'.",
    identity_user: "Користувач: {user}.",
    memory_name_system: "Ім'я користувача: {name}. Можеш звертатися на ім'я доречно, але не в кожній відповіді.",
    language_system: "Відповідай українською мовою. Якщо користувач пише іншою мовою, відповідай його мовою.",
    behavior_system: "Ти асистент Fley. Відповідай як жива людина: природно, зрозуміло і без канцеляриту. Пиши розмовно, але грамотно; без роботизованих фраз і шаблонних повторів. Якщо запит нечіткий, постав одне коротке уточнювальне питання. Якщо користувач пише з лайкою, не ображайся: відповідай спокійно, шанобливо і по суті, можна жартівливо у м'якій формі. Не ображай людей і не використовуй занадто грубу лексику. Не додавай у відповідь погоду, час, дату і самопредставлення без прямого запиту.",
    model_v1_label: "Fley v1 - швидше",
    model_v2_label: "Fley v2 - розумніша",
    model_preset_v1: "Режим Fley v1: відповідай максимально швидко, коротко і по суті. Зазвичай 1-2 речення без довгих пояснень.",
    model_preset_v2: "Режим Fley v2: відповідай детальніше і глибше, пояснюй як людина, додавай корисний контекст і приклади без зайвої води.",
    task_preset_general: "Профіль задач: Універсальний. Звичайний режим: відповідай збалансовано, ясно і по суті.",
    task_preset_code: "Профіль задач: Код. Давай рішення для програмування: код-блоки, кроки, причини помилок, покращення і безпечні практики.",
    task_preset_study: "Профіль задач: Навчання. Пояснюй простими словами, структуруй по кроках, додавай приклади і міні-перевірку розуміння.",
    task_preset_texts: "Профіль задач: Тексти. Допомагай з постами, ідеями, статтями і формулюваннями. Враховуй ціль, аудиторію і тон.",
    task_preset_translation: "Профіль задач: Переклад. Перекладай точно і природно, зберігай зміст і стиль, за потреби давай варіанти.",
    live_context: "Поточний час: {time} ({tz}). Сьогодні: {date}. Рік: {year}. Використовуй ці дані без вигадок, лише якщо запит про час або дату.",
    weather_context: "Погода: {place}, {country}, {temp}°C, вітер {wind} м/с, час вимірювання {time}. Використовуй це лише для відповіді на питання про погоду.",
    weather_line: "{place}, {country}: {temp}°C, {condition}, вітер {wind} м/с",
    live_condition: "Стан",
    live_updated: "Оновлено",
    weather_clear: "Ясно",
    weather_partly: "Мінлива хмарність",
    weather_overcast: "Хмарно",
    weather_fog: "Туман",
    weather_drizzle: "Мряка",
    weather_rain: "Дощ",
    weather_snow: "Сніг",
    weather_showers: "Злива",
    weather_thunder: "Гроза",
    weather_unknown: "Невідомо",
    limit_reset: "Ліміт оновлено",
    open_localhost_status: "Відкрийте через http://localhost:5173",
    open_localhost_msg: "Сайт відкрито як file://. Запити до API будуть заблоковані. Відкрийте http://localhost:5173.",
    need_groq_status: "Потрібен ключ Groq в app.js",
    need_groq_msg: "Не бачу ключ Groq. Вставте ключ в app.js і оновіть сторінку.",
    key_found: "Ключ знайдено",
    set_groq_status: "Вкажіть ключ Groq в app.js",
    set_groq_msg: "Не бачу ключ Groq. Вставте ключ в app.js і перезапустіть сторінку.",
    check_groq_status: "Перевірте ключ Groq (зазвичай починається з gsk_)",
    limit_reached: "Ліміт {max} повідомлень на годину для {model} досягнуто",
    select_model: "Оберіть модель",
    sending: "Надсилання...",
    switching_model: "Перемикаю модель...",
    groq_limit_msg: "Ліміт вичерпано. Зачекайте скидання ліміту Groq.",
    groq_limit_status: "Ліміт Groq (429)",
    api_error_status: "Помилка API",
    network_error_status: "Помилка мережі",
    network_error_msg: "Помилка мережі: {message}",
    network_file_msg: "Помилка мережі. Відкрийте сайт через http://localhost:5173 і перевірте інтернет.",
    weather_enter_city: "Введіть місто",
    weather_loading: "Завантаження...",
    weather_not_found: "Місто не знайдено",
    weather_no_data: "Немає даних погоди",
    weather_updated: "Погоду оновлено",
    weather_error: "Помилка завантаження",
    weather_error_status: "Помилка погоди",
    image_need_key: "Потрібен AIRFORCE_API_KEY у app.js або server.js.",
    image_ready: "Готово до генерації через Grok Imagine (api.airforce).",
    image_prompt_needed: "Введіть опис зображення.",
    image_sending: "Генерується",
    image_task_missing: "Не вдалося отримати taskId.",
    image_generating: "Генерація... (задача створена)",
    image_no_results: "Немає готових зображень.",
    image_done: "Готово.",
    image_limit: "Ліміт Grok Imagine (api.airforce). Спробуйте пізніше.",
    image_cooldown: "Занадто часто. Повторіть через {sec} с.",
    image_error: "Помилка генерації: {message}",
    image_error_status: "Помилка генерації",
    image_status_error: "Помилка статусу",
    image_timeout: "Перевищено час очікування",
    image_generating_progress: "Генерація... {pct}%",
    open_image: "Відкрити",
    download_image: "Завантажити",
    google_error: "Помилка входу Google",
    user_fallback: "Користувач",
    image_alt: "Зображення",
    web_search: "Інтернет-пошук",
    tts_toggle: "Озвучення відповідей",
    export_txt: "Експорт .txt",
    export_json: "Експорт .json",
    attach_file: "Прикріпити файл",
    voice_input: "Голосове введення",
    speak_last: "Озвучити останню відповідь",
    listening_on: "Слухаю...",
    listening_off: "Голосове введення зупинено",
    speech_not_supported: "Голосове введення не підтримується в цьому браузері",
    web_searching: "Пошук в інтернеті...",
    sources_title: "Джерела",
    attached_files: "Прикріплені файли",
    files_ready: "Файли додано: {count}",
    no_reply_to_speak: "Немає відповіді для озвучення",
    export_done: "Експорт готовий"
  },
  en: {
    new_chat: "New chat",
    new_chat_title: "New chat",
    recent: "Recent",
    settings: "Settings",
    model: "Model",
    system: "System prompt",
    language: "Language",
    task_profile: "Task profile",
    profile_general: "General",
    profile_code: "Code",
    profile_study: "Study",
    profile_texts: "Texts",
    profile_translation: "Translation",
    key_note: "Groq key in app.js, Airforce key in .env or server.js",
    live: "Live",
    time: "Time",
    date: "Date",
    year: "Year",
    weather: "Weather",
    weather_not_loaded: "Weather not loaded",
    limit_note: "limit resets every hour",
    status_ready: "Ready",
    welcome_title: "Start with prompts",
    hero_title: "What are you working on?",
    send: "Send",
    stop: "Stop",
    stopped: "Response stopped",
    images_tab: "Images",
    image_head: "Image generation",
    image_prompt: "Describe the image...",
    prompt_placeholder: "Type a message...",
    search_chats: "Search chats",
    city_placeholder: "City or country",
    create: "Create",
    logout: "Log out",
    delete_chat: "Delete",
    messages_counter: "Messages: {count} / {max}",
    greeting: "Hi! Send a prompt and I’ll help.",
    no_reply: "No response",
    identity_system: "You are assistant {name}. Do not repeat 'I am {name}' in every reply. Introduce yourself only at the start of a new chat or when the user directly asks 'who are you?'.",
    identity_user: "User: {user}.",
    memory_name_system: "User name: {name}. You may use the name when appropriate, but not in every reply.",
    language_system: "Respond in English. If the user writes in another language, reply in that same language.",
    behavior_system: "You are Fley assistant. Reply like a real person: natural, clear, and non-robotic. Keep a conversational but polished tone; avoid repetitive stock phrases. If the request is ambiguous, ask one short clarifying question. If the user uses profanity, do not get offended: respond calmly, respectfully, and helpfully, with soft playful wording if appropriate. Do not insult people and do not use overly harsh language. Do not add weather, time/date, or self-introduction unless the user explicitly asks.",
    model_v1_label: "Fley v1 - faster",
    model_v2_label: "Fley v2 - smarter",
    model_preset_v1: "Fley v1 mode: respond as fast as possible with short, direct answers. Usually 1-2 sentences and no long explanations.",
    model_preset_v2: "Fley v2 mode: respond with more depth and clarity, explain like a human, and add useful context and examples without fluff.",
    task_preset_general: "Task profile: General. Use normal balanced mode: clear and practical answers.",
    task_preset_code: "Task profile: Code. Prioritize programming help: code blocks, debugging steps, error causes, improvements, and safe practices.",
    task_preset_study: "Task profile: Study. Explain simply step-by-step with examples and a short understanding check.",
    task_preset_texts: "Task profile: Texts. Help with posts, ideas, articles, and wording. Adapt to goal, audience, and tone.",
    task_preset_translation: "Task profile: Translation. Translate accurately and naturally, preserve meaning and style, offer variants when useful.",
    live_context: "Current time: {time} ({tz}). Today: {date}. Year: {year}. Use these values exactly only for time/date-related requests.",
    weather_context: "Weather: {place}, {country}, {temp}°C, wind {wind} m/s, measured at {time}. Use this only for weather-related requests.",
    weather_line: "{place}, {country}: {temp}°C, {condition}, wind {wind} m/s",
    live_condition: "Condition",
    live_updated: "Updated",
    weather_clear: "Clear",
    weather_partly: "Partly cloudy",
    weather_overcast: "Overcast",
    weather_fog: "Fog",
    weather_drizzle: "Drizzle",
    weather_rain: "Rain",
    weather_snow: "Snow",
    weather_showers: "Showers",
    weather_thunder: "Thunderstorm",
    weather_unknown: "Unknown",
    limit_reset: "Limit reset",
    open_localhost_status: "Open via http://localhost:5173",
    open_localhost_msg: "The site is opened as file://. API requests will be blocked. Open http://localhost:5173.",
    need_groq_status: "Groq key required in app.js",
    need_groq_msg: "No Groq key found. Paste the key in app.js and reload.",
    key_found: "Key found",
    set_groq_status: "Set Groq key in app.js",
    set_groq_msg: "No Groq key found. Paste the key in app.js and reload.",
    check_groq_status: "Check Groq key (usually starts with gsk_)",
    limit_reached: "{model} reached {max} messages per hour",
    select_model: "Select a model",
    sending: "Sending...",
    switching_model: "Switching model...",
    groq_limit_msg: "Rate limit hit. Wait for Groq reset.",
    groq_limit_status: "Groq limit (429)",
    api_error_status: "API error",
    network_error_status: "Network error",
    network_error_msg: "Network error: {message}",
    network_file_msg: "Network error. Open via http://localhost:5173 and check internet.",
    weather_enter_city: "Enter a city",
    weather_loading: "Loading...",
    weather_not_found: "City not found",
    weather_no_data: "No weather data",
    weather_updated: "Weather updated",
    weather_error: "Load error",
    weather_error_status: "Weather error",
    image_need_key: "Set AIRFORCE_API_KEY in app.js or server.js.",
    image_ready: "Ready to generate via Grok Imagine (api.airforce).",
    image_prompt_needed: "Enter an image description.",
    image_sending: "Generating",
    image_task_missing: "Failed to get taskId.",
    image_generating: "Generating... (task created)",
    image_no_results: "No images returned.",
    image_done: "Done.",
    image_limit: "Grok Imagine (api.airforce) limit reached. Try later.",
    image_cooldown: "Too many requests. Retry in {sec}s.",
    image_error: "Generation error: {message}",
    image_error_status: "Generation failed",
    image_status_error: "Status error",
    image_timeout: "Timeout exceeded",
    image_generating_progress: "Generating... {pct}%",
    open_image: "Open",
    download_image: "Download",
    google_error: "Google sign-in error",
    user_fallback: "User",
    image_alt: "Image",
    web_search: "Web search",
    tts_toggle: "Speak replies",
    export_txt: "Export .txt",
    export_json: "Export .json",
    attach_file: "Attach file",
    voice_input: "Voice input",
    speak_last: "Read last reply",
    listening_on: "Listening...",
    listening_off: "Voice input stopped",
    speech_not_supported: "Voice input is not supported in this browser",
    web_searching: "Searching the web...",
    sources_title: "Sources",
    attached_files: "Attached files",
    files_ready: "Files added: {count}",
    no_reply_to_speak: "No reply to read",
    export_done: "Export ready"
  }
};

const CHIP_CONTENT = {
  ru: {
    launch: { label: "Резюме 2026", prompt: "Составь современное резюме на позицию Frontend разработчика в 2026 году: структура, формулировки достижений и блок навыков." },
    landing: { label: "Контент-план", prompt: "Сделай контент-план на 7 дней для Telegram-канала про ИИ: тема дня, формат поста и короткий хук." },
    time: { label: "План дня", prompt: "Помоги распланировать мой день: учеба, работа и отдых. Дай расписание по времени и 3 приоритета." },
    youtube: { label: "YouTube идеи", prompt: "Придумай 10 актуальных идей для YouTube про нейросети и AI-инструменты с названиями роликов." },
    instagram: { label: "Продажный пост", prompt: "Напиши продающий пост для Instagram о запуске нового продукта: заголовок, оффер, CTA и 5 хештегов." }
  },
  uk: {
    launch: { label: "Резюме 2026", prompt: "Склади сучасне резюме на позицію Frontend розробника у 2026 році: структура, досягнення та блок навичок." },
    landing: { label: "Контент-план", prompt: "Зроби контент-план на 7 днів для Telegram-каналу про ШІ: тема дня, формат поста і короткий хук." },
    time: { label: "План дня", prompt: "Допоможи спланувати мій день: навчання, робота й відпочинок. Дай розклад по часу та 3 пріоритети." },
    youtube: { label: "YouTube ідеї", prompt: "Придумай 10 актуальних ідей для YouTube про нейромережі та AI-інструменти з назвами відео." },
    instagram: { label: "Продажний пост", prompt: "Напиши продажний пост для Instagram про запуск нового продукту: заголовок, офер, CTA і 5 хештегів." }
  },
  en: {
    launch: { label: "Resume 2026", prompt: "Build a modern resume for a Frontend Developer role in 2026: structure, impact bullets, and skills section." },
    landing: { label: "Content plan", prompt: "Create a 7-day content plan for an AI-focused Telegram channel: daily topic, format, and hook." },
    time: { label: "Day plan", prompt: "Help me plan today with study, work, and rest. Give a time-block schedule and top 3 priorities." },
    youtube: { label: "YouTube ideas", prompt: "Give me 10 timely YouTube ideas about AI tools and neural networks with clickable titles." },
    instagram: { label: "Sales post", prompt: "Write a high-converting Instagram post for a product launch: hook, offer, CTA, and 5 hashtags." }
  }
};

const DEFAULT_CHAT_TITLES = Object.values(I18N).map((dict) => dict.new_chat_title);

const chips = document.querySelectorAll(".chip");

sendBtn.addEventListener("click", sendMessage);
weatherBtn.addEventListener("click", fetchWeather);
logoutBtn.addEventListener("click", clearUser);
if (accountToggleBtn) {
  accountToggleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleAccountMenu();
  });
}
newChatBtn.addEventListener("click", () => {
  createNewChat(t("new_chat_title"));
  setMainView("chat");
  closeSidebar();
  closeAccountMenu();
});
if (imagesNavBtn) {
  imagesNavBtn.addEventListener("click", () => {
    setMainView("images");
    closeSidebar();
  });
}
if (sidebarToggleBtn) {
  sidebarToggleBtn.addEventListener("click", toggleSidebar);
}
if (sidebarDockToggleBtn) {
  sidebarDockToggleBtn.addEventListener("click", toggleSidebar);
}
if (sidebarCloseBtn) {
  sidebarCloseBtn.addEventListener("click", closeSidebar);
}
if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}
if (mobileSidebarQuery?.addEventListener) {
  mobileSidebarQuery.addEventListener("change", (event) => {
    if (event.matches) {
      if (appEl) appEl.classList.remove("sidebar-collapsed");
      closeSidebar();
    } else {
      closeSidebar();
      const savedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
      if (appEl) appEl.classList.toggle("sidebar-collapsed", savedCollapsed);
    }
    updateSidebarToggleState();
  });
}
if (chatSearchInput) {
  chatSearchInput.addEventListener("input", renderChatList);
}
if (modelSelect) {
  modelSelect.addEventListener("change", () => {
    syncModelSwitchButtons();
    updateCounter();
  });
}
if (modelSwitchEl && modelSwitchButtons.length > 0) {
  modelSwitchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const model = btn.dataset.model;
      if (!model || !modelSelect) return;
      modelSelect.value = model;
      syncModelSwitchButtons();
      updateCounter();
      setStatus(t("status_ready"), "ok");
    });
  });
}
if (langSelect) {
  langSelect.addEventListener("change", (event) => setLanguage(event.target.value));
}
if (langSwitchToggle) {
  langSwitchToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleLangSwitch();
  });
}
if (langSwitchEl && langSwitchButtons.length > 0) {
  langSwitchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!lang || !langSelect) return;
      langSelect.value = lang;
      setLanguage(lang);
      syncLangSwitchButtons();
      closeLangSwitch();
      setStatus(t("status_ready"), "ok");
    });
  });
}
if (taskProfileSelect) {
  taskProfileSelect.addEventListener("change", () => {
    persistTaskProfile();
    syncTaskSwitchButtons();
    setStatus(t("status_ready"), "ok");
  });
}
if (taskSwitchToggle) {
  taskSwitchToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTaskSwitch();
  });
}
if (taskSwitchEl && taskSwitchButtons.length > 0) {
  taskSwitchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const task = btn.dataset.task;
      if (!task || !taskProfileSelect) return;
      taskProfileSelect.value = task;
      persistTaskProfile();
      syncTaskSwitchButtons();
      closeTaskSwitch();
      setStatus(t("status_ready"), "ok");
    });
  });
}
if (generateImageBtn) {
  generateImageBtn.addEventListener("click", generateImage);
}
if (imageRatioSelect) {
  imageRatioSelect.addEventListener("change", syncImageRatioButtons);
}
if (imageRatioToggle) {
  imageRatioToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleImageRatioSwitch();
  });
}
if (imageRatioSwitchEl && imageRatioButtons.length > 0) {
  imageRatioButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const ratio = btn.dataset.ratio;
      if (!ratio || !imageRatioSelect) return;
      imageRatioSelect.value = ratio;
      syncImageRatioButtons();
      closeImageRatioSwitch();
    });
  });
}
if (stopBtn) {
  stopBtn.addEventListener("click", () => {
    if (activeChatAbortController) {
      activeChatAbortController.abort();
    }
  });
}
if (imagePromptInput) {
  imagePromptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      generateImage();
    }
  });
}
if (attachBtn) {
  attachBtn.addEventListener("click", () => fileInput?.click());
}
if (fileInput) {
  fileInput.addEventListener("change", (event) => handleFileSelection(event.target.files));
}
if (voiceBtn) {
  voiceBtn.addEventListener("click", toggleVoiceInput);
}
if (speakBtn) {
  speakBtn.addEventListener("click", () => speakText(lastAssistantReply));
}
if (webSearchToggle) {
  webSearchToggle.addEventListener("change", (event) => {
    webSearchEnabled = Boolean(event.target.checked);
    localStorage.setItem("fley_web_search", webSearchEnabled ? "1" : "0");
  });
}
if (autoSpeakToggle) {
  autoSpeakToggle.addEventListener("change", (event) => {
    autoSpeakEnabled = Boolean(event.target.checked);
    localStorage.setItem("fley_auto_speak", autoSpeakEnabled ? "1" : "0");
  });
}
if (exportJsonBtn) {
  exportJsonBtn.addEventListener("click", exportChats);
}
if (imageModalClose) {
  imageModalClose.addEventListener("click", closeImageModal);
}
if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target?.dataset?.close === "true") closeImageModal();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImageModal();
    closeSidebar();
    closeLangSwitch();
    closeTaskSwitch();
    closeImageRatioSwitch();
    closeAccountMenu();
  }
});
document.addEventListener("click", (event) => {
  if (langSwitchEl && !langSwitchEl.contains(event.target)) {
    closeLangSwitch();
  }
  if (taskSwitchEl && !taskSwitchEl.contains(event.target)) {
    closeTaskSwitch();
  }
  if (imageRatioSwitchEl && !imageRatioSwitchEl.contains(event.target)) {
    closeImageRatioSwitch();
  }
  if (accountEl && !accountEl.contains(event.target)) {
    closeAccountMenu();
  }
});
window.addEventListener("beforeunload", () => {
  stopAudio();
  if (heroRotationTimer) clearInterval(heroRotationTimer);
  if (weatherRefreshTimer) clearInterval(weatherRefreshTimer);
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    refreshWeatherLiveSilently();
  }
});

promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const text = chip.dataset.prompt || "";
    promptInput.value = text;
    promptInput.focus();
  });
});

initLanguage();
initTaskProfile();
initSidebarState();
refreshHourlyQuota(false);
updateCounter();
updateLiveClock();
loadWeatherCache();
initWeatherLiveRefresh();
setInterval(updateLiveClock, 1000);
setInterval(() => refreshHourlyQuota(false), 60000);
loadUserMemory();
loadUser();
startGoogleInit();
loadChats();
setMainView(currentView);
bootStatus();
updateImageStatus();
updateComposerActionButtons();
syncModelSwitchButtons();
syncLangSwitchButtons();
syncTaskSwitchButtons();
syncImageRatioButtons();
initAdvancedFeatures();
function t(key, vars = {}) {
  const dict = I18N[currentLang] || I18N.ru;
  let text = dict[key] ?? I18N.ru[key] ?? key;
  Object.keys(vars).forEach((name) => {
    text = text.replaceAll(`{${name}}`, vars[name]);
  });
  return text;
}

function getLocale() {
  return currentLang === "uk" ? "uk-UA" : currentLang === "en" ? "en-US" : "ru-RU";
}

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function normalizeTimeZone(timeZone) {
  const candidate = String(timeZone || "").trim();
  if (!candidate) return getBrowserTimeZone();
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date());
    return candidate;
  } catch (err) {
    return getBrowserTimeZone();
  }
}

function getLiveTimeZone() {
  return normalizeTimeZone(lastWeather?.timezone || getBrowserTimeZone());
}

function formatInTimeZone(date, options = {}, timeZone = getLiveTimeZone()) {
  return new Intl.DateTimeFormat(getLocale(), { ...options, timeZone }).format(date);
}

function getIsoDateInTimeZone(date, timeZone = getLiveTimeZone()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function getYearInTimeZone(date, timeZone = getLiveTimeZone()) {
  return new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric" }).format(date);
}

function initWeatherLiveRefresh() {
  if (weatherRefreshTimer) clearInterval(weatherRefreshTimer);
  weatherRefreshTimer = setInterval(() => {
    refreshWeatherLiveSilently();
  }, 120000);
}

async function refreshWeatherLiveSilently() {
  const place = (cityInput?.value || "").trim() || String(lastWeather?.query || "").trim();
  if (!place || isWeatherRequestInFlight) return;
  await fetchWeatherByQuery(place, { silent: true, background: true });
}

function updateComposerActionButtons() {
  if (!sendBtn || !stopBtn) return;
  if (isChatRequestInFlight) {
    stopBtn.classList.remove("hidden");
    sendBtn.classList.add("hidden");
    sendBtn.disabled = true;
  } else {
    stopBtn.classList.add("hidden");
    sendBtn.classList.remove("hidden");
    sendBtn.disabled = false;
  }
}

function syncModelSwitchButtons() {
  if (!modelSelect || modelSwitchButtons.length === 0) return;
  const selected = modelSelect.value;
  modelSwitchButtons.forEach((btn) => {
    const active = btn.dataset.model === selected;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function syncLangSwitchButtons() {
  if (!langSelect || langSwitchButtons.length === 0) return;
  const selected = langSelect.value;
  langSwitchButtons.forEach((btn) => {
    const active = btn.dataset.lang === selected;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const activeBtn = langSwitchButtons.find((btn) => btn.dataset.lang === selected);
  if (langSwitchCurrent && activeBtn) {
    langSwitchCurrent.textContent = activeBtn.textContent.trim();
  }
  if (langSwitchToggle) {
    langSwitchToggle.setAttribute("aria-expanded", langSwitchEl?.classList.contains("open") ? "true" : "false");
  }
}

function closeLangSwitch() {
  if (!langSwitchEl) return;
  langSwitchEl.classList.remove("open");
  if (langSwitchToggle) langSwitchToggle.setAttribute("aria-expanded", "false");
}

function toggleLangSwitch() {
  if (!langSwitchEl) return;
  const next = !langSwitchEl.classList.contains("open");
  langSwitchEl.classList.toggle("open", next);
  if (langSwitchToggle) langSwitchToggle.setAttribute("aria-expanded", next ? "true" : "false");
}

function getSelectedTaskProfile() {
  return taskProfileSelect?.value || "general";
}

function getTaskProfileSystem(profileName = getSelectedTaskProfile()) {
  switch (profileName) {
    case "code":
      return t("task_preset_code");
    case "study":
      return t("task_preset_study");
    case "texts":
      return t("task_preset_texts");
    case "translation":
      return t("task_preset_translation");
    default:
      return t("task_preset_general");
  }
}

function syncTaskSwitchButtons() {
  if (!taskProfileSelect || taskSwitchButtons.length === 0) return;
  const selected = taskProfileSelect.value;
  taskSwitchButtons.forEach((btn) => {
    const active = btn.dataset.task === selected;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const activeBtn = taskSwitchButtons.find((btn) => btn.dataset.task === selected);
  if (taskSwitchCurrent && activeBtn) {
    taskSwitchCurrent.textContent = activeBtn.textContent.trim();
  }
  if (taskSwitchToggle) {
    taskSwitchToggle.setAttribute("aria-expanded", taskSwitchEl?.classList.contains("open") ? "true" : "false");
  }
}

function closeTaskSwitch() {
  if (!taskSwitchEl) return;
  taskSwitchEl.classList.remove("open");
  if (taskSwitchToggle) taskSwitchToggle.setAttribute("aria-expanded", "false");
}

function toggleTaskSwitch() {
  if (!taskSwitchEl) return;
  const next = !taskSwitchEl.classList.contains("open");
  taskSwitchEl.classList.toggle("open", next);
  if (taskSwitchToggle) taskSwitchToggle.setAttribute("aria-expanded", next ? "true" : "false");
}

function syncImageRatioButtons() {
  if (!imageRatioSelect || imageRatioButtons.length === 0) return;
  const selected = imageRatioSelect.value || "1:1";
  imageRatioButtons.forEach((btn) => {
    const active = btn.dataset.ratio === selected;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  if (imageRatioCurrent) imageRatioCurrent.textContent = selected;
  if (imageRatioToggle) {
    imageRatioToggle.setAttribute("aria-expanded", imageRatioSwitchEl?.classList.contains("open") ? "true" : "false");
  }
}

function closeImageRatioSwitch() {
  if (!imageRatioSwitchEl) return;
  imageRatioSwitchEl.classList.remove("open");
  if (imageRatioToggle) imageRatioToggle.setAttribute("aria-expanded", "false");
}

function toggleImageRatioSwitch() {
  if (!imageRatioSwitchEl) return;
  const next = !imageRatioSwitchEl.classList.contains("open");
  imageRatioSwitchEl.classList.toggle("open", next);
  if (imageRatioToggle) imageRatioToggle.setAttribute("aria-expanded", next ? "true" : "false");
}

function persistTaskProfile() {
  const value = getSelectedTaskProfile();
  localStorage.setItem("fley_task_profile", value);
}

function initTaskProfile() {
  if (!taskProfileSelect) return;
  const saved = localStorage.getItem("fley_task_profile");
  const validValues = ["general", "code", "study", "texts", "translation"];
  if (saved && validValues.includes(saved)) {
    taskProfileSelect.value = saved;
  }
  syncTaskSwitchButtons();
}

function updateSidebarToggleState() {
  if (!sidebarToggleBtn && !sidebarDockToggleBtn) return;
  const expanded = mobileSidebarQuery.matches
    ? sidebarEl?.classList.contains("open")
    : !appEl?.classList.contains("sidebar-collapsed");
  if (sidebarToggleBtn) {
    sidebarToggleBtn.classList.toggle("active", Boolean(expanded));
    sidebarToggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }
  if (sidebarDockToggleBtn) {
    sidebarDockToggleBtn.classList.toggle("active", Boolean(expanded));
    sidebarDockToggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }
}

function setDesktopSidebarCollapsed(collapsed, persist = true) {
  if (!appEl || mobileSidebarQuery.matches) return;
  appEl.classList.toggle("sidebar-collapsed", Boolean(collapsed));
  if (persist) {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  }
  updateSidebarToggleState();
}

function initSidebarState() {
  if (!appEl) return;
  if (mobileSidebarQuery.matches) {
    appEl.classList.remove("sidebar-collapsed");
  } else {
    const savedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
    appEl.classList.toggle("sidebar-collapsed", savedCollapsed);
  }
  updateSidebarToggleState();
}

function openSidebar() {
  if (!sidebarEl || !mobileSidebarQuery.matches) return;
  closeLangSwitch();
  closeTaskSwitch();
  sidebarEl.classList.add("open");
  if (sidebarOverlay) sidebarOverlay.classList.add("open");
  document.body.classList.add("sidebar-open");
  updateSidebarToggleState();
}

function closeSidebar() {
  if (!sidebarEl) return;
  sidebarEl.classList.remove("open");
  if (sidebarOverlay) sidebarOverlay.classList.remove("open");
  document.body.classList.remove("sidebar-open");
  closeLangSwitch();
  closeTaskSwitch();
  closeAccountMenu();
  updateSidebarToggleState();
}

function toggleSidebar() {
  if (!sidebarEl) return;
  if (mobileSidebarQuery.matches) {
    if (sidebarEl.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
    return;
  }
  const shouldCollapse = !appEl?.classList.contains("sidebar-collapsed");
  setDesktopSidebarCollapsed(shouldCollapse);
}

function setMainView(view) {
  if (!mainEl) return;
  currentView = view === "images" ? "images" : "chat";
  const isImagesView = currentView === "images";
  mainEl.classList.toggle("view-images", isImagesView);
  mainEl.classList.toggle("view-chat", !isImagesView);
  if (imagesNavBtn) {
    imagesNavBtn.classList.toggle("active", isImagesView);
  }
  localStorage.setItem("fley_view", currentView);
  updateEmptyState();
  if (!isImagesView) {
    scrollToBottom();
  }
  if (mobileSidebarQuery.matches) {
    closeSidebar();
  }
}

function getHeroVariants() {
  return HERO_VARIANTS[currentLang] || HERO_VARIANTS.ru;
}

function updateHeroTitle(randomPick = true) {
  if (!heroTitleEl) return;
  const variants = getHeroVariants();
  if (!Array.isArray(variants) || variants.length === 0) {
    heroTitleEl.textContent = t("hero_title");
    return;
  }
  let index = 0;
  if (randomPick) {
    index = Math.floor(Math.random() * variants.length);
    if (variants.length > 1 && index === lastHeroIndex) {
      index = (index + 1) % variants.length;
    }
  } else {
    index = (lastHeroIndex + 1 + variants.length) % variants.length;
  }
  lastHeroIndex = index;
  heroTitleEl.textContent = variants[index];
}

function restartHeroRotation() {
  if (heroRotationTimer) {
    clearInterval(heroRotationTimer);
    heroRotationTimer = null;
  }
  if (!mainEl?.classList.contains("empty") || currentView === "images") return;
  heroRotationTimer = setInterval(() => {
    if (!mainEl?.classList.contains("empty") || currentView === "images") return;
    updateHeroTitle(true);
  }, 7000);
}

function isDefaultChatTitle(title) {
  return DEFAULT_CHAT_TITLES.includes(title);
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  if (langSelect) {
    langSelect.value = lang;
  }
  localStorage.setItem("fley_lang", lang);
  applyTranslations();
}

function initLanguage() {
  const saved = localStorage.getItem("fley_lang");
  if (saved && I18N[saved]) {
    currentLang = saved;
  } else if (navigator.language?.startsWith("uk")) {
    currentLang = "uk";
  } else if (navigator.language?.startsWith("en")) {
    currentLang = "en";
  } else {
    currentLang = "ru";
  }
  if (langSelect) {
    langSelect.value = currentLang;
  }
  applyTranslations();
}

function applyTranslations() {
  newChatBtn.textContent = t("new_chat");
  recentTitleEl.textContent = t("recent");
  settingsTitleEl.textContent = t("settings");
  modelLabelEl.textContent = t("model");
  systemLabelEl.textContent = t("system");
  langLabelEl.textContent = t("language");
  if (taskProfileLabelEl) taskProfileLabelEl.textContent = t("task_profile");
  if (keyNoteEl) keyNoteEl.textContent = t("key_note");
  liveTitleEl.textContent = t("live");
  liveLabelTimeEl.textContent = t("time");
  liveLabelDateEl.textContent = t("date");
  liveLabelYearEl.textContent = t("year");
  limitNoteEl.textContent = t("limit_note");
  welcomeTitleEl.textContent = t("welcome_title");
  updateHeroTitle(true);
  promptInput.placeholder = t("prompt_placeholder");
  if (chatSearchInput) chatSearchInput.placeholder = t("search_chats");
  cityInput.placeholder = t("city_placeholder");
  weatherBtn.textContent = t("weather");
  const sendLabel = t("send");
  sendBtn.setAttribute("aria-label", sendLabel);
  sendBtn.setAttribute("title", sendLabel);
  const sendArrow = sendBtn.querySelector(".send-arrow");
  if (sendArrow) {
    sendArrow.textContent = "↑";
  } else {
    sendBtn.textContent = "↑";
  }
  if (stopBtn) {
    stopBtn.setAttribute("aria-label", t("stop"));
    stopBtn.setAttribute("title", t("stop"));
  }
  imageHeadEl.textContent = t("image_head");
  imagePromptInput.placeholder = t("image_prompt");
  generateImageBtn.textContent = t("create");
  logoutBtn.textContent = t("logout");
  liveLabelConditionEl.textContent = t("live_condition");
  liveLabelUpdatedEl.textContent = t("live_updated");
  if (webSearchLabel) webSearchLabel.textContent = t("web_search");
  if (autoSpeakLabel) autoSpeakLabel.textContent = t("tts_toggle");
  if (exportJsonBtn) exportJsonBtn.textContent = t("export_json");
  if (attachBtn) attachBtn.title = t("attach_file");
  if (voiceBtn) voiceBtn.title = t("voice_input");
  if (speakBtn) speakBtn.title = t("speak_last");
  if (imagesNavBtn) imagesNavBtn.textContent = t("images_tab");
  if (langSwitchButtons.length === 3) {
    langSwitchButtons[0].textContent = "Русский";
    langSwitchButtons[1].textContent = "Українська";
    langSwitchButtons[2].textContent = "English";
  }
  if (taskProfileSelect?.options?.length >= 5) {
    taskProfileSelect.options[0].text = t("profile_general");
    taskProfileSelect.options[1].text = t("profile_code");
    taskProfileSelect.options[2].text = t("profile_study");
    taskProfileSelect.options[3].text = t("profile_texts");
    taskProfileSelect.options[4].text = t("profile_translation");
  }
  if (taskSwitchButtons.length === 5) {
    taskSwitchButtons[0].textContent = t("profile_general");
    taskSwitchButtons[1].textContent = t("profile_code");
    taskSwitchButtons[2].textContent = t("profile_study");
    taskSwitchButtons[3].textContent = t("profile_texts");
    taskSwitchButtons[4].textContent = t("profile_translation");
  }
  if (modelSelect?.options?.length >= 2) {
    modelSelect.options[0].text = t("model_v1_label");
    modelSelect.options[1].text = t("model_v2_label");
  }
  if (modelSwitchButtons.length >= 2) {
    modelSwitchButtons[0].textContent = t("model_v1_label");
    modelSwitchButtons[1].textContent = t("model_v2_label");
  }

  chips.forEach((chip) => {
    const chipKey = chip.dataset.key;
    const langChip = CHIP_CONTENT[currentLang]?.[chipKey] || CHIP_CONTENT.ru?.[chipKey];
    if (langChip) {
      chip.textContent = langChip.label;
      chip.dataset.prompt = langChip.prompt;
    }
  });

  updateCounter();
  updateLiveClock();
  updateWeatherUI();
  renderChatList();
  renderMessages();
  updateImageStatus();
  renderAttachmentBar();
  if (imagesNavBtn) {
    imagesNavBtn.classList.toggle("active", currentView === "images");
  }
  syncLangSwitchButtons();
  syncTaskSwitchButtons();
  updateAccountAvatar(userPill?.classList.contains("visible") ? userNameEl?.textContent : "");
}

function getAvatarLetter(name = "") {
  const value = String(name || "").trim();
  const match = value.match(/[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]/u);
  if (!match) return "U";
  return match[0].toUpperCase();
}

function updateAccountAvatar(name = "") {
  if (!accountAvatarEl) return;
  if (name && String(name).trim()) {
    accountAvatarEl.textContent = getAvatarLetter(name);
    return;
  }
  accountAvatarEl.textContent = getAvatarLetter(t("user_fallback"));
}

function openAccountMenu() {
  if (!accountMenuEl) return;
  accountMenuEl.classList.remove("hidden");
  if (accountToggleBtn) {
    accountToggleBtn.classList.add("active");
    accountToggleBtn.setAttribute("aria-expanded", "true");
  }
}

function closeAccountMenu() {
  if (!accountMenuEl) return;
  accountMenuEl.classList.add("hidden");
  if (accountToggleBtn) {
    accountToggleBtn.classList.remove("active");
    accountToggleBtn.setAttribute("aria-expanded", "false");
  }
}

function toggleAccountMenu() {
  if (!accountMenuEl) return;
  if (accountMenuEl.classList.contains("hidden")) {
    openAccountMenu();
  } else {
    closeAccountMenu();
  }
}

function initAdvancedFeatures() {
  webSearchEnabled = false;
  localStorage.removeItem("fley_web_search");
  autoSpeakEnabled = localStorage.getItem("fley_auto_speak") === "1";
  if (webSearchToggle) webSearchToggle.checked = webSearchEnabled;
  if (autoSpeakToggle) autoSpeakToggle.checked = autoSpeakEnabled;
  initSpeechRecognition();
  initSpeechSynthesis();
  if (window.pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (voiceBtn) voiceBtn.disabled = true;
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = getLocale();
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript;
    }
    promptInput.value = promptInput.value ? `${promptInput.value} ${transcript}`.trim() : transcript.trim();
  };
  recognition.onend = () => {
    isListening = false;
    updateVoiceButton();
    setStatus(t("listening_off"), "ok");
  };
  recognition.onerror = () => {
    isListening = false;
    updateVoiceButton();
  };
  updateVoiceButton();
}

function updateVoiceButton() {
  if (!voiceBtn) return;
  voiceBtn.classList.toggle("recording", isListening);
  voiceBtn.setAttribute("aria-pressed", isListening ? "true" : "false");
  voiceBtn.title = isListening ? t("stop") : t("voice_input");
}

function toggleVoiceInput() {
  if (!recognition) {
    setStatus(t("speech_not_supported"), "warn");
    return;
  }
  recognition.lang = getLocale();
  if (isListening) {
    recognition.stop();
    return;
  }
  try {
    isListening = true;
    updateVoiceButton();
    recognition.start();
    setStatus(t("listening_on"), "ok");
  } catch (err) {
    isListening = false;
    updateVoiceButton();
    setStatus(t("speech_not_supported"), "warn");
  }
}

function initSpeechSynthesis() {
  if (!window.speechSynthesis) return;
  refreshSpeechVoices();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refreshSpeechVoices);
  } else {
    window.speechSynthesis.onvoiceschanged = refreshSpeechVoices;
  }
}

function refreshSpeechVoices() {
  if (!window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices?.() || [];
  speechVoices = Array.isArray(voices) ? voices : [];
  return speechVoices;
}

function getPreferredVoice(locale = getLocale()) {
  const voices = speechVoices.length ? speechVoices : refreshSpeechVoices();
  if (!voices.length) return null;

  const targetLocale = (locale || "ru-RU").toLowerCase();
  const targetBase = targetLocale.split("-")[0];

  const scoreVoice = (voice) => {
    const voiceLang = (voice.lang || "").toLowerCase();
    const voiceBase = voiceLang.split("-")[0];
    const name = (voice.name || "").toLowerCase();
    let score = 0;

    if (voiceLang === targetLocale) score += 80;
    if (voiceBase === targetBase) score += 60;
    if (voice.localService) score += 6;
    if (/natural|neural|online|enhanced|premium/.test(name)) score += 16;
    if (/microsoft|google|apple/.test(name)) score += 10;
    if (/espeak|festival|mbrola|robot/.test(name)) score -= 18;
    return score;
  };

  const exact = voices.filter((voice) => (voice.lang || "").toLowerCase() === targetLocale);
  const sameBase = voices.filter((voice) => (voice.lang || "").toLowerCase().startsWith(`${targetBase}-`) || (voice.lang || "").toLowerCase() === targetBase);
  const pool = exact.length ? exact : sameBase.length ? sameBase : voices;

  let best = pool[0];
  let bestScore = -Infinity;
  pool.forEach((voice) => {
    const score = scoreVoice(voice);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  });
  return best || null;
}

function getSpeakRate(locale = getLocale()) {
  const value = (locale || "").toLowerCase();
  if (value.startsWith("ru") || value.startsWith("uk")) return 0.96;
  return 0.98;
}

function normalizeSpeechText(value) {
  return (value || "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function speakText(text) {
  const value = normalizeSpeechText(text);
  if (!value) {
    setStatus(t("no_reply_to_speak"), "warn");
    return;
  }
  if (!window.speechSynthesis) {
    setStatus(t("speech_not_supported"), "warn");
    return;
  }
  const locale = getLocale();
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = locale;
  utterance.rate = getSpeakRate(locale);
  utterance.pitch = 1;
  utterance.volume = 1;
  const preferredVoice = getPreferredVoice(locale);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    if (preferredVoice.lang) utterance.lang = preferredVoice.lang;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function stopAudio() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (recognition && isListening) {
    try {
      recognition.stop();
    } catch (err) {
      // Ignore recognition stop errors.
    }
  }
  isListening = false;
  updateVoiceButton();
}

function setStatus(text, level = "") {
  statusEl.textContent = text;
  statusEl.dataset.level = level;
}

function getModelLimit(modelName = getSelectedModel()) {
  return MODEL_LIMITS[modelName] || 50;
}

function getModelLabel(modelName = getSelectedModel()) {
  const fromSwitch = modelSwitchButtons.find((btn) => btn.dataset.model === modelName)?.textContent?.trim();
  if (fromSwitch) return fromSwitch;
  const fromSelect = Array.from(modelSelect?.options || []).find((opt) => opt.value === modelName)?.text?.trim();
  return fromSelect || modelName || "Fley";
}

function getModelQuotaCount(modelName = getSelectedModel()) {
  return Number(modelQuotaCounts?.[modelName] || 0);
}

function setModelQuotaCount(modelName, count) {
  if (!modelName) return;
  modelQuotaCounts[modelName] = Math.max(0, Number(count) || 0);
}

function persistModelQuotaCounts() {
  localStorage.setItem(QUOTA_COUNTS_KEY, JSON.stringify(modelQuotaCounts));
}

function updateCounter() {
  const model = getSelectedModel();
  messageCount = getModelQuotaCount(model);
  counterEl.textContent = t("messages_counter", { count: messageCount, max: getModelLimit(model) });
}

function getHourBucket() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
}

function refreshHourlyQuota(forceReset) {
  const bucket = getHourBucket();
  const savedBucket = localStorage.getItem(QUOTA_BUCKET_KEY);
  if (forceReset || savedBucket !== bucket) {
    modelQuotaCounts = {};
    localStorage.setItem(QUOTA_BUCKET_KEY, bucket);
    localStorage.removeItem("fley_count");
    persistModelQuotaCounts();
    if (!forceReset) setStatus(t("limit_reset"), "ok");
  } else {
    let parsed = null;
    try {
      parsed = JSON.parse(localStorage.getItem(QUOTA_COUNTS_KEY) || "{}");
    } catch (err) {
      parsed = null;
    }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      modelQuotaCounts = parsed;
    } else {
      modelQuotaCounts = {};
      const legacyCount = parseInt(localStorage.getItem("fley_count") || "0", 10);
      if (!Number.isNaN(legacyCount) && legacyCount > 0) {
        setModelQuotaCount(getSelectedModel(), legacyCount);
        persistModelQuotaCounts();
      }
    }
  }
  updateCounter();
}

function updateLiveClock() {
  const now = new Date();
  const tz = getLiveTimeZone();
  liveTimeEl.textContent = formatInTimeZone(now, {
    hour: "2-digit",
    minute: "2-digit"
  }, tz);
  liveDateEl.textContent = formatInTimeZone(now, {
    day: "2-digit",
    month: "long"
  }, tz);
  liveYearEl.textContent = getYearInTimeZone(now, tz);
}

function describeWeather(code) {
  if (code === 0) return t("weather_clear");
  if ([1, 2].includes(code)) return t("weather_partly");
  if ([3].includes(code)) return t("weather_overcast");
  if ([45, 48].includes(code)) return t("weather_fog");
  if ([51, 53, 55].includes(code)) return t("weather_drizzle");
  if ([61, 63, 65, 80, 81, 82].includes(code)) return t("weather_rain");
  if ([71, 73, 75, 85, 86].includes(code)) return t("weather_snow");
  if ([95, 96, 99].includes(code)) return t("weather_thunder");
  return t("weather_unknown");
}

function updateWeatherUI() {
  if (!lastWeather) {
    weatherResult.textContent = t("weather_not_loaded");
    liveConditionEl.textContent = "–";
    liveUpdatedEl.textContent = "–";
    return;
  }
  const condition = describeWeather(lastWeather.code);
  weatherResult.textContent = t("weather_line", {
    place: lastWeather.place,
    country: lastWeather.country,
    temp: lastWeather.temp,
    wind: lastWeather.wind,
    condition
  });
  liveConditionEl.textContent = condition;
  const observedAt = lastWeather.observedAt || lastWeather.updated;
  const observedDate = new Date(observedAt);
  const tz = normalizeTimeZone(lastWeather.timezone);
  liveUpdatedEl.textContent = `${formatInTimeZone(observedDate, { hour: "2-digit", minute: "2-digit" }, tz)} (${tz})`;
  updateLiveClock();
}

function loadWeatherCache() {
  const cached = localStorage.getItem("fley_weather");
  if (!cached) return;
  try {
    const parsed = JSON.parse(cached);
    lastWeather = {
      ...parsed,
      timezone: normalizeTimeZone(parsed?.timezone),
      observedAt: parsed?.observedAt || parsed?.updated || new Date().toISOString()
    };
    updateWeatherUI();
  } catch (err) {
    console.warn("Weather cache broken", err);
  }
}

async function handleFileSelection(fileList) {
  const files = Array.from(fileList || []).slice(0, 3);
  if (files.length === 0) return;
  const prepared = [];

  for (const file of files) {
    const item = {
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      excerpt: ""
    };

    try {
      if (item.type.startsWith("text/") || /(\.md|\.csv|\.json|\.txt)$/i.test(item.name)) {
        const text = await file.text();
        item.excerpt = text.slice(0, 1800);
      } else if (item.type === "application/pdf" || /\.pdf$/i.test(item.name)) {
        item.excerpt = await extractPdfExcerpt(file);
      } else if (item.type.startsWith("image/")) {
        item.excerpt = `[image:${item.name}]`;
      }
    } catch (err) {
      item.excerpt = "";
    }

    prepared.push(item);
  }

  pendingAttachments = [...pendingAttachments, ...prepared].slice(0, 6);
  if (fileInput) fileInput.value = "";
  renderAttachmentBar();
  setStatus(t("files_ready", { count: pendingAttachments.length }), "ok");
}

async function extractPdfExcerpt(file) {
  if (!window.pdfjsLib) return "";
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const maxPages = Math.min(pdf.numPages, 2);
    let text = "";
    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      text += `${pageText}\n`;
      if (text.length >= 1800) break;
    }
    return text.slice(0, 1800);
  } catch (err) {
    return "";
  }
}

function removeAttachment(id) {
  pendingAttachments = pendingAttachments.filter((file) => file.id !== id);
  renderAttachmentBar();
}

function renderAttachmentBar() {
  if (!attachmentBar) return;
  attachmentBar.innerHTML = "";
  pendingAttachments.forEach((file) => {
    const pill = document.createElement("div");
    pill.className = "attachment-pill";
    pill.textContent = file.name;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "attachment-remove";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => removeAttachment(file.id));

    pill.appendChild(removeBtn);
    attachmentBar.appendChild(pill);
  });
}

function buildAttachmentContext() {
  if (pendingAttachments.length === 0) return "";
  const lines = pendingAttachments.map((file) => {
    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    const meta = `${file.name} (${file.type}, ${sizeKb}KB)`;
    return file.excerpt ? `- ${meta}\n${file.excerpt}` : `- ${meta}`;
  });
  return `${t("attached_files")}:\n${lines.join("\n\n")}`;
}

function isNearBottom() {
  return messagesEl.scrollTop + messagesEl.clientHeight >= messagesEl.scrollHeight - 20;
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
  if (mainEl) {
    mainEl.scrollTo({ top: mainEl.scrollHeight, behavior: "smooth" });
  }
}

function addMessage(role, text, options = {}) {
  const row = document.createElement("div");
  row.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (role === "assistant") {
    bubble.innerHTML = linkifyAndFormat(text);
  } else {
    bubble.textContent = text;
  }

  row.appendChild(bubble);
  if (options.append) {
    messagesEl.appendChild(row);
  } else {
    messagesEl.insertBefore(row, welcomeEl.nextSibling);
  }

  if (options.scroll) scrollToBottom();
}

function linkifyAndFormat(text) {
  const escaped = escapeHtml(text || "");
  const withLinks = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>'
  );
  return withLinks.replace(/\n/g, "<br>");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addTypingIndicator() {
  const row = document.createElement("div");
  row.className = "message assistant";
  const bubble = document.createElement("div");
  bubble.className = "bubble typing";
  bubble.innerHTML = '<span></span><span></span><span></span>';
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  scrollToBottom();
  return row;
}

function triggerFirstReplyAnimation() {
  messagesEl.classList.add("first-reply");
  setTimeout(() => messagesEl.classList.remove("first-reply"), 420);
}

function triggerExpandDown() {
  if (!conversationEl) return;
  conversationEl.classList.add("expand");
  setTimeout(() => conversationEl.classList.remove("expand"), 260);
}

function hasKey() {
  return API_KEY && API_KEY !== "PASTE_GROQ_API_KEY_HERE";
}

function hasImageKey() {
  const directKeyReady = AIRFORCE_API_KEY && AIRFORCE_API_KEY !== "VITE_REPLACE_ME";
  const canUseProxy = window.location.protocol === "http:" || window.location.protocol === "https:";
  return Boolean(directKeyReady || canUseProxy);
}

function setImageStatusText(text, loading = false) {
  if (!imageStatusEl) return;
  imageStatusEl.textContent = text;
  imageStatusEl.classList.toggle("loading", Boolean(loading));
}

function updateImageStatus() {
  setImageStatusText(t("image_ready"), false);
}

function getIdentitySystem() {
  return t("identity_system", { name: ASSISTANT_NAME });
}

function getLanguageSystem() {
  return t("language_system");
}

function getBehaviorSystem() {
  return t("behavior_system");
}

function normalizeRememberedName(value = "") {
  const cleaned = String(value || "")
    .replace(/[\r\n\t]/g, " ")
    .replace(/[’`]/g, "'")
    .replace(/[«»"“”]/g, "")
    .trim()
    .replace(/\s+/g, " ");
  if (!cleaned) return "";

  const tailTrimmed = cleaned.replace(/[.,!?;:()\[\]{}]+$/g, "").trim();
  if (!tailTrimmed) return "";

  const parts = tailTrimmed.split(" ").slice(0, 3);
  const validPart = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'-]{2,}$/;
  if (!parts.every((part) => validPart.test(part))) return "";

  const blockedWords = new Set([
    "меня",
    "зовут",
    "мене",
    "звати",
    "имя",
    "i",
    "am",
    "is",
    "my",
    "name",
    "call",
    "me",
    "user"
  ]);
  if (parts.some((part) => blockedWords.has(part.toLowerCase()))) return "";

  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" ");
}

function extractNameFromText(text = "") {
  if (!text) return "";
  const patterns = [
    /\b(?:меня\s+зовут|мое\s+имя|моё\s+имя|зови\s+меня)\s+([A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]{2,40})/iu,
    /\b(?:мене\s+звати|моє\s+ім['’]?я|зови\s+мене)\s+([A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]{2,40})/iu,
    /\b(?:my\s+name\s+is|call\s+me)\s+([A-Za-z' -]{2,40})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;
    const normalized = normalizeRememberedName(match[1]);
    if (normalized) return normalized;
  }
  return "";
}

function saveUserMemory() {
  localStorage.setItem(USER_MEMORY_KEY, JSON.stringify(userMemory));
}

function loadUserMemory() {
  const saved = localStorage.getItem(USER_MEMORY_KEY);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    const rememberedName = normalizeRememberedName(data?.name || "");
    userMemory = { name: rememberedName };
  } catch (err) {
    userMemory = { name: "" };
  }
}

function getRememberedUserName() {
  const memoryName = normalizeRememberedName(userMemory?.name || "");
  if (memoryName) return memoryName;
  return "";
}

function getUserMemorySystem() {
  const rememberedName = getRememberedUserName();
  if (!rememberedName) return "";
  return t("memory_name_system", { name: rememberedName });
}

function updateUserMemoryFromText(text = "") {
  const extractedName = extractNameFromText(text);
  if (!extractedName) return false;
  if (userMemory.name === extractedName) return false;
  userMemory.name = extractedName;
  saveUserMemory();
  return true;
}

function isFleyV1Model(modelName) {
  return modelName === "llama-3.1-8b-instant";
}

function getModelPresetSystem(modelName) {
  return t(isFleyV1Model(modelName) ? "model_preset_v1" : "model_preset_v2");
}

function getModelResponseProfile(modelName) {
  if (isFleyV1Model(modelName)) {
    return { temperature: 0.45, maxTokens: 220, topP: 0.9 };
  }
  return { temperature: 0.85, maxTokens: 850, topP: 0.97 };
}

function getLiveContext({ includeTime = false, includeWeather = false } = {}) {
  if (!includeTime && !includeWeather) return "";
  const now = new Date();
  const tz = getLiveTimeZone();
  const time = formatInTimeZone(now, { hour: "2-digit", minute: "2-digit" }, tz);
  const dateLabel = formatInTimeZone(now, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }, tz);
  const isoDate = getIsoDateInTimeZone(now, tz);
  const date = `${dateLabel} (${isoDate})`;
  const year = getYearInTimeZone(now, tz);
  let context = "";
  if (includeTime) {
    context = t("live_context", { time, tz, date, year });
  }

  if (includeWeather && lastWeather) {
    const observedDate = new Date(lastWeather.observedAt || lastWeather.updated);
    const weatherTz = normalizeTimeZone(lastWeather.timezone || tz);
    const weatherLine = t("weather_context", {
      place: lastWeather.place,
      country: lastWeather.country,
      temp: lastWeather.temp,
      wind: lastWeather.wind,
      time: formatInTimeZone(observedDate, {
        hour: "2-digit",
        minute: "2-digit"
      }, weatherTz)
    });
    context = context ? `${context}\n${weatherLine}` : weatherLine;
  }
  return context;
}

function needsTimeContext(text = "") {
  const lower = text.toLowerCase();
  return [
    "время",
    "дата",
    "год",
    "который час",
    "сегодня",
    "сейчас",
    "time",
    "date",
    "year",
    "what time",
    "today",
    "now",
    "час",
    "дата",
    "рік",
    "котра година",
    "сьогодні"
  ].some((token) => lower.includes(token));
}

function getSelectedModel() {
  return modelSelect.value;
}

function getFallbackModel(currentModel = getSelectedModel()) {
  const options = Array.from(modelSelect.options || []);
  const alt = options.find((opt) => opt.value && opt.value !== currentModel);
  return alt?.value || options[0]?.value || "";
}

function isModelError(message = "") {
  const lowered = message.toLowerCase();
  return lowered.includes("model") || lowered.includes("not found") || lowered.includes("unsupported");
}

function loadChats() {
  const stored = localStorage.getItem("fley_chats");
  if (stored) {
    try {
      chats = JSON.parse(stored) || [];
    } catch (err) {
      chats = [];
    }
  }
  if (!Array.isArray(chats)) chats = [];
  hydrateUserMemoryFromChats();

  if (chats.length === 0) {
    createNewChat(t("new_chat_title"), false);
  } else {
    currentChatId = chats[0].id;
  }
  renderChatList();
  renderMessages();
}

function saveChats() {
  localStorage.setItem("fley_chats", JSON.stringify(chats));
}

function hydrateUserMemoryFromChats() {
  if (getRememberedUserName()) return;
  for (const chat of chats) {
    if (!Array.isArray(chat?.messages)) continue;
    for (let i = chat.messages.length - 1; i >= 0; i -= 1) {
      const msg = chat.messages[i];
      if (msg?.role !== "user") continue;
      const sourceText = msg.modelText || msg.text || "";
      const extractedName = extractNameFromText(sourceText);
      if (!extractedName) continue;
      userMemory.name = extractedName;
      saveUserMemory();
      return;
    }
  }
}

function createNewChat(title = t("new_chat_title"), setCurrent = true) {
  stopAudio();
  const chat = {
    id: `chat_${Date.now()}`,
    title,
    messages: []
  };
  chats.unshift(chat);
  if (setCurrent) {
    currentChatId = chat.id;
  }
  saveChats();
  renderChatList();
  renderMessages();
  clearImageOutput();
  pendingAttachments = [];
  renderAttachmentBar();
}

function renderChatList() {
  if (!chatListEl) return;
  const filter = chatSearchInput?.value?.toLowerCase() || "";
  chatListEl.innerHTML = "";
  chats.forEach((chat) => {
    if (filter && !chat.title.toLowerCase().includes(filter)) return;

    const item = document.createElement("button");
    item.className = `chat-item${chat.id === currentChatId ? " active" : ""}`;
    item.type = "button";
    item.textContent = chat.title;

    const del = document.createElement("span");
    del.className = "chat-delete";
    del.textContent = "🗑";
    del.title = t("delete_chat");
    del.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteChat(chat.id);
    });

    item.appendChild(del);
    item.addEventListener("click", () => loadChat(chat.id));
    chatListEl.appendChild(item);
  });
}

function loadChat(chatId) {
  stopAudio();
  currentChatId = chatId;
  setMainView("chat");
  closeSidebar();
  renderChatList();
  renderMessages();
  pendingAttachments = [];
  renderAttachmentBar();
}

function clearImageOutput() {
  if (!imageOutputEl) return;
  if (lastImageObjectUrl) {
    URL.revokeObjectURL(lastImageObjectUrl);
    lastImageObjectUrl = null;
  }
  imageOutputEl.innerHTML = "";
  updateImageStatus();
}

function renderMessages() {
  const current = getCurrentChat();
  messagesEl.querySelectorAll(".message, .msg").forEach((node) => node.remove());
  if (!current || current.messages.length === 0) {
    welcomeEl.style.display = "block";
    const first = document.createElement("div");
    first.className = "message assistant";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = t("greeting");
    first.appendChild(bubble);
    messagesEl.appendChild(first);
  } else {
    welcomeEl.style.display = "none";
    current.messages.forEach((msg) => {
      addMessage(msg.role, msg.text, { append: true });
    });
  }
  scrollToBottom();
  updateEmptyState();
}

function updateChatTitle(chat, userText) {
  if (!chat || !userText) return;
  if (!isDefaultChatTitle(chat.title)) return;
  chat.title = userText.slice(0, 26);
  saveChats();
  renderChatList();
}

function updateEmptyState() {
  if (!mainEl) return;
  const wasEmpty = mainEl.classList.contains("empty");
  const current = getCurrentChat();
  const isChatView = currentView !== "images";
  const isEmpty = isChatView && (!current || current.messages.length === 0);
  mainEl.classList.toggle("empty", isEmpty);
  if (isEmpty) {
    updateHeroTitle(true);
  }
  if (isChatView && wasEmpty && !isEmpty && conversationEl) {
    conversationEl.classList.add("activate");
    setTimeout(() => conversationEl.classList.remove("activate"), 420);
  }
  restartHeroRotation();
}

function getCurrentChat() {
  return chats.find((chat) => chat.id === currentChatId);
}

function deleteChat(id) {
  stopAudio();
  chats = chats.filter((chat) => chat.id !== id);
  if (currentChatId === id) {
    currentChatId = chats[0]?.id || null;
  }
  if (!currentChatId) {
    createNewChat(t("new_chat_title"), true);
  }
  saveChats();
  renderChatList();
  renderMessages();
}

function exportChats() {
  const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
  const blob = new Blob([JSON.stringify(chats, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `fley-chats-${stamp}.json`);
  setStatus(t("export_done"), "ok");
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function bootStatus() {
  if (window.location.protocol === "file:") {
    setStatus(t("open_localhost_status"), "warn");
    alert(t("open_localhost_msg"));
  } else if (!hasKey()) {
    setStatus(t("need_groq_status"), "warn");
    alert(t("need_groq_msg"));
  } else if (!API_KEY.startsWith("gsk_")) {
    setStatus(t("check_groq_status"), "warn");
  } else {
    setStatus(t("key_found"), "ok");
  }
}

function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(t("image_timeout"))), timeout);
    fetch(url, options)
      .then((resp) => {
        clearTimeout(timer);
        resolve(resp);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function sendMessage() {
  stopAudio();
  if (isChatRequestInFlight) return;
  const text = promptInput.value.trim();
  if (!text && pendingAttachments.length === 0) return;
  if (!hasKey()) {
    setStatus(t("set_groq_status"), "warn");
    alert(t("set_groq_msg"));
    return;
  }
  const model = getSelectedModel();
  if (!model) {
    setStatus(t("select_model"), "warn");
    return;
  }
  const modelLimit = getModelLimit(model);
  const usedForModel = getModelQuotaCount(model);
  if (usedForModel >= modelLimit) {
    setStatus(t("limit_reached", { max: modelLimit, model: getModelLabel(model) }), "warn");
    return;
  }

  const current = getCurrentChat();
  if (!current) return;

  const baseText = text || t("attached_files");
  const attachmentContext = buildAttachmentContext();
  const displayText = pendingAttachments.length
    ? `${baseText}\n📎 ${pendingAttachments.map((file) => file.name).join(", ")}`
    : baseText;
  const modelText = attachmentContext ? `${baseText}\n\n${attachmentContext}` : baseText;
  updateUserMemoryFromText(baseText);

  const shouldScroll = isNearBottom();
  addMessage("user", displayText, { append: true, scroll: shouldScroll });
  current.messages.push({ role: "user", text: displayText, modelText });
  updateChatTitle(current, baseText);
  promptInput.value = "";
  pendingAttachments = [];
  renderAttachmentBar();
  updateEmptyState();

  const weatherQuery = extractWeatherQuery(baseText);
  const includeTimeContext = needsTimeContext(baseText);
  if (weatherQuery) {
    cityInput.value = weatherQuery;
    await fetchWeatherByQuery(weatherQuery, { silent: true });
  }

  const imageQuery = extractImageQuery(baseText);
  if (imageQuery) {
    imagePromptInput.value = imageQuery;
    await generateImage();
  }

  let webResults = [];
  if (webSearchEnabled) {
    setStatus(t("web_searching"));
    webResults = await fetchWebResults(baseText);
  }

  const typingRow = addTypingIndicator();
  if (current.messages.length === 1) {
    triggerFirstReplyAnimation();
    triggerExpandDown();
  }

  setModelQuotaCount(model, usedForModel + 1);
  persistModelQuotaCounts();
  updateCounter();
  setStatus(t("sending"));

  const liveContext = getLiveContext({
    includeTime: includeTimeContext,
    includeWeather: Boolean(weatherQuery)
  });

  const systemMessages = [
    { role: "system", content: getIdentitySystem() },
    { role: "system", content: getLanguageSystem() },
    { role: "system", content: getBehaviorSystem() },
    { role: "system", content: getTaskProfileSystem() },
    { role: "system", content: getModelPresetSystem(model) }
  ];
  const userMemorySystem = getUserMemorySystem();
  if (userMemorySystem) {
    systemMessages.push({ role: "system", content: userMemorySystem });
  }
  if (liveContext) {
    systemMessages.push({ role: "system", content: liveContext });
  }
  if (webResults.length > 0) {
    systemMessages.push({
      role: "system",
      content: `Web results:\n${formatWebResultsForPrompt(webResults)}\nUse these sources and do not invent links.`
    });
  }
  if (systemInput.value.trim()) {
    systemMessages.push({ role: "system", content: systemInput.value.trim() });
  }

  const historyMessages = current.messages.map((msg) => ({
    role: msg.role,
    content: msg.modelText || msg.text
  }));

  const payloadBase = {
    messages: [...systemMessages, ...historyMessages]
  };

  isChatRequestInFlight = true;
  activeChatAbortController = new AbortController();
  updateComposerActionButtons();

  const callGroq = async (modelName) => {
    const profile = getModelResponseProfile(modelName);
    return fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      signal: activeChatAbortController?.signal,
      body: JSON.stringify({
        ...payloadBase,
        model: modelName,
        temperature: profile.temperature,
        max_tokens: profile.maxTokens,
        top_p: profile.topP
      })
    });
  };

  try {
    let response = await callGroq(model);
    let errorText = "";

    if (!response.ok) {
      errorText = await response.text();
      const fallback = getFallbackModel(model);
      if (isModelError(errorText) && fallback && fallback !== model) {
        if (fallback) {
          setStatus(t("switching_model"), "warn");
          modelSelect.value = fallback;
          syncModelSwitchButtons();
          updateCounter();
          response = await callGroq(fallback);
        }
      }
    }

    if (!response.ok) {
      if (!errorText) errorText = await response.text();
      const isLimit = response.status === 429;
      setStatus(isLimit ? t("groq_limit_status") : t("api_error_status"), "error");
      const errorMessage = isLimit ? t("groq_limit_msg") : errorText || t("api_error_status");
      typingRow.remove();
      addMessage("assistant", errorMessage, { append: true, scroll: true });
      current.messages.push({ role: "assistant", text: errorMessage });
      return;
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || t("no_reply");
    const finalAnswer = appendSources(answer, webResults);
    typingRow.remove();
    addMessage("assistant", finalAnswer, { append: true, scroll: true });
    current.messages.push({ role: "assistant", text: finalAnswer });
    lastAssistantReply = answer;
    saveChats();
    setStatus(t("status_ready"), "ok");
    if (autoSpeakEnabled) speakText(answer);
  } catch (err) {
    typingRow.remove();
    if (err?.name === "AbortError") {
      setStatus(t("stopped"), "warn");
      return;
    }
    setStatus(t("network_error_status"), "error");
    const message = err?.message ? t("network_error_msg", { message: err.message }) : t("network_error_status");
    addMessage("assistant", message, { append: true, scroll: true });
    current.messages.push({ role: "assistant", text: message });
  } finally {
    isChatRequestInFlight = false;
    activeChatAbortController = null;
    updateComposerActionButtons();
  }
}

async function fetchWeather() {
  const place = cityInput.value.trim();
  if (!place) {
    setStatus(t("weather_enter_city"), "warn");
    return;
  }
  await fetchWeatherByQuery(place, { silent: false });
}

function extractWeatherQuery(text) {
  const lower = text.toLowerCase();
  if (lower.includes("погода")) {
    const match = text.match(/погода\\s*(?:в|по|на)?\\s*(.+)?/i);
    return match?.[1]?.trim() || text.replace(/погода/gi, "").trim();
  }
  if (lower.includes("погода") && lower.includes("у")) {
    const match = text.match(/погода\\s*(?:в|у|на)?\\s*(.+)?/i);
    return match?.[1]?.trim() || text.replace(/погода/gi, "").trim();
  }
  if (lower.includes("weather")) {
    const match = text.match(/weather\\s*(?:in)?\\s*(.+)?/i);
    return match?.[1]?.trim() || text.replace(/weather/gi, "").trim();
  }
  return "";
}

function extractImageQuery(text) {
  const patterns = [
    /^(?:нарисуй|сгенерируй|создай)\s+(?:изображение|картинку|фото)?\s*(.+)$/i,
    /^(?:draw|generate|create)\s+(?:an?\s+)?(?:image|picture|photo)?\s*(.+)$/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  if (text.toLowerCase().startsWith("image:")) {
    return text.slice(6).trim();
  }
  return "";
}

async function fetchWebResults(query) {
  const trimmed = (query || "").trim();
  if (!trimmed) return [];
  const results = [];

  const langCode = currentLang === "uk" ? "uk" : currentLang === "en" ? "en" : "ru";
  const wikiHost = currentLang === "uk" ? "uk.wikipedia.org" : currentLang === "en" ? "en.wikipedia.org" : "ru.wikipedia.org";

  try {
    const wikiResp = await fetch(
      `https://${wikiHost}/w/api.php?action=query&list=search&format=json&origin=*&utf8=1&srlimit=3&srsearch=${encodeURIComponent(trimmed)}`
    );
    const wikiData = await wikiResp.json();
    (wikiData?.query?.search || []).forEach((item) => {
      const title = item.title || "";
      const url = `https://${wikiHost}/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
      const snippet = stripHtml(item.snippet || "");
      results.push({ title, snippet, url });
    });
  } catch (err) {
    // Ignore web search source failures and continue with other providers.
  }

  try {
    const ddgResp = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(trimmed)}&format=json&no_html=1&skip_disambig=1&kl=${langCode}-ru`
    );
    const ddgData = await ddgResp.json();
    if (ddgData?.AbstractURL) {
      results.push({
        title: ddgData.Heading || "DuckDuckGo",
        snippet: ddgData.AbstractText || "",
        url: ddgData.AbstractURL
      });
    }
    const topics = flattenDdgTopics(ddgData?.RelatedTopics || []);
    topics.slice(0, 3).forEach((topic) => {
      if (topic?.FirstURL) {
        results.push({
          title: topic.Text?.split(" - ")[0] || topic.Text || "Result",
          snippet: topic.Text || "",
          url: topic.FirstURL
        });
      }
    });
  } catch (err) {
    // Ignore web search source failures and continue.
  }

  const dedup = new Map();
  results.forEach((item) => {
    if (!item?.url || dedup.has(item.url)) return;
    dedup.set(item.url, {
      title: item.title || item.url,
      snippet: item.snippet || "",
      url: item.url
    });
  });
  return Array.from(dedup.values()).slice(0, 5);
}

function flattenDdgTopics(topics) {
  const output = [];
  topics.forEach((topic) => {
    if (topic?.Topics) {
      output.push(...flattenDdgTopics(topic.Topics));
    } else {
      output.push(topic);
    }
  });
  return output;
}

function stripHtml(value) {
  return (value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatWebResultsForPrompt(results) {
  return results
    .map((item, index) => `${index + 1}. ${item.title}\n${item.snippet}\nURL: ${item.url}`)
    .join("\n\n");
}

function appendSources(answer, results) {
  if (!results || results.length === 0) return answer;
  const sources = results.map((item) => `- ${item.title}: ${item.url}`).join("\n");
  return `${answer}\n\n${t("sources_title")}:\n${sources}`;
}

async function fetchWeatherByQuery(place, { silent } = {}) {
  if (!place || isWeatherRequestInFlight) return false;
  if (!silent) {
    weatherResult.textContent = t("weather_loading");
    setStatus(t("weather_loading"));
  }
  isWeatherRequestInFlight = true;
  try {
    const geoLang = currentLang === "uk" ? "uk" : currentLang === "en" ? "en" : "ru";
    const geoResp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=10&language=${geoLang}`);
    const geoData = await geoResp.json();
    const geoResults = Array.isArray(geoData?.results) ? geoData.results : [];
    let loc = pickBestGeoResult(geoResults, place);

    if (!loc) {
      const nominatimResp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=3&addressdetails=1&accept-language=${geoLang}&q=${encodeURIComponent(place)}`
      );
      const nominatimData = await nominatimResp.json();
      const first = Array.isArray(nominatimData) ? nominatimData[0] : null;
      if (first) {
        const addr = first.address || {};
        const placeName =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.hamlet ||
          addr.municipality ||
          addr.county ||
          first.display_name?.split(",")?.[0] ||
          place;
        loc = {
          latitude: parseFloat(first.lat),
          longitude: parseFloat(first.lon),
          name: placeName,
          country: addr.country || "",
          timezone: getBrowserTimeZone()
        };
      }
    }

    if (!loc || !Number.isFinite(loc.latitude) || !Number.isFinite(loc.longitude)) {
      if (!silent) {
        weatherResult.textContent = t("weather_not_found");
        setStatus(t("weather_error_status"), "warn");
      }
      return false;
    }

    const weatherResp = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&timezone=auto&windspeed_unit=ms&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`
    );
    const weatherData = await weatherResp.json();
    const current = weatherData?.current || weatherData?.current_weather;
    const temperature = Number(current?.temperature_2m ?? current?.temperature);
    const windSpeed = Number(current?.wind_speed_10m ?? current?.windspeed);
    const weatherCode = Number(current?.weather_code ?? current?.weathercode);
    const humidity = Number(current?.relative_humidity_2m);
    const apparent = Number(current?.apparent_temperature);
    if (!Number.isFinite(temperature) || !Number.isFinite(windSpeed) || !Number.isFinite(weatherCode)) {
      if (!silent) {
        weatherResult.textContent = t("weather_no_data");
        setStatus(t("weather_error_status"), "warn");
      }
      return false;
    }

    lastWeather = {
      query: place,
      place: loc.name || place,
      country: loc.country || "",
      latitude: Math.round(Number(loc.latitude) * 10000) / 10000,
      longitude: Math.round(Number(loc.longitude) * 10000) / 10000,
      timezone: normalizeTimeZone(weatherData?.timezone || loc.timezone || getBrowserTimeZone()),
      temp: Math.round(temperature * 10) / 10,
      feelsLike: Number.isFinite(apparent) ? Math.round(apparent * 10) / 10 : null,
      humidity: Number.isFinite(humidity) ? Math.round(humidity) : null,
      wind: Math.round(windSpeed * 10) / 10,
      code: weatherCode,
      observedAt: current?.time || new Date().toISOString(),
      updated: new Date().toISOString()
    };
    cityInput.value = place;
    localStorage.setItem("fley_weather", JSON.stringify(lastWeather));
    updateWeatherUI();
    if (!silent) setStatus(t("weather_updated"), "ok");
    return true;
  } catch (err) {
    if (!silent) {
      weatherResult.textContent = t("weather_error");
      setStatus(t("weather_error_status"), "error");
    }
    return false;
  } finally {
    isWeatherRequestInFlight = false;
  }
}

function normalizeGeoText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function pickBestGeoResult(results, query) {
  if (!Array.isArray(results) || results.length === 0) return null;
  const target = normalizeGeoText(query);
  if (!target) return results[0];
  let best = results[0];
  let bestScore = -Infinity;
  results.forEach((item) => {
    const name = normalizeGeoText(item?.name || "");
    const admin = normalizeGeoText(item?.admin1 || "");
    const country = normalizeGeoText(item?.country || "");
    const combined = `${name} ${admin} ${country}`.trim();
    let score = 0;
    if (name === target) score += 120;
    if (combined.startsWith(target)) score += 80;
    if (combined.includes(target) || target.includes(name)) score += 50;
    if (String(item?.feature_code || "").startsWith("PPL")) score += 12;
    if (Number.isFinite(item?.population)) {
      score += Math.min(16, Math.log10(item.population + 1) * 2.5);
    }
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  });
  return best;
}

function getImageDimensionsByRatio(ratio = "1:1") {
  switch (ratio) {
    case "3:2":
      return { width: 1152, height: 768 };
    case "2:3":
      return { width: 768, height: 1152 };
    case "1:1":
    default:
      return { width: 1024, height: 1024 };
  }
}

function buildPollinationsUrl(prompt, ratio = "1:1") {
  const { width, height } = getImageDimensionsByRatio(ratio);
  const seed = Math.floor(Math.random() * 1_000_000_000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=${width}&height=${height}&safe=true&nologo=true&enhance=false&seed=${seed}`;
}

function buildPollinationsFallbackUrls(prompt, ratio = "1:1") {
  const { width, height } = getImageDimensionsByRatio(ratio);
  const encodedPrompt = encodeURIComponent(prompt);
  const seedA = Math.floor(Math.random() * 1_000_000_000);
  const seedB = Math.floor(Math.random() * 1_000_000_000);
  const seedC = Math.floor(Math.random() * 1_000_000_000);
  return [
    `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&safe=true&nologo=true&enhance=false&seed=${seedA}`,
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&safe=true&nologo=true&enhance=false&seed=${seedB}`,
    `https://image.pollinations.ai/prompt/${encodedPrompt}?model=sana&width=768&height=768&safe=true&nologo=true&enhance=false&seed=${seedC}`
  ];
}

function renderGeneratedImage(imageUrl, prompt, { isObjectUrl = false, timeoutMs = IMAGE_LOAD_TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    if (lastImageObjectUrl && lastImageObjectUrl.startsWith("blob:")) {
      URL.revokeObjectURL(lastImageObjectUrl);
    }
    lastImageObjectUrl = isObjectUrl ? imageUrl : "";

    const image = document.createElement("img");
    image.alt = t("image_alt");
    image.classList.add("generated-image");
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    let settled = false;
    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      if (isObjectUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
        if (lastImageObjectUrl === imageUrl) lastImageObjectUrl = "";
      }
      reject(new Error("Image load timeout"));
    }, Math.max(2000, Number(timeoutMs) || IMAGE_LOAD_TIMEOUT_MS));

    image.onload = () => {
      if (settled) return;
      settled = true;
      cleanup();
      imageOutputEl.innerHTML = "";
      image.addEventListener("click", () => openImageModal(imageUrl, prompt));
      imageOutputEl.appendChild(image);
      resolve();
    };
    image.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      if (isObjectUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
        if (lastImageObjectUrl === imageUrl) lastImageObjectUrl = "";
      }
      reject(new Error("Image failed to load"));
    };
    image.src = imageUrl;
  });
}

async function tryPollinationsFallback(prompt, ratio = "1:1") {
  const urls = buildPollinationsFallbackUrls(prompt, ratio);
  const startedAt = Date.now();
  for (const url of urls) {
    if (Date.now() - startedAt > POLLINATIONS_FALLBACK_TIMEOUT_MS) {
      break;
    }
    try {
      await renderGeneratedImage(url, prompt, { timeoutMs: 9000 });
      return true;
    } catch (err) {
      // Try the next fallback URL.
    }
  }
  return false;
}

async function requestAirforceImage(payload) {
  const requestBody = {
    model: payload?.model || AIRFORCE_IMAGE_MODEL,
    prompt: payload?.prompt || "",
    aspectRatio: payload?.aspectRatio || "1:1"
  };
  return fetchWithTimeout(
    "/api/airforce-image",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    },
    REQUEST_TIMEOUT_MS + 15000
  );
}

async function requestPollinationsImage(payload) {
  return fetchWithTimeout(
    "/api/pollinations-image",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: payload?.prompt || "",
        aspectRatio: payload?.aspectRatio || "1:1"
      })
    },
    REQUEST_TIMEOUT_MS + 20000
  );
}

async function tryPollinationsProxyFallback(prompt, ratio = "1:1") {
  try {
    const response = await requestPollinationsImage({ prompt, aspectRatio: ratio });
    if (!response.ok) return false;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return false;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    await renderGeneratedImage(objectUrl, prompt, { isObjectUrl: true, timeoutMs: 9000 });
    return true;
  } catch {
    return false;
  }
}

async function generateImage() {
  if (imageGenerationInFlight) return;
  const now = Date.now();
  if (imageRetryAt > now) {
    const sec = Math.max(1, Math.ceil((imageRetryAt - now) / 1000));
    const msg = t("image_cooldown", { sec });
    setImageStatusText(msg, false);
    setStatus(msg, "warn");
    return;
  }

  const prompt = imagePromptInput.value.trim();
  if (!prompt) {
    setStatus(t("image_prompt_needed"), "warn");
    return;
  }

  imageGenerationInFlight = true;
  if (generateImageBtn) generateImageBtn.disabled = true;
  setImageStatusText(t("image_sending"), true);
  setStatus(t("image_sending"));

  try {
    const ratio = imageRatioSelect.value || "1:1";
    let response = await requestAirforceImage({
      prompt,
      aspectRatio: ratio,
      model: AIRFORCE_IMAGE_MODEL
    });

    // If proxy route is missing on host (404), fallback to direct free image URL.
    if (response.status === 404) {
      const ok = (await tryPollinationsProxyFallback(prompt, ratio)) || (await tryPollinationsFallback(prompt, ratio));
      if (ok) {
        setImageStatusText(t("image_done"), false);
        setStatus(t("status_ready"), "ok");
        return;
      }
      setImageStatusText(t("image_limit"), false);
      setStatus(t("image_error_status"), "error");
      return;
    }

    if (!response.ok) {
      const rawError = (await response.text()).trim();
      const missingKey =
        response.status === 401 ||
        response.status === 403 ||
        /Missing AIRFORCE_API_KEY|invalid api key|unauthorized|forbidden/i.test(rawError);
      const isLimit = response.status === 402 || response.status === 429;
      const retryAfterHeader = Number.parseInt(response.headers.get("retry-after") || "0", 10);
      const secFromHeader = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0 ? retryAfterHeader : 20;
      if (response.status === 429 || response.status === 503) {
        imageRetryAt = Date.now() + secFromHeader * 1000;
      }
      const normalizedError = rawError.toLowerCase();
      const isTemporaryServiceError =
        response.status >= 500 ||
        normalizedError.includes("internal server error") ||
        normalizedError.includes("fetch failed") ||
        normalizedError.includes("upstream") ||
        normalizedError.includes("rate limited");
      const errorMessage = missingKey
        ? t("image_need_key")
        : isLimit
          ? t("image_limit")
          : isTemporaryServiceError
            ? t("image_limit")
          : t("image_error", { message: rawError || `HTTP ${response.status}` });
      if (isLimit || isTemporaryServiceError) {
        const ok = (await tryPollinationsProxyFallback(prompt, ratio)) || (await tryPollinationsFallback(prompt, ratio));
        if (ok) {
          setImageStatusText(t("image_done"), false);
          setStatus(t("status_ready"), "ok");
          return;
        }
      }
      setImageStatusText(errorMessage, false);
      setStatus(t("image_error_status"), "error");
      return;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      const rawError = (await response.text()).trim();
      if (rawError.toLowerCase().includes("not found")) {
        const ok = (await tryPollinationsProxyFallback(prompt, ratio)) || (await tryPollinationsFallback(prompt, ratio));
        if (ok) {
          setImageStatusText(t("image_done"), false);
          setStatus(t("status_ready"), "ok");
          return;
        }
      }
      setImageStatusText(t("image_error", { message: rawError || "Invalid image response" }), false);
      setStatus(t("image_error_status"), "error");
      return;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    await renderGeneratedImage(objectUrl, prompt, { isObjectUrl: true });
    setImageStatusText(t("image_done"), false);
    setStatus(t("status_ready"), "ok");
  } catch (err) {
    // Network/CORS failures fallback to direct free image URL.
    const ratio = imageRatioSelect.value || "1:1";
    const ok = (await tryPollinationsProxyFallback(prompt, ratio)) || (await tryPollinationsFallback(prompt, ratio));
    if (ok) {
      setImageStatusText(t("image_done"), false);
      setStatus(t("status_ready"), "ok");
    } else {
      setImageStatusText(t("image_limit"), false);
      setStatus(t("image_error_status"), "error");
    }
  } finally {
    imageGenerationInFlight = false;
    if (generateImageBtn) generateImageBtn.disabled = false;
  }
}

function openImageModal(url, prompt) {
  imageModalImg.src = url;
  imageModalCaption.textContent = prompt;
  imageDownload.href = url;
  imageModal.classList.remove("hidden");
  imageModal.classList.add("open");
}

function closeImageModal() {
  imageModal.classList.remove("open");
  imageModal.classList.add("hidden");
}

function startGoogleInit() {
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "PASTE_GOOGLE_CLIENT_ID_HERE") return;
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.onload = initGoogle;
  document.head.appendChild(script);
}

function initGoogle() {
  if (!window.google) return;
  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential
    });
    google.accounts.id.renderButton(signinEl, { theme: "outline", size: "large" });
  } catch (err) {
    setStatus(t("google_error"), "error");
  }
}

function handleGoogleCredential(response) {
  try {
    const payload = parseJwt(response.credential);
    setUser(payload);
  } catch (err) {
    setStatus(t("google_error"), "error");
  }
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function setUser(payload) {
  const name = payload?.name || payload?.given_name || t("user_fallback");
  userNameEl.textContent = name;
  userPill.classList.remove("hidden");
  userPill.classList.add("visible");
  signinEl.style.display = "none";
  updateAccountAvatar(name);
  closeAccountMenu();
  localStorage.setItem("fley_user", JSON.stringify({ name }));
  if (!getRememberedUserName()) {
    const normalizedName = normalizeRememberedName(name);
    if (normalizedName) {
      userMemory.name = normalizedName;
      saveUserMemory();
    }
  }
}

function clearUser() {
  userPill.classList.add("hidden");
  userPill.classList.remove("visible");
  signinEl.style.display = "block";
  updateAccountAvatar("");
  closeAccountMenu();
  localStorage.removeItem("fley_user");
}

function loadUser() {
  const saved = localStorage.getItem("fley_user");
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data?.name) {
      userNameEl.textContent = data.name;
      userPill.classList.remove("hidden");
      userPill.classList.add("visible");
      signinEl.style.display = "none";
      updateAccountAvatar(data.name);
      if (!getRememberedUserName()) {
        const normalizedName = normalizeRememberedName(data.name);
        if (normalizedName) {
          userMemory.name = normalizedName;
          saveUserMemory();
        }
      }
    } else {
      updateAccountAvatar("");
    }
  } catch (err) {
    console.warn("Invalid user data", err);
    updateAccountAvatar("");
  }
}
