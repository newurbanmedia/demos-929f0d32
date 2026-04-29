// Tweaks panel — palette, typography, motion, photo treatment, accent color
const PALETTES = {
  forest: {
    label: "Forest & Mahogany",
    swatches: ["#3c5a3d", "#56684f", "#7a4232", "#f3ede1"],
    vars: {
      "--cream": "#f3ede1",
      "--cream-soft": "#f7f2e6",
      "--soft-white": "#fbf8f1",
      "--forest": "#3c5a3d",
      "--forest-deep": "#2a4029",
      "--moss": "#56684f",
      "--moss-deep": "#41513c",
      "--slate": "#7a4232",
      "--rust": "#7a4232",
      "--rule": "#c9c1b1",
      "--rule-soft": "#ddd5c4"
    }
  },
  river: {
    label: "River & Pine",
    swatches: ["#3a5662", "#3f5d6b", "#4f6b58", "#eef0e9"],
    vars: {
      "--cream": "#eef0e9",
      "--cream-soft": "#f3f4ec",
      "--soft-white": "#f7f8f1",
      "--forest": "#3a5662",
      "--forest-deep": "#283f4a",
      "--moss": "#3f5d6b",
      "--moss-deep": "#2e4854",
      "--slate": "#4f6b58",
      "--rust": "#7a604a",
      "--rule": "#c4ccc2",
      "--rule-soft": "#d8ded6"
    }
  },
  meadow: {
    label: "Meadow & Stone",
    swatches: ["#42603a", "#5d7a52", "#5b7081", "#f1ece0"],
    vars: {
      "--cream": "#f1ece0",
      "--cream-soft": "#f6f1e5",
      "--soft-white": "#fbf6ea",
      "--forest": "#42603a",
      "--forest-deep": "#2e4628",
      "--moss": "#5d7a52",
      "--moss-deep": "#46603e",
      "--slate": "#5b7081",
      "--rust": "#8a5a44",
      "--rule": "#cbc2ad",
      "--rule-soft": "#ded4be"
    }
  },
  dusk: {
    label: "Dusk Water",
    swatches: ["#395667", "#3a5566", "#566c5e", "#ece8db"],
    vars: {
      "--cream": "#ece8db",
      "--cream-soft": "#f1ede0",
      "--soft-white": "#f6f3e8",
      "--forest": "#395667",
      "--forest-deep": "#27414f",
      "--moss": "#3a5566",
      "--moss-deep": "#2a4150",
      "--slate": "#566c5e",
      "--rust": "#7e5a48",
      "--rule": "#bfb8a6",
      "--rule-soft": "#d3ccba"
    }
  }
};

const TYPE_PAIRS = {
  fraunces_dm: {
    label: "Fraunces · DM Sans",
    display: "'Fraunces', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif"
  },
  cormorant_inter: {
    label: "Cormorant · Inter",
    display: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', system-ui, sans-serif"
  },
  worksans_dm: {
    label: "Work Sans · DM Sans",
    display: "'Work Sans', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif"
  },
  inter_inter: {
    label: "Inter · Inter",
    display: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif"
  }
};

// Accent color override (for italic accent words)
const ACCENT_COLORS = {
  moss:   { label: "Moss",   value: "var(--moss)" },
  rust:   { label: "Rust",   value: "var(--rust)" },
  forest: { label: "Forest", value: "var(--forest)" },
  slate:  { label: "Slate",  value: "var(--slate)" }
};

// Photo treatment — applied as a CSS filter on real photos
const PHOTO_TREATMENTS = {
  natural: { label: "Natural",   filter: "none" },
  warm:    { label: "Warm tone", filter: "saturate(0.92) sepia(0.18) contrast(1.02)" },
  bw:      { label: "Black & white", filter: "grayscale(1) contrast(1.05)" },
  muted:   { label: "Muted",     filter: "saturate(0.7) brightness(1.02)" }
};

