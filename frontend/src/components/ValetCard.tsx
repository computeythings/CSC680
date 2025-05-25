'use client'

import { valetApi } from '@/services/ApiService'
import React, { useRef, useState } from 'react'
import Receipt from './Receipt'

interface props {
  top: number
  left: number
  info: any
  onUpdate: () => void
  onClose: (e?: React.MouseEvent) => void
}

interface parkedTimes {
  start: Date
  end: Date
}

export default function ValetCard({ top, left, info, onUpdate, onClose }: props) {
    const carwashRef = useRef<HTMLInputElement>(null);
    const [parkedTimes, setParkedTimes] = useState<parkedTimes|null>(null)
    // Prevent click propagation that would otherwise close the window
    const preventClickThrough = (e: React.MouseEvent) => {
        e.stopPropagation()
    }
    // Reset checkbox when rendering a different spot
    if (carwashRef.current) {
        carwashRef.current.checked = false
    }

    const carWashAvailable = (): boolean => {
        const now = new Date()
        const hour = now.getHours()
        return hour >= 8 && hour < 16
    }

    const parkVehicle = () => {
        const carwash = carwashRef.current ? carwashRef.current.checked : false
        valetApi.newParkingSlip(info.slot_id, carwash).then(res =>{
          if (res.statusCode == 200) {
            onUpdate()
          } else {
            alert("Unable to contact server. Cannot park new vehicle.")
          } 
        })
        onClose()
    }

    const washVehicle = () => {
        valetApi.washVehicle(info.slip_id).then(res =>{
          if (res.statusCode == 200) {
            onUpdate()
          } else {
            alert("Unable to contact server. Cannot park new vehicle.")
          } 
        })
        onClose()
    }

    const checkoutVehicle = () => {
        valetApi.customerCheckout(info.slip_id).then(res =>{
          if (res.statusCode == 200) {
            const times = res.data.data;
            // Add the 'Z' for zulu time (UTC) since that's how we stored in the back end
            const end = new Date(`${times.end}Z`)
            const start = new Date(`${times.start}Z`)
            setParkedTimes({
              start: start,
              end: end
            })
            onUpdate()
          } else {
            alert("Unable to contact server. Cannot park new vehicle.")
          } 
        })
    }

    const checkout = () => {
      setParkedTimes(null)
      onClose()
    }

    return (
    <div
      className={`absolute z-50 bg-white p-4 border cursor-default`}
      style={{ top, left }} 
      onClick={preventClickThrough}>
      <button
        onClick={onClose}
        className="absolute top-0 right-2 text-gray-500 hover:text-gray-800 cursor-pointer text-2xl"
        aria-label="Close">&times;</button>
        <div className="text-lg flex flex-col">
        { info.slip_id ? 
        <div className="min-w-50 min-h-30">
            <div className="font-bold">Parking Slip #{info.slip_id.toString().padStart(6,"0")}</div>
            <div>Customer: {info.firstname} {info.lastname}</div>
            <div>License Plate: {info.licenseplate}</div>
            <div className="flex mx-4 mt-2">
                { (info.carwash && !info.washed) ? 
                <button onClick={washVehicle} className="border hover:shadow-sm px-2 mx-auto">Wash</button>
                : null }
                <button onClick={checkoutVehicle} className="border hover:shadow-sm px-2 mx-auto">Checkout</button>
            </div>
        </div> 
        : 
        <div className="w-40 h-30">
            Space Available
            { carWashAvailable() ? 
                <div className="py-4 text-sm">
                    <input
                        type="checkbox"
                        ref={carwashRef}
                        className="h-4 w-4 cursor-pointer mr-2"
                    />
                    <span>Car Wash</span>
                </div>
                : 
                <div className="text-gray-400 text-sm py-4">-- Car wash unavailable --</div>
            }
            <button onClick={parkVehicle} className="border cursor-pointer my-auto py-1 px-2">Park Vehicle</button>
        </div>
        }
        {parkedTimes ? 
        <div
            className={`absolute z-100 bg-white p-4 border cursor-default`}
            style={{ top: -100, left: -100 }} 
            onClick={preventClickThrough}>
            <Receipt
              slip_id={info.slip_id.toString()}
              start={parkedTimes.start}
              end={parkedTimes.end}
              carwash={info.carwash}
              carwashed={info.washed}
              onClick={checkout}
            />
        </div> : null}
        </div>
    </div>
    )
}
