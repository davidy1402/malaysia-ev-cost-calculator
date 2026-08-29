import React, { useState } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { formatRm } from '../utils/formatter';
import { calculateEvRoadTax, calculatePetrolRoadTax } from '../utils/roadTax';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';

interface RoadTaxComparisonCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
  onChange?: (patch: Partial<UserInputs>) => void;
}

export const RoadTaxComparisonCard: React.FC<RoadTaxComparisonCardProps> = ({
  inputs,
  result,
  onChange
}) => {
  const { t } = useLanguage();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const evMotorKw = inputs.motorPowerKw || 160;
  const petrolCc = inputs.petrolEngineCc || 1500;

  const evRoadTaxInfo = calculateEvRoadTax(evMotorKw);
  const petrolRoadTaxInfo = calculatePetrolRoadTax(petrolCc);

  const isEvCheaper = result.annualRoadTaxDifferenceRm > 0;
  const diffVerb = isEvCheaper ? t.roadTax.diffCheaper : t.roadTax.diffPricier;

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={18} strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
                {t.roadTax.title}
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                {t.roadTax.officialGovBadge}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {t.roadTax.sub}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <span>{isDetailsOpen ? '收起政策解读' : '查看政策解读'}</span>
          {isDetailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Petrol ICE Road Tax */}
        <div className="space-y-2.5 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {t.roadTax.iceTitle}
              </span>
              <h4 className="text-xs font-medium text-zinc-300">{petrolCc} cc ({petrolRoadTaxInfo.engineBand})</h4>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-bold text-amber-400">
                {formatRm(result.petrolRoadTaxAnnualRm)}
              </span>
              <span className="text-[10px] text-zinc-500 block">/ 年</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-0.5">
            <span className="font-sans text-[11px]">排量档位</span>
            <div className="flex items-center gap-1">
              {[1500, 1800, 2000].map((cc) => (
                <button
                  key={cc}
                  type="button"
                  onClick={() => onChange?.({ petrolEngineCc: cc })}
                  className={`rounded px-1.5 py-0.5 text-[10px] transition-colors ${
                    petrolCc === cc
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                  }`}
                >
                  {cc}cc
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EV 2026 Road Tax */}
        <div className="space-y-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {t.roadTax.evTitle}
              </span>
              <h4 className="text-xs font-medium text-zinc-200">
                {inputs.modelName} ({evMotorKw} kW · {evRoadTaxInfo.powerBand})
              </h4>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-bold text-emerald-400">
                {formatRm(result.evRoadTaxAnnualRm)}
              </span>
              <span className="text-[10px] text-zinc-400 block">/ 年</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-0.5">
            <span className="font-sans text-[11px]">计算公式</span>
            <span className="text-emerald-300 font-sans text-[11px]">{evRoadTaxInfo.rateDescription}</span>
          </div>
        </div>
      </div>

      {/* Difference summary */}
      <div className="rounded-xl bg-zinc-950/80 p-3 text-xs text-zinc-300 leading-relaxed border border-zinc-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>
            {t.roadTax.taxDiffNote
              .replace('{diffVerb}', diffVerb)
              .replace('{amount}', formatRm(Math.abs(result.annualRoadTaxDifferenceRm)))}
          </span>
        </div>
        <span className="font-mono text-xs text-emerald-400 font-semibold">
          {t.roadTax.tco5yrImpact.replace('{amount}', formatRm(Math.abs(result.annualRoadTaxDifferenceRm * 5)))}
        </span>
      </div>

      {/* Policy Details Accordion */}
      {isDetailsOpen && (
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 text-xs text-zinc-300 leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-zinc-100">
            <FileText size={15} className="text-emerald-400" />
            <span>{t.roadTax.whyCheaperTitle}</span>
          </div>
          <p className="text-zinc-400">
            {t.roadTax.whyCheaperDesc}
          </p>

          <div className="overflow-hidden rounded-xl border border-zinc-800 text-[11px]">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="p-2">功率档位 (kW)</th>
                  <th className="p-2">2026 新年费</th>
                  <th className="p-2">代表车型</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-mono text-zinc-300">
                <tr>
                  <td className="p-2">100.1 – 150 kW</td>
                  <td className="p-2 text-emerald-400">RM 80 – RM 160</td>
                  <td className="p-2 font-sans">BYD Dolphin, Atto 3, Omoda E5</td>
                </tr>
                <tr>
                  <td className="p-2">150.1 – 160 kW</td>
                  <td className="p-2 text-emerald-400">RM 180</td>
                  <td className="p-2 font-sans font-semibold text-emerald-300">Proton e.MAS 7 (160 kW)</td>
                </tr>
                <tr>
                  <td className="p-2">200.1 – 210 kW</td>
                  <td className="p-2 text-emerald-400">RM 280</td>
                  <td className="p-2 font-sans">Tesla Model 3 RWD (208 kW)</td>
                </tr>
                <tr>
                  <td className="p-2">310.1 – 410 kW</td>
                  <td className="p-2 text-amber-400">RM 615 – RM 1,065</td>
                  <td className="p-2 font-sans">BYD Seal Performance (390 kW)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
