# Malaysia EV × TNB Cost Calculator — Universal Product Specification & PRD

> **Document Version:** 2.1.0  
> **Target Audience:** Frontend Architects, Product Designers, AI Code Generators (v0, Lovable, Cursor, Bolt), and Full-Stack Developers.  
> **Objective:** Universal functional, mathematical, and architectural specification of the Malaysia EV Cost & TNB Tariff Calculator for any Malaysian car buyer, driver, or household. This document intentionally omits visual CSS/styling rules to serve as a pure functional blueprint for frontend redesigns.

---

## 1. Executive Summary & Problem Statement

### 1.1 The Universal Showroom Dilemma
In Malaysia, when any driver or family evaluates switching from an internal combustion engine (ICE) petrol vehicle to an Electric Vehicle (EV) (e.g. Proton e.MAS 7, BYD Atto 3/Dolphin, Chery Omoda E5, Tesla Model 3, Zeekr X), dealerships routinely advertise energy savings using oversimplified flat electricity rates (e.g. `RM 0.30/kWh` or `RM 0.57/kWh`).

In reality, **Tenaga Nasional Berhad (TNB) residential electricity is billed on a progressive, non-linear tiered tariff structure with an Energy Efficiency Incentive (EEI) rebate, fixed service charges, fuel surcharges (AFA), and taxes (SST / KWTBB)**.

When an EV is plugged in at home, it charges on the household's **marginal (highest) tariff tier**, which:
1. Dilutes existing household EEI rebate percentages across all units consumed.
2. May push total household consumption across the **600 kWh critical threshold**, triggering loss of Retail Charge and AFA fuel surcharge waivers.
3. May cause an apparent "TNB bill jump" that confuses buyers, even though the family is genuinely achieving positive net savings by eliminating petrol expenses.

### 1.2 Universal Product Value Proposition
This application is a **universal, client-side, instant reactive financial calculator** designed for any Malaysian EV buyer. Within 15 seconds, any user can:
- Input an EV's official energy consumption (`kWh/100 km`).
- Input their current monthly driving distance (or align with their current petrol budget).
- Input their current household electricity baseline (either in **kWh** or directly in **RM Bill Amount** via bidirectional conversion).
- Input their current monthly petrol expenditure.
- Receive an audit-grade calculation of their exact new TNB bill, net monthly/yearly/5-year savings, 2026 JPJ EV Road Tax difference, and side-by-side comparison with other candidate EV models.

---

## 2. User Personas & Universal User Journeys

### 2.1 Target User Profiles
1. **The Showroom Buyer (Prospective EV Owner):** Standing in a dealership, test-driving a vehicle, needs to know within 30 seconds if the car actually saves money given their family's existing TNB bill and petrol spend.
2. **The Multi-Model Shopper:** Evaluating 2–3 different EVs (e.g. Proton e.MAS 7 vs. BYD Atto 3 vs. Tesla Model 3 RWD) and wants to compare them side-by-side on energy cost, road tax, and 5-year TCO.
3. **The Bill-Conscious Homeowner:** Knows their monthly TNB bill in Ringgit (e.g. `RM 200/mo`) but doesn't know their exact kWh, needing bidirectional conversion to simulate the EV impact.
4. **The Long-Distance Commuter:** Drives $> 2,000\text{ km/month}$ and wants to model mixed charging (`90% Home AC + 10% Public DC Fast Charging`) vs. `100% Home AC`.

### 2.2 Core User Journeys
1. **Universal Showroom Flow:**
   - User inputs vehicle consumption (e.g. `14.5 kWh/100km`) or taps a quick preset.
   - User inputs their current monthly mileage (e.g. `1,500 km`) or taps `[Align with Petrol Budget]`.
   - User inputs their current home electricity (either `501 kWh` or `RM 172.70`).
   - User inputs their current petrol spend (e.g. `RM 210/mo`).
   - Instant verdict: **"Net Monthly Savings: +RM 18.04 / month · 5-Year Cumulative Savings: +RM 1,082.40"**.
