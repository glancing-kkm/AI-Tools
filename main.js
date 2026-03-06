const cardsEl = document.getElementById("cards");
const chipsEl = document.getElementById("categoryChips");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const popularCombosEl = document.getElementById("popularCombos");
const recommendedCombosEl = document.getElementById("recommendedCombos");

const state = {
  tools: [],
  selectedCategory: "전체",
  searchText: "",
  sortBy: "default"
};

const uiText = {
  ko: {
    all: "전체",
    searchPlaceholder: "🔎 AI 이름/기능 검색",
    sortDefault: "기본 정렬",
    sortFreeFirst: "무료 우선",
    sortPriceAsc: "가격 낮은 순",
    sortPaidSubs: "유료구독자 많은 순",
    labelReason: "💡 이유",
    labelFeatures: "⚙️ 기능",
    labelPrice: "💰 가격",
    labelPaid: "👥 유료지표",
    labelFreeHow: "🆓 방법",
    labelFreeScope: "📦 범위",
    btnVisit: "🔗 사이트 이동",
    noResults: "검색 결과가 없습니다. 다른 키워드를 입력해 주세요.",
    note: "🟡 기준일 2026-03-05. 가격/무료 정책은 수시 변경되므로 결제 전 공식 링크에서 재확인하세요.",
    scoreUnknown: "데이터 없음",
    scoreVeryHigh: "매우 높음",
    scoreHigh: "높음",
    scoreMid: "중간",
    scoreLow: "낮음",
    popularTitle: "🔥 많이 쓰는 AI 조합",
    recommendedTitle: "🎯 추천 AI 조합",
    categoryTitle: "🗂️ 카테고리",
    toolsTitle: "✨ 추천 AI"
  },
  en: {
    all: "All",
    searchPlaceholder: "🔎 Search AI name/features",
    sortDefault: "Default",
    sortFreeFirst: "Free first",
    sortPriceAsc: "Lowest price",
    sortPaidSubs: "Most paid subscribers",
    labelReason: "💡 Why",
    labelFeatures: "⚙️ Features",
    labelPrice: "💰 Pricing",
    labelPaid: "👥 Paid signal",
    labelFreeHow: "🆓 How to use free",
    labelFreeScope: "📦 Free limits",
    btnVisit: "🔗 Visit site",
    noResults: "No results found. Try another keyword.",
    note: "🟡 Updated: 2026-03-05. Pricing/free limits may change; always verify on official pages.",
    scoreUnknown: "No data",
    scoreVeryHigh: "Very high",
    scoreHigh: "High",
    scoreMid: "Medium",
    scoreLow: "Low",
    popularTitle: "🔥 Most-used AI stacks",
    recommendedTitle: "🎯 Recommended AI stacks",
    categoryTitle: "🗂️ Categories",
    toolsTitle: "✨ Recommended AI"
  }
};

const categoryText = {
  "💬 대화형 AI": "💬 Conversational AI",
  "🔎 지식검색/사실검증": "🔎 Search/Fact-check",
  "🖼️ 이미지생성": "🖼️ Image Generation",
  "🎵 음악생성/사운드생성": "🎵 Music/Sound Generation",
  "🎙️ 음성/보컬": "🎙️ Voice/Vocal",
  "💻 코딩/개발": "💻 Coding/Development",
  "📊 데이터분석/자동화": "📊 Data/Automation",
  "🎬 비디오생성/편집": "🎬 Video Generation/Editing",
  "📝 문서작성/편집": "📝 Writing/Editing",
  "🧩 추가: 프레젠테이션/디자인": "🧩 Extra: Presentation/Design",
  "🗣️ 추가: 회의록/전사": "🗣️ Extra: Meeting Notes/Transcription"
};

const popularCombosEn = [
  { name: "ChatGPT + Perplexity + Notion AI", why: "Use one flow for drafting, fact-checking, and organizing docs." },
  { name: "Gemini + Perplexity + Claude", why: "Combine fast research, source checks, and long-form drafting." },
  { name: "GitHub Copilot + ChatGPT + Cursor", why: "Split code completion, debugging, and codebase Q&A." },
  { name: "Midjourney + Runway + ElevenLabs", why: "Connect image, video, and voice for faster content production." },
  { name: "Suno + Canva AI + Runway", why: "Produce music, thumbnails, and short videos quickly." }
];

