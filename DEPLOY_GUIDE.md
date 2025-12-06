# 🚀 GitHubとRenderへのデプロイ手順

## 📋 前提条件
- GitHubアカウント
- Renderアカウント（無料）
- Git（インストール済み）

---

## ステップ1: GitHubリポジトリの作成

### 1-1. GitHubにログイン
https://github.com にアクセスしてログイン

### 1-2. 新規リポジトリを作成
1. 右上の「+」マーク → 「New repository」をクリック
2. 以下を入力：
   - **Repository name**: `world-heritage-quiz`（任意の名前）
   - **Description**: 世界遺産検定3級対策サイト
   - **Public** を選択（無料でホスティングするため）
   - 「Add a README file」は**チェックしない**
3. 「Create repository」をクリック

---

## ステップ2: ローカルファイルをGitHubにアップロード

### 2-1. ダウンロードしたファイルを準備
1. ダウンロードした `world-heritage-quiz` フォルダを開く
2. 以下のファイルがあることを確認：
   - `index.html`
   - `style.css`
   - `script.js`
   - `questions.csv`
   - `README.md`

### 2-2. Gitコマンドでアップロード

ターミナル（WindowsならGit Bash）を開き、以下のコマンドを実行：

```bash
# プロジェクトフォルダに移動
cd /path/to/world-heritage-quiz

# Gitを初期化
git init

# すべてのファイルをステージング
git add .

# 最初のコミット
git commit -m "世界遺産検定3級対策サイト初版"

# ブランチ名をmainに変更
git branch -M main

# リモートリポジトリを追加（YOUR_USERNAMEを自分のGitHubユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/world-heritage-quiz.git

# プッシュ
git push -u origin main
```

**注意**: `YOUR_USERNAME` の部分を自分のGitHubユーザー名に置き換えてください。

### 2-3. GitHubでファイルを確認
ブラウザでリポジトリを開き、ファイルがアップロードされたことを確認

---

## ステップ3: Renderでホスティング

### 3-1. Renderにサインアップ
1. https://render.com にアクセス
2. 「Get Started」をクリック
3. GitHubアカウントでサインアップ（推奨）

### 3-2. 新しい Static Site を作成
1. ダッシュボードで「New +」をクリック
2. 「Static Site」を選択
3. GitHubリポジトリを接続：
   - 「Connect a repository」をクリック
   - `world-heritage-quiz` を選択

### 3-3. 設定を入力
以下の設定を入力：

| 項目 | 値 |
|------|-----|
| **Name** | `world-heritage-quiz`（任意） |
| **Branch** | `main` |
| **Build Command** | （空欄のまま） |
| **Publish Directory** | `.` |

### 3-4. デプロイ開始
1. 「Create Static Site」をクリック
2. デプロイが自動で始まります（1-2分で完了）
3. 完了すると、URLが表示されます（例: `https://world-heritage-quiz.onrender.com`）

### 3-5. サイトにアクセス
表示されたURLをクリックして、サイトが正しく動作することを確認！

---

## 📝 問題データの更新方法

### 方法1: GitHubのWebエディタで編集（簡単）
1. GitHubリポジトリで `questions.csv` を開く
2. 鉛筆アイコン（Edit）をクリック
3. 問題を追加・編集
4. 画面下の「Commit changes」をクリック
5. Renderが自動で再デプロイ（数分で反映）

### 方法2: Excelで編集（推奨）
1. `questions.csv` をExcelで開く
2. 問題を追加・編集
3. 「名前を付けて保存」→「CSV UTF-8（コンマ区切り）」で保存
4. ターミナルで以下を実行：
```bash
git add questions.csv
git commit -m "問題を更新"
git push
```
5. Renderが自動で再デプロイ

---

## 🎨 カスタマイズ方法

### タイトルやテーマを変更
- `index.html` の `<h1>` タグを編集
- `style.css` の `:root` セクションで色を変更

### カテゴリを追加
`questions.csv` の `category` 列に新しいカテゴリ名を入力するだけ！
自動的にカテゴリ選択に反映されます。

### 問題を追加
`questions.csv` に新しい行を追加してコミット・プッシュするだけ！

---

## ⚠️ トラブルシューティング

### 問題1: Git pushでエラーが出る
→ GitHubの認証情報を確認してください。
→ Personal Access Token が必要な場合があります。

### 問題2: Renderでデプロイが失敗する
→ ブランチ名が `main` になっているか確認
→ ファイル名が正確か確認（大文字小文字も区別）

### 問題3: サイトにアクセスできない
→ Renderのダッシュボードでデプロイが完了しているか確認
→ URLを正確にコピーしているか確認

### 問題4: 問題が表示されない
→ `questions.csv` のフォーマットが正しいか確認
→ ブラウザのコンソール（F12キー）でエラーを確認

---

## 📱 スマホでの確認方法

1. RenderのURLをメモ
2. スマホのブラウザでURLを開く
3. ホーム画面に追加すれば、アプリのように使える！

---

## 🎯 次のステップ

✅ 問題を100問に増やす
✅ 解説を充実させる
✅ 友達とURLを共有して一緒に学習
✅ 統計機能で学習進捗を確認

---

## 💡 ヒント

- 毎日少しずつ問題を解いて習慣化しましょう
- 間違えた問題を復習する機能を活用しましょう
- ダークモードは夜の学習におすすめです
- 連続正解でモチベーションアップ！

---

## 📧 サポート

問題や質問があれば、GitHubのIssuesで報告してください。

**Good luck with your study! 🎓**
