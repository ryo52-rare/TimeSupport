import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import logo from "../assets/logo.png";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
const REGISTER_URL = `${API_BASE}/api/auth/register/`;

export default function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailConfirm, setEmailConfirm] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedEmailConfirm = emailConfirm.trim();
        const trimmedPassword = password.trim();
        const trimmedPasswordConfirm = passwordConfirm.trim();

        if (
            !trimmedName ||
            !trimmedEmail ||
            !trimmedEmailConfirm ||
            !trimmedPassword ||
            !trimmedPasswordConfirm
        ) {
            setErrorMessage("※未入力の項目があります");
            return;
        }

        if (trimmedEmail !== trimmedEmailConfirm) {
            setErrorMessage("※メールアドレスが一致しません");
            return;
        }

        if (trimmedPassword !== trimmedPasswordConfirm) {
            setErrorMessage("※パスワードが一致しません");
            return;
        }

        setErrorMessage("");

        try {
            const res = await fetch(REGISTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: trimmedName,
                    email: trimmedEmail,
                    password: trimmedPassword,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                setErrorMessage(`登録に失敗しました (HTTP ${res.status}) \n${text}`);
                return;
            }

            navigate("/course");
        } catch (e) {
            setErrorMessage("登録に失敗しました");
        }
    };

    return (
        <div className="ts-signup-page">
            <header className="ts-header">
                <div className="ts-logo">
                    <img src={logo}
                        alt="logo"
                        className="ts-logo-img" />
                </div>
                <div className="ts-title-band">
                    <h1 className="ts-title">Time support</h1>
                </div>
            </header>

        <main className="ts-signup-main">
            <div className="ts-signup-panel">
                <div className="ts-error-row">
                    {errorMessage && (
                    <p className="ts-error-message">{errorMessage}</p>
                    )}
                </div>

            <form className="ts-signup-form" onSubmit={handleSubmit}>
                <div className="ts-form-group">
                    <label className="ts-label" htmlFor="name">
                        名前
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="ts-input-signup"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="ts-form-group">
                    <label className="ts-label" htmlFor="email">
                        メールアドレス
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="ts-input-signup"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="ts-form-group">
                    <label className="ts-label" htmlFor="emailConfirm">
                        メールアドレス(確認)
                    </label>
                    <input
                        id="emailConfirm"
                        type="email"
                        className="ts-input-signup"
                        value={emailConfirm}
                        onChange={(e) => setEmailConfirm(e.target.value)}
                    />
                </div>

                <div className="ts-form-group">
                    <label className="ts-label" htmlFor="password">
                        パスワード
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="ts-input-signup"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="ts-form-group">
                    <label className="ts-label" htmlFor="passwordConfirm">
                        パスワード(確認)
                    </label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        className="ts-input-signup"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                </div>

                <button type="submit" className="ts-submit-button">
                登録
                </button>
            </form>
            </div>
        </main>
        </div>
    );
}
