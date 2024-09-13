import Marquee from 'react-fast-marquee';

type ReactFastMarqueeProps = {
    announcement: string
}

export const ReactFastMarquee = (props: ReactFastMarqueeProps) => {

    const {announcement} = props;

    return (
        <Marquee className="py-4">
            <p className="font-semibold text-lg gradient-text">
                {announcement}
            </p>
        </Marquee>
    );
};