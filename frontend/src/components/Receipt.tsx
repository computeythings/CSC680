import Barcode from "./Barcode"

interface props {
    slip_id: string
    start: Date
    end: Date
    carwash: boolean
    carwashed: boolean
    onClick: () => void
}

export default function ParkingCheckout({slip_id, start, end, carwash, carwashed, onClick}: props) {

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
      return end.getTime() - start.getTime()
  }

  const price = (): string => {
    const hourly = Math.ceil((duration()) / 1000 / 3600)
    const wash = carwashed ? 30 : 0
    return new Intl.NumberFormat(
        'en-US', {
            style: 'currency', 
            currency: 'USD' 
        }).format(hourly + wash)
  }

  return (
        <div className="mx-auto w-120" style={{ fontFamily: "Consolas"}}>
            <h1 className="font-bold text-3xl mb-4">ACME Parking</h1>
            <div className="grid grid-cols-[2fr_3fr] text-left gap-x-12">
            <div className="text-right">Time Entered:</div><div>{dateFormat(start)}</div>
            <div className="text-right">Time Exited:</div><div>{dateFormat(end)}</div>
            <div className="text-right">Total Duration:</div><div>{durationFormat(duration())}</div>
            <div className="text-right">Cost per hour:</div><div>$1</div>
            {carwash ? <><div className="text-right">Carwash:</div><div>{`${carwashed ? "$30" : "$0"}`}</div></> : null}
            <div className="text-center mt-12 col-span-2">
            <span className="font-bold pr-4">TOTAL: </span>
            {price()}
            </div>
            <div className="col-span-2"><Barcode number={slip_id.padStart(12,"0")} /></div>
            </div>
            <button onClick={onClick} className="border hover:shadow-sm px-4">Pay</button>
        </div>
  );
}
