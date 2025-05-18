import React, { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

interface BarcodeProps {
  number: string
}

const Barcode: React.FC<BarcodeProps> = ({ number }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, number, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 60,
        displayValue: false,
      })
    }
  }, [number])
  if (number)
    return <svg ref={svgRef} className="mx-auto"/>
  return null;
}

export default Barcode
