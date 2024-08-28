// import {LoginForm} from '@/components/Login/Login';
import {Suspense} from 'react';
import {AdvanceLogin} from '@/components/Login/AdvanceLogin';

export default function LoginPage() {
    return (
        // <LoginForm/>
        <Suspense>
            <AdvanceLogin/>
        </Suspense>
    );
}