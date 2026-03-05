(function siteLocaleInit() {
  const select = document.getElementById("countrySelect");
  if (!select) return;

  const countries = [
    { code: "KR", label: "대한민국 (한국어)", locale: "ko-KR", translateLang: "ko" },
    { code: "US", label: "United States (English)", locale: "en-US", translateLang: "en" },
    { code: "GB", label: "United Kingdom (English)", locale: "en-GB", translateLang: "en" },
    { code: "CA", label: "Canada (English)", locale: "en-CA", translateLang: "en" },
    { code: "AU", label: "Australia (English)", locale: "en-AU", translateLang: "en" },
    { code: "IN", label: "India (Hindi/English)", locale: "hi-IN", translateLang: "hi" },
    { code: "JP", label: "Japan (Japanese)", locale: "ja-JP", translateLang: "ja" },
    { code: "CN", label: "China (Chinese)", locale: "zh-CN", translateLang: "zh-CN" },
    { code: "TW", label: "Taiwan (Chinese)", locale: "zh-TW", translateLang: "zh-TW" },
    { code: "FR", label: "France (French)", locale: "fr-FR", translateLang: "fr" },
    { code: "DE", label: "Germany (German)", locale: "de-DE", translateLang: "de" },
    { code: "ES", label: "Spain (Spanish)", locale: "es-ES", translateLang: "es" },
    { code: "MX", label: "Mexico (Spanish)", locale: "es-MX", translateLang: "es" },
    { code: "BR", label: "Brazil (Portuguese)", locale: "pt-BR", translateLang: "pt" },
    { code: "PT", label: "Portugal (Portuguese)", locale: "pt-PT", translateLang: "pt" },
    { code: "IT", label: "Italy (Italian)", locale: "it-IT", translateLang: "it" },
    { code: "RU", label: "Russia (Russian)", locale: "ru-RU", translateLang: "ru" },
    { code: "SA", label: "Saudi Arabia (Arabic)", locale: "ar-SA", translateLang: "ar" },
    { code: "TR", label: "Turkey (Turkish)", locale: "tr-TR", translateLang: "tr" },
    { code: "ID", label: "Indonesia (Indonesian)", locale: "id-ID", translateLang: "id" },
    { code: "VN", label: "Vietnam (Vietnamese)", locale: "vi-VN", translateLang: "vi" },
    { code: "TH", label: "Thailand (Thai)", locale: "th-TH", translateLang: "th" }
  ];

  const gtSupported = "ar,de,en,es,fr,hi,id,it,ja,ko,pt,ru,th,tr,vi,zh-CN,zh-TW";
  let pendingTranslateLang = null;

  select.innerHTML = countries
    .map((item) => `<option value="${item.code}">${item.label}</option>`)
    .join("");

  function toSiteLang(countryCode) {
    return countryCode === "KR" ? "ko" : "en";
  }

  function setGoogTransCookie(targetLang) {
    const value = `/ko/${targetLang}`;
    const hostname = window.location.hostname;
    document.cookie = `googtrans=${value};path=/`;
    if (hostname && hostname !== "localhost") {
      document.cookie = `googtrans=${value};domain=.${hostname};path=/`;
    }
  }

  function tryApplyGoogleTranslate(targetLang) {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return false;
    if (combo.value === targetLang) return true;
    combo.value = targetLang;
    combo.dispatchEvent(new Event("change"));
    return true;
  }

  function applyGoogleTranslate(targetLang) {
    setGoogTransCookie(targetLang);
    pendingTranslateLang = targetLang;
    if (tryApplyGoogleTranslate(targetLang)) {
      pendingTranslateLang = null;
      return;
    }
    let retries = 0;
    const timer = setInterval(() => {
      retries += 1;
      if (tryApplyGoogleTranslate(targetLang) || retries > 40) {
        clearInterval(timer);
        pendingTranslateLang = null;
      }
    }, 150);
  }

  function ensureGoogleTranslate() {
    if (window.__gtScriptLoaded) return;
    window.__gtScriptLoaded = true;

    if (!document.getElementById("google_translate_element")) {
      const holder = document.createElement("div");
      holder.id = "google_translate_element";
      holder.style.display = "none";
      document.body.appendChild(holder);
    }

    window.googleTranslateElementInit = function googleTranslateElementInit() {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages: gtSupported,
          autoDisplay: false
        },
        "google_translate_element"
      );
      if (pendingTranslateLang) {
        applyGoogleTranslate(pendingTranslateLang);
      }
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }

  function applyStaticText(siteLang) {
    const localeLabel = document.querySelector(".locale-label");
    if (localeLabel) {
      localeLabel.textContent = siteLang === "ko" ? "🌐 국가/언어" : "🌐 Country/Language";
    }

    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");
    const heroMeta = document.getElementById("heroMeta");
    if (!heroTitle || !heroSubtitle || !heroMeta) return;

    if (siteLang === "ko") {
      heroTitle.textContent = "AI 카테고리별 추천 사이트 모음";
      heroSubtitle.innerHTML = '핵심 AI를 카테고리별로 비교 정리했고 <span class="highlight">중요 정보는 노란색</span>으로 표시했습니다.';
      heroMeta.textContent = "📌 기준일: 2026-03-05 (UTC) · 가격/정책은 수시 변경 가능";
      return;
    }

    heroTitle.textContent = "AI Tools by Category";
    heroSubtitle.innerHTML = 'Compare top AI tools in one place, and see <span class="highlight">important info highlighted in yellow</span>.';
    heroMeta.textContent = "📌 Updated: 2026-03-05 (UTC) · Pricing and policies may change";
  }

  function applyCountry(countryCode) {
    const selected = countries.find((item) => item.code === countryCode) || countries[0];
    const siteLang = toSiteLang(selected.code);
    window.__siteLocale = selected.locale;
    window.__siteLang = siteLang;
    document.documentElement.lang = siteLang;
    localStorage.setItem("siteCountry", selected.code);
    localStorage.setItem("siteLang", siteLang);
    localStorage.setItem("siteTranslateLang", selected.translateLang);
    window.dispatchEvent(new CustomEvent("site-language-change", {
      detail: { countryCode: selected.code, locale: selected.locale, lang: siteLang }
    }));
    applyStaticText(siteLang);
    applyGoogleTranslate(selected.translateLang);
  }

  const savedCountry = localStorage.getItem("siteCountry");
  const initialCountry = countries.some((item) => item.code === savedCountry) ? savedCountry : "KR";

  select.value = initialCountry;
  ensureGoogleTranslate();
  applyCountry(initialCountry);

  select.addEventListener("change", (event) => {
    applyCountry(event.target.value);
  });
})();