2. **Side-by-Side EV Comparison Flow:**
   - User keeps active vehicle as Car A, selects an alternative preset as Car B (or custom inputs).
   - System renders parallel metrics with a dynamic winner tag (e.g. "Car A saves RM 1,420 more over 5 years").
3. **2026 Malaysia JPJ Road Tax Flow:**
   - System automatically calculates the EV's 2026 kW-based road tax and compares it with the user's ICE engine capacity (1500cc, 1800cc, 2000cc), integrating the annual delta into the 5-Year TCO.

---

## 3. Mathematical Models & Calculation Engine

### 3.1 TNB 2025/2026 Restructured Domestic Tariff Schedule

The calculation engine implements Peninsular Malaysia's official TNB Residential Tariff schedule:

#### A. Base Generation, Capacity & Network Rates
$$\text{Base Tariff Rate} = 0.2703 (\text{Generation}) + 0.0455 (\text{Capacity}) + 0.1285 (\text{Network}) = \text{RM } 0.4443\text{ / kWh}$$
*(Note: If total monthly consumption exceeds $1,500\text{ kWh}$, Generation escalates to $37.03\text{ sen/kWh}$, making the base rate $\text{RM } 0.5443\text{ / kWh}$)*.

$$\text{Base Energy Subtotal} = \text{Total kWh} \times \text{Base Tariff Rate}$$

#### B. Energy Efficiency Incentive (EEI) Rebate Schedule (13-Tier Step Function)

| Total Monthly Consumption ($\text{kWh}$) | EEI Rebate Rate ($\text{sen/kWh}$) | Rebate Value ($\text{RM/kWh}$) |
| :--- | :--- | :--- |
| $\le 200\text{ kWh}$ | $22.5\text{ sen}$ | $\text{RM } 0.225$ |
| $201 - 300\text{ kWh}$ | $19.0\text{ sen}$ | $\text{RM } 0.190$ |
| $301 - 400\text{ kWh}$ | $16.5\text{ sen}$ | $\text{RM } 0.165$ |
| $401 - 450\text{ kWh}$ | $14.5\text{ sen}$ | $\text{RM } 0.145$ |
| $451 - 500\text{ kWh}$ | $12.0\text{ sen}$ | $\text{RM } 0.120$ |
| $501 - 550\text{ kWh}$ | $10.5\text{ sen}$ | $\text{RM } 0.105$ |
| $551 - 600\text{ kWh}$ | $9.0\text{ sen}$ | $\text{RM } 0.090$ |
| $601 - 650\text{ kWh}$ | $7.5\text{ sen}$ | $\text{RM } 0.075$ |
| $651 - 700\text{ kWh}$ | $5.5\text{ sen}$ | $\text{RM } 0.055$ |
| $701 - 750\text{ kWh}$ | $4.5\text{ sen}$ | $\text{RM } 0.045$ |
| $751 - 800\text{ kWh}$ | $4.0\text{ sen}$ | $\text{RM } 0.040$ |
| $801 - 900\text{ kWh}$ | $3.0\text{ sen}$ | $\text{RM } 0.030$ |
| $901 - 1000\text{ kWh}$ | $1.5\text{ sen}$ | $\text{RM } 0.015$ |
| $> 1000\text{ kWh}$ | $0.0\text{ sen}$ | $\text{RM } 0.000$ |

$$\text{EEI Rebate Amount} = \text{Total kWh} \times (\text{EEI Rate Sen} / 100)$$
$$\text{Net Base Energy} = \max(0, \text{Base Energy Subtotal} - \text{EEI Rebate Amount})$$

#### C. Fixed & Variable Surcharges (The 600 kWh Cliff)
1. **Retail Service Charge:**
   - $\le 600\text{ kWh}$: **Waived (RM 0.00)**
   - $> 600\text{ kWh}$: **RM 10.00 / month**
2. **Automatic Fuel Adjustment (AFA) Surcharge:**
   - $\le 600\text{ kWh}$: **Waived (RM 0.00)**
   - $> 600\text{ kWh}$: $\text{Total kWh} \times (\text{AFA Rate} / 100)$ (Default: $+3.80\text{ sen/kWh}$)
