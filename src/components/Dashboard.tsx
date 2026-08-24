import { useState, useEffect } from "react";

declare global {
  interface Window {
    storage: {
      get: (key: string) => Promise<{ value: string } | undefined>;
      set: (key: string, value: string) => Promise<void>;
    };
  }
}

type ColorOption = {
  id: string;
  label: string;
  colors: string[];
  count: number;
  school?: boolean;
};

type ChecklistItem = { id: string; text: string; done: boolean };

const DESIGNS = [
  { id: "axolotl",      name: "Axolotl",           beads: 114, cost: 1.42, fairPrice: 5, etsyPrice: 12, target: 20, emoji: "🦎" },
  { id: "lobster",      name: "Lobster",            beads: 96,  cost: 1.26, fairPrice: 5, etsyPrice: 11, target: 15, emoji: "🦞" },
  { id: "fish",         name: "Fish",               beads: 87,  cost: 1.13, fairPrice: 5, etsyPrice: 10, target: 20, emoji: "🐟" },
  { id: "platypus",     name: "Platypus",           beads: 85,  cost: 1.14, fairPrice: 5, etsyPrice: 10, target: 15, emoji: "🦆" },
  { id: "alligator",    name: "Alligator",          beads: 76,  cost: 1.01, fairPrice: 4, etsyPrice: 9,  target: 20, emoji: "🐊" },
  { id: "santa",        name: "Santa",              beads: 70,  cost: 0.95, fairPrice: 4, etsyPrice: 9,  target: 20, emoji: "🎅" },
  { id: "gecko",        name: "Gecko",              beads: 60,  cost: 0.84, fairPrice: 4, etsyPrice: 8,  target: 40, emoji: "🦎" },
  { id: "dragonfly",    name: "Dragonfly",          beads: 57,  cost: 0.83, fairPrice: 4, etsyPrice: 9,  target: 15, emoji: "🪲" },
  { id: "star_lg",      name: "Studley Star (lg)",  beads: 55,  cost: 0.81, fairPrice: 4, etsyPrice: 9,  target: 15, emoji: "⭐" },
  { id: "ladybug",      name: "Ladybug",            beads: 52,  cost: 0.76, fairPrice: 3, etsyPrice: 8,  target: 15, emoji: "🐞" },
  { id: "xmas_tree",    name: "Christmas Tree",     beads: 44,  cost: 0.67, fairPrice: 3, etsyPrice: 7,  target: 25, emoji: "🎄" },
  { id: "flower_chain", name: "Flower Chain",       beads: 42,  cost: 0.66, fairPrice: 3, etsyPrice: 7,  target: 15, emoji: "🌸" },
  { id: "crayon",       name: "Crayon",             beads: 33,  cost: 0.55, fairPrice: 2, etsyPrice: 6,  target: 30, emoji: "🖍️" },
  { id: "ice_cream",    name: "Ice Cream Cone",     beads: 32,  cost: 0.54, fairPrice: 2, etsyPrice: 6,  target: 15, emoji: "🍦" },
  { id: "star_sm",      name: "Studley Star (sm)",  beads: 25,  cost: 0.47, fairPrice: 2, etsyPrice: 6,  target: 20, emoji: "⭐" },
];

const COLOR_HEX: Record<string, string> = {
  "Dk Blue": "#2b6cb0",  "Lt Blue": "#63b3ed",   "Yellow": "#ecc94b",
  "Red": "#e53e3e",      "Orange": "#ed8936",     "Lt Green": "#68d391",
  "Dk Green": "#276749", "Black": "#1a202c",      "Pink": "#f687b3",
  "Dk Purple": "#6b46c1","White": "#e2e8f0",      "Brown": "#92400e",
  "Strawberry": "#fca5a5","Chocolate": "#6b3a2a", "Vanilla": "#fef3c7",
};

