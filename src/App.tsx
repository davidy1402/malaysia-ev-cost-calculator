import { useState, useMemo } from 'react';
import { DEFAULT_USER_INPUTS } from './constants/presets';
import { UserInputs, VehiclePreset } from './types/calculator';
import { calculateAllEvMetrics } from './utils/tnbTariff';
import { Navbar } from './components/Navbar';
import { QuickPresetSelector } from './components/QuickPresetSelector';
import { ShowroomInputCard } from './components/ShowroomInputCard';
import { SavingsHeroCard } from './components/SavingsHeroCard';
import { CostPer100KmComparison } from './components/CostPer100KmComparison';
import { TnbBreakdownCard } from './components/TnbBreakdownCard';
import { AdvancedSettingsDrawer } from './components/AdvancedSettingsDrawer';
import { ShareReportModal } from './components/ShareReportModal';
import { Info } from 'lucide-react';

export function App() {
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_USER_INPUTS);
  const [isCustom, setIsCustom] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Instant reactive computation
  const result = useMemo(() => {
    return calculateAllEvMetrics(inputs);
  }, [inputs]);

  const handleUpdateInputs = (patch: Partial<UserInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const handleSelectPreset = (preset: VehiclePreset) => {
    setIsCustom(false);
    setInputs((prev) => ({
      ...prev,
      modelName: preset.name,
      consumptionKwhPer100Km: preset.consumptionKwhPer100Km,
      batteryCapacityKwh: preset.batteryCapacityKwh
    }));
  };

  const handleSelectCustom = () => {
    setIsCustom(true);
    setInputs((prev) => ({
      ...prev,
      modelName: '自定义车型'
    }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_USER_INPUTS);
    setIsCustom(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Top Navbar */}
      <Navbar
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* Model Presets Selector */}
        <QuickPresetSelector
          selectedModelName={inputs.modelName}
          onSelectPreset={handleSelectPreset}
          onSelectCustom={handleSelectCustom}
          isCustom={isCustom}
        />

        {/* Primary Showroom Target Input Card */}
        <ShowroomInputCard
          inputs={inputs}
          result={result}
          onChange={handleUpdateInputs}
        />

        {/* Hero Savings & Comparison Result */}
        <SavingsHeroCard
          inputs={inputs}
          result={result}
        />

        {/* 100km & Trips Cost Comparison */}
        <CostPer100KmComparison
          inputs={inputs}
          result={result}
        />

        {/* Detailed TNB 2026 Tariff Breakdown */}
        <TnbBreakdownCard
          inputs={inputs}
          result={result}
        />

        {/* Bottom Test Drive Pro-Tips Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 text-xs text-zinc-400 space-y-2.5">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Info size={16} className="text-emerald-400 shrink-0" />
            <span>试驾展厅沟通建议 (David's Checklist)</span>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-zinc-400">
            <li>
              <strong className="text-zinc-300">问官方综合电耗</strong>：销售一般会回答 WLTP 或 NEDC 电耗，直接将数字（如 <code className="text-emerald-400 font-mono">14.5</code>）填入上方即可。
            </li>
            <li>
              <strong className="text-zinc-300">问随车赠品与充电桩</strong>：确认车价是否赠送 7kW / 11kW 家用交流充电桩（Wallbox）及基础安装（标准 10–15 米线缆）。
            </li>
            <li>
              <strong className="text-zinc-300">TNB 电表确认</strong>：如果家里安装了 TNB Smart Meter，可向 TNB 申请 Time of Use (ToU) 计划，利用夜间 10pm–2pm 低谷电价充电，电费将进一步降低约 25%–35%。
            </li>
          </ul>
        </div>
      </main>

      {/* Modals and Drawers */}
      <AdvancedSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        inputs={inputs}
        onChange={handleUpdateInputs}
      />

      <ShareReportModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        inputs={inputs}
        result={result}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <p>Malaysia EV & TNB Electricity Cost Calculator · Built for David's Test Drive</p>
      </footer>
    </div>
  );
}
