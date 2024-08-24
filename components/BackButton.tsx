// components/BackButton.tsx
'use client';

export default function BackButton() {
  return (
    <button onClick={() => window.history.back()} className="your-button-class">
      Back
    </button>
  );
}
