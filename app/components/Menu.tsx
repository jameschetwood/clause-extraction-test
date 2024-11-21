import Link from "next/link";

export default function Menu() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Saved", href: "/saved" },
  ];
  return (
    <nav className="menu menu-horizontal bg-base-200 rounded-box gap-4">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="menu-item">
            {item.label}
          </Link>
        </li>
      ))}
    </nav>
  );
}
