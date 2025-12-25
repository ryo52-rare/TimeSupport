import "./StudyChart.css";
import { useMemo, useState } from "react";
import { minutesToHHMM } from "../../utils/time";

function formatYMD(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function startOfWeekMonday(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    return d;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

function monthKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
}

function sumMinutesOnDay(calendarData, dayDate) {
    const key = formatYMD(dayDate);
    const v = calendarData?.[key];
    return typeof v === "number" ? v : 0;
}

function buildDaily(calendarData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out = [];
    for (let i = 6; i >= 0; i--) {
        const d = addDays(today, -i);
        const mins = sumMinutesOnDay(calendarData, d);
        out.push({ label: formatYMD(d).slice(5), minutes: mins });
    }
    return out;
}

function buildWeekly(calendarData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeekStart = startOfWeekMonday(today);
    const out = [];
    for (let w = 7; w >= 0; w--) {
        const ws = addDays(thisWeekStart, -7 * w);
        let total = 0;
        for (let i = 0; i < 7; i++) {
        total += sumMinutesOnDay(calendarData, addDays(ws, i));
        }
        const label = formatYMD(ws).slice(5);
        out.push({ label, minutes: total });
    }
    return out;
}

function buildMonthly(calendarData) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const cur = new Date(now.getFullYear(), now.getMonth(), 1);
    const out = [];
    for (let i = 11; i >= 0; i--) {
        const mStart = addMonths(cur, -i);
        const mk = monthKey(mStart);
        let total = 0;
        for (const [key, mins] of Object.entries(calendarData || {})) {
        if (typeof mins !== "number") continue;
        if (key.startsWith(mk)) total += mins;
        }
        const label = mk.slice(2);
        out.push({ label, minutes: total });
    }
    return out;
}

export default function StudyChart({ calendarData }) {
    const [mode, setMode] = useState("day");

    const chartData = useMemo(() => {
        if (mode === "week") return buildWeekly(calendarData);
        if (mode === "month") return buildMonthly(calendarData);
        return buildDaily(calendarData);
    }, [calendarData, mode]);

    const hasAny = chartData.some((d) => (d?.minutes ?? 0) > 0);
    const max = Math.max(...chartData.map((d) => d.minutes), 1);

    return (
        <div className="study-chart">
        <div className="study-chart-head">
            <div className="study-chart-tabs">
            <button
                className={`tab ${mode === "day" ? "is-active" : ""}`}
                type="button"
                onClick={() => setMode("day")}>日</button>
            <button
                className={`tab ${mode === "week" ? "is-active" : ""}`}
                type="button"
                onClick={() => setMode("week")}>週</button>
            <button
                className={`tab ${mode === "month" ? "is-active" : ""}`}
                type="button"
                onClick={() => setMode("month")}>月</button>
            </div>

            <div className="study-chart-title">グラフ</div>
            <div className="study-chart-spacer" /></div>

        <div className="study-chart-body">
            {!hasAny ? (
            <div className="chart-empty">まだデータがありません</div>
            ) : (
            <div className={`chart ${mode}`}>
                {chartData.map((d) => {
                const height = (d.minutes / max) * 100;
                return (
                    <div key={d.label} className="bar-wrap">
                    <div
                        className="bar"
                        style={{ height: `${height}%` }}
                        title={`${d.label} : ${minutesToHHMM(d.minutes)}`}/>
                    <span className="bar-label">{d.label}</span>
                    </div>
                );
                })}
            </div>
            )}
        </div>
        </div>
    );
}
