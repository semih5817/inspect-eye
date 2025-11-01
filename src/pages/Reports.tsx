import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConformityGauge from "@/components/ConformityGauge";
import { Download, Mail, Link2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const { currentBien } = useApp();
  const [email, setEmail] = useState("");
  const [includeHighRes, setIncludeHighRes] = useState(true);
  const [includeHeatmaps, setIncludeHeatmaps] = useState(false);
  const [hideCompliant, setHideCompliant] = useState(false);

  const handleDownloadPDF = () => {
    toast.loading("Génération du rapport PDF...", { id: "pdf-gen" });
    setTimeout(() => {
      toast.success("Rapport généré avec succès !", { id: "pdf-gen" });
    }, 2000);
  };

  const handleSendEmail = () => {
    if (!email) {
      toast.error("Veuillez saisir une adresse email");
      return;
    }
    toast.loading("Envoi en cours...", { id: "email-send" });
    setTimeout(() => {
      toast.success(`Rapport envoyé à ${email}`, { id: "email-send" });
    }, 1500);
  };

  const handleGenerateLink = () => {
    toast.success("Lien de partage copié dans le presse-papier !");
  };

  if (!currentBien) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">
          Sélectionnez un bien pour générer un rapport.
        </p>
      </div>
    );
  }

  const classifiedPairs = currentBien.pairs.filter((p) => p.status);
  const compliantCount = classifiedPairs.filter((p) => p.status === "compliant").length;
  const toVerifyCount = classifiedPairs.filter((p) => p.status === "to_verify").length;
  const nonCompliantCount = classifiedPairs.filter((p) => p.status === "non_compliant").length;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-display font-bold mb-8">Générateur de rapport</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Preview - 60% */}
        <div className="lg:col-span-3 glass p-8 rounded-lg border border-white/10 space-y-8">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center glow-red-strong mb-4">
                  <span className="text-3xl font-display font-bold">S</span>
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  Rapport d'État des Lieux
                </h2>
                <p className="text-sm text-muted-foreground">
                  Généré le {new Date().toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex justify-center">
                <ConformityGauge score={currentBien.conformityScore} size={120} />
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-3">Informations du bien</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Adresse :</span>
                <p className="font-medium">{currentBien.address}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date d'entrée :</span>
                <p className="font-medium">
                  {new Date(currentBien.entryDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Date de sortie :</span>
                <p className="font-medium">
                  {new Date(currentBien.exitDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Score global :</span>
                <p className="font-medium">{currentBien.conformityScore}/100</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-3">Résumé</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="glass p-4 rounded-lg text-center">
                <p className="text-2xl font-display font-bold text-success">{compliantCount}</p>
                <p className="text-xs text-muted-foreground">Conformes</p>
              </div>
              <div className="glass p-4 rounded-lg text-center">
                <p className="text-2xl font-display font-bold text-warning">{toVerifyCount}</p>
                <p className="text-xs text-muted-foreground">À vérifier</p>
              </div>
              <div className="glass p-4 rounded-lg text-center">
                <p className="text-2xl font-display font-bold text-destructive">{nonCompliantCount}</p>
                <p className="text-xs text-muted-foreground">Non conformes</p>
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Détail par pièce</h3>
            {classifiedPairs
              .filter((pair) => !hideCompliant || pair.status !== "compliant")
              .map((pair) => (
                <div key={pair.id} className="glass p-4 rounded-lg border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="flex gap-2">
                      <img
                        src={pair.entryPhoto}
                        alt="Entrée"
                        className="w-24 h-20 object-cover rounded"
                      />
                      <img
                        src={pair.exitPhoto}
                        alt="Sortie"
                        className="w-24 h-20 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{pair.room}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            pair.status === "compliant"
                              ? "bg-success/10 text-success"
                              : pair.status === "to_verify"
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {pair.status === "compliant"
                            ? "✅ Conforme"
                            : pair.status === "to_verify"
                            ? "⚠️ À vérifier"
                            : "❌ Non conforme"}
                        </span>
                      </div>
                      {pair.issues.length > 0 && (
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {pair.issues.map((issue) => (
                            <li key={issue.id}>• {issue.description}</li>
                          ))}
                        </ul>
                      )}
                      {pair.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Note : {pair.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-6 text-center text-sm text-muted-foreground">
            <p>Rapport généré automatiquement par Spydercom</p>
            <p>© 2024 Spydercom - Tous droits réservés</p>
          </div>
        </div>

        {/* Options - 40% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parameters */}
          <div className="glass p-6 rounded-lg border border-white/10 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Paramètres du rapport</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHighRes}
                onChange={(e) => setIncludeHighRes(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-secondary"
              />
              <span className="text-sm">Inclure photos haute résolution</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHeatmaps}
                onChange={(e) => setIncludeHeatmaps(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-secondary"
              />
              <span className="text-sm">Inclure heatmaps</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hideCompliant}
                onChange={(e) => setHideCompliant(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-secondary"
              />
              <span className="text-sm">Masquer pièces conformes</span>
            </label>

            <div className="pt-2">
              <label className="text-sm text-muted-foreground mb-2 block">
                Email destinataire
              </label>
              <Input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="glass p-6 rounded-lg border border-white/10 space-y-3">
            <h3 className="font-semibold text-lg mb-4">Actions</h3>
            
            <Button
              onClick={handleDownloadPDF}
              className="w-full justify-start gap-2 glow-red"
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </Button>

            <Button
              onClick={handleSendEmail}
              variant="secondary"
              className="w-full justify-start gap-2"
            >
              <Mail className="w-4 h-4" />
              Envoyer par email
            </Button>

            <Button
              onClick={handleGenerateLink}
              variant="secondary"
              className="w-full justify-start gap-2"
            >
              <Link2 className="w-4 h-4" />
              Générer lien de partage
            </Button>
          </div>

          {/* History */}
          <div className="glass p-6 rounded-lg border border-white/10">
            <h3 className="font-semibold text-lg mb-4">Historique</h3>
            <div className="space-y-2">
              {[
                { name: "Rapport_12_rue_paix_15nov.pdf", date: "15/11/2024 14:32" },
                { name: "Rapport_10_rue_rivoli_08nov.pdf", date: "08/11/2024 09:15" },
                { name: "Rapport_8_rue_vaugirard_01nov.pdf", date: "01/11/2024 16:45" },
              ].map((report, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 glass rounded-lg text-sm hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
