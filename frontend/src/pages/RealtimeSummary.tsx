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

type SingleChoiceQuestion = {
  questionId: string;
  title: string;
  type: "SINGLE_CHOICE";
  options: OptionSummary[];
  total?: number;
  totalResponses?: number;
};

// (El type guard se usa inline en useMemo)

async function fetchSurveyIdBySlug(slug: string) {
  const res = await fetch(`${API}/public/surveys/${slug}`);
  if (!res.ok) throw new Error("No se pudo obtener la encuesta");
  const survey = await res.json();
  return { id: survey.id as string, title: survey.title as string };
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

  const firstChoiceQuestion = useMemo(() => {
    return summary?.questions.find(
      (q): q is SingleChoiceQuestion => q.type === "SINGLE_CHOICE"
    );
  }, [summary]);

  // 1) Carga encuesta y summary inicial
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { id, title } = await fetchSurveyIdBySlug(SLUG);
        if (cancelled) return;
        setSurveyId(id);
        setSurveyTitle(title);
        const data = await fetchSummaryById(id);
        if (cancelled) return;
        setSummary(data);
      } catch (e: unknown) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : String(e);
          setError(message || "Error inicial");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Conexión WS (cuando ya tenemos surveyId)
  useEffect(() => {
    if (!surveyId) return;
    type WindowWithIO = Window & {
      io?: (
        url: string,
        opts?: unknown
      ) => {
        on: (event: string, cb: (...args: unknown[]) => void) => void;
        disconnect?: () => void;
      };
    };

    const w = globalThis as unknown as WindowWithIO;
    const socket = w.io ? w.io(WS, { transports: ["websocket"] }) : null;

    if (!socket) {
      setError("WS: socket.io no disponible en window");
      return;
    }

    // Conexión establecida
    socket.on("connect", () => {});

    // Evento cuando hay una actualización en la encuesta: refrescar summary
    socket.on("survey:update", async () => {
      try {
        const data = await fetchSummaryById(surveyId);
        setSummary(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message || "Error refrescando summary");
      }
    });

    // Errores de conexión
    socket.on("connect_error", (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      setError("WS: " + (message || "connect_error"));
    });

    // Cleanup: desconectar socket
    return () => {
      socket?.disconnect?.();
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

      {firstChoiceQuestion?.type === "SINGLE_CHOICE" && (
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
            {firstChoiceQuestion.options.map((opt: OptionSummary) => (
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

      {/* Render del resto de preguntas con tipado seguro */}
      {summary.questions
        .filter((q) => q.questionId !== firstChoiceQuestion?.questionId)
        .map((q) => {
          switch (q.type) {
            case "RATING":
            case "NUMBER": {
              const item = q; // item ya es del tipo correcto por discriminación
              return (
                <div
                  key={item.questionId}
                  style={{
                    border: "1px solid #f2f2f2",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {item.title}
                  </div>
                  <div>
                    Promedio: <strong>{item.average ?? 0}</strong> — Conteo:{" "}
                    <strong>{item.count ?? 0}</strong>
                  </div>
                </div>
              );
            }
            case "SHORT_TEXT":
            case "LONG_TEXT": {
              const item = q;
              return (
                <div
                  key={item.questionId}
                  style={{
                    border: "1px solid #f2f2f2",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {item.title}
                  </div>
                  <div>
                    Respuestas: <strong>{item.count}</strong>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {item.samples?.map((t, idx) => (
                        <li key={`${item.questionId}-sample-${idx}`}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }
            case "SINGLE_CHOICE":
            case "MULTIPLE_CHOICE": {
              const item = q;
              return (
                <div
                  key={item.questionId}
                  style={{
                    border: "1px solid #f2f2f2",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {item.title}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {item.options?.map((o: OptionSummary) => (
                      <li key={o.optionId}>
                        {o.label ?? o.optionId}: <strong>{o.count}</strong>
                      </li>
                    ))}
                  </ul>
                  {(item.total ?? item.totalResponses) != null && (
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                      Total respuestas: {item.total ?? item.totalResponses ?? 0}
                    </div>
                  )}
                </div>
              );
            }
            default:
              return null;
          }
        })}
    </div>
  );
}
