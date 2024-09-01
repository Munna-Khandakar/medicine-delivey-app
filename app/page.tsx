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

export default function Home() {
    return (
        <main className="flex flex-col space-y-6 md:space-y-16">
            <Searchbar/>
            <CategorySection/>
            <Promo/>
            <OrderWithPrescription/>
            <NewLaunchSection/>
            <TrendingNearYouSection/>
            <SelfAdvertisement/>
            <DealsOfTheDay/>
            {/*<Video/>*/}
            <HealthArticles/>
            <WhyChooseUs/>
        </main>
    );
}
