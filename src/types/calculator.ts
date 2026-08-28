export interface SavedVehicle {
  id: string;
  name: string;
  consumptionKwhPer100Km: number;
  savedAt: number;
}

export interface UserInputs {
  modelName: string;
  consumptionKwhPer100Km: number;
  monthlyMileageKm: number;
  baselineHomeBillRm: number;
  fatherPetrolCostRm: number;
  
  // Advanced parameters
  petrolPricePerLiter: number;
  petrolFuelEfficiencyKmPerL: number;
  chargingEfficiency: number; // e.g. 0.90 for 10% AC charging loss
  homeChargingRatio: number; // e.g. 0.90 for 90% home, 10% public DC
  publicDcPricePerKwh: number; // RM 1.40 / kWh
  afaRateSen: number; // e.g. 3.80 sen / kWh
  isTouEnabled: boolean; // Time of Use off-peak charging
  touOffPeakRateSen: number; // e.g. 28.00 sen / kWh
  batteryCapacityKwh: number;
}

export interface TnbBillBreakdown {
  kwh: number;
  baseGeneration: number;
  baseCapacity: number;
  baseNetwork: number;
  baseEnergySubtotal: number;
  retailCharge: number;
  isRetailChargeWaived: boolean;
  afaSurcharge: number;
  isAfaWaived: boolean;
  kwtbbFund: number; // 1.6% above 300 kWh
  sstTax: number; // 8% above 600 kWh
  totalAmount: number;
  isOver600Threshold: boolean;
  isOver1500Threshold: boolean;
  effectiveRatePerKwh: number;
}

export interface EvCalculationResult {
  // Energy consumption
  monthlyDistanceKm: number;
  evMonthlyNetKwh: number; // at wheels/battery
  evMonthlyGrossKwh: number; // from wall including charging loss
  evHomeChargingKwh: number;
  evPublicChargingKwh: number;

  // Bill breakdowns
  baselineBill: TnbBillBreakdown;
  newCombinedBill: TnbBillBreakdown;
  marginalHomeElectricityCost: number; // newCombinedBill.total - baselineBill.total
  publicChargingCost: number;
  totalEvChargingCost: number; // marginalHomeElectricityCost + publicChargingCost

  // Petrol comparison
  petrolEquivalentDistanceKm: number;
  petrolMonthlyCost: number;
  petrolCostPer100Km: number;

  // Comparison metrics
  oldTotalMonthlyEnergyExpense: number; // baselineBill + petrol
  newTotalMonthlyEnergyExpense: number; // newCombinedBill + publicCharging
  monthlyNetSavings: number;
  yearlyNetSavings: number;
  fiveYearNetSavings: number;

  // Per 100km metrics
  evCostPer100Km: number;
  savingsRatioPerKm: number; // percentage cheaper than petrol

  // Threshold alerts
  crossed600Threshold: boolean;
  thresholdJumpPenaltyRm: number; // additional cost caused solely by losing 600kWh waiver
}
