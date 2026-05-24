/**
 * Header Widget 🎨
 * This simple layout component renders a centered ASCII title banner ("KODER")
 * in the terminal at startup using OpenTUI's built-in block character fonts.
 */

/**
 * Header renders a stylized ASCII art block text header.
 * 
 * @returns {JSX.Element} The centered ascii-font layout box.
 */
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