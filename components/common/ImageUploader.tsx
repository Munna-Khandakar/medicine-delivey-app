import {ChangeEvent} from 'react';
import {Upload} from 'lucide-react';
import {useToast} from '@/components/ui/use-toast';
import api from '@/lib/apiInstance';
import {ErrorResponse} from '@/types/ErrorResponse';


type ServerError = {
    response: {
        data: ErrorResponse
    };
};

export const ImageUploader = () => {

    const {toast} = useToast();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const fileDetails = e.target.files[0];
            uploadFile(fileDetails).then((res) => {
                console.log(res);
            });
        }
    };

    const uploadFile = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('contentType', 'image/png');
            formData.append('privacyEnabled', 'false');

            const res = await api.post('/settings/upload-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res;
        } catch (error) {
            const serverError = (error as ServerError).response.data;
            toast({
                title: serverError.code,
                description: serverError.message,
            });
            return error;
        }
    };


    return (
        <label htmlFor="fileId"
               className="border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer p-1"
        >
            <Upload className="h-4 w-4 text-muted-foreground"/>
            <p className="text-xs mt-2 text-slate-500 text-center">upload image</p>
            <input type="file" id="fileId" className="hidden" onChange={handleFileChange}/>
        </label>
    );
};