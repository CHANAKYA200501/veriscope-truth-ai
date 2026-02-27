import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Activity } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-4 sticky top-0 z-50">
            <SidebarTrigger className="text-muted-foreground hover:text-primary" />
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Activity className="w-3.5 h-3.5 text-success animate-pulse" />
              <span className="hidden sm:inline">SYSTEM ONLINE</span>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border">
            <div className="px-6 py-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>© 2026 VERISCOPE AI</span>
              <span>HACKATHON EDITION v2.0</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
