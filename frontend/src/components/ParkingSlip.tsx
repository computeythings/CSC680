import Barcode from "./Barcode";

interface props {
    id: string
    spot: string
    licenseplate: string
    make: string
    model: string
    firstname: string
    lastname: string
    entry: string
}

export default function ParkingSlip({id, spot, licenseplate, make, model, firstname, lastname, entry}: props) {

  return (
        <div className="border w-150 mx-auto my-10">
            <h1 className="text-xl font-bold my-8">PARKING SLIP #{id.padStart(6,"0")}</h1>
            <div className="px-20 my-4">
            <div style={{ fontFamily: "Consolas"}}>
                <p className="px-5 my-4">PARKING SPOT: {spot}</p>
                <p className="px-5 my-4">LICENSE PLATE: {licenseplate}</p>
                <p className="px-5 my-4">VEHCILE: {`${make.toUpperCase()} ${model.toUpperCase()}`}</p>
                <p className="px-5 my-4">CUSTOMER NAME: {`${firstname.toUpperCase()} ${lastname.toUpperCase()}`}</p>
                <p className="px-5 my-4">ENTRY TIME: {entry} </p>
                <Barcode number={id.padStart(6,"0")} />
            </div>
            </div>
        </div>
  );
}