3. **KWTBB (Renewable Energy Fund):**
   - $\le 300\text{ kWh}$: **RM 0.00**
   - $> 300\text{ kWh}$: $1.6\% \times \text{Net Base Energy}$
4. **Service Tax (SST):**
   - $\le 600\text{ kWh}$: **RM 0.00**
   - $> 600\text{ kWh}$: $8\%$ applied only to the electricity portion of units consumed above $600\text{ kWh}$:
     $$\text{SST} = (\text{Total kWh} - 600) \times \text{Effective Rate for Excess} \times 0.08$$

$$\text{Total Bill} = \text{Round}(\text{Net Base Energy} + \text{Retail Charge} + \text{AFA Surcharge} + \text{KWTBB} + \text{SST}, 2)$$

#### D. Bidirectional RM $\leftrightarrow$ kWh Reverse Calculation
For users who enter their monthly bill in Ringgit (e.g. `RM 200`), the engine runs a binary search inversion function `estimateKwhFromTnbBill(targetBillRm)`:
$$\text{Target kWh} = \text{Invert}(\text{calculateTnbBill}(\text{kwh}) = \text{targetBillRm})$$

---

### 3.2 EV Energy Consumption & Marginal Charging Cost Model

#### A. Charging Loss & Net-to-Gross Energy
$$\text{Gross Home Energy Consumption} = \frac{\text{Rated Consumption (kWh/100km)}}{\eta = 0.90} \approx \text{kWh/100km} \times 1.10$$
$$\text{Monthly Total EV Gross Energy} = \frac{\text{Monthly Mileage (km)}}{100} \times \text{Gross Consumption}$$

#### B. Charging Mode Split
1. **Mixed Mode (`mixed`, Default):** $90\%$ Home AC + $10\%$ Public DC Fast Charging (default `RM 1.40 / kWh`).
2. **Home Only Mode (`home_only`):** $100\%$ Home AC + $0\%$ Public DC.

$$\text{Public Charging Cost} = \text{Public EV kWh} \times \text{Public DC Price Per kWh}$$

#### C. True Marginal Electricity Calculation (Zero Double Counting)
$$\text{Combined Household kWh} = \text{Baseline Home kWh} + \text{Home EV kWh}$$
$$\text{New Combined Bill} = \text{calculateTnbBill}(\text{Combined Household kWh})$$
$$\text{Baseline Bill} = \text{calculateTnbBill}(\text{Baseline Home kWh})$$
$$\text{Marginal Home Electricity Cost} = \text{New Combined Bill} - \text{Baseline Bill}$$
$$\text{Total EV Charging Expense} = \text{Marginal Home Electricity Cost} + \text{Public Charging Cost}$$

---

### 3.3 Petrol Baseline & Universal Net Financial Balance

#### A. Petrol Car Equivalence
$$\text{Petrol Monthly Litres} = \frac{\text{Current Monthly Petrol Spend (RM)}}{\text{Petrol Price Per Litre (default RM 1.99)}}$$
$$\text{Petrol Equivalent Distance (km)} = \text{Monthly Litres} \times \text{Fuel Economy (default 14 km/L)}$$
$$\text{Petrol Cost Per 100km} = \left(\frac{100}{\text{Fuel Economy}}\right) \times \text{Petrol Price}$$

#### B. Net Financial Balance Formula
$$\text{Old Total Monthly Energy Expense} = \text{Baseline Home Bill} + \text{Current Petrol Spend}$$
$$\text{New Total Monthly Energy Expense} = \text{New Combined Bill} + \text{Public Charging Cost}$$
$$\text{Monthly Net Savings} = \text{Old Total} - \text{New Total} = \text{Petrol Spend} - \text{Marginal Home Cost} - \text{Public Charging Cost}$$

$$\text{1-Year Net Savings} = \text{Monthly Net Savings} \times 12$$
$$\text{5-Year Net Energy Savings} = \text{Monthly Net Savings} \times 60$$

---

### 3.4 Official 2026 Malaysia JPJ EV Road Tax Schedule (MOT Gazette)

