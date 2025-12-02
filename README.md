# Gemini Tetris

A modern, AI-powered reimplementation of the classic puzzle game Tetris, built with React, TypeScript, and the Google Gemini API.

This project features responsive gameplay, procedural audio, high score persistence, and deep integration with Generative AI for dynamic theming and background generation.

## Features

*   **Classic Gameplay**: Authentic Tetris mechanics including 7-bag randomization, wall kicks, soft drops, and hold functionality.
*   **AI-Powered Backgrounds**: Use **Gemini 3.0 Pro Image Preview** to generate stunning custom background images at 1K, 2K, or 4K resolution directly from the title screen.
*   **Procedural Audio**: A custom `AudioService` using the Web Audio API to generate synthetic sound effects (SFX) and ambient generative background music (BGM) in real-time. No external audio files required.
*   **Responsive Design**: Fully playable on Desktop (Keyboard) and Mobile (Touch/Gestures).
*   **High Scores**: Local storage persistence for tracking your best performance.
*   **Modern UI**: Glassmorphism-inspired design with animations using Tailwind CSS.

## Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Icons**: Lucide React
*   **Build Tooling**: (Assumed Vite or similar in a standard environment)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/gemini-tetris.git
    cd gemini-tetris
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up API Key**:
    Ensure you have a valid Google Gemini API key exported in your environment as `API_KEY` or configured in your build process.

4.  **Run the application**:
    ```bash
    npm start
    ```

## Controls

### Desktop (Keyboard)

| Action | Key |
| :--- | :--- |
| **Move Left/Right** | Arrow Left / Arrow Right |
| **Rotate** | Arrow Up |
| **Soft Drop** | Arrow Down |
| **Hold Piece** | Shift or C |
| **Pause** | Esc |
| **Mute Audio** | (UI Button) |

### Mobile (Touch Gestures)

| Action | Gesture |
| :--- | :--- |
| **Move Left/Right** | Slide Finger Horizontally |
| **Rotate** | Tap Screen |
| **Soft Drop** | Slide Finger Down |
| **Hold Piece** | Swipe Up |

## Project Structure

*   **`App.tsx`**: Main application controller. Handles layout, global state (audio, game start), and input routing.
*   **`hooks/useTetris.ts`**: Core game logic engine. Manages the grid, piece movement, collision detection, and game loop.
*   **`services/geminiService.ts`**: Interface for Google Gemini API. Handles prompt construction for image generation.
*   **`services/audioService.ts`**: Web Audio API implementation for generative music and synthesized sound effects.
*   **`components/TitleScreen.tsx`**: The entry point UI. Contains the "AI Background Studio" for generating custom wallpapers.
*   **`components/Board.tsx`**: Renders the game grid with animations for line clears and drops.

## AI Models Used

*   **Gemini 2.5 Flash**: (Optional) For generating color themes (logic present in `geminiService`).
*   **Gemini 3.0 Pro Image Preview**: Used for generating high-quality background images.

## License

MIT
