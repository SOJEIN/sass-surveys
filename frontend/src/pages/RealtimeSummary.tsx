import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:3000/api";
const WS = "http://localhost:3000/ws";
const SLUG = "encuesta-demo";

type OptionSummary = { optionId: string; label?: string; count: number };
type QuestionSummary =
  | {
      questionId: string;
      title: string;
      type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
      options: OptionSummary[];
      total?: number;
      totalResponses?: number;
    }
  | {
      questionId: string;
      title: string;
      type: "RATING" | "NUMBER";
      count: number;
      average: number | null;
      sum: number;
    }
  | {
      questionId: string;
      title: string;
      type: "SHORT_TEXT" | "LONG_TEXT";
      count: number;
      samples: string[];
    };

type SummaryResponse = {
  survey: { id: string; title: string; status: string };
  questions: QuestionSummary[];
};

async function fetchSurveyIdBySlug(slug: string) {
  const res = await fetch(`${API}/public/surveys/${slug}`);
  if (!res.ok) throw new Error("No se pudo obtener la encuesta");
  const survey = await res.json();
  return { id: survey.id, title: survey.title as string };
}

async function fetchSummaryById(id: string): Promise<SummaryResponse> {
  const res = await fetch(`${API}/analytics/surveys/${id}/summary`);
  if (!res.ok) throw new Error("No se pudo obtener el summary");
  return res.json();
}

export default function RealtimeSummary() {
  const [surveyId, setSurveyId] = useState<string>("");
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string>("");

  const firstChoiceQuestion = useMemo(
    () =>
      summary?.questions.find((q) => q.type === "SINGLE_CHOICE") as
        | Extract<QuestionSummary, { type: "SINGLE_CHOICE" }>
        | undefined,
    [summary]
  );

  useEffect(() => {
    let socket: any;

    (async () => {
      try {
        const { id, title } = await fetchSurveyIdBySlug(SLUG);
        setSurveyId(id);
        setSurveyTitle(title);
        setSummary(await fetchSummaryById(id));
      } catch (e: any) {
        setError(e?.message ?? "Error inicial");
        return;
      }

      // @ts-ignore usamos la lib global cargada por CDN en index.html
      socket = (window as any).io(WS, { transports: ["websocket"] });

      socket.on("connect", () => {
        // console.log('WS conectado', socket.id);
      });

      socket.on("survey:update", async (payload: any) => {
        // si usas rooms por encuesta, aquí podrías filtrar por surveyId
        if (!surveyId) return;
        try {
          const data = await fetchSummaryById(surveyId);
          setSummary(data);
        } catch (e: any) {
          setError(e?.message ?? "Error refrescando summary");
        }
      });

      socket.on("connect_error", (err: any) => {
        setError("WS: " + (err?.message ?? "connect_error"));
      });
    })();

    return () => {
      if (socket && socket.disconnect) socket.disconnect();
    };
  }, [surveyId]);

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!summary) return <div className="p-4">Cargando summary…</div>;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Resultados en tiempo real</h1>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>
        <strong>Encuesta:</strong> {surveyTitle} ({surveyId})
      </div>

      {firstChoiceQuestion && (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0, marginBottom: 8 }}>
            {firstChoiceQuestion.title}
          </h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {firstChoiceQuestion.options.map((opt) => (
              <li key={opt.optionId}>
                {opt.label ?? opt.optionId}: <strong>{opt.count}</strong>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
            Total respuestas:{" "}
            {firstChoiceQuestion.total ??
              firstChoiceQuestion.totalResponses ??
              0}
          </div>
        </div>
      )}

      {/* Render súper simple del resto de preguntas */}
      {summary.questions
        .filter((q) => q !== firstChoiceQuestion)
        .map((q) => (
          <div
            key={q.questionId}
            style={{
              border: "1px solid #f2f2f2",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{q.title}</div>
            {q.type === "RATING" || q.type === "NUMBER" ? (
              <div>
                Promedio: <strong>{(q as any).average ?? 0}</strong> — Conteo:{" "}
                <strong>{(q as any).count ?? 0}</strong>
              </div>
            ) : q.type === "SHORT_TEXT" || q.type === "LONG_TEXT" ? (
              <div>
                Respuestas: <strong>{(q as any).count}</strong>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(q as any).samples?.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {(q as any).options?.map((o: any) => (
                  <li key={o.optionId}>
                    {o.label ?? o.optionId}: <strong>{o.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  );
}
