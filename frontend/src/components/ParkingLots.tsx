import { useAuth } from '@/contexts/auth';
import { parkingApi } from '@/services/ApiService';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import LotSelector from './ParkingLotSelector';

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
  parked: string | null
}

export default function ParkingLots() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLot, setSelectedLot] = useState<number>(-1);
  const [lots, setLots] = useState<Lot[]>([])
  const [slots, setSlots] = useState<Slot[]>([])

  useEffect(() => {
      parkingApi.getLots().then(res => {
        if (res.statusCode == 200) {
          setLots(res.data.data)
        } else {
          alert("Unable to connect to server.")
        }
      }).finally(() => {
        setIsLoading(false)
      })
  }, [user, router])

  if (isLoading) {
    return null
  }
  if (!user) {
    localStorage.setItem("redirect", "/parking/lots/")
    router.push('/login/')
    return null
  }
  localStorage.removeItem("redirect")

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
  }

  const floors = () => {
    return slots.reduce<Map<number,Slot[]>>((i, slot) => {
      if (!i.get(slot.level)) {
        i.set(slot.level, [])
      }
      i.get(slot.level)!.push(slot)
      return i
    }, new Map<number,Slot[]>())
  }

  return (
      <div className="w-full content-center">
          <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
            <div className="flex flex-col w-full text-center">
              <h1 className="text-3xl font-bold my-4">PARKING LOTS</h1>
                <LotSelector selectedLot={selectedLot} onLotSelect={onLotSelect}/>
              <div className={`m-4 ${slots.length > 0 ? '' : 'hidden'}`}>
                <table className="w-full text-center">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Total Slots</th>
                      <th>Free Slots</th>
                      <th>Occupied Slots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Overall View */}
                    <tr>
                      <td></td>
                      <td>{slots.length}</td>
                      <td>{slots.filter(item => item.parked === null).length}</td>
                      <td>{slots.filter(item => item.parked !== null).length}</td>
                    </tr>
                    {/* Spacer */}
                    <tr>
                      <td colSpan={4} className="h-5 !border-none p-0 bg-transparent"></td>
                    </tr>
                    {/* Detailed Floor View */}
                    {[...floors().entries()].map(([floor, floorSlots]) => (
                    <tr key={floor}>
                      <td>{`Floor ${floor}`}</td>
                      <td>{floorSlots.length}</td>
                      <td>{floorSlots.filter(item => item.parked === null).length}</td>
                      <td>{floorSlots.filter(item => item.parked !== null).length}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
  );
}
