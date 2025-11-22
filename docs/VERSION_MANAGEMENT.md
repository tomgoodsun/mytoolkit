# バージョン管理ガイド

## 概要

このプロジェクトは[Semantic Versioning (SemVer)](https://semver.org/)に従ってバージョン管理しています。

バージョン形式: `MAJOR.MINOR.PATCH`

- **MAJOR**: 破壊的変更（後方互換性のない変更）
- **MINOR**: 機能追加（後方互換性あり）
- **PATCH**: バグフィックス（後方互換性あり）

## バージョン更新手順

### 1. 手動更新

`package.json`の`version`フィールドを編集：

```json
{
  "version": "2.1.0"
}
```

### 2. npmコマンドで自動更新（推奨）

```bash
# パッチバージョンアップ（バグフィックス）
# 2.1.0 → 2.1.1
npm version patch

# マイナーバージョンアップ（新機能追加）
# 2.1.0 → 2.2.0
npm version minor

# メジャーバージョンアップ（破壊的変更）
# 2.1.0 → 3.0.0
npm version major
```

**注意**: `npm version`コマンドは以下を自動実行します：
- `package.json`のバージョン更新
- Gitコミット作成
- Gitタグ作成

### 3. Gitタグのプッシュ

```bash
# タグをリモートにプッシュ
git push origin main --tags

# または特定のタグのみ
git push origin v2.1.0
```

## バージョン履歴の例

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 2.1.0 | 2024-XX-XX | コンポーネント共通化、レイアウト改善 |
| 2.0.0 | 2024-XX-XX | Vue 2 → Vue 3へアップグレード |
| 1.0.0 | 20XX-XX-XX | 初回リリース |

## リリースワークフロー

### 開発ブランチでの作業

```bash
# 機能開発
git checkout -b feature/new-feature
# ... 開発作業 ...
git commit -m "feat: 新機能追加"
```

### マージとバージョンアップ

```bash
# mainブランチにマージ
git checkout main
git merge feature/new-feature

# バージョンアップ（自動でコミット＆タグ作成）
npm version minor -m "chore: version bump to %s"

# プッシュ
git push origin main --tags
```

## 表示される場所

バージョン番号は以下の場所に自動表示されます：

- **ヘッダ**: `tom-gs.com toolkit Ver.2.1.0 - HOME`
- **package.json**: プロジェクトのメタデータ

## トラブルシューティング

### バージョンが表示されない場合

1. 開発サーバーを再起動：
```bash
npm run dev
```

2. ビルドキャッシュをクリア：
```bash
rm -rf node_modules/.vite
npm run dev
```

### Gitタグを削除する場合

```bash
# ローカルのタグを削除
git tag -d v2.1.0

# リモートのタグを削除
git push origin :refs/tags/v2.1.0
```

## 参考リンク

- [Semantic Versioning](https://semver.org/)
- [npm version](https://docs.npmjs.com/cli/v9/commands/npm-version)
- [Git Basics - Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
