/**
 * A small decoration for the empty space between the helix mark and the menu: a hairline that
 * fades out at both ends, with a flower and two pairs of leaves in the middle. It is mirrored left
 * to right so it always looks balanced, and it only borrows the colours of the mark.
 *
 * It is one drawing (line and sprig together) so the two can never drift apart, and the line sits
 * exactly on a pixel row so it stays crisp. On a phone it sits between the mark and the menu as a
 * short divider, nudged down a little so the space above and below it looks equal. When the gap
 * on a tablet gets too narrow it steps aside (see .header-ornament in globals.css) instead of
 * squeezing the menu. Purely decorative.
 */
export function HeaderOrnament() {
  // One side of the sprig, drawn around the middle of a 72 x 24 box: a longer leaf that points up
  // and out, and a smaller one that points down and out.
  const sprig = (
    <>
      <path d="M0 0Q7.5 -6.2 15 0Q7.5 6.2 0 0Z" transform="translate(45.8 12) rotate(-24)" fill="#8fae9a" />
      <path d="M0 0Q5.2 -4.6 10.4 0Q5.2 4.6 0 0Z" transform="translate(56.4 12) rotate(26)" fill="#abc4b5" />
    </>
  );

  return (
    <div aria-hidden="true" className="header-ornament -mb-1 mt-1 w-44 max-w-full md:m-0 md:w-auto md:min-w-0 md:max-w-[56rem] md:flex-1">
      <svg className="block h-[30px] w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="header-ornament-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c3d3c8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#c3d3c8" />
            <stop offset="1" stopColor="#c3d3c8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="15" width="100%" height="1" fill="url(#header-ornament-line)" />
        {/* a tiny nested drawing placed at the horizontal middle; everything inside is drawn around its origin */}
        <svg x="50%" y="0" width="1" height="30" overflow="visible">
          <g transform="translate(0 15.5) scale(1.25) translate(-36 -12)">
            {sprig}
            <g transform="matrix(-1 0 0 1 72 0)">{sprig}</g>
            <g fill="#efd0dd" stroke="#d9aabf" strokeWidth="0.8">
              <circle cx="36" cy="8.2" r="3.2" />
              <circle cx="39.61" cy="10.83" r="3.2" />
              <circle cx="38.23" cy="15.07" r="3.2" />
              <circle cx="33.77" cy="15.07" r="3.2" />
              <circle cx="32.39" cy="10.83" r="3.2" />
            </g>
            <circle cx="36" cy="12" r="2.1" fill="#96506f" />
          </g>
        </svg>
      </svg>
    </div>
  );
}
