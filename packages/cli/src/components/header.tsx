// This file renders the big "KODER" title you see at the top of the terminal
// It uses an ASCII art font so it looks cool and retro — purely cosmetic, no logic here

// Draws the KODER logo in a centered box using the "grid" ASCII font style
// The purple color (#A78BFA) matches the app's accent theme
export function Header() {
  return (
    <box justifyContent="center" alignItems="center">
      <ascii-font
        font="grid"
        text="KODER"
        color="#A78BFA"
      />
    </box>
  );
}