const DEFAULT_GECKO_COLORS: ColorOption[] = [
  { id: "dkblue_yellow",   label: "Dk Blue / Yellow",   colors: ["Dk Blue","Yellow"],             count: 18, school: true },
  { id: "red_orange",      label: "Red / Orange",        colors: ["Red","Orange"],                 count: 1 },
  { id: "orange_red",      label: "Orange / Red",        colors: ["Orange","Red"],                 count: 1 },
  { id: "red_ltgreen",     label: "Red / Lt Green",      colors: ["Red","Lt Green"],               count: 1 },
  { id: "red_black",       label: "Red / Black",         colors: ["Red","Black"],                  count: 1 },
  { id: "red_pink",        label: "Red / Pink",          colors: ["Red","Pink"],                   count: 1 },
  { id: "red_dkpurple",    label: "Red / Dk Purple",     colors: ["Red","Dk Purple"],              count: 1 },
  { id: "red_yellow",      label: "Red / Yellow",        colors: ["Red","Yellow"],                 count: 1 },
  { id: "red_dkblue",      label: "Red / Dk Blue",       colors: ["Red","Dk Blue"],                count: 1 },
  { id: "red_ltblue",      label: "Red / Lt Blue",       colors: ["Red","Lt Blue"],                count: 1 },
  { id: "red_dkgreen",     label: "Red / Dk Green",      colors: ["Red","Dk Green"],               count: 1 },
  { id: "red_white",       label: "Red / White",         colors: ["Red","White"],                  count: 1 },
  { id: "dkblue_ltblue",   label: "Dk Blue / Lt Blue",   colors: ["Dk Blue","Lt Blue"],            count: 1 },
  { id: "white_red",       label: "White / Red",         colors: ["White","Red"],                  count: 1 },
  { id: "white_orange",    label: "White / Orange",      colors: ["White","Orange"],               count: 1 },
  { id: "white_yellow",    label: "White / Yellow",      colors: ["White","Yellow"],               count: 1 },
  { id: "white_ltgreen",   label: "White / Lt Green",    colors: ["White","Lt Green"],             count: 1 },
  { id: "white_dkgreen",   label: "White / Dk Green",    colors: ["White","Dk Green"],             count: 1 },
  { id: "white_ltblue",    label: "White / Lt Blue",     colors: ["White","Lt Blue"],              count: 1 },
  { id: "white_dkpurple",  label: "White / Dk Purple",   colors: ["White","Dk Purple"],            count: 1 },
  { id: "white_black",     label: "White / Black",       colors: ["White","Black"],                count: 1 },
];

const DEFAULT_CRAYON_COLORS: ColorOption[] = [
  { id: "red",      label: "Red",       colors: ["Red"],       count: 1 },
  { id: "orange",   label: "Orange",    colors: ["Orange"],    count: 1 },
  { id: "yellow",   label: "Yellow",    colors: ["Yellow"],    count: 1 },
  { id: "pink",     label: "Pink",      colors: ["Pink"],      count: 1 },
  { id: "lt_green", label: "Lt Green",  colors: ["Lt Green"],  count: 1 },
  { id: "dk_green", label: "Dk Green",  colors: ["Dk Green"],  count: 1 },
  { id: "lt_blue",  label: "Lt Blue",   colors: ["Lt Blue"],   count: 1 },
  { id: "dk_blue",  label: "Dk Blue",   colors: ["Dk Blue"],   count: 1 },
  { id: "dk_purple",label: "Dk Purple", colors: ["Dk Purple"], count: 1 },
  { id: "black",    label: "Black",     colors: ["Black"],     count: 1 },
  { id: "brown",    label: "Brown",     colors: ["Brown"],     count: 1 },
  { id: "white",    label: "White",     colors: ["White"],     count: 1 },
];

const DEFAULT_ICE_CREAM_COLORS: ColorOption[] = [
  { id: "strawberry",  label: "Strawberry",  colors: ["Strawberry"],                            count: 1 },
  { id: "chocolate",   label: "Chocolate",   colors: ["Chocolate"],                             count: 1 },
  { id: "vanilla",     label: "Vanilla",     colors: ["Vanilla"],                               count: 1 },
  { id: "neapolitan",  label: "Neapolitan",  colors: ["Strawberry","Vanilla","Chocolate"],      count: 1 },
];

