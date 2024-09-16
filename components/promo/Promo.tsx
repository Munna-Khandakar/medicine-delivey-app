'use client';

import {Slide} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import {VideoPlayer} from '@/components/VideoSection/VideoPlayer';
import {useEffect, useState} from 'react';

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
};

const slideImages = [
    {url: 'https://static.oxinis.com/healthmug/image/asset/3749-lu.webp'},
    {url: 'https://static.oxinis.com/healthmug/image/asset/3745-ex.webp'},
    {url: 'https://static.oxinis.com/healthmug/image/asset/3750-kk.webp'},
    {url: 'https://static.oxinis.com/healthmug/image/asset/3744-hb.webp'},
];

export const Promo = () => {

    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

    const updateScreenSize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const playerHeight = screenSize.width < 768 ? '100px' : '300px';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateScreenSize();
            window.addEventListener('resize', updateScreenSize);
            return () => {
                window.removeEventListener('resize', updateScreenSize);
            };
        }
    }, []);

    return (
        <section className="container">
            <div className="slide-container">
                <Slide>
                    {slideImages.map((slideImage, index) => (
                        <div key={index}>
                            {
                                index === 0 ?
                                        <VideoPlayer
                                            height={playerHeight}
                                            videoSrc="https://pharmatica-test.blr1.cdn.digitaloceanspaces.com/1725700369279_V2.mp4"
                                        />
                                    : <div
                                        className="h-[100px] md:h-[300px]"
                                        style={{...divStyle, 'backgroundImage': `url(${slideImage.url})`}}
                                    >
                                    </div>
                            }

                        </div>
                    ))}
                </Slide>
            </div>
        </section>
    );
};