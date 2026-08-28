import { EvCalculationResult, UserInputs } from '../types/calculator';

export function formatRm(amount: number, options?: { showPlus?: boolean; decimals?: number }): string {
  const decimals = options?.decimals ?? 2;
  const prefix = options?.showPlus && amount > 0 ? '+' : '';
  return `${prefix}RM ${amount.toLocaleString('en-MY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

export function formatNumber(val: number, decimals: number = 1): string {
  return val.toLocaleString('en-MY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Generates formatted text for WhatsApp and Obsidian notes
 */
export function generateShareReport(inputs: UserInputs, result: EvCalculationResult): string {
  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `🚗⚡ *【${inputs.modelName} 试驾电费与油费对比报告】*
📅 日期：${dateStr}

📊 *核心能耗数据*
• 车辆标称能耗：${inputs.consumptionKwhPer100Km} kWh/100 km
• 预估月行驶里程：${inputs.monthlyMileageKm.toLocaleString()} km
• 电车月充电量：${formatNumber(result.evMonthlyGrossKwh)} kWh (${inputs.homeChargingRatio * 100}% 家充)

💰 *费用与省钱对比 (每月)*
• 现状总能耗支出：${formatRm(result.oldTotalMonthlyEnergyExpense)} /月
  └ 家里电费：${formatRm(result.baselineBill.totalAmount)}
  └ 爸爸汽油费：${formatRm(result.petrolMonthlyCost)} (约 ${result.petrolEquivalentDistanceKm.toLocaleString()} km)
• 买电车后新支出：${formatRm(result.newTotalMonthlyEnergyExpense)} /月
  └ 新 TNB 总电费：${formatRm(result.newCombinedBill.totalAmount)} (增加 ${formatRm(result.marginalHomeElectricityCost)})
  └ 外出快充费：${formatRm(result.publicChargingCost)}

🎉 *最终省钱结论*
• 每月净省：*${formatRm(result.monthlyNetSavings)}*
• 每年净省：*${formatRm(result.yearlyNetSavings)}*
• 5年累计节省：*${formatRm(result.fiveYearNetSavings)}*

⚡ *每 100 公里能耗成本对比*
• 汽油车：${formatRm(result.petrolCostPer100Km)} / 100km
• 电动车：${formatRm(result.evCostPer100Km)} / 100km (立省 ${result.savingsRatioPerKm}%)

${result.crossed600Threshold ? `⚠️ *TNB 阶梯提醒*：增加电车充电后，每月总用电达到 ${result.newCombinedBill.kwh} kWh，跨过了 600 kWh 门槛（取消了 RM10 Retail Charge 与 AFA 燃油豁免，建议夜间定时充电或申请 ToU）。` : `✅ *TNB 用电在安全线内*：总用电 ${result.newCombinedBill.kwh} kWh，在 600 kWh 优惠档位内。`}

💡 计算器生成自 David's EV Test Drive Tool`;
}
