import { TnbBillBreakdown, UserInputs, EvCalculationResult } from '../types/calculator';

/**
 * Calculates the Malaysian TNB Residential (Domestic) Bill based on the 2025/2026 restructured tariff.
 * 
 * Tariff Structure:
 * - Generation: 27.03 sen/kWh (<=1,500 kWh), 37.03 sen/kWh (>1,500 kWh)
 * - Capacity: 4.55 sen/kWh
 * - Network: 12.85 sen/kWh
 * - Base rate for <=1,500 kWh = 44.43 sen/kWh (RM 0.4443/kWh)
 * - Retail Charge: RM 10.00 (WAIVED if <= 600 kWh)
 * - AFA (Automatic Fuel Adjustment): e.g. +3.80 sen/kWh (WAIVED if <= 600 kWh)
 * - KWTBB (Renewable Energy Fund): 1.6% on base charges for units exceeding 300 kWh
 * - SST: 8% on electricity charges for units exceeding 600 kWh
 */
export function calculateTnbBill(
  kwh: number,
  options?: {
    afaRateSen?: number;
    isTouEnabled?: boolean;
    touOffPeakRateSen?: number;
    touOffPeakRatio?: number; // e.g. 0.70 of EV charging happens off-peak
  }
): TnbBillBreakdown {
  const safeKwh = Math.max(0, kwh);
  const afaRateSen = options?.afaRateSen ?? 3.80;
  const isTou = options?.isTouEnabled ?? false;
  const touOffPeakRate = (options?.touOffPeakRateSen ?? 28.00) / 100; // RM/kWh

  // 1. Generation Charge
  let baseGeneration = 0;
  if (safeKwh <= 1500) {
    baseGeneration = safeKwh * 0.2703;
  } else {
    baseGeneration = (1500 * 0.2703) + ((safeKwh - 1500) * 0.3703);
  }

  // 2. Capacity Charge
  const baseCapacity = safeKwh * 0.0455;

  // 3. Network Charge
  const baseNetwork = safeKwh * 0.1285;

  // Base Energy Subtotal
  let baseEnergySubtotal = baseGeneration + baseCapacity + baseNetwork;

  // If ToU is enabled, apply off-peak rate discount to a portion of usage
  if (isTou && touOffPeakRate > 0) {
    const offPeakKwh = safeKwh * (options?.touOffPeakRatio ?? 0.50);
    const standardPeakKwh = safeKwh - offPeakKwh;
    baseEnergySubtotal = (standardPeakKwh * 0.4443) + (offPeakKwh * touOffPeakRate);
  }

  // 4. Retail Charge (RM 10.00 / month) -> 100% WAIVED if <= 600 kWh
  const isOver600 = safeKwh > 600;
  const isOver1500 = safeKwh > 1500;
  const isRetailChargeWaived = !isOver600;
  const retailCharge = isOver600 ? 10.00 : 0.00;

  // 5. AFA (Automatic Fuel Adjustment) -> 100% WAIVED if <= 600 kWh
  const isAfaWaived = !isOver600;
  const afaSurcharge = isOver600 ? (safeKwh * (afaRateSen / 100)) : 0.00;

  // 6. KWTBB (1.6% of base charges for consumption > 300 kWh)
  let kwtbbFund = 0;
  if (safeKwh > 300) {
    const kwhAbove300 = safeKwh - 300;
    const baseRatePerKwh = safeKwh > 0 ? (baseEnergySubtotal / safeKwh) : 0.4443;
    const taxableBase = kwhAbove300 * baseRatePerKwh;
    kwtbbFund = taxableBase * 0.016;
  }

  // 7. SST (8% on electricity charges for consumption > 600 kWh)
  let sstTax = 0;
  if (isOver600) {
    const kwhAbove600 = safeKwh - 600;
    const baseRatePerKwh = safeKwh > 0 ? (baseEnergySubtotal / safeKwh) : 0.4443;
    const taxableBase = (kwhAbove600 * baseRatePerKwh) + (kwhAbove600 * (afaRateSen / 100));
    sstTax = taxableBase * 0.08;
  }

  const totalAmount = baseEnergySubtotal + retailCharge + afaSurcharge + kwtbbFund + sstTax;
  const effectiveRatePerKwh = safeKwh > 0 ? (totalAmount / safeKwh) : 0.4443;

  return {
    kwh: Math.round(safeKwh * 10) / 10,
    baseGeneration: Math.round(baseGeneration * 100) / 100,
    baseCapacity: Math.round(baseCapacity * 100) / 100,
    baseNetwork: Math.round(baseNetwork * 100) / 100,
    baseEnergySubtotal: Math.round(baseEnergySubtotal * 100) / 100,
    retailCharge,
    isRetailChargeWaived,
    afaSurcharge: Math.round(afaSurcharge * 100) / 100,
    isAfaWaived,
    kwtbbFund: Math.round(kwtbbFund * 100) / 100,
    sstTax: Math.round(sstTax * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    isOver600Threshold: isOver600,
    isOver1500Threshold: isOver1500,
    effectiveRatePerKwh: Math.round(effectiveRatePerKwh * 10000) / 10000
  };
}

/**
 * Inverse estimator: calculates the estimated monthly kWh from a given TNB RM bill amount.
 * Uses binary search over monotonically increasing bill function.
 */
export function estimateKwhFromBillAmount(
  targetRm: number,
  options?: { afaRateSen?: number }
): number {
  if (targetRm <= 0) return 0;
  
  let low = 0;
  let high = 5000;
  let iterations = 0;

  while (low <= high && iterations < 50) {
    const mid = (low + high) / 2;
    const calculated = calculateTnbBill(mid, options).totalAmount;
    
    if (Math.abs(calculated - targetRm) < 0.01) {
      return Math.round(mid * 10) / 10;
    }
    
    if (calculated < targetRm) {
      low = mid;
    } else {
      high = mid;
    }
    iterations++;
  }

  return Math.round(((low + high) / 2) * 10) / 10;
}

/**
 * Performs full end-to-end calculation for EV consumption, new TNB bill, petrol comparison, and savings.
 */
export function calculateAllEvMetrics(inputs: UserInputs): EvCalculationResult {
  const {
    consumptionKwhPer100Km,
    monthlyMileageKm,
    baselineHomeBillRm,
    fatherPetrolCostRm,
    petrolPricePerLiter,
    petrolFuelEfficiencyKmPerL,
    chargingEfficiency,
    homeChargingRatio,
    publicDcPricePerKwh,
    afaRateSen,
    isTouEnabled,
    touOffPeakRateSen
  } = inputs;

  // 1. Baseline Home Consumption
  const baselineKwh = estimateKwhFromBillAmount(baselineHomeBillRm, { afaRateSen });
  const baselineBill = calculateTnbBill(baselineKwh, { afaRateSen });

  // 2. EV Energy Computations
  // Net energy consumed by wheels/battery
  const evMonthlyNetKwh = (monthlyMileageKm / 100) * consumptionKwhPer100Km;
  
  // Gross energy pulled from wall (with charging AC conversion loss)
  const eff = Math.max(0.5, Math.min(1.0, chargingEfficiency));
  const evMonthlyGrossKwh = evMonthlyNetKwh / eff;

  // Split between home overnight charging and public DC fast charging
  const homeRatio = Math.max(0, Math.min(1.0, homeChargingRatio));
  const evHomeChargingKwh = evMonthlyGrossKwh * homeRatio;
  const evPublicChargingKwh = evMonthlyGrossKwh * (1.0 - homeRatio);

  // 3. New Combined Home Bill (Baseline + EV Home Charging)
  const combinedTotalKwh = baselineKwh + evHomeChargingKwh;
  const newCombinedBill = calculateTnbBill(combinedTotalKwh, {
    afaRateSen,
    isTouEnabled,
    touOffPeakRateSen,
    touOffPeakRatio: 0.85 // assuming majority of EV charging is scheduled at night
  });

  // Marginal electricity cost specifically due to charging EV at home
  const marginalHomeElectricityCost = Math.max(0, newCombinedBill.totalAmount - baselineBill.totalAmount);
  
  // Public DC charging cost
  const publicChargingCost = evPublicChargingKwh * publicDcPricePerKwh;
  const totalEvChargingCost = marginalHomeElectricityCost + publicChargingCost;

  // 4. Petrol Equivalent Calculations
  // Petrol consumed under current budget
  const petrolLiters = fatherPetrolCostRm > 0 && petrolPricePerLiter > 0 ? (fatherPetrolCostRm / petrolPricePerLiter) : 0;
  const petrolEquivalentDistanceKm = petrolLiters * petrolFuelEfficiencyKmPerL;
  const petrolCostPer100Km = (100 / Math.max(1, petrolFuelEfficiencyKmPerL)) * petrolPricePerLiter;

  // 5. Total Energy Expense Comparison
  // Status Quo: Baseline TNB Bill + Father's Petrol
  const oldTotalMonthlyEnergyExpense = baselineBill.totalAmount + fatherPetrolCostRm;
  
  // New Scenario: New Combined TNB Bill + Public EV Charging
  const newTotalMonthlyEnergyExpense = newCombinedBill.totalAmount + publicChargingCost;

  const monthlyNetSavings = oldTotalMonthlyEnergyExpense - newTotalMonthlyEnergyExpense;
  const yearlyNetSavings = monthlyNetSavings * 12;
  const fiveYearNetSavings = yearlyNetSavings * 5;

  // Per 100km metrics
  const evCostPer100Km = monthlyMileageKm > 0 ? (totalEvChargingCost / monthlyMileageKm) * 100 : 0;
  const savingsRatioPerKm = petrolCostPer100Km > 0 ? Math.max(0, (petrolCostPer100Km - evCostPer100Km) / petrolCostPer100Km) * 100 : 0;

  // 6. Threshold Jump Detection (Was baseline <=600, but combined >600?)
  const crossed600Threshold = baselineKwh <= 600 && combinedTotalKwh > 600;
  
  // What would the bill be if the 600kWh waiver remained active?
  const hypotheticalWithoutPenalty = (combinedTotalKwh * 0.4443) + (combinedTotalKwh > 300 ? (combinedTotalKwh - 300) * 0.4443 * 0.016 : 0);
  const thresholdJumpPenaltyRm = crossed600Threshold ? Math.max(0, newCombinedBill.totalAmount - hypotheticalWithoutPenalty) : 0;

  return {
    monthlyDistanceKm: monthlyMileageKm,
    evMonthlyNetKwh: Math.round(evMonthlyNetKwh * 10) / 10,
    evMonthlyGrossKwh: Math.round(evMonthlyGrossKwh * 10) / 10,
    evHomeChargingKwh: Math.round(evHomeChargingKwh * 10) / 10,
    evPublicChargingKwh: Math.round(evPublicChargingKwh * 10) / 10,

    baselineBill,
    newCombinedBill,
    marginalHomeElectricityCost: Math.round(marginalHomeElectricityCost * 100) / 100,
    publicChargingCost: Math.round(publicChargingCost * 100) / 100,
    totalEvChargingCost: Math.round(totalEvChargingCost * 100) / 100,

    petrolEquivalentDistanceKm: Math.round(petrolEquivalentDistanceKm),
    petrolMonthlyCost: fatherPetrolCostRm,
    petrolCostPer100Km: Math.round(petrolCostPer100Km * 100) / 100,

    oldTotalMonthlyEnergyExpense: Math.round(oldTotalMonthlyEnergyExpense * 100) / 100,
    newTotalMonthlyEnergyExpense: Math.round(newTotalMonthlyEnergyExpense * 100) / 100,
    monthlyNetSavings: Math.round(monthlyNetSavings * 100) / 100,
    yearlyNetSavings: Math.round(yearlyNetSavings * 100) / 100,
    fiveYearNetSavings: Math.round(fiveYearNetSavings * 100) / 100,

    evCostPer100Km: Math.round(evCostPer100Km * 100) / 100,
    savingsRatioPerKm: Math.round(savingsRatioPerKm * 10) / 10,

    crossed600Threshold,
    thresholdJumpPenaltyRm: Math.round(thresholdJumpPenaltyRm * 100) / 100
  };
}
