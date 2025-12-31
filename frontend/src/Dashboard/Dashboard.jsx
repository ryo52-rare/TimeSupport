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

const API_BASE = "http://localhost:8000";

const API = {
  monthLogs: (monthKey) => `/api/auth/study/logs/?month=${monthKey}`,
  dayUpsert: (day) => `/api/auth/study/logs/${day}/`,
};

function getAccessToken() {
  return localStorage.getItem("ts.auth.access");
}

async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (options.body != null && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [todayInput, setTodayInput] = useState("00:00");
  const [calendarData, setCalendarData] = useState({});
  const [summary, setSummary] = useState(null);
  const [startKey, setStartKey] = useState(null);

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => isoDate(today), [today]);

  const targetHours = useMemo(() => {
    const course = localStorage.getItem("ts.course.target_hours");
    return course ? Number(course) : null;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, "0");
        const monthKey = `${y}-${m}`;

        const logs = await apiFetch(API.monthLogs(monthKey));

        const cal = {};
        for (const row of logs ?? []) {
          cal[row.date] = row.minutes;
        }
        setCalendarData(cal);

        const s = localStorage.getItem("ts.course.start_date");
        if (s) setStartKey(s);
      } catch (e) {
        if (String(e.message).includes("HTTP 401")) {
          navigate("/", { replace: true });
        }
      }
    })();
  }, [navigate, today]);

  useEffect(() => {
    const mins = calendarData[todayKey];
    if (typeof mins === "number") {
      setTodayInput(minutesToHHMM(mins));
    } else {
      setTodayInput("00:00");
    }
  }, [calendarData, todayKey]);

  useEffect(() => {
    const now = new Date();
    let weekTotal = 0;
    let monthTotal = 0;
    let monthDays = 0;

    Object.entries(calendarData).forEach(([k, mins]) => {
      const [y, m, d] = k.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      const diff = Math.floor((now - date) / (24 * 60 * 60 * 1000));

      if (diff >= 0 && diff < 7) weekTotal += mins;
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      ) {
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

  const handleRegister = async () => {
    const mins = hhmmToMinutes(todayInput);
    if (mins === null) {
      alert("時間の形式が正しくありません");
      return;
    }

    try {
      await apiFetch(API.dayUpsert(todayKey), {
        method: "PUT",
        body: JSON.stringify({ minutes: mins }),
      });

      if (!startKey) {
        setStartKey(todayKey);
        localStorage.setItem("ts.course.start_date", todayKey);
      }

      setCalendarData((prev) => ({ ...prev, [todayKey]: mins }));
    } catch {
      alert("登録に失敗しました");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ts.auth.access");
    localStorage.removeItem("ts.auth.refresh");
    navigate("/", { replace: true });
  };

  return (
    <div className="ts-dashboard-page">
      <header className="ts-header">
        <div className="ts-logo">
          <img src={logo} alt="logo" className="ts-logo-img" />
        </div>

        <div className="ts-title-band">
          <h1 className="ts-title">Time support</h1>
        </div>

        <div className="ts-header-right">
          <button
            type="button"
            className="ts-user-btn"
            onClick={() => navigate("/setting")}
          >
            <img src={icon} alt="user" className="ts-user-icon" />
          </button>
        </div>
      </header>

      <main className="ts-dashboard-main">
        <div className="ts-dashboard-panel">
          <div className="ts-panel ts-panel--today">
            <TodayInput
              inputHHMM={todayInput}
              onInputChange={setTodayInput}
              onRegister={handleRegister}
            />
          </div>

          <div className="ts-panel ts-panel--wide">
            <MonthlyCalendar data={calendarData} />
          </div>

          <div className="ts-panel ts-panel--wide">
            <SummaryCards
              summary={summary}
              calendarData={calendarData}
              todayKey={todayKey}
              startKey={startKey}
              targetHours={targetHours}
            />
          </div>

          <div className="ts-panel ts-panel--wide">
            <StudyChart calendarData={calendarData} />
          </div>

          <button className="ts-dashboard-logout" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </main>
    </div>
  );
}
