import 'modern-normalize';
import SearchBar from '../SearchBar/SearchBar';
import { Toaster, toast } from 'sonner';
import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import fetchMovies from '../../services/movieServise';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');


  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movie', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  const handleSearchSubmit = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };
  const totalPage = Math.max(data?.total_pages ?? 0, 1);

  const handleSelect = (result: Movie) => {
    setSelectedMovie(result);
    setIsModalOpen(true);
  };

  const closeModalWindow = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data]);

  return (
    <>
      <SearchBar onSubmit={handleSearchSubmit} />
      <Toaster position="top-center" />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid onSelect={handleSelect} movies={data.results} />
      )}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModalWindow} />
      )}

      {isSuccess && data?.results?.length > 0 && (
        <ReactPaginate
          pageCount={totalPage}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
          renderOnZeroPageCount={null}
        />
      )}
    </>
  );
}
