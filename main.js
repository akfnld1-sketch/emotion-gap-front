// main.js

// ------------------------------
// 1. 지원 언어 / 국가 설정 (8개국)
// ------------------------------
const SUPPORTED_LANGUAGES = [
  { code: "ko", country: "Korea", label: "한국 · Korean" },
  { code: "en", country: "USA", label: "United States · English" },
  { code: "ja", country: "Japan", label: "日本 · Japanese" },
  { code: "vi", country: "Vietnam", label: "Việt Nam · Tiếng Việt" },
  { code: "id", country: "Indonesia", label: "Indonesia · Bahasa Indonesia" },
  { code: "pt", country: "Brazil", label: "Brasil · Português" },
  { code: "es", country: "Mexico", label: "México · Español" },
  { code: "de", country: "Germany", label: "Deutschland · Deutsch" },
];

let currentLanguage = "ko";

// 프롬프트에서 쓸 “한국어식” 언어 이름 (상태문구 등에 사용)
const LANGUAGE_LABEL_FOR_PROMPT = {
  ko: "한국어",
  en: "영어",
  ja: "일본어",
  vi: "베트남어",
  id: "인도네시아어",
  pt: "포르투갈어",
  es: "스페인어",
  de: "독일어",
};

// GPT에 보내는 “영어식” 언어 이름 (가사/제목 언어 지정용)
const LYRICS_LANGUAGE_FOR_GPT = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  vi: "Vietnamese",
  id: "Indonesian",
  pt: "Portuguese",
  es: "Spanish",
  de: "German",
};