| Motor Power Output Bracket ($\text{kW}$) | Base Road Tax ($\text{RM}$) | Incremental Rate ($\text{RM}$) | Representative Models |
| :--- | :--- | :--- | :--- |
| $\le 50.0\text{ kW}$ | $\text{RM } 20.00\text{ flat}$ | — | Micro EVs / Urban Pods |
| $50.1 - 100.0\text{ kW}$ | $\text{RM } 20.00$ | $+\text{RM } 10\text{ per } 10\text{ kW block}$ | Neta V ($70\text{ kW} \rightarrow \text{RM } 40$) |
| $100.1 - 210.0\text{ kW}$ | $\text{RM } 80.00$ | $+\text{RM } 20\text{ per } 10\text{ kW block}$ | BYD Atto 3 ($150\text{ kW} \rightarrow \text{RM } 160$)<br>Proton e.MAS 7 ($160\text{ kW} \rightarrow \text{RM } 180$)<br>Tesla Model 3 RWD ($208\text{ kW} \rightarrow \text{RM } 280$) |
| $210.1 - 310.0\text{ kW}$ | $\text{RM } 305.00$ | $+\text{RM } 30\text{ per } 10\text{ kW block}$ | Dual-Motor Mid-range |
| $310.1 - 410.0\text{ kW}$ | $\text{RM } 615.00$ | $+\text{RM } 50\text{ per } 10\text{ kW block}$ | BYD Seal Performance ($390\text{ kW} \rightarrow \text{RM } 1,015$) |
| $410.1 - 510.0\text{ kW}$ | $\text{RM } 1,140.00$ | $+\text{RM } 100\text{ per } 10\text{ kW block}$ | Performance EVs |
| $> 510.0\text{ kW}$ | $\text{RM } 2,160.00$ | $+\text{RM } 200\text{ per } 10\text{ kW block}$ | Hyper EVs |

$$\text{5-Year TCO Savings (incl. Road Tax)} = \text{5-Year Net Energy Savings} + (5 \times (\text{Petrol Road Tax} - \text{EV Road Tax}))$$

---

## 4. Universal Feature Matrix

```
+-----------------------------------------------------------------------------------+
|                                 APPLICATION MAP                                    |
+-----------------------------------------------------------------------------------+
|  [Navbar] Brand, Language Toggle (EN/ZH), Theme Toggle (Dark/Light), Settings, Share |
|                                                                                   |
|  [Section 1: Universal Showroom Cockpit]                                          |
|  - Large numeric consumption input (kWh/100km) with +/- 0.5 step controls         |
|  - Vehicle name input + Save to local device memory                               |
|  - Preset vehicle pills carousel (Proton e.MAS 7, BYD Atto 3, Tesla Model 3, etc)|
|  - Charging scenario toggle (90/10 Mixed vs. 100% Home Only)                      |
|  - Tri-grid user baseline inputs:                                                 |
|    1. Monthly Mileage (km) with quick commuting presets                           |
|    2. Current Home Electricity (Bidirectional toggle: enter kWh OR enter RM Bill)  |
|    3. Current Monthly Petrol Spend (RM) @ selectable RM 1.99 or RM 2.05/L        |
|                                                                                   |
|  [Section 2: Financial Verdict Hero]                                              |
|  - Universal net savings display: Monthly Net Savings (+/- RM)                    |
|  - 1-Year and 5-Year cumulative savings                                           |
|  - Step-by-step arithmetic waterfall breakdown                                    |
|  - Side-by-side comparison: Current Monthly Energy Spend vs. New With EV Spend    |
|                                                                                   |
|  [Section 3: Side-by-Side Multi-Car Comparator]                                   |
|  - Car A (Active inputs) vs. Car B (Alternative model preset selector)           |
|  - Power, Battery, 100km Cost, TNB Increment, Monthly & 5-Year Net Savings        |
|  - Dynamic Winner Tag                                                             |
|                                                                                   |
|  [Section 4: Cost per 100 km & Route Matrix]                                      |
|  - Relative 100km cost bar (EV vs. Petrol)                                        |
|  - Single full battery charge cost badge (Home marginal vs. Public DC)            |
|  - Route cost table: Daily Commute (50km), JB-KL (330km), KL-Penang (350km)       |
|                                                                                   |
|  [Section 5: 2026 Official JPJ EV Road Tax]                                       |
|  - EV Road Tax (kW-based) vs. ICE Road Tax (cc-based: 1500cc, 1800cc, 2000cc)     |
|  - 5-Year Road Tax delta badge factored into TCO                                  |
|  - Expandable 2026 MOT Gazette Tier reference table                               |
|                                                                                   |
|  [Section 6: Real TNB Itemized Bill Audit]                                        |
|  - Baseline vs. EV charging consumption split bar                                 |
|  - Expandable 6-item TNB audit table (Base, EEI rebate, Retail, AFA, KWTBB, SST)   |
|                                                                                   |
|  [Section 7: 600 kWh Threshold Jump Deep-Dive]                                    |
|  - Household sensitivity alert (Crossing 600 kWh)                                 |
|  - 4-Tier educational breakdown of why electricity jumps                          |
|  - Pro-tip advice on TNB Time-of-Use (ToU) smart night charging                   |
|                                                                                   |
|  [Drawers & Modals]                                                               |
|  - Advanced Settings Drawer: Petrol price, Fuel km/L, Loss %, Public DC rate, ToU |
|  - Share Report Modal: Formatted plain-text preview, Copy, WhatsApp               |
+-----------------------------------------------------------------------------------+
```

