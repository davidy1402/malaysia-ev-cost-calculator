import { UserInputs } from '../types/calculator';

export const DEFAULT_USER_INPUTS: UserInputs = {
  modelName: '',
  consumptionKwhPer100Km: 14.5,
  monthlyMileageKm: 1477, // 对应爸爸每月 RM210 油费 @ RM1.99/L 的实际行驶里程
  baselineHomeBillRm: 200, // 对应聊天记录中家里平均月电费 (RM 200 ~ 448 kWh)
  fatherPetrolCostRm: 210, // 爸爸每月固定汽油支出 RM 210

  // Updated based on user specification
  petrolPricePerLiter: 1.99, // 设定基准油价 RM 1.99 / L
  petrolFuelEfficiencyKmPerL: 14.0, // 典型油车油耗 ~7.1 L/100km (Myvi/Alza/Axia)
  chargingEfficiency: 0.90, // 10% AC 充电转换与线损
  homeChargingRatio: 0.90, // 90% 家充 / 10% 外出商用 DC 快充
  publicDcPricePerKwh: 1.40, // 商业快充均价 RM 1.40/kWh
  afaRateSen: 3.80, // TNB AFA 燃油附加费 +3.80 sen/kWh
  isTouEnabled: false, // Time of Use
  touOffPeakRateSen: 28.00, // ToU 离峰费率
  batteryCapacityKwh: 60.22,
};
