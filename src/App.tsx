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
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Authenticated>
          <GardenRoomConfigurator />
        </Authenticated>
        
        <Unauthenticated>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#20232A] mb-4">
                Configure Your Garden Room
              </h2>
              <p className="text-gray-600">
                Sign in to start configuring your bespoke garden room
              </p>
            </div>
            <SignInForm />
          </div>
        </Unauthenticated>
      </main>
      
      <Toaster />
    </div>
  );
}
