import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Home, CheckCircle, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { biens } = useApp();

  const stats = [
    { icon: Home, label: "Biens actifs", value: "47", color: "text-accent" },
    { icon: CheckCircle, label: "Comparaisons ce mois", value: "234", color: "text-success" },
    { icon: Clock, label: "Temps moyen", value: "3.2 min", color: "text-primary" },
    { icon: TrendingUp, label: "Litiges évités", value: "15", color: "text-warning" },
  ];

  const statusConfig = {
    completed: { label: "Terminé", bg: "bg-success/10", text: "text-success" },
    in_progress: { label: "En cours", bg: "bg-warning/10", text: "text-warning" },
    to_verify: { label: "À vérifier", bg: "bg-primary/10", text: "text-primary" },
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          Comparaison d'états des lieux automatisée
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          IA + Vision par ordinateur pour détecter les anomalies
        </p>
        <Link to="/comparison">
          <Button className="px-8 py-6 text-lg glow-red-strong hover:scale-105 transition-transform">
            🚀 Comparer un état des lieux
          </Button>
        </Link>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="glass p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Biens List */}
      <section>
        <h2 className="text-3xl font-display font-bold mb-6">Vos biens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biens.map((bien) => {
            const config = statusConfig[bien.status];
            return (
              <div
                key={bien.id}
                className="glass rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={bien.photo}
                    alt={bien.address}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} backdrop-blur-sm`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-2">{bien.address}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    État de sortie le {new Date(bien.exitDate).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        bien.conformityScore >= 80 ? "bg-success" :
                        bien.conformityScore >= 50 ? "bg-warning" : "bg-destructive"
                      }`} />
                      <span className="text-sm font-medium">{bien.conformityScore}% conforme</span>
                    </div>
                    <Link to={`/comparison?bien=${bien.id}`}>
                      <Button variant="ghost" size="sm" className="group/btn">
                        Voir
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