const DEFAULT_PLATYPUS_COLORS: ColorOption[] = [
  { id: "dkpurple_orange", label: "Dk Purple / Orange", colors: ["Dk Purple","Orange"], count: 1 },
  { id: "dkpurple_yellow", label: "Dk Purple / Yellow", colors: ["Dk Purple","Yellow"], count: 2 },
  { id: "ltblue_orange",   label: "Lt Blue / Orange",   colors: ["Lt Blue","Orange"],   count: 1 },
];

const DEFAULT_FISH_COLORS: ColorOption[] = [
  { id: "ltblue_dkgreen_dkpurple", label: "Lt Blue / Dk Green / Dk Purple", colors: ["Lt Blue","Dk Green","Dk Purple"], count: 1 },
  { id: "red_pink_orange",          label: "Red / Pink / Orange",             colors: ["Red","Pink","Orange"],            count: 1 },
];

const DEFAULT_FLOWER_CHAIN_COLORS: ColorOption[] = [
  { id: "pastel",       label: "Lt Blue / Pink / Yellow", colors: ["Lt Blue","Pink","Yellow"], count: 1 },
  { id: "rainbow",      label: "Red / Orange / Yellow / Lt Green / Lt Blue / Dk Purple", colors: ["Red", "Orange", "Yellow", "Lt Green", "Lt Blue", "Dk Purple"], count: 1 },
  { id: "blues_yellow", label: "Lt Blue / Dk Blue / Yellow", colors: ["Lt Blue","Dk Blue","Yellow"], count: 1 },
  { id: "black_white",  label: "Black / White",           colors: ["Black", "White"],          count: 1 },
];

const COLOR_DESIGNS = ["gecko","crayon","ice_cream","platypus","fish", "flower_chain"];

const DEFAULT_COLOR_DATA: Record<string, ColorOption[]> = {
  gecko:     DEFAULT_GECKO_COLORS,
  crayon:    DEFAULT_CRAYON_COLORS,
  ice_cream: DEFAULT_ICE_CREAM_COLORS,
  platypus:  DEFAULT_PLATYPUS_COLORS,
  fish:      DEFAULT_FISH_COLORS,
  flower_chain: DEFAULT_FLOWER_CHAIN_COLORS,
};

const DEFAULT_MADE: Record<string, number> = {
  axolotl: 1, lobster: 2, fish: 2, platypus: 4, alligator: 0, santa: 3, 
  gecko: 38, dragonfly: 1, star_lg: 2, ladybug: 1, xmas_tree: 9,
  flower_chain: 4, crayon: 12, ice_cream: 4, star_sm: 1,
};

const DEFAULT_NOV_CL = [
  { id: "n1",  text: "Register and pay table fee ($60)",  done: false },
  { id: "n2",  text: "Confirm table assignment (A2)",      done: true  },
  { id: "n3",  text: "Set up Venmo / Cash App QR code",   done: false },
  { id: "n4",  text: "Make price tags for all designs",   done: false },
  { id: "n5",  text: "Buy display stands / holders",      done: false },
  { id: "n6",  text: "Bring change (small bills)",        done: false },
  { id: "n7",  text: "Set up LED accent lighting",        done: false },
  { id: "n8",  text: "Print customization order forms",   done: false },
  { id: "n9",  text: "Pack wagon for easy transport",     done: false },
  { id: "n10", text: "Hit 150 keychain production goal",  done: false },
];

const DEFAULT_DEC_CL = [
  { id: "d1",  text: "Confirm registration and pay fee",  done: false },
  { id: "d2",  text: "Hit 300 keychain production goal",  done: false },
  { id: "d3",  text: "Restock supplies if needed",        done: false },
  { id: "d4",  text: "Set up Venmo / Cash App QR code",   done: false },
  { id: "d5",  text: "Make price tags for all designs",   done: false },
  { id: "d6",  text: "Bring change (small bills)",        done: false },
  { id: "d7",  text: "Print customization order forms",   done: false },
  { id: "d8",  text: "Mini colored pencil bundles ready", done: false },
  { id: "d9",  text: "Handmade paper sheets ready",       done: false },
  { id: "d10", text: "Pack wagon for easy transport",     done: false },
];

