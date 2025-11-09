export async function getHealth() {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}/health`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
