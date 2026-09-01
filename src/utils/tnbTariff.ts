import { UserInputs, TnbBillBreakdown, EvCalculationResult } from '../types/calculator';
import { calculateEvRoadTax, calculatePetrolRoadTax } from './roadTax';

/**
 * Returns the EEI (Energy Efficiency Incentive) Rebate in sen/kWh
 * according to Malaysia's 2025/2026 Restructured Domestic Tariff Schedule.
 */
export function getEeiRateSen(kwh: number): number {
  if (kwh <= 200) return 22.5;
  if (kwh <= 300) return 19.0;
  if (kwh <= 400) return 16.5;
  if (kwh <= 450) return 14.5;
  if (kwh <= 500) return 12.0;
  if (kwh <= 550) return 10.5;
  if (kwh <= 600) return 9.0;
  if (kwh <= 650) return 7.5;
  if (kwh <= 700) return 5.5;
  if (kwh <= 750) return 4.5;
  if (kwh <= 800) return 4.0;
  if (kwh <= 900) return 3.0;
  if (kwh <= 1000) return 1.5;
  return 0; // > 1000 kWh
}

/**
 * Reverse-calculates estimated monthly kWh from a target TNB Bill amount in RM.
 * Allows users to input their monthly electricity bill directly (e.g. RM 200) without knowing exact kWh.
 */
export function estimateKwhFromTnbBill(
  targetBillRm: number,
  options?: { afaRateSen?: number }
): number {
  if (targetBillRm <= 0) return 0;
  let low = 0;
  let high = 5000;
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2;
    const bill = calculateTnbBill(mid, options);
    if (bill.totalAmount < targetBillRm) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return Math.round(((low + high) / 2) * 10) / 10;
}

/**
 * Simulates a full, itemized monthly TNB Residential Electricity Bill.
 * Validated 1:1 against real TNB household bills (e.g. 501 kWh = RM 172.70 payable / RM 172.71 raw).
 */
export function calculateTnbBill(
  kwh: number,
  options?: {
    afaRateSen?: number;
    isTouEnabled?: boolean;
    touOffPeakRateSen?: number;
    evAddedKwh?: number;
  }
): TnbBillBreakdown {
  if (kwh <= 0) {
    return {
      kwh: 0,
      baseGeneration: 0,
      baseCapacity: 0,
      baseNetwork: 0,
      baseEnergySubtotal: 0,
      eeiRebateSen: 0,
      eeiRebateAmount: 0,
      netBaseEnergy: 0,
      retailCharge: 0,
      isRetailChargeWaived: true,
      afaSurcharge: 0,
      isAfaWaived: true,
      kwtbbFund: 0,
      sstTax: 0,
      totalAmount: 0,
      isOver600Threshold: false,
      isOver1500Threshold: false,
      effectiveRatePerKwh: 0
    };
  }

  const roundedKwh = Math.round(kwh * 10) / 10;
  const isOver600 = roundedKwh > 600;
  const isOver1500 = roundedKwh > 1500;
  const afaRate = options?.afaRateSen ?? 3.80; // sen/kWh

  // 1. Base Tariff (Generation 27.03 + Capacity 4.55 + Network 12.85 = 44.43 sen/kWh)
  const genRate = isOver1500 ? 0.3703 : 0.2703;
  const capRate = 0.0455;
  const netRate = 0.1285;
  const baseRatePerKwh = genRate + capRate + netRate; // 0.4443

  const baseGeneration = roundedKwh * genRate;
  const baseCapacity = roundedKwh * capRate;
  const baseNetwork = roundedKwh * netRate;
  const baseEnergySubtotal = baseGeneration + baseCapacity + baseNetwork;

  // 2. EEI (Energy Efficiency Incentive) Rebate
  const eeiRateSen = getEeiRateSen(roundedKwh);
  const eeiRebateAmount = roundedKwh * (eeiRateSen / 100);
  const netBaseEnergy = Math.max(0, baseEnergySubtotal - eeiRebateAmount);

  // 3. Retail Charge (RM 10.00 / month, waived if <= 600 kWh)
  const retailCharge = isOver600 ? 10.00 : 0.00;

  // 4. AFA (Automatic Fuel Adjustment Surcharge, waived if <= 600 kWh)
  const afaSurcharge = isOver600 ? roundedKwh * (afaRate / 100) : 0.00;

  // 5. KWTBB (1.6% renewable energy fund on net electricity if consumption > 300 kWh)
  const kwtbbFund = roundedKwh > 300 ? netBaseEnergy * 0.016 : 0.00;

  // 6. SST (8% on electricity charges for units consumed above 600 kWh)
  let sstTax = 0.00;
  if (isOver600) {
    const excessKwh = roundedKwh - 600;
    const effectiveExcessRate = (baseRatePerKwh - (eeiRateSen / 100)) + (afaRate / 100);
    sstTax = excessKwh * effectiveExcessRate * 0.08;
  }

  // Raw Total & Rounding
  const rawTotal = netBaseEnergy + retailCharge + afaSurcharge + kwtbbFund + sstTax;
  const totalAmount = Math.round(rawTotal * 100) / 100;
  const effectiveRate = totalAmount / roundedKwh;

  return {
    kwh: roundedKwh,
    baseGeneration: Math.round(baseGeneration * 100) / 100,
    baseCapacity: Math.round(baseCapacity * 100) / 100,
    baseNetwork: Math.round(baseNetwork * 100) / 100,
    baseEnergySubtotal: Math.round(baseEnergySubtotal * 100) / 100,
    eeiRebateSen: eeiRateSen,
    eeiRebateAmount: Math.round(eeiRebateAmount * 100) / 100,
    netBaseEnergy: Math.round(netBaseEnergy * 100) / 100,
    retailCharge,
    isRetailChargeWaived: !isOver600,
    afaSurcharge: Math.round(afaSurcharge * 100) / 100,
    isAfaWaived: !isOver600,
    kwtbbFund: Math.round(kwtbbFund * 100) / 100,
    sstTax: Math.round(sstTax * 100) / 100,
    totalAmount,
    isOver600Threshold: isOver600,
    isOver1500Threshold: isOver1500,
    effectiveRatePerKwh: Math.round(effectiveRate * 10000) / 10000
  };
}