const TOTAL_BEADS = 6960;
const TOTAL_CORD_IN = 10476;
const TOTAL_HW = 200;
const SUPPLY_SPEND = 136.74;

type BarProps = { value: number; max: number; color?: string; h?: number };

function Bar({ value, max, color = "#f59e0b", h = 8 }: BarProps) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div style={{ background: "#e5e7eb", borderRadius: 99, height: h, overflow: "hidden" }}>
      <div style={{ background: color, height: "100%", width: `${pct}%`, borderRadius: 99, transition: "width 0.35s ease" }} />
    </div>
  );
}

function ColorDots({ colors }: { colors: string[] }) {
  return (
    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
      {colors.map((c, i) => (
        <div key={i} style={{
          width: 14, height: 14, borderRadius: "50%",
          background: COLOR_HEX[c] || "#ccc",
          border: "1.5px solid rgba(0,0,0,0.15)", flexShrink: 0,
        }} />
      ))}
    </div>
  );
}

type ChipProps = { label: string; value: string | number; sub?: string; accent?: string };

function Chip({ label, value, sub, accent = "#f59e0b" }: ChipProps) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", boxShadow: "0 1px 3px rgba(235, 224, 224, 0.07)", borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#111", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{value}</span>
    </div>
  );
}

type ColorBreakdownProps = {
  colors: ColorOption[];
  onBump: (colorId: string, delta: number) => void;
  accentColor?: string;
  schoolHighlight?: boolean;
};

