'use client';

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

type VideoPlayerProps = {
    videoSrc: string;
    height?:string
}

export const VideoPlayer = (props: VideoPlayerProps) => {
    const { videoSrc, height } = props;
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

    const updateScreenSize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateScreenSize();
            window.addEventListener('resize', updateScreenSize);
            return () => {
                window.removeEventListener('resize', updateScreenSize);
            };
        }
    }, []);

    const playerHeight = screenSize.width < 768 ? '360px' : '500px';

    return (
        <section>
            <ReactPlayer
                width="100%"
                height={height || playerHeight}
                url={videoSrc}
                controls={true}
                light={false}
                pip={true}
            />
            <source src={videoSrc} type="video/mp4" />
        </section>
    );
};