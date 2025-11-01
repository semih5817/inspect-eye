import { Link, useLocation } from "react-router-dom";
import { Home, Image, FileCheck, FileText } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Accueil", icon: Home },
    { path: "/comparison", label: "Comparaison", icon: Image },
    { path: "/reports", label: "Rapports", icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-red-strong group-hover:scale-110 transition-transform">
                <span className="text-2xl font-display font-bold">S</span>
              </div>
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Spydercom
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    isActive(item.path)
                      ? "bg-primary text-white glow-red"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <select className="px-4 py-2 rounded-lg glass text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Agence Paris 15</option>
                <option>Agence Lyon</option>
                <option>Agence Marseille</option>
              </select>
              <div className="px-4 py-2 rounded-lg glass flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-sm font-semibold">JD</span>
                </div>
                <span className="text-sm font-medium">Jean Dupont</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
