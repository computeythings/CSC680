import { useState } from "react";
import LotSelector from './ParkingLotSelector';
import { valetApi } from '@/services/ApiService';

interface Lot {
    id: number
    zip_code: string
    city: string
    state: string
    street: string 
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
    washed?: boolean,
    start?: string
}

export default function ValetCarwash() {
  const [selectedLot, setSelectedLot] = useState<number>(-1);
  const [valetLot, setValetLot] = useState<ValetInfo[]>([])
  
  const onLotSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedID = Number(e.target.value)
      setSelectedLot(selectedID)
      valetApi.getLot(selectedID).then(res => {
          if (res.statusCode == 200) {
              setValetLot(res.data.data)
          } else {
              alert("Could not load data")
          }
      })
  }

  const timestampToDate = (timestamp?: string): string => {
    if (!timestamp) { return "Unknown Entry Time" }
    const utc = timestamp.replace(" ", "T")
    const utcDate = new Date(utc + "Z")
    return utcDate.toLocaleString()
  }

  return (
        <div className="w-full content-center min-w-300">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
              <div className="flex flex-col w-full text-center">
                <h1 className="text-3xl font-bold my-4">CAR WASH SCHEDULE</h1>
                <LotSelector selectedLot={selectedLot} onLotSelect={onLotSelect}/>
                <div className={`m-4 ${valetLot.length > 0 ? '' : 'hidden'}`}>
                  <table className="w-full text-center">
                    <thead>
                      <tr>
                        <th>Spot</th>
                        <th>Customer</th>
                        <th>Check In</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valetLot
                      .filter(spot => spot.carwash)
                      .sort((a, b) => new Date(b.start!).getTime() - new Date(a.start!).getTime())
                      .map(spot => (
                      <tr key={spot.slot_id}>
                        <td>{`${spot.spot}`}</td>
                        <td>{`${spot.lastname}, ${spot.firstname}`}</td>
                        <td>{timestampToDate(spot.start)}</td>
                        <td>{`${spot.make} ${spot.model} - ${spot.licenseplate}`}</td>
                        <td className={`font-bold ${spot.washed ? "text-green-500" : "text-red-500"}`}>
                          {spot.washed ? "COMPLETE" : "INCOMPLETE"}
                        </td>
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
