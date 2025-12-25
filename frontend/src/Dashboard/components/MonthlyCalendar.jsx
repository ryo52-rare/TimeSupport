// src/Dashboard/components/MonthlyCalendar.jsx
import "./MonthlyCalendar.css";
import { isoDate, minutesToHHMM } from "../../utils/time";

const WEEKDAYS = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"];

function toMondayStartIndex(jsDay) {
    return (jsDay + 6) % 7;
    }

export default function MonthlyCalendar({ data = {} }) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const offset = toMondayStartIndex(first.getDay());

    const cells = Array.from({ length: 35 }, (_, i) => {
        const dayNum = i - offset + 1;
        if (dayNum < 1 || dayNum > daysInMonth) return null;
        return new Date(year, month, dayNum);
    });

return (
    <section className="mc">
        <div className="mc-top">
            <div className="mc-month">{year}/{String(month + 1).padStart(2, "0")}</div>
            <div className="mc-title">カレンダー</div>
            <div className="mc-spacer" />
        </div>

        <div className="mc-table">
            <div className="mc-head">
            {WEEKDAYS.map((w) => (
                <div key={w} className="mc-head-cell">{w}</div>
        ))}
        </div>

        <div className="mc-body">
            {cells.map((date, idx) => {
                if (!date) {
                    return <div key={idx} className="mc-cell mc-cell--empty" />;
                }

                const key = isoDate(date);
                const mins = data[key];

                return (
                    <div key={key} className="mc-cell">
                        <div className="mc-day">{date.getDate()}</div>
                        {typeof mins === "number" && (
                            <div className="mc-time">{minutesToHHMM(mins)}</div>
                        )}
                    </div>
                );
            })}
        </div>
        </div>
    </section>
    );
}