function ColorBreakdown({ colors, onBump, accentColor = "#2b6cb0", schoolHighlight }: ColorBreakdownProps) {
  const total = colors.reduce((s, c) => s + c.count, 0);
  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      {colors.map(c => (
        <div key={c.id} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
          borderRadius: 8, background: c.school ? "#eff6ff" : "#f9fafb",
        }}>
          <ColorDots colors={c.colors} />
          <span style={{ flex: 1, fontSize: 12, fontWeight: c.school ? 700 : 500, color: c.school ? "#1d4ed8" : "#374151" }}>
            {c.label}{c.school ? " ⭐" : ""}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => onBump(c.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ width: 24, textAlign: "center", fontSize: 13, fontWeight: 800 }}>{c.count}</span>
            <button onClick={() => onBump(c.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: accentColor, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
        </div>
      ))}
      {schoolHighlight && (
        <div style={{ marginTop: 4, padding: "8px 10px", borderRadius: 8, background: "#dbeafe", fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
          🏫 School colors (Dk Blue/Yellow): {colors.find(c => c.id === "dkblue_yellow")?.count || 0} of {total} ({Math.round(((colors.find(c => c.id === "dkblue_yellow")?.count || 0) / Math.max(1, total)) * 100)}%)
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab]           = useState("overview");
  const [made, setMade]         = useState<Record<string, number>>({ ...DEFAULT_MADE });
  const [colorData, setColorData] = useState<Record<string, ColorOption[]>>(() => {
    const d: Record<string, ColorOption[]> = {};
    COLOR_DESIGNS.forEach(id => { d[id] = [...DEFAULT_COLOR_DATA[id].map(c => ({...c}))]; });
    return d;
  });
  const [openColors, setOpenColors] = useState<Record<string, boolean>>({});
  const [novCl, setNovCl]       = useState<ChecklistItem[]>([...DEFAULT_NOV_CL]);
  const [decCl, setDecCl]       = useState<ChecklistItem[]>([...DEFAULT_DEC_CL]);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("bws_v3");
        if (r) {
          const d = JSON.parse(r.value);
          if (d.made)      setMade(d.made);
          if (d.colorData) setColorData(d.colorData);
          if (d.novCl)     setNovCl(d.novCl);
          if (d.decCl)     setDecCl(d.decCl);
        }
      } catch {
        // ignore load failures — dashboard falls back to defaults
      }
      setLoaded(true);
    })();
  }, []);

  async function persist(m: Record<string, number>, cd: Record<string, ColorOption[]>, n: ChecklistItem[], d: ChecklistItem[]) {
    try {
      await window.storage.set("bws_v3", JSON.stringify({ made: m, colorData: cd, novCl: n, decCl: d }));
    } catch {
      // ignore save failures
    }
  }

  function bump(id: string, delta: number) {
    const n = { ...made, [id]: Math.max(0, (made[id] || 0) + delta) };
    setMade(n); persist(n, colorData, novCl, decCl);
  }
  function setVal(id: string, v: string) {
    const n = { ...made, [id]: Math.max(0, parseInt(v) || 0) };
    setMade(n); persist(n, colorData, novCl, decCl);
  }
  function bumpColor(designId: string, colorId: string, delta: number) {
    const newColors = colorData[designId].map(c => c.id === colorId ? { ...c, count: Math.max(0, c.count + delta) } : c);
    const newTotal  = newColors.reduce((s, c) => s + c.count, 0);
    const newMade   = { ...made, [designId]: newTotal };
    const newCd     = { ...colorData, [designId]: newColors };
    setColorData(newCd);
    setMade(newMade);
    persist(newMade, newCd, novCl, decCl);
  }
  function toggleColors(id: string) {
    setOpenColors(prev => ({ ...prev, [id]: !prev[id] }));
  }
  function toggleNov(id: string) {
    const n = novCl.map(i => i.id === id ? { ...i, done: !i.done } : i);
    setNovCl(n); persist(made, colorData, n, decCl);
  }
  function toggleDec(id: string) {
    const n = decCl.map(i => i.id === id ? { ...i, done: !i.done } : i);
    setDecCl(n); persist(made, colorData, novCl, n);
  }

  const totalMade = Object.values(made).reduce((a, b) => a + b, 0);
  const beadsUsed = DESIGNS.reduce((s, d) => s + (made[d.id] || 0) * d.beads, 0);
  const cordUsed  = totalMade * 72;
  const beadsLeft = TOTAL_BEADS - beadsUsed;
  const cordLeft  = TOTAL_CORD_IN - cordUsed;
  const hwLeft    = TOTAL_HW - totalMade;
  const revenue   = DESIGNS.reduce((s, d) => s + (made[d.id] || 0) * d.fairPrice, 0);
  const matCost   = DESIGNS.reduce((s, d) => s + (made[d.id] || 0) * d.cost, 0);
  const profit    = revenue - matCost;
  const today     = new Date();
  const daysNov   = Math.max(0, Math.ceil((new Date("2026-11-21").getTime() - today.getTime()) / 86400000));
  const daysDec   = Math.max(0, Math.ceil((new Date("2026-12-05").getTime() - today.getTime()) / 86400000));

  const TABS = [
    { id: "overview",  label: "📊 Overview"  },
    { id: "inventory", label: "🧵 Inventory" },
    { id: "fairs",     label: "🎪 Fairs"     },
    { id: "checklist", label: "✅ Checklist" },
  ];

  if (!loaded) return (
    <div style={{ fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>
      Loading your dashboard…
    </div>
  );

  const COLOR_ACCENTS: Record<string, string> = { gecko: "#2b6cb0", crayon: "#e53e3e", ice_cream: "#f687b3", platypus: "#6b46c1", fish: "#63b3ed" };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>

      {/* ─── HEADER ─── */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)", padding: "20px 20px 18px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 4 }}>Busy Weeks Studio</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>Craft Fair Dashboard</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#f59e0b", lineHeight: 1 }}>{totalMade}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>of 300 keychains</div>
          </div>
        </div>
        <Bar value={totalMade} max={300} color="#f59e0b" h={10} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#6b7280" }}>
          <span>{Math.round((totalMade / 300) * 100)}% to goal</span>
          <span>{300 - totalMade} remaining</span>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div style={{ display: "flex", gap: 6, padding: "12px 16px 0", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", flexShrink: 0,
            background: tab === t.id ? "#f59e0b" : "#fff",
            color: tab === t.id ? "#fff" : "#6b7280",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ padding: "14px 16px 32px" }}>

        {/* ══ OVERVIEW ══ */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Revenue (if sold)" value={`$${revenue.toFixed(0)}`} sub="at craft fair prices" accent="#16a34a" />
              <Chip label="Profit potential"  value={`$${profit.toFixed(0)}`}  sub="after material costs"  accent="#2563eb" />
              <Chip label="Days to Nov fair"  value={daysNov}                  sub="Nov 21 · High School"   accent="#ea580c" />
              <Chip label="Days to Dec fair"  value={daysDec}                  sub="Dec · Elementary"       accent="#7c3aed" />
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Production Goals</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>🎪 November goal</span>
                  <span style={{ color: "#6b7280" }}>{Math.min(totalMade, 150)} / 150</span>
                </div>
                <Bar value={Math.min(totalMade, 150)} max={150} color="#ea580c" h={8} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>🎄 December goal</span>
                  <span style={{ color: "#6b7280" }}>{totalMade} / 300</span>
                </div>
                <Bar value={totalMade} max={300} color="#7c3aed" h={8} />
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Supplies Remaining</div>
              {[
                { label: "Beads",    left: beadsLeft,           total: TOTAL_BEADS,   sub: `~${Math.floor(beadsLeft/63)} keychains`,    color: "#f59e0b" },
                { label: "Cord",     left: cordLeft,            total: TOTAL_CORD_IN, sub: `~${Math.round(cordLeft/36)} yds`,           color: "#16a34a" },
                { label: "Hardware", left: Math.max(0,hwLeft),  total: TOTAL_HW,      sub: `${Math.max(0,hwLeft)} closures`,            color: "#2563eb" },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{s.label}</span>
                    <span style={{ color: "#9ca3af" }}>{s.sub}</span>
                  </div>
                  <Bar value={Math.max(0,s.left)} max={s.total} color={s.color} h={7} />
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Financials</div>
              <StatRow label="Total supply spend"          value={`-$${SUPPLY_SPEND.toFixed(2)}`} />
              <StatRow label="Material cost (made so far)" value={`-$${matCost.toFixed(2)}`} />
              <StatRow label="Table fees (both fairs)"     value="-$85.00" />
              <StatRow label="Revenue if all sold"         value={`$${revenue.toFixed(2)}`} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, marginTop: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Net profit potential</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}>${(profit - 85).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ══ INVENTORY ══ */}
        {tab === "inventory" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, color: "#9ca3af", padding: "0 2px 2px" }}>Tap +/− or type to update. Designs with 🎨 have color breakdowns. ✦</div>
            {DESIGNS.map(d => {
              const m        = made[d.id] || 0;
              const pct      = d.target > 0 ? Math.min(100, Math.round((m / d.target) * 100)) : 0;
              const barColor = pct >= 100 ? "#16a34a" : pct >= 60 ? "#f59e0b" : "#ef4444";
              const dProfit  = (d.fairPrice - d.cost).toFixed(2);
              const hasColors = COLOR_DESIGNS.includes(d.id);
              const isOpen    = openColors[d.id];

              return (
                <div key={d.id} style={{
                  background: "#fff", borderRadius: 12, padding: "12px 14px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                  borderLeft: `4px solid ${barColor}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{d.emoji} {d.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                        {d.beads} beads · cost ${d.cost} · sell ${d.fairPrice} · profit ${dProfit}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                      <button onClick={() => bump(d.id,-1)} style={{ width:30,height:30,borderRadius:8,border:"1.5px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:18,fontWeight:700,color:"#374151",display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                      <input type="number" value={m} min={0} onChange={e=>setVal(d.id,e.target.value)}
                        style={{ width:46,height:30,textAlign:"center",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:15,fontWeight:800,color:"#111",outline:"none",background:"#fff" }} />
                      <button onClick={() => bump(d.id,1)} style={{ width:30,height:30,borderRadius:8,border:"none",background:"#f59e0b",cursor:"pointer",fontSize:18,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#9ca3af",marginBottom:4 }}>
                    <span>Target: {d.target}</span>
                    <span style={{ color:barColor,fontWeight:700 }}>{pct}%</span>
                  </div>
                  <Bar value={m} max={d.target} color={barColor} h={6} />

                  {/* COLOR BREAKDOWN TOGGLE */}
                  {hasColors && (
                    <div style={{ marginTop: 10 }}>
                      <button onClick={() => toggleColors(d.id)} style={{
                        width:"100%",padding:"7px 10px",borderRadius:8,
                        border:"1.5px solid #e5e7eb",background:"#f9fafb",
                        cursor:"pointer",fontSize:12,fontWeight:600,color:"#374151",
                        display:"flex",justifyContent:"space-between",alignItems:"center",
                      }}>
                        <span>🎨 Color breakdown ({colorData[d.id].reduce((s,c)=>s+c.count,0)} total)</span>
                        <span style={{ fontSize:10 }}>{isOpen ? "▲ hide" : "▼ show"}</span>
                      </button>
                      {isOpen && (
                        <ColorBreakdown
                          colors={colorData[d.id]}
                          onBump={(colorId, delta) => bumpColor(d.id, colorId, delta)}
                          accentColor={COLOR_ACCENTS[d.id]}
                          schoolHighlight={d.id === "gecko"}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Totals */}
            <div style={{ background:"#1a1a2e",borderRadius:12,padding:"16px 18px",color:"#fff" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:14,fontWeight:700 }}>Total Made</div>
                  <div style={{ fontSize:11,color:"#6b7280",marginTop:2 }}>{300-totalMade} more to reach goal</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:36,fontWeight:900,color:"#f59e0b",lineHeight:1 }}>{totalMade}</div>
                  <div style={{ fontSize:11,color:"#6b7280" }}>of 300</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ FAIRS ══ */}
        {tab === "fairs" && (
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div style={{ background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.07)" }}>
              <div style={{ background:"linear-gradient(90deg,#ea580c,#f97316)",padding:"14px 16px",color:"#fff" }}>
                <div style={{ fontSize:16,fontWeight:800 }}>🎪 November High School Fair</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2 }}>Large community fair · Well attended</div>
              </div>
              <div style={{ padding:16 }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
                  {[["Date","Nov 21, 2026"],["Hours","10am – 2pm"],["Table","A2 ⚡ electricity"],["Fee","$60.00"]].map(([k,v])=>(
                    <div key={k} style={{ background:"#fff7ed",borderRadius:8,padding:"9px 12px" }}>
                      <div style={{ fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.06em" }}>{k}</div>
                      <div style={{ fontSize:13,fontWeight:700,marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#f9fafb",borderRadius:8,padding:12,marginBottom:14 }}>
                  <div style={{ fontSize:12,fontWeight:700,marginBottom:8 }}>Break-even Analysis</div>
                  <StatRow label="Table fee"                    value="$60.00" />
                  <StatRow label="Keychains to break even"      value="~21 sold" />
                  <StatRow label="Projected revenue (150 sold)" value="~$450" />
                  <StatRow label="Projected profit (after fee)" value="~$345" />
                </div>
                <div style={{ fontSize:12,fontWeight:600,marginBottom:5 }}>Production goal: 150</div>
                <Bar value={Math.min(totalMade,150)} max={150} color="#ea580c" h={8} />
                <div style={{ fontSize:11,color:"#9ca3af",marginTop:4 }}>{Math.min(totalMade,150)} / 150 made</div>
              </div>
            </div>

            <div style={{ background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.07)" }}>
              <div style={{ background:"linear-gradient(90deg,#7c3aed,#9333ea)",padding:"14px 16px",color:"#fff" }}>
                <div style={{ fontSize:16,fontWeight:800 }}>🎄 December Elementary Fair</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2 }}>Holiday craft fair · Kids & families</div>
              </div>
              <div style={{ padding:16 }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
                  {[["Date","December TBD"],["Hours","5:00 – 7:30pm"],["Table","TBD"],["Fee","~$25 est."]].map(([k,v])=>(
                    <div key={k} style={{ background:"#faf5ff",borderRadius:8,padding:"9px 12px" }}>
                      <div style={{ fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.06em" }}>{k}</div>
                      <div style={{ fontSize:13,fontWeight:700,marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#f9fafb",borderRadius:8,padding:12,marginBottom:14 }}>
                  <div style={{ fontSize:12,fontWeight:700,marginBottom:8 }}>Break-even Analysis</div>
                  <StatRow label="Table fee (est.)"             value="~$25" />
                  <StatRow label="Keychains to break even"      value="~9 sold" />
                  <StatRow label="Projected revenue (150 sold)" value="~$400" />
                  <StatRow label="Projected profit (after fee)" value="~$330" />
                </div>
                <div style={{ fontSize:12,fontWeight:600,marginBottom:5 }}>Production goal: 300 total</div>
                <Bar value={totalMade} max={300} color="#7c3aed" h={8} />
                <div style={{ fontSize:11,color:"#9ca3af",marginTop:4 }}>{totalMade} / 300 made</div>
              </div>
            </div>

            <div style={{ background:"#1a1a2e",borderRadius:12,padding:16,color:"#fff" }}>
              <div style={{ fontSize:13,fontWeight:700,marginBottom:12,color:"#f59e0b" }}>Combined Projections</div>
              {[["Total table fees","-$85.00"],["Total supply spend",`-$${SUPPLY_SPEND}`],["Revenue (all 300 sold)","~$1,050"],["Estimated total profit","~$825"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:13 }}>
                  <span style={{ color:"#9ca3af" }}>{k}</span>
                  <span style={{ fontWeight:700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ CHECKLIST ══ */}
        {tab === "checklist" && (
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {[
              { title:"🎪 November Fair Prep",list:novCl,toggle:toggleNov,color:"#ea580c",bg:"#fff7ed" },
              { title:"🎄 December Fair Prep", list:decCl,toggle:toggleDec,color:"#7c3aed",bg:"#faf5ff" },
            ].map(({ title,list,toggle,color,bg }) => {
              const done = list.filter(i=>i.done).length;
              return (
                <div key={title} style={{ background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.07)" }}>
                  <div style={{ padding:"14px 16px 10px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                      <div style={{ fontSize:14,fontWeight:800 }}>{title}</div>
                      <div style={{ fontSize:12,fontWeight:700,color }}>{done}/{list.length}</div>
                    </div>
                    <Bar value={done} max={list.length} color={color} h={6} />
                  </div>
                  <div style={{ padding:"4px 8px 12px" }}>
                    {list.map(item => (
                      <div key={item.id} onClick={()=>toggle(item.id)} style={{
                        display:"flex",alignItems:"center",gap:12,padding:"10px 8px",
                        borderRadius:8,cursor:"pointer",
                        background:item.done?bg:"transparent",
                        marginBottom:2,transition:"background 0.15s",
                      }}>
                        <div style={{
                          width:20,height:20,borderRadius:6,flexShrink:0,
                          background:item.done?color:"transparent",
                          border:item.done?"none":"2px solid #d1d5db",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          transition:"all 0.15s",
                        }}>
                          {item.done && <span style={{ color:"#fff",fontSize:12,fontWeight:900 }}>✓</span>}
                        </div>
                        <span style={{
                          fontSize:13,fontWeight:item.done?400:600,
                          color:item.done?color:"#374151",
                          textDecoration:item.done?"line-through":"none",
                        }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
