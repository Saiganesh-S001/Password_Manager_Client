import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchRecordsRequest } from '../../store/slices/passwordRecordsSlice';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';

interface SearchFormInputs {
  searchQuery: string;
}

export const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  // Get initial value from any of the possible search params
  const initialSearchValue = 
    searchParams.get('search_by_title') || 
    searchParams.get('search_by_username') || 
    searchParams.get('search_by_url') || 
    '';

  const { register, handleSubmit, watch, reset } = useForm<SearchFormInputs>({
    defaultValues: {
      searchQuery: initialSearchValue
    }
  });

  const debouncedSearch = useCallback(
    debounce((data: SearchFormInputs) => {
      const params = new URLSearchParams();
      if (data.searchQuery) {
        params.set('search_by_title', data.searchQuery);
        params.set('search_by_username', data.searchQuery);
        params.set('search_by_url', data.searchQuery);
      }
      setSearchParams(params);
      
      // Dispatch with all search fields set to the same value
      dispatch(fetchRecordsRequest({
        search_by_title: data.searchQuery,
        search_by_username: data.searchQuery,
        search_by_url: data.searchQuery
      }));
    }, 300),
    [dispatch, setSearchParams]
  );

  const watchAll = watch();
  const prevWatchRef = React.useRef(watchAll);

  useEffect(() => {
    if (watchAll.searchQuery !== prevWatchRef.current.searchQuery) {
      debouncedSearch(watchAll);
      prevWatchRef.current = watchAll;
    }
    return () => debouncedSearch.cancel();
  }, [watchAll, debouncedSearch]);

  const onSubmit = (data: SearchFormInputs) => {
    dispatch(fetchRecordsRequest({
      search_by_title: data.searchQuery,
      search_by_username: data.searchQuery,
      search_by_url: data.searchQuery
    }));

    setSearchParams(new URLSearchParams());
    reset({ searchQuery: '' });
    navigate('/passwords');
  };

  useEffect(() => {
    setSearchParams(new URLSearchParams());
  }, [location.pathname]);

  return (
    <div className="container mx-auto mt-2">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 p-3 rounded-lg"
      >
        <input
          type="text"
          {...register('searchQuery')}
          placeholder="Search passwords..."
          className="w-64 p-2 text-sm bg-gray-600 text-white border border-gray-500 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition duration-150"
          onClick={() => {
            setSearchParams(new URLSearchParams());
            reset({ searchQuery: '' });
            dispatch(fetchRecordsRequest({}));
          }}
        > 
          Clear
        </button>
      </form>
    </div>
  );
};
