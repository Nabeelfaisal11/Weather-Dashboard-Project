import React from "react";

export default function CityGrid({
  cities,
  ICON,
  toUnit,
  selectedId,
  onSelect,
  onDelete,
}) {
  return (
    <div>
      <div className="cg-row">
        {cities.map((c) => (
          <article
            key={c.id}
            className={`city-card ${selectedId === c.id ? "is-active" : ""}`}
            onClick={() => onSelect(c.id)}
            role="button"
            title={`View ${c.name}`}
          >
            <div className="ico" aria-hidden>{ICON[c.condition] ?? "🌤️"}</div>
            <div className="title">{c.name}</div>
            <div className="cond">{c.condition}</div>
            <div className="t">{toUnit(c.tempF)}°</div>
            <button
              className="btn-del"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
              title={`Delete ${c.name}`}
            >
              🗑️ Delete
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
