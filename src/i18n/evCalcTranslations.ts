export interface AppTranslations {
  appTitle: string;
  langToggle: string;

  // Cockpit
  evJourneyTitle: string;
  consumptionLabel: string;
  monthlyMileageTitle: string;
  mileageUnit: string;
  homeElectricityTitle: string;
  kwhUnit: string;
  kwhRmToggle: string;
  monthlyPetrolTitle: string;
  currencyUnit: string;
  calculateBtn: string;

  // Results
  verdictTitle: string;
  monthlyNetSavings: string;
  oneYear: string;
  fiveYear: string;
  tco: string;
  inclRoadTax: string;

  // Waterfall
  oldPetrolSpend: string;
  marginalHomeElec: string;
  publicDcCost: string;
  totalEvCharging: string;

  // Anchors
  seeComparator: string;
  seeTnbAudit: string;

  // Comparator
  comparatorTitle: string;
  carA: string;
  activeInputs: string;
  motorKw: string;
  batteryKwh: string;
  cost100km: string;
  monthlyEvCost: string;
  fiveYearEnergySavings: string;
  winnerTag: string;
  tieTag: string;

  // Road Tax & TCO
  roadTaxSectionTitle: string;
  roadTaxSub: string;
  roadTaxEvLabel: string;
  roadTaxIceLabel: string;
  roadTaxIceCcSelect: string;
  annualDiff: string;
  fiveYearTcoAdvantage: string;
  perYearUnit: string;
  perMonthUnit: string;

  // TNB Audit
  tnbAuditTitle: string;
  thresholdWarning: string;
  tableItem: string;
  tableBaseline: string;
  tableNew: string;
  tableDelta: string;
  baseGen: string;
  sstTax: string;
  kwtbb: string;
  totalRm: string;

  // Advanced Drawer
  advancedSettings: string;
  petrolPriceLabel: string;
  fuelEconomyLabel: string;
  chargingLossLabel: string;
  publicDcRateLabel: string;
  shareReportTitle: string;
  copyReport: string;
  copied: string;
  shareWhatsApp: string;
  reportSummary: string;
}