---

## 5. Pre-Configured Vehicle Presets (Malaysian Market Baseline)

| Preset ID | Vehicle Name | Brand | Rated $\text{kWh/100km}$ | Battery ($\text{kWh}$) | Motor Power ($\text{kW}$) | Claimed Range ($\text{km}$) | Price Range ($\text{RM}$) | Focus Tag |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `emas-7` | Proton e.MAS 7 | Proton | `14.5` | `60.22` | `160` | `410` (WLTP) | `~RM 108k - 120k` | Focus |
| `emas-5` | Proton e.MAS 5 | Proton | `13.8` | `49.52` | `130` | `350` (WLTP) | `~RM 80k - 95k` | Value |
| `byd-atto3` | BYD Atto 3 | BYD | `16.0` | `60.48` | `150` | `420` (WLTP) | `~RM 149k - 167k` | SUV |
| `byd-dolphin` | BYD Dolphin (Premium) | BYD | `14.8` | `60.48` | `150` | `427` (WLTP) | `~RM 125k` | Urban |
| `chery-omoda-e5` | Chery Omoda E5 | Chery | `15.5` | `61.06` | `150` | `430` (WLTP) | `~RM 146k` | Tech |
| `byd-seal-rwd` | BYD Seal (Dynamic) | BYD | `15.2` | `61.44` | `150` | `510` (WLTP) | `~RM 179k` | Sedan |
| `tesla-model3-rwd` | Tesla Model 3 (RWD) | Tesla | `13.2` | `60.00` | `208` | `513` (WLTP) | `~RM 189k` | Efficiency |
| `smart-1-pro` | Smart #1 (Pro) | Smart | `16.8` | `49.00` | `200` | `315` (WLTP) | `~RM 189k` | Compact |
| `zeekr-x` | Zeekr X | Zeekr | `16.5` | `66.00` | `200` | `440` (WLTP) | `~RM 180k` | Luxury |

---

## 6. TypeScript Interface Contracts

