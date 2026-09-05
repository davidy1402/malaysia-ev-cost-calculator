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
    evJourneyTitle: 'Your EV & Commute',
    consumptionLabel: 'Energy Consumption (kWh/100km)',
    monthlyMileageTitle: 'Monthly Commute Distance',
    mileageUnit: 'km',
    homeElectricityTitle: 'Home Electricity',
    kwhUnit: 'kWh',
    kwhRmToggle: 'kWh ↔ RM',
    monthlyPetrolTitle: 'Current Monthly Petrol Spend',
    currencyUnit: 'RM',
    calculateBtn: 'Calculate Savings',

    // Results
    verdictTitle: 'Financial Verdict',
    monthlyNetSavings: 'Monthly Net Savings',
    oneYear: '1-Year Net',
    fiveYear: '5-Year Fuel',
    tco: '5-Year Total',
    inclRoadTax: 'incl. road tax',

    // Waterfall
    oldPetrolSpend: 'Current Petrol Spend',
    marginalHomeElec: '- Marginal Home Electricity',
    publicDcCost: '- Public DC Charging',
    totalEvCharging: '= Total EV Charging Cost',

    // Anchors
    seeComparator: 'See Car Comparison ↓',
    seeTnbAudit: 'See TNB Bill Audit ↓',

    // Comparator
    comparatorTitle: 'Car Comparison',
    carA: 'Current Car',
    activeInputs: 'Active',
    motorKw: 'Motor Output',
    batteryKwh: 'Battery Size',
    cost100km: 'Cost / 100km',
    monthlyEvCost: 'Monthly Charging',
    fiveYearEnergySavings: '5-Yr Fuel Savings',
    winnerTag: '{car} saves RM {amount} more (5-yr)',
    tieTag: 'Equal 5-year cost',

    // Road Tax & TCO
    roadTaxSectionTitle: '2026 JPJ Road Tax Benchmark',
    roadTaxSub: 'From 2026, Malaysia EV road tax is kW-rated; benchmarked against private ICE displacement.',
    roadTaxEvLabel: '2026 EV Road Tax',
    roadTaxIceLabel: 'Benchmark ICE Tax',
    roadTaxIceCcSelect: 'ICE displacement',
    annualDiff: 'Annual Road Tax Delta',
    fiveYearTcoAdvantage: '5-Year Net TCO Advantage',
    perYearUnit: '/ yr',
    perMonthUnit: '/ mo',

    // TNB Audit
    tnbAuditTitle: 'Real TNB Bill Breakdown',
    thresholdWarning: 'Monthly usage crosses 600 kWh. TNB retail charges and AFA fuel surcharge now apply.',
    tableItem: 'Item',
    tableBaseline: 'Before EV',
    tableNew: 'With EV',
    tableDelta: 'Difference',
    baseGen: 'Base Energy & Network',
    sstTax: 'Service Tax SST (8%)',
    kwtbb: 'Renewable Fund (KWTBB)',
    totalRm: 'Total Monthly Bill (RM)',

    // Advanced Drawer
    advancedSettings: 'Advanced Parameters',
    petrolPriceLabel: 'Petrol price per litre',
    fuelEconomyLabel: 'Fuel economy (km/L)',
    chargingLossLabel: 'Charging loss (%)',
    publicDcRateLabel: 'Public DC rate (RM/kWh)',
    shareReportTitle: 'Share Breakdown',
    copyReport: 'Copy Summary',
    copied: 'Copied to clipboard!',
    shareWhatsApp: 'Send via WhatsApp',
    reportSummary: 'EV Calc MY Summary\n\nVehicle: {model}\nConsumption: {consumption} kWh/100km\nMileage: {mileage} km/mo\nPetrol: RM {petrol}/mo\n\nMonthly Net Savings: RM {savings}\nMonthly EV Charging: RM {evCost}\n5-Yr Total Savings (incl. 2026 Road Tax): RM {tcoSavings}'
  },
  zh: {
    appTitle: 'EV Calc MY',
    langToggle: 'EN',

    // Cockpit
    evJourneyTitle: '电车能耗与行程',
    consumptionLabel: '百公里电耗 (kWh/100km)',
    monthlyMileageTitle: '每月行驶里程',
    mileageUnit: 'km',
    homeElectricityTitle: '家里每月用电',
    kwhUnit: 'kWh',
    kwhRmToggle: 'kWh ↔ RM',
    monthlyPetrolTitle: '原车每月油费',
    currencyUnit: 'RM',
    calculateBtn: '开始测算',

    // Results
    verdictTitle: '测算结果',
    monthlyNetSavings: '每月净省',
    oneYear: '1年累计',
    fiveYear: '5年油电省',
    tco: '5年总净省',
    inclRoadTax: '含5年路税差',

    // Waterfall
    oldPetrolSpend: '原车每月油费',
    marginalHomeElec: '− 家充新增电费 (TNB)',
    publicDcCost: '− 商业快充费用',
    totalEvCharging: '＝ 电车每月充电总开销',

    // Anchors
    seeComparator: '查看两车对比 ↓',
    seeTnbAudit: '查看 TNB 账单明细 ↓',

    // Comparator
    comparatorTitle: '车型对比',
    carA: '当前车型',
    activeInputs: '已选',
    motorKw: '电机功率',
    batteryKwh: '电池容量',
    cost100km: '百公里花费',
    monthlyEvCost: '每月充电费',
    fiveYearEnergySavings: '5年油电差额',
    winnerTag: '{car} 5年多省 RM {amount}',
    tieTag: '两车5年成本相当',

    // Road Tax & TCO
    roadTaxSectionTitle: '2026 JPJ 电车路税对比',
    roadTaxSub: '2026年起纯电按电机输出功率（kW）计税；此处对比汽油车排量税率。',
    roadTaxEvLabel: '2026 纯电路税',
    roadTaxIceLabel: '参考油车路税',
    roadTaxIceCcSelect: '参考油车排量',
    annualDiff: '路税年差额',
    fiveYearTcoAdvantage: '5年综合总省 (含路税)',
    perYearUnit: '/ 年',
    perMonthUnit: '/ 月',

    // TNB Audit
    tnbAuditTitle: 'TNB 真实账单拆解',
    thresholdWarning: '月用电跨过 600 kWh 门槛。TNB 将计收零售服务费与 AFA 燃油浮动费。',
    tableItem: '账单项目',
    tableBaseline: '买车前',
    tableNew: '买车后',
    tableDelta: '增量',
    baseGen: '基础电费与电网费',
    sstTax: '服务税 SST (8%)',
    kwtbb: '绿色能源基金 KWTBB',
    totalRm: '实付总电费 (RM)',

    // Advanced Drawer
    advancedSettings: '高级参数设置',
    petrolPriceLabel: '汽油单价 (RM/L)',
    fuelEconomyLabel: '燃油经济性 (km/L)',
    chargingLossLabel: '交流充电损耗 (%)',
    publicDcRateLabel: '商业直流快充单价 (RM/kWh)',
    shareReportTitle: '分享精算报告',
    copyReport: '复制文本摘要',
    copied: '已复制到剪贴板！',
    shareWhatsApp: '通过 WhatsApp 发送',
    reportSummary: 'EV Calc MY 试驾精算摘要\n\n车型: {model}\n电耗: {consumption} kWh/100km\n月度里程: {mileage} km/月\n原油费: RM {petrol}/月\n\n每月净省: RM {savings}\n电车月充电费: RM {evCost}\n5年综合总省 (含2026路税): RM {tcoSavings}'
  }
};
