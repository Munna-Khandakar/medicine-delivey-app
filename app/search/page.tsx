import { Suspense } from 'react';
import { SearchPage } from '@/components/search/SearchPage';

const Search = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPage />
        </Suspense>
    );
};

export default Search;