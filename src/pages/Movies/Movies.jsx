import { MoviesList } from 'components/MoviesList/MoviesList';
import { searchMovies } from 'API/getData';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Container,
  MoviesButton,
  MoviesForm,
  MoviesInput,
} from './Movies.styled';
import { Oval } from 'react-loader-spinner';

const Movies = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [queryData, setQueryData] = useState(null);
  const [handleQuery, setHandleQuery] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('search');
  const ref = useRef(query);

  const handleChange = ({ target: { value } }) => {
    value ? setSearchParams({ search: value }) : setSearchParams({});
  };
  const formSubmit = e => {
    e.preventDefault();
    setHandleQuery(query);
  };

  const fetchSearchMovies = useCallback(async searchText => {
    try {
      setIsLoading(true);
      const data = await searchMovies(searchText);

      setQueryData(data.results);
    } catch (error) {
      // setError(error)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    handleQuery && fetchSearchMovies(handleQuery);
  }, [fetchSearchMovies, handleQuery]);

  useEffect(() => {
    ref.current && fetchSearchMovies(ref.current);
  }, [fetchSearchMovies]);

  return (
    <>
      <Container>
        <MoviesForm onSubmit={formSubmit}>
          <MoviesInput
            type="text"
            autoFocus
            placeholder="Search"
            onChange={handleChange}
            value={query ?? ''}
          />
          <MoviesButton type="submit">Search</MoviesButton>
        </MoviesForm>
      </Container>
      {isLoading && (
        <Oval
        className="loader"
        height={80}
        width={80}
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass="loader"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
      )}
      {queryData && <MoviesList data={queryData} />}
    </>
  );
};

export default Movies;
