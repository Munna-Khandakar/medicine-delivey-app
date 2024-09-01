'use client'

export const Video = () => {
    return (
        <section className="block md:container w-full h-[20rem] md:h-[35rem] border">
            <video width="320" height="240" controls preload="none">
                <source src="./V1-1.mp4" type="video/mp4"/>
                {/*<track*/}
                {/*    src="/path/to/captions.vtt"*/}
                {/*    kind="subtitles"*/}
                {/*    srcLang="en"*/}
                {/*    label="English"*/}
                {/*/>*/}
                Your browser does not support the video tag.
            </video>
        </section>
    );

};

