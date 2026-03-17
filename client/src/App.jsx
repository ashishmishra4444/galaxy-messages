import { useState } from "react";
import Hero from "./components/Hero";
import MemoryModal from "./components/MemoryModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-stone-100">
      <Hero onOpenModal={() => setIsModalOpen(true)} />
      <MemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
