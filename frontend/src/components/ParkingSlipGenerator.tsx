import { useRef, useState } from "react";
import ScreenFlash from "./ScreenFlash";
import { parkingApi } from "@/services/ApiService";
import ParkingLotSelector from "./ParkingLotSelector";
import ParkingSlip from "./ParkingSlip";

interface ParkingSlip {
  slip_id: number
  firstname: string
  lastname: string
  licenseplate: string
  make: string
  model: string
  start: number
  spot: string
}

enum LotStatus {
  LOT_FULL = "FULL",
  SERVER_ERROR = "ERROR",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS"
}

export default function ParkingSlipGenerator() {
  const [currentLot, setCurrentLot] = useState(-1)
  const [loadingParkingSlip, setLoadingParkingSlip] = useState(true)
  const [currentParkingSlip, setCurrentParkingSlip] = useState<ParkingSlip|null>(null)
  const [state, setState] = useState(LotStatus.SUCCESS)
  const flash = useRef<{flash: () => void}>(null);

  const onLotSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedID = Number(e.target.value)
    setCurrentParkingSlip(null)
    setState(LotStatus.SUCCESS)
    setCurrentLot(selectedID)
  }

  const generateParkingSlip = () => {
    flash.current?.flash()
    setLoadingParkingSlip(true)
    parkingApi.newParkingSlip(currentLot).then(res => {
      if (res.statusCode == 200) {
        const permit: ParkingSlip = res.data.data;
        setCurrentParkingSlip(permit)
        if (permit.slip_id == 0) {
          setState(LotStatus.LOT_FULL)
        } else {
          setState(LotStatus.SUCCESS)
        }
      } else {
        setState(LotStatus.SERVER_ERROR)
      }
    }).finally(() => {
      setLoadingParkingSlip(false)
    })
  }

  return (
      <div className="w-full content-center">
          <ScreenFlash ref={flash} />
          <div className="bg-white mx-auto gap-4 text-black w-3/4 border overflow-hidden">
            <div className="flex flex-col w-full text-center">
              <h1 className="text-3xl font-bold my-4">PARKING PERMITS</h1>
              <ParkingLotSelector selectedLot={currentLot} onLotSelect={onLotSelect} />
              <button 
                className={`border mx-auto px-2 my-4 ${currentLot === -1 ? "text-gray-200" : "hover:shadow-sm cursor-pointer"}`}
                onClick={generateParkingSlip}
                >
                  Issue Parking Slip
                </button>
                {state == LotStatus.SUCCESS && currentParkingSlip ? (
                  <div className={`flex flex-col ${loadingParkingSlip ? "invisible" : ""}`}>
                    <div className="w-1/2 mx-auto justify-center">
                      <p style={{ fontFamily: "Consolas"}}>Our state-of-the-art robo photographer has captured this vehicle's license plate and extracted the driver's personal information!</p>
                    </div>
                    
                    <div className="bg-[url('/images/licenseplatebg.png')] bg-cover text-4xl text-blue-800 w-60 h-30 mx-auto mt-2">
                      <div className="mt-12 font-[Impact] tracking-widest">{currentParkingSlip.licenseplate}</div>
                    </div>
                    <ParkingSlip 
                      id={currentParkingSlip.slip_id.toString()}
                      spot={currentParkingSlip.spot}
                      licenseplate={currentParkingSlip.licenseplate}
                      make={currentParkingSlip.make}
                      model={currentParkingSlip.model}
                      firstname={currentParkingSlip.firstname}
                      lastname={currentParkingSlip.lastname}
                      entry={new Date(currentParkingSlip.start * 1000).toLocaleString()}
                    />
                  </div>
                ) : null}
                {state == LotStatus.SERVER_ERROR ? (
                  <div className={`flex flex-col ${loadingParkingSlip ? "invisible" : ""}`}>
                    <div className="w-1/2 mx-auto text-center justify-center my-4">
                      <div style={{ fontFamily: "Consolas"}}>
                        <h1 className="text-2xl font-bold">OOPS!</h1>
                        <p>
                          It appears our increasing reliance on fancy auto-information scraping technology has backfired and, as a result, we are now unable to permit entry to new vehicles at this time.
                        </p>
                        <p>
                          Our downfall has been brought upon us as a result of our own hubris!
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                {state == LotStatus.LOT_FULL ? (
                  <div className={`flex flex-col ${loadingParkingSlip ? "invisible" : ""}`}>
                    <div className="w-1/4 mx-auto text-center justify-center my-4 border">
                      <h1 className="text-red-500 font-bold text-2xl">LOT FULL</h1>
                      <p>Please come back later.</p>
                    </div>
                  </div>
                ) : null}
            </div>
          </div>
      </div>
  );
}
