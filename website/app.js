const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");

function formatNum(value) {
  return number.format(Math.round(value));
}

function createKpi(label, value) {
  return `<article class="kpi"><div class="label">${label}</div><div class="value">${value}</div></article>`;
}

function setCodeShowcase(code) {
  document.querySelector("#code-cleaning").textContent = code.cleaning;
  document.querySelector("#code-category").textContent = code.category_summary;
  document.querySelector("#code-time").textContent = code.time_summary;
  document.querySelector("#code-additional").textContent = code.additional_summary;
}

function renderOverview(summary) {
  const dataset = summary.dataset;
  const kpis = summary.kpis;
  document.querySelector("#dataset-kpis").innerHTML = [
    createKpi("Rows", number.format(dataset.rows)),
    createKpi("Columns", number.format(dataset.columns)),
    createKpi("Valid Price Rows", number.format(dataset.valid_price_rows)),
    createKpi("Valid Date Rows", number.format(dataset.valid_date_rows)),
    createKpi("Top Make", `${kpis.top_make} (${number.format(kpis.top_make_transactions)})`),
    createKpi("Top Body", `${kpis.top_body} (${number.format(kpis.top_body_transactions)})`),
  ].join("");
}

function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a - b);
}

function buildFilters(data) {
  const makeFilter = document.querySelector("#make-filter");
  const yearFilter = document.querySelector("#year-filter");

  const makes = ["All", ...data.top_makes.map((d) => d.make)];
  const years = ["All", ...uniqueSorted(data.transactions_by_year.map((d) => Number(d.sale_year)))];

  makeFilter.innerHTML = makes.map((make) => `<option value="${make}">${make}</option>`).join("");
  yearFilter.innerHTML = years.map((year) => `<option value="${year}">${year}</option>`).join("");

  return { makeFilter, yearFilter };
}

function getMakeYearTransactions(data, selectedMake, selectedYear) {
  return data.transactions_by_make_year.filter((r) => {
    const makeOk = selectedMake === "All" || r.make === selectedMake;
    const yearOk = selectedYear === "All" || Number(r.sale_year) === Number(selectedYear);
    return makeOk && yearOk;
  });
}

function renderDashboardKpis(data, selectedMake, selectedYear) {
  const scoped = getMakeYearTransactions(data, selectedMake, selectedYear);
  const scopedTx = scoped.reduce((sum, row) => sum + Number(row.transactions), 0);

  const makePrice = data.avg_price_by_make.find((row) => row.make === selectedMake);
  const makeVsMmr = data.price_vs_mmr_by_make.find((row) => row.make === selectedMake);

  const avgPrice = selectedMake === "All" ? data.summary.kpis.average_sellingprice : (makePrice?.avg_sellingprice ?? data.summary.kpis.average_sellingprice);
  const avgVsMmr = selectedMake === "All" ? data.summary.kpis.average_price_vs_mmr : (makeVsMmr?.avg_price_vs_mmr ?? data.summary.kpis.average_price_vs_mmr);

  document.querySelector("#dashboard-kpis").innerHTML = [
    createKpi("Filtered Transactions", number.format(scopedTx || data.summary.dataset.rows)),
    createKpi("Average Selling Price", money.format(avgPrice)),
    createKpi("Average Price vs MMR", `${avgVsMmr >= 0 ? "+" : ""}${money.format(avgVsMmr)}`),
    createKpi("Average Car Age", `${data.summary.kpis.average_car_age_at_sale.toFixed(1)} years`),
  ].join("");
}