// ------------------------------
// 2. UI 텍스트 (일부만 수정, 나머지 언어는 기존 그대로)
// ------------------------------
const UI_TEXT = {
  ko: {
    logoTitle: "Emotion Gap · 감정의 틈",
    logoSub: "감정 한 줄로 제목 · 가사 · 프롬프트 자동 생성 (8개국 언어)",
    pillStatus: "LIVE · BETA",
    tabPage1: "페이지 1 (단일곡)",
    tabPage2: "페이지 2 (시리즈용 단일곡)",
    langLabel: "언어 / Language (가사·프롬프트 언어)",

    statusInit:
      "1페이지: 감정 → 제목 10개 → 가사/프롬프트 · 2페이지: 시리즈용 제목 10개 → 1곡 가사/프롬프트. 선택한 언어로 모두 생성됩니다.",
    statusPage1:
      "1페이지: 감정 → 제목 10개 → 선택한 제목으로 가사·프롬프트 생성 (선택한 언어로 출력).",
    statusPage2:
      "2페이지: 시리즈/테마 기준으로 제목 10개 → 선택한 제목으로 1곡 가사·프롬프트 생성.",
    statusLangChange: "언어가 변경되었습니다. 이제 결과가 선택한 언어로 생성됩니다.",
    statusTitlesGenerating: "제목 10개를 생성 중입니다...",
    statusTitlesDone:
      "제목 10개 생성 완료 · 원하는 제목을 클릭하면 가사와 프롬프트가 생성됩니다.",
    statusTitlesError: "제목 생성 중 오류가 발생했습니다.",
    statusSingleGenerating: "가사와 프롬프트를 생성 중입니다... (단일곡)",
    statusSingleDone: "단일곡 가사·프롬프트 생성 완료 (선택한 언어로 출력됨).",
    statusSingleError: "단일곡 생성 중 오류가 발생했습니다.",
    statusPlaylistGenerating:
      "1시간 세트(20곡) 가사·프롬프트를 생성 중입니다...",
    statusPlaylistDone:
      "1시간 세트(20곡) 가사·프롬프트 생성 완료 (선택한 언어로 출력됨).",
    statusPlaylistError: "1시간 세트 생성 중 오류가 발생했습니다.",
    statusResetPage1:
      "1페이지가 초기화되었습니다. 감정/상황을 입력하고 다시 제목을 받아보세요.",
    statusResetPage2:
      "2페이지가 초기화되었습니다. 감정/상황을 입력하고 다시 제목을 받아보세요.",

    page1PanelTitle: "1페이지 · 감정 입력 & 제목 추천",
    labelEmotion1: "감정/상황 한 줄 입력",
    placeholderEmotion1: "예: 겨울밤 강가에서 마지막 인사를 하던 장면...",
    labelStyle1: "장르 / 스타일 선택",
    labelTheme1: "시리즈 / 테마 선택",
    labelLength1: "곡 길이 선택",
    labelTitleList: "추천 제목 10개",
    btnTitlesReset: "리셋",
    btnTitlesGenerate: "제목 추천받기",
    labelSelectedTitle: "선택한 제목",

    optThemeAuto: "자동 (문장 기반)",
    optThemeLove: "사랑",
    optThemeBreakup: "이별",
    optThemeWinter: "겨울",
    optThemeWorkout: "헬스/운동",
    optThemeWork: "일하면서",
    optThemeStudy: "공부",
    optThemeSleep: "취침/수면",
    optThemeChristmas: "크리스마스",
    optThemeSeollal: "설날",
    optThemeRain: "비/장마",
    optThemeNightdrive: "야간 드라이브",
    optThemeCafe: "카페",
    optThemeTravel: "여행",
    optThemeLoneliness: "외로움",
    optThemeHope: "희망/재도전",
    optThemeNostalgia: "추억/회상",

    optLength2: "약 2분",
    optLength3: "약 3분",
    optLength4: "약 4분",

    page1ResultTitle: "1페이지 · 가사 & 프롬프트 결과",
    labelLyrics1: "가사 (자동 생성)",
    placeholderLyrics1:
      "제목을 선택하면 이곳에 Verse/Chorus 구조로 가사가 생성됩니다.",
    labelLongPrompt1: "긴 프롬프트 (유튜브 인기 스타일 기반)",
    placeholderLong1:
      "제목 & 가사 & 테마를 기반으로, 유튜브 음악 채널 상위 스타일을 참고한 긴 프롬프트가 생성됩니다.",
    labelShortPrompt1: "짧은 프롬프트 (Suno 전용, 압축형)",
    placeholderShort1:
      "위 긴 프롬프트를 압축한 Suno용 짧은 프롬프트가 생성됩니다. (~2/3/4분 정보 포함)",

    page2PanelTitle: "2페이지 · 감정 & 조건 입력 (시리즈용 단일곡)",
    page2Subtitle:
      "같은 시리즈/테마(사랑, 겨울, 헬스 등)에 맞는 제목 10개를 생성하고, 선택한 제목으로 1곡 가사·프롬프트를 만듭니다.",
    labelEmotion2: "감정/상황 한 줄로 적기",
    placeholderEmotion2:
      "예: 사랑, 겨울 연인 이야기, 헬스장에서 재도전하는 마음...",
    labelStyle2: "장르 / 스타일 선택",
    labelTheme2: "시리즈 / 테마 선택",
    labelLength2: "곡 길이 선택 (곡당)",
    btnPlaylistGenerate: "1시간 세트 생성 (20곡)", // 현재는 사용 안함
    btnPlaylistReset: "리셋",
    page2Note:
      "같은 조건으로 여러 제목을 뽑아서 시리즈용으로 사용할 수 있습니다.",

    page2ResultTitle: "2페이지 · 여러 곡 가사 & 프롬프트 결과 (1시간 세트)",
    labelLyrics2: "가사 (시리즈용 단일곡)",
    placeholderLyrics2:
      "선택한 제목에 맞춘 Verse1 → Pre-Chorus1 → Chorus1 → Verse2 → Pre-Chorus2 → Chorus2 → Bridge → Chorus3 구조의 가사가 생성됩니다.",
    labelLongPrompt2: "긴 프롬프트 (1곡용)",
    placeholderLong2:
      "시리즈용 테마에 맞춰, 이 곡 한 곡을 Suno/유튜브에서 쓸 수 있는 상세 프롬프트로 생성합니다.",
    labelShortPrompt2: "짧은 프롬프트 (Suno용, 1곡)",
    placeholderShort2:
      "위 긴 프롬프트를 압축한 Suno용 짧은 프롬프트입니다. (~2/3/4분 정보 포함)",
  },

  // 나머지 언어(en/ja/vi/id/pt/es/de)는 현우님이 쓰던 기존 내용 그대로 두시면 됩니다.
  en: {
    logoTitle: "Emotion Gap · AI Music Lab",
    logoSub:
      "One line of emotion → auto title, lyrics & prompt (8 languages supported)",
    pillStatus: "LIVE · BETA",
    tabPage1: "Page 1 (Single Track)",
    tabPage2: "Page 2 (Series · Single Track)",
    langLabel: "Language (lyrics & prompt output)",
    statusInit:
      "Page 1: Emotion → 10 titles → lyrics & prompts · Page 2: Series-based 10 titles → single track lyrics & prompts. All generated in the selected language.",
    statusPage1:
      "Page 1: Emotion → 10 titles → generate lyrics & prompts from the selected title.",
    statusPage2:
      "Page 2: Series/theme based 10 titles → generate one track from the selected title.",
    statusLangChange:
      "Language changed. New results will be generated in the selected language.",
    statusTitlesGenerating: "Generating 10 title ideas...",
    statusTitlesDone:
      "10 titles generated. Click a title to create lyrics and prompts.",
    statusTitlesError: "Error while generating titles.",
    statusSingleGenerating:
      "Generating lyrics and prompts for the selected title...",
    statusSingleDone:
      "Single track lyrics & prompts generated (in the selected language).",
    statusSingleError: "Error while generating single track.",
    statusPlaylistGenerating:
      "Generating 20-track (1-hour) playlist lyrics & prompts...",
    statusPlaylistDone:
      "1-hour playlist (20 tracks) generated (in the selected language).",
    statusPlaylistError: "Error while generating playlist.",
    statusResetPage1:
      "Page 1 has been reset. Enter emotion/situation and generate titles again.",
    statusResetPage2:
      "Page 2 has been reset. Enter emotion/situation and generate titles again.",
    page1PanelTitle: "Page 1 · Emotion Input & Title Suggestions",
    labelEmotion1: "Emotion / situation (one line)",
    placeholderEmotion1:
      "e.g. Saying goodbye by the river on a cold winter night...",
    labelStyle1: "Genre / style",
    labelTheme1: "Series / theme",
    labelLength1: "Track length",
    labelTitleList: "10 suggested titles",
    btnTitlesReset: "Reset",
    btnTitlesGenerate: "Generate titles",
    labelSelectedTitle: "Selected title",
    optThemeAuto: "Auto (based on description)",
    optThemeLove: "Love",
    optThemeBreakup: "Breakup",
    optThemeWinter: "Winter",
    optThemeWorkout: "Workout",
    optThemeWork: "While working",
    optThemeStudy: "Study",
    optThemeSleep: "Sleep / night",
    optThemeChristmas: "Christmas",
    optThemeSeollal: "Lunar New Year",
    optThemeRain: "Rainy day / monsoon",
    optThemeNightdrive: "Night drive",
    optThemeCafe: "Cafe",
    optThemeTravel: "Travel",
    optThemeLoneliness: "Loneliness",
    optThemeHope: "Hope / restart",
    optThemeNostalgia: "Nostalgia / memories",
    optLength2: "About 2 minutes",
    optLength3: "About 3 minutes",
    optLength4: "About 4 minutes",
    page1ResultTitle: "Page 1 · Lyrics & Prompt Result",
    labelLyrics1: "Lyrics (auto generated)",
    placeholderLyrics1:
      "When you choose a title, structured lyrics (Verse / Chorus) will appear here.",
    labelLongPrompt1: "Long prompt (based on top YouTube music style)",
    placeholderLong1:
      "A detailed long-form Suno prompt will be generated here using title, lyrics and theme.",
    labelShortPrompt1: "Short prompt (compressed Suno prompt)",
    placeholderShort1:
      "A short Suno prompt (~2/3/4 min info included) compressed from the long prompt.",
    page2PanelTitle: "Page 2 · Emotion & Conditions (Series single track)",
    page2Subtitle:
      "Generate 10 series-ready titles (e.g. love, winter, workout) and then create one track from the selected title.",
    labelEmotion2: "Emotion / situation (one line)",
    placeholderEmotion2:
      "e.g. love, a winter couple story, the feeling of restarting at the gym...",
    labelStyle2: "Genre / style",
    labelTheme2: "Series / theme",
    labelLength2: "Track length (per track)",
    btnPlaylistGenerate: "Generate 1-hour set (20 tracks)",
    btnPlaylistReset: "Reset",
    page2Note:
      "You can reuse titles under the same series/theme for multiple releases.",
    page2ResultTitle: "Page 2 · Series Single Track",
    labelLyrics2: "Lyrics (series single track)",
    placeholderLyrics2:
      "Lyrics for one track in the structure: Verse 1 → Pre-Chorus 1 → Chorus 1 → Verse 2 → Pre-Chorus 2 → Chorus 2 → Bridge → Chorus 3.",
    labelLongPrompt2: "Long prompt (single track)",
    placeholderLong2:
      "Detailed prompt for this one track, suitable for Suno / YouTube music.",
    labelShortPrompt2: "Short prompt (Suno, single track)",
    placeholderShort2:
      "Short Suno prompt (~2/3/4 min) compressed from the long prompt.",
  },

  // 나머지 언어는 생략 (실제 파일에서는 기존 코드 그대로 유지)
  ja: { /* ... 기존 내용 ... */ },
  vi: { /* ... 기존 내용 ... */ },
  id: { /* ... 기존 내용 ... */ },
  pt: { /* ... 기존 내용 ... */ },
  es: { /* ... 기존 내용 ... */ },
  de: { /* ... 기존 내용 ... */ },
};

