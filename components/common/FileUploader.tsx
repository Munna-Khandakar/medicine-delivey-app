import {ChangeEvent, Fragment, useState} from 'react';
import {Upload, X} from 'lucide-react';
import {useToast} from '@/components/ui/use-toast';
import api from '@/lib/apiInstance';
import {ErrorResponse} from '@/types/ErrorResponse';
import {Button} from '@/components/ui/button';

type ServerError = {
    response: {
        data: ErrorResponse
    };
};

type FileUploaderProps = {
    onUploadComplete: (fileUrl: string) => void;
    fileUrl: string;
    fileType?: string;
    placeholder?: string;
};

export const FileUploader = (props: FileUploaderProps) => {


    const {onUploadComplete, fileUrl, fileType = 'image', placeholder = 'Upload Image'} = props;

    const {toast} = useToast();
    const [showInput, setShowInput] = useState(false);

    const convertFileToByteArray = (file: File): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const createFormData = (file: number[], contentType: string, privacyEnabled: boolean) => {
        return {
            file: file,
            contentType: contentType,
            privacyEnabled: privacyEnabled
        };
    };

    const createMultiPartFormData = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return formData;
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const file = e.target.files[0];
            try {
                // const uint8Array = await convertFileToByteArray(file);
                // const byteArray = Array.from(uint8Array);
                // const formData = createFormData(byteArray, 'image/png', false);
                const formData = createMultiPartFormData(file);
                const res = await uploadFile(formData);
                onUploadComplete(res.data.url);
            } catch (error) {
                console.error('Error converting file to byte array:', error);
            }
        }
    };

    const uploadFile = async (formData: any) => {
        try {
            // const res = await api.post('/settings/upload-file', formData);
            const res = await api.post('/settings/file-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return res;
        } catch (error) {
            const serverError = (error as ServerError).response.data;
            toast({
                title: serverError.code,
                description: serverError.message,
            });
            throw error;
        } finally {
            setShowInput(false);
        }
    };

    return (
        <div className="relative">
            {fileUrl && !showInput ? (
                <Fragment>
                    {
                        fileType === 'image' && <img src={fileUrl} alt="Uploaded" className="w-full h-auto"/>
                    }
                    {
                        fileType === 'file' && <a href={fileUrl}>{fileUrl}</a>
                    }

                </Fragment>
            ) : (
                <label htmlFor="fileId"
                       className="border border-dashed rounded-xl flex flex-col h-[100px] items-center justify-center cursor-pointer p-1"
                >
                    <Upload className="h-4 w-4 text-muted-foreground"/>
                    <p className="text-xs mt-2 text-slate-500 text-center">{placeholder}</p>
                    <input type="file" id="fileId" className="hidden" onChange={handleFileChange}/>
                </label>
            )}
            {
                fileUrl &&
                <Button className="absolute -top-2 -right-2 rounded-full border-red-500 bg-red-50"
                        size="icon" variant={'outline'} type="button"
                        onClick={() => setShowInput(true)}>
                    <X color={'red'}/>
                </Button>
            }

        </div>
    );
};