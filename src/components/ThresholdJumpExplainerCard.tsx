import React, { useState } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { AlertTriangle, ChevronDown, ChevronUp, Flame, Zap, Clock } from 'lucide-react';
import { formatRm } from '../utils/formatter';

interface ThresholdJumpExplainerCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const ThresholdJumpExplainerCard: React.FC<ThresholdJumpExplainerCardProps> = ({
  inputs,
  result
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const baselineKwh = result.baselineBill.kwh;
  const newKwh = result.newCombinedBill.kwh;

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base flex items-center gap-2">
              <span>为什么有人买电车后电费从 RM 200 涨到 RM 600？</span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              深度解析 TNB 2025/2026 阶梯制度、EEI 返现缩水与 600 度门槛效应
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <span>{isOpen ? '收起解析' : '展开深度解析'}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Your Household Specific Risk Status */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Flame size={15} />
            <span>你家当前处于：跨过 600 度敏感区间</span>
          </span>
          <span className="font-mono text-xs text-zinc-300">
            {baselineKwh} 度 ➔ <strong className="text-amber-400">{newKwh} 度</strong>
          </span>
        </div>

        <p className="text-xs text-zinc-200 leading-relaxed">
          你们家原本月用电 <strong>{baselineKwh} 度（稳稳在 600 度内）</strong>，享受 Retail Charge 与 AFA 全免。买了电车后总用电变为 <strong>{newKwh} 度（跨过 600 度）</strong>，导致原本免交的 <strong>RM 10 固定服务费 + RM {result.newCombinedBill.afaSurcharge} 燃油费</strong> 开始恢复征收。
        </p>

        <div className="pt-1 border-t border-amber-500/20 text-xs font-medium text-emerald-400">
          ✅ 结论：虽然电费增加了 {formatRm(result.marginalHomeElectricityCost)}，但因为彻底省下了爸爸每月 {formatRm(inputs.fatherPetrolCostRm)} 的油钱，<strong>全家整体开销依然稳稳净省 {formatRm(result.monthlyNetSavings)}/月！</strong>
        </div>
      </div>

      {/* Deep-Dive Educational Section */}
      {isOpen && (
        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 text-xs text-zinc-300 leading-relaxed">
          <h4 className="font-semibold text-zinc-100 text-sm flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Zap size={16} className="text-emerald-400" />
            <span>导致网上「电费翻倍暴涨」的 4 大真正原因：</span>
          </h4>

          <div className="space-y-3">
            <div className="space-y-1">
              <strong className="text-amber-300 block">1. EEI 节能补贴返现大幅缩水（隐性涨价）</strong>
              <p className="text-zinc-400">
                TNB 的 EEI 返现是按<strong>全月总度数</strong>计算的。原本 500 度时每度享受 −10.5 sen 返现（折减 RM 52.61）；买电车后总电量跳到 750 度，返现率跌到 −4.5 sen（只折减 RM 33.75）。<strong>不只是多用了电，连原本享受的 RM 19 折扣也被吞掉了！</strong>
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-amber-300 block">2. 跨过 600 度临界点，优惠瞬间消失</strong>
              <p className="text-zinc-400">
                600 度以内享受「免 RM10 Retail Charge + 免 AFA 燃油浮动费 + 免 SST」。一旦买车后哪怕只超过 1 度，全额 AFA 燃油费与 RM10 就会立即生效。
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-amber-300 block">3. 原本就是高用电家庭（冲破 1,000 或 1,500 度极值）</strong>
              <p className="text-zinc-400">
                如果家里本身有多台冷气、烤箱、热水器，月用电已有 800–900 度；买车后再加 300 度，总用电直接突破 1,000 度（EEI 返现归零）甚至 1,500 度（发电基础费率从 27.03 sen 跳涨到 37.03 sen）。
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-amber-300 block">4. 月行驶里程极长（2,500–3,000 km）</strong>
              <p className="text-zinc-400">
                高行驶里程意味着每月需充 400–500+ 度电，相当于家里多开 3 台 24 小时不关的冷气。
              </p>
            </div>
          </div>

          {/* Solution: ToU */}
          <div className="mt-4 rounded-xl bg-blue-950/30 border border-blue-500/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-blue-300">
              <Clock size={15} />
              <span>给电车车主的最佳对策：申请 ToU 分时电价</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              TNB 智能电表支持 ToU（Time of Use）：<strong>工作日晚上 10:00 至次日下午 2:00，以及周末全天</strong>均为 Off-Peak 离峰时段（费率低至约 28 sen/kWh）。只要设置车辆在晚上 10 点后自动充电，电费将大幅降低！
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