// ------------------------------
// 3. 상태 텍스트 헬퍼
// ------------------------------
function setStatusText(raw) {
  const el = document.getElementById("statusText");
  if (!el) return;
  el.textContent = raw;
}

function setStatusKey(key) {
  const dict = UI_TEXT[currentLanguage] || UI_TEXT.ko;
  const msg = dict[key] || UI_TEXT.ko[key] || "";
  setStatusText(msg);
}

// ------------------------------
// 4. UI 언어 적용
// ------------------------------
function applyUILanguage(lang) {
  const dict = UI_TEXT[lang] || UI_TEXT.ko;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    if (dict[key]) {
      el.textContent = dict[key];
    } else if (UI_TEXT.ko[key]) {
      el.textContent = UI_TEXT.ko[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    if (dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    } else if (UI_TEXT.ko[key]) {
      el.setAttribute("placeholder", UI_TEXT.ko[key]);
    }
  });

  const activeSection = document.querySelector(".generator.active");
  if (activeSection?.getAttribute("data-page") === "page2") {
    setStatusKey("statusPage2");
  } else {
    setStatusKey("statusPage1");
  }
}

// ------------------------------
// 5. 언어 셀렉트 초기화
// ------------------------------
const API_URL = "http://localhost:3000/generate";

function initLanguageSelect() {
  const select = document.getElementById("languageSelect");
  if (!select) return;

  select.innerHTML = "";
  SUPPORTED_LANGUAGES.forEach((lang) => {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = lang.label;
    select.appendChild(opt);
  });

  const browserLang = (navigator.language || "").toLowerCase();
  if (browserLang.startsWith("ja")) currentLanguage = "ja";
  else if (browserLang.startsWith("en")) currentLanguage = "en";
  else if (browserLang.startsWith("vi")) currentLanguage = "vi";
  else if (browserLang.startsWith("id")) currentLanguage = "id";
  else if (browserLang.startsWith("pt")) currentLanguage = "pt";
  else if (browserLang.startsWith("es")) currentLanguage = "es";
  else if (browserLang.startsWith("de")) currentLanguage = "de";
  else currentLanguage = "ko";

  select.value = currentLanguage;
  applyUILanguage(currentLanguage);

  select.addEventListener("change", () => {
    currentLanguage = select.value;
    applyUILanguage(currentLanguage);
    setStatusKey("statusLangChange");
  });
}

