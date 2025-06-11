import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Notification } from './components/Notification/Notification.tsx';
import HomePage from './pages/HomePage.tsx';
import TodoDetailsPage from './pages/TodoDetailsPage.tsx';
import { store as reduxStore } from './utils/store.ts';

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