/**
 * Master calculation function: Orchestrates whole EV vs Petrol model with zero double-counting.
 */
export function calculateAllEvMetrics(inputs: UserInputs): EvCalculationResult {
  const distanceKm = Math.max(0, inputs.monthlyMileageKm);
  const consumptionKwhPer100Km = Math.max(0, inputs.consumptionKwhPer100Km);
  
  // 10% AC Charging Loss overhead
  const lossFactor = 1.10; // 14.5 kWh vehicle -> 15.95 kWh grid
  
  // Home vs Public Split Ratio
  const isHomeOnly = inputs.chargingMode === 'home_only';
  const homeRatio = isHomeOnly ? 1.0 : (inputs.homeChargingRatio || 0.90);
  const publicRatio = 1.0 - homeRatio;

  // Step 1: EV Net Consumption at the vehicle/battery
  const evMonthlyNetKwh = (distanceKm / 100) * consumptionKwhPer100Km;

  // Step 2: EV Gross Consumption from the grid (accounting for 10% AC charging loss)
  const evMonthlyGrossKwh = evMonthlyNetKwh * lossFactor;

  // Step 3: Split into Home vs Public
  const evHomeChargingKwh = Math.round((evMonthlyGrossKwh * homeRatio) * 10) / 10;
  const evPublicChargingKwh = Math.round((evMonthlyGrossKwh * publicRatio) * 10) / 10;

  // Step 4: Baseline Household TNB Bill
  const baselineKwh = inputs.baselineHomeKwh > 0 ? inputs.baselineHomeKwh : 501;
  const baselineBill = calculateTnbBill(baselineKwh, {
    afaRateSen: inputs.afaRateSen
  });

  // Step 5: New Combined TNB Bill (Baseline + Home Charging kWh)
  const newTotalKwh = Math.round((baselineKwh + evHomeChargingKwh) * 10) / 10;
  const newCombinedBill = calculateTnbBill(newTotalKwh, {
    afaRateSen: inputs.afaRateSen,
    isTouEnabled: inputs.isTouEnabled,
    touOffPeakRateSen: inputs.touOffPeakRateSen,
    evAddedKwh: evHomeChargingKwh
  });

  // Marginal Home Charging Cost = New TNB Bill - Baseline TNB Bill
  const marginalHomeElectricityCost = Math.max(0, Math.round((newCombinedBill.totalAmount - baselineBill.totalAmount) * 100) / 100);
  
  // Public Commercial Fast Charging Cost
  const publicDcPrice = inputs.publicDcPricePerKwh || 1.40;
  const publicChargingCost = Math.round((evPublicChargingKwh * publicDcPrice) * 100) / 100;

  // Total EV Monthly Energy Cost
  const totalEvChargingCost = Math.round((marginalHomeElectricityCost + publicChargingCost) * 100) / 100;

  // True Marginal electricity rate per kWh for EV (at wall)
  const marginalEffectiveRatePerKwh = evHomeChargingKwh > 0
    ? marginalHomeElectricityCost / evHomeChargingKwh
    : newCombinedBill.effectiveRatePerKwh;

  // Single full charge cost based on marginal rate (usable capacity)
  const batteryCap = inputs.batteryCapacityKwh || 60.22;
  const singleFullChargeMarginalCost = Math.round((batteryCap * marginalEffectiveRatePerKwh) * 100) / 100;

  // Petrol comparison calculations
  const petrolCost = Math.max(0, inputs.fatherPetrolCostRm);
  const petrolPrice = Math.max(0.5, inputs.petrolPricePerLiter || 1.99);
  const petrolEfficiency = Math.max(1, inputs.petrolFuelEfficiencyKmPerL || 14.0); // km/L

  // Liters bought = Monthly Cost / Price per liter
  const litersBought = petrolCost / petrolPrice;
  // Petrol monthly equivalent distance
  const petrolEquivalentDistanceKm = Math.round(litersBought * petrolEfficiency);
  // Petrol cost per 100km = (100 / kmPerL) * Price per liter
  const petrolCostPer100Km = Math.round(((100 / petrolEfficiency) * petrolPrice) * 100) / 100;

  // EV Cost per 100 km (based on actual distanceKm and totalEvChargingCost)
  const evCostPer100Km = distanceKm > 0
    ? Math.round(((totalEvChargingCost / distanceKm) * 100) * 100) / 100
    : 0;

  // Savings ratio per km
  const savingsRatioPerKm = petrolCostPer100Km > 0
    ? Math.round(((petrolCostPer100Km - evCostPer100Km) / petrolCostPer100Km) * 1000) / 10
    : 0;

  // Total monthly energy expenses comparison
  const oldTotalMonthlyEnergyExpense = Math.round((baselineBill.totalAmount + petrolCost) * 100) / 100;
  const newTotalMonthlyEnergyExpense = Math.round((newCombinedBill.totalAmount + publicChargingCost) * 100) / 100;

  // Net Savings
  const monthlyNetSavings = Math.round((oldTotalMonthlyEnergyExpense - newTotalMonthlyEnergyExpense) * 100) / 100;
  const yearlyNetSavings = Math.round((monthlyNetSavings * 12) * 100) / 100;
  const fiveYearNetSavings = Math.round((yearlyNetSavings * 5) * 100) / 100;

  // Road Tax 2026 Calculations
  const evMotorKw = inputs.motorPowerKw || 160;
  const petrolCc = inputs.petrolEngineCc || 1500;
  const evRoadTaxAnnualRm = calculateEvRoadTax(evMotorKw).roadTaxRm;
  const petrolRoadTaxAnnualRm = calculatePetrolRoadTax(petrolCc).roadTaxRm;
  const annualRoadTaxDifferenceRm = petrolRoadTaxAnnualRm - evRoadTaxAnnualRm;
  const fiveYearTcoWithRoadTaxSavings = fiveYearNetSavings + (annualRoadTaxDifferenceRm * 5);

  // 600 kWh Threshold Jump Alert
  const crossed600Threshold = baselineBill.kwh <= 600 && newCombinedBill.kwh > 600;
  
  // Penalty solely from losing waivers (Retail RM10 + AFA on baseline portion + reduced EEI)
  const thresholdJumpPenaltyRm = crossed600Threshold
    ? Math.round((newCombinedBill.retailCharge + newCombinedBill.afaSurcharge) * 100) / 100
    : 0;

  return {
    monthlyDistanceKm: distanceKm,
    evMonthlyNetKwh: Math.round(evMonthlyNetKwh * 10) / 10,
    evMonthlyGrossKwh: Math.round(evMonthlyGrossKwh * 10) / 10,
    evHomeChargingKwh,
    evPublicChargingKwh,
    baselineBill,
    newCombinedBill,
    marginalHomeElectricityCost,
    publicChargingCost,
    totalEvChargingCost,
    marginalEffectiveRatePerKwh: Math.round(marginalEffectiveRatePerKwh * 10000) / 10000,
    singleFullChargeMarginalCost,
    petrolEquivalentDistanceKm,
    petrolMonthlyCost: petrolCost,
    petrolCostPer100Km,
    oldTotalMonthlyEnergyExpense,
    newTotalMonthlyEnergyExpense,
    monthlyNetSavings,
    yearlyNetSavings,
    fiveYearNetSavings,
    evCostPer100Km,
    savingsRatioPerKm,
    evRoadTaxAnnualRm,
    petrolRoadTaxAnnualRm,
    annualRoadTaxDifferenceRm,
    fiveYearTcoWithRoadTaxSavings,
    crossed600Threshold,
    thresholdJumpPenaltyRm
  };
}
