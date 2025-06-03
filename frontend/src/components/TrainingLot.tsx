import TrainingVideo from "./TrainingVideo";

export default function TrainingLot() {
  return (
    <div className="w-full content-center ">
        <div className="w-full content-center">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                <div className="flex flex-col w-full text-center">
                    <h1 className="text-3xl font-bold my-4">How to View Parking Lots</h1>
                    <TrainingVideo src="/videos/how-to-view-lots.mp4" />
                    <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                        <li>From the Home page, click the Parking link in the sidebar</li>
                        <li>Next Click the Lots sub-menu</li>
                        <li>Select your parking lot</li>
                        <li>Here you can see Total slots, available slots, and occupied slots for each lot and individual floor</li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="w-full content-center my-2">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                <div className="flex flex-col w-full text-center">
                    <h1 className="text-3xl font-bold my-4">How to Get Parking Slip</h1>
                    <TrainingVideo src="/videos/how-to-parking-slip.mp4" />
                    <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                        <li>From the Parking page, click the Permit sub-menu</li>
                        <li>Select your parking lot</li>
                        <li>Click Issue Parking Slip and the robo attendant will identify your customer and generate a new slip</li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="w-full content-center my-2">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                <div className="flex flex-col w-full text-center">
                    <h1 className="text-3xl font-bold my-4">How to Checkout</h1>
                    <TrainingVideo src="/videos/how-to-parking-checkout.mp4" />
                    <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                        <li>From the Parking page, click the Checkout sub-menu</li>
                        <li>As the customer leaves, scan their parking slip or enter the number manually</li>
                        <li>Click Checkout to get their total</li>
                        <li>After the customer has paid, click Clear to enter the next slip</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
  );
}
