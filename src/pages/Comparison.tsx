import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ConformityGauge from "@/components/ConformityGauge";
import IssueCard from "@/components/IssueCard";
import QualityBadge from "@/components/QualityBadge";
import HeatmapOverlay from "@/components/HeatmapOverlay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Maximize2, X, Check, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Comparison() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { biens, currentBien, setCurrentBien, updatePairStatus } = useApp();
  
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const bienId = searchParams.get("bien");
    if (bienId) {
      const bien = biens.find((b) => b.id === parseInt(bienId));
      if (bien) setCurrentBien(bien);
    } else if (!currentBien && biens.length > 0) {
      setCurrentBien(biens[0]);
    }
  }, [searchParams, biens]);

  if (!currentBien || currentBien.pairs.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">Aucune paire de photos à comparer pour le moment.</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  const currentPair = currentBien.pairs[currentPairIndex];

  const handlePrevious = () => {
    if (currentPairIndex > 0) {
      setCurrentPairIndex(currentPairIndex - 1);
      setNotes("");
    }
  };

  const handleNext = () => {
    if (currentPairIndex < currentBien.pairs.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
      setNotes("");
    }
  };

  const handleClassify = (status: "compliant" | "to_verify" | "non_compliant") => {
    updatePairStatus(currentPair.id, status, notes);
    toast.success(`${currentPair.room} marqué comme ${
      status === "compliant" ? "conforme" :
      status === "to_verify" ? "à vérifier" : "non conforme"
    }`);
    if (currentPairIndex < currentBien.pairs.length - 1) {
      setTimeout(() => handleNext(), 500);
    }
  };

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentPairIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="glass px-4 py-2 rounded-lg">
              <span className="font-display font-semibold">
                {currentPair.room} ({currentPairIndex + 1}/{currentBien.pairs.length})
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentPairIndex === currentBien.pairs.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
            {isFullscreen && (
              <Button variant="ghost" onClick={() => setIsFullscreen(false)}>
                Fermer
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Viewer - 70% */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <BeforeAfterSlider
                beforeImage={currentPair.entryPhoto}
                afterImage={currentPair.exitPhoto}
                height={isFullscreen ? "calc(100vh - 200px)" : "600px"}
              />
              {showHeatmap && (
                <HeatmapOverlay
                  anomalies={currentPair.issues}
                  width={800}
                  height={600}
                />
              )}
            </div>

            {/* Controls */}
            <div className="glass p-4 rounded-lg flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                {currentPair.qualityBadges && (
                  <>
                    <QualityBadge label="Netteté" score={currentPair.qualityBadges.sharpness} />
                    <QualityBadge label="Éclairage" score={currentPair.qualityBadges.lighting} />
                    <QualityBadge label="Angle" score={currentPair.qualityBadges.angle} />
                  </>
                )}
              </div>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant={showHeatmap ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  Heatmap
                </Button>
                <Button
                  variant={showContours ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setShowContours(!showContours)}
                >
                  Contours
                </Button>
              </div>
            </div>
          </div>

          {/* Analysis Panel - 30% */}
          <div className="space-y-6">
            {/* Score */}
            <div className="glass p-6 rounded-lg text-center">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                Score de conformité
              </h3>
              <div className="flex justify-center mb-4">
                <ConformityGauge score={currentPair.score} />
              </div>
              <p className="text-sm">
                Conforme à <span className="font-bold text-lg">{currentPair.score}%</span>
              </p>
            </div>

            {/* Issues */}
            <div className="glass p-6 rounded-lg">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                Anomalies détectées ({currentPair.issues.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentPair.issues.length > 0 ? (
                  currentPair.issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} thumbnail={issue.thumbnail || currentPair.exitPhoto} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    ✅ Aucune anomalie détectée
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="glass p-6 rounded-lg space-y-4">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Classification</h3>
              
              <div className="space-y-2">
                <Button
                  className="w-full justify-start gap-2 bg-success/10 hover:bg-success/20 text-success border-success/30"
                  onClick={() => handleClassify("compliant")}
                >
                  <Check className="w-4 h-4" />
                  Conforme
                </Button>
                <Button
                  className="w-full justify-start gap-2 bg-warning/10 hover:bg-warning/20 text-warning border-warning/30"
                  onClick={() => handleClassify("to_verify")}
                >
                  <AlertTriangle className="w-4 h-4" />
                  À vérifier
                </Button>
                <Button
                  className="w-full justify-start gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30"
                  onClick={() => handleClassify("non_compliant")}
                >
                  <XCircle className="w-4 h-4" />
                  Non conforme
                </Button>
              </div>

              <Textarea
                placeholder="+ Ajouter une note (optionnel)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="glass"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
