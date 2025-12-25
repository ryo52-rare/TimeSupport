import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Setting.css";
import logo from "../assets/logo.png";

const COURSE_OPTIONS = [
    { value: "2000", label: "2000時間コース" },
    { value: "3000", label: "3000時間コース" },
];

export default function Setting() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [emailConfirm, setEmailConfirm] = useState("");
    const [password, setPassword] = useState("");
    const [course, setCourse] = useState("");
    const [initialCourse, setInitialCourse] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const n = localStorage.getItem("ts.user.name") ?? "";
        const e = localStorage.getItem("ts.user.email") ?? "";
        const c = localStorage.getItem("ts.course.selected") ?? "";

        setUserName(n);
        setEmail(e);
        setEmailConfirm(e);
        setCourse(c);
        setInitialCourse(c);
    }, []);

    const isCourseLocked = initialCourse === "3000";

    const isValid = useMemo(() => {
        if (!userName.trim()) return false;
        if (!email.trim()) return false;
        if (!emailConfirm.trim()) return false;
        if (email.trim() !== emailConfirm.trim()) return false;
        if (password.trim() && password.trim().length < 8) return false;
        if (!course) return false;
        if (isCourseLocked && course !== "3000") return false;

        return true;
    }, [userName, email, emailConfirm, password, course, isCourseLocked]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userName.trim()) return setErrorMessage("※未入力の項目があります");
        if (!email.trim() || !emailConfirm.trim())
        return setErrorMessage("※未入力の項目があります");
        if (email.trim() !== emailConfirm.trim())
        return setErrorMessage("※メールアドレスまたはパスワードが一致しません");
        if (!course) return setErrorMessage("※コース名を選択してください");
        if (password.trim() && password.trim().length < 8)
        return setErrorMessage("※パスワードは8文字以上で入力してください");
        if (isCourseLocked && course !== "3000") {
        return setErrorMessage("※3000時間コースは変更できません");
        }

        setErrorMessage("");

        localStorage.setItem("ts.user.name", userName.trim());
        localStorage.setItem("ts.user.email", email.trim());
        localStorage.setItem("ts.course.selected", course);
        localStorage.setItem("ts.course.target_hours", course);

        navigate("/dashboard", { replace: true });
    };

    return (
        <div className="ts-setting-page">
        <header className="ts-header">
            <div className="ts-logo">
                <img src={logo} alt="logo" className="ts-logo-img" />
            </div>

            <div className="ts-title-band">
                <h1 className="ts-title">Time support</h1>
            </div>
        </header>

        <main className="ts-setting-main">
            <form className="ts-setting-form" onSubmit={handleSubmit}>
                {errorMessage && <p className="ts-error">{errorMessage}</p>}

            <div className="ts-field">
                <label className="ts-label">名前</label>
                <input
                    className="ts-input"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}/>
            </div>

            <div className="ts-field">
                <label className="ts-label">メールアドレス</label>
                <input
                    className="ts-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div className="ts-field">
                <label className="ts-label">メールアドレス(確認)</label>
                <input
                    className="ts-input"
                    type="email"
                    value={emailConfirm}
                    onChange={(e) => setEmailConfirm(e.target.value)}/>
            </div>

            <div className="ts-field">
                <label className="ts-label">パスワード(変更用)</label>
                <input
                    className="ts-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""/>
            </div>

            <div className="ts-field">
                <label className="ts-label">選択したコース名</label>
                <select
                    className="ts-select"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    disabled={isCourseLocked}>
                {COURSE_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                    {c.label}
                    </option>
                ))}
                </select>

                {isCourseLocked && (
                <p className="ts-note">※3000時間コースは変更できません</p>
                )}
            </div>

            <button className="ts-submit" type="submit" disabled={!isValid}>
                変更
            </button>
            </form>
        </main>
        </div>
    );
}
