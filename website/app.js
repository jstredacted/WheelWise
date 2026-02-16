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

const REGION_MARKERS = [
  { id: "hnd1", name: "Tokyo", coordinates: [139.6922, 35.6897] },
  { id: "kix1", name: "Osaka", coordinates: [135.5023, 34.6937] },
  { id: "bom1", name: "Mumbai", coordinates: [72.8775, 19.0761] },
  { id: "gru1", name: "Sao Paulo", coordinates: [-46.6333, -23.55] },
  { id: "icn1", name: "Seoul", coordinates: [126.99, 37.56] },
  { id: "iad1", name: "Virginia", coordinates: [-77.0163, 38.9047] },
  { id: "sfo1", name: "San Francisco", coordinates: [-122.4449, 37.7558] },
  { id: "cle1", name: "Cleveland", coordinates: [-81.6805, 41.4764] },
  { id: "pdx1", name: "Portland", coordinates: [-122.65, 45.5371] },
  { id: "lhr1", name: "London", coordinates: [-0.1275, 51.5072] },
  { id: "cdg1", name: "Paris", coordinates: [2.3522, 48.8567] },
  { id: "cpt1", name: "Cape Town", coordinates: [18.4239, -33.9253] },
  { id: "hkg1", name: "Hong Kong", coordinates: [114.2, 22.3] },
  { id: "sin1", name: "Singapore", coordinates: [103.8, 1.3] },
  { id: "syd1", name: "Sydney", coordinates: [151.21, -33.8678] },
  { id: "fra1", name: "Frankfurt", coordinates: [8.6822, 50.1106] },
  { id: "dxb1", name: "Dubai", coordinates: [55.2972, 25.2631] },
  { id: "arn1", name: "Stockholm", coordinates: [18.0686, 59.3294] },
  { id: "dub1", name: "Dublin", coordinates: [-6.2603, 53.35] },
];

const STATE_COLORS = [
  "#2563eb",
  "#facc15",
  "#3b82f6",
  "#f59e0b",
  "#dc2626",
  "#f97316",
  "#e11d48",
];

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
      const code = String(row.state || "--");
      return `
      <li data-row-index="${index}">
        <span class="swatch" style="background:${STATE_COLORS[index % STATE_COLORS.length]}"></span>
        <span class="code" style="color:${STATE_COLORS[index % STATE_COLORS.length]}">${code}</span>
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
  setText("#card-top-state", kpis.top_state || "-");
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

function renderDataDictionary(dictionary) {
  const container = document.querySelector("#dictionary-grid");
  if (!container) return;

  container.innerHTML = (dictionary || [])
    .map(
      (column) => `
      <article class="dict-card">
        <div class="dict-card-head">
          <span class="dict-card-name">${column.name}</span>
          <span class="dict-card-type">${column.type}</span>
        </div>
        <p class="dict-card-desc">${column.description}</p>
        <p class="dict-card-meta">Example: <code>${column.example}</code> - ${column.notes}</p>
      </article>`
    )
    .join("");
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
  document.querySelector("#region-count").textContent = String(REGION_MARKERS.length);
  setSummaryCards(data);
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function projectMercator(lon, lat, width, height) {
  const centerLon = 15;
  const centerLat = 25;
  const scale = width * 0.127;

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
  const load = MAP_COUNTRY_LOAD[countryCode] || 0;

  if (load >= 90) return 40;
  if (load >= 70) return 31;
  if (load >= 50) return 22;
  if (load >= 30) return 14;
  if (load >= 15) return 8;
  if (load >= 8) return 4;
  return 0;
}

function renderDottedMap(dottedMapData) {
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

  Object.entries(dottedMapData || {}).forEach(([countryCode, cities]) => {
    const visibleDots = getDotsToShow(countryCode);
    const color = MAP_COUNTRY_COLORS[countryCode] || "#666";

    (cities || []).forEach((city) => {
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
        pixel.setAttribute("fill", color);

        if (visibleDots > 22 && city.cityDistanceRank < 5) {
          pixel.classList.add("pulse-strong");
        } else if (city.cityDistanceRank < 16) {
          pixel.classList.add("pulse-soft");
        }

        pixel.style.animationDelay = `${(city.cityDistanceRank % 8) * 0.17}s`;
        activeFragment.appendChild(pixel);
      } else {
        staticFragment.appendChild(pixel);
      }
    });
  });

  staticLayer.replaceChildren(staticFragment);
  activeLayer.replaceChildren(activeFragment);

  const markerFragment = document.createDocumentFragment();

  REGION_MARKERS.forEach((marker) => {
    const [x, y] = projectMercator(marker.coordinates[0], marker.coordinates[1], width, height);

    const shape = document.createElementNS(ns, "polygon");
    shape.setAttribute(
      "points",
      `${x.toFixed(2)},${(y - 5.1).toFixed(2)} ${(x - 4.2).toFixed(2)},${(y + 2.4).toFixed(2)} ${(x + 4.2).toFixed(2)},${(y + 2.4).toFixed(2)}`
    );

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
    .map((make) => `<option value="${make}">${make}</option>`)
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
    const [dashboardRes, mapRes] = await Promise.all([
      fetch("./data/dashboard_data.json"),
      fetch("./data/dotted_map_data.json"),
    ]);

    if (!dashboardRes.ok || !mapRes.ok) {
      throw new Error("Failed to load dashboard assets.");
    }

    const dashboardData = await dashboardRes.json();
    const mapData = await mapRes.json();

    renderOverview(dashboardData.summary);
    renderDataDictionary(dashboardData.data_dictionary);
    setCodeShowcase(dashboardData.code_showcase);
    renderLiveBoard(dashboardData);
    renderDottedMap(mapData);
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
