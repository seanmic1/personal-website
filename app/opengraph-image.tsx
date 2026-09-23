import { ImageResponse } from "next/server";

export const alt = "Sean Michael — software engineer, Kuala Lumpur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card is the string, held still. Built from flexbox rather than SVG
 * paths because Satori only understands a subset of CSS, and a straight lit line
 * with a dot on it is the whole idea anyway.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0B0D10",
          fontFamily: "sans-serif",
        }}
      >
        {/* the string */}
        <div style={{ display: "flex", position: "relative", alignItems: "center", height: 80 }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: 10, background: "#E0A03F", opacity: 0.14 }} />
          <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "#E0A03F" }} />
          <div
            style={{
              position: "absolute",
              left: 592,
              width: 34,
              height: 34,
              borderRadius: 17,
              background: "#E0A03F",
              opacity: 0.2,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 602,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "#E0A03F",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "0 96px", marginTop: 64 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: "#E4E8EB",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Sean Michael
          </div>
          <div style={{ fontSize: 30, color: "#8B959D", marginTop: 24, lineHeight: 1.35 }}>
            Software engineer, Kuala Lumpur. Access control at Qashier; before
            that, lending systems in Indonesia.
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#5D666E",
              marginTop: 40,
              letterSpacing: "0.2em",
            }}
          >
            SEANML.COM
          </div>
        </div>
      </div>
    ),
    size,
  );
}
