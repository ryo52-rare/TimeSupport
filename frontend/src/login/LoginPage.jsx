import { useState } from "react";
import "./LoginPage.css"
import myPhoto from "../assets/office.jpg"
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasError(true);
  };

  const handleRegisterClick = () => {
    console.log("新規登録ボタンクリック");
  };

  return (
    <div className="ts-login-page">
      <header className="ts-header">
        <div className="ts-logo">
          <img
            src={logo}
            alt="logo"
            className="ts-logo-img"/>
        </div>
        <div className="ts-title-band">
          <h1 className="ts-title">Time support</h1>
        </div>
      </header>

      <main className="ts-main">
        <section className="ts-hero">
          <div className="ts-hero-image-wrapper">
            <img
              src={myPhoto}
              alt="office"
              className="ts-hero-image"
            />
          </div>
        </section>

        <section className="ts-form-area">
          <div className="ts-error-row">
            {hasError &&(
              <p className="ts-error-text">
                ※メールアドレスまたはパスワードが違います
              </p>
            )}
          </div>

          <form className="ts-form" onSubmit={handleSubmit}>
            <div className="ts-form-group">
              <label className="ts-label" htmlFor="email">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                className="ts-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="ts-form-group">
              <label className="ts-label" htmlFor="password">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                className="ts-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="ts-button-row">
              <button type="submit" className="ts-button ts-button-login">
                ログイン
              </button>
            </div>
          </form>

              <button
              type="button"
              className="ts-button ts-button-register">
                新規登録
              </button>
        </section>
      </main>
    </div>
  );
}
