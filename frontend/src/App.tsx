import { useEffect, useState } from "react";
import { getHealth } from "./health";

function App() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<any>(null);

  useEffect(() => {
    getHealth().then(setData).catch(setErr);
  }, []);

  return (
    <pre style={{ padding: 16 }}>
      {err ? `Error: ${String(err)}` : JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default App;
