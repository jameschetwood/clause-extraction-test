"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();
  const items = [
    { label: "Home", href: "/" },
    { label: "Saved", href: "/saved" },
  ];
  return (
    <nav className="menu menu-horizontal bg-base-200 rounded-box gap-4">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`menu-item ${pathname === item.href ? "active" : ""}`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </nav>
  );
}
