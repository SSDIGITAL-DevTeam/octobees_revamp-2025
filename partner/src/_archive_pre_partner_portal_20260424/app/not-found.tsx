"use client";

// Skip prerendering for not found page
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F5F5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "3.75rem",
            fontWeight: "bold",
            color: "#1e293b",
          }}
        >
          404
        </h1>
        <p
          style={{
            marginTop: "1rem",
            fontSize: "1.25rem",
            color: "#475569",
          }}
        >
          Page not found
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            backgroundColor: "#2563eb",
            color: "white",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }}
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
