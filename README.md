# Gemini Tetris

React, TypeScript, Google Gemini APIを使用して構築された、クラシックなパズルゲーム「テトリス」のモダンなAI搭載リメイクです。

このプロジェクトは、レスポンシブなゲームプレイ、プロシージャル（自動生成）オーディオ、ハイスコアの保存機能に加え、生成AIとの深い統合によるダイナミックな背景生成機能を特徴としています。

## 特徴

*   **クラシックなゲームプレイ**: 7種1セットのランダム生成（7-bag）、壁蹴り、ソフトドロップ、ホールド機能など、本格的なテトリスのメカニクスを搭載しています。
*   **AIによる背景生成**: **Gemini 3.0 Pro Image Preview** を使用して、タイトル画面から直接1K、2K、4K解像度の美しいカスタム背景画像を生成できます。
*   **プロシージャルオーディオ**: Web Audio APIを使用したカスタム `AudioService` により、効果音 (SFX) とアンビエントなBGMをリアルタイムで合成生成します。外部オーディオファイルは一切使用していません。
*   **レスポンシブデザイン**: デスクトップ（キーボード操作）とモバイル（タッチ/ジェスチャー操作）の両方で快適にプレイ可能です。
*   **ハイスコア**: ブラウザのローカルストレージを使用して、あなたのベストスコアを記録・保存します。
*   **モダンUI**: Tailwind CSSを使用した、グラスモーフィズム（すりガラス風）を取り入れた美しいデザインとアニメーション。

## 使用技術

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Icons**: Lucide React
*   **Deployment**: Vercel Ready

## 始め方

1.  **リポジトリのクローン**:
    ```bash
    git clone https://github.com/your-username/gemini-tetris.git
    cd gemini-tetris
    ```

2.  **依存関係のインストール**:
    ```bash
    npm install
    ```

3.  **環境変数の設定**:
    プロジェクトルートに `.env` ファイルを作成し、Google Gemini API キーを設定してください。
    
    `.env` ファイルの内容:
    ```env
    VITE_API_KEY=your_google_genai_api_key
    ```
    ※ Vercel等のホスティングサービスにデプロイする場合は、環境変数設定画面で `VITE_API_KEY` を追加してください。

4.  **開発サーバーの起動**:
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:5173` を開いてください。

5.  **ビルド (本番用)**:
    ```bash
    npm run build
    ```
    `dist` フォルダに静的ファイルが生成されます。

## 操作方法

### デスクトップ (キーボード)

| アクション | キー |
| :--- | :--- |
| **左移動 / 右移動** | ← (左矢印) / → (右矢印) |
| **回転** | ↑ (上矢印) |
| **高速落下 (ソフトドロップ)** | ↓ (下矢印) |
| **ホールド (ブロック入替)** | Shift または C |
| **一時停止** | Esc |
| **音声ミュート** | (画面上のボタン) |

### モバイル (タッチジェスチャー)

| アクション | ジェスチャー |
| :--- | :--- |
| **左移動 / 右移動** | 指を左右にスライド |
| **回転** | 画面をタップ |
| **高速落下 (ソフトドロップ)** | 指を下にスライド |
| **ホールド (ブロック入替)** | 指を上にスワイプ |

## プロジェクト構造

*   **`src/App.tsx`**: メインアプリケーションコントローラー。レイアウト、グローバル状態（オーディオ、ゲーム開始など）、入力ルーティングを管理します。
*   **`src/hooks/useTetris.ts`**: コアゲームロジックエンジン。グリッド管理、ピースの移動、衝突判定、ゲームループを制御します。
*   **`src/services/geminiService.ts`**: Google Gemini API とのインターフェース。画像生成のためのプロンプト構築などを処理します。
*   **`src/services/audioService.ts`**: 生成的な音楽と合成効果音のための Web Audio API 実装です。
*   **`src/components/TitleScreen.tsx`**: エントリーポイントとなるUI。「AI Background Studio」を含み、カスタム壁紙の生成を行います。
*   **`src/components/Board.tsx`**: ゲームグリッドを描画し、ライン消去や落下のアニメーションを担当します。

## 使用しているAIモデル

*   **Gemini 2.5 Flash**: (オプション) カラーテーマの生成ロジックに使用 (`geminiService`内に実装)。
*   **Gemini 3.0 Pro Image Preview**: 高品質な背景画像の生成に使用 (`gemini-3-pro-image-preview`)。

## ライセンス

MIT