function renderCharts(data, selectedMake, selectedYear) {
  const topMakes = data.top_makes;
  const monthly = data.transactions_by_month;
  const prices = data.avg_price_by_make;
  const vsMmr = data.price_vs_mmr_by_make;

  const markerColors = topMakes.map((d) => (selectedMake !== "All" && d.make === selectedMake ? "#1b6a62" : "#8fb9b2"));

  Plotly.newPlot(
    "chart-make",
    [
      {
        type: "bar",
        x: topMakes.map((d) => d.make),
        y: topMakes.map((d) => d.transactions),
        marker: { color: markerColors },
      },
    ],
    {
      margin: { t: 20, r: 10, b: 70, l: 60 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      yaxis: { title: "Transactions", gridcolor: "#deE5e1" },
      xaxis: { tickangle: -30 },
    },
    { displayModeBar: false, responsive: true }
  );

  Plotly.newPlot(
    "chart-month",
    [
      {
        type: "scatter",
        mode: "lines+markers",
        x: monthly.map((d) => d.year_month),
        y: monthly.map((d) => d.transactions),
        line: { color: "#1b6a62", width: 3 },
        marker: { color: "#82b89f", size: 7 },
      },
    ],
    {
      margin: { t: 20, r: 10, b: 50, l: 60 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      yaxis: { title: "Transactions", gridcolor: "#deE5e1" },
    },
    { displayModeBar: false, responsive: true }
  );

  Plotly.newPlot(
    "chart-price",
    [
      {
        type: "bar",
        x: prices.map((d) => d.make),
        y: prices.map((d) => d.avg_sellingprice),
        marker: { color: "#4d7f6d" },
      },
    ],
    {
      margin: { t: 20, r: 10, b: 70, l: 60 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      yaxis: { title: "Avg Selling Price", tickprefix: "$", gridcolor: "#deE5e1" },
      xaxis: { tickangle: -30 },
    },
    { displayModeBar: false, responsive: true }
  );

  Plotly.newPlot(
    "chart-vs-mmr",
    [
      {
        type: "bar",
        x: vsMmr.map((d) => d.make),
        y: vsMmr.map((d) => d.avg_price_vs_mmr),
        marker: {
          color: vsMmr.map((d) => (d.avg_price_vs_mmr >= 0 ? "#2f6b34" : "#b33b2e")),
        },
      },
    ],
    {
      margin: { t: 20, r: 10, b: 70, l: 60 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      yaxis: { title: "Avg Price vs MMR", tickprefix: "$", gridcolor: "#deE5e1" },
      xaxis: { tickangle: -30 },
      shapes: [
        {
          type: "line",
          x0: -0.5,
          x1: vsMmr.length - 0.5,
          y0: 0,
          y1: 0,
          line: { color: "#6f7a75", width: 1, dash: "dot" },
        },
      ],
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderNarrative(data) {
  const s = data.summary;
  const findings = [
    `The dataset has ${number.format(s.dataset.rows)} transaction rows, indicating high-volume operational activity.`,
    `${s.kpis.top_make} is the highest-volume make with ${number.format(s.kpis.top_make_transactions)} transactions.`,
    `The peak transaction period is ${s.kpis.peak_month} with ${number.format(s.kpis.peak_month_transactions)} sales records.`,
    `Average selling price is ${money.format(s.kpis.average_sellingprice)}, while average price vs MMR is ${money.format(s.kpis.average_price_vs_mmr)}.`
  ];

  const recs = [
    "Prioritize acquisition for high-volume makes/body types to sustain turnover.",
    "Tighten pricing strategy where average price is consistently below MMR.",
    "Use monthly trend peaks to schedule staffing and inventory replenishment."
  ];

  document.querySelector("#findings-list").innerHTML = findings.map((f) => `<li>${f}</li>`).join("");
  document.querySelector("#recommendations-list").innerHTML = recs.map((r) => `<li>${r}</li>`).join("");
}

async function init() {
  const res = await fetch("./data/dashboard_data.json");
  const data = await res.json();

  renderOverview(data.summary);
  setCodeShowcase(data.code_showcase);
  renderNarrative(data);

  const { makeFilter, yearFilter } = buildFilters(data);

  const redraw = () => {
    const selectedMake = makeFilter.value;
    const selectedYear = yearFilter.value;
    renderDashboardKpis(data, selectedMake, selectedYear);
    renderCharts(data, selectedMake, selectedYear);
  };

  makeFilter.addEventListener("change", redraw);
  yearFilter.addEventListener("change", redraw);

  redraw();
}

init();
