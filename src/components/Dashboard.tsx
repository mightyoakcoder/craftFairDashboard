import { useState, useEffect } from "react";

type ColorOption = {
  id: string;
  label: string;
  colors: string[];
  count: number;
  target?: number;
  school?: boolean;
  hs?: boolean;
};

type ChecklistItem = { id: string; text: string; done: boolean };

const DESIGNS = [
  { id: "axolotl",    name: "Axolotl",           beads: 114, cost: 1.21, fairPrice: 5, etsyPrice: 9, target: 20, emoji: "🦎" },
  { id: "lobster",    name: "Lobster",            beads: 96,  cost: 1.04, fairPrice: 5, etsyPrice: 8, target: 15, emoji: "🦞" },
  { id: "fish",       name: "Fish",               beads: 87,  cost: 0.96, fairPrice: 5, etsyPrice: 7, target: 20, emoji: "🐟" },
  { id: "platypus",   name: "Platypus",           beads: 85,  cost: 0.95, fairPrice: 5, etsyPrice: 8, target: 15, emoji: "🦆" },
  { id: "frog",       name: "Frog",               beads: 82,  cost: 0.92, fairPrice: 5, etsyPrice: 7, target: 15, emoji: "🐸" },
  { id: "alligator",  name: "Alligator",          beads: 76,  cost: 0.87, fairPrice: 4, etsyPrice: 7, target: 20, emoji: "🐊" },
  { id: "santa",      name: "Santa",              beads: 70,  cost: 0.81, fairPrice: 4, etsyPrice: 7, target: 20, emoji: "🎅" },
  { id: "gecko",      name: "Gecko",              beads: 60,  cost: 0.72, fairPrice: 5, etsyPrice: 5,  target: 40, emoji: "🦎" },
  { id: "dragonfly",  name: "Dragonfly",          beads: 57,  cost: 0.70, fairPrice: 4, etsyPrice: 6,  target: 15, emoji: "🪲" },
  { id: "star_lg",    name: "Studley Star (lg)",  beads: 55,  cost: 0.68, fairPrice: 5, etsyPrice: 5,  target: 15, emoji: "⭐" },
  { id: "ladybug",    name: "Ladybug",            beads: 52,  cost: 0.65, fairPrice: 3, etsyPrice: 5,  target: 15, emoji: "🐞" },
  { id: "snowflake",  name: "Snowflake",          beads: 48,  cost: 0.62, fairPrice: 3, etsyPrice: 5,  target: 20, emoji: "❄️" },
  { id: "xmas_tree",  name: "Christmas Tree",     beads: 44,  cost: 0.58, fairPrice: 3, etsyPrice: 5,  target: 25, emoji: "🎄" },
  { id: "flower",     name: "Flower Chain",       beads: 42,  cost: 0.56, fairPrice: 3, etsyPrice: 5,  target: 15, emoji: "🌸" },
  { id: "crayon",     name: "Crayon",             beads: 33,  cost: 0.48, fairPrice: 3, etsyPrice: 5,  target: 30, emoji: "🖍️" },
  { id: "ice_cream",  name: "Ice Cream Cone",     beads: 32,  cost: 0.48, fairPrice: 3, etsyPrice: 5,  target: 15, emoji: "🍦" },
  { id: "star_sm",    name: "Studley Star (sm)",  beads: 25,  cost: 0.41, fairPrice: 3, etsyPrice: 4,  target: 20, emoji: "⭐" },
];

const COLOR_HEX: Record<string, string> = {
  "Dk Blue": "#2b6cb0",  "Lt Blue": "#63b3ed",   "Yellow": "#ecc94b",
  "Red": "#e53e3e",      "Orange": "#ed8936",     "Lt Green": "#68d391",
  "Dk Green": "#276749", "Black": "#1a202c",      "Pink": "#f687b3",
  "Dk Purple": "#6b46c1","Lt Purple": "#9f7aea",  "White": "#e2e8f0",
  "Brown": "#92400e",    "Dk Pink": "#d53f8c",    "Turquoise": "#38b2ac",
  "Strawberry": "#fca5a5","Chocolate": "#6b3a2a", "Vanilla": "#fef3c7",
  "Gold": "#d4a017",     "Silver": "#94a3b8",
};

