# 世界遺産検定3級 対策Webサイト

## 📚 概要
世界遺産検定3級合格を目指すための学習用Webサイトです。
100問の四択問題を解きながら、楽しく効率的に学習できます。

## ✨ 機能
- 📖 順番出題 / ランダム出題の選択
- 🎯 カテゴリ別出題（日本、アジア、ヨーロッパなど）
- 📝 詳しい解説表示
- 💾 学習履歴の自動保存
- 🔄 間違えた問題の復習機能
- 🎉 連続正解でモチベーションアップ
- 🌙 ダークモード対応
- 🔊 正解音・不正解音（ON/OFF可能）
- 📱 スマホ・タブレット完全対応

## 📁 ファイル構成
```
world-heritage-quiz/
├── index.html          # メインHTMLファイル
├── style.css          # スタイルシート
├── script.js          # JavaScript（メインロジック）
├── questions.csv      # 問題データ（Excelから書き出し）
└── README.md          # このファイル
```

## 🚀 デプロイ方法（Render）

### 1. GitHubリポジトリの作成
1. GitHubで新しいリポジトリを作成
2. リポジトリ名: `world-heritage-quiz`（任意）
3. Public / Private お好みで

### 2. ファイルのアップロード
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/world-heritage-quiz.git
git push -u origin main
```

### 3. Renderでのデプロイ
1. [Render](https://render.com/)にアクセス
2. 「New +」→「Static Site」を選択
3. GitHubリポジトリを接続
4. 設定:
   - Name: `world-heritage-quiz`（任意）
   - Branch: `main`
   - Build Command: （空欄）
   - Publish Directory: `.`（カレントディレクトリ）
5. 「Create Static Site」をクリック

数分でデプロイ完了！URLが発行されます。

## 📝 問題データの更新方法

### Excelでの編集
1. `questions.csv`をExcelで開く
2. 問題を追加・編集
3. 「名前を付けて保存」→「CSV UTF-8（コンマ区切り）」で保存
4. GitHubにプッシュ
```bash
git add questions.csv
git commit -m "問題を更新"
git push
```
5. Renderが自動的に再デプロイ

### CSVのフォーマット
| 列 | 内容 | 例 |
|---|---|---|
| id | 問題番号 | 1 |
| category | カテゴリ | 日本 |
| question | 問題文 | 日本で最初に世界遺産に登録された文化遺産は？ |
| choice_a | 選択肢ア | 古都京都の文化財 |
| choice_b | 選択肢イ | 法隆寺地域の仏教建造物 |
| choice_c | 選択肢ウ | 姫路城 |
| choice_d | 選択肢エ | 厳島神社 |
| correct | 正解 | b |
| explanation | 解説 | 法隆寺は1993年に姫路城とともに... |

## 🎨 カスタマイズ

### 色の変更
`style.css`の`:root`セクションで色を変更できます。

### カテゴリの追加
`questions.csv`のcategory列に新しいカテゴリ名を追加するだけ。
自動的にカテゴリ選択に反映されます。

## 📱 動作環境
- モダンブラウザ（Chrome, Safari, Firefox, Edge）
- スマートフォン、タブレット、PC対応

## 📄 ライセンス
個人学習用途で自由にご利用ください。

## 🤝 サポート
質問や改善要望がありましたら、GitHubのIssuesへどうぞ。
