import Image from "next/image";
import { cx } from "@/utils/cx";

/** BoardUI mark. Renders the brand icon at a fixed pixel size (24 / 32 / 40).
 *  (A `mono` black-and-white variant used to live here, but it pointed at
 *  two asset files that were never shipped, and nothing calls it.) */
export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/boardui_logo.png"
      alt="BoardUI"
      width={size}
      height={size}
      className={cx("shrink-0", className)}
      priority
    />
  );
}

/** Theme-aware metallic BoardUI Pro mark. */
export function ProLogo({
  size = 36,
  className,
  decorative = false,
  priority = false,
}: {
  size?: number;
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  const alt = decorative ? "" : "BoardUI Pro";

  return (
    <>
      <Image
        src="/brand/boardui_pro.png"
        alt={alt}
        width={size}
        height={size}
        className={cx("theme-logo-light shrink-0 object-contain", className)}
        priority={priority}
      />
      <Image
        src="/brand/boardui_pro_dark.png"
        alt={alt}
        width={size}
        height={size}
        className={cx("theme-logo-dark shrink-0 object-contain", className)}
        priority={priority}
      />
    </>
  );
}