const recommendedCombosEn = [
  { name: "Beginner: ChatGPT + Canva AI + Notion AI", why: "Easy combo for planning, design, and organized notes." },
  { name: "Student/Research: Gemini + Consensus + Notion AI", why: "Efficient for search, evidence checks, and note organization." },
  { name: "Solo marketer: Perplexity + Notion AI + Runway", why: "Covers research, content planning, and video production." },
  { name: "Developer: GitHub Copilot + Claude + Zapier", why: "Balanced setup for coding, docs, and automation." },
  { name: "Meeting-heavy team: Otter + Fireflies + Notion AI", why: "Strong setup for capture, summary, and action tracking." }
];

const paidSignals = {
  ChatGPT: { score: 100, label: "매우 높음" },
  Gemini: { score: 97, label: "매우 높음" },
  "Microsoft Copilot": { score: 95, label: "매우 높음" },
  "Meta AI": { score: 93, label: "매우 높음" },
  "GitHub Copilot": { score: 94, label: "매우 높음" },
  Grammarly: { score: 90, label: "매우 높음" },
  "Canva AI": { score: 89, label: "매우 높음" },
  "Notion AI": { score: 84, label: "높음" },
  Perplexity: { score: 80, label: "높음" },
  Claude: { score: 78, label: "높음" },
  Midjourney: { score: 76, label: "높음" },
  "DALL·E": { score: 75, label: "높음" },
  "Adobe Firefly": { score: 74, label: "높음" },
  Runway: { score: 72, label: "중간" },
  Synthesia: { score: 71, label: "중간" },
  "HeyGen": { score: 69, label: "중간" },
  Zapier: { score: 70, label: "중간" },
  Make: { score: 66, label: "중간" },
  "n8n": { score: 65, label: "중간" },
  "Power Automate": { score: 64, label: "중간" },
  ElevenLabs: { score: 63, label: "중간" },
  Murf: { score: 62, label: "중간" },
  LOVO: { score: 61, label: "중간" },
  Otter: { score: 60, label: "중간" },
  Fireflies: { score: 58, label: "중간" },
  "Leonardo AI": { score: 54, label: "중간" },
  Suno: { score: 52, label: "중간" },
  "Amazon Q Developer": { score: 51, label: "중간" },
  Tabnine: { score: 50, label: "중간" },
  Udio: { score: 47, label: "낮음" },
  "Kling AI": { score: 46, label: "낮음" },
  Pika: { score: 44, label: "낮음" },
  Windsurf: { score: 43, label: "낮음" },
  "PlayHT": { score: 41, label: "낮음" },
  "DreamStudio": { score: 40, label: "낮음" },
  Elicit: { score: 39, label: "낮음" },
  Consensus: { score: 38, label: "낮음" },
  "You.com": { score: 37, label: "낮음" },
  "Wolfram|Alpha": { score: 36, label: "낮음" },
  "Stable Audio": { score: 35, label: "낮음" },
  AIVA: { score: 35, label: "낮음" },
  Soundraw: { score: 34, label: "낮음" },
  Gamma: { score: 33, label: "낮음" },
  Cursor: { score: 32, label: "낮음" },
  Tome: { score: 31, label: "낮음" },
  "Beautiful.ai": { score: 30, label: "낮음" },
  "Figma AI": { score: 29, label: "낮음" },
  Fathom: { score: 28, label: "낮음" },
  "tl;dv": { score: 27, label: "낮음" },
  Avoma: { score: 26, label: "낮음" },
  Jasper: { score: 42, label: "낮음" },
  QuillBot: { score: 45, label: "낮음" },
  Writer: { score: 31, label: "낮음" },
  "Airtable AI": { score: 48, label: "낮음" },
  "Speechify Studio": { score: 49, label: "중간" }
};

