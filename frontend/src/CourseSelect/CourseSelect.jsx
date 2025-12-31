import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./CourseSelect.css";
import logo from "../assets/logo.png";

export default function CourseSelect() {
    const navigate = useNavigate();
    useEffect(() =>{
        const done = localStorage.getItem("ts.course.selected");
        if(done) {
            navigate("/dashboard", {replace: true });
        }
    }, [navigate]);

    const handleSelect = useCallback(
        (course) => {
            localStorage.setItem("ts.course.selected", String(course));
            localStorage.setItem("ts.course.target_hours", String(course));
            navigate("/dashboard", { replace: true });
        },[navigate]
    );

    return (
        <div className="ts-course-page">
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

            <main className="ts-course-main">
                <div className="ts-course-cards">
                    <button
                        type="button"
                        className="ts-course-card"
                        onClick={() => handleSelect("2000")}
                        >
                        <div className="ts-course-card-title">2000時間コース</div>
                        <div className="ts-course-card-text">
                            1週間で20時間<br />
                            学習することが<br />
                            目標となる。<br />
                            正直これでも<br />
                            きつい。<br />
                            <br />
                        </div>
                    </button>

                    <button
                        type="button"
                        className="ts-course-card"
                        onClick={() => handleSelect("3000")}
                        >
                        <div className="ts-course-card-title">3000時間コース</div>
                        <div className="ts-course-card-text">
                            1週間で30時間<br />
                            学習することが<br />
                            目標となる。<br />
                            このコースを<br />
                            完走できれば<br />
                            別人になれる。
                        </div>
                    </button>
                </div>

                <p className="ts-text">2年間の学習ペースに大きく関わってきます</p>
                <p className="ts-warning">※途中で変更できません</p>
            </main>
        </div>
    );
}