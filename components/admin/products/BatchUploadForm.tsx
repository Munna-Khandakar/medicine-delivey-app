'use client';

import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {FileUploader} from '@/components/common/FileUploader';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import api from '@/lib/apiInstance';
import {useToast} from '@/components/ui/use-toast';
import {useRouter} from 'next/navigation';
import {Loader} from 'lucide-react';

type Input = {
    filePath: string
}

export const BatchUploadForm = () => {

    const {toast} = useToast();
    const router = useRouter();

    const {
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        formState: {isDirty, isSubmitting}
    } = useForm<Input>({
        defaultValues: {
            filePath: ''
        }
    });

    console.log(watch());

    const onSubmit: SubmitHandler<Input> = (data) => {
        const url = '/products/bulk-create';
        const method = 'post';
        toast({
            title: 'Please wait for a while',
            description: `This may take a while, please wait for the process to complete.`,
        });
        api[method](url, data).then(() => {
            toast({
                title: 'Products Uploaded',
                description: `Products have been uploaded successfully.`,
            });
            router.push('/admin/products');
        }).catch((error) => {
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        }).finally(() => {
            reset();
        });
    };


    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <h3 className={'text-lg text-slate-800 font-semibold'}>Batch Upload</h3>
                    <p className="text-sm text-slate-400 font-normal"> Please select your file carefully</p>
                </CardHeader>
                <CardContent>
                    <FileUploader
                        placeholder={'Choose Your File'}
                        fileUrl={getValues('filePath')}
                        fileType={'file'}
                        onUploadComplete={(url) => {
                            const prefix = 'https://pharamatic-storage.sgp1.cdn.digitaloceanspaces.com/';
                            if (url.includes(prefix)) {
                                url = url.replace(prefix, '');
                                setValue('filePath', url);
                            }
                        }}
                    />
                </CardContent>
                <CardFooter>
                    {
                        isSubmitting
                            ? <Button disabled={true}> <Loader/>Upload</Button>
                            : <Button
                                type="submit"
                                disabled={isDirty}
                                variant={isDirty ? 'secondary' : 'default'}
                            >
                                Upload
                            </Button>
                    }
                </CardFooter>
            </form>
        </Card>
    );
};