import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OutletDetailPage from './pages/OutletDetail';
import { useOutlets } from './hooks/useOutlets';

export default function App() {
  const { outlets, sortBy, setSortBy, filters, setFilters, updateOutlet, refetch, loading, error } = useOutlets();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              outlets={outlets}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filters={filters}
              setFilters={setFilters}
            />
          }
        />
        <Route
          path="/outlets/:id"
          element={<OutletDetailPage outlets={outlets} updateOutlet={updateOutlet} refetch={refetch} />}
        />
      </Routes>
    </BrowserRouter>
  );
}