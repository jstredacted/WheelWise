const numberFormatter = new Intl.NumberFormat("en-US");
const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const MAP_COUNTRY_LOAD = {
  US: 100,
  DE: 78,
  GB: 71,
  IN: 68,
  BR: 62,
  SG: 59,
  JP: 57,
  FR: 52,
  CA: 49,
  SE: 36,
  AU: 34,
  KR: 32,
  NL: 30,
  CN: 27,
  MX: 24,
  ES: 22,
  IT: 20,
  PL: 18,
  ZA: 16,
  AR: 14,
  AE: 12,
};

const MAP_COUNTRY_COLORS = {
  US: "#2563eb",
  DE: "#facc15",
  GB: "#3b82f6",
  IN: "#f59e0b",
  BR: "#dc2626",
  SG: "#f59e0b",
  JP: "#e11d48",
  FR: "#1d4ed8",
  CA: "#b91c1c",
  SE: "#2563eb",
  AU: "#3b82f6",
  KR: "#3b82f6",
  NL: "#f97316",
  CN: "#991b1b",
  RU: "#dc2626",
  MX: "#22c55e",
  ES: "#ef4444",
  IT: "#22c55e",
  PL: "#f43f5e",
  TR: "#dc2626",
  ID: "#2563eb",
  TH: "#22c55e",
  VN: "#991b1b",
  PH: "#22c55e",
  EG: "#2563eb",
  NG: "#3b82f6",
  PK: "#facc15",
  BD: "#991b1b",
  AR: "#f59e0b",
  CO: "#dc2626",
  ZA: "#22c55e",
  SA: "#facc15",
  MY: "#991b1b",
  CL: "#991b1b",
  PE: "#2563eb",
  AE: "#f59e0b",
};

const MAP_VISIBLE_COUNTRIES = new Set(["US"]);
const US_MAP_VIEW = {
  centerLon: -96,
  centerLat: 37.5,
  scaleFactor: 0.6,
};
const CONTIGUOUS_US_BOUNDS = {
  minLon: -125,
  maxLon: -66,
  minLat: 24,
  maxLat: 50,
};

const US_STATE_MARKERS = {
  FL: { name: "Florida", coordinates: [-81.5158, 27.6648] },
  CA: { name: "California", coordinates: [-119.4179, 36.7783] },
  PA: { name: "Pennsylvania", coordinates: [-77.1945, 41.2033] },
  TX: { name: "Texas", coordinates: [-99.9018, 31.9686] },
  GA: { name: "Georgia", coordinates: [-82.9001, 32.1656] },
  NJ: { name: "New Jersey", coordinates: [-74.4057, 40.0583] },
  IL: { name: "Illinois", coordinates: [-89.3985, 40.6331] },
  NC: { name: "North Carolina", coordinates: [-79.0193, 35.7596] },
  OH: { name: "Ohio", coordinates: [-82.9071, 40.4173] },
  TN: { name: "Tennessee", coordinates: [-86.5804, 35.5175] },
};

const US_STATE_NAMES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};
const US_STATE_NAME_TO_CODE = Object.entries(US_STATE_NAMES).reduce((acc, [code, name]) => {
  acc[name.toLowerCase()] = code;
  return acc;
}, {});

const STATE_COLOR_MAP = {
  FL: "#2563eb",
  CA: "#facc15",
  PA: "#22c55e",
  TX: "#f97316",
  GA: "#ef4444",
  NJ: "#06b6d4",
  IL: "#e11d48",
  NC: "#14b8a6",
  OH: "#84cc16",
  TN: "#8b5cf6",
  MO: "#f43f5e",
  MI: "#0ea5e9",
};
const FALLBACK_STATE_COLORS = [
  "#2563eb",
  "#facc15",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#06b6d4",
  "#e11d48",
  "#14b8a6",
  "#84cc16",
  "#8b5cf6",
];
const US_DENSE_SOURCE_RADIUS_DEGREES = 2.15;
const US_DENSE_SOURCE_RADIUS_SQ =
  US_DENSE_SOURCE_RADIUS_DEGREES * US_DENSE_SOURCE_RADIUS_DEGREES;
const TOP_STATE_COLOR_RADIUS_DEGREES = 3.2;
const TOP_STATE_COLOR_RADIUS_SQ =
  TOP_STATE_COLOR_RADIUS_DEGREES * TOP_STATE_COLOR_RADIUS_DEGREES;