const DEFAULT_GECKO_COLORS: ColorOption[] = [
  { id: "dkblue_yellow",  label: "Dk Blue / Yellow",  colors: ["Dk Blue","Yellow"],  count: 18, target: 8,  school: true },
  { id: "red_white",      label: "Red / White",        colors: ["Red","White"],       count: 1,  target: 15, hs: true },
  { id: "black_gold",     label: "Black / Gold",       colors: ["Black","Gold"],      count: 0,  target: 4 },
  { id: "black_silver",   label: "Black / Silver",     colors: ["Black","Silver"],    count: 0,  target: 4 },
  { id: "red_black",      label: "Red / Black",        colors: ["Red","Black"],       count: 1,  target: 3 },
  { id: "red_orange",     label: "Red / Orange",       colors: ["Red","Orange"],      count: 1,  target: 2 },
  { id: "red_pink",       label: "Red / Pink",         colors: ["Red","Pink"],        count: 1,  target: 2 },
  { id: "red_yellow",     label: "Red / Yellow",       colors: ["Red","Yellow"],      count: 1,  target: 2 },
  { id: "orange_red",     label: "Orange / Red",       colors: ["Orange","Red"],      count: 1,  target: 1 },
  { id: "red_ltgreen",    label: "Red / Lt Green",     colors: ["Red","Lt Green"],    count: 1,  target: 1 },
  { id: "red_dkpurple",   label: "Red / Dk Purple",    colors: ["Red","Dk Purple"],   count: 1,  target: 1 },
  { id: "red_dkblue",     label: "Red / Dk Blue",      colors: ["Red","Dk Blue"],     count: 1,  target: 1 },
  { id: "red_ltblue",     label: "Red / Lt Blue",      colors: ["Red","Lt Blue"],     count: 1,  target: 1 },
  { id: "red_dkgreen",    label: "Red / Dk Green",     colors: ["Red","Dk Green"],    count: 1,  target: 1 },
  { id: "dkblue_ltblue",  label: "Dk Blue / Lt Blue",  colors: ["Dk Blue","Lt Blue"], count: 1,  target: 1 },
  { id: "white_red",      label: "White / Red",        colors: ["White","Red"],       count: 1,  target: 1 },
  { id: "white_orange",   label: "White / Orange",     colors: ["White","Orange"],    count: 1,  target: 1 },
  { id: "white_yellow",   label: "White / Yellow",     colors: ["White","Yellow"],    count: 1,  target: 1 },
  { id: "white_ltgreen",  label: "White / Lt Green",   colors: ["White","Lt Green"],  count: 1,  target: 1 },
  { id: "white_dkgreen",  label: "White / Dk Green",   colors: ["White","Dk Green"],  count: 1,  target: 1 },
  { id: "white_ltblue",   label: "White / Lt Blue",    colors: ["White","Lt Blue"],   count: 1,  target: 1 },
  { id: "white_dkpurple", label: "White / Dk Purple",  colors: ["White","Dk Purple"], count: 1,  target: 1 },
  { id: "white_black",    label: "White / Black",      colors: ["White","Black"],     count: 1,  target: 1 },
];

const DEFAULT_CRAYON_COLORS: ColorOption[] = [
  { id: "red",       label: "Red",       colors: ["Red"],       count: 3, target: 3 },
  { id: "orange",    label: "Orange",    colors: ["Orange"],    count: 3, target: 3 },
  { id: "yellow",    label: "Yellow",    colors: ["Yellow"],    count: 1, target: 3 },
  { id: "pink",      label: "Pink",      colors: ["Pink"],      count: 3, target: 3 },
  { id: "dk_pink",   label: "Dk Pink",   colors: ["Dk Pink"],   count: 3, target: 3 },
  { id: "lt_blue",  label: "Lt Blue",   colors: ["Lt Blue"],   count: 3, target: 3 },
  { id: "dk_blue",   label: "Dk Blue",   colors: ["Dk Blue"],   count: 1, target: 3 },
  { id: "lt_green",  label: "Lt Green",  colors: ["Lt Green"],  count: 2, target: 2 },
  { id: "dk_green",  label: "Dk Green",  colors: ["Dk Green"],  count: 3, target: 2 },
  { id: "lt_purple", label: "Lt Purple", colors: ["Lt Purple"], count: 3, target: 3 },
  { id: "dk_purple", label: "Dk Purple", colors: ["Dk Purple"], count: 1, target: 2 },
  { id: "black",     label: "Black",     colors: ["Black"],     count: 1, target: 2 },
  { id: "brown",     label: "Brown",     colors: ["Brown"],     count: 1, target: 2 },
  { id: "white",     label: "White",     colors: ["White"],     count: 1, target: 2 },
];

