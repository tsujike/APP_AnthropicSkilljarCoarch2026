import { useState, useMemo } from "react";

const DOMAINS = {
  agentic: { name: "Agentic Architecture", fullName: "Agentic Architecture & Orchestration", weight: 27, color: "#6366f1", course: "Introduction to Agent Skills" },
  claudeCode: { name: "Claude Code", fullName: "Claude Code Configuration & Workflows", weight: 20, color: "#8b5cf6", course: "Claude Code in Action" },
  prompt: { name: "Prompt Engineering", fullName: "Prompt Engineering & Structured Output", weight: 20, color: "#ec4899", course: "Building with the Claude API" },
  mcp: { name: "MCP & Tool Design", fullName: "Tool Design & MCP Integration", weight: 18, color: "#f59e0b", course: "Intro to Model Context Protocol" },
  context: { name: "Context & Reliability", fullName: "Context Management & Reliability", weight: 15, color: "#22c55e", course: "Building with the Claude API" },
};

const QUESTIONS = [
  // Agentic x2
  {
    domain: "agentic",
    question: "複数のAIエージェントが連携してタスクを処理するとき、中央の「コーディネーター」が各エージェントにタスクを振り分けるパターンを何と呼びますか？",
    options: ["Peer-to-peer", "Hub-and-spoke", "Round-robin", "Daisy chain"],
    correct: 1,
    difficulty: "basic",
  },
  {
    domain: "agentic",
    question: "エージェントに「ファイルの読み取りは自動でOK、ファイルの削除はユーザー確認が必要」というルールを設計するとき、何を基準に線引きしていますか？",
    options: ["処理速度", "操作のリスクと可逆性", "ファイルサイズ", "エージェントの種類"],
    correct: 1,
    difficulty: "applied",
  },
  // Claude Code x2
  {
    domain: "claudeCode",
    question: "Claude Codeにプロジェクトの構造やコーディング規約を伝えるために使うファイルの名前は？",
    options: [".clauderc", "CLAUDE.md", "claude.config.json", ".claude/settings.yaml"],
    correct: 1,
    difficulty: "basic",
  },
  {
    domain: "claudeCode",
    question: "Claude Codeでカスタムスラッシュコマンド（例: /deploy）を作るには、どこにファイルを配置しますか？",
    options: ["package.json の scripts", "CLAUDE.md 内に記述", ".claude/commands/ ディレクトリ", ".vscode/tasks.json"],
    correct: 2,
    difficulty: "applied",
  },
  // Prompt Engineering x2
  {
    domain: "prompt",
    question: "Claudeに複雑な推論をさせるとき、「ステップバイステップで考えてから最終回答を出して」と促す手法を何と呼びますか？",
    options: ["Few-shot prompting", "Chain of Thought", "Zero-shot classification", "Retrieval-Augmented Generation"],
    correct: 1,
    difficulty: "basic",
  },
  {
    domain: "prompt",
    question: "ClaudeからJSON形式の出力を確実に得るために最も効果的な組み合わせは？",
    options: [
      "「JSONで出力して」と一言添える",
      "温度を0に設定する",
      "JSONスキーマを明示 + few-shot例 + バリデーション & リトライ",
      "XMLで出力させてからJSONに変換する",
    ],
    correct: 2,
    difficulty: "applied",
  },
  // MCP x2
  {
    domain: "mcp",
    question: "MCP（Model Context Protocol）の3つの基本要素は何ですか？",
    options: ["Input / Output / State", "Tools / Resources / Prompts", "Read / Write / Execute", "Request / Response / Stream"],
    correct: 1,
    difficulty: "basic",
  },
  {
    domain: "mcp",
    question: "MCPで「外部APIを呼び出してデータを書き込む」操作と「ファイルの内容を読み取る」操作は、それぞれどのプリミティブに該当しますか？",
    options: [
      "どちらも Tools",
      "書き込み = Tools、読み取り = Resources",
      "書き込み = Resources、読み取り = Tools",
      "どちらも Resources",
    ],
    correct: 1,
    difficulty: "applied",
  },
  // Context x2
  {
    domain: "context",
    question: "LLMが長い入力テキストの「真ん中あたり」の情報を見落としやすい現象を何と呼びますか？",
    options: ["Hallucination", "Lost in the Middle", "Context overflow", "Attention drift"],
    correct: 1,
    difficulty: "basic",
  },
  {
    domain: "context",
    question: "エージェントAからエージェントBにタスクを引き継ぐとき、最も効果的な方法は？",
    options: [
      "全ての会話履歴をそのまま渡す",
      "タスクの要約 + 必要なコンテキスト + 完了状態を構造化して渡す",
      "タスク名だけ渡す",
      "引き継がず最初からやり直す",
    ],
    correct: 1,
    difficulty: "applied",
  },
];

