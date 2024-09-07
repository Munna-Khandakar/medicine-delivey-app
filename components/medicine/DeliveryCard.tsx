import {Label} from '@/components/ui/label';
import {DeliveryType} from '@/types/DeliveryType';
import {Button} from '@/components/ui/button';

type DeliveryCardProps = {
    delivery: DeliveryType;
    selectedDeliveryType: DeliveryType;
    setDeliveryType: (delivery: DeliveryType) => void;
}

export const DeliveryCard = (props: DeliveryCardProps) => {

    const {delivery, selectedDeliveryType, setDeliveryType} = props;

    return (
        <Button
            key={delivery.id}
            variant="outline"
            onClick={() => setDeliveryType(delivery)}
            className={`${delivery.id === selectedDeliveryType.id ? 'border-2 border-teal-500 bg-teal-50' : 'border'} px-2 py-3 h-[5rem] w-full md:w-fit rounded-md items-center flex flex-col justify-center`}
        >
            <Label className="mb-2">{delivery.name}</Label>
            <span className="text-xs">{delivery.description}</span>
            <span className="text-xs">Charge ৳{delivery.charge}</span>
        </Button>
    );
};