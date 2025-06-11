import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider as ReduxProvider } from 'react-redux';
import { store as reduxStore } from './utils/store.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import TodoDetailsPage from './pages/TodoDetailsPage.tsx';
import HomePage from './pages/HomePage.tsx';
import { Notification } from './components/Notification/Notification.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ReduxProvider store={reduxStore}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/todos/:id" element={<TodoDetailsPage />} />
				</Routes>
			</BrowserRouter>
			<Notification />
		</ReduxProvider>
	</StrictMode>
);