const DEFAULT_ICE_CREAM_COLORS: ColorOption[] = [
  { id: "strawberry", label: "Strawberry", colors: ["Strawberry"],                       count: 1, target: 4 },
  { id: "chocolate",  label: "Chocolate",  colors: ["Chocolate"],                        count: 1, target: 4 },
  { id: "vanilla",    label: "Vanilla",    colors: ["Vanilla"],                          count: 1, target: 4 },
  { id: "neapolitan", label: "Neapolitan", colors: ["Strawberry","Vanilla","Chocolate"], count: 1, target: 3 },
];

const DEFAULT_PLATYPUS_COLORS: ColorOption[] = [
  { id: "dkpurple_orange", label: "Dk Purple / Orange", colors: ["Dk Purple","Orange"], count: 1, target: 4 },
  { id: "dkpurple_yellow", label: "Dk Purple / Yellow", colors: ["Dk Purple","Yellow"], count: 2, target: 7 },
  { id: "ltblue_orange",   label: "Lt Blue / Orange",   colors: ["Lt Blue","Orange"],   count: 1, target: 4 },
];

const DEFAULT_FISH_COLORS: ColorOption[] = [
  { id: "ltblue_dkgreen_dkpurple", label: "Lt Blue / Dk Green / Dk Purple", colors: ["Lt Blue","Dk Green","Dk Purple"], count: 1, target: 10 },
  { id: "red_pink_orange",         label: "Red / Pink / Orange",             colors: ["Red","Pink","Orange"],            count: 1, target: 10 },
];

const DEFAULT_ALLIGATOR_COLORS: ColorOption[] = [
  { id: "dkgreen_ltgreen",  label: "Dk Green / Lt Green",  colors: ["Dk Green","Lt Green"], count: 1, target: 6 },
  { id: "dkgreen_yellow",   label: "Dk Green / Yellow",    colors: ["Dk Green","Yellow"],   count: 2, target: 6 },
  { id: "dkgreen_orange",   label: "Dk Green / Orange",    colors: ["Dk Green","Orange"],   count: 2, target: 3 },
  { id: "dkgreen_ltpink",   label: "Dk Green / Lt Pink",   colors: ["Dk Green","Lt Pink"],     count: 1, target: 1 },
  { id: "ltgreen_orange",   label: "Lt Green / Orange",    colors: ["Lt Green","Orange"],   count: 1, target: 1 },
  { id: "ltgreen_yellow",   label: "Lt Green / Yellow",    colors: ["Lt Green","Yellow"],   count: 3, target: 5 },
];

const DEFAULT_DRAGONFLY_COLORS: ColorOption[] = [
  { id: "dkpurple_ltblue",  label: "Dk Purple / Lt Blue", colors: ["Dk Purple","Lt Blue"], count: 1, target: 8 },
  { id: "ltpurple_dkpink",  label: "Lt Purple / Dk Pink", colors: ["Lt Purple","Dk Pink"], count: 0, target: 7 },
];

const DEFAULT_FLOWER_COLORS: ColorOption[] = [
  { id: "rainbow",             label: "Rainbow",                         colors: ["Red","Orange","Yellow","Lt Green","Lt Blue","Dk Purple"], count: 1, target: 6 },
  { id: "red_orange_yellow",   label: "Red / Orange / Yellow",           colors: ["Red","Orange","Yellow"],                                   count: 1, target: 5 },
  { id: "ltpurple_pink_white", label: "Lt Purple / Pink / White center", colors: ["Lt Purple","Pink","White"],                                count: 0, target: 4 },
  { id: "blind_box_other",     label: "Blind Box / Other",               colors: ["Lt Blue","Pink","Yellow"],                                 count: 3, target: 0 },
];