// ------------------------------
// 6. 탭(페이지1/2) 전환
// ------------------------------
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const pages = document.querySelectorAll(".generator");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (!target) return;

      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      pages.forEach((section) => {
        if (section.getAttribute("data-page") === target) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });

      if (target === "page1") {
        setStatusKey("statusPage1");
      } else {
        setStatusKey("statusPage2");
      }
    });
  });
}

// ------------------------------
// 7. 공통: 페이지별 엘리먼트 묶기
// ------------------------------
function getPageElements(pageId) {
  const section = document.querySelector(`.generator[data-page="${pageId}"]`);
  if (!section) return null;

  return {
    section,
    emotionInput: section.querySelector(".user-text"),
    styleSelect: section.querySelector(".style-select"),
    themeSelect: section.querySelector(".theme-select"),
    lengthSelect: section.querySelector(".length-select"),
    titlesGenerateBtn: section.querySelector(".titles-generate-btn"),
    titlesResetBtn: section.querySelector(".titles-reset-btn"),
    titlesList: section.querySelector(".titles-list"),
    selectedTitleInput: section.querySelector(".selected-title"),
    lyricsOutput: section.querySelector(".lyrics-output"),
    longPromptOutput: section.querySelector(".long-prompt-output"),
    shortPromptOutput: section.querySelector(".short-prompt-output"),
  };
}

