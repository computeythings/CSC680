import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ScreenFlash from "./ScreenFlash";
import Barcode from "./Barcode";
import { parkingApi } from "@/services/ApiService";
import ParkingLotSelector from "./ParkingLotSelector";

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

export default function ParkingParkingSlip() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentLot, setCurrentLot] = useState(-1)
  const [loadingParkingSlip, setLoadingParkingSlip] = useState(true)
  const [currentParkingSlip, setCurrentParkingSlip] = useState<ParkingSlip|null>(null)
  const [state, setState] = useState(LotStatus.SUCCESS)
  const flash = useRef<{flash: () => void}>(null);
  useEffect(() => {
      setIsLoading(false)
  }, [user, router])
  if (isLoading) {
    return null
  }
  if (!user) {
    localStorage.setItem("redirect", "/parking/permit/")
    router.push("/login/")
    return null
  }
  localStorage.removeItem("redirect")

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
                    <div className="w-1/2 mx-auto text-center justify-center">
                      <p style={{ fontFamily: "Consolas"}}>Our state-of-the-art robo photographer has captured this vehicle's license plate and extracted the driver's personal information!</p>
                    </div>
                    
                    <div className="border text-3xl px-8 py-4 mx-auto my-4 rounded-md border-4">
                      {currentParkingSlip.licenseplate}
                    </div>
                    
                    <div className="border text-center w-150 mx-auto my-10">
                      <h1 className="text-xl font-bold my-8">PARKING SLIP #{currentParkingSlip.slip_id.toString().padStart(6,"0")}</h1>
                      <div className="px-20 my-4">
                        <div style={{ fontFamily: "Consolas"}}>
                          <p className="px-5 my-4">PARKING SPOT: {currentParkingSlip.spot}</p>
                          <p className="px-5 my-4">LICENSE PLATE: {currentParkingSlip.licenseplate}</p>
                          <p className="px-5 my-4">VEHCILE: {`${currentParkingSlip.make.toUpperCase()} ${currentParkingSlip.model.toUpperCase()}`}</p>
                          <p className="px-5 my-4">CUSTOMER NAME: {`${currentParkingSlip.firstname.toUpperCase()} ${currentParkingSlip.lastname.toUpperCase()}`}</p>
                          <p className="px-5 my-4">ENTRY TIME: {new Date(currentParkingSlip.start * 1000).toLocaleString()} </p>
                          <Barcode number={currentParkingSlip.slip_id.toString().padStart(6,"0")} />
                        </div>
                      </div>
                    </div>
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
