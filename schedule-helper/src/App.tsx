import { useState } from 'react';
import './App.css';

function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<form className="form-container">
				<label htmlFor="teamleaders">Podaj liczbę TeamLeaderów:</label>
				<input type="number" id="teamleaders" required />
				<label htmlFor="employees">Podaj liczbę pozostałych pracowników:</label>
				<input type="number" id="employees" required />
			</form>
		</div>
	);
}

export default App;
