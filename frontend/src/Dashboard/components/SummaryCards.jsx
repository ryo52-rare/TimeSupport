import "./SummaryCards.css";
import { minutesToHHMM, minutesToSignedHHMM } from "../../utils/time";

function parseISO(key) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function formatISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function addYears(date, years) {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return d;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function dayBetweenInclusive(startKey, endKey) {
    const s = parseISO(startKey);
    const e = parseISO(endKey);
    const ms = e - s;
    const days = Math.floor(ms / (24 * 60 * 60 * 1000)) + 1;
    return Math.max(days, 1);
}

function sumMinutesFromTo(calendarData, startKey, endKey) {
    const s = parseISO(startKey);
    const e = parseISO(endKey);
    let total = 0;

    for (const [key, mins] of Object.entries(calendarData || {})) {
        if (typeof mins !== "number") continue;
        const d = parseISO(key);
        if (d >= s && d <= e) total += mins;
    }
    return total;
}

function getTwoYearEndKey(startKey) {
    const start = parseISO(startKey);
    const end = addDays(addYears(start, 2), -1);
    return formatISO(end);
}

export default function SummaryCards({ summary, calendarData, todayKey, targetHours, startKey }) {
    if (!summary) return null;

    const weekTotal = summary.weekTotal ?? 0;
    const monthTotal = summary.monthTotal ?? 0;

    const canDiff = Boolean(startKey && todayKey && targetHours != null);

    let diffText = "--:--";
    if (canDiff) {
        const startDate = parseISO(startKey);
        const todayDate = parseISO(todayKey);
        const effectiveTodayKey = todayDate < startDate ? startKey : todayKey;

        const endKey = getTwoYearEndKey(startKey);
        const totalPlanDays = dayBetweenInclusive(startKey, endKey);

        const targetTotalMinutes = targetHours * 60;
        const targetDailyMinutes = targetTotalMinutes / totalPlanDays;

        const daysElapsed = dayBetweenInclusive(startKey, effectiveTodayKey);
        const totalMinutes = sumMinutesFromTo(calendarData, startKey, effectiveTodayKey);
        const carryDiffMinutes = totalMinutes - targetDailyMinutes * daysElapsed;

        diffText = minutesToSignedHHMM(Math.round(carryDiffMinutes));
    }

    return (
        <section className="summary-cards">
        <div className="summary-card">
            <p className="summary-label">週合計</p>
            <p className="summary-value">{minutesToHHMM(weekTotal)}</p>
        </div>

        <div className="summary-card">
            <p className="summary-label">月合計</p>
            <p className="summary-value">{minutesToHHMM(monthTotal)}</p>
        </div>

        <div className="summary-card">
            <p className="summary-label">現在の差分</p>
            <p className="summary-value">{diffText}</p>
        </div>
        </section>
    );
}
