import {CategorySection} from '@/components/categorysection/CategorySection';
import {NewLaunchSection} from '@/components/medicine/NewLaunchSection';
import {Searchbar} from '@/components/Searchbar/Searchbar';
import {OrderWithPrescription} from '@/components/OrderWithPrescription/OrderWithPrescription';
import {Promo} from '@/components/promo/Promo';
import {TrendingNearYouSection} from '@/components/medicine/TrendingNearYouSection';
import {SelfAdvertisement} from '@/components/SelfAdvertisement/SelfAdvertisement';
import {DealsOfTheDay} from '@/components/DealsOfTheDay/DealsOfTheDay';
import {HealthArticles} from '@/components/HealthArticle/HealthArticles';
import {WhyChooseUs} from '@/components/WhyChooseUs/WhyChooseUs.';
import {VideoPlayer} from '@/components/VideoSection/VideoPlayer';

export default function Home() {
    return (
        <main className="flex flex-col space-y-6 md:space-y-16">
            <Searchbar/>
            <CategorySection/>
            <VideoPlayer
                videoSrc="https://pharmatica-test.blr1.cdn.digitaloceanspaces.com/1725700369279_V2.mp4"
            />
            <Promo/>
            <OrderWithPrescription/>
            <NewLaunchSection/>
            <TrendingNearYouSection/>
            <SelfAdvertisement/>
            <DealsOfTheDay/>
            <VideoPlayer
                videoSrc="https://pharmatica-test.blr1.cdn.digitaloceanspaces.com/1725699442600_V1.mp4"
            />
            <HealthArticles/>
            <WhyChooseUs/>
        </main>
    );
}
