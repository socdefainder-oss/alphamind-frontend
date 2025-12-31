function Brand({ subtitle = "Portal do Aluno", size = 40 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img
        src="/logo-alphamind.png"
        alt="Instituto AlphaMind"
        style={{
          height: size,
          width: "auto",
          objectFit: "contain",
          display: "block",
          borderRadius: 10,
          filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.18))",
        }}
      />

      <div>
        <div style={{ fontWeight: 900 }}>Instituto AlphaMind</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default Brand;
