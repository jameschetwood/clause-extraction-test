import { twMerge } from "tailwind-merge";

export default function Card({
  children,
  className,
  verticalScrollable,
}: {
  children: React.ReactNode;
  className?: string;
  verticalScrollable?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "card bg-base-100 shadow-xl p-4",
        verticalScrollable && "overflow-y-auto max-h-full",
        className
      )}
    >
      {children}
    </div>
  );
}
