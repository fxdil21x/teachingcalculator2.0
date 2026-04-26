import { useMemo } from "react";
import { MONTHS } from "../utils/constants";
import { calculateSalary, formatIndianCurrency } from "../utils/calculations";
import EmptyState from "./ui/EmptyState";

function InsightCard({ title, value, subtitle, icon, color = "blue", delay = 0 }) {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div
      className={`p-4 rounded-2xl border ${colorClasses[color]} bg-slate-800/30 hover-lift animate-slide-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-current/20 flex items-center justify-center">
          {icon}
        </div>
        <h4 className="text-sm font-medium text-slate-300">{title}</h4>
      </div>
      <div className="text-2xl font-bold text-slate-200 mb-1 animate-count-up">{value}</div>
      {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
    </div>
  );
}

function ChartBar({ label, value, maxValue, color = "blue", delay = 0 }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="flex items-center gap-3 py-2 animate-fade-in" style={{ animationDelay: `${delay}s` }}>
      <div className="w-20 text-sm text-slate-300 truncate">{label}</div>
      <div className="flex-1 bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full ${colorClasses[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%`, transitionDelay: `${delay}s` }}
        />
      </div>
      <div className="w-14 text-sm text-slate-400 text-right">{value.toFixed(1)}h</div>
    </div>
  );
}

