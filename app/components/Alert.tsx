import { TriangleAlert } from "lucide-react";

export default function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="alert alert-error">
      <TriangleAlert />
      <span>{children}</span>
    </div>
  );
}
