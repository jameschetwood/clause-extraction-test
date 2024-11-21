import { TriangleAlert } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function Alert({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge("alert alert-error", className)}>
      <TriangleAlert />
      <span>{children}</span>
    </div>
  );
}
