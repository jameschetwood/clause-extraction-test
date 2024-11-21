import { twMerge } from "tailwind-merge";

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge("card bg-base-100 shadow-xl p-4", className)}>
      {children}
    </div>
  );
}