// ------------------------------
// 8. 서버 호출 헬퍼
// ------------------------------
async function callGenerateAPI(payload) {
  const langLabel = LANGUAGE_LABEL_FOR_PROMPT[currentLanguage] || "한국어";
  const lyricsLanguage =
    LYRICS_LANGUAGE_FOR_GPT[currentLanguage] || "Korean";

  const body = {
    ...payload,
    languageCode: currentLanguage,
    languageLabel: langLabel,
    lyricsLanguage,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("API error");
  }
  return await res.json();
}

// ------------------------------
// 9. 페이지 공통: 제목 10개 생성
// ------------------------------
async function handleGenerateTitlesForPage(pageId) {
  const page = getPageElements(pageId);
  if (!page) return;

  const {
    emotionInput,
    styleSelect,
    themeSelect,
    lengthSelect,
    titlesGenerateBtn,
    titlesList,
    selectedTitleInput,
    lyricsOutput,
    longPromptOutput,
    shortPromptOutput,
  } = page;

  const emotion = emotionInput?.value.trim() || "";
  const styleKey = styleSelect?.value || "";
  const themeKey = themeSelect?.value || "auto";
  const length = lengthSelect?.value || "3";

  if (!emotion) {
    alert("감정/상황 한 줄을 입력해주세요.");
    return;
  }

  try {
    if (titlesGenerateBtn) titlesGenerateBtn.disabled = true;
    setStatusKey("statusTitlesGenerating");

    const data = await callGenerateAPI({
      mode: "titles",
      emotion,
      styleKey,
      themeKey,
      length,
    });

    const titles = data.titles || data.titleList || [];
    titlesList.innerHTML = "";
    if (selectedTitleInput) selectedTitleInput.value = "";
    if (lyricsOutput) lyricsOutput.value = "";
    if (longPromptOutput) longPromptOutput.value = "";
    if (shortPromptOutput) shortPromptOutput.value = "";

    if (!titles.length) {
      titlesList.textContent =
        "제목을 가져오지 못했습니다. 서버 응답 형식을 확인해 주세요.";
      setStatusKey("statusTitlesError");
      return;
    }

    titles.forEach((title) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "title-item-btn";
      btn.textContent = title;
      btn.addEventListener("click", () => {
        const allBtns = titlesList.querySelectorAll(".title-item-btn");
        allBtns.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");

        if (selectedTitleInput) selectedTitleInput.value = title;
        handleGenerateSingleSongForPage(pageId, title);
      });
      titlesList.appendChild(btn);
    });

    setStatusKey("statusTitlesDone");
  } catch (err) {
    console.error(err);
    setStatusKey("statusTitlesError");
    alert("제목 생성 중 오류가 발생했습니다. 콘솔을 확인해 주세요.");
  } finally {
    if (titlesGenerateBtn) titlesGenerateBtn.disabled = false;
  }
}

