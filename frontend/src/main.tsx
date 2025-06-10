import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './utils/store.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import TodoDetailsPage from './pages/TodoDetailsPage.tsx';
import HomePage from './pages/HomePage.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/todos/:id" element={<TodoDetailsPage />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
