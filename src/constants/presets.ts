import { VehiclePreset, UserInputs } from '../types/calculator';

export const POPULAR_EV_PRESETS: VehiclePreset[] = [
  {
    id: 'emas-7',
    name: 'Proton e.MAS 7',
    brand: 'Proton',
    consumptionKwhPer100Km: 14.5,
    batteryCapacityKwh: 60.22,
    motorPowerKw: 160,
    claimedRangeWltpKm: 410,
    priceEstimateRm: '~RM 108k - 120k',
    tag: 'Focus'
  },
  {
    id: 'emas-5',
    name: 'Proton e.MAS 5',
    brand: 'Proton',
    consumptionKwhPer100Km: 12.8,
    batteryCapacityKwh: 40.16,
    motorPowerKw: 85,
    claimedRangeWltpKm: 325,
    priceEstimateRm: '~RM 75k - 85k',
    tag: 'Value'
  },
  {
    id: 'zeekr-7x',
    name: 'Zeekr 7X (RWD)',
    brand: 'Zeekr',
    consumptionKwhPer100Km: 17.5,
    batteryCapacityKwh: 75.0,
    motorPowerKw: 310,
    claimedRangeWltpKm: 605,
    priceEstimateRm: '~RM 185k',
    tag: 'Performance'
  },
  {
    id: 'tesla-modely-rwd',
    name: 'Tesla Model Y (RWD)',
    brand: 'Tesla',
    consumptionKwhPer100Km: 15.7,
    batteryCapacityKwh: 60.0,
    motorPowerKw: 220,
    claimedRangeWltpKm: 455,
    priceEstimateRm: '~RM 199k',
    tag: 'Popular'
  },
  {
    id: 'byd-sealion7',
    name: 'BYD Sealion 7',
    brand: 'BYD',
    consumptionKwhPer100Km: 17.2,
    batteryCapacityKwh: 82.56,
    motorPowerKw: 230,
    claimedRangeWltpKm: 567,
    priceEstimateRm: '~RM 183k',
    tag: 'SUV'
  },
  {
    id: 'byd-atto3',
    name: 'BYD Atto 3',
    brand: 'BYD',
    consumptionKwhPer100Km: 16.0,
    batteryCapacityKwh: 60.48,
    motorPowerKw: 150,
    claimedRangeWltpKm: 420,
    priceEstimateRm: '~RM 149k - 167k',
    tag: 'SUV'
  },
  {
    id: 'byd-dolphin',
    name: 'BYD Dolphin (Premium)',
    brand: 'BYD',
    consumptionKwhPer100Km: 14.8,
    batteryCapacityKwh: 60.48,
    motorPowerKw: 150,
    claimedRangeWltpKm: 427,
    priceEstimateRm: '~RM 125k',
    tag: 'Urban'
  },
  {
    id: 'chery-omoda-e5',
    name: 'Chery Omoda E5',
    brand: 'Chery',
    consumptionKwhPer100Km: 15.5,
    batteryCapacityKwh: 61.06,
    motorPowerKw: 150,
    claimedRangeWltpKm: 430,
    priceEstimateRm: '~RM 146k',
    tag: 'Tech'
  },
  {
    id: 'byd-seal-rwd',
    name: 'BYD Seal (Dynamic)',
    brand: 'BYD',
    consumptionKwhPer100Km: 15.2,
    batteryCapacityKwh: 61.44,
    motorPowerKw: 150,
    claimedRangeWltpKm: 510,
    priceEstimateRm: '~RM 179k',
    tag: 'Sedan'
  },
  {
    id: 'tesla-model3-rwd',
    name: 'Tesla Model 3 (RWD)',
    brand: 'Tesla',
    consumptionKwhPer100Km: 13.2,
    batteryCapacityKwh: 60.0,
    motorPowerKw: 208,
    claimedRangeWltpKm: 513,
    priceEstimateRm: '~RM 189k',
    tag: 'Efficiency'
  },
  {
    id: 'smart-1-pro',
    name: 'Smart #1 (Pro)',
    brand: 'Smart',
    consumptionKwhPer100Km: 16.8,
    batteryCapacityKwh: 49.0,
    motorPowerKw: 200,
    claimedRangeWltpKm: 315,
    priceEstimateRm: '~RM 189k',
    tag: 'Compact'
  },
  {
    id: 'zeekr-x',
    name: 'Zeekr X',
    brand: 'Zeekr',
    consumptionKwhPer100Km: 16.5,
    batteryCapacityKwh: 66.0,
    motorPowerKw: 200,
    claimedRangeWltpKm: 440,
    priceEstimateRm: '~RM 180k',
    tag: 'Luxury'
  }
];

export const DEFAULT_USER_INPUTS: UserInputs = {
  modelName: 'Proton e.MAS 7',
  consumptionKwhPer100Km: 14.5,
  motorPowerKw: 160,
  monthlyMileageKm: 1477, // 对应爸爸每月 RM210 油费 @ RM1.99/L 的实际行驶里程 (14 km/L)
  baselineHomeKwh: 501, // 锚定 David 家最新真实 TNB 账单 (501 kWh = RM 172.70)
  baselineHomeBillRm: 172.70, // 真实账单金额
  fatherPetrolCostRm: 210, // 爸爸每月固定汽油支出 RM 210
  petrolEngineCc: 1500, // 默认 1.5L 自然吸气/涡轮

  // 充电模式: 'mixed' (90%家充+10%外充) vs 'home_only' (100%纯家充)
  chargingMode: 'mixed',

  petrolPricePerLiter: 1.99, // 设定基准油价 RM 1.99 / L
  petrolFuelEfficiencyKmPerL: 14.0, // 典型油车油耗 ~7.14 L/100km
  chargingEfficiency: 0.90, // 10% AC 充电与线损
  homeChargingRatio: 0.90, // 90% 家充 / 10% 商业快充
  publicDcPricePerKwh: 1.40, // 商业快充均价 RM 1.40 / kWh
  afaRateSen: 3.80, // 2026年8月最新 AFA 燃油浮动费: +3.80 sen/kWh
  isTouEnabled: false,
  touOffPeakRateSen: 28.00,
  batteryCapacityKwh: 60.22
};
