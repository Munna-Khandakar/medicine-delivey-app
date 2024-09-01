import Image from 'next/image';
import About from '@/components/SelfAdvertisement/banner.jpeg';

export const SelfAdvertisement = () => {

    return (
        <section className="block md:container">
            <div className="flex flex-col justify-center rounded-md p-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative group cursor-pointer">
                        <div
                            className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200">
                        </div>
                        <div
                            className="relative px-7 py-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                            <Image src={About} alt={'about us'}/>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
};