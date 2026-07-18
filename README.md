# Mise + Node.js + pnpm + TypeScript 環境構築手順書

Mise で Node.js / PNPM のバージョンを固定し、TypeScript を **トランスパイルせずに** `node` で直接実行する最小プロジェクトです。

## 使用バージョン

| ツール | バージョン | 管理方法 |
|--------|------------|----------|
| Node.js | 26.5.0（Current） | Mise（`mise.toml`） |
| PNPM | 10.34.5 | Mise（`mise.toml`） |
| TypeScript | 7.0.2 | PNPM（devDependency） |

## 1. Mise の導入（未導入の場合）

macOS（Homebrew）の例:

```bash
brew install mise
```

シェルに hook を追加します（zsh の例）。`~/.zshrc` に次を追記し、シェルを再読み込みしてください。

```bash
eval "$(mise activate zsh)"
```

導入確認:

```bash
mise --version
```

## 2. このリポジトリでのツール導入

リポジトリのルートで次を実行します。`mise.toml` に定義した Node.js / PNPM がインストールされます。

```bash
mise install
```

バージョン確認:

```bash
node --version   # v26.5.0
pnpm --version   # 10.34.5
```

`mise activate` 済みなら、カレントディレクトリに入ると自動で該当バージョンが PATH に入ります。

## 3. 依存パッケージのインストール

```bash
pnpm install
```

TypeScript と `@types/node` がインストールされます。

## 4. 実行と型チェック

### TypeScript の直接実行（トランスパイル不要）

Node.js 26 は型注釈をランタイムで取り除く（type stripping）ため、`.ts` をそのまま実行できます。

```bash
pnpm start
# 内部では `node src/index.ts` を実行
```

期待される出力例:

```text
Hello, TypeScript + Node.js!
Node.js v26.5.0
```

### 型チェック

実行時の type stripping は型チェックを行いません。型の検証は `tsc` で行います。

```bash
pnpm typecheck
# 内部では `tsc --noEmit` を実行
```

## 5. Node.js の type stripping に関する注意

- 対応するのは **erasable（消去可能な）構文** のみです（型注釈、`interface`、型専用の `import type` など）。
- 次のような **実行時変換が必要な構文は使えません**:
  - `enum` / `const enum`
  - `namespace`（ランタイムコードを含むもの）
  - クラスのパラメータプロパティ（`constructor(private x: T)`）
  - 実験的デコレータなど
- 本プロジェクトでは `tsconfig.json` の `erasableSyntaxOnly: true` により、上記の非対応構文を型チェック時に検出します。
- Node.js は `tsconfig.json` を実行時には読みません。モジュール解決や `paths` などはランタイムでは効きません。

## プロジェクト構成

```text
.
├── mise.toml          # Node.js / PNPM のバージョン固定
├── package.json       # スクリプトと依存関係
├── tsconfig.json      # Node 直接実行向け TypeScript 設定
├── src/
│   └── index.ts       # サンプルエントリ
├── .gitignore
└── README.md
```

## よく使うコマンド

| コマンド | 内容 |
|----------|------|
| `mise install` | `mise.toml` のツールをインストール |
| `pnpm install` | 依存パッケージをインストール |
| `pnpm start` | `src/index.ts` を Node.js で直接実行 |
| `pnpm typecheck` | TypeScript の型チェック（出力なし） |

## 参照

- [Node.js リリース](https://nodejs.org/ja/about/previous-releases)
- [Modules: TypeScript（Node.js 公式）](https://nodejs.org/docs/latest/api/typescript.html)
- [Mise ドキュメント](https://mise.jdx.dev/)