// Motion intensity — controls reveal speed + photo drift
const MOTION_LEVELS = {
  off:    { label: "Off",     scale: 0,   driftDuration: "0s" },
  soft:   { label: "Soft",    scale: 1,   driftDuration: "24s" },
  lively: { label: "Lively",  scale: 1.4, driftDuration: "16s" }
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "forest",
  "typePair": "fraunces_dm",
  "accent": "moss",
  "photoTreatment": "natural",
  "motion": "soft",
  "showPhotoTags": true
}/*EDITMODE-END*/;

function applyTweaks({ palette, typePair, accent, photoTreatment, motion, showPhotoTags }) {
  const root = document.documentElement;

  // Palette
  const p = PALETTES[palette] || PALETTES.forest;
  Object.entries(p.vars).forEach(([k, v]) => root.style.setProperty(k, v));

  // Typography
  const t = TYPE_PAIRS[typePair] || TYPE_PAIRS.fraunces_dm;
  root.style.setProperty("--display", t.display);
  root.style.setProperty("--body", t.body);

  // Accent color (italic accents)
  const a = ACCENT_COLORS[accent] || ACCENT_COLORS.moss;
  root.style.setProperty("--accent-color", a.value);

  // Photo treatment
  const pt = PHOTO_TREATMENTS[photoTreatment] || PHOTO_TREATMENTS.natural;
  root.style.setProperty("--photo-filter", pt.filter);

  // Motion
  const m = MOTION_LEVELS[motion] || MOTION_LEVELS.soft;
  root.style.setProperty("--motion-scale", m.scale);
  root.style.setProperty("--photo-drift-duration", m.driftDuration);
  root.classList.toggle("motion-off", motion === "off");

  // Photo tags
  root.classList.toggle("hide-photo-tags", !showPhotoTags);
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(tweaks); }, [
    tweaks.palette, tweaks.typePair, tweaks.accent,
    tweaks.photoTreatment, tweaks.motion, tweaks.showPhotoTags
  ]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Palette">
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(PALETTES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setTweak("palette", key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: tweaks.palette === key ? "rgba(0,0,0,0.06)" : "transparent",
                border: tweaks.palette === key ? "1px solid rgba(0,0,0,0.18)" : "1px solid rgba(0,0,0,0.08)",
                borderRadius: 6,
                cursor: "pointer",
                font: "inherit",
                textAlign: "left",
                width: "100%"
              }}
            >
              <span style={{ display: "flex", borderRadius: 3, overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
                {p.swatches.map((c, i) => (
                  <span key={i} style={{ width: 16, height: 22, background: c, display: "block" }} />
                ))}
              </span>
              <span style={{ fontSize: 13 }}>{p.label}</span>
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Typography">
        <TweakSelect
          label="Pairing"
          value={tweaks.typePair}
          onChange={(v) => setTweak("typePair", v)}
          options={Object.entries(TYPE_PAIRS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
        <TweakRadio
          label="Italic accent color"
          value={tweaks.accent}
          onChange={(v) => setTweak("accent", v)}
          options={Object.entries(ACCENT_COLORS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
      </TweakSection>

      <TweakSection title="Photography">
        <TweakSelect
          label="Treatment"
          value={tweaks.photoTreatment}
          onChange={(v) => setTweak("photoTreatment", v)}
          options={Object.entries(PHOTO_TREATMENTS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
        <TweakToggle
          label="Show photo tags"
          value={tweaks.showPhotoTags}
          onChange={(v) => setTweak("showPhotoTags", v)}
        />
      </TweakSection>

      <TweakSection title="Motion">
        <TweakRadio
          label="Intensity"
          value={tweaks.motion}
          onChange={(v) => setTweak("motion", v)}
          options={Object.entries(MOTION_LEVELS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.createRoot(root).render(<App />);

// Apply on initial load even before panel is opened
applyTweaks(TWEAK_DEFAULTS);