export const evCalcTranslations: Record<'en' | 'zh', AppTranslations> = {
  en: {
    appTitle: 'EV Calc MY',
    langToggle: 'ZH',

    // Cockpit
    evJourneyTitle: 'Your EV & Journey',
    consumptionLabel: 'Consumption (kWh/100km)',
    monthlyMileageTitle: 'Monthly Mileage',
    mileageUnit: 'km',
    homeElectricityTitle: 'Home Electricity',
    kwhUnit: 'kWh',
    kwhRmToggle: 'kWh ↔ RM',
    monthlyPetrolTitle: 'Monthly Petrol Spend',
    currencyUnit: 'RM',
    calculateBtn: 'Calculate',

    // Results
    verdictTitle: 'Financial Verdict',
    monthlyNetSavings: 'Monthly Net Savings',
    oneYear: '1-Year',
    fiveYear: '5-Year',
    tco: 'TCO',
    inclRoadTax: 'incl. Road Tax',

    // Waterfall
    oldPetrolSpend: 'Old Petrol Spend',
    marginalHomeElec: '- Marginal Home Elec',
    publicDcCost: '- Public DC Cost',
    totalEvCharging: '= Total EV Charging',

    // Anchors
    seeComparator: 'See Comparator ↓',
    seeTnbAudit: 'See TNB Audit ↓',

    // Comparator
    comparatorTitle: 'Car Comparator',
    carA: 'Car A',
    activeInputs: 'Active Inputs',
    motorKw: 'Motor kW',
    batteryKwh: 'Battery kWh',
    cost100km: '100km Cost',
    monthlyEvCost: 'Monthly Charging',
    fiveYearEnergySavings: '5-Yr Fuel Savings',
    winnerTag: '{car} saves RM {amount} more over 5 years',
    tieTag: 'Equal 5-year savings',

    // Road Tax & TCO
    roadTaxSectionTitle: '2026 Malaysia Road Tax Comparison',
    roadTaxSub: 'Official JPJ Gazette: EV kW rating vs Petrol ICE engine capacity',
    roadTaxEvLabel: '2026 EV Road Tax',
    roadTaxIceLabel: 'Petrol ICE Road Tax',
    roadTaxIceCcSelect: 'Benchmark ICE engine',
    annualDiff: 'Annual Road Tax Delta',
    fiveYearTcoAdvantage: '5-Year Net TCO Advantage',
    perYearUnit: '/ year',
    perMonthUnit: '/ mo',

    // TNB Audit
    tnbAuditTitle: 'Real TNB Bill Breakdown',
    thresholdWarning: '600 kWh threshold crossed. AFA & 8% SST now apply to your EV charging usage.',
    tableItem: 'Item',
    tableBaseline: 'Baseline',
    tableNew: 'New',
    tableDelta: 'Delta',
    baseGen: 'Base Gen.',
    sstTax: 'SST Tax (8%)',
    kwtbb: 'KWTBB',
    totalRm: 'Total RM',

    // Advanced Drawer
    advancedSettings: 'Advanced Settings',
    petrolPriceLabel: 'Petrol price per litre',
    fuelEconomyLabel: 'Fuel economy (km/L)',
    chargingLossLabel: 'Charging loss (%)',
    publicDcRateLabel: 'Public DC rate (RM/kWh)',
    shareReportTitle: 'Share Report',
    copyReport: 'Copy Report',
    copied: 'Copied!',
    shareWhatsApp: 'WhatsApp',
    reportSummary: 'Malaysia EV Calculator\n\nConsumption: {consumption} kWh/100km\nMileage: {mileage} km/mo\nPetrol: RM {petrol}/mo\n\nMonthly Net Savings: RM {savings}\nTotal EV Charging: RM {evCost}'
  },
  zh: {
    appTitle: 'EV Calc MY',
    langToggle: 'EN',

    // Cockpit
    evJourneyTitle: '心仪电车与行程',
    consumptionLabel: '百公里综合电耗 (kWh/100km)',
    monthlyMileageTitle: '预估每月行驶里程',
    mileageUnit: '公里',
    homeElectricityTitle: '家庭日常用电',
    kwhUnit: '度 (kWh)',
    kwhRmToggle: '度数 ↔ 账单金额',
    monthlyPetrolTitle: '现有每月燃油花费',
    currencyUnit: 'RM',
    calculateBtn: '查看精算结果',

    // Results
    verdictTitle: '财务测算结论',
    monthlyNetSavings: '每月净省金额',
    oneYear: '1 年累计',
    fiveYear: '5 年累计',
    tco: '5年总拥车',
    inclRoadTax: '含 2026 新路税',

    // Waterfall
    oldPetrolSpend: '原燃油车每月油费',
    marginalHomeElec: '− 家充新增电费 (TNB 增量)',
    publicDcCost: '− 商业直流快充支出',
    totalEvCharging: '＝ 电车每月补能总开销',

    // Anchors
    seeComparator: '查看双车对比 ↓',
    seeTnbAudit: '查看 TNB 账单明细 ↓',

    // Comparator
    comparatorTitle: '双车横向对比',
    carA: '试驾车 A',
    activeInputs: '当前输入',
    motorKw: '电机功率 (kW)',
    batteryKwh: '电池容量 (kWh)',
    cost100km: '百公里花费',
    monthlyEvCost: '每月补能花费',
    fiveYearEnergySavings: '5年油电净省',
    winnerTag: '{car} 5年多省 RM {amount}',
    tieTag: '5年节省总额相当',

    // Road Tax & TCO
    roadTaxSectionTitle: '2026 马来西亚新路税精算对比',
    roadTaxSub: '官方 MOT/JPJ 宪报标准：纯电 kW 功率阶梯 vs 油车 cc 排量税率',
    roadTaxEvLabel: '2026 纯电路税',
    roadTaxIceLabel: '燃油车基准路税',
    roadTaxIceCcSelect: '对比燃油排量',
    annualDiff: '每年路税差额',
    fiveYearTcoAdvantage: '5年真实 TCO 综合优势',
    perYearUnit: '/ 年',
    perMonthUnit: '/ 月',

    // TNB Audit
    tnbAuditTitle: 'TNB 真实账单拆解审计',
    thresholdWarning: '月用电跨过 600 kWh 门槛。TNB 恢复征收固定服务费与 AFA 燃油浮动费。',
    tableItem: '账单项目',
    tableBaseline: '买车前',
    tableNew: '买车后',
    tableDelta: '增量',
    baseGen: '基础发电与电网费',
    sstTax: '服务税 SST (8%)',
    kwtbb: '绿色能源基金 KWTBB',
    totalRm: '最终实付总电费 (RM)',

    // Advanced Drawer
    advancedSettings: '高级参数设置',
    petrolPriceLabel: '汽油单价 (RM/L)',
    fuelEconomyLabel: '燃油经济性 (km/L)',
    chargingLossLabel: '交流充能损耗率 (%)',
    publicDcRateLabel: '公共直流快充单价 (RM/kWh)',
    shareReportTitle: '导出与分享报告',
    copyReport: '复制文本报告',
    copied: '已复制到剪贴板！',
    shareWhatsApp: '通过 WhatsApp 分享',
    reportSummary: 'EV Calc MY 电车电费与油费对比报告\n\n官方电耗: {consumption} kWh/100km\n月度里程: {mileage} km/月\n当前油费: RM {petrol}/月\n\n每月净省: RM {savings}\n电车月度补能总开销: RM {evCost}'
  }
};