const DEFAULT_CHRISTMAS_TREE_COLORS: ColorOption[] = [
  { id: "dkgreen",  label: "Dk Green", colors: ["Dk Green"], count: 20, target: 20 },
  { id: "ltgreen",  label: "Lt Green", colors: ["Lt Green"], count: 6, target: 6 },
];

const COLOR_DESIGNS = ["gecko","crayon","ice_cream","platypus","fish","alligator","dragonfly","flower"];

const DEFAULT_COLOR_DATA: Record<string, ColorOption[]> = {
  gecko:     DEFAULT_GECKO_COLORS,
  crayon:    DEFAULT_CRAYON_COLORS,
  ice_cream: DEFAULT_ICE_CREAM_COLORS,
  platypus:  DEFAULT_PLATYPUS_COLORS,
  fish:      DEFAULT_FISH_COLORS,
  alligator: DEFAULT_ALLIGATOR_COLORS,
  dragonfly: DEFAULT_DRAGONFLY_COLORS,
  flower:    DEFAULT_FLOWER_COLORS,
  xmas_tree:  DEFAULT_CHRISTMAS_TREE_COLORS,
};

const DEFAULT_MADE: Record<string, number> = {
  axolotl: 0, lobster: 0, fish: 2, platypus: 4, frog: 0, alligator: 10,
  santa: 3, gecko: 38, dragonfly: 1, star_lg: 0, ladybug: 1, snowflake: 1,
  xmas_tree: 9, flower: 5, crayon: 12, ice_cream: 4, star_sm: 2,
};

