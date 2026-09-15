import { useEffect, useRef, useState, type FormEvent } from "react";
import { FiSend, FiX, FiCpu, FiChevronRight } from "react-icons/fi";
import { ask, SUGGESTED, type AgentAnswer } from "../agent";

/* neon pulse icon */
function NeonCore() {
  return (
    <span className="neon-core" aria-hidden>
      <span className="neon-ring r1" />
      <span className="neon-ring r2" />
      <FiCpu />
    </span>
  );
}

type Msg = { from: "user" | "ai"; text?: string; answer?: AgentAnswer };

/* ── agentic portfolio assistant ─────────────────────── */
export function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "ai",
      answer: {
        heading: "MKA·COPILOT online",
        body: [
          "I read the field docs — 20 shipped projects, architecture decisions, and impact numbers. Ask me anything about the work. For example:",
        ],
        cites: [],
        follow: SUGGESTED.slice(0, 3),
      },
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, thinking, open]);

  const submit = (q?: string) => {
    const query = (q ?? input).trim();
    if (!query || thinking) return;
    setInput("");
    setMsgs(m => [...m, { from: "user", text: query }]);
    setThinking(true);
    /* "reasoning" delay — the agent computes locally over the corpus */
    window.setTimeout(() => {
      const answer = ask(query);
      setMsgs(m => [...m, { from: "ai", answer }]);
      setThinking(false);
    }, 520 + Math.random() * 420);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  if (!open) {
    return (
      <button className="copilot-fab" onClick={() => setOpen(true)} aria-label="Open portfolio assistant" type="button">
        <NeonCore />
        <span className="copilot-fab-label">Ask the docs</span>
      </button>
    );
  }

  return (
    <>
      <div className="copilot-backdrop" onClick={() => setOpen(false)} aria-hidden />
      <section className="copilot-panel glass" role="dialog" aria-label="Portfolio assistant">
        <header className="copilot-head">
          <div>
            <p className="copilot-kicker">Agentic assistant · reads docs + repo summaries</p>
            <h2>MKA·COPILOT</h2>
          </div>
          <button className="copilot-close" onClick={() => setOpen(false)} aria-label="Close assistant" type="button">
            <FiX />
          </button>
        </header>

        <div className="copilot-log">
          {msgs.map((m, i) =>
            m.from === "user" ? (
              <div className="msg msg-user" key={i}>{m.text}</div>
            ) : (
              <AnswerView key={i} answer={m.answer!} onAsk={submit} />
            )
          )}
          {thinking && (
            <div className="msg msg-ai">
              <div className="thinking" aria-label="Thinking">
                <span /><span /><span />
                <em>reasoning over 20 field docs…</em>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="copilot-chips">
          {SUGGESTED.slice(0, 4).map(s => (
            <button key={s} type="button" onClick={() => submit(s)}>{s}</button>
          ))}
        </div>

        <form className="copilot-input" onSubmit={onSubmit}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about a project, stack choice, or impact…"
            aria-label="Ask the assistant"
          />
          <button type="submit" disabled={!input.trim() || thinking} aria-label="Send">
            <FiSend />
          </button>
        </form>
      </section>
    </>
  );
}

function AnswerView({ answer, onAsk }: { answer: AgentAnswer; onAsk: (q: string) => void }) {
  return (
    <div className="msg msg-ai">
      <p className="msg-heading">{answer.heading}</p>
      {answer.body.map((p, i) => <p key={i} className="msg-p">{p}</p>)}

      {answer.metrics && answer.metrics.length > 0 && (
        <div className="msg-metrics">
          {answer.metrics.map((m, i) => (
            <div key={i}>
              <b>{m.value}</b>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {answer.cites.length > 0 && (
        <div className="msg-cites">
          <span className="msg-cites-lbl">sources</span>
          {answer.cites.map(c => (
            <span className="cite" key={c.code} title={c.title}>
              <b>{c.code}</b> {c.title}
            </span>
          ))}
        </div>
      )}

      {answer.follow.length > 0 && (
        <div className="msg-follow">
          {answer.follow.map(f => (
            <button key={f} type="button" onClick={() => onAsk(f)}>
              {f} <FiChevronRight />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
