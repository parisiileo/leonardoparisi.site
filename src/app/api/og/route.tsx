import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    // Get search params if needed for dynamic content
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Leonardo Parisi";
    const subtitle = searchParams.get("subtitle") || "Frontend Developer";
    const domain = process.env.NEXT_PUBLIC_DOMAIN || "imleo.it";

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #d8cfc4 0%, #e8dcd2 100%)",
          fontFamily: '"Source Sans Pro", sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#6b6253",
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "#6b6253",
            opacity: 0.1,
          }}
        />

        {/* Main content */}
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#2d2520",
              marginBottom: "20px",
              letterSpacing: "-2px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "42px",
              color: "#6b6253",
              marginBottom: "40px",
              fontWeight: "400",
            }}
          >
            {subtitle}
          </div>

          {/* Footer text */}
          <div
            style={{
              fontSize: "24px",
              color: "#6b6253",
              marginTop: "40px",
              display: "flex",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <span>🔗 {domain}</span>
            <span>•</span>
            <span>@_leoparisi</span>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 128,
          background: "#d8cfc4",
          width: "100%",
          height: "100%",
        }}
      >
        Leonardo Parisi
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