const popularCombos = [
  { name: "ChatGPT + Perplexity + Notion AI", why: "초안 작성, 사실 검증, 문서 정리를 한 흐름으로 처리" },
  { name: "Gemini + Perplexity + Claude", why: "검색 보강, 근거 확인, 장문 정리를 빠르게 연결" },
  { name: "GitHub Copilot + ChatGPT + Cursor", why: "코딩 자동완성, 디버깅, 코드베이스 탐색을 분업" },
  { name: "Midjourney + Runway + ElevenLabs", why: "이미지/영상/보이스를 연결해 콘텐츠 제작 속도 향상" },
  { name: "Suno + Canva AI + Runway", why: "음원, 썸네일, 숏폼 영상을 빠르게 묶어 발행" }
];

const recommendedCombos = [
  { name: "입문자: ChatGPT + Canva AI + Notion AI", why: "기획, 디자인, 노트 정리까지 쉬운 조합으로 시작 가능" },
  { name: "학생/연구: Gemini + Consensus + Notion AI", why: "자료 탐색, 근거 확인, 노트 정리를 한 번에 처리" },
  { name: "1인 마케터: Perplexity + Notion AI + Runway", why: "리서치, 콘텐츠 캘린더, 영상 제작까지 한 번에 구성" },
  { name: "개발자: GitHub Copilot + Claude + Zapier", why: "코딩 생산성 + 문서화 + 운영 자동화가 균형적" },
  { name: "회의 많은 팀: Otter + Fireflies + Notion AI", why: "회의록 수집, 요약, 액션 아이템 정리에 효율적" }
];

function faviconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function getLang() {
  return window.__siteLang === "en" ? "en" : "ko";
}

function t(key) {
  return uiText[getLang()][key];
}

function scoreLabel(rawLabel) {
  if (getLang() === "ko") return rawLabel;
  if (rawLabel === "매우 높음") return t("scoreVeryHigh");
  if (rawLabel === "높음") return t("scoreHigh");
  if (rawLabel === "중간") return t("scoreMid");
  if (rawLabel === "낮음") return t("scoreLow");
  return t("scoreUnknown");
}

function categoryLabel(value) {
  if (value === "전체") return "전체";
  return value;
}

function categories() {
  return ["전체", ...new Set(state.tools.map((tool) => tool.category))];
}

function matchSearch(tool, keyword) {
  if (!keyword) return true;
  const haystack = [
    tool.name,
    tool.category,
    tool.reason,
    tool.features.join(" "),
    tool.freeScope
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(keyword.toLowerCase());
}

function sortTools(list) {
  const sorted = [...list];
  if (state.sortBy === "free-first") {
    sorted.sort((a, b) => {
      if (a.pricing.hasFree !== b.pricing.hasFree) {
        return Number(b.pricing.hasFree) - Number(a.pricing.hasFree);
      }
      return a.pricing.monthlyUsdFrom - b.pricing.monthlyUsdFrom;
    });
  } else if (state.sortBy === "price-asc") {
    sorted.sort((a, b) => a.pricing.monthlyUsdFrom - b.pricing.monthlyUsdFrom);
  } else if (state.sortBy === "paid-subs-desc") {
    sorted.sort((a, b) => {
      const aScore = (paidSignals[a.name] && paidSignals[a.name].score) || 0;
      const bScore = (paidSignals[b.name] && paidSignals[b.name].score) || 0;
      return bScore - aScore;
    });
  }
  return sorted;
}

function filteredTools() {
  const byCategory = state.selectedCategory === "전체"
    ? state.tools
    : state.tools.filter((tool) => tool.category === state.selectedCategory);
  const bySearch = byCategory.filter((tool) => matchSearch(tool, state.searchText));
  return sortTools(bySearch);
}

function renderChips() {
  chipsEl.innerHTML = categories()
    .map(
      (category) => `
      <button class="chip ${state.selectedCategory === category ? "active" : ""}" data-category="${category}">
        ${categoryLabel(category)}
      </button>
    `
    )
    .join("");

  chipsEl.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.selectedCategory = chip.dataset.category;
      render();
    });
  });
}

