import "./Dashboard.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodayInput from "./components/TodayInput";
import MonthlyCalendar from "./components/MonthlyCalendar";
import SummaryCards from "./components/SummaryCards";
import StudyChart from "./components/StudyChart";
import { minutesToHHMM, hhmmToMinutes, isoDate } from "../utils/time";
import logo from "../assets/logo.png";
import icon from "../assets/icon.png";

export default function DashboardPage() {
    const [todayMinutes, setTodayMinutes] = useState(0);
    const [todayInput, setTodayInput] = useState("00:00");
    const [calendarData, setCalendarData] = useState({});
    const [summary, setSummary] = useState(null);
    const [startKey, setStartKey] = useState(null);

    const targetHours = useMemo(() => {
        const t = localStorage.getItem("ts.course.target_hours");
        return t ? Number(t) : null;
    }, []);

    const today = useMemo(() => new Date(), []);
    const todayKey = useMemo(() => isoDate(today), [today]);

    useEffect(() => {
        const cal = localStorage.getItem("ts.study.calendar");
        if (cal) setCalendarData(JSON.parse(cal));
        const s = localStorage.getItem("ts.course.start_date");
        if (s) setStartKey(s);
    }, []);

    useEffect(() => {
        localStorage.setItem("ts.study.calendar", JSON.stringify(calendarData));
    }, [calendarData]);

    useEffect(() => {
        const mins = calendarData[todayKey];
        if (typeof mins === "number") {
            setTodayMinutes(mins);
            setTodayInput(minutesToHHMM(mins));
        }
    }, [calendarData, todayKey]);

    useEffect(() => {
        const keys = Object.keys(calendarData);
        const now = new Date();

        let weekTotal = 0;
        let monthTotal = 0;
        let monthDays = 0;

        keys.forEach((k) => {
        const [y, m, d] = k.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        const mins = calendarData[k] ?? 0;
        const diff = Math.floor((now - date) / (24 * 60 * 60 * 1000));

        if (diff >= 0 && diff < 7) weekTotal += mins;
        if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
            monthTotal += mins;
            monthDays += 1;
        }
        });

        setSummary({
            weekTotal,
            monthTotal,
            avgPerDay: monthDays ? Math.round(monthTotal / monthDays) : 0,
        });
    }, [calendarData]);

    const handleRegister = () => {
        const mins = hhmmToMinutes(todayInput);
        if (mins === null) {
            alert("時間の形式が正しくありません");
        return;
        }
        if (!startKey) {
            setStartKey(todayKey);
            localStorage.setItem("ts.course.start_date", todayKey);
        }
        setTodayMinutes(mins);
        setCalendarData((prev) => ({ ...prev, [todayKey]: mins }));
    };

    const chartData = useMemo(() => {
        return Object.entries(calendarData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7)
        .map(([date, minutes]) => ({ date, minutes }));
    }, [calendarData]);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("ts.course.start_date");
        localStorage.removeItem("ts.study.calendar");
        navigate("/", { replace: true });
    };

    return (
        <div className="ts-dashboard-page">
        <header className="ts-header">
            <div className="ts-header-left">
                <img src={logo} alt="logo" className="ts-logo-img" />
            </div>

            <div className="ts-title-band">
                <h1 className="ts-title">Time support</h1>
            </div>

            <div className="ts-header-right">
                <button type="button" className="ts-user-btn">
                    <img src={icon} alt="user" className="ts-user-icon" />
                </button>
            </div>
        </header>

        <main className="ts-dashboard-main">
            <div className="ts-dashboard-panel">
                <div className="ts-panel ts-panel--today">
                    <TodayInput
                        valueHHMM={minutesToHHMM(todayMinutes)}
                        inputHHMM={todayInput}
                        onInputChange={setTodayInput}
                        onRegister={handleRegister}/>
                </div>

                <div className="ts-panel ts-panel--wide">
                    <MonthlyCalendar data={calendarData} />
                </div>

                <div className="ts-panel ts-panel--wide">
                    <SummaryCards
                        summary={summary}
                        calendarData={calendarData}
                        todayKey={todayKey}
                        targetHours={targetHours}
                        startKey={startKey} />
                </div>

                <div className="ts-panel ts-panel--wide">
                    <StudyChart data={chartData} />
                </div>

                <button className="ts-dashboard-logout" onClick={handleLogout}>
                    ログアウト
                </button>
            </div>
        </main>
        </div>
    );
}