const LEVEL_THRESHOLDS = [
  { min: 90, label: "Advanced", emoji: "🎯", color: "#22c55e", message: "試験準備ほぼ完了。模擬テストで最終確認を。", weeks: "1-2週間", hours: "5-10時間" },
  { min: 70, label: "Intermediate", emoji: "📈", color: "#f59e0b", message: "基礎はある。弱点ドメインを集中的に。", weeks: "3-4週間", hours: "15-20時間" },
  { min: 40, label: "Beginner+", emoji: "📘", color: "#3b82f6", message: "基本概念は理解している。体系的な学習を。", weeks: "5-6週間", hours: "25-30時間" },
  { min: 0, label: "Starter", emoji: "🚀", color: "#a78bfa", message: "ここからスタート。コースを順番に進めよう。", weeks: "7-8週間", hours: "30-35時間" },
];

export default function LevelCheck() {
  const [phase, setPhase] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const handleSelect = (idx) => setSelected(idx);

  const handleNext = () => {
    if (selected === null) return;
    const next = [...answers, { qIdx: current, selected, correct: QUESTIONS[current].correct }];
    setAnswers(next);
    setSelected(null);
    if (current + 1 >= QUESTIONS.length) {
      setPhase("result");
    } else {
      setCurrent(current + 1);
    }
  };

  const results = useMemo(() => {
    if (phase !== "result") return null;
    const domainScores = {};
    Object.keys(DOMAINS).forEach((d) => { domainScores[d] = { total: 0, correct: 0 }; });
    answers.forEach((a) => {
      const q = QUESTIONS[a.qIdx];
      domainScores[q.domain].total++;
      if (a.selected === a.correct) domainScores[q.domain].correct++;
    });
    const totalCorrect = answers.filter((a) => a.selected === a.correct).length;
    const pct = Math.round((totalCorrect / QUESTIONS.length) * 100);
    const weightedScore = Object.entries(domainScores).reduce((sum, [key, s]) => {
      const domainPct = s.total > 0 ? s.correct / s.total : 0;
      return sum + domainPct * DOMAINS[key].weight;
    }, 0);
    const weightedPct = Math.round(weightedScore);
    const level = LEVEL_THRESHOLDS.find((t) => weightedPct >= t.min);
    return { domainScores, totalCorrect, pct, weightedPct, level };
  }, [phase, answers]);

  // === Intro ===
  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0c0a1a 0%, #1a1040 40%, #0f0825 100%)", color: "#fff", fontFamily: "'Segoe UI', -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧭</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>
            CCA レベルチェック
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 32px", lineHeight: 1.7 }}>
            10問・約5分で、今のあなたの実力と<br />試験までの学習コストを診断します
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
            {Object.values(DOMAINS).map((d) => (
              <span key={d.name} style={{ background: `${d.color}18`, border: `1px solid ${d.color}33`, color: d.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>
                {d.name}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 40 }}>
            {[{ v: "10問", l: "問題数" }, { v: "約5分", l: "所要時間" }, { v: "即診断", l: "結果" }].map((x) => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>{x.v}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{x.l}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase("quiz")}
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 52px", fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 24px rgba(99,102,241,0.3)", transition: "transform 0.15s" }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            診断スタート
          </button>
        </div>
      </div>
    );
  }

  // === Quiz ===
  if (phase === "quiz") {
    const q = QUESTIONS[current];
    const d = DOMAINS[q.domain];
    const progress = ((current) / QUESTIONS.length) * 100;

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0c0a1a 0%, #1a1040 40%, #0f0825 100%)", color: "#fff", fontFamily: "'Segoe UI', -apple-system, sans-serif", padding: "32px 20px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: "#64748b", minWidth: 40 }}>{current + 1}/10</span>
            <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}aa)`, borderRadius: 3, transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* Domain badge */}
          <span style={{ display: "inline-block", background: `${d.color}18`, border: `1px solid ${d.color}33`, color: d.color, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            {d.name}
          </span>

          {/* Question */}
          <h2 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.7, margin: "0 0 28px", color: "#f1f5f9" }}>
            {q.question}
          </h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {q.options.map((opt, idx) => {
              const isSelected = idx === selected;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: isSelected ? `${d.color}15` : "rgba(255,255,255,0.03)",
                    border: isSelected ? `2px solid ${d.color}88` : "2px solid rgba(255,255,255,0.06)",
                    borderRadius: 14, padding: "14px 18px", cursor: "pointer",
                    textAlign: "left", color: isSelected ? "#f1f5f9" : "#cbd5e1",
                    fontSize: 14, lineHeight: 1.6, transition: "all 0.15s",
                  }}
                >
                  <span style={{
                    width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                    background: isSelected ? `${d.color}33` : "rgba(255,255,255,0.06)",
                    color: isSelected ? d.color : "#64748b",
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleNext}
              disabled={selected === null}
              style={{
                background: selected === null ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: selected === null ? "#475569" : "#fff",
                border: "none", borderRadius: 12, padding: "12px 36px",
                fontSize: 14, fontWeight: 600,
                cursor: selected === null ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {current + 1 >= QUESTIONS.length ? "結果を見る" : "次へ →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === Result ===
  if (phase === "result" && results) {
    const { domainScores, totalCorrect, pct, weightedPct, level } = results;

    const weakDomains = Object.entries(domainScores)
      .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.5)
      .map(([key]) => key);
    const strongDomains = Object.entries(domainScores)
      .filter(([, s]) => s.total > 0 && s.correct / s.total >= 1)
      .map(([key]) => key);

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0c0a1a 0%, #1a1040 40%, #0f0825 100%)", color: "#fff", fontFamily: "'Segoe UI', -apple-system, sans-serif", padding: "40px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

          {/* Level badge */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 52, marginBottom: 8 }}>{level.emoji}</div>
            <div style={{ display: "inline-block", background: `${level.color}22`, border: `1px solid ${level.color}44`, borderRadius: 24, padding: "6px 24px", marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: level.color }}>{level.label}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
              あなたの現在地
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{level.message}</p>
          </div>

          {/* Score cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
            {[
              { label: "正答率", value: `${pct}%`, sub: `${totalCorrect}/10` },
              { label: "加重スコア", value: `${weightedPct}%`, sub: "試験配点基準" },
              { label: "理解度", value: `約${Math.round(weightedPct / 10) * 10}%`, sub: "CCA範囲全体" },
            ].map((c) => (
              <div key={c.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 18, textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: level.color }}>{c.value}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{c.sub}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Domain breakdown */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 20px", color: "#e2e8f0" }}>ドメイン別</h3>
            {Object.entries(DOMAINS).map(([key, d]) => {
              const s = domainScores[key];
              const score = s.total > 0 ? s.correct / s.total : 0;
              const icons = Array.from({ length: s.total }, (_, i) => i < s.correct ? "●" : "○");
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 2 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>配点 {d.weight}%</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, fontSize: 16 }}>
                    {icons.map((ic, i) => (
                      <span key={i} style={{ color: ic === "●" ? d.color : "rgba(255,255,255,0.12)" }}>{ic}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: score >= 1 ? "#22c55e" : score >= 0.5 ? "#f59e0b" : "#ef4444", minWidth: 30, textAlign: "right" }}>
                    {Math.round(score * 100)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Study estimate */}
          <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))", borderRadius: 16, padding: "24px 28px", marginBottom: 24, border: "1px solid rgba(99,102,241,0.2)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: "#e2e8f0" }}>📊 学習コスト見積もり</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>推定学習期間</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#a78bfa" }}>{level.weeks}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>推定学習時間</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#a78bfa" }}>{level.hours}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
              ※ Anthropic Academy の無料コース受講 + 模擬テスト演習を含む目安です
            </div>
          </div>

          {/* Recommendations */}
          {weakDomains.length > 0 && (
            <div style={{ background: "rgba(239,68,68,0.06)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, border: "1px solid rgba(239,68,68,0.15)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px", color: "#fca5a5" }}>⚡ 優先的に学ぶべき領域</h3>
              {weakDomains.map((key) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{DOMAINS[key].fullName}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>推奨コース: {DOMAINS[key].course}</div>
                </div>
              ))}
            </div>
          )}

          {strongDomains.length > 0 && (
            <div style={{ background: "rgba(34,197,94,0.06)", borderRadius: 16, padding: "24px 28px", marginBottom: 32, border: "1px solid rgba(34,197,94,0.15)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px", color: "#86efac" }}>✅ すでに理解できている領域</h3>
              {strongDomains.map((key) => (
                <div key={key} style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 6 }}>{DOMAINS[key].fullName}</div>
              ))}
            </div>
          )}

          {/* Retry */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => { setPhase("intro"); setCurrent(0); setSelected(null); setAnswers([]); }}
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 32px", fontSize: 14, cursor: "pointer", marginRight: 12 }}
            >
              もう一度
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
