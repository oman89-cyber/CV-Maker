import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CreatePage } from './pages/CreatePage';
import { ImportPage } from './pages/ImportPage';
import { EditorPage } from './pages/EditorPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Helper component that scrolls the window to the top on every route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
