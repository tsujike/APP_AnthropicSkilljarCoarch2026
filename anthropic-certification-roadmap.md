# Anthropic 認定資格ロードマップ

> 作成日: 2026年3月20日 | 対象: Kenny（TG GLOBAL）

---

## 全体像

Anthropic Academy（https://anthropic.skilljar.com）では、13の無料コースと1つの有料認定試験を提供しています。全コース無料・修了証付き。Claude有料サブスクリプションは不要です。

```
Phase 1          Phase 2           Phase 3           Phase 4
基礎理解          開発者スキル        専門領域           認定試験
(1-2週間)        (2-3週間)         (1-2週間)         (準備+受験)
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│Claude│     │ API構築  │     │ Claude   │     │ Certified│
│ 101  │────▶│ + MCP    │────▶│ Code +   │────▶│ Architect│
│      │     │          │     │ Agents   │     │ Exam     │
└──────┘     └──────────┘     └──────────┘     └──────────┘
```

---

## Phase 1: 基礎を固める（Week 1-2）

### 1. Claude 101
- Claude の基本操作、プロンプティング、デスクトップアプリ、Projects、Artifacts
- 全ての土台となるコース。最初に必ず受講

### 2. AI Fluency: Framework & Foundations
- AIとの効果的な協業の原則（委任・判断・倫理・安全性）
- 概念的なフレームワークを理解する

> **Kenny向けヒント**: TG GLOBALのパートナーサクセスエージェント26名を運用する上で、このAI Fluencyの考え方は直接活きます。

---

## Phase 2: 開発者スキルを習得（Week 3-5）

### 3. Building with the Claude API（8時間超の大型コース）
- システムプロンプト、ツール使用、コンテキストウィンドウ
- アーキテクチャパターン、プロダクション設計
- **試験ドメインの「Prompt Engineering & Structured Output」に直結**

### 4. Introduction to Model Context Protocol (MCP)
- MCPの3つの基本要素: Tools / Resources / Prompts
- PythonでMCPサーバー・クライアントを構築
- **試験ドメイン「Tool Design & MCP Integration (18%)」に直結**

### 5. Model Context Protocol: Advanced Topics
- サンプリング、通知、ファイルシステムアクセス
- 本番環境向けトランスポート機構

---

## Phase 3: 専門領域を深める（Week 6-7）

### 6. Claude Code in Action
- Claude Codeの開発ワークフロー統合
- CLAUDE.md階層、カスタムスラッシュコマンド
- CI/CDパイプラインへの組み込み
- **試験ドメイン「Claude Code Configuration & Workflows (20%)」に直結**

### 7. Introduction to Agent Skills
- エージェント設計パターン
- マルチエージェントオーケストレーション
- **試験最重要ドメイン「Agentic Architecture & Orchestration (27%)」に直結**

### 8-9. クラウドプラットフォーム（必要に応じて）
- Claude with Amazon Bedrock
- Claude with Google Cloud's Vertex AI

---

## Phase 4: 認定試験に挑む

### Claude Certified Architect — Foundations

**試験概要:**

| 項目 | 詳細 |
|------|------|
| 受験料 | $99 / 回 |
| 問題数 | 60問（多肢選択） |
| 形式 | オンライン |
| 開始日 | 2026年3月12日〜 |

**5つの試験ドメインと配点:**

```
  Agentic Architecture (27%) ████████████████████████████
  Claude Code Config   (20%) █████████████████████
  Prompt Engineering   (20%) █████████████████████
  Tool Design & MCP    (18%) ███████████████████
  Context & Reliability(15%) ████████████████
```

| ドメイン | 配点 | 重点内容 |
|---------|------|---------|
| Agentic Architecture & Orchestration | 27% | マルチエージェント設計、タスク分解、hub-and-spokeモデル |
| Claude Code Configuration & Workflows | 20% | CLAUDE.md、スラッシュコマンド、CI/CD統合 |
| Prompt Engineering & Structured Output | 20% | JSONスキーマ、few-shot、バリデーションループ |
| Tool Design & MCP Integration | 18% | MCPサーバー設計、ツール境界管理 |
| Context Management & Reliability | 15% | ロングコンテキスト、ハンドオフ、信頼性調整 |

---

## 補足コース（AI Fluency シリーズ）

業種別のAI活用を学べる追加コース。認定試験に直接は関係しませんが、AIリテラシーの底上げに有用です。

- AI Fluency for Nonprofits
- AI Fluency for Educators
- AI Fluency for Students
- Teaching AI Fluency

---

## 学習スケジュール案（8週間プラン）

| 週 | やること | 目安時間 |
|----|---------|---------|
| Week 1 | Claude 101 + AI Fluency | 3-4h |
| Week 2 | Building with the Claude API（前半） | 4h |
| Week 3 | Building with the Claude API（後半） | 4h |
| Week 4 | Introduction to MCP | 3-4h |
| Week 5 | MCP Advanced Topics | 3-4h |
| Week 6 | Claude Code in Action | 3-4h |
| Week 7 | Introduction to Agent Skills + 復習 | 3-4h |
| Week 8 | 模擬問題・弱点補強 → 受験 | 5-6h |

**合計: 約30-35時間**

---

## 試験対策のポイント

1. **最重要**: Agentic Architecture（27%）— マルチエージェントパターン、タスク分解戦略を重点的に
2. **実践**: Claude Codeを日常業務で実際に使い、CLAUDE.mdの書き方に慣れる
3. **MCP**: ツール設計の境界管理、推論オーバーロード防止の考え方を理解
4. **公式ドキュメント**: https://docs.claude.com を常に参照
5. **ハンズオン**: コースの演習は必ず手を動かして実行する

---

## リンク集

| リソース | URL |
|---------|-----|
| Anthropic Academy（全コース） | https://anthropic.skilljar.com |
| Anthropic 公式ドキュメント | https://docs.claude.com |
| Anthropic 学習ページ | https://www.anthropic.com/learn |

---

> 「2026年後半にはSeller向け・Developer向け・Advanced Architect向けの追加資格も予定」とAnthropicが発表しています。まずはFoundationsを取得しておくことで、今後のキャリアパスが広がります。
