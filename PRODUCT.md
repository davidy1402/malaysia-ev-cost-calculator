# Malaysia EV × TNB Cost Calculator — Product Specification & Technical PRD

> **Document Version:** 2.0.0  
> **Target Audience:** Frontend Architects, Product Designers, AI Code Generators (v0, Lovable, Cursor, Bolt), and Full-Stack Developers.  
> **Objective:** Comprehensive functional, mathematical, and architectural specification of the Malaysia EV Cost & TNB Tariff Calculator. This document intentionally omits visual CSS/styling rules to serve as a pure functional blueprint for frontend redesigns.

---

## 1. Executive Summary & Problem Statement

### 1.1 The Showroom Dilemma
In Malaysia, when prospective car buyers test-drive an Electric Vehicle (EV) such as the Proton e.MAS 7, BYD Atto 3, or Tesla Model 3, sales representatives routinely pitch energy savings based on generic flat electricity rates (e.g. `RM 0.30/kWh` or `RM 0.57/kWh`). 

In reality, **Tenaga Nasional Berhad (TNB) residential electricity is billed on a progressive, non-linear tiered tariff structure with an Energy Efficiency Incentive (EEI) rebate, fixed service charges, fuel surcharges (AFA), and taxes (SST / KWTBB)**.

When an EV is plugged in at home, it charges on the **marginal (highest) tariff tier**, which can:
1. Dilute existing household EEI rebate percentages across all units consumed.
2. Push total household consumption over the **600 kWh critical cliff**, triggering loss of Retail Charge and AFA fuel surcharge waivers.
3. Cause an apparent "bill explosion" even while the family is genuinely saving money by eliminating petrol expenses.

### 1.2 Product Value Proposition
This application is a **single-page, zero-backend, instant reactive financial calculator** designed for mobile showroom use. Within 15 seconds, a buyer can input an EV's official energy consumption (`kWh/100 km`) and receive an exact, audit-grade breakdown of:
- Exact new monthly TNB bill based on their household's actual baseline.
- Real net savings after eliminating their current monthly petrol expense.
- Side-by-side comparison with alternative EV models.
- Impact of the official **2026 Malaysia JPJ kW-based EV Road Tax**.
- Formatted, professional export for WhatsApp and personal notes.

---

## 2. User Personas & Core User Stories