const DEFAULT_NOV_CL: ChecklistItem[] = [
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

const DEFAULT_DEC_CL: ChecklistItem[] = [
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

const TOTAL_BEADS   = 15920;
const TOTAL_CORD_IN = 17676;
const TOTAL_HW      = 350;
const SUPPLY_SPEND  = 207.41;
const COLOR_ACCENTS: Record<string, string> = { gecko:"#2b6cb0", crayon:"#e53e3e", ice_cream:"#f687b3", platypus:"#6b46c1", fish:"#63b3ed", alligator:"#276749", dragonfly:"#9f7aea", flower:"#d4a017" };

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
    <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", borderTop: `3px solid ${accent}` }}>
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
  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      {colors.map(c => {
        const atTarget   = (c.target ?? 0) > 0 && c.count >= (c.target as number);
        const close      = (c.target ?? 0) > 0 && c.count >= (c.target as number) * 0.6;
        const countColor = atTarget ? "#16a34a" : close ? "#f59e0b" : "#374151";
        const rowBg      = c.school ? "#eff6ff" : c.hs ? "#fff5f5" : "#f9fafb";
        const labelColor = c.school ? "#1d4ed8" : c.hs ? "#c53030" : "#374151";
        return (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, background: rowBg }}>
            <ColorDots colors={c.colors} />
            <span style={{ flex: 1, fontSize: 12, fontWeight: (c.school || c.hs) ? 700 : 500, color: labelColor }}>
              {c.label}{c.school ? " ⭐" : ""}{c.hs ? " 🏈" : ""}
            </span>
            {!!c.target && c.target > 0 && (
              <span style={{ fontSize: 10, color: countColor, fontWeight: 700, minWidth: 32, textAlign: "right" }}>
                {c.count}/{c.target}
              </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button onClick={() => onBump(c.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <span style={{ width: 24, textAlign: "center", fontSize: 13, fontWeight: 800, color: countColor }}>{c.count}</span>
              <button onClick={() => onBump(c.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: accentColor, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          </div>
        );
      })}
      {schoolHighlight && (
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "8px 10px", borderRadius: 8, background: "#dbeafe", fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
            🏫 Elementary colors (Dk Blue/Yellow): {colors.find(c => c.id === "dkblue_yellow")?.count || 0} / {colors.find(c => c.id === "dkblue_yellow")?.target || 0}
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 8, background: "#fff5f5", fontSize: 11, color: "#c53030", fontWeight: 600 }}>
            🏈 HS fair colors (Red/White): {colors.find(c => c.id === "red_white")?.count || 0} / {colors.find(c => c.id === "red_white")?.target || 0}
          </div>
        </div>
      )}
    </div>
  );
}

const MIX_AND_MATCH: [string, string, string][] = [
  ["2 × $3 items", "$5", "save $1"],
  ["2 × $4–5 items", "$8", "save $1–2"],
  ["1 × $5 + 1 × $3", "$7", "save $1"],
];

type Bundle = {
  name: string; desc: string; items: string[];
  individual: string; bundle: string; save: string; color: string; bg: string;
};

const NAMED_BUNDLES: Bundle[] = [
  {
    name: "❄️ Winter Wonderland Pack",
    desc: "Best holiday bundle for both fairs",
    items: ["Santa", "Christmas Tree", "Snowflake"],
    individual: "$9", bundle: "$7", save: "$2",
    color: "#63b3ed", bg: "#ebf8ff",
  },
  {
    name: "🏫 School Spirit Pack",
    desc: "Perfect for the elementary fair",
    items: ["Gecko", "Studley Star (sm)", "Crayon"],
    individual: "$11", bundle: "$9", save: "$2",
    color: "#2b6cb0", bg: "#eff6ff",
  },
  {
    name: "🎄 Holiday Pack",
    desc: "Top seller at December fair",
    items: ["Santa", "Christmas Tree"],
    individual: "$7", bundle: "$6", save: "$1",
    color: "#16a34a", bg: "#f0fdf4",
  },
  {
    name: "🦎 Animal Pack",
    desc: "Any 3 animal keychains",
    items: ["Your choice of 3 animals"],
    individual: "$12–15", bundle: "$12", save: "up to $3",
    color: "#ea580c", bg: "#fff7ed",
  },
  {
    name: "🖍️ Teacher Gift Set",
    desc: "Thoughtful back-to-school gift",
    items: ["Crayon", "Studley Star (sm)", "Ice Cream Cone"],
    individual: "$9", bundle: "$7", save: "$2",
    color: "#7c3aed", bg: "#faf5ff",
  },
  {
    name: "🎁 Stocking Stuffer Set",
    desc: "Any 5 small keychains — great gift bag filler",
    items: ["Any 5 items $3–5 each"],
    individual: "$15–25", bundle: "$14", save: "$1–11",
    color: "#e53e3e", bg: "#fff5f5",
  },
];

export default function Dashboard() {
  const [tab, setTab]           = useState("overview");
  const [made, setMade]         = useState<Record<string, number>>({ ...DEFAULT_MADE });
  const [colorData, setColorData] = useState<Record<string, ColorOption[]>>(() => {
    const d: Record<string, ColorOption[]> = {};
    COLOR_DESIGNS.forEach(id => { d[id] = DEFAULT_COLOR_DATA[id].map(c => ({ ...c })); });
    return d;
  });
  const [openColors, setOpenColors] = useState<Record<string, boolean>>({});
  const [novCl, setNovCl]       = useState<ChecklistItem[]>([...DEFAULT_NOV_CL]);
  const [decCl, setDecCl]       = useState<ChecklistItem[]>([...DEFAULT_DEC_CL]);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/inventory");
        if (res.ok && res.status !== 204) {
          const d = await res.json();
          if (d.made) setMade({ ...DEFAULT_MADE, ...d.made });
          if (d.colorData) {
            // Smart merge: keep stored counts, refresh target/school/hs from
            // current defaults, add missing colorways, and drop stored ids
            // that no longer exist in defaults (stale/renamed — the UI never
            // lets a user create a colorway that isn't already in defaults).
            const merged: Record<string, ColorOption[]> = {};
            COLOR_DESIGNS.forEach(id => {
              if (d.colorData[id]) {
                // Order follows defaults, so new colorways land where they're
                // declared instead of at the end.
                merged[id] = DEFAULT_COLOR_DATA[id].map(def => {
                  const stored = d.colorData[id].find((c: ColorOption) => c.id === def.id);
                  return stored
                    ? { ...stored, target: def.target, school: def.school, hs: def.hs }
                    : { ...def };
                });
              } else {
                merged[id] = DEFAULT_COLOR_DATA[id].map(c => ({ ...c }));
              }
            });
            setColorData(merged);
          }
          if (d.novCl) setNovCl(d.novCl);
          if (d.decCl) setDecCl(d.decCl);
        }
      } catch {
        // ignore load failures — dashboard falls back to defaults
      }
      setLoaded(true);
    })();
  }, []);

  async function persist(m: Record<string, number>, cd: Record<string, ColorOption[]>, n: ChecklistItem[], d: ChecklistItem[]) {
    try {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ made: m, colorData: cd, novCl: n, decCl: d }),
      });
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
    const newColors = (colorData[designId] || []).map(c => c.id === colorId ? { ...c, count: Math.max(0, c.count + delta) } : c);
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
    { id: "bundles",   label: "🎁 Bundles"   },
    { id: "fairs",     label: "🎪 Fairs"     },
    { id: "checklist", label: "✅ Checklist" },
  ];

  if (!loaded) return (
    <div style={{ fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>
      Loading your dashboard…
    </div>
  );

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
              const m         = made[d.id] || 0;
              const hasColors = COLOR_DESIGNS.includes(d.id);
              const isOpen    = openColors[d.id];
              const safeColors = hasColors ? (colorData[d.id] || []) : [];
              const colorTotal = safeColors.reduce((s, c) => s + c.count, 0);
              // Designs with a color breakdown derive their target from it so the two can't drift.
              const colorTarget = safeColors.reduce((s, c) => s + (c.target ?? 0), 0);
              const target    = colorTarget > 0 ? colorTarget : d.target;
              const pct       = target > 0 ? Math.min(100, Math.round((m / target) * 100)) : 0;
              const barColor  = pct >= 100 ? "#16a34a" : pct >= 60 ? "#f59e0b" : "#ef4444";
              const dProfit   = (d.fairPrice - d.cost).toFixed(2);

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
                        {d.beads} beads · cost ${d.cost} · fair ${d.fairPrice} · etsy ${d.etsyPrice} · profit ${dProfit}
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
                    <span>Target: {target}</span>
                    <span style={{ color:barColor,fontWeight:700 }}>{pct}%</span>
                  </div>
                  <Bar value={m} max={target} color={barColor} h={6} />

                  {/* COLOR BREAKDOWN TOGGLE */}
                  {hasColors && (
                    <div style={{ marginTop: 10 }}>
                      <button onClick={() => toggleColors(d.id)} style={{
                        width:"100%",padding:"7px 10px",borderRadius:8,
                        border:"1.5px solid #e5e7eb",background:"#f9fafb",
                        cursor:"pointer",fontSize:12,fontWeight:600,color:"#374151",
                        display:"flex",justifyContent:"space-between",alignItems:"center",
                      }}>
                        <span>🎨 Color breakdown ({colorTotal} total)</span>
                        <span style={{ fontSize:10 }}>{isOpen ? "▲ hide" : "▼ show"}</span>
                      </button>
                      {isOpen && (
                        <ColorBreakdown
                          colors={safeColors}
                          onBump={(colorId, delta) => bumpColor(d.id, colorId, delta)}
                          accentColor={COLOR_ACCENTS[d.id] || "#374151"}
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

        {/* ══ BUNDLES ══ */}
        {tab === "bundles" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, color: "#9ca3af", padding: "0 2px 2px" }}>Bundle pricing for craft fairs. Show savings clearly on your table signage. ✦</div>

            {/* Mix & Match */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>🎲 Mix & Match 2-Pack</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12 }}>Any 2 keychains — save $1</div>
              {MIX_AND_MATCH.map(([combo, price, save]) => (
                <div key={combo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{combo}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{save}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#16a34a" }}>{price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Named bundles */}
            {NAMED_BUNDLES.map(b => (
              <div key={b.name} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", borderLeft: `4px solid ${b.color}` }}>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{b.desc}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: b.color }}>{b.bundle}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>save {b.save}</div>
                    </div>
                  </div>
                  <div style={{ background: b.bg, borderRadius: 8, padding: "8px 10px", marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Includes:</div>
                    {b.items.map(item => (
                      <div key={item} style={{ fontSize: 12, fontWeight: 600, color: b.color }}>• {item}</div>
                    ))}
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Regular price: {b.individual}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Etsy bundle note */}
            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 16, color: "#fff" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#f59e0b" }}>🛍️ Etsy Bundle Strategy</div>
              <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
                Create separate Etsy listings for each bundle. Bundles typically convert better and reduce per-listing fees. Start with the Animal Pack and Holiday Pack — both photograph well as a group and have strong gift appeal.
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
