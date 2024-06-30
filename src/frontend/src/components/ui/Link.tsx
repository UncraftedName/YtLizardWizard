/**
 * Customize some styling and change default behavior. Open link in new tab by default.
 */

type Props = React.ComponentPropsWithoutRef<"a">;
export default function Link({
  href,
  target,
  className,
  children,
  ...rest
}: Props) {
  return (
    <a
      className={className || "text-blue-400 underline"}
      href={href}
      target={target || "_blank"}
      {...rest}
    >
      {children}
    </a>
  );
}