### 2.1 Primary Persona
- **Name:** David / Malaysian Prospective EV Buyer & Family Financial Manager
- **Context:** Standing in a car showroom, evaluating whether to replace a family petrol car (e.g., father's monthly RM 210 petrol spend @ RM 1.99/L) with an EV.
- **Goal:** Quickly verify if buying the EV saves money, calculate the payback, understand the TNB bill change, and share the report with family.

### 2.2 Core User Stories
1. **Showroom Quick Calc:** As a car buyer in a showroom, I want to input only the vehicle's official consumption (`kWh/100 km`) and see my family's exact net monthly savings in RM instantly.
2. **Charging Scenario Switch:** As a user, I want to toggle between `[90% Home + 10% Public DC]` (realistic long-distance use) and `[100% Home AC]` (maximum economy) to see how public chargers affect the bottom line.
3. **Multi-Car Comparison:** As a shopper comparing two cars (e.g., Proton e.MAS 7 vs. BYD Atto 3), I want to see a side-by-side diff of their power, battery, 100km cost, monthly TNB increment, and 5-year total TCO savings.
4. **2026 Road Tax Clarity:** As a buyer concerned about the 2026 EV road tax exemption ending, I want to see my vehicle's official JPJ kW-based annual tax vs. a petrol car's cc-based tax.
5. **600 kWh Cliff Education:** As a homeowner, I want to understand why my electricity bill jumps when passing 600 kWh, and how scheduling night charging (ToU) helps.
6. **Bilingual Support:** As a Malaysian user, I want to switch effortlessly between **English** and **Simplified Chinese**.
7. **Report Sharing:** As a decision maker, I want to copy a clean text summary or launch WhatsApp directly with pre-filled figures.

---

## 3. Mathematical Models & Calculation Engine

### 3.1 TNB 2025/2026 Restructured Domestic Tariff Schedule

The electricity calculation implements the official Peninsular Malaysia TNB Residential Tariff model.

#### A. Base Generation, Capacity & Network Rates
The base tariff per kWh is composed of three components:
- **Generation:** `27.03 sen / kWh` (escalates to `37.03 sen / kWh` if monthly total $> 1,500\text{ kWh}$)
- **Capacity:** `4.55 sen / kWh`
- **Network:** `12.85 sen / kWh`
$$\text{Base Tariff Rate} = 0.2703 + 0.0455 + 0.1285 = \text{RM } 0.4443\text{ / kWh}$$

$$\text{Base Energy Subtotal} = \text{Total kWh} \times \text{Base Tariff Rate}$$

#### B. Energy Efficiency Incentive (EEI) Rebate Schedule
TNB applies a progressive rebate rate (in `sen/kWh`) across the **entire monthly consumption** based on which bracket the total consumption falls into:

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
   - $> 600\text{ kWh}$: $\text{Total kWh} \times (\text{AFA Rate} / 100)$ (Default rate = $+3.80\text{ sen/kWh} = \text{RM } 0.038/\text{kWh}$)
3. **KWTBB (Kumpulan Wang Tenaga Boleh Baharu — Renewable Energy Fund):**
   - $\le 300\text{ kWh}$: **RM 0.00**
   - $> 300\text{ kWh}$: $1.6\% \times \text{Net Base Energy}$
4. **Service Tax (SST):**
   - $\le 600\text{ kWh}$: **RM 0.00**
   - $> 600\text{ kWh}$: $8\%$ applied only to the electricity portion of units exceeding $600\text{ kWh}$:
     $$\text{Effective Rate for Excess} = (\text{Base Rate} - \text{EEI Rebate}) + \text{AFA Rate}$$
     $$\text{SST} = (\text{Total kWh} - 600) \times \text{Effective Rate for Excess} \times 0.08$$

#### D. Total TNB Bill & Benchmark Calibration
$$\text{Total Bill} = \text{Round}(\text{Net Base Energy} + \text{Retail Charge} + \text{AFA Surcharge} + \text{KWTBB} + \text{SST}, 2)$$

> **Gold Standard Calibration Benchmark:**
> - Household with **501 kWh** baseline:
>   - Base Energy = $501 \times 0.4443 = \text{RM } 222.59$
>   - EEI Rebate ($10.5\text{ sen}$) = $501 \times 0.105 = \text{RM } 52.61$
>   - Net Base Energy = $222.59 - 52.61 = \text{RM } 169.98$
>   - Retail Charge = $\text{RM } 0.00$ ($\le 600\text{ kWh}$)
>   - AFA Surcharge = $\text{RM } 0.00$ ($\le 600\text{ kWh}$)
>   - KWTBB ($1.6\%$) = $169.98 \times 0.016 = \text{RM } 2.72$
>   - SST = $\text{RM } 0.00$ ($\le 600\text{ kWh}$)
>   - **Total Payable = RM 172.70** (Exact match with real utility bill).

---

### 3.2 EV Energy Consumption & Marginal Charging Cost Model

#### A. Charging Loss & Net-to-Gross Energy
Charging an EV via home AC wallbox incurs an estimated **10% electrical loss** (efficiency $\eta = 0.90$):
$$\text{Gross Home Energy Consumption} = \frac{\text{Rated Consumption (kWh/100km)}}{\eta} = \frac{\text{kWh/100km}}{0.90} \approx \text{kWh/100km} \times 1.10$$

$$\text{Monthly Total EV Gross Energy} = \frac{\text{Monthly Mileage (km)}}{100} \times \text{Gross Consumption}$$

#### B. Charging Mode Split
The calculator supports two modes:
1. **Mixed Mode (`mixed`, Default):**
   - $90\%$ of energy charged at Home AC.
   - $10\%$ of energy charged at Commercial Public DC Fast Chargers (e.g. Gentari / ChargEV / JomCharge @ default `RM 1.40 / kWh`).
2. **Home Only Mode (`home_only`):**
   - $100\%$ of energy charged at Home AC.
   - $0\%$ Public DC expense.

$$\text{Home EV kWh} = \text{Monthly Gross Energy} \times \text{Home Ratio}$$
$$\text{Public EV kWh} = \text{Monthly Gross Energy} \times (1 - \text{Home Ratio})$$
$$\text{Public Charging Cost (RM)} = \text{Public EV kWh} \times \text{Public DC Price Per kWh}$$

#### C. True Marginal Electricity Calculation (Zero Double Counting)
To eliminate double counting, EV home electricity cost is strictly computed as the **marginal difference** between the combined bill and the baseline bill:
$$\text{Combined Household kWh} = \text{Baseline Home kWh} + \text{Home EV kWh}$$
$$\text{New Combined Bill} = \text{calculateTnbBill}(\text{Combined Household kWh})$$
$$\text{Baseline Bill} = \text{calculateTnbBill}(\text{Baseline Home kWh})$$
$$\text{Marginal Home Electricity Cost} = \text{New Combined Bill} - \text{Baseline Bill}$$
$$\text{Total EV Charging Expense} = \text{Marginal Home Electricity Cost} + \text{Public Charging Cost}$$

$$\text{Marginal Effective Rate per kWh} = \frac{\text{Marginal Home Electricity Cost}}{\text{Home EV kWh}}$$

$$\text{Single Full Charge Cost (Home)} = \text{Battery Capacity (kWh)} \times \frac{\text{Marginal Effective Rate}}{\eta}$$

---

### 3.3 Petrol Baseline & Financial Verdict Model

#### A. Petrol Car Equivalence
- **Default Petrol Price:** `RM 1.99 / L` (RON95 subsidized benchmark) or `RM 2.05 / L`
- **Default Fuel Economy:** `14.0 km / L` ($\approx 7.14\text{ L / 100km}$)
- **Default Monthly Petrol Spend:** `RM 210.00`

$$\text{Monthly Petrol Litres} = \frac{\text{Father Petrol Cost (RM)}}{\text{Petrol Price Per Litre}}$$
$$\text{Petrol Equivalent Distance (km)} = \text{Monthly Petrol Litres} \times \text{Fuel Economy (km/L)}$$
$$\text{Petrol Cost Per 100km} = \left(\frac{100}{\text{Fuel Economy}}\right) \times \text{Petrol Price}$$

#### B. EV Cost Per 100km (Blended)
$$\text{EV Cost Per 100km} = \frac{\text{Total EV Charging Expense}}{\text{Monthly Mileage}} \times 100$$
$$\text{Savings Ratio Per km (\%)} = \text{Round}\left(\left(1 - \frac{\text{EV Cost Per 100km}}{\text{Petrol Cost Per 100km}}\right) \times 100\right)$$

#### C. Net Financial Balance
$$\text{Old Total Monthly Energy Expense} = \text{Baseline Home Bill} + \text{Father Petrol Cost}$$
$$\text{New Total Monthly Energy Expense} = \text{New Combined Bill} + \text{Public Charging Cost}$$
$$\text{Monthly Net Savings} = \text{Old Total} - \text{New Total} = \text{Father Petrol Cost} - \text{Marginal Home Cost} - \text{Public Charging Cost}$$

$$\text{1-Year Net Savings} = \text{Monthly Net Savings} \times 12$$
$$\text{5-Year Net Energy Savings} = \text{Monthly Net Savings} \times 60$$

---

### 3.4 Official 2026 Malaysia JPJ EV Road Tax Schedule

Effective **1 January 2026**, Malaysia adopts an electric motor output power-based (`kW`) road tax framework gazetted by the Ministry of Transport (MOT):

| Motor Power Output Bracket ($\text{kW}$) | Base Road Tax ($\text{RM}$) | Incremental Rate ($\text{RM}$) | Representative Models |
| :--- | :--- | :--- | :--- |
| $\le 50.0\text{ kW}$ | $\text{RM } 20.00\text{ flat}$ | — | Micro EVs / Urban Pods |
| $50.1 - 100.0\text{ kW}$ | $\text{RM } 20.00$ | $+\text{RM } 10\text{ per } 10\text{ kW block}$ | Neta V ($70\text{ kW} \rightarrow \text{RM } 40$) |
| $100.1 - 210.0\text{ kW}$ | $\text{RM } 80.00$ | $+\text{RM } 20\text{ per } 10\text{ kW block}$ | BYD Dolphin/Atto 3 ($150\text{ kW} \rightarrow \text{RM } 160$)<br>Proton e.MAS 7 ($160\text{ kW} \rightarrow \text{RM } 180$)<br>Tesla Model 3 RWD ($208\text{ kW} \rightarrow \text{RM } 280$) |
| $210.1 - 310.0\text{ kW}$ | $\text{RM } 305.00$ | $+\text{RM } 30\text{ per } 10\text{ kW block}$ | Dual-Motor Mid-range |
| $310.1 - 410.0\text{ kW}$ | $\text{RM } 615.00$ | $+\text{RM } 50\text{ per } 10\text{ kW block}$ | BYD Seal Performance ($390\text{ kW} \rightarrow \text{RM } 1,015$) |
| $410.1 - 510.0\text{ kW}$ | $\text{RM } 1,140.00$ | $+\text{RM } 100\text{ per } 10\text{ kW block}$ | Performance EVs |
| $> 510.0\text{ kW}$ | $\text{RM } 2,160.00$ | $+\text{RM } 200\text{ per } 10\text{ kW block}$ | Hyper EVs (Porsche Taycan Turbo S) |

#### A. Petrol ICE Road Tax Baseline (Peninsular Malaysia Private Saloon)
- $\le 1,000\text{ cc}$: $\text{RM } 20.00$
- $1,001 - 1,200\text{ cc}$: $\text{RM } 55.00$
- $1,201 - 1,400\text{ cc}$: $\text{RM } 70.00$
- $1,401 - 1,600\text{ cc}$ (Standard 1.5L): $\text{RM } 90.00$
- $1,601 - 1,800\text{ cc}$ (1.8L): $\text{RM } 200.00 + \text{RM } 0.40/\text{cc above } 1600 = \text{RM } 280.00$
- $1,801 - 2,000\text{ cc}$ (2.0L): $\text{RM } 280.00 + \text{RM } 0.50/\text{cc above } 1800 = \text{RM } 380.00$
- $2,001 - 2,500\text{ cc}$ (2.5L): $\text{RM } 380.00 + \text{RM } 1.00/\text{cc above } 2000 = \text{RM } 880.00$

#### B. 5-Year Total Cost of Ownership (TCO) Delta
$$\text{Annual Road Tax Difference} = \text{Petrol Road Tax} - \text{EV Road Tax}$$
$$\text{5-Year TCO Savings (incl. Road Tax)} = \text{5-Year Net Energy Savings} + (5 \times \text{Annual Road Tax Difference})$$

---

## 4. Feature Matrix & Functional Specifications

```
+-----------------------------------------------------------------------------------+
|                                 APPLICATION MAP                                    |
+-----------------------------------------------------------------------------------+
|  [Navbar] Brand, Language Toggle (EN/ZH), Theme Toggle (Dark/Light), Settings, Share |
|                                                                                   |
|  [Section 1: Showroom Cockpit]                                                    |
|  - Large numeric consumption input (kWh/100km) with +/- 0.5 step controls         |
|  - Vehicle name field + Save Vehicle to local memory                              |
|  - Preset vehicle pills carousel (Proton e.MAS 7, BYD Atto 3, Tesla Model 3, etc)|
|  - Charging scenario toggle (90/10 Mixed vs. 100% Home)                           |
|  - Tri-grid baseline inputs: Monthly Mileage, Home Bill (501 kWh), Petrol (RM 210)|
|                                                                                   |
|  [Section 2: Financial Verdict Hero]                                              |
|  - Master headline: Monthly net savings in large display typography               |
|  - 1-Year and 5-Year cumulative net savings                                       |
|  - Step-by-step arithmetic waterfall breakdown                                    |
|  - Side-by-side card comparison: Current Monthly Spend vs. New Monthly Spend      |
|                                                                                   |
|  [Section 3: Multi-Car Side-by-Side Comparator]                                   |
|  - Car A (Current test-drive model) vs. Car B (Alternative model selector)        |
|  - Power (kW), Battery (kWh), 100km Cost, TNB Increment, Monthly & 5-Yr Savings   |
|  - Dynamic Winner Tag (e.g. "Car A saves RM 1,420 more over 5 years")             |
|                                                                                   |
|  [Section 4: Cost per 100 km & Route Matrix]                                      |
|  - Horizontal relative cost visualizer bar (EV vs. Petrol)                        |
|  - Single full battery charge cost badge (Home marginal vs. Public DC)            |
|  - Route cost table: Daily Commute (50km), JB-KL (330km), KL-Penang (350km)       |
|                                                                                   |
|  [Section 5: 2026 Official JPJ EV Road Tax]                                       |
|  - EV Road Tax (kW-based) vs. Petrol Road Tax (cc-based)                          |
|  - Quick CC selector (1500cc, 1800cc, 2000cc)                                     |
|  - 5-Year Road Tax delta badge integrated into TCO                                |
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
|  - Share Report Modal: Pre-formatted text preview, Copy to Clipboard, WhatsApp    |
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

## 6. Data Architecture & TypeScript Contracts

```typescript
export interface UserInputs {
  modelName: string;
  consumptionKwhPer100Km: number;
  motorPowerKw: number;
  monthlyMileageKm: number;
  baselineHomeKwh: number;
  baselineHomeBillRm: number;
  fatherPetrolCostRm: number;
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

## 7. Numerical Verification & Acceptance Test Cases

To verify that any new frontend implementation maintains 100% computational integrity, test against these exact scenarios:

### Test Case 1: Baseline Vehicle (Proton e.MAS 7 @ Default Inputs)
- **Inputs:**
  - Consumption: `14.5 kWh/100km`
  - Motor Power: `160 kW`
  - Mileage: `1,477 km` (aligned to RM 210 petrol)
  - Baseline Household: `501 kWh`
  - Father Petrol: `RM 210.00`
  - Charging Mode: `mixed` (90% Home / 10% Public DC)
- **Expected Results:**
  - Baseline TNB Bill: **RM 172.70** (Exact gold standard)
  - Monthly Gross EV Energy: `237.96 kWh` (Home: `214.17 kWh`, Public: `23.80 kWh`)
  - New Combined Household kWh: `715.17 kWh`
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

### Test Case 2: 100% Home Charging Mode (`home_only`)
- **Inputs:** Same as Test Case 1, but toggle to `100% Home Only`.
- **Expected Results:**
  - Home EV kWh: `237.96 kWh`
  - Public EV kWh: `0.00 kWh`
  - Public DC Cost: `RM 0.00`
  - New Combined Household kWh: `738.96 kWh`
  - New Combined TNB Bill: **RM 348.06**
  - Marginal Home Electricity Cost: **RM 175.36**
  - **Monthly Net Savings:** **+RM 34.64**
  - **1-Year Net Savings:** **+RM 415.68**
  - **5-Year Cumulative TCO Savings (incl. Road Tax):** **+RM 1,628.40**

---

## 8. Internationalization (i18n) & Sharing Protocols

1. **Languages Supported:** English (`en`) and Simplified Chinese (`zh-CN`).
2. **Persistence:** Language selection and theme preference stored in browser `localStorage`.
3. **Sharing Format:** Plain-text formatted string compatible with WhatsApp Markdown (`*bold*`, `• bullets`, `[brackets]`), omitting external emoji dependencies for a clean, executive look.
4. **Offline Capability:** Entire app must execute 100% clientside without requiring internet connectivity or external APIs.
