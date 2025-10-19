import React, { useMemo, useState, useCallback } from "react";
import Header from "./components/Header.jsx";
import CityGrid from "./components/CityGrid.jsx";
import DetailsPanel from "./components/DetailsPanel.jsx";
import SubscribeBar from "./components/SubscribeBar.jsx";
import "./styles.css";

/* ---------------- Icons ---------------- */
const ICON = {
  sunny: "☀️",
  cloudy: "☁️",
  rain: "🌧️",
  drizzle: "🌦️",
  storm: "⛈️",
  snow: "❄️",
};

/* Helper to make a 7-day week from a base temp */
function mockWeekFrom(tempF) {
  const bumps = [-2, +1, +3, +2, -1, -3, -4];
  return bumps.map((b) => tempF + b);
}

/* ---------------- Seed Data ---------------- */
const SEED = [
  { id: 1, name: "New York",    tempF: 72, condition: "sunny",   week: mockWeekFrom(72) },
  { id: 2, name: "Chicago",     tempF: 65, condition: "rain",    week: mockWeekFrom(65) },
  { id: 3, name: "Miami",       tempF: 84, condition: "cloudy",  week: mockWeekFrom(84) },
  { id: 4, name: "Seattle",     tempF: 60, condition: "drizzle", week: mockWeekFrom(60) },
  { id: 5, name: "Los Angeles", tempF: 50, condition: "snow",    week: mockWeekFrom(50) },
];

/* ============================================================
   App
   ============================================================ */
export default function App() {
  /* State */
  const [cities, setCities] = useState(SEED);
  const [unit, setUnit] = useState("F");
  const [selectedId, setSelectedId] = useState(SEED[0]?.id ?? null);

  /* Add/Search form state */
  const [newName, setNewName] = useState("");
  const [newTemp, setNewTemp] = useState("");
  const [newCond, setNewCond] = useState("sunny");
  const [query, setQuery] = useState("");

  /* Converters */
  const toUnit = useCallback(
    (f) => (unit === "F" ? f : Math.round(((f - 32) * 5) / 9)),
    [unit]
  );

  /* Selected city */
  const selected = useMemo(
    () => cities.find((c) => c.id === selectedId) ?? null,
    [cities, selectedId]
  );

  /* Header stats (based on current cities list) */
  const stats = useMemo(() => {
    const list = cities.length ? cities : SEED;
    const temps = list.map((c) => c.tempF);
    const avgF = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
    const highF = Math.max(...temps);
    const lowF = Math.min(...temps);
    return { avg: toUnit(avgF), high: toUnit(highF), low: toUnit(lowF), unit };
  }, [cities, toUnit, unit]);

  /* Actions */
  function toggleUnit() {
    setUnit((u) => (u === "F" ? "C" : "F"));
  }

  function addCity(e) {
    e?.preventDefault?.();
    const name = newName.trim();
    const t = Number(newTemp);
    const cond = newCond.trim();
    if (!name || Number.isNaN(t) || !cond) return;

    const city = {
      id: Date.now(),
      name,
      tempF: t,
      condition: cond,
      week: mockWeekFrom(t),
    };
    setCities((prev) => [city, ...prev]);
    setSelectedId(city.id);

    /* Reset form */
    setNewName("");
    setNewTemp("");
    setNewCond("sunny");
    setQuery("");
  }

  function removeCity(id) {
    setCities((prev) => prev.filter((c) => c.id !== id));
    if (id === selectedId) {
      const next = cities.find((c) => c.id !== id);
      setSelectedId(next?.id ?? null);
    }
  }

  /* Filter list by query */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, query]);

  return (
    <div className="wrap">
      {/* Sticky glossy header */}
      <Header
        title="Weather Dashboard"
        stats={stats}
        onToggleUnit={toggleUnit}
      />

      {/* Add/Search bar */}
      <form className="controls-bar panel" onSubmit={addCity}>
        <div className="control-group">
          <input
            className="input"
            type="text"
            placeholder="🔎  Search cities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="divider" />

        <div className="control-group">
          <input
            className="input"
            type="text"
            placeholder="City name (e.g., Boston)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <input
            className="input"
            type="number"
            placeholder={`Temp (°${unit})`}
            value={newTemp}
            onChange={(e) => setNewTemp(e.target.value)}
            required
          />
          <select
            className="input"
            value={newCond}
            onChange={(e) => setNewCond(e.target.value)}
          >
            <option value="sunny">sunny</option>
            <option value="cloudy">cloudy</option>
            <option value="rain">rain</option>
            <option value="drizzle">drizzle</option>
            <option value="storm">storm</option>
            <option value="snow">snow</option>
          </select>
          <button type="submit" className="btn">+ Add</button>
        </div>
      </form>

      {/* Two column layout */}
      <div className="grid-and-detail">
        {/* LEFT: City Grid */}
        <div className="panel city-grid">
          <CityGrid
            cities={filtered}
            ICON={ICON}
            unit={unit}
            toUnit={toUnit}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={removeCity}
          />
        </div>

        {/* RIGHT: Details Panel */}
        <section className="panel detail">
          <DetailsPanel
            city={selected}
            ICON={ICON}
            unit={unit}
            toUnit={toUnit}
          />
        </section>
      </div>

      {/* Subscribe bar */}
      <SubscribeBar />

      <footer className="foot">
        © {new Date().getFullYear()} Weather Dashboard Pro
      </footer>
    </div>
  );
}
