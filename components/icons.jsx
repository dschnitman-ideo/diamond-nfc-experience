/* Inline SVG icon set — single stroke-based line icons, currentColor. */

const ICONS = {
  chevronLeft: (
    <path d="M15 5L8 12L15 19" />
  ),
  chevronRight: (
    <path d="M9 5L16 12L9 19" />
  ),
  chevronDown: (
    <path d="M5 9L12 16L19 9" />
  ),
  close: (
    <path d="M6 6L18 18M18 6L6 18" />
  ),
  share: (
    <path d="M12 16V4M12 4L8 8M12 4L16 8M6 12V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V12" />
  ),
  sparkle: (
    <path d="M12 3L13.6 9.4L20 11L13.6 12.6L12 19L10.4 12.6L4 11L10.4 9.4L12 3Z" />
  ),
  gia: (
    <path d="M9 12L11 14L15 10M12 3L4 6.5V11.5C4 16 7.5 19.8 12 21C16.5 19.8 20 16 20 11.5V6.5L12 3Z" />
  ),
  tracr: (
    <path d="M12 2V6M12 18V22M4.9 4.9L7.8 7.8M16.2 16.2L19.1 19.1M2 12H6M18 12H22M4.9 19.1L7.8 16.2M16.2 7.8L19.1 4.9M12 8A4 4 0 1 0 12 16A4 4 0 1 0 12 8Z" />
  ),
  gem: (
    <path d="M3 9L7 3H17L21 9L12 21L3 9Z" />
  ),
  download: (
    <path d="M12 4V15M12 15L8 11M12 15L16 11M5 19H19" />
  ),
  arrowUpRight: (
    <path d="M7 17L17 7M17 7H9M17 7V15" />
  ),
  settings: (
    <path d="M12 15A3 3 0 1 0 12 9A3 3 0 1 0 12 15Z M19.4 13.5C19.5 13 19.5 12.5 19.5 12C19.5 11.5 19.5 11 19.4 10.5L21.4 9C21.6 8.8 21.6 8.5 21.5 8.3L19.7 5.2C19.6 5 19.3 4.9 19.1 5L16.8 5.9C16 5.3 15.2 4.8 14.2 4.5L13.8 2C13.8 1.8 13.6 1.6 13.4 1.6H10.6C10.4 1.6 10.2 1.8 10.2 2L9.8 4.5C8.8 4.8 8 5.3 7.2 5.9L4.9 5C4.7 4.9 4.4 5 4.3 5.2L2.5 8.3C2.4 8.5 2.4 8.8 2.6 9L4.6 10.5C4.5 11 4.5 11.5 4.5 12C4.5 12.5 4.5 13 4.6 13.5L2.6 15C2.4 15.2 2.4 15.5 2.5 15.7L4.3 18.8C4.4 19 4.7 19.1 4.9 19L7.2 18.1C8 18.7 8.8 19.2 9.8 19.5L10.2 22C10.2 22.2 10.4 22.4 10.6 22.4H13.4C13.6 22.4 13.8 22.2 13.8 22L14.2 19.5C15.2 19.2 16 18.7 16.8 18.1L19.1 19C19.3 19.1 19.6 19 19.7 18.8L21.5 15.7C21.6 15.5 21.6 15.2 21.4 15L19.4 13.5Z" />
  ),
  check: (
    <path d="M5 12.5L9.5 17L19 7" />
  ),
  refresh: (
    <path d="M4 4V9H9M20 20V15H15M5.5 9C6.5 6 9.1 4 12 4C15.3 4 18.1 6.4 18.8 9.6M18.5 15C17.5 18 14.9 20 12 20C8.7 20 5.9 17.6 5.2 14.4" />
  ),
  trustMark: (
    <path d="M12 2L14.4 6.6L19.5 7.2L15.8 10.9L16.8 16L12 13.5L7.2 16L8.2 10.9L4.5 7.2L9.6 6.6L12 2Z M9.4 12.3L11.2 14.1L14.9 10" />
  ),
};

export function Icon({ name, className = "", strokeWidth = 1.7 }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
