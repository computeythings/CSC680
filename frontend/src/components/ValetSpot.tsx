import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface props {
    spot: any
    upperRow: boolean
    onClick: (
        spot: any, 
        coords: {
            top: number, 
            left: number
        }
    ) => void
}

export default function ValetSpot({ spot, upperRow, onClick }: props) {
    const spotDiv = useRef<HTMLDivElement>(null)

    const getBackground = () => {
        if (spot.slip_id) {
            if (spot.carwash && !spot.washed) {
                return "bg-amber-900"
            } 
            return "bg-red-500"
        }
        return "bg-green-500"
    }

    const displayInfoCard = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (spotDiv.current) {
            onClick(
                spot,
                {
                    top: spotDiv.current.getBoundingClientRect().top,
                    left: spotDiv.current.getBoundingClientRect().left
                }
            )
        }
    }

  return (
    <div 
        ref={spotDiv}
        onClick={displayInfoCard}
        className={`flex text-3xl font-bold cursor-pointer h-30 w-20 ${getBackground()} border-x-2 ${upperRow ? "border-b-2 flex-col-reverse" : "border-t-2 flex-col"}`}
    >
        {spot.spot}
        {spot.carwash && !spot.washed ?
            <Image src={"/images/carwash.png"} alt={'Carwash Due'} width={48} height={48} className='mx-auto py-4' />
        : null}
    </div>
  );
}
