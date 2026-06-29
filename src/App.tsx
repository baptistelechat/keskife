import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Download, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthForm } from "./components/Auth/AuthForm";
import { useAuth } from "./hooks/useAuth";
import { Dashboard } from "./pages/Dashboard";
import { Stats } from "./pages/Stats";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
}

type Tab = "journal" | "stats";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("journal");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone] = useState(
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true,
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setInstallPrompt(null));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // ponytail: hadController capturé avant mount — évite un reload sur 1er install (GLRN-151)
    const hadController = !!navigator.serviceWorker.controller;
    const handler = () => {
      if (hadController) window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", handler);
    return () =>
      navigator.serviceWorker.removeEventListener("controllerchange", handler);
  }, []);

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
            {!isStandalone && installPrompt && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInstallPrompt(null);
                  installPrompt.prompt();
                }}
                aria-label="Installer l'application"
                className="gap-1.5 text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Download className="size-4" />
                Installer
              </Button>
            )}
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
