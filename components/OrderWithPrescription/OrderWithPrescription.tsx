'use client';

export const OrderWithPrescription = () => {
    return (
        <section className="container">
            <div className="rounded-lg border bg-teal-50 p-3 md:p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-sm md:text-2xl font-bold">Your Health, Our Priority</h1>
                        <p className="text-xs md:text-sm mt-2 text-gray-500">Just place order with some clicks, we will
                            handle rest</p>
                        {/*<Button className="mt-4">Upload</Button>*/}
                    </div>
                    <img
                        alt={'Upload Prescription'}
                        src={'https://assets.pharmeasy.in/apothecary/images/rx_upload.svg?dim=1024x0'}
                        className="w-12 md:w-24 h-12 md:h-24"
                    />
                </div>
            </div>
        </section>
    );
};


