import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { AuthForm } from "./components/Auth/AuthForm";
import { Dashboard } from "./pages/Dashboard";
import { Stats } from "./pages/Stats";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Tab = "journal" | "stats";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("journal");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="graph-bg flex min-h-screen items-center justify-center bg-background p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="graph-bg min-h-screen bg-background">
      <header className="bg-primary border-b border-primary-foreground/10 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight text-primary-foreground">
            Keskife
          </h1>
          <div className="flex items-center gap-4">
            <ToggleGroup
              type="single"
              value={tab}
              onValueChange={(v) => {
                if (v) setTab(v as Tab);
              }}
              className="rounded-md bg-white/[0.07] p-[3px]"
            >
              <ToggleGroupItem
                value="journal"
                className="text-white/50 hover:bg-white/10 hover:text-white data-[state=on]:bg-[rgba(61,106,204,0.4)] data-[state=on]:text-white"
              >
                Journal
              </ToggleGroupItem>
              <ToggleGroupItem
                value="stats"
                className="text-white/50 hover:bg-white/10 hover:text-white data-[state=on]:bg-[rgba(61,106,204,0.4)] data-[state=on]:text-white"
              >
                Stats
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              aria-label="Se déconnecter"
              className="size-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {tab === "journal" ? <Dashboard /> : <Stats />}
      </main>
    </div>
  );
}
