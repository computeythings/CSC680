import { useAuth } from '@/contexts/auth';
import { parkingApi } from '@/services/ApiService';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

interface SlipTimes {
  start: Date
  end: Date
}

export default function ParkingCheckout() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [slipID, setSlipID] = useState("")
  const [total, setTotal] = useState(0)
  const [slipTimes, setSlipTimes] = useState<SlipTimes|null>(null)
  const [badSlip, setBadSlip] = useState(false)
  useEffect(() => {
      setIsLoading(false)
  }, [user, router])
  if (isLoading) {
    return null
  }
  if (!user) {
    localStorage.setItem("redirect", "/parking/checkout/")
    router.push('/login/')
    return null
  }
  localStorage.removeItem("redirect")

  const dateFormat = (date: Date) => {
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    const day = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase().replace(/,/g, "")
    return `${time} ${day}`
  }

  const durationFormat = (duration: number) => {
    const seconds = duration / 1000
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} hours ${minutes} minutes`
  }

  const duration = (): number => {
    if (slipTimes) {
      return slipTimes.end.getTime() - slipTimes.start.getTime()
    }
    return 0
  }

  // submit on enter
  const submitIfEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      checkout()
    }
  }

  const checkout = () => {
    setBadSlip(false)
    if (!slipTimes) {
      parkingApi.customerCheckout(slipID).then(res => {
        if (res.statusCode === 200) {
          const times = res.data.data;
          // Add the 'Z' for zulu time (UTC) since that's how we stored in the back end
          const end = new Date(`${times.end}Z`)
          const start = new Date(`${times.start}Z`)
          setSlipTimes({
            start: start,
            end: end
          })
        } else {
          setBadSlip(true)
        }
      })
    } else {
      setSlipID("")
      setSlipTimes(null)
    }
  }

  return (
        <div className="w-full content-center min-w-150">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
              <div className="flex flex-col w-full text-center">
                <h1 className="text-3xl font-bold my-4">CUSTOMER CHECKOUT</h1>
                <div className="m-4">
                  <div>
                    Parking Slip #: 
                    <input 
                    type="number"
                    className={`border ml-2 pl-2 focus:outline-none ${badSlip ? "border-red-500" : ""}`}
                    onKeyDown={submitIfEnter}
                    value={slipID}
                    readOnly={slipTimes!==null}
                    onChange={e => {setBadSlip(false); setSlipID(e.target.value)}}
                    />
                  </div>
                  {slipTimes ? (
                    <div className="py-8 pb-4 mx-auto">
                      <div className="grid grid-cols-2 text-left gap-x-12">
                      <div className="text-right">Time Entered:</div><div>{dateFormat(slipTimes.start)}</div>
                      <div className="text-right">Time Exited:</div><div>{dateFormat(slipTimes.end)}</div>
                      <div className="text-right">Total Duration:</div><div>{durationFormat(duration())}</div>
                      <div className="text-right">Cost per hour:</div><div>$1</div>
                      <div className="text-center pt-4 col-span-2">
                        <span className="font-bold pr-4">TOTAL: </span>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.ceil((duration()) / 1000 / 3600))}
                      </div>
                      </div>
                    </div>
                  ) : null}
                  <button
                    className="border cursor-pointer hover:shadow-sm mt-4 px-2"
                    onClick={checkout}
                  >
                    {slipTimes ? "Clear" : "Checkout" }
                  </button>
                </div>
              </div>
            </div>
        </div>
  );
}
