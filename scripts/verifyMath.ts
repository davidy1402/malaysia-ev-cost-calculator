/**
 * Mathematical Accuracy QA — run with: npx tsx scripts/verifyMath.ts
 */
import { calculateTnbBill, calculateAllEvMetrics } from '../src/utils/tnbTariff';
import type { UserInputs } from '../src/types/calculator';

let failures = 0;
function check(name: string, actual: number, expected: number, tolerance = 0.05) {
  const pass = Math.abs(actual - expected) <= tolerance;
  if (!pass) failures++;
  console.log(`${pass ? '✅' : '❌'} ${name}: actual=${actual.toFixed(2)} expected=${expected.toFixed(2)}`);
}

console.log('=== TEST 1: Baseline 450 kWh + EV 217.5 kWh net (241.67 gross @ 90% eff) ===');
// Baseline
const baseline = calculateTnbBill(450);
console.log('Baseline bill:', baseline.totalAmount.toFixed(2), '(expected RM 201.00 = 199.935 energy + 1.07 KWTBB)');
check('Baseline total (450 kWh incl. KWTBB)', baseline.totalAmount, 199.935 + 150 * 0.4443 * 0.016);
check('Baseline retail charge waived', baseline.retailCharge, 0);
check('Baseline AFA waived', baseline.afaSurcharge, 0);
check('Baseline SST waived', baseline.sstTax, 0);

// EV: 1500 km @ 14.5 kWh/100km = 217.5 kWh net, /0.90 = 241.67 gross, 90% home = 217.5 home, 24.17 public
const combined = calculateTnbBill(450 + 241.6667);
console.log('Combined 691.67 kWh bill:', combined.totalAmount.toFixed(2));
check('Combined crosses 600 threshold', combined.isOver600Threshold ? 1 : 0, 1);
check('Combined retail charge RM10', combined.retailCharge, 10);
check('Combined AFA applied (691.67 * 0.038)', combined.afaSurcharge, 691.6667 * 0.038);
check('Combined SST > 0', combined.sstTax > 0 ? 1 : 0, 1);
check('Combined KWTBB > 0', combined.kwtbbFund > 0 ? 1 : 0, 1);

console.log('\n=== Full comparison (Test 1 scenario) ===');
const result = calculateAllEvMetrics({
  modelName: 'QA Test EV',
  consumptionKwhPer100Km: 14.5,
  monthlyMileageKm: 1500,
  baselineHomeBillRm: 199.94,
  fatherPetrolCostRm: 210,
  petrolPricePerLiter: 2.05,
  petrolFuelEfficiencyKmPerL: 12,
  chargingEfficiency: 0.9,
  homeChargingRatio: 0.9,
  publicDcPricePerKwh: 1.4,
  afaRateSen: 3.8,
  isTouEnabled: false,
  touOffPeakRateSen: 28,
  batteryCapacityKwh: 60,
});
console.log(JSON.stringify({
  oldTotal: result.oldTotalMonthlyEnergyExpense,
  newTotal: result.newTotalMonthlyEnergyExpense,
  monthlySavings: result.monthlyNetSavings,
  evCostPer100Km: result.evCostPer100Km,
  petrolCostPer100Km: result.petrolCostPer100Km,
  crossed600: result.crossed600Threshold,
}, null, 2));
check('Old total = 199.94 + 210', result.oldTotalMonthlyEnergyExpense, 409.94);
check('Threshold crossing detected', result.crossed600Threshold ? 1 : 0, 1);
check('EV cheaper than petrol per 100km', result.evCostPer100Km < result.petrolCostPer100Km ? 1 : 0, 1);

console.log('\n=== TEST 2: Low usage below 600 kWh (waivers apply) ===');
const low = calculateTnbBill(300);
// 300 kWh: 300*0.4443 = 133.29, retail 0, AFA 0, KWTBB 0 (not >300), SST 0
check('300 kWh total', low.totalAmount, 133.29);
check('300 kWh no KWTBB', low.kwtbbFund, 0);
const mid = calculateTnbBill(500);
// 500 kWh: 500*0.4443 = 222.15 + KWTBB 1.6% on 200*0.4443=88.86*0.016=1.42
check('500 kWh total (KWTBB only)', mid.totalAmount, 222.15 + (200 * 0.4443 * 0.016));

console.log('\n=== TEST 3: Cost per 100 km marginal rate sanity ===');
// EV cost/100km = consumption * effective marginal rate / efficiency (+ public share)
console.log('EV per 100km:', result.evCostPer100Km, 'vs Petrol per 100km:', result.petrolCostPer100Km);
console.log('Savings ratio:', result.savingsRatioPerKm, '%');
check('Savings ratio between 0-100', (result.savingsRatioPerKm > 0 && result.savingsRatioPerKm < 100) ? 1 : 0, 1);

console.log(failures === 0 ? '\n🎉 ALL TESTS PASSED' : `\n💥 ${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
