import { VehiclePreset, UserInputs } from '../types/calculator';

export const POPULAR_EV_PRESETS: VehiclePreset[] = [
  {
    id: 'emas-7',
    name: 'Proton e.MAS 7',
    brand: 'Proton',
    consumptionKwhPer100Km: 14.5,
    batteryCapacityKwh: 60.22,
    claimedRangeWltpKm: 410,
    priceEstimateRm: '~RM 108k - 120k',
    tag: '⭐ 试驾焦点'
  },
  {
    id: 'emas-5',
    name: 'Proton e.MAS 5',
    brand: 'Proton',
    consumptionKwhPer100Km: 13.8,
    batteryCapacityKwh: 49.52,
    claimedRangeWltpKm: 350,
    priceEstimateRm: '~RM 80k - 95k',
    tag: '超高性价比'
  },
  {
    id: 'byd-dolphin',
    name: 'BYD Dolphin (Dynamic/Premium)',
    brand: 'BYD',
    consumptionKwhPer100Km: 13.2,
    batteryCapacityKwh: 44.9,
    claimedRangeWltpKm: 340,
    priceEstimateRm: '~RM 100k - 125k',
    tag: '市区通勤王'
  },
  {
    id: 'byd-atto3',
    name: 'BYD Atto 3',
    brand: 'BYD',
    consumptionKwhPer100Km: 16.0,
    batteryCapacityKwh: 60.48,
    claimedRangeWltpKm: 420,
    priceEstimateRm: '~RM 149k - 167k',
    tag: '家庭 SUV'
  },
  {
    id: 'byd-seal-rwd',
    name: 'BYD Seal (Dynamic/Premium)',
    brand: 'BYD',
    consumptionKwhPer100Km: 15.4,
    batteryCapacityKwh: 61.4,
    claimedRangeWltpKm: 510,
    priceEstimateRm: '~RM 179k - 199k',
    tag: '运动轿跑'
  },
  {
    id: 'tesla-model3-rwd',
    name: 'Tesla Model 3 (RWD)',
    brand: 'Tesla',
    consumptionKwhPer100Km: 13.0,
    batteryCapacityKwh: 57.5,
    claimedRangeWltpKm: 513,
    priceEstimateRm: '~RM 189k',
    tag: '超高能效'
  },
  {
    id: 'smart-1-pro',
    name: 'Smart #1 (Pro/Premium)',
    brand: 'Smart',
    consumptionKwhPer100Km: 17.4,
    batteryCapacityKwh: 66.0,
    claimedRangeWltpKm: 400,
    priceEstimateRm: '~RM 189k - 219k',
    tag: '潮酷精品'
  },
  {
    id: 'zeekr-x',
    name: 'Zeekr X',
    brand: 'Zeekr',
    consumptionKwhPer100Km: 16.5,
    batteryCapacityKwh: 66.0,
    claimedRangeWltpKm: 440,
    priceEstimateRm: '~RM 180k',
    tag: '豪华轻奢'
  }
];

export const DEFAULT_USER_INPUTS: UserInputs = {
  modelName: 'Proton e.MAS 7',
  consumptionKwhPer100Km: 14.5,
  monthlyMileageKm: 1477, // 对应爸爸每月 RM210 油费 @ RM1.99/L 的实际行驶里程 (14 km/L)
  baselineHomeKwh: 501, // 锚定 David 家最新真实 TNB 账单 (501 kWh = RM 172.70)
  baselineHomeBillRm: 172.70, // 真实账单金额
  fatherPetrolCostRm: 210, // 爸爸每月固定汽油支出 RM 210

  // 充电模式: 'mixed' (90%家充+10%外充) vs 'home_only' (100%纯家充)
  chargingMode: 'mixed',

  petrolPricePerLiter: 1.99, // 设定基准油价 RM 1.99 / L
  petrolFuelEfficiencyKmPerL: 14.0, // 典型油车油耗 ~7.14 L/100km
  chargingEfficiency: 0.90, // 10% AC 充电与线损
  homeChargingRatio: 0.90, // 90% 家充 / 10% 商业快充
  publicDcPricePerKwh: 1.40, // 商业快充均价 RM 1.40/kWh
  afaRateSen: 3.80, // TNB AFA 燃油附加费 +3.80 sen/kWh (2026年8月)
  isTouEnabled: false, // Time of Use
  touOffPeakRateSen: 28.00, // ToU 离峰费率
  batteryCapacityKwh: 60.22,
};
