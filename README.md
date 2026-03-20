# Anthropic Skilljar — CCA試験対策リポジトリ

> Claude Certified Architect (CCA) Foundations 認定取得に向けた学習リソース

## このリポジトリについて

Anthropic Academy（https://anthropic.skilljar.com）が提供する13の無料コースと、CCA Foundations認定試験の対策資料をまとめたリポジトリです。

## 収録コンテンツ

| ファイル | 内容 |
|---------|------|
| `anthropic-certification-roadmap.md` | 8週間の学習ロードマップ。5つの試験ドメインと対応コースの紐付け |
| `cca-level-check.jsx` | 10問のレベルチェック診断（React）。今の実力と学習コストを5分で測定 |
| `cca-practice-exam.jsx` | 30問の模擬テスト（React）。ドメイン別スコア・解説付き |

## CCA Foundations 試験概要

- **問題数**: 60問（多肢選択）
- **受験料**: $99
- **合格ライン**: 非公開（目安70%以上）

### 5つの試験ドメイン

```
Agentic Architecture & Orchestration ···· 27%
Claude Code Configuration & Workflows ··· 20%
Prompt Engineering & Structured Output ·· 20%
Tool Design & MCP Integration ·········· 18%
Context Management & Reliability ········ 15%
```

## 準備コース（Anthropic Academy — 全て無料）

1. Claude 101
2. AI Fluency: Framework & Foundations
3. Building with the Claude API
4. Introduction to Model Context Protocol
5. Model Context Protocol: Advanced Topics
6. Claude Code in Action
7. Introduction to Agent Skills
8. Claude with Amazon Bedrock
9. Claude with Google Cloud's Vertex AI
10. AI Fluency for Educators
11. AI Fluency for Students
12. AI Fluency for Nonprofits
13. Teaching AI Fluency

## 使い方

### Step 1: レベルチェック（5分）

まず `cca-level-check.jsx` で今の実力を診断。5ドメイン×2問の10問で、試験までの学習コスト（期間・時間）と弱点ドメインがわかります。

### Step 2: ロードマップに沿って学習

`anthropic-certification-roadmap.md` を開いて、診断結果に応じた週からスタート。

### Step 3: 模擬テストで仕上げ

`cca-practice-exam.jsx` で30問の本番形式テスト。各問に解説付き、ドメイン別スコアで弱点を最終確認。

### 実行方法

各 `.jsx` ファイルはReactコンポーネントです。

- **Claude Desktop（Cowork）**: ファイルを開くと自動でレンダリングされます
- **ローカル環境**: Vite / Next.js などのReactプロジェクトにインポートして使用

## リンク

- [Anthropic Academy](https://anthropic.skilljar.com)
- [Anthropic 公式ドキュメント](https://docs.claude.com)
- [Anthropic 学習ページ](https://www.anthropic.com/learn)

---

管理: Kenny Tsuji / TG GLOBAL
