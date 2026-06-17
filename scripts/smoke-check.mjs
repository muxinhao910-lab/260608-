const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";

const paths = [
  "/",
  "/admin",
  "/admin/dashboard",
  "/admin/builder",
  "/sector/robotics",
  "/sector/semiconductor",
  "/sector/ai",
  "/sector/optical",
];

let failed = false;

for (const path of paths) {
  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      failed = true;
      console.error(`FAIL ${response.status} ${url}`);
    } else {
      console.log(`OK ${response.status} ${url}`);
    }
  } catch (error) {
    failed = true;
    console.error(`ERROR ${url}`);
    console.error(error);
  }
}

if (failed) {
  process.exit(1);
}

console.log("Smoke check passed.");
