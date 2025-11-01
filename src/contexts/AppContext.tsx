import { createContext, useContext, useState, ReactNode } from "react";

interface Issue {
  id: number;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  location: { x: number; y: number };
  contourPoints?: string;
  thumbnail?: string;
}

interface QualityBadges {
  sharpness: number;
  lighting: number;
  angle: number;
}

interface PhotoPair {
  id: number;
  room: string;
  entryPhoto: string;
  exitPhoto: string;
  score: number;
  status: "compliant" | "to_verify" | "non_compliant" | null;
  issues: Issue[];
  qualityBadges: QualityBadges;
  notes?: string;
}

interface Bien {
  id: number;
  address: string;
  photo: string;
  status: "completed" | "in_progress" | "to_verify";
  entryDate: string;
  exitDate: string;
  conformityScore: number;
  pairs: PhotoPair[];
}

interface AppContextType {
  biens: Bien[];
  currentBien: Bien | null;
  setCurrentBien: (bien: Bien | null) => void;
  updatePairStatus: (pairId: number, status: PhotoPair["status"], notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

import tacheMurImg from "@/assets/tache-mur.png";
import rayureParquetImg from "@/assets/rayure-parquet.png";

function generateMockIssues(count: number): Issue[] {
  const types = [
    { type: "scratch", description: "Rayure sur parquet", severity: "medium" as const, thumbnail: rayureParquetImg },
    { type: "stain", description: "Tache au mur", severity: "low" as const, thumbnail: tacheMurImg },
    { type: "broken", description: "Poignée cassée", severity: "high" as const, thumbnail: undefined },
    { type: "dirt", description: "Traces de saleté", severity: "low" as const, thumbnail: undefined },
  ];
  return types.slice(0, count).map((t, i) => ({
    id: i + 1,
    ...t,
    location: { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 },
    contourPoints: `${Math.random() * 600 + 100},${Math.random() * 400 + 100} ${Math.random() * 600 + 120},${Math.random() * 400 + 120} ${Math.random() * 600 + 110},${Math.random() * 400 + 140}`,
  }));
}

function generateMockPairs(count: number): PhotoPair[] {
  const rooms = ["Salon", "Cuisine", "Chambre 1", "Chambre 2", "Salle de bain", "WC", "Entrée", "Couloir"];
  return Array.from({ length: Math.min(count, rooms.length) }, (_, i) => ({
    id: i + 1,
    room: rooms[i],
    entryPhoto: `https://images.unsplash.com/photo-${1522708323000000 + i * 1000000}?w=800&q=80`,
    exitPhoto: `https://images.unsplash.com/photo-${1600210492000000 + i * 1000000}?w=800&q=80`,
    score: Math.floor(Math.random() * 40) + 60,
    status: i < 3 ? (["compliant", "to_verify", "non_compliant"][i] as PhotoPair["status"]) : null,
    issues: generateMockIssues(Math.floor(Math.random() * 4)),
    qualityBadges: {
      sharpness: Math.floor(Math.random() * 2) + 3,
      lighting: Math.floor(Math.random() * 3) + 2,
      angle: Math.floor(Math.random() * 2) + 4,
    },
  }));
}

function generateMockBiens(count: number = 6): Bien[] {
  const streets = ["Rivoli", "la Paix", "Vaugirard", "Montmartre", "Saint-Germain", "Raspail"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    address: `${10 + i} rue de ${streets[i % streets.length]}, 750${(i % 9) + 1}${i % 2} Paris`,
    photo: `https://images.unsplash.com/photo-${1560184897000000 + i * 10000000}?w=400&q=80`,
    status: (["completed", "in_progress", "to_verify"][i % 3] as Bien["status"]),
    entryDate: new Date(2024, i % 12, 1).toISOString(),
    exitDate: new Date(2024, (i + 6) % 12, 15).toISOString(),
    conformityScore: Math.floor(Math.random() * 40) + 60,
    pairs: generateMockPairs(8 + Math.floor(Math.random() * 4)),
  }));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [biens, setBiens] = useState<Bien[]>(generateMockBiens());
  const [currentBien, setCurrentBien] = useState<Bien | null>(null);

  const updatePairStatus = (pairId: number, status: PhotoPair["status"], notes?: string) => {
    if (!currentBien) return;

    const updatedBien = {
      ...currentBien,
      pairs: currentBien.pairs.map((pair) =>
        pair.id === pairId ? { ...pair, status, notes } : pair
      ),
    };

    setCurrentBien(updatedBien);
    setBiens(biens.map((b) => (b.id === currentBien.id ? updatedBien : b)));
  };

  return (
    <AppContext.Provider value={{ biens, currentBien, setCurrentBien, updatePairStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
