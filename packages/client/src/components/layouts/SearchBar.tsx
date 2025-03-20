import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchRecordsRequest } from '../../store/slices/passwordRecordsSlice';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';

interface SearchFormInputs {
  search_by_title?: string;
  search_by_username?: string;
  search_by_url?: string;
}

export const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, reset } = useForm<SearchFormInputs>({
    defaultValues: {
      search_by_title: searchParams.get('search_by_title') || '',
      search_by_username: searchParams.get('search_by_username') || '',
      search_by_url: searchParams.get('search_by_url') || ''
    }
  });

  const debouncedSearch = useCallback(
    debounce((data: SearchFormInputs) => {
      const params = new URLSearchParams();
      if (data.search_by_title) params.set('search_by_title', data.search_by_title);
      if (data.search_by_username) params.set('search_by_username', data.search_by_username);
      if (data.search_by_url) params.set('search_by_url', data.search_by_url);
      setSearchParams(params);
      dispatch(fetchRecordsRequest(data));
    }, 300),
    [dispatch, setSearchParams]
  );

  const watchAll = watch();
const prevWatchRef = React.useRef(watchAll); // Store previous values

useEffect(() => {
  if (
    watchAll.search_by_title !== prevWatchRef.current.search_by_title ||
    watchAll.search_by_username !== prevWatchRef.current.search_by_username ||
    watchAll.search_by_url !== prevWatchRef.current.search_by_url
  ) {
    debouncedSearch(watchAll);
    prevWatchRef.current = watchAll; // Update stored values
  }
  return () => debouncedSearch.cancel();
}, [watchAll, debouncedSearch]);

  const onSubmit = (data: SearchFormInputs) => {
    dispatch(fetchRecordsRequest(data));

    setSearchParams(new URLSearchParams());
    reset({ search_by_title: '', search_by_username: '', search_by_url: '' });
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
            {...register('search_by_title')}
            placeholder="Title"
            className="w-36 p-2 text-sm bg-gray-600 text-white border border-gray-500 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
            type="text"
            {...register('search_by_url')}
            placeholder="URL"
            className="w-36 p-2 text-sm bg-gray-600 text-white border border-gray-500 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
            type="text"
            {...register('search_by_username')}
            placeholder="Username"
            className="w-36 p-2 text-sm bg-gray-600 text-white border border-gray-500 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        {/* <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-150"
        >
            Search
        </button> */}
        <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition duration-150"
            onClick={() => {
                setSearchParams(new URLSearchParams());
                reset({ search_by_title: '', search_by_username: '', search_by_url: '' });
                dispatch(fetchRecordsRequest({}));
            }}
        > Cancel
        </button>
        </form>
    </div>
  );
};
