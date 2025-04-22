import React from 'react';
import SearchSorting from './Sorting';
import SearchContentItem from './ContentItem';
import SearchPagination from './Pagination';
import { SearchParams } from '@/app/lib/interfaces/search';
import InitialResult from './Commons/InitialResult';
import EmptyResult from './Commons/EmptyResult';
import { getSearchResults } from '@/app/lib/modules/search/data';

interface SearchContentProps {
  searchParams: SearchParams;
}

const SearchContent = async ({ searchParams }: SearchContentProps) => {
  const searchResults = await getSearchResults(searchParams);
  const { results, current_page, per_page, total, initial_search } = searchResults;
  const hasResults = results && results.length > 0;

  return (
    <div className="xl:w-[1280px] h-auto flex flex-col justify-center items-center py-[32px] px-[16px] xl:px-[0px]">
      {hasResults && <SearchSorting total={total} />}

      {hasResults ? (
        <div className="flex flex-col py-[24px] gap-[24px] w-full">
          {results.map((item, index) => (
            <SearchContentItem key={item.id || index} item={item} />
          ))}
        </div>
      ) : initial_search ? (
        <InitialResult />
      ) : (
        <EmptyResult />
      )}

      {hasResults && total > per_page && (
        <SearchPagination currentPage={current_page} totalItems={total} pageSize={per_page} />
      )}
    </div>
  );
};

export default SearchContent;
