export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="card bg-base-100 shadow-xl p-4">{children}</div>;
}
