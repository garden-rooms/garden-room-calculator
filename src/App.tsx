import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { GardenRoomConfigurator } from "./components/GardenRoomConfigurator";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#20232A] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Garden Room Configurator</h1>
        
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <GardenRoomConfigurator />
      </main>
      
      <Toaster />
    </div>
  );
}

