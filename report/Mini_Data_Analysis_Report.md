# Mini Data Analysis & Reporting Activity

## 1. Title Page
- Activity Title: Mini Data Analysis & Reporting Activity
- Dataset: `car_prices.csv`
- Students: Justin Louis Amper Dampal and Greg Danielle Cabanda

## 2. Introduction
The dataset contains used-car sales transactions with fields for vehicle details, seller, condition, odometer reading, market reference value (MMR), final selling price, and sale date. It represents a dealership/auction sales context where each transaction captures a specific sale event.

The data likely originates from an operational automotive sales platform (e.g., dealer auction management or vehicle marketplace transaction system).

This report converts raw operational records into analytical summaries by category, time, and pricing behavior.

## 3. OLTP Perspective
One row represents one completed car sale transaction. It stores transactional attributes (what car was sold, by whom, when, and for how much).

This is OLTP data because records are event-level, high-volume, and designed for day-to-day operational recording rather than summarized reporting.

A typical system storing this data is a vehicle sales transaction management system integrated with dealer inventory and auction workflows.

## 4. Data Analysis (OLAP Results)
### 4.1 Transactions per Category (Make)
| make | transactions |
| --- | --- |
| FORD | 93997 |
| CHEVROLET | 60587 |
| NISSAN | 54017 |
| TOYOTA | 39966 |
| DODGE | 30955 |
| HONDA | 27351 |
| HYUNDAI | 21836 |
| BMW | 20793 |
| KIA | 18084 |
| CHRYSLER | 17485 |

### 4.2 Transactions per Time Period (Year)
| sale_year | transactions |
| --- | --- |
| 2014.00 | 53725.00 |
| 2015.00 | 505074.00 |

### 4.3 Transactions per Category (Body Type)
| body | transactions |
| --- | --- |
| SEDAN | 241343 |
| SUV | 143844 |
| HATCHBACK | 26237 |
| MINIVAN | 25529 |
| COUPE | 17752 |
| CREW CAB | 16394 |
| WAGON | 16129 |
| CONVERTIBLE | 10476 |
| SUPERCREW | 9033 |
| G SEDAN | 7417 |

### 4.4 Transactions per Category (State)
| state | transactions |
| --- | --- |
| FL | 82945 |
| CA | 73148 |
| PA | 53907 |
| TX | 45913 |
| GA | 34750 |
| NJ | 27784 |
| IL | 23486 |
| NC | 21845 |
| OH | 21575 |
| TN | 20895 |

### 4.5 Additional Aggregation: Average Selling Price by Make
| make | avg_sellingprice |
| --- | --- |
| ROLLS-ROYCE | 153488.24 |
| FERRARI | 127210.53 |
| LAMBORGHINI | 112625.00 |
| BENTLEY | 74367.67 |
| AIRSTREAM | 71000.00 |
| TESLA | 67054.35 |
| ASTON MARTIN | 54812.00 |
| FISKER | 46461.11 |
| MASERATI | 44947.06 |
| LOTUS | 40800.00 |

### 4.6 Additional Aggregation: Average Price vs MMR by Make
(Positive values indicate selling above MMR; negative values indicate below MMR.)

| make | avg_price_vs_mmr |
| --- | --- |
| AIRSTREAM | 41500.00 |
| ASTON MARTIN | 1252.00 |
| LAMBORGHINI | 1125.00 |
| MAZDA TK | 1125.00 |
| LOTUS | 500.00 |
| GMC TRUCK | 429.55 |
| HUMMER | 252.62 |
| HYUNDAI TK | 225.00 |
| LANDROVER | 197.22 |
| CHEV TRUCK | 75.00 |

## 5. Findings and Insights
- The dataset includes **558,837** transactions, indicating a large operational dataset suitable for trend analysis.
- The highest transaction volume is **FORD** with **93,997** transactions.
- The dominant body type is **SEDAN** with **241,343** transactions.
- The most active state is **FL** with **82,945** transactions.
- The year with the highest number of transactions is **2015** with **505,074** records.
- The peak month in the dataset is **2015-02** with **163,052** transactions.
- Average selling price across valid records is **$13,611.36**.
- On average, vehicles sold **$-158.02** relative to MMR (negative means below MMR overall).

## 6. Recommendation
1. Prioritize inventory planning around high-volume makes and body types to match demand patterns.
2. Monitor pricing discipline for segments with consistently negative `price_vs_mmr` to reduce under-market sales.
3. Use monthly transaction peaks to plan auction participation, staffing, and promotional campaigns.
4. Track make-level performance monthly to detect which segments can sustain higher pricing above MMR.

## Appendix: Method Notes
- Missing values in `sellingprice`, `mmr`, and `saledate` were handled with coercion and excluded only where required per metric.
- Time-series summaries were derived from parsed `saledate` values (`sale_year`, `sale_month`).
- Full summary tables are available in the `/outputs/tables` folder.