export default function InsightsTab({ entries }) {
  const insights = useMemo(() => {
    if (!entries.length) return null;

    // Calculate total statistics
    const totalHours = entries.reduce((sum, entry) => sum + entry.minutes, 0) / 60;
    const totalSalary = entries.reduce((sum, entry) => sum + calculateSalary(entry.minutes, entry.hourlyRate, entry.tds), 0);
    const totalDays = new Set(entries.map(entry => entry.date)).size;

    // Average class hours per day
    const avgHoursPerDay = totalHours / totalDays;

    // Average salary per month
    const monthsData = {};
    entries.forEach(entry => {
      const monthKey = `${entry.month}-${entry.year}`;
      if (!monthsData[monthKey]) {
        monthsData[monthKey] = { hours: 0, salary: 0, days: new Set() };
      }
      monthsData[monthKey].hours += entry.minutes / 60;
      monthsData[monthKey].salary += calculateSalary(entry.minutes, entry.hourlyRate, entry.tds);
      monthsData[monthKey].days.add(entry.date);
    });

    const monthlyStats = Object.values(monthsData);
    const avgSalaryPerMonth = monthlyStats.reduce((sum, month) => sum + month.salary, 0) / monthlyStats.length;
    const avgHoursPerMonth = monthlyStats.reduce((sum, month) => sum + month.hours, 0) / monthlyStats.length;

    // Most active institute
    const instituteStats = {};
    entries.forEach(entry => {
      if (!instituteStats[entry.instituteName]) {
        instituteStats[entry.instituteName] = { hours: 0, salary: 0, sessions: 0 };
      }
      instituteStats[entry.instituteName].hours += entry.minutes / 60;
      instituteStats[entry.instituteName].salary += calculateSalary(entry.minutes, entry.hourlyRate, entry.tds);
      instituteStats[entry.instituteName].sessions += 1;
    });

    const topInstitute = Object.entries(instituteStats)
      .sort(([,a], [,b]) => b.hours - a.hours)[0];

    // Weekly pattern (simplified - assuming Monday to Sunday)
    const weeklyStats = Array(7).fill(0).map(() => ({ hours: 0, sessions: 0 }));
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      weeklyStats[dayOfWeek].hours += entry.minutes / 60;
      weeklyStats[dayOfWeek].sessions += 1;
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const busiestDay = weeklyStats.reduce((max, day, index) =>
      day.hours > max.hours ? { ...day, name: dayNames[index] } : max,
      { hours: 0, name: '' }
    );

    // Calculate leave estimation (rough - assuming 30 days per month, subtract working days)
    const avgWorkingDaysPerMonth = monthlyStats.reduce((sum, month) => sum + month.days.size, 0) / monthlyStats.length;
    const avgLeavePerMonth = Math.max(0, 30 - avgWorkingDaysPerMonth);

    return {
      totalHours,
      totalSalary,
      totalDays,
      avgHoursPerDay,
      avgSalaryPerMonth,
      avgHoursPerMonth,
      avgLeavePerMonth,
      topInstitute,
      weeklyStats,
      busiestDay,
      instituteStats: Object.entries(instituteStats)
        .sort(([,a], [,b]) => b.hours - a.hours)
        .slice(0, 5),
      instituteBreakdown: Object.entries(instituteStats)
        .sort(([,a], [,b]) => b.salary - a.salary),
    };
  }, [entries]);

  if (!insights) {
    return (
      <div className="tab-content active animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-200 mb-6 animate-fade-in">Teaching Insights</h2>
        <EmptyState
          icon="chart"
          title="No data available"
          description="Start adding your teaching hours to see insights and analytics."
        />
      </div>
    );
  }

  return (
    <div className="tab-content active space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-200">Teaching Insights</h2>
        <div className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
          Based on {insights.totalDays} teaching days
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Avg Hours/Day"
          value={`${insights.avgHoursPerDay.toFixed(1)}h`}
          subtitle="Daily teaching average"
          delay={0.15}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="blue"
        />
        <InsightCard
          title="Avg Salary/Month"
          value={`₹${formatIndianCurrency(insights.avgSalaryPerMonth)}`}
          subtitle="Monthly earnings average"
          delay={0.25}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="green"
        />
        <InsightCard
          title="Avg Leave/Month"
          value={`${insights.avgLeavePerMonth.toFixed(1)} days`}
          subtitle="Estimated monthly leave"
          delay={0.35}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="orange"
        />
        <InsightCard
          title="Top Institute"
          value={insights.topInstitute[0]}
          subtitle={`${insights.topInstitute[1].hours.toFixed(1)}h total`}
          delay={0.45}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Institute Performance */}
        <div className="bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Institute Performance</h3>
          <div className="space-y-1">
            {insights.instituteStats.map(([name, stats], index) => (
              <ChartBar
                key={name}
                label={name}
                value={stats.hours}
                maxValue={insights.instituteStats[0][1].hours}
                color={index === 0 ? "blue" : "green"}
                delay={0.55 + index * 0.08}
              />
            ))}
          </div>
        </div>

        {/* Weekly Pattern */}
        <div className="bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Weekly Teaching Pattern</h3>
          <div className="space-y-1">
            {insights.weeklyStats.map((day, index) => (
              <ChartBar
                key={index}
                label={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                value={day.hours}
                maxValue={Math.max(...insights.weeklyStats.map(d => d.hours)) || 1}
                color={index === 0 || index === 6 ? "orange" : "blue"}
                delay={0.65 + index * 0.06}
              />
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-700/30 rounded-xl animate-fade-in" style={{ animationDelay: "1.1s" }}>
            <div className="text-sm text-slate-300">
              <span className="font-medium">Busiest day:</span> {insights.busiestDay.name} ({insights.busiestDay.hours.toFixed(1)}h)
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.7s" }}>
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover-lift">
          <div className="text-xl sm:text-2xl font-bold text-slate-200 animate-count-up">{insights.totalHours.toFixed(1)}h</div>
          <div className="text-xs text-slate-400 mt-1">Total Hours</div>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover-lift">
          <div className="text-xl sm:text-2xl font-bold text-slate-200 animate-count-up">₹{formatIndianCurrency(insights.totalSalary)}</div>
          <div className="text-xs text-slate-400 mt-1">Total Earnings</div>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover-lift">
          <div className="text-xl sm:text-2xl font-bold text-slate-200 animate-count-up">{insights.totalDays}</div>
          <div className="text-xs text-slate-400 mt-1">Teaching Days</div>
        </div>
        <div className="text-center p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover-lift">
          <div className="text-xl sm:text-2xl font-bold text-slate-200 animate-count-up">{Object.keys(insights.instituteStats).length}</div>
          <div className="text-xs text-slate-400 mt-1">Institutes</div>
        </div>
      </div>
    </div>
  );
}