const ANALYSIS_DICTIONARY_FIELDS = [
  "year",
  "make",
  "body",
  "state",
  "sellingprice",
  "mmr",
  "saledate",
];
const DEFAULT_PREVIEW_ROW_TARGET = 8;
const MIN_PREVIEW_ROWS = 5;
const FALLBACK_DATASET_HEAD = {
  columns: [
    "year",
    "make",
    "model",
    "trim",
    "body",
    "transmission",
    "vin",
    "state",
    "condition",
    "odometer",
    "color",
    "interior",
    "seller",
    "mmr",
    "sellingprice",
    "saledate",
  ],
  rows: [
    [
      "2015",
      "Kia",
      "Sorento",
      "LX",
      "SUV",
      "automatic",
      "5xyktca69fg566472",
      "ca",
      "5",
      "16639",
      "white",
      "black",
      "kia motors america  inc",
      "20500",
      "21500",
      "Tue Dec 16 2014 12:30:00 GMT-0800 (PST)",
    ],
    [
      "2015",
      "Kia",
      "Sorento",
      "LX",
      "SUV",
      "automatic",
      "5xyktca69fg561319",
      "ca",
      "5",
      "9393",
      "white",
      "beige",
      "kia motors america  inc",
      "20800",
      "21500",
      "Tue Dec 16 2014 12:30:00 GMT-0800 (PST)",
    ],
    [
      "2014",
      "BMW",
      "3 Series",
      "328i SULEV",
      "Sedan",
      "automatic",
      "wba3c1c51ek116351",
      "ca",
      "45",
      "1331",
      "gray",
      "black",
      "financial services remarketing (lease)",
      "31900",
      "30000",
      "Thu Jan 15 2015 04:30:00 GMT-0800 (PST)",
    ],
    [
      "2015",
      "Volvo",
      "S60",
      "T5",
      "Sedan",
      "automatic",
      "yv1612tb4f1310987",
      "ca",
      "41",
      "14282",
      "white",
      "black",
      "volvo na rep/world omni",
      "27500",
      "27750",
      "Thu Jan 29 2015 04:30:00 GMT-0800 (PST)",
    ],
    [
      "2014",
      "BMW",
      "6 Series Gran Coupe",
      "650i",
      "Sedan",
      "automatic",
      "wba6b2c57ed129731",
      "ca",
      "43",
      "2641",
      "gray",
      "black",
      "financial services remarketing (lease)",
      "66000",
      "67000",
      "Thu Dec 18 2014 12:30:00 GMT-0800 (PST)",
    ],
  ],
};

function getStateCode(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (raw.length === 2) return raw.toUpperCase();

  const normalizedName = raw.toLowerCase();
  return US_STATE_NAME_TO_CODE[normalizedName] || "";
}

function formatStateName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "-";

  const stateCode = getStateCode(raw);
  if (stateCode && US_STATE_NAMES[stateCode]) return US_STATE_NAMES[stateCode];

  return raw;
}

function getStateColor(stateCode, index = 0) {
  const normalized = getStateCode(stateCode);
  if (normalized && STATE_COLOR_MAP[normalized]) return STATE_COLOR_MAP[normalized];
  return FALLBACK_STATE_COLORS[index % FALLBACK_STATE_COLORS.length];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parsePreviewCsv(csvText, rowLimit = 240) {
  if (!csvText || typeof csvText !== "string") return null;

  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) return null;

  const columns = parseCsvLine(lines[0]);
  const rows = lines
    .slice(1, rowLimit + 1)
    .map((line) => parseCsvLine(line))
    .filter((row) => row.length > 0);

  if (columns.length === 0 || rows.length === 0) return null;
  return { columns, rows };
}

function formatNumber(value) {
  return numberFormatter.format(Math.round(Number(value) || 0));
}

function formatMoney(value) {
  return moneyFormatter.format(Math.round(Number(value) || 0));
}

function formatSignedMoney(value) {
  const numeric = Number(value) || 0;
  const absolute = moneyFormatter.format(Math.abs(Math.round(numeric)));
  return numeric >= 0 ? `+${absolute}` : `-${absolute}`;
}

function formatPeakMonth(value) {
  if (!value || !String(value).includes("-")) return "-";
  const [year, month] = value.split("-");
  const monthDate = new Date(Number(year), Number(month) - 1, 1);
  return `${monthDate.toLocaleString("en-US", { month: "short" })} ${year}`;
}

function createKpi(label, value) {
  return `<article class="kpi"><div class="label">${label}</div><div class="value">${value}</div></article>`;
}

