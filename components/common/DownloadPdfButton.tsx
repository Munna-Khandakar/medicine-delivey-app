import {Button} from '@/components/ui/button';
import {Download} from 'lucide-react';


type  DownloadPdfButtonProps = {
    url:string
    disabled:boolean
}

export const DownloadPdfButton = (props:DownloadPdfButtonProps) => {

    const {url, disabled} = props;

    return (
        <Button
            variant={'outline'} size={'icon'}
            aria-label={'Download Cash Memo'}
            disabled={disabled}
            onClick={() => {
                const pdfLink = url;
                const link = document.createElement('a');
                link.href = pdfLink;
                link.download = 'CashMemo.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }}
        >
            <Download size={15}/>
        </Button>
    );
};