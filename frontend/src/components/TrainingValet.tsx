import TrainingVideo from "./TrainingVideo";

export default function TrainingValet() {
  return (
    <div className="w-full content-center ">
        <div className="w-full content-center">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                <div className="flex flex-col w-full text-center">
                    <h1 className="text-3xl font-bold my-4">How to Park</h1>
                    <TrainingVideo src="https://csc680-public-resources.s3.us-west-1.amazonaws.com/how-to-valet-car.mp4" />
                    <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                        <li>From the Home page, click the Valet link in the sidebar</li>
                        <li>Next Click the Parking sub-menu</li>
                        <li>Select your current parking lot</li>
                        <li>Spots are displayed with color-coding: Red is taken, Brown is taken and needs washing, and green is vacant</li>
                        <li>Click a vacant spot and click Park Vehicle. Optionally, you may choose to get a carwash if it is between 8am and 4pm</li>
                        <li>The automated parking cameras will detect the customer's name and vehicle information and enter it upon selection</li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="w-full content-center my-2">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                <div className="flex flex-col w-full text-center">
                    <h1 className="text-3xl font-bold my-4">How to Carwash</h1>
                    <TrainingVideo src="https://csc680-public-resources.s3.us-west-1.amazonaws.com/how-to-carwash.mp4" />
                    <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                        <li>From the Valet page, click the Car Wash sub menu</li>
                        <li>Select your current parking lot</li>
                        <li>Here you can see which vehicles have been washed and which are scheduled</li>
                        <li>From the Parking sub-page, find the spot you wish to wash and click it</li>
                        <li>Click Wash to wash the vehcile</li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="w-full content-center my-2">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                <div className="flex flex-col w-full text-center">
                    <h1 className="text-3xl font-bold my-4">How to Checkout</h1>
                    <TrainingVideo src="https://csc680-public-resources.s3.us-west-1.amazonaws.com/how-to-valet-checkout.mp4" />
                    <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                        <li>From the Valet page, click the Parking sub menu</li>
                        <li>Find the spot you wish to checkout and click it</li>
                        <li>Click Checkout and the receipt will appear. Click pay and hand the customer the receipt</li>
                        <li>Note: vehicles that have not been washed can still be checked out but will not be charged for the carwash</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
  );
}