```typescript
export interface UserInputs {
  modelName: string;
  consumptionKwhPer100Km: number;
  motorPowerKw: number;
  monthlyMileageKm: number;
  baselineHomeKwh: number;
  baselineHomeBillRm: number;
  fatherPetrolCostRm: number; // Current Monthly Petrol Spend
  petrolEngineCc: number;
  chargingMode: 'mixed' | 'home_only';
  petrolPricePerLiter: number;
  petrolFuelEfficiencyKmPerL: number;
  chargingEfficiency: number;
  homeChargingRatio: number;
  publicDcPricePerKwh: number;
  afaRateSen: number;
  isTouEnabled: boolean;
  touOffPeakRateSen: number;
  batteryCapacityKwh: number;
}

export interface TnbBillBreakdown {
  kwh: number;
  baseGeneration: number;
  baseCapacity: number;
  baseNetwork: number;
  baseEnergySubtotal: number;
  eeiRebateSen: number;
  eeiRebateAmount: number;
  netBaseEnergy: number;
  retailCharge: number;
  isRetailChargeWaived: boolean;
  afaSurcharge: number;
  isAfaWaived: boolean;
  kwtbbFund: number;
  sstTax: number;
  totalAmount: number;
  isOver600Threshold: boolean;
  isOver1500Threshold: boolean;
  effectiveRatePerKwh: number;
}

export interface EvCalculationResult {
  monthlyDistanceKm: number;
  evMonthlyNetKwh: number;
  evMonthlyGrossKwh: number;
  evHomeChargingKwh: number;
  evPublicChargingKwh: number;

  baselineBill: TnbBillBreakdown;
  newCombinedBill: TnbBillBreakdown;
  marginalHomeElectricityCost: number;
  publicChargingCost: number;
  totalEvChargingCost: number;

  marginalEffectiveRatePerKwh: number;
  singleFullChargeMarginalCost: number;

  petrolEquivalentDistanceKm: number;
  petrolMonthlyCost: number;
  petrolCostPer100Km: number;
  evCostPer100Km: number;
  savingsRatioPerKm: number;

  oldTotalMonthlyEnergyExpense: number;
  newTotalMonthlyEnergyExpense: number;
  monthlyNetSavings: number;
  yearlyNetSavings: number;
  fiveYearNetSavings: number;

  evRoadTaxAnnualRm: number;
  petrolRoadTaxAnnualRm: number;
  annualRoadTaxDifferenceRm: number;
  fiveYearTcoWithRoadTaxSavings: number;

  crossed600Threshold: boolean;
  crossed1500Threshold: boolean;
}
```

---

## 7. Numerical Acceptance Test Cases

### Test Case 1: Standard Vehicle (Proton e.MAS 7 @ Default Market Inputs)
- **Inputs:**
  - Consumption: `14.5 kWh/100km`
  - Motor Power: `160 kW`
  - Mileage: `1,477 km` (aligned to RM 210 petrol)
  - Baseline Household: `501 kWh` (or `RM 172.70`)
  - Current Monthly Petrol: `RM 210.00`
  - Charging Mode: `mixed` (90% Home / 10% Public DC)
- **Expected Results:**
  - Baseline TNB Bill: **RM 172.70** (Exact gold standard)
  - Combined Household kWh: `715.17 kWh`
  - New Combined TNB Bill: **RM 331.35**
  - Marginal Home Electricity Cost: **RM 158.65**
  - Public DC Charging Cost: **RM 33.31**
  - Total Monthly EV Energy Cost: **RM 191.96**
  - **Monthly Net Savings:** **+RM 18.04**
  - **1-Year Net Savings:** **+RM 216.48**
  - EV 2026 Road Tax (160 kW): **RM 180.00 / year**
  - Petrol Road Tax (1500 cc): **RM 90.00 / year**
  - Annual Road Tax Delta: **−RM 90.00 / year**
  - **5-Year Cumulative TCO Savings (incl. Road Tax):** **+RM 632.40**

### Test Case 2: High Consumption Household (700 kWh Baseline + 2,000 km Mileage)
- **Inputs:**
  - Consumption: `16.0 kWh/100km` (BYD Atto 3, 150 kW)
  - Mileage: `2,000 km`
  - Baseline Household: `700 kWh` (Baseline Bill: `RM 336.51`)
  - Current Monthly Petrol: `RM 300.00`
  - Charging Mode: `mixed`
- **Expected Results:**
  - Monthly Gross EV Energy: `355.56 kWh` (Home: `320.00 kWh`, Public: `35.56 kWh`)
  - New Combined Household kWh: `1,020.00 kWh` (>1,000 kWh, EEI rebate drops to 0)
  - New Combined TNB Bill: **RM 538.79**
  - Marginal Home Electricity Cost: **RM 202.28**
  - Public DC Cost: **RM 49.78**
  - **Monthly Net Savings:** **+RM 47.94 / month**
  - **1-Year Net Savings:** **+RM 575.28**
