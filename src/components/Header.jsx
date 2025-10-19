import React from "react";

export default function Header({ title = "Weather", stats, onToggleUnit }) {
  return (
    <header className="header panel">
      <div className="brand">
        <span className="logo">WU</span>
        <h1 className="title">{title}</h1>
      </div>

      <div className="header-stats">
        <span className="pill">
          Avg: <strong>{stats.avg}°{stats.unit}</strong>
        </span>
        <span className="pill">
          High: <strong>{stats.high}°{stats.unit}</strong>
        </span>
        <span className="pill">
          Low: <strong>{stats.low}°{stats.unit}</strong>
        </span>
        <button className="btn" onClick={onToggleUnit}>
          Toggle °{stats.unit === "F" ? "C" : "F"}
        </button>
      </div>
    </header>
  );
}
