import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { HeaderHUD } from './components/HUD/HeaderHUD';
import { CadastraMap } from './components/Map/CadastraMap';
import { ParcelInspectDrawer } from './components/Cards/ParcelInspectDrawer';
import { PackOpeningModal } from './components/Packs/PackOpeningModal';
import { MarketplaceModal } from './components/Market/MarketplaceModal';
import { InventoryModal } from './components/Inventory/InventoryModal';
import type { Parcel } from './types/cadastra';

export function App() {
  const {
    user,
    ownedParcels,
    allKnownParcels,
    selectedParcel,
    setSelectedParcelId,
    globalClaimedCounter,
    secondsToNextEnergy,
    openPack,
    recycleParcel,
    toggleSale,
    placeBid,
    buyParcelFromMarket,
    boosterPacks,
    maxInventoryParcels,
    maxEnergy,
  } = useGameStore();

  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);
  const [focusedBoosterParcel, setFocusedBoosterParcel] = useState<Parcel | null>(null);

  const handleLocateParcel = (parcel: Parcel) => {
    setFlyToCoords(parcel.center);
    setSelectedParcelId(parcel.h3Index);
  };

  const parcelList = Object.values(allKnownParcels);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07080d] flex flex-col">
      {/* Top Header Bar */}
      <HeaderHUD
        user={user}
        globalCounter={globalClaimedCounter}
        secondsToNextEnergy={secondsToNextEnergy}
        maxInventoryParcels={maxInventoryParcels}
        onOpenBoosters={() => {
          setSelectedParcelId(null);
          setIsPackModalOpen(true);
        }}
        onOpenMarket={() => setIsMarketModalOpen(true)}
        onOpenInventory={() => setIsInventoryModalOpen(true)}
      />

      {/* Main Interactive Cadastre Map */}
      <main className="w-full flex-1 pt-14 relative overflow-hidden">
        <CadastraMap
          parcels={parcelList}
          selectedParcel={selectedParcel}
          onSelectParcel={(p) => setSelectedParcelId(p ? p.h3Index : null)}
          targetFlyTo={flyToCoords}
          focusedParcel={focusedBoosterParcel || selectedParcel}
          rightPanelOpen={isPackModalOpen}
        />
      </main>

      {/* Parcel Inspector Drawer (hidden while booster panel is open) */}
      {!isPackModalOpen && (
        <ParcelInspectDrawer
          parcel={selectedParcel}
          onClose={() => setSelectedParcelId(null)}
          currentUserId={user.id}
          userCredits={user.credits}
          onBuyParcel={(hex) => {
            buyParcelFromMarket(hex);
            setSelectedParcelId(hex);
          }}
          onToggleSale={(hex) => toggleSale(hex)}
          onRecycleParcel={(hex) => recycleParcel(hex)}
        />
      )}

      {/* Booster Pack Opening Experience (Energy Only!) */}
      <PackOpeningModal
        isOpen={isPackModalOpen}
        onClose={() => {
          setIsPackModalOpen(false);
          setFocusedBoosterParcel(null);
        }}
        packs={boosterPacks}
        userEnergy={user.energy}
        maxEnergy={maxEnergy}
        inventoryCount={ownedParcels.length}
        maxInventorySlots={maxInventoryParcels}
        onOpenPack={(pack) => openPack(pack)}
        onLocateParcel={handleLocateParcel}
        onActiveParcelChange={setFocusedBoosterParcel}
      />

      {/* Secondary Marketplace & Auctions */}
      <MarketplaceModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
        parcels={parcelList}
        currentUserId={user.id}
        userCredits={user.credits}
        onBuyParcel={(hex) => {
          buyParcelFromMarket(hex);
          const p = allKnownParcels[hex];
          if (p) handleLocateParcel(p);
          setIsMarketModalOpen(false);
        }}
        onPlaceBid={(hex, amount) => {
          placeBid(hex, amount);
        }}
        onLocateParcel={(p) => {
          handleLocateParcel(p);
          setIsMarketModalOpen(false);
        }}
      />

      {/* Player Inventory & Bank Recycling */}
      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        ownedParcels={ownedParcels}
        maxInventorySlots={maxInventoryParcels}
        onToggleSale={toggleSale}
        onRecycleParcel={(hex) => recycleParcel(hex)}
        onLocateParcel={(p) => {
          handleLocateParcel(p);
          setIsInventoryModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