// ------------------------------
// 10. 페이지 공통: 선택한 제목으로 단일곡 생성
// ------------------------------
async function handleGenerateSingleSongForPage(pageId, selectedTitle) {
  const page = getPageElements(pageId);
  if (!page) return;

  const {
    emotionInput,
    styleSelect,
    themeSelect,
    lengthSelect,
    selectedTitleInput,
    lyricsOutput,
    longPromptOutput,
    shortPromptOutput,
  } = page;

  const emotion = emotionInput?.value.trim() || "";
  const styleKey = styleSelect?.value || "";
  const themeKey = themeSelect?.value || "auto";
  const length = lengthSelect?.value || "3";
  const title = selectedTitle || selectedTitleInput?.value.trim() || "";

  if (!title) {
    alert("먼저 제목을 선택해 주세요.");
    return;
  }

  try {
    setStatusKey("statusSingleGenerating");

    const data = await callGenerateAPI({
      mode: "single",
      emotion,
      styleKey,
      themeKey,
      length,
      title,
    });

    const lyrics = data.lyrics || data.lyricsText || "";
    const longPrompt = data.longPrompt || data.detailPrompt || "";
    const shortPrompt = data.shortPrompt || data.sunoPrompt || "";

    if (lyricsOutput) lyricsOutput.value = lyrics;
    if (longPromptOutput) longPromptOutput.value = longPrompt;
    if (shortPromptOutput) shortPromptOutput.value = shortPrompt;

    setStatusKey("statusSingleDone");
  } catch (err) {
    console.error(err);
    setStatusKey("statusSingleError");
    alert("단일곡 생성 중 오류가 발생했습니다. 콘솔을 확인해 주세요.");
  }
}

// ------------------------------
// 11. 페이지1 리셋
// ------------------------------
function handleResetPage1() {
  const page = getPageElements("page1");
  if (!page) return;

  const {
    emotionInput,
    titlesList,
    selectedTitleInput,
    lyricsOutput,
    longPromptOutput,
    shortPromptOutput,
  } = page;

  if (emotionInput) emotionInput.value = "";
  if (titlesList) titlesList.innerHTML = "";
  if (selectedTitleInput) selectedTitleInput.value = "";
  if (lyricsOutput) lyricsOutput.value = "";
  if (longPromptOutput) longPromptOutput.value = "";
  if (shortPromptOutput) shortPromptOutput.value = "";

  setStatusKey("statusResetPage1");
}

// ------------------------------
// 12. 페이지2 리셋
// ------------------------------
function handleResetPage2() {
  const page = getPageElements("page2");
  if (!page) return;

  const {
    emotionInput,
    titlesList,
    selectedTitleInput,
    lyricsOutput,
    longPromptOutput,
    shortPromptOutput,
  } = page;

  if (emotionInput) emotionInput.value = "";
  if (titlesList) titlesList.innerHTML = "";
  if (selectedTitleInput) selectedTitleInput.value = "";
  if (lyricsOutput) lyricsOutput.value = "";
  if (longPromptOutput) longPromptOutput.value = "";
  if (shortPromptOutput) shortPromptOutput.value = "";

  setStatusKey("statusResetPage2");
}

// ------------------------------
// 13. 복사 버튼 초기화
// ------------------------------
function initCopyButtons() {
  const buttons = document.querySelectorAll(".copy-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      if (!targetId) return;
      const el = document.getElementById(targetId);
      if (!el) return;

      const value = el.value ?? el.textContent ?? "";
      if (!value.trim()) {
        alert("복사할 내용이 없습니다.");
        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = "복사됨";
        setTimeout(() => {
          btn.textContent = original;
        }, 1200);
      } catch (err) {
        console.error(err);
        alert("클립보드 복사 중 오류가 발생했습니다.");
      }
    });
  });
}

// ------------------------------
// 14. 초기화
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initLanguageSelect();
  initTabs();

  const page1 = getPageElements("page1");
  if (page1) {
    if (page1.titlesGenerateBtn) {
      page1.titlesGenerateBtn.addEventListener(() =>
        handleGenerateTitlesForPage("page1")
      );
    }
    if (page1.titlesResetBtn) {
      page1.titlesResetBtn.addEventListener("click", handleResetPage1);
    }
  }

  const page2 = getPageElements("page2");
  if (page2) {
    if (page2.titlesGenerateBtn) {
      page2.titlesGenerateBtn.addEventListener(() =>
        handleGenerateTitlesForPage("page2")
      );
    }
    if (page2.titlesResetBtn) {
      page2.titlesResetBtn.addEventListener("click", handleResetPage2);
    }
  }

  initCopyButtons();
  setStatusKey("statusInit");
});