function oneLine(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function cardTemplate(tool) {
  const featureLine = oneLine(tool.features.join(" · "));
  const paidSignalRaw = (paidSignals[tool.name] && paidSignals[tool.name].label) || t("scoreUnknown");
  const paidSignal = scoreLabel(paidSignalRaw);
  const tagLabel = categoryLabel(tool.category);
  return `
    <article class="card">
      <div class="head">
        <img class="logo" src="${faviconUrl(tool.domain)}" alt="${tool.name} favicon" loading="lazy" />
        <div class="name-wrap">
          <h3 title="${tool.name}">${tool.name}</h3>
          <span class="tag" title="${tagLabel}">${tagLabel}</span>
        </div>
      </div>
      <p class="meta-row" title="${tool.reason}"><b>${t("labelReason")}</b> ${oneLine(tool.reason)}</p>
      <p class="meta-row" title="${featureLine}"><b>${t("labelFeatures")}</b> ${featureLine}</p>
      <p class="meta-row" title="${tool.pricing.display}"><b>${t("labelPrice")}</b> ${oneLine(tool.pricing.display)}</p>
      <p class="meta-row" title="${paidSignal}"><b>${t("labelPaid")}</b> ${paidSignal}</p>
      <p class="meta-row" title="${tool.freeHow}"><b>${t("labelFreeHow")}</b> ${oneLine(tool.freeHow)}</p>
      <p class="meta-row" title="${tool.freeScope}"><b>${t("labelFreeScope")}</b> ${oneLine(tool.freeScope)}</p>
      <div class="actions">
        <a class="btn" href="${tool.link}" target="_blank" rel="noopener noreferrer" title="${tool.link}">${t("btnVisit")}</a>
      </div>
    </article>
  `;
}

function comboTemplate(item) {
  return `
    <article class="combo-card">
      <p class="combo-name" title="${item.name}">${item.name}</p>
      <p class="combo-why" title="${item.why}">${item.why}</p>
    </article>
  `;
}

function renderCombos() {
  const popularList = getLang() === "ko" ? popularCombos : popularCombosEn;
  const recommendedList = getLang() === "ko" ? recommendedCombos : recommendedCombosEn;
  popularCombosEl.innerHTML = popularList.map(comboTemplate).join("");
  recommendedCombosEl.innerHTML = recommendedList.map(comboTemplate).join("");
}

function renderCards() {
  const list = filteredTools();
  if (list.length === 0) {
    cardsEl.innerHTML = `<p class="note">${t("noResults")}</p>`;
    return;
  }

  cardsEl.innerHTML = list.map(cardTemplate).join("");
  cardsEl.insertAdjacentHTML(
    "beforeend",
    `<p class="note">${t("note")}</p>`
  );
}

function applyUiText() {
  searchInput.placeholder = t("searchPlaceholder");
  sortSelect.querySelector('option[value="default"]').textContent = t("sortDefault");
  sortSelect.querySelector('option[value="free-first"]').textContent = t("sortFreeFirst");
  sortSelect.querySelector('option[value="price-asc"]').textContent = t("sortPriceAsc");
  sortSelect.querySelector('option[value="paid-subs-desc"]').textContent = t("sortPaidSubs");

  const categoryTitle = document.querySelector(".toolbar h2");
  const toolsTitle = document.querySelector(".content h2");
  const contentTitles = document.querySelectorAll(".content h2");
  if (categoryTitle) categoryTitle.textContent = t("categoryTitle");
  if (toolsTitle) toolsTitle.textContent = t("toolsTitle");
  if (contentTitles[1]) contentTitles[1].textContent = t("popularTitle");
  if (contentTitles[2]) contentTitles[2].textContent = t("recommendedTitle");
}

function bindControls() {
  searchInput.addEventListener("input", (event) => {
    state.searchText = event.target.value;
    renderCards();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    renderCards();
  });
}

function render() {
  applyUiText();
  renderChips();
  renderCards();
  renderCombos();
}

async function init() {
  try {
    const response = await fetch("/data/ai-tools.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    state.tools = await response.json();
    bindControls();
    render();
  } catch (error) {
    cardsEl.innerHTML = `<p class="note">데이터 로드 실패: ${error.message}</p>`;
  }
}

init();
