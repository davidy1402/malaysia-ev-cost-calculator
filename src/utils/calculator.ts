// 13-tier TNB domestic tariff block spec
const TNB_TIERS = [
  { min: 0, max: 200, rate: 0.218 },
  { min: 200, max: 300, rate: 0.334 },
  { min: 300, max: 600, rate: 0.516 },
  { min: 600, max: 900, rate: 0.546 },
  { min: 900, max: Infinity, rate: 0.571 },
];

export interface TnbBillResult {
  baseBill: number;
  sst: number;
  kwtbb: number;
  totalRm: number;
}

export function calculateTnbBill(kwh: number, hasAfa = false): TnbBillResult {
  let baseBill = 0;
  for (const tier of TNB_TIERS) {
    if (kwh > tier.min) {
      const chargeable = Math.min(kwh - tier.min, tier.max - tier.min);
      baseBill += chargeable * tier.rate;
    }
  }

  // ICPT / AFA surcharge applies if > 600 kWh
  if (kwh > 600 && hasAfa) {
     // AFA rate depends on current policy, assumed fixed or user-provided
  }

  // 8% SST applies to usage > 600 kWh only
  let sst = 0;
  if (kwh > 600) {
      let sstBase = 0;
      for (const tier of TNB_TIERS.filter(t => t.min >= 600)) {
         if (kwh > tier.min) {
           const chargeable = Math.min(kwh - tier.min, tier.max - tier.min);
           sstBase += chargeable * tier.rate;
         }
      }
      sst = sstBase * 0.08;
  }

  // KWTBB (1.6% fund)
  const kwtbb = baseBill * 0.016;

  return {
    baseBill,
    sst,
    kwtbb,
    totalRm: baseBill + sst + kwtbb
  };
}

export interface EvCalculationResult {
  baselineBill: number;
  combinedBill: number;
  marginalCost: number;
  publicCost: number;
  monthlyNetSavings: number;
}

export function calculateEv(
  consumption: number, 
  mileage: number, 
  baselineKwh: number, 
  petrolRm: number, 
  mode: 'mixed' | 'home',
  chargingLoss: number = 0.1,
  publicDcRate: number = 1.4
): EvCalculationResult {
  
  // Total EV energy required with loss
  const totalEvKwh = (mileage / 100) * consumption * (1 + chargingLoss);
  
  // Split home vs public
  let homeKwh = totalEvKwh;
  let publicKwh = 0;
  
  if (mode === 'mixed') {
    homeKwh = totalEvKwh * 0.9;
    publicKwh = totalEvKwh * 0.1;
  }

  const baselineRes = calculateTnbBill(baselineKwh);
  const combinedRes = calculateTnbBill(baselineKwh + homeKwh);

  const marginalCost = combinedRes.totalRm - baselineRes.totalRm;
  const publicCost = publicKwh * publicDcRate;

  const totalEvCharging = marginalCost + publicCost;
  const monthlyNetSavings = petrolRm - totalEvCharging;

  return {
    baselineBill: baselineRes.totalRm,
    combinedBill: combinedRes.totalRm,
    marginalCost,
    publicCost,
    monthlyNetSavings
  };
}