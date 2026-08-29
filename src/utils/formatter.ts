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
 * Generates formatted text for WhatsApp and Obsidian notes in Chinese or English
 */
export function generateShareReport(
  inputs: UserInputs,
  result: EvCalculationResult,
  language: 'zh' | 'en' = 'zh'
): string {
  const isEn = language === 'en';
  const dateStr = new Date().toLocaleDateString(isEn ? 'en-MY' : 'zh-CN', {
    year: 'numeric',
    month: isEn ? 'short' : 'long',
    day: 'numeric'
  });

  const modelName = inputs.modelName.trim() || (isEn ? 'EV Model' : '电车');

  if (isEn) {
    return `🚗⚡ *【${modelName} Test Drive Electricity & Petrol Cost Report】*
📅 Date: ${dateStr}

📊 *Key Energy Metrics*
• Vehicle Rated Consumption: ${inputs.consumptionKwhPer100Km} kWh/100 km
• Monthly Estimated Mileage: ${inputs.monthlyMileageKm.toLocaleString()} km
• Monthly EV Energy: ${formatNumber(result.evMonthlyGrossKwh)} kWh (${inputs.chargingMode === 'home_only' ? '100% Home' : '90% Home / 10% Public'})

💰 *Monthly Cost & Energy Breakdown*
• Current Monthly Total: ${formatRm(result.oldTotalMonthlyEnergyExpense)}
  └ Home Electricity (${result.baselineBill.kwh} kWh): ${formatRm(result.baselineBill.totalAmount)}
  └ Father's Petrol Expense: ${formatRm(result.petrolMonthlyCost)} (~${result.petrolEquivalentDistanceKm.toLocaleString()} km)
• New Total with EV: ${formatRm(result.newTotalMonthlyEnergyExpense)}
  └ New TNB Home Bill (${result.newCombinedBill.kwh} kWh): ${formatRm(result.newCombinedBill.totalAmount)} (+${formatRm(result.marginalHomeElectricityCost)})
  └ Public DC Fast Charging: ${formatRm(result.publicChargingCost)}

🎉 *Financial Verdict*
• Monthly Net Savings: *${formatRm(result.monthlyNetSavings)}*
• 1-Year Net Savings: *${formatRm(result.yearlyNetSavings)}*
• 5-Year Cumulative Savings: *${formatRm(result.fiveYearNetSavings)}*

⚡ *Cost per 100 km Comparison*
• Petrol Car: ${formatRm(result.petrolCostPer100Km)} / 100km
• Electric Vehicle: ${formatRm(result.evCostPer100Km)} / 100km (${result.savingsRatioPerKm}% cheaper)

${result.crossed600Threshold ? `⚠️ *TNB Threshold Note*: Adding EV increases total home consumption to ${result.newCombinedBill.kwh} kWh, crossing the 600 kWh threshold. Still achieves ${formatRm(result.monthlyNetSavings)}/month in net savings.` : `✅ *TNB Usage within 600 kWh threshold*.`}

💡 Generated via Malaysia EV × TNB Cost Calculator`;
  }

  return `🚗⚡ *【${modelName} 试驾电费与油费对比报告】*
📅 日期：${dateStr}

📊 *核心能耗数据*
• 车辆标称能耗：${inputs.consumptionKwhPer100Km} kWh/100 km
• 预估月行驶里程：${inputs.monthlyMileageKm.toLocaleString()} km
• 电车月充电量：${formatNumber(result.evMonthlyGrossKwh)} kWh (${inputs.chargingMode === 'home_only' ? '100% 纯家充' : '90% 家充 + 10% 外充'})

💰 *费用与省钱对比 (每月)*
• 现状总能耗支出：${formatRm(result.oldTotalMonthlyEnergyExpense)} /月
  └ 家里电费 (${result.baselineBill.kwh} 度)：${formatRm(result.baselineBill.totalAmount)}
  └ 爸爸汽油费：${formatRm(result.petrolMonthlyCost)} (约 ${result.petrolEquivalentDistanceKm.toLocaleString()} km)
• 买电车后新支出：${formatRm(result.newTotalMonthlyEnergyExpense)} /月
  └ 新 TNB 总电费 (${result.newCombinedBill.kwh} 度)：${formatRm(result.newCombinedBill.totalAmount)} (增加 ${formatRm(result.marginalHomeElectricityCost)})
  └ 外出快充费：${formatRm(result.publicChargingCost)}

🎉 *最终省钱结论*
• 每月净省：*${formatRm(result.monthlyNetSavings)}*
• 每年净省：*${formatRm(result.yearlyNetSavings)}*
• 5年累计节省：*${formatRm(result.fiveYearNetSavings)}*

⚡ *每 100 公里能耗成本对比*
• 汽油车：${formatRm(result.petrolCostPer100Km)} / 100km
• 电动车：${formatRm(result.evCostPer100Km)} / 100km (立省 ${result.savingsRatioPerKm}%)

${result.crossed600Threshold ? `⚠️ *TNB 门槛提醒*：增加电车充电后，每月总用电达到 ${result.newCombinedBill.kwh} kWh，跨过了 600 kWh 门槛（依然每月净省 ${formatRm(result.monthlyNetSavings)}）。` : `✅ *TNB 用电在 600 kWh 安全优惠线内*。`}

💡 计算器生成自 David's Malaysia EV Test Drive Calculator`;
}