function animateCounterToTarget({
  valueEl,
  rateEl,
  targetValue,
  startValue = 0,
  durationMs = 3600,
  fps = 20,
}) {
  const target = Math.max(0, Math.round(Number(targetValue) || 0));
  let current = Math.max(0, Math.min(target, Math.round(Number(startValue) || 0)));
  const start = current;

  const frameMs = Math.max(30, Math.round(1000 / fps));
  const totalFrames = Math.max(1, Math.round(durationMs / frameMs));
  let frame = 0;

  if (valueEl) valueEl.textContent = formatNumber(current);
  if (rateEl) rateEl.textContent = "0/s";

  const timer = setInterval(() => {
    frame += 1;
    const progress = Math.min(frame / totalFrames, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const next = Math.min(target, Math.round(start + (target - start) * eased));
    const delta = Math.max(0, next - current);
    const rate = Math.round((delta * 1000) / frameMs);

    current = next;
    if (valueEl) valueEl.textContent = formatNumber(current);
    if (rateEl) rateEl.textContent = `${formatNumber(rate)}/s`;

    if (current >= target || frame >= totalFrames) {
      if (valueEl) valueEl.textContent = formatNumber(target);
      if (rateEl) rateEl.textContent = "0/s";
      clearInterval(timer);
    }
  }, frameMs);
}

function renderTopStates(topStates) {
  const list = document.querySelector("#top-states-list");
  if (!list) return;

  const rows = (topStates || []).slice(0, 7);
  list.innerHTML = rows
    .map((row, index) => {
      const code = getStateCode(row.state);
      const stateName = formatStateName(row.state);
      const color = getStateColor(code, index);
      return `
      <li data-row-index="${index}">
        <span class="swatch" style="background:${color}"></span>
        <span class="code" style="color:${color}">${escapeHtml(stateName)}</span>
        <span class="value" id="state-value-${index}">${formatNumber(row.transactions)}</span>
        <span class="rate" id="state-rate-${index}">${formatNumber(Math.round((row.transactions || 0) / 1200))}/s</span>
      </li>`;
    })
    .join("");

  rows.forEach((row, index) => {
    const valueEl = document.querySelector(`#state-value-${index}`);
    const rateEl = document.querySelector(`#state-rate-${index}`);
    const target = Number(row.transactions) || 0;
    const start = Math.round(target * 0.75);
    animateCounterToTarget({
      valueEl,
      rateEl,
      targetValue: target,
      startValue: start,
      durationMs: 3200 + index * 140,
      fps: 16,
    });
  });
}

function setSummaryCards(data) {
  const summary = data.summary || {};
  const dataset = summary.dataset || {};
  const kpis = summary.kpis || {};

  const topMakeLabel = `${kpis.top_make || "-"} volume`;
  const topBodyLabel = `${kpis.top_body || "-"} volume`;

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  setText("#card-total-transactions", formatNumber(dataset.rows));
  setText("#card-valid-price", formatNumber(dataset.valid_price_rows));
  setText("#card-valid-date", formatNumber(dataset.valid_date_rows));
  setText("#card-avg-price", formatMoney(kpis.average_sellingprice));
  setText("#card-vs-mmr", formatSignedMoney(kpis.average_price_vs_mmr));
  setText(
    "#card-car-age",
    `${(Number(kpis.average_car_age_at_sale) || 0).toFixed(1)} years`
  );
  setText(
    "#card-peak-month",
    `${formatPeakMonth(kpis.peak_month)} (${formatNumber(kpis.peak_month_transactions)})`
  );
  setText("#card-top-make-label", topMakeLabel);
  setText("#card-top-make-tx", formatNumber(kpis.top_make_transactions));
  setText("#card-top-body-label", topBodyLabel);
  setText("#card-top-body-tx", formatNumber(kpis.top_body_transactions));
  setText("#card-top-state", formatStateName(kpis.top_state));
  setText("#card-top-state-tx", `${formatNumber(kpis.top_state_transactions)} transactions`);
}

function renderOverview(summary) {
  const container = document.querySelector("#dataset-kpis");
  if (!container) return;

  const dataset = summary?.dataset || {};
  const kpis = summary?.kpis || {};
  container.innerHTML = [
    createKpi("Rows", formatNumber(dataset.rows)),
    createKpi("Columns", formatNumber(dataset.columns)),
    createKpi("Valid price rows", formatNumber(dataset.valid_price_rows)),
    createKpi("Valid date rows", formatNumber(dataset.valid_date_rows)),
    createKpi("Top make", `${kpis.top_make || "-"} (${formatNumber(kpis.top_make_transactions)})`),
    createKpi("Top body", `${kpis.top_body || "-"} (${formatNumber(kpis.top_body_transactions)})`),
  ].join("");
}

function renderDatasetPreview(sampleHead) {
  const container = document.querySelector("#dataset-preview-table");
  const note = document.querySelector("#data-preview-note");
  if (!container) return;

  const fallback = FALLBACK_DATASET_HEAD;
  const columns =
    Array.isArray(sampleHead?.columns) && sampleHead.columns.length > 0
      ? sampleHead.columns
      : fallback.columns;
  const sourceRows =
    Array.isArray(sampleHead?.rows) && sampleHead.rows.length > 0
      ? sampleHead.rows
      : fallback.rows;

  const normalizedRows = sourceRows
    .map((row) => {
      if (Array.isArray(row)) return row;
      if (row && typeof row === "object") {
        return columns.map((column) => row[column]);
      }
      return null;
    })
    .filter(Boolean);

  if (normalizedRows.length === 0) {
    container.innerHTML = "";
    if (note) note.textContent = "Preview unavailable.";
    return;
  }

  const headHtml = columns
    .map((column) => `<th scope="col">${escapeHtml(column)}</th>`)
    .join("");

  const renderTable = (rowCount) => {
    const safeRowCount = Math.max(1, Math.min(normalizedRows.length, rowCount));
    const bodyHtml = normalizedRows
      .slice(0, safeRowCount)
      .map((row) => {
        const cells = columns
          .map((columnName, columnIndex) => {
            const isStateColumn = String(columnName || "").toLowerCase() === "state";
            const rawValue = row[columnIndex];
            const displayValue = isStateColumn ? formatStateName(rawValue) : rawValue;
            return `<td>${escapeHtml(displayValue)}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    container.innerHTML = `
      <table class="data-preview-table">
        <thead><tr>${headHtml}</tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    `;

    if (note) {
      note.textContent = `First ${safeRowCount} rows with all original column headers.`;
    }
  };

  const calculateRowsToFit = () => {
    renderTable(1);

    const table = container.querySelector(".data-preview-table");
    const header = table?.querySelector("thead");
    const firstRow = table?.querySelector("tbody tr");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const rowHeight = firstRow?.getBoundingClientRect().height || 0;
    const availableHeight = container.clientHeight || 0;

    if (!rowHeight || availableHeight <= 0) {
      return Math.min(normalizedRows.length, DEFAULT_PREVIEW_ROW_TARGET);
    }

    const fitRows = Math.floor((availableHeight - headerHeight - 2) / rowHeight);
    const clampedFit = Math.max(MIN_PREVIEW_ROWS, fitRows);
    return Math.min(normalizedRows.length, clampedFit);
  };

  const rerender = () => {
    const rowsToShow = calculateRowsToFit();
    renderTable(rowsToShow);
  };

  rerender();
  requestAnimationFrame(rerender);

  if (window.__datasetPreviewResizeHandler) {
    window.removeEventListener("resize", window.__datasetPreviewResizeHandler);
  }

  let resizeFrame = null;
  window.__datasetPreviewResizeHandler = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(rerender);
  };
  window.addEventListener("resize", window.__datasetPreviewResizeHandler);
}

function getRelevantDictionaryColumns(dictionary) {
  const columnMap = new Map(
    (dictionary || []).map((column) => [String(column.name || "").toLowerCase(), column])
  );

  return ANALYSIS_DICTIONARY_FIELDS.map((field) => columnMap.get(field)).filter(Boolean);
}

function initDataDictionaryCarousel(container) {
  const viewport = container.querySelector(".dict-viewport");
  const track = container.querySelector(".dict-track");
  const slides = [...container.querySelectorAll(".dict-slide")];
  const dots = [...container.querySelectorAll(".dict-dot")];
  const prevBtn = container.querySelector('.dict-nav[data-dir="prev"]');
  const nextBtn = container.querySelector('.dict-nav[data-dir="next"]');

  if (!viewport || !track || slides.length === 0) return;

  let currentIndex = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let pointerId = null;

  const normalizeIndex = (index) =>
    ((index % slides.length) + slides.length) % slides.length;

  const syncState = () => {
    track.style.transform = `translateX(${-currentIndex * 100}%)`;
    slides.forEach((slide, index) => {
      const active = index === currentIndex;
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  const goTo = (index) => {
    currentIndex = normalizeIndex(index);
    track.classList.remove("is-dragging");
    syncState();
  };

  const dragThreshold = () => Math.max(36, viewport.clientWidth * 0.1);

  const applyDragOffset = () => {
    const offsetPercent = (dragDeltaX / Math.max(viewport.clientWidth, 1)) * 100;
    track.style.transform = `translateX(calc(${-currentIndex * 100}% + ${offsetPercent}%))`;
  };

  const endDrag = () => {
    if (!dragging) return;

    dragging = false;
    track.classList.remove("is-dragging");

    if (Math.abs(dragDeltaX) >= dragThreshold()) {
      goTo(dragDeltaX < 0 ? currentIndex + 1 : currentIndex - 1);
    } else {
      syncState();
    }

    dragDeltaX = 0;
    pointerId = null;
  };

  prevBtn?.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index || 0));
    });
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    dragging = true;
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragDeltaX = 0;
    track.classList.add("is-dragging");
    viewport.setPointerCapture(pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    dragDeltaX = event.clientX - dragStartX;
    applyDragOffset();
  });

  viewport.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId) return;
    endDrag();
  });
  viewport.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== pointerId) return;
    endDrag();
  });
  viewport.addEventListener("lostpointercapture", endDrag);

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
  });

  syncState();
}

function renderDataDictionary(dictionary) {
  const container = document.querySelector("#dictionary-carousel");
  if (!container) return;

  const relevantColumns = getRelevantDictionaryColumns(dictionary);
  if (relevantColumns.length === 0) {
    container.innerHTML = `<p class="chapter-note">No analysis-relevant dictionary fields were found.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="dictionary-carousel-frame">
      <div class="dict-viewport" tabindex="0" aria-label="Data dictionary carousel">
        <div class="dict-track">
          ${relevantColumns
            .map(
              (column, index) => {
                const isStateColumn = String(column.name || "").toLowerCase() === "state";
                const example = isStateColumn ? formatStateName(column.example) : column.example;
                const notes = isStateColumn
                  ? `Stored as two-letter codes in source data; displayed as full state names in the dashboard.`
                  : column.notes;

                return `
              <article class="dict-slide" aria-hidden="${index === 0 ? "false" : "true"}">
                <p class="dict-slide-kicker">Analysis Field ${index + 1} / ${relevantColumns.length}</p>
                <div class="dict-slide-head">
                  <h3 class="dict-slide-name">${column.name}</h3>
                  <span class="dict-slide-type">${column.type}</span>
                </div>
                <p class="dict-slide-desc">${column.description}</p>
                <p class="dict-slide-meta"><span>Example</span> <code>${escapeHtml(example)}</code></p>
                <p class="dict-slide-notes">${escapeHtml(notes)}</p>
              </article>`;
              }
            )
            .join("")}
        </div>
      </div>
      <button class="dict-nav" data-dir="prev" type="button" aria-label="Previous dictionary field">&#8249;</button>
      <button class="dict-nav" data-dir="next" type="button" aria-label="Next dictionary field">&#8250;</button>
    </div>
    <div class="dict-pagination">
      ${relevantColumns
        .map(
          (column, index) => `
          <button
            type="button"
            class="dict-dot ${index === 0 ? "is-active" : ""}"
            data-index="${index}"
            aria-label="Show ${column.name} field"
            aria-current="${index === 0 ? "true" : "false"}"
          ></button>`
        )
        .join("")}
    </div>
  `;

  initDataDictionaryCarousel(container);
}

function setCodeShowcase(codeShowcase) {
  const setCode = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value || "";
  };
  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value || "";
  };

  setCode("#code-cleaning", codeShowcase?.cleaning?.code);
  setCode("#code-category", codeShowcase?.category_summary?.code);
  setCode("#code-time", codeShowcase?.time_summary?.code);
  setCode("#code-additional", codeShowcase?.additional_summary?.code);

  setText("#desc-cleaning", codeShowcase?.cleaning?.description);
  setText("#desc-category", codeShowcase?.category_summary?.description);
  setText("#desc-time", codeShowcase?.time_summary?.description);
  setText("#desc-additional", codeShowcase?.additional_summary?.description);
}

function buildUsRegionMarkers(topStates, limit = 7) {
  return (topStates || [])
    .map((row, index) => {
      const stateCode = getStateCode(row.state);
      const stateMarker = US_STATE_MARKERS[stateCode];
      if (!stateMarker) return null;

      return {
        id: stateCode,
        name: stateMarker.name,
        coordinates: stateMarker.coordinates,
        color: getStateColor(stateCode, index),
      };
    })
    .filter(Boolean)
    .slice(0, limit);
}

function renderLiveBoard(data) {
  const dataset = data.summary?.dataset || {};
  const totalMetric = document.querySelector("#metric-total");
  const rateMetric = document.querySelector("#metric-rate");

  animateCounterToTarget({
    valueEl: totalMetric,
    rateEl: rateMetric,
    targetValue: dataset.rows,
    startValue: 0,
    durationMs: 4200,
    fps: 20,
  });

  renderTopStates(data.top_states);
  const regionMarkers = buildUsRegionMarkers(data.top_states, 7);
  document.querySelector("#region-count").textContent = String(regionMarkers.length);
  setSummaryCards(data);

  return regionMarkers;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function isContiguousUsCoordinate(lon, lat) {
  return (
    lon >= CONTIGUOUS_US_BOUNDS.minLon &&
    lon <= CONTIGUOUS_US_BOUNDS.maxLon &&
    lat >= CONTIGUOUS_US_BOUNDS.minLat &&
    lat <= CONTIGUOUS_US_BOUNDS.maxLat
  );
}

function buildDenseAxis(values) {
  const sorted = [...new Set((values || []).map((value) => Number(value.toFixed(5))))]
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  const dense = [];

  sorted.forEach((current, index) => {
    dense.push(current);
    if (index >= sorted.length - 1) return;

    const next = sorted[index + 1];
    const gap = next - current;
    if (gap > 0.8 && gap <= 5) {
      dense.push(Number((current + gap / 3).toFixed(5)));
      dense.push(Number((current + (gap * 2) / 3).toFixed(5)));
    }
  });

  return dense;
}

function buildDenseUsCities(cities) {
  const source = (cities || []).filter((city) =>
    isContiguousUsCoordinate(city.lon, city.lat)
  );
  if (source.length === 0) return [];

  const denseLons = buildDenseAxis(source.map((city) => city.lon));
  const denseLats = buildDenseAxis(source.map((city) => city.lat));
  const denseCities = [];

  denseLats.forEach((lat) => {
    denseLons.forEach((lon) => {
      if (!isContiguousUsCoordinate(lon, lat)) return;

      let nearestSourceDistanceSq = Number.POSITIVE_INFINITY;

      source.forEach((city) => {
        const lonDiff = lon - city.lon;
        const latDiff = lat - city.lat;
        const distanceSq = lonDiff * lonDiff + latDiff * latDiff;
        if (distanceSq < nearestSourceDistanceSq) {
          nearestSourceDistanceSq = distanceSq;
        }
      });

      if (nearestSourceDistanceSq <= US_DENSE_SOURCE_RADIUS_SQ) {
        denseCities.push({
          lon,
          lat,
          cityDistanceRank: denseCities.length,
        });
      }
    });
  });

  return denseCities;
}

function projectMercator(lon, lat, width, height) {
  const centerLon = US_MAP_VIEW.centerLon;
  const centerLat = US_MAP_VIEW.centerLat;
  const scale = width * US_MAP_VIEW.scaleFactor;

  const lambda = toRadians(lon);
  const phi = toRadians(lat);
  const lambda0 = toRadians(centerLon);
  const phi0 = toRadians(centerLat);

  const x = width / 2 + scale * (lambda - lambda0);
  const y =
    height / 2 -
    scale *
      (Math.log(Math.tan(Math.PI / 4 + phi / 2)) -
        Math.log(Math.tan(Math.PI / 4 + phi0 / 2)));

  return [x, y];
}

function getDotsToShow(countryCode) {
  if (countryCode === "US") return 5000;

  const load = MAP_COUNTRY_LOAD[countryCode] || 0;

  if (load >= 90) return 40;
  if (load >= 70) return 31;
  if (load >= 50) return 22;
  if (load >= 30) return 14;
  if (load >= 15) return 8;
  if (load >= 8) return 4;
  return 0;
}

function getNearestRegionMatch(lon, lat, regionMarkers) {
  if (!regionMarkers || regionMarkers.length === 0) return null;

  let nearestMarker = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  regionMarkers.forEach((marker) => {
    const markerLon = Number(marker.coordinates?.[0]);
    const markerLat = Number(marker.coordinates?.[1]);
    if (!Number.isFinite(markerLon) || !Number.isFinite(markerLat)) return;

    const lonScale = Math.cos(toRadians((lat + markerLat) / 2));
    const lonDiff = (lon - markerLon) * lonScale;
    const latDiff = lat - markerLat;
    const distance = lonDiff * lonDiff + latDiff * latDiff;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestMarker = marker;
    }
  });

  if (!nearestMarker) return null;

  return {
    marker: nearestMarker,
    distanceSq: nearestDistance,
  };
}

function renderDottedMap(dottedMapData, regionMarkers) {
  const svg = document.querySelector("#map-svg");
  if (!svg) return;

  const staticLayer = document.querySelector("#map-static-layer");
  const activeLayer = document.querySelector("#map-active-layer");
  const markerLayer = document.querySelector("#map-marker-layer");
  const tooltip = document.querySelector("#marker-tooltip");

  if (!staticLayer || !activeLayer || !markerLayer || !tooltip) return;

  const width = 1100;
  const height = 600;
  const ns = "http://www.w3.org/2000/svg";

  const staticFragment = document.createDocumentFragment();
  const activeFragment = document.createDocumentFragment();

  Object.entries(dottedMapData || {})
    .filter(([countryCode]) => MAP_VISIBLE_COUNTRIES.has(countryCode))
    .forEach(([countryCode, cities]) => {
      const visibleDots = getDotsToShow(countryCode);
      const color = MAP_COUNTRY_COLORS[countryCode] || "#666";
      const mapCities = countryCode === "US" ? buildDenseUsCities(cities) : cities || [];

      mapCities.forEach((city) => {
        if (!isContiguousUsCoordinate(city.lon, city.lat)) return;

        const projected = projectMercator(city.lon, city.lat, width, height);
        if (!projected) return;

        const [x, y] = projected;
        if (x < 0 || x > width || y < 0 || y > height) return;

        const pixel = document.createElementNS(ns, "rect");
        pixel.setAttribute("x", x.toFixed(2));
        pixel.setAttribute("y", y.toFixed(2));
        pixel.setAttribute("width", "3");
        pixel.setAttribute("height", "3");

        if (city.cityDistanceRank < visibleDots) {
          const nearestMatch = getNearestRegionMatch(
            city.lon,
            city.lat,
            regionMarkers
          );
          const isTopStateCoverage =
            nearestMatch && nearestMatch.distanceSq <= TOP_STATE_COLOR_RADIUS_SQ;

          if (isTopStateCoverage) {
            pixel.setAttribute("fill", nearestMatch.marker.color || color);

            if (nearestMatch.distanceSq <= TOP_STATE_COLOR_RADIUS_SQ * 0.3) {
              pixel.classList.add("pulse-strong");
            } else {
              pixel.classList.add("pulse-soft");
            }

            pixel.style.animationDelay = `${(city.cityDistanceRank % 8) * 0.17}s`;
            activeFragment.appendChild(pixel);
          } else {
            staticFragment.appendChild(pixel);
          }
        } else {
          staticFragment.appendChild(pixel);
        }
      });
    });

  staticLayer.replaceChildren(staticFragment);
  activeLayer.replaceChildren(activeFragment);

  const markerFragment = document.createDocumentFragment();

  (regionMarkers || []).forEach((marker) => {
    if (!isContiguousUsCoordinate(marker.coordinates[0], marker.coordinates[1])) return;

    const [x, y] = projectMercator(marker.coordinates[0], marker.coordinates[1], width, height);

    const shape = document.createElementNS(ns, "polygon");
    shape.setAttribute(
      "points",
      `${x.toFixed(2)},${(y - 5.1).toFixed(2)} ${(x - 4.2).toFixed(2)},${(y + 2.4).toFixed(2)} ${(x + 4.2).toFixed(2)},${(y + 2.4).toFixed(2)}`
    );
    shape.style.color = marker.color || "#f4f4f5";

    const showTooltip = () => {
      tooltip.hidden = false;
      tooltip.textContent = `▲ ${marker.id} · ${marker.name}`;
      tooltip.style.left = `${(x / width) * 100}%`;
      tooltip.style.top = `${(y / height) * 100}%`;
    };

    shape.addEventListener("mouseenter", showTooltip);
    shape.addEventListener("focus", showTooltip);
    shape.addEventListener("mouseleave", () => {
      tooltip.hidden = true;
    });
    shape.addEventListener("blur", () => {
      tooltip.hidden = true;
    });

    markerFragment.appendChild(shape);
  });

  markerLayer.replaceChildren(markerFragment);

  svg.addEventListener("mouseleave", () => {
    tooltip.hidden = true;
  });
}

function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a - b);
}

function buildFilters(data) {
  const makeFilter = document.querySelector("#make-filter");
  const yearFilter = document.querySelector("#year-filter");

  const makes = [
    "All",
    ...[...new Set((data.transactions_by_make_year || []).map((row) => row.make))].sort(),
  ];
  const years = [
    "All",
    ...uniqueSorted((data.transactions_by_year || []).map((row) => Number(row.sale_year))),
  ];

  makeFilter.innerHTML = makes
    .map(
      (make) => `<option value="${make}">${make}</option>`
    )
    .join("");
  yearFilter.innerHTML = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");

  return { makeFilter, yearFilter };
}

function getMakeYearTransactions(data, selectedMake, selectedYear) {
  return (data.transactions_by_make_year || []).filter((row) => {
    const makeOk = selectedMake === "All" || row.make === selectedMake;
    const yearOk = selectedYear === "All" || Number(row.sale_year) === Number(selectedYear);
    return makeOk && yearOk;
  });
}

function groupAndSortTransactions(rows, keyName) {
  const grouped = rows.reduce((acc, row) => {
    const key = row[keyName];
    acc[key] = (acc[key] || 0) + Number(row.transactions || 0);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([key, transactions]) => ({ [keyName]: key, transactions }))
    .sort((a, b) => b.transactions - a.transactions);
}

function getScopedMakeTransactions(data, selectedMake, selectedYear) {
  const filtered = getMakeYearTransactions(data, selectedMake, selectedYear);
  if (selectedMake !== "All") {
    return groupAndSortTransactions(filtered, "make");
  }
  return groupAndSortTransactions(filtered, "make").slice(0, 15);
}

function getScopedMonthlyTransactions(data, selectedMake, selectedYear) {
  if (selectedMake === "All" && selectedYear === "All") {
    return data.transactions_by_month || [];
  }

  const filtered = (data.transactions_by_make_month || []).filter((row) => {
    const makeOk = selectedMake === "All" || row.make === selectedMake;
    const yearOk = selectedYear === "All" || Number(row.sale_year) === Number(selectedYear);
    return makeOk && yearOk;
  });

  return groupAndSortTransactions(filtered, "year_month").sort((a, b) =>
    a.year_month.localeCompare(b.year_month)
  );
}

function getScopedMetricByMake(
  data,
  selectedMake,
  selectedYear,
  metricKey,
  allYearsRows,
  byYearRows
) {
  let rows =
    selectedYear === "All"
      ? allYearsRows
      : byYearRows.filter((row) => Number(row.sale_year) === Number(selectedYear));

  if (selectedMake !== "All") {
    rows = rows.filter((row) => row.make === selectedMake);
  } else {
    rows = rows
      .slice()
      .sort((a, b) => Number(b[metricKey]) - Number(a[metricKey]))
      .slice(0, 15);
  }

  return rows;
}

function getKpiMetric(
  data,
  selectedMake,
  selectedYear,
  metricKey,
  allYearsByMake,
  byYearByMake,
  byYearOverall,
  fallback
) {
  if (selectedMake === "All" && selectedYear === "All") {
    return fallback;
  }

  if (selectedMake === "All" && selectedYear !== "All") {
    const row = byYearOverall.find((r) => Number(r.sale_year) === Number(selectedYear));
    return row ? Number(row[metricKey]) : fallback;
  }

  if (selectedMake !== "All" && selectedYear === "All") {
    const row = allYearsByMake.find((r) => r.make === selectedMake);
    return row ? Number(row[metricKey]) : fallback;
  }

  const row = byYearByMake.find(
    (r) => r.make === selectedMake && Number(r.sale_year) === Number(selectedYear)
  );
  return row ? Number(row[metricKey]) : fallback;
}

function renderDashboardKpis(data, selectedMake, selectedYear) {
  const scoped = getMakeYearTransactions(data, selectedMake, selectedYear);
  const scopedTransactions = scoped.reduce(
    (sum, row) => sum + Number(row.transactions || 0),
    0
  );

  const averagePrice = getKpiMetric(
    data,
    selectedMake,
    selectedYear,
    "avg_sellingprice",
    data.avg_price_by_make || [],
    data.avg_price_by_make_year || [],
    data.avg_price_by_year || [],
    data.summary.kpis.average_sellingprice
  );

  const averageVsMmr = getKpiMetric(
    data,
    selectedMake,
    selectedYear,
    "avg_price_vs_mmr",
    data.price_vs_mmr_by_make || [],
    data.price_vs_mmr_by_make_year || [],
    data.price_vs_mmr_by_year || [],
    data.summary.kpis.average_price_vs_mmr
  );

  const volume =
    selectedMake === "All" && selectedYear === "All"
      ? data.summary.dataset.rows
      : scopedTransactions;

  document.querySelector("#dashboard-kpis").innerHTML = [
    createKpi("Filtered transactions", formatNumber(volume)),
    createKpi("Average selling price", formatMoney(averagePrice)),
    createKpi("Average price vs MMR", formatSignedMoney(averageVsMmr)),
    createKpi(
      "Average car age",
      `${(Number(data.summary.kpis.average_car_age_at_sale) || 0).toFixed(1)} years`
    ),
  ].join("");
}

function baseChartLayout(overrides = {}) {
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "IBM Plex Mono, monospace", color: "#d0d0d6", size: 12 },
    margin: { t: 16, r: 16, b: 62, l: 62 },
    xaxis: {
      tickfont: { color: "#a6a6af" },
      gridcolor: "rgba(255,255,255,0.07)",
      zerolinecolor: "rgba(255,255,255,0.15)",
    },
    yaxis: {
      tickfont: { color: "#a6a6af" },
      gridcolor: "rgba(255,255,255,0.08)",
      zerolinecolor: "rgba(255,255,255,0.15)",
    },
    ...overrides,
  };
}

function renderCharts(data, selectedMake, selectedYear) {
  const topMakes = getScopedMakeTransactions(data, selectedMake, selectedYear);
  const monthly = getScopedMonthlyTransactions(data, selectedMake, selectedYear);

  const prices = getScopedMetricByMake(
    data,
    selectedMake,
    selectedYear,
    "avg_sellingprice",
    data.avg_price_by_make || [],
    data.avg_price_by_make_year || []
  );

  const rawVsMmr = getScopedMetricByMake(
    data,
    selectedMake,
    selectedYear,
    "avg_price_vs_mmr",
    data.price_vs_mmr_by_make || [],
    data.price_vs_mmr_by_make_year || []
  );

  const absValues = rawVsMmr
    .map((row) => Math.abs(Number(row.avg_price_vs_mmr || 0)))
    .sort((a, b) => b - a);
  const outlierThreshold = absValues.length > 1 ? absValues[1] * 5 : Number.POSITIVE_INFINITY;

  const vsMmr = rawVsMmr.filter(
    (row) => Math.abs(Number(row.avg_price_vs_mmr || 0)) <= outlierThreshold
  );
  const outliers = rawVsMmr.filter(
    (row) => Math.abs(Number(row.avg_price_vs_mmr || 0)) > outlierThreshold
  );

  const outlierNote = document.querySelector("#vs-mmr-outliers");
  if (outliers.length > 0) {
    const labels = outliers
      .map((row) => `${row.make} (${formatSignedMoney(row.avg_price_vs_mmr)})`)
      .join(", ");
    outlierNote.textContent = `Outliers excluded: ${labels}`;
  } else {
    outlierNote.textContent = "";
  }

  Plotly.newPlot(
    "chart-make",
    [
      {
        type: "bar",
        x: topMakes.map((row) => row.make),
        y: topMakes.map((row) => row.transactions),
        marker: {
          color: topMakes.map((row, index) =>
            selectedMake !== "All" && row.make === selectedMake
              ? "#facc15"
              : index % 2 === 0
                ? "#2563eb"
                : "#3b82f6"
          ),
        },
      },
    ],
    baseChartLayout({
      yaxis: { ...baseChartLayout().yaxis, title: "Transactions" },
      xaxis: { ...baseChartLayout().xaxis, tickangle: -25 },
    }),
    { displayModeBar: false, responsive: true }
  );

  Plotly.newPlot(
    "chart-month",
    [
      {
        type: "scatter",
        mode: "lines+markers",
        x: monthly.map((row) => row.year_month),
        y: monthly.map((row) => row.transactions),
        line: { color: "#f59e0b", width: 2.8 },
        marker: { color: "#facc15", size: 6 },
      },
    ],
    baseChartLayout({
      yaxis: { ...baseChartLayout().yaxis, title: "Transactions" },
      xaxis: { ...baseChartLayout().xaxis },
    }),
    { displayModeBar: false, responsive: true }
  );

  Plotly.newPlot(
    "chart-price",
    [
      {
        type: "bar",
        x: prices.map((row) => row.make),
        y: prices.map((row) => row.avg_sellingprice),
        marker: { color: "#22c55e" },
      },
    ],
    baseChartLayout({
      yaxis: {
        ...baseChartLayout().yaxis,
        title: "Avg selling price",
        tickprefix: "$",
      },
      xaxis: { ...baseChartLayout().xaxis, tickangle: -25 },
    }),
    { displayModeBar: false, responsive: true }
  );

  Plotly.newPlot(
    "chart-vs-mmr",
    [
      {
        type: "bar",
        x: vsMmr.map((row) => row.make),
        y: vsMmr.map((row) => row.avg_price_vs_mmr),
        marker: {
          color: vsMmr.map((row) =>
            Number(row.avg_price_vs_mmr) >= 0 ? "#22c55e" : "#ef4444"
          ),
        },
      },
    ],
    baseChartLayout({
      yaxis: {
        ...baseChartLayout().yaxis,
        title: "Avg price vs MMR",
        tickprefix: "$",
      },
      xaxis: { ...baseChartLayout().xaxis, tickangle: -25 },
      shapes: [
        {
          type: "line",
          x0: -0.5,
          x1: Math.max(vsMmr.length - 0.5, 0.5),
          y0: 0,
          y1: 0,
          line: {
            color: "rgba(255,255,255,0.45)",
            width: 1,
            dash: "dot",
          },
        },
      ],
    }),
    { displayModeBar: false, responsive: true }
  );
}

function renderNarrative(data) {
  const summary = data.summary || {};
  const kpis = summary.kpis || {};
  const dataset = summary.dataset || {};

  const findings = [
    `The dataset contains ${formatNumber(dataset.rows)} transactions, indicating high-volume market activity.`,
    `${kpis.top_make} is the highest-volume make at ${formatNumber(kpis.top_make_transactions)} sales.`,
    `${kpis.peak_month} is the strongest month with ${formatNumber(kpis.peak_month_transactions)} transactions.`,
    `Average selling price is ${formatMoney(kpis.average_sellingprice)}, and average price vs MMR is ${formatSignedMoney(kpis.average_price_vs_mmr)}.`,
  ];

  const recommendations = [
    "Prioritize stock planning for the top make and body categories to maximize turnover.",
    "Investigate persistent negative price-vs-MMR gaps and tighten pricing floor rules.",
    "Use monthly demand spikes to schedule reconditioning capacity and listing cadence.",
  ];

  document.querySelector("#findings-list").innerHTML = findings
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector("#recommendations-list").innerHTML = recommendations
    .map((item) => `<li>${item}</li>`)
    .join("");
}

async function init() {
  try {
    const [dashboardRes, mapRes, previewRes] = await Promise.all([
      fetch("./data/dashboard_data.json"),
      fetch("./data/dotted_map_data.json"),
      fetch("./data/car_prices_preview.csv"),
    ]);

    if (!dashboardRes.ok || !mapRes.ok) {
      throw new Error("Failed to load dashboard assets.");
    }

    const dashboardData = await dashboardRes.json();
    const mapData = await mapRes.json();
    const previewCsv = previewRes.ok ? await previewRes.text() : "";
    const parsedPreview = parsePreviewCsv(previewCsv, 240);
    const previewData = parsedPreview || dashboardData.sample_head;

    renderOverview(dashboardData.summary);
    renderDataDictionary(dashboardData.data_dictionary);
    renderDatasetPreview(previewData);
    setCodeShowcase(dashboardData.code_showcase);
    const regionMarkers = renderLiveBoard(dashboardData);
    renderDottedMap(mapData, regionMarkers);
    renderNarrative(dashboardData);

    const { makeFilter, yearFilter } = buildFilters(dashboardData);

    const redraw = () => {
      const selectedMake = makeFilter.value;
      const selectedYear = yearFilter.value;
      renderDashboardKpis(dashboardData, selectedMake, selectedYear);
      renderCharts(dashboardData, selectedMake, selectedYear);
    };

    makeFilter.addEventListener("change", redraw);
    yearFilter.addEventListener("change", redraw);

    redraw();
  } catch (error) {
    console.error(error);
  }
}

init();
