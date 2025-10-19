import React from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DetailsPanel({ city, ICON, unit, toUnit }) {
  if (!city) {
    return (
      <div className="empty">
        <p>Select a city to see details.</p>
      </div>
    );
  }

  const temps = city.week ?? [];
  const min = Math.min(...temps);
  const max = Math.max(...temps);

  return (
    <div className="detail-inner">
      <div className="detail-head">
        <div className="emoji" aria-hidden>{ICON[city.condition] ?? "🌤️"}</div>
        <div className="head-text">
          <h2 className="detail-title">{city.name}</h2>
          <div className="muted">
            Condition: <strong>{city.condition}</strong>
          </div>
        </div>
        <div className="big-temp">
          {toUnit(city.tempF)}°{unit}
        </div>
      </div>

      <div className="bar-row">
        {temps.map((tF, i) => {
          const t = toUnit(tF);
          const pct = ((tF - min) / Math.max(1, max - min)) * 100;
          return (
            <div className="bar-col" key={i}>
              <div className="bar">
                <div className="fill" style={{ height: `${25 + pct * 0.7}%` }} />
              </div>
              <div className="bar-t">{t}°{unit}</div>
              <div className="bar-d">{DAYS[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
