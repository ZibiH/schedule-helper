import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';

type Employee = {
	name: string;
	hours: number;
	id: string;
};

const createEmployeesArray = (name: string, hours: number, count: number) => {
	const array: Employee[] = [];
	for (let i = 0; i < count; i++) {
		const person = {
			name: name,
			hours: hours,
			id: Math.random().toString(),
		};
		array.push(person);
	}
	return array;
};

const getTotalHours = (array: Employee[]) => {
	return array.reduce((total, employee) => {
		return total + employee.hours;
	}, 0);
};

function App() {
	const teamleadersCountRef = useRef<HTMLInputElement>(null);
	const employeesCountRef = useRef<HTMLInputElement>(null);
	const hoursRef = useRef<HTMLInputElement>(null);
	const daysRef = useRef<HTMLInputElement>(null);
	const [teamleadersTotalHours, setTeamleadersTotalHours] = useState(0);
	const [employeesTotalHours, setEmployeesTotalHours] = useState(0);
	const [teamleadersArray, setTeamleadersArray] = useState<Employee[]>([]);
	const [employeesArray, setEmployeesArray] = useState<Employee[]>([]);
	const [isDisabled, setIsDisabled] = useState(true);

	const tlD12Ref = useRef<HTMLInputElement>(null);
	const tlN12Ref = useRef<HTMLInputElement>(null);
	const tlK1Ref = useRef<HTMLInputElement>(null);
	const tlK2Ref = useRef<HTMLInputElement>(null);
	const empD12Ref = useRef<HTMLInputElement>(null);
	const empN12Ref = useRef<HTMLInputElement>(null);
	const empK1Ref = useRef<HTMLInputElement>(null);
	const empK2Ref = useRef<HTMLInputElement>(null);

	// useEffect(() => {
	// 	if (!hoursRef.current?.value) return;
	// 	if (!teamleadersCountRef.current?.value) return;
	// 	if (!employeesCountRef.current?.value) return;
	// 	const hours = +hoursRef.current.value;
	// 	const numberOfTeamleaders = +teamleadersCountRef.current.value;
	// 	const numberOfEmployees = +employeesCountRef.current.value;
	// 	const teamleaders = createEmployeesArray('teamleader', hours, numberOfTeamleaders);
	// 	setTeamleadersArray(teamleaders);
	// 	setTeamleadersTotalHours(getTotalHours(teamleaders));
	// 	const employees = createEmployeesArray('pracownik', hours, numberOfEmployees);
	// 	setEmployeesArray(employees);
	// 	setEmployeesTotalHours(getTotalHours(employees));
	// }, [
	// 	hoursRef.current?.value,
	// 	teamleadersCountRef.current?.value,
	// 	employeesCountRef.current?.value,
	// ]);

	const changeTeamleaderHours = (id: string, hours: number) => {
		const newTeamleadersArray = teamleadersArray.map((teamleader) => {
			if (teamleader.id !== id) return teamleader;
			return { ...teamleader, hours: hours };
		});
		setTeamleadersArray(newTeamleadersArray);
		setTeamleadersTotalHours(getTotalHours(newTeamleadersArray));
	};

	const manageDisabled = () => {
		const disabled = !!hoursRef.current?.value && !!daysRef.current?.value;
		setIsDisabled(!disabled);
	};

	const changeEmployeesHours = (id: string, hours: number) => {
		const newEmployeesArray = employeesArray.map((employee) => {
			if (employee.id !== id) return employee;
			return { ...employee, hours: hours };
		});
		setEmployeesArray(newEmployeesArray);
		setEmployeesTotalHours(getTotalHours(newEmployeesArray));
	};

	const handleShifts = (e: FormEvent) => {
		e.preventDefault();
		if (!hoursRef.current?.value) return;
		if (!teamleadersCountRef.current?.value) return;
		if (!employeesCountRef.current?.value) return;
		const hours = +hoursRef.current.value;
		const numberOfTeamleaders = +teamleadersCountRef.current.value;
		const numberOfEmployees = +employeesCountRef.current.value;
		const teamleaders = createEmployeesArray('teamleader', hours, numberOfTeamleaders);
		setTeamleadersArray(teamleaders);
		setTeamleadersTotalHours(getTotalHours(teamleaders));
		const employees = createEmployeesArray('pracownik', hours, numberOfEmployees);
		setEmployeesArray(employees);
		setEmployeesTotalHours(getTotalHours(employees));
	};

	return (
		<div className="main">
			<div className="data-container">
				<form className="form-container" onSubmit={handleShifts}>
					<div className="form-data">
						<div className="month-data">
							<label htmlFor="hours">Godziny pracy:</label>
							<input
								type="number"
								id="hours"
								required
								ref={hoursRef}
								onChange={manageDisabled}
							/>
							<label htmlFor="days">Dni w miesiącu:</label>
							<input
								type="number"
								id="days"
								required
								ref={daysRef}
								onChange={manageDisabled}
							/>
							<label htmlFor="teamleaders">Ilość Teamleaderów:</label>
							<input
								type="number"
								id="teamleaders"
								required
								ref={teamleadersCountRef}
								max={99}
								maxLength={2}
								disabled={isDisabled}
							/>
							<label htmlFor="employees">Ilość pozostałych pracowników:</label>
							<input
								type="number"
								id="employees"
								required
								ref={employeesCountRef}
								max={99}
								maxLength={2}
								disabled={isDisabled}
							/>
						</div>
						<div className="shifts-data">
							<div className="employees-shifts">
								<p>Teamleaderzy:</p>
								<label htmlFor="tlD12psary">D12</label>
								<input type="number" id="tlD12psary" required ref={tlD12Ref} />
								<label htmlFor="tlN12psary">N12</label>
								<input type="number" id="tlN12psary" required ref={tlN12Ref} />
								<label htmlFor="tlK1ktw">K1</label>
								<input type="number" id="tlK1ktw" required ref={tlK1Ref} />
								<label htmlFor="tlK2ktw">K2</label>
								<input type="number" id="tlK2ktw" required ref={tlK2Ref} />
							</div>
							<div className="employees-shifts">
								<p>Pozostali:</p>
								<label htmlFor="empD12psary">D12</label>
								<input type="number" id="empD12psary" required ref={empD12Ref} />
								<label htmlFor="empN12psary">N12</label>
								<input type="number" id="empN12psary" required ref={empN12Ref} />
								<label htmlFor="empK1ktw">K1</label>
								<input type="number" id="empK1ktw" required ref={empK1Ref} />
								<label htmlFor="empK2ktw">K2</label>
								<input type="number" id="empK2ktw" required ref={empK2Ref} />
							</div>
						</div>
					</div>
					<button className="submit">OK</button>
				</form>
				<div className="shifts-container">
					<div className="shift-line">
						<p className="shift-data">Dostępne godziny teamleadrów:</p>
						<p className="shift-data">{teamleadersTotalHours}</p>
					</div>
					<div className="shift-line">
						<p className="shift-data">Dostępne konfiguracje zmian teamleadrów:</p>
						<p className="shift-data">{0}</p>
					</div>
					<div className="shift-line">
						<p className="shift-data">Dostępne godziny pozostałych pracowników:</p>
						<p className="shift-data">{employeesTotalHours}</p>
					</div>
					<div className="shift-line">
						<p className="shift-data">
							Dostępne konfiguracje zmian pozostałych pracowników:
						</p>
						<p className="shift-data">{0}</p>
					</div>
					<div className="shift-line">
						<p className="shift-data">Dostępne godziny teamleadrów:</p>
						<p className="shift-data">{0}</p>
					</div>
				</div>
			</div>
			<div style={{ border: ' 4px solid white', margin: '1rem 0' }} />
			<div className="employees-container">
				<div className="teamleaders">
					{teamleadersArray.length > 0
						? teamleadersArray.map((teamleader) => (
								<div className="teamleader" key={teamleader.id}>
									<p>{teamleader.name}</p>
									<input
										className="employees-hours"
										defaultValue={teamleader.hours}
										onChange={(e) =>
											changeTeamleaderHours(teamleader.id, +e.target.value)
										}
									/>
								</div>
						  ))
						: null}
				</div>
				<div style={{ padding: '12px' }} />

				<div className="employees">
					{employeesArray.length > 0
						? employeesArray.map((employee) => (
								<div className="employee" key={employee.id}>
									<p>{employee.name}</p>
									<input
										className="employees-hours"
										defaultValue={employee.hours}
										onChange={(e) => changeEmployeesHours(employee.id, +e.target.value)}
									/>
								</div>
						  ))
						: null}
				</div>
			</div>
		</div>
	);
}

export default App;
