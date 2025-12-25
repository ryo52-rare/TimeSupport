import "./TodayInput.css";

export default function TodayInput({ inputHHMM, onInputChange, onRegister }) {
    return (
        <section className="today-card">
        <div className="today-title">本日の学習時間</div>
        <div className="today-row">
            <input
                className="today-time-big"
                type="time"
                value={inputHHMM}
                onChange={(e) => onInputChange(e.target.value)}
                step="60"/>

            <button
                className="today-register"
                type="button"
                onClick={onRegister}>
                登録
                </button>
            </div>
        </section>
    );
}
