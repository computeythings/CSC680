import { parkingApi, valetApi } from '@/services/ApiService';
import { useState } from "react";
import LotSelector from './ParkingLotSelector';
import ValetSpot from './ValetSpot';
import ValetCard from './ValetCard';

interface Lot {
    id: number
    zip_code: string
    city: string
    state: string
    street: string 
}
interface Slot {
    slot_id: number
    level: number
    parked?: number
}
interface ValetInfo {
    spot: string,
    slot_id: number,
    slip_id?: number
    firstname?: string
    lastname?: string
    licenseplate?: string
    make?: string
    model?: string
    carwash?: boolean
    washed?: boolean
}

export default function ValetParking() {
    const [selectedLot, setSelectedLot] = useState<number>(-1);
    const [slots, setSlots] = useState<Slot[]>([])
    const [valetLot, setValetLot] = useState<ValetInfo[]>([])
    const [infoCard, setInfoCard] = useState<ValetInfo | null>(null)
    const [cardCoords, setCardCoords] = useState({top: 0, left: 0})

    const onLotSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedID = Number(e.target.value)
        setSelectedLot(selectedID)
        parkingApi.getLot(selectedID).then(res => {
            if (res.statusCode == 200) {
                setSlots(res.data.data)
            } else {
                alert("Could not load data")
            }
        })
        valetApi.getLot(selectedID).then(res => {
            if (res.statusCode == 200) {
                setValetLot(res.data.data)
            } else {
                alert("Could not load data")
            }
        })
    }

    const floors = (): Map<number,Slot[]> => {
        return slots.reduce<Map<number,Slot[]>>((i, slot) => {
            if (!i.get(slot.level)) {
                i.set(slot.level, [])
            }
            i.get(slot.level)!.push(slot)
            return i
        }, new Map<number,Slot[]>())
    }

    const handleCardOpen = (spot: any, coords: {top: number, left: number}) => {
        // Toggle info card on second click
        if (infoCard === spot) { return setInfoCard(null) }

        const cardWidth = spot.slip_id ? 300 : 120
        let xOffset = spot.slip_id ? -80 : -40
        let yOffset = 40
        if (coords.top + yOffset + 150 > window.innerHeight) {
            yOffset = -120;
        }
        if (coords.left + xOffset + cardWidth > window.innerWidth) {
            xOffset = -120;
        }
        setCardCoords({
            top: coords.top + yOffset + window.scrollY,
            left: coords.left + xOffset + window.scrollX
        })
        setInfoCard(spot)
    }

    const handleSpotUpdate = () => {
        parkingApi.getLot(selectedLot).then(res => {
            if (res.statusCode == 200) {
                setSlots(res.data.data)
            } else {
                alert("Could update server data")
            }
        })
        valetApi.getLot(selectedLot).then(res => {
            if (res.statusCode == 200) {
                setValetLot(res.data.data)
            } else {
                alert("Could not update server data")
            }
        })
    }

    const handleCardClose = () => {
        setInfoCard(null)
    }

  return (
      <div className="w-full content-center min-w-300" onClick={handleCardClose}>
          <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
            <div className="flex flex-col w-full text-center">
              <h1 className="text-3xl font-bold my-4">VALET</h1>
                <LotSelector selectedLot={selectedLot} onLotSelect={onLotSelect}/>
              <div className={`flex flex-col m-4 ${slots.length > 0 ? '' : 'hidden'}`}>
                <div className="font-bold text-xl">Available Spaces:</div>
                <div className="flex mx-auto divide-x">
                {[...floors().entries()].map(([floor, floorSlots]) => (
                <div key={floor} className="flex px-4">
                    <div className="font-bold">{`Floor ${floor}:`}</div>
                    <div className={`pl-2 ${floorSlots.some(item => item.parked === null) ? "": "text-red-500 font-bold"}`}>
                        {floorSlots.filter(item => item.parked === null).length}
                    </div>
                </div>
                ))}
                </div>
                <div className="mx-auto">
                    <div className="grid grid-cols-10">
                        {valetLot.map((slot, index) => (
                            <div key={slot.spot}>
                            <ValetSpot 
                                spot={slot} 
                                upperRow={Math.floor(index/10) % 2 === 1}
                                onClick={handleCardOpen}
                            />
                            {/* Every 10 rows but start after the first 10 */}
                            {(index+11) % 20 === 0 ? (
                            <div className="py-8 col-span-10"></div>
                            ) : null}
                            </div>
                        ))}
                    </div>
                </div>
              </div>
                {infoCard ? <div>
                    <ValetCard
                        top={cardCoords.top}
                        left={cardCoords.left}
                        info={infoCard}
                        onUpdate={handleSpotUpdate}
                        onClose={handleCardClose}
                    />
                </div> : null}
            </div>
          </div>
      </div>
  );
}
