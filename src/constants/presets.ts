import { UserInputs } from '../types/calculator';

export const DEFAULT_USER_INPUTS: UserInputs = {
  modelName: '',
  consumptionKwhPer100Km: 14.5,
  monthlyMileageKm: 1500,
  baselineHomeBillRm: 200,
  fatherPetrolCostRm: 210,

  // Advanced defaults based on 2026 Malaysia context
  petrolPricePerLiter: 2.05, // RON 95 subsidized
  petrolFuelEfficiencyKmPerL: 14.0, // Typical Perodua Myvi / Alza / Axia mixed driving ~7.1 L/100km
  chargingEfficiency: 0.90, // 10% AC 7kW/11kW wallbox charging conversion & cooling loss
  homeChargingRatio: 0.90, // 90% overnight at home, 10% public DC on highway/mall
  publicDcPricePerKwh: 1.40, // Average Gentari / JomCharge / ChargeEV DC fast rate
  afaRateSen: 3.80, // August 2026 Energy Commission AFA Surcharge (+3.80 sen / kWh)
  isTouEnabled: false, // Time of Use (requires TNB Smart Meter)
  touOffPeakRateSen: 28.00, // Off-peak discount rate
  batteryCapacityKwh: 60,
};
