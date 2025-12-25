export function pad2(n) {
    return String(n).padStart(2, "0");
}

export function minutesToHHMM(minsAbs) {
    const h = Math.floor(minsAbs / 60);
    const m = minsAbs % 60;
    return `${pad2(h)}:${pad2(m)}`;
}

export function hhmmToMinutes(hhmm) {
    const [hh, mm] = hhmm.split(":");
    const h = Number(hh);;
    const m = Number(mm);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
}

export function minutesToSignedHHMM(mins) {
    const sign = mins >= 0 ? "+" : "-";
    const abs = Math.abs(mins);
    return `${sign}${minutesToHHMM(abs)}`;
}

export function isoDate(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}