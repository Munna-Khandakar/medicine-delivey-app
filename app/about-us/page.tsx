export default function AboutUsPage() {
    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-4xl font-bold text-center mb-8 gradient-text">About Us</h1>
                <p className="text-lg text-gray-700 mb-6">
                    PHARMATIC revolutionizes online based healthcare supply with innovative solutions, ensuring reliable
                    access to drugs and medical equipment in Bangladesh, driven by cutting-edge technology and expert
                    leadership.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                    Pharmatic Management ensures continuous growth and sustainable business practices for the well-being
                    of people. The Pharmatic has two founders. Aphorism of our two founders:
                </p>
                <div className="mb-8">
                    <blockquote className="border-l-4 border-teal-500 pl-4 italic text-gray-600 mb-4">
                        {`"I have liked to face challenges, enjoys working under pressure and can keep calm in difficult
                        situations and circumstances. I believe that without the establishment of businesses, society
                        cannot progress. My academic background and experience in hospital facilities have shaped my
                        goal to establish a real-time rapid drug supply system, diagnostic service at home, delivering
                        medication directly to those in need. This is why I created PHARMATIC. My vision is to create
                        value and make a significant impact on society by improving healthcare and ensuring that good
                        quality medicine and treatment are accessible to every class of society."`}
                    </blockquote>
                    <p className="text-right text-teal-600 font-semibold">
                        Engr. Md. Rayahan Sarker Bipul<br/>
                        B.Sc. in Biomedical Engineering, KUET<br/>
                        Founder & CEO, Pharmatic
                    </p>
                </div>
                <div className="mb-8">
                    <blockquote className="border-l-4 border-teal-500 pl-4 italic text-gray-600 mb-4">
                        {` "Our mission is to achieve higher efficiency to develop and deliver affordable drug and services
                        to society for good. We are in society as a corporate citizen to strengthen the communities and
                        neighborhoods by integrating them in the process of development. We care about maintaining
                        social sustainability and preserving healthy life for a healthier country. We are in business
                        for economic success for advancing the country towards more viable solutions, products and
                        services."`}
                    </blockquote>
                    <p className="text-right text-teal-600 font-semibold">
                        Engr. Dibosh Kanti Das<br/>
                        B.Sc. in Mechanical & Aeronautical Engineering, SNU (Korea)<br/>
                        Founder & Finance Director, Pharmatic
                    </p>
                </div>
            </div>
        </div>
    );
}