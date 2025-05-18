import { useAuth } from '@/contexts/auth';
import { parkingApi } from '@/services/ApiService';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

interface props {
    selectedLot: number
    onLotSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
interface Lot {
  id: number
  zip_code: string
  city: string
  state: string
  street: string 
}

export default function ParkingLotSelector({ selectedLot, onLotSelect }: props) {
  const [lots, setLots] = useState<Lot[]>([])

  useEffect(() => {
      parkingApi.getLots().then(res => {
        if (res.statusCode == 200) {
          setLots(res.data.data)
        } else {
          alert("Unable to connect to server.")
        }
      })
  }, [])

  return (
    <div className="flex items-center justify-center relative p-4">
    <span className="float-right">Parking Lot:</span>
    <select value={selectedLot} onChange={onLotSelect} className="p-1 border min-w-80">
        <option value={-1} disabled hidden>
        -- Select a Lot --
        </option>
        {lots.map(lot => (
        <option key={lot.id} value={lot.id}>
            {`${lot.street} ${lot.city}, ${lot.state} ${lot.zip_code}`}
        </option>
        ))}
    </select>
    </div>
  );
}
