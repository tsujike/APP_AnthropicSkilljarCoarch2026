import { useState, useMemo } from "react";

const DOMAINS = {
  agentic: { name: "Agentic Architecture & Orchestration", weight: 27, color: "#6366f1" },
  claudeCode: { name: "Claude Code Configuration & Workflows", weight: 20, color: "#8b5cf6" },
  prompt: { name: "Prompt Engineering & Structured Output", weight: 20, color: "#a78bfa" },
  mcp: { name: "Tool Design & MCP Integration", weight: 18, color: "#c4b5fd" },
  context: { name: "Context Management & Reliability", weight: 15, color: "#ddd6fe" },
};

const QUESTIONS = [
  // === Agentic Architecture (27%) - 8 questions ===
  {
    domain: "agentic",
    question: "マルチエージェントシステムで「hub-and-spoke」パターンを使う主な利点は何ですか？",
    options: [
      "全てのエージェントが互いに直接通信できる",
      "中央のコーディネーターがタスクの振り分けと結果の統合を管理できる",
      "エージェント数を1つに減らせる",
      "ネットワーク帯域を最小化できる",
    ],
    correct: 1,
    explanation: "Hub-and-spokeパターンでは、中央のコーディネーター（hub）がサブエージェント（spoke）にタスクを振り分け、結果を統合します。これにより、複雑なワークフローを構造的に管理できます。",
  },
  {
    domain: "agentic",
    question: "エージェントのタスク分解（task decomposition）において最も重要な設計原則は？",
    options: [
      "できるだけ多くのサブタスクに分割する",
      "各サブタスクが独立して実行可能で、明確な入出力を持つようにする",
      "全てのタスクを順次実行する",
      "サブタスクの数を常に3つに固定する",
    ],
    correct: 1,
    explanation: "効果的なタスク分解では、各サブタスクが独立実行可能で明確な入出力インターフェースを持つことが重要です。これにより並列処理やエラーリカバリが容易になります。",
  },
  {
    domain: "agentic",
    question: "エージェントループ（agentic loop）において、ツール呼び出しの結果を次のステップに渡す際のベストプラクティスは？",
    options: [
      "全てのツール結果をそのまま次のプロンプトに含める",
      "ツール結果を要約・構造化してコンテキストに追加する",
      "ツール結果は保存せず毎回再取得する",
      "ツール結果はユーザーにのみ返す",
    ],
    correct: 1,
    explanation: "ツール結果を適切に要約・構造化することで、コンテキストウィンドウの効率的な使用と、次のステップでの正確な推論が可能になります。",
  },
  {
    domain: "agentic",
    question: "coordinator-subagent パターンで、subagent が失敗した場合の推奨されるリカバリ戦略は？",
    options: [
      "即座にプロセス全体を停止する",
      "同じ subagent を無限にリトライする",
      "coordinator がエラーを評価し、リトライ・代替エージェント・ユーザーへのエスカレーションを判断する",
      "失敗を無視して次のステップに進む",
    ],
    correct: 2,
    explanation: "coordinator は失敗の種類を評価し、一時的なエラーならリトライ、恒久的な問題なら代替手段やユーザーへのエスカレーションを選択すべきです。",
  },
  {
    domain: "agentic",
    question: "セッション状態（session state）の管理で、エージェントが長時間のタスクを処理する際に重要なのは？",
    options: [
      "全ての状態をグローバル変数に保存する",
      "状態を永続化せず毎回初期化する",
      "チェックポイントを設けて中間状態を保存し、途中再開を可能にする",
      "状態管理はユーザーに委ねる",
    ],
    correct: 2,
    explanation: "長時間タスクでは、チェックポイントによる中間状態の保存が重要です。これにより障害時の復旧やタスクの途中再開が可能になります。",
  },
  {
    domain: "agentic",
    question: "マルチエージェントシステムで「forking」を使うのが適切なケースは？",
    options: [
      "全てのタスクで常にforkingを使うべき",
      "複数の独立したサブタスクを並列に処理し、結果を統合する場合",
      "エージェント間の通信を減らしたい場合",
      "単一のシーケンシャルなワークフローの場合",
    ],
    correct: 1,
    explanation: "forkingは、互いに依存しない複数のサブタスクを並列に実行し、全ての結果が揃った後に統合する場面で最も効果的です。",
  },
  {
    domain: "agentic",
    question: "エージェントに「自律的に判断させる範囲」と「人間の確認を求める範囲」を設計する際の指針は？",
    options: [
      "全ての判断をエージェントに任せる",
      "全ての判断に人間の承認を求める",
      "リスクと可逆性に基づいて、低リスク・可逆な操作は自律的に、高リスク・不可逆な操作は人間の確認を求める",
      "コストだけを基準にする",
    ],
    correct: 2,
    explanation: "リスクレベルと可逆性を基準に判断の自律性を設計します。読み取り操作や低リスクな変更は自律的に、削除・送信・支払いなど不可逆な操作はhuman-in-the-loopで確認を求めるのがベストプラクティスです。",
  },
  {
    domain: "agentic",
    question: "エージェントの「推論オーバーロード」を防ぐための設計原則として最も適切なのは？",
    options: [
      "1つのエージェントに全ての機能を集約する",
      "ツール数を無制限に増やして柔軟性を高める",
      "各エージェントの責務を明確に限定し、利用可能なツールを必要最小限にする",
      "推論のステップ数を制限する",
    ],
    correct: 2,
    explanation: "エージェントに過剰なツールや責務を与えると、適切なツール選択や判断が困難になります。Single Responsibility Principleに基づき、各エージェントの役割とツールを限定することが重要です。",
  },

  // === Claude Code Config (20%) - 6 questions ===
  {
    domain: "claudeCode",
    question: "CLAUDE.mdファイルの階層構造で、プロジェクトルートに置いたCLAUDE.mdとサブディレクトリのCLAUDE.mdが競合した場合、どうなりますか？",
    options: [
      "ルートのCLAUDE.mdが常に優先される",
      "サブディレクトリのCLAUDE.mdが常に優先される",
      "両方が読み込まれ、サブディレクトリのものがより具体的なコンテキストとして追加適用される",
      "エラーが発生する",
    ],
    correct: 2,
    explanation: "CLAUDE.mdは階層的に読み込まれます。ルートの設定が基本となり、サブディレクトリのCLAUDE.mdがより具体的なコンテキストとして追加されます。",
  },
  {
    domain: "claudeCode",
    question: "Claude Codeのカスタムスラッシュコマンドを定義する正しい方法は？",
    options: [
      "CLAUDE.mdに直接コマンドを記述する",
      ".claude/commands/ ディレクトリにMarkdownファイルを作成する",
      "package.jsonにコマンドを追加する",
      "環境変数で定義する",
    ],
    correct: 1,
    explanation: ".claude/commands/ ディレクトリにMarkdownファイルを配置することで、カスタムスラッシュコマンドを定義できます。ファイル名がコマンド名になります。",
  },
  {
    domain: "claudeCode",
    question: "CI/CDパイプラインでClaude Codeを使用する際、最も重要な考慮事項は？",
    options: [
      "常にインタラクティブモードで実行する",
      "非インタラクティブモード（--print フラグ）で実行し、自動承認の範囲を明確に制限する",
      "全てのファイル変更を自動承認する",
      "CI/CD環境では使用しない",
    ],
    correct: 1,
    explanation: "CI/CDでは --print フラグで非インタラクティブに実行し、--allowedTools などで許可する操作を明確に制限することが重要です。",
  },
  {
    domain: "claudeCode",
    question: "CLAUDE.mdに記述すべき最も効果的な内容は？",
    options: [
      "プロジェクトの全ソースコードのコピー",
      "プロジェクトの構造・コーディング規約・ビルド手順・テスト方法などのコンテキスト情報",
      "個人的なメモや日記",
      "他のAIツールの使用方法",
    ],
    correct: 1,
    explanation: "CLAUDE.mdには、Claude Codeがプロジェクトを理解するための構造情報、コーディング規約、ビルド・テスト手順、重要な設計判断などを記述します。",
  },
  {
    domain: "claudeCode",
    question: "Claude Codeの「hooks」機能の用途として正しいのは？",
    options: [
      "Gitのフックを置き換えるもの",
      "特定のイベント（ツール呼び出し前後など）に応じてカスタムスクリプトを実行する仕組み",
      "WebhookのURLを登録する機能",
      "React Hooksと同じ概念",
    ],
    correct: 1,
    explanation: "Claude Codeのhooksは、ツール呼び出しの前後やセッション開始時などのイベントに応じてカスタムスクリプトを実行できる仕組みです。",
  },
  {
    domain: "claudeCode",
    question: "Claude Codeでコンテキストを効率的に管理するためのベストプラクティスは？",
    options: [
      "全てのファイルを毎回読み込む",
      "必要なファイルだけを参照し、/compact コマンドでコンテキストを整理する",
      "コンテキストは管理しなくてよい",
      "常に最大コンテキスト長を使い切る",
    ],
    correct: 1,
    explanation: "効率的なコンテキスト管理には、必要なファイルの選択的な読み込みと、/compact コマンドによる会話の整理が重要です。",
  },

  // === Prompt Engineering (20%) - 6 questions ===
  {
    domain: "prompt",
    question: "Claudeからの構造化出力（JSON）の信頼性を高めるために最も効果的な方法は？",
    options: [
      "「JSONで出力してください」と指示するだけ",
      "JSONスキーマを明示し、few-shotの例を提供し、出力バリデーションとリトライループを実装する",
      "XML形式で出力させてからJSONに変換する",
      "出力形式を指定しない",
    ],
    correct: 1,
    explanation: "構造化出力の信頼性には、明確なスキーマ定義 + few-shot例 + バリデーション + リトライの組み合わせが最も効果的です。",
  },
  {
    domain: "prompt",
    question: "システムプロンプトとユーザーメッセージの役割分担として適切なのは？",
    options: [
      "全ての指示をユーザーメッセージに入れる",
      "システムプロンプトに永続的な行動規範・ペルソナ・制約を、ユーザーメッセージにタスク固有の指示を配置する",
      "システムプロンプトは使わない",
      "システムプロンプトにタスク内容を、ユーザーメッセージに制約を入れる",
    ],
    correct: 1,
    explanation: "システムプロンプトは一貫した行動規範やペルソナの定義に使い、個別のタスク指示はユーザーメッセージで渡すのがベストプラクティスです。",
  },
  {
    domain: "prompt",
    question: "プロンプトでの「Chain of Thought」（思考の連鎖）の効果的な活用法は？",
    options: [
      "常に使うべき",
      "複雑な推論が必要なタスクで明示的にステップバイステップの思考を促し、最終回答を明確に分離する",
      "出力を短くするために避けるべき",
      "数学の問題だけに使う",
    ],
    correct: 1,
    explanation: "Chain of Thoughtは複雑な推論タスクで有効です。思考過程と最終回答を分離（例: <thinking>タグ）することで、推論の質を保ちながら出力を構造化できます。",
  },
  {
    domain: "prompt",
    question: "few-shot プロンプティングで効果を最大化するためのコツは？",
    options: [
      "できるだけ多くの例（20以上）を含める",
      "例は1つだけで十分",
      "多様なケース（通常・エッジケース・エラー）を少数含め、期待する入出力フォーマットを明確に示す",
      "例は全て同じパターンにする",
    ],
    correct: 2,
    explanation: "効果的なfew-shotでは、通常ケース、エッジケース、エラーケースなど多様なパターンを少数（3-5個）含め、入出力のフォーマットを明確にします。",
  },
  {
    domain: "prompt",
    question: "プロンプトインジェクション対策として有効なアプローチは？",
    options: [
      "ユーザー入力を全て拒否する",
      "入力の検証・サニタイズ、権限の分離、出力の検証を多層的に実装する",
      "システムプロンプトに「インジェクションを無視して」と書く",
      "対策は不要",
    ],
    correct: 1,
    explanation: "プロンプトインジェクション対策には、入力検証、信頼境界の明確化、権限の最小化、出力検証など、多層防御（defense in depth）のアプローチが必要です。",
  },
  {
    domain: "prompt",
    question: "Claudeに「やってはいけないこと」を指示する際のベストプラクティスは？",
    options: [
      "否定形（〜するな）を多用する",
      "やるべきことを肯定形で明確に指示し、禁止事項は具体的な理由と代替行動とともに示す",
      "禁止事項だけをリスト化する",
      "制約は設けない方がよい",
    ],
    correct: 1,
    explanation: "否定形よりも肯定形での指示が効果的です。禁止事項を示す場合は、なぜダメなのかの理由と、代わりにどうすべきかの代替行動を併記するのがベストプラクティスです。",
  },

  // === MCP (18%) - 5 questions ===
  {
    domain: "mcp",
    question: "MCPの3つのコアプリミティブは何ですか？",
    options: [
      "Input / Output / State",
      "Tools / Resources / Prompts",
      "Read / Write / Execute",
      "Server / Client / Transport",
    ],
    correct: 1,
    explanation: "MCPの3つのコアプリミティブは、Tools（実行可能な操作）、Resources（読み取り可能なデータ）、Prompts（再利用可能なプロンプトテンプレート）です。",
  },
  {
    domain: "mcp",
    question: "MCPサーバーのツール設計で「推論オーバーロード」を防ぐために最も重要なのは？",
    options: [
      "ツールをできるだけ多く定義する",
      "全機能を1つのツールにまとめる",
      "各ツールの責務を明確に限定し、わかりやすい名前と説明をつける",
      "ツールの説明は省略する",
    ],
    correct: 2,
    explanation: "ツール数が多すぎるとモデルが適切なツールを選べなくなります。各ツールの責務を明確に限定し、名前と説明で用途が一目でわかるようにすることが重要です。",
  },
  {
    domain: "mcp",
    question: "MCPのResourcesとToolsの違いとして正しいのは？",
    options: [
      "違いはない、同じもの",
      "Resourcesは読み取り専用のデータ提供、Toolsは副作用を伴う操作の実行",
      "ResourcesはサーバーサイドToolsはクライアントサイド",
      "Resourcesは非同期、Toolsは同期",
    ],
    correct: 1,
    explanation: "Resourcesはファイルやデータベースの内容などの読み取り専用データを提供し、Toolsは外部APIの呼び出しやファイルの書き込みなど副作用を伴う操作を実行します。",
  },
  {
    domain: "mcp",
    question: "MCPのトランスポート層で、ローカル環境とリモート環境それぞれに適したプロトコルは？",
    options: [
      "どちらもHTTPを使う",
      "ローカルはstdio、リモートはStreamable HTTPまたはSSE",
      "ローカルはWebSocket、リモートはgRPC",
      "どちらもstdioを使う",
    ],
    correct: 1,
    explanation: "ローカル環境ではstdio（標準入出力）トランスポートが簡便で高速、リモート環境ではStreamable HTTPやServer-Sent Events（SSE）が適しています。",
  },
  {
    domain: "mcp",
    question: "MCPサーバーを本番環境にデプロイする際のセキュリティ上の重要な考慮事項は？",
    options: [
      "セキュリティは不要",
      "ツールの実行権限を最小限にし、入力バリデーション、認証・認可、レート制限を実装する",
      "全てのツールに管理者権限を付与する",
      "HTTPSだけで十分",
    ],
    correct: 1,
    explanation: "本番MCPサーバーでは、最小権限の原則、入力バリデーション、適切な認証・認可、レート制限、ログ監査など多層的なセキュリティ対策が必要です。",
  },

  // === Context Management (15%) - 5 questions ===
  {
    domain: "context",
    question: "長いコンテキストウィンドウを使用する際の「Lost in the Middle」問題への対処法は？",
    options: [
      "重要な情報を常にコンテキストの先頭に配置する",
      "重要な情報をコンテキストの先頭と末尾に配置し、中間部分にはあまり重要でない情報を置く",
      "コンテキストの長さは関係ない",
      "常に最短のコンテキストを使う",
    ],
    correct: 1,
    explanation: "LLMは入力の先頭と末尾の情報を最もよく処理する傾向があります。重要な指示やデータは先頭・末尾に配置し、補助的な情報を中間に置くのが効果的です。",
  },
  {
    domain: "context",
    question: "エージェント間のハンドオフ（引き継ぎ）パターンで重要なのは？",
    options: [
      "全てのコンテキストをそのまま次のエージェントに渡す",
      "コンテキストは渡さず、タスクだけを渡す",
      "タスクの要約、関連コンテキスト、完了状態を構造化して引き継ぐ",
      "ハンドオフは避けるべき",
    ],
    correct: 2,
    explanation: "効果的なハンドオフには、タスクの要約、必要なコンテキストの選択的な引き継ぎ、これまでの完了状態の明示が重要です。全コンテキストの受け渡しは非効率です。",
  },
  {
    domain: "context",
    question: "Claudeの出力の「信頼性調整（confidence calibration）」を実装する方法は？",
    options: [
      "Claudeは常に正確なので不要",
      "出力に信頼度スコアを付加させ、低信頼度の場合は追加検証やユーザー確認を行うフローを設計する",
      "温度パラメータを0にするだけで十分",
      "出力を常にダブルチェックさせる",
    ],
    correct: 1,
    explanation: "信頼性調整では、モデルに自己の確信度を表明させ、それに基づいて追加検証、別のアプローチの試行、ユーザーへのエスカレーションなどを分岐させます。",
  },
  {
    domain: "context",
    question: "コンテキストウィンドウの使用量を最適化するテクニックとして有効なのは？",
    options: [
      "全ての会話履歴を常に保持する",
      "要約、選択的なコンテキスト読み込み、不要な履歴の除外を組み合わせる",
      "コンテキストの最適化は不要",
      "常に最大トークンを使い切る",
    ],
    correct: 1,
    explanation: "コンテキスト最適化には、古い会話の要約化、必要なファイル・データの選択的な読み込み、不要な中間結果の除外などを組み合わせます。",
  },
  {
    domain: "context",
    question: "エージェントが「幻覚（hallucination）」を起こすリスクを下げるための設計は？",
    options: [
      "プロンプトで「嘘をつくな」と指示する",
      "外部ツールでの事実検証、引用の要求、「わからない」を許容する設計、構造化出力による検証を組み合わせる",
      "温度を最低にする",
      "モデルサイズを大きくする",
    ],
    correct: 1,
    explanation: "幻覚対策には多層的なアプローチが必要です。ツールによるground truth検証、ソース引用の要求、不確実性の明示を促す設計、出力スキーマによるバリデーションの組み合わせが効果的です。",
  },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticeExam() {
  const [phase, setPhase] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startExam = () => {
    const shuffled = shuffleArray(QUESTIONS);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setAnswers([]);
    setPhase("exam");
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    setIntervalId(id);
    setTimer(0);
  };

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setShowExplanation(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, { question: current, selected, correct: questions[current].correct }];
    setAnswers(newAnswers);
    setSelected(null);
    setShowExplanation(false);
    if (current + 1 >= questions.length) {
      clearInterval(intervalId);
      setPhase("result");
      setAnswers(newAnswers);
    } else {
      setCurrent(current + 1);
    }
  };

  const results = useMemo(() => {
    if (phase !== "result") return null;
    const domainScores = {};
    Object.keys(DOMAINS).forEach((d) => {
      domainScores[d] = { total: 0, correct: 0 };
    });
    answers.forEach((a) => {
      const q = questions[a.question];
      domainScores[q.domain].total++;
      if (a.selected === a.correct) domainScores[q.domain].correct++;
    });
    const totalCorrect = answers.filter((a) => a.selected === a.correct).length;
    const percentage = Math.round((totalCorrect / answers.length) * 100);
    return { domainScores, totalCorrect, percentage };
  }, [phase, answers, questions]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ---- Start Screen ----
  if (phase === "start") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0a1e 0%, #1a1040 50%, #0d0620 100%)", color: "#fff", fontFamily: "'Segoe UI', -apple-system, sans-serif", padding: "40px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Practice Exam
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 }}>
              Claude Certified Architect
              <br />
              <span style={{ color: "#a78bfa" }}>Foundations</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
              5つの試験ドメインをカバーする30問の模擬テスト。
              <br />
              解答後に正解と解説が表示されます。
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "28px 32px", marginBottom: 32, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 20px", color: "#e2e8f0" }}>試験ドメイン</h3>
            {Object.entries(DOMAINS).map(([key, d]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 14, gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 14, color: "#cbd5e1" }}>{d.name}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: d.color }}>{d.weight}%</div>
                <div style={{ width: 100, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.weight * 3.7}%`, background: d.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
            {[
              { label: "問題数", value: "30問" },
              { label: "形式", value: "多肢選択" },
              { label: "目安時間", value: "20-30分" },
            ].map((item) => (
              <div key={item.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#a78bfa" }}>{item.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={startExam}
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "16px 48px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "transform 0.15s" }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              テスト開始
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Exam Screen ----
  if (phase === "exam") {
    const q = questions[current];
    const domain = DOMAINS[q.domain];
    const progress = ((current + 1) / questions.length) * 100;

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0a1e 0%, #1a1040 50%, #0d0620 100%)", color: "#fff", fontFamily: "'Segoe UI', -apple-system, sans-serif", padding: "24px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {current + 1} / {questions.length}
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(timer)}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", marginBottom: 28, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #a78bfa)", borderRadius: 2, transition: "width 0.3s" }} />
          </div>

          {/* Domain tag */}
          <div style={{ display: "inline-block", background: `${domain.color}22`, border: `1px solid ${domain.color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, color: domain.color, marginBottom: 20 }}>
            {domain.name}
          </div>

          {/* Question */}
          <h2 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.6, margin: "0 0 28px", color: "#f1f5f9" }}>{q.question}</h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {q.options.map((opt, idx) => {
              let bg = "rgba(255,255,255,0.04)";
              let border = "1px solid rgba(255,255,255,0.08)";
              let icon = null;
              if (showExplanation) {
                if (idx === q.correct) {
                  bg = "rgba(34,197,94,0.12)";
                  border = "1px solid rgba(34,197,94,0.4)";
                  icon = "✓";
                } else if (idx === selected && idx !== q.correct) {
                  bg = "rgba(239,68,68,0.12)";
                  border = "1px solid rgba(239,68,68,0.4)";
                  icon = "✗";
                }
              } else if (idx === selected) {
                bg = "rgba(99,102,241,0.15)";
                border = "1px solid rgba(99,102,241,0.5)";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, background: bg, border, borderRadius: 12, padding: "14px 18px", cursor: showExplanation ? "default" : "pointer", textAlign: "left", color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, transition: "all 0.15s" }}
                >
                  <span style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", flexShrink: 0, color: icon === "✓" ? "#22c55e" : icon === "✗" ? "#ef4444" : "#94a3b8" }}>
                    {icon || String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "18px 20px", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>解説</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#cbd5e1", margin: 0 }}>{q.explanation}</p>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            {!showExplanation ? (
              <button
                onClick={handleConfirm}
                disabled={selected === null}
                style={{ background: selected === null ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: selected === null ? "#64748b" : "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: selected === null ? "default" : "pointer" }}
              >
                回答する
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                {current + 1 >= questions.length ? "結果を見る" : "次の問題 →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- Result Screen ----
  if (phase === "result" && results) {
    const { domainScores, totalCorrect, percentage } = results;
    const passed = percentage >= 70;

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0a1e 0%, #1a1040 50%, #0d0620 100%)", color: "#fff", fontFamily: "'Segoe UI', -apple-system, sans-serif", padding: "40px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Score */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: passed ? "#22c55e" : "#f59e0b", letterSpacing: 1, marginBottom: 12 }}>
              {passed ? "PASS — 合格ライン到達" : "要復習 — もう少し!"}
            </div>
            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="80" cy="80" r="70" fill="none" stroke={passed ? "#22c55e" : "#f59e0b"} strokeWidth="10" strokeDasharray={`${percentage * 4.4} 440`} strokeLinecap="round" transform="rotate(-90 80 80)" />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontSize: 40, fontWeight: 700 }}>{percentage}%</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {totalCorrect}/{questions.length}
                </div>
              </div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>
              所要時間: {formatTime(timer)}
            </p>
          </div>

          {/* Domain breakdown */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "28px 32px", marginBottom: 32, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 24px", color: "#e2e8f0" }}>
              ドメイン別スコア
            </h3>
            {Object.entries(DOMAINS).map(([key, d]) => {
              const s = domainScores[key];
              const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
              const isWeak = pct < 60;
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#cbd5e1" }}>{d.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isWeak ? "#ef4444" : pct >= 80 ? "#22c55e" : "#f59e0b" }}>
                      {s.correct}/{s.total} ({pct}%)
                      {isWeak && " ← 要強化"}
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div
                      style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: isWeak ? "#ef4444" : pct >= 80 ? "#22c55e" : "#f59e0b", transition: "width 0.5s" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "28px 32px", marginBottom: 40, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", color: "#e2e8f0" }}>学習アドバイス</h3>
            {Object.entries(domainScores)
              .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.7)
              .map(([key]) => {
                const courseMap = {
                  agentic: "Introduction to Agent Skills",
                  claudeCode: "Claude Code in Action",
                  prompt: "Building with the Claude API",
                  mcp: "Introduction to Model Context Protocol",
                  context: "Building with the Claude API (Context管理セクション)",
                };
                return (
                  <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: "#f59e0b", fontSize: 16, lineHeight: 1 }}>!</span>
                    <p style={{ fontSize: 13, color: "#cbd5e1", margin: 0, lineHeight: 1.6 }}>
                      <strong style={{ color: "#e2e8f0" }}>{DOMAINS[key].name}</strong> — 推奨コース: {courseMap[key]}
                    </p>
                  </div>
                );
              })}
            {Object.entries(domainScores).filter(([, s]) => s.total > 0 && s.correct / s.total < 0.7).length === 0 && (
              <p style={{ fontSize: 14, color: "#22c55e", margin: 0 }}>
                全ドメイン70%以上クリア。本番試験の準備ができています。
              </p>
            )}
          </div>

          {/* Retry */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => { setPhase("start"); setTimer(0); }}
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 40px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              もう一度挑戦する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
