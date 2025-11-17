const urlsToCheck = [
  "/",
  "/increase-my-sales",
  "/insights",
  "/plans/website",
  "/contact-us",
];

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

async function inspect(url: string) {
  const target = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const response = await fetch(target);
  const html = await response.text();
  const hasNoindex =
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html) ||
    (response.headers.get("x-robots-tag") || "")
      .toLowerCase()
      .includes("noindex");

  if (hasNoindex) {
    console.warn(`[ALERT] ${target} is marked noindex`);
  } else {
    console.log(`[OK] ${target}`);
  }
}

Promise.all(urlsToCheck.map((url) => inspect(url))).catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
