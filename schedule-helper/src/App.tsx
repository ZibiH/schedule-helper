import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';

type Employee = {
	name: string;
	hours: number;
	id: string;
	shifts: { '12h': number; '8h': number; add: number };
};

type ShiftsData = {
	d12: number;
	n12: number;
	k1: number;
	k2: number;
	d8?: number;
	k3?: number;
};
const getMax12hShifts = (hours: number) => {
	const full12hShiftsNumber = hours / 12;
	if (hours < 8) return { '12h': 0, '8h': 0, add: hours };
	if (hours % 12 === 8)
		return { '12h': Math.floor(full12hShiftsNumber), '8h': 1, add: 0 };
	if (hours % 12 === 4)
		return { '12h': Math.floor(full12hShiftsNumber) - 1, '8h': 2, add: 0 };
	if (hours % 12 === 0)
		return { '12h': Math.floor(full12hShiftsNumber), '8h': 0, add: 0 };
	if (hours % 12 > 8) {
		return { '12h': Math.floor(full12hShiftsNumber), '8h': 1, add: (hours % 12) - 8 };
	}
	return { '12h': Math.floor(full12hShiftsNumber), '8h': 0, add: hours % 12 };
};

const createEmployeesArray = (name: string, hours: number, count: number) => {
	const array: Employee[] = [];
	for (let i = 0; i < count; i++) {
		const shifts = getMax12hShifts(hours);
		const person = {
			name: name,
			hours: hours,
			id: Math.random().toString(),
			shifts,
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

const calculateShiftsDemand = (shifts: ShiftsData, days: number) => {
	const numberOf12hShiftsNeeded =
		(shifts.d12 + shifts.k1 + shifts.k2 + shifts.n12) * days;
	const hoursNeeded = numberOf12hShiftsNeeded * 12;

	return [numberOf12hShiftsNeeded, hoursNeeded];
};

const calculateShiftsAvailability = (shiftsArray: Employee[]) => {
	const shiftsAvailability = shiftsArray.reduce(
		(total, nextPerson) => {
			const shifts = getMax12hShifts(nextPerson.hours);
			return {
				'12h': total['12h'] + shifts['12h'],
				'8h': total['8h'] + shifts['8h'],
				add: shifts.add + total.add,
			};
		},
		{ '12h': 0, '8h': 0, add: 0 },
	);
	return shiftsAvailability;
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

	const [needTlOption, setNeedTlOption] = useState(false);
	const [needEmpOption, setNeedEmpOption] = useState(false);

	const tlD12Ref = useRef<HTMLInputElement>(null);
	const tlN12Ref = useRef<HTMLInputElement>(null);
	const tlK1Ref = useRef<HTMLInputElement>(null);
	const tlK2Ref = useRef<HTMLInputElement>(null);
	const empD12Ref = useRef<HTMLInputElement>(null);
	const empN12Ref = useRef<HTMLInputElement>(null);
	const empK1Ref = useRef<HTMLInputElement>(null);
	const empK2Ref = useRef<HTMLInputElement>(null);

	const [employeesShiftsDemandArray, setEmployeesShiftsDemandArray] =
		useState<number[]>();
	const [teamleadersShiftsDemandArray, setTeamleadersShiftsDemandArray] =
		useState<number[]>();

	const [teamleadersShiftsAvailability, setTeamleadersShiftsAvailability] = useState<{
		'12h': number;
		'8h': number;
		add: number;
	}>();
	const [employeesShiftsAvailability, setEmployeesShiftsAvailability] = useState<{
		'12h': number;
		'8h': number;
		add: number;
	}>();

	useEffect(() => {
		if (!teamleadersShiftsDemandArray?.length || !teamleadersShiftsAvailability) return;
		const teamleaderShiftsDemand = teamleadersShiftsDemandArray[0];
		if (teamleadersShiftsAvailability['12h'] < teamleaderShiftsDemand)
			setNeedTlOption(true);
		return () => {};
	}, []);

	const manageDisabled = () => {
		const disabled = !!hoursRef.current?.value && !!daysRef.current?.value;
		setIsDisabled(!disabled);
	};

	const calculateAndSetTeamleadersData = () => {
		if (!hoursRef.current?.value) return;
		if (!teamleadersCountRef.current?.value) return;
		if (!employeesCountRef.current?.value) return;
		if (!tlD12Ref.current?.value) return;
		if (!tlN12Ref.current?.value) return;
		if (!tlK1Ref.current?.value) return;
		if (!tlK2Ref.current?.value) return;
		if (!empD12Ref.current?.value) return;
		if (!empN12Ref.current?.value) return;
		if (!empK1Ref.current?.value) return;
		if (!empK2Ref.current?.value) return;
		if (!daysRef.current?.value) return;

		const hours = +hoursRef.current.value;
		const numberOfTeamleaders = +teamleadersCountRef.current.value;
		const numberOfEmployees = +employeesCountRef.current.value;

		// TEAMLEADERS DATA:

		setNeedTlOption(false);

		const teamleaders = createEmployeesArray('teamleader', hours, numberOfTeamleaders);
		setTeamleadersArray(teamleaders);

		const tlShiftsAvailability = calculateShiftsAvailability(teamleaders);
		setTeamleadersShiftsAvailability(tlShiftsAvailability);
		setTeamleadersTotalHours(getTotalHours(teamleaders));

		const teamleadersShiftsData = {
			d12: +tlD12Ref.current.value,
			n12: +tlN12Ref.current.value,
			k1: +tlK1Ref.current.value,
			k2: +tlK2Ref.current.value,
		};

		const teamleadersShiftsDemand = calculateShiftsDemand(
			teamleadersShiftsData,
			+daysRef.current.value,
		);

		setTeamleadersShiftsDemandArray(teamleadersShiftsDemand);

		if (tlShiftsAvailability['12h'] < teamleadersShiftsDemand[0]) {
			setNeedTlOption(true);
		}

		// EMPLOYEES DATA:
		setNeedEmpOption(false);

		const employees = createEmployeesArray('pracownik', hours, numberOfEmployees);
		setEmployeesArray(employees);

		const empShiftsAvailability = calculateShiftsAvailability(employees);
		setEmployeesShiftsAvailability(empShiftsAvailability);
		setEmployeesTotalHours(getTotalHours(employees));

		const employeesShiftsData = {
			d12: +empD12Ref.current.value,
			n12: +empN12Ref.current.value,
			k1: +empK1Ref.current.value,
			k2: +empK2Ref.current.value,
		};

		const employeesShiftsDemand = calculateShiftsDemand(
			employeesShiftsData,
			+daysRef.current.value,
		);

		setEmployeesShiftsDemandArray(employeesShiftsDemand);

		if (empShiftsAvailability['12h'] < employeesShiftsDemand[0]) {
			setNeedEmpOption(true);
		}
	};

	const handleShifts = (e: FormEvent) => {
		e.preventDefault();
		calculateAndSetTeamleadersData();
	};

	const changeEmployeesHours = (id: string, hours: number) => {
		const newEmployeesArray = employeesArray.map((employee) => {
			if (employee.id !== id) return employee;
			return { ...employee, hours: hours, shifts: getMax12hShifts(hours) };
		});
		setEmployeesArray(newEmployeesArray);
		setEmployeesTotalHours(getTotalHours(newEmployeesArray));

		const newShiftsAvailability = calculateShiftsAvailability(newEmployeesArray);
		setEmployeesShiftsAvailability(newShiftsAvailability);

		const shiftsDemand = employeesShiftsDemandArray![0];

		if (newShiftsAvailability['12h'] < shiftsDemand) {
			setNeedEmpOption(true);
			return;
		}
		setNeedEmpOption(false);
	};

	const changeTeamleaderHours = (id: string, hours: number) => {
		const newShifts = getMax12hShifts(hours);
		const newTeamleadersArray = teamleadersArray.map((teamleader) => {
			if (teamleader.id !== id) return teamleader;
			return { ...teamleader, hours: hours, shifts: newShifts };
		});
		setTeamleadersArray(newTeamleadersArray);
		setTeamleadersTotalHours(getTotalHours(newTeamleadersArray));

		const newShiftsAvailability = calculateShiftsAvailability(newTeamleadersArray);
		setTeamleadersShiftsAvailability(newShiftsAvailability);

		const shiftsDemand = teamleadersShiftsDemandArray![0];

		if (newShiftsAvailability['12h'] < shiftsDemand) {
			setNeedTlOption(true);
			return;
		}
		setNeedTlOption(false);
	};

	return (
		<div className="main">
			<div style={{ padding: '1rem' }}></div>
			<div className="data-container">
				<form className="form-container" onSubmit={handleShifts}>
					<div className="form-data">
						<div className="data-column">
							<p>Podaj dane:</p>
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
							<label htmlFor="teamleaders">Teamleaderzy:</label>
							<input
								type="number"
								id="teamleaders"
								required
								ref={teamleadersCountRef}
								max={99}
								maxLength={2}
								disabled={isDisabled}
							/>
							<label htmlFor="employees">Pozostali:</label>
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
						<div className="data-column">
							<p>Teamleaderzy:</p>
							<label htmlFor="tlD12psary">D12</label>
							<input
								type="number"
								id="tlD12psary"
								defaultValue={1}
								required
								ref={tlD12Ref}
							/>
							<label htmlFor="tlN12psary">N12</label>
							<input
								type="number"
								id="tlN12psary"
								defaultValue={1}
								required
								ref={tlN12Ref}
							/>
							<label htmlFor="tlK1ktw">K1</label>
							<input type="number" id="tlK1ktw" defaultValue={1} required ref={tlK1Ref} />
							<label htmlFor="tlK2ktw">K2</label>
							<input type="number" id="tlK2ktw" defaultValue={0} required ref={tlK2Ref} />
						</div>
						<div className="data-column">
							<p>Pozostali:</p>
							<label htmlFor="empD12psary">D12</label>
							<input
								type="number"
								id="empD12psary"
								defaultValue={4}
								required
								ref={empD12Ref}
							/>
							<label htmlFor="empN12psary">N12</label>
							<input
								type="number"
								id="empN12psary"
								defaultValue={1}
								required
								ref={empN12Ref}
							/>
							<label htmlFor="empK1ktw">K1</label>
							<input
								type="number"
								id="empK1ktw"
								defaultValue={5}
								required
								ref={empK1Ref}
							/>
							<label htmlFor="empK2ktw">K2</label>
							<input
								type="number"
								id="empK2ktw"
								defaultValue={1}
								required
								ref={empK2Ref}
							/>
						</div>
					</div>
					<button className="submit">OK</button>
				</form>
				<div className="shifts-container">
					<table>
						<thead>
							<tr>
								<td>teamleaderzy</td>
								<td>godziny</td>
								<td>zmiany 12h</td>
								<td>zmiany 8h</td>
								<td>niewykorzystane h</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>zapotrzebowanie</td>
								<td>
									{teamleadersShiftsDemandArray ? teamleadersShiftsDemandArray[1] : 0}
								</td>
								<td>
									{teamleadersShiftsDemandArray ? teamleadersShiftsDemandArray[0] : 0}
								</td>
								<td>x</td>
								<td>x</td>
							</tr>
							<tr>
								<td>dostępne</td>
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleadersTotalHours}
								</td>
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleadersShiftsAvailability
										? teamleadersShiftsAvailability['12h']
										: 0}
								</td>
								<td>
									{teamleadersShiftsAvailability
										? teamleadersShiftsAvailability['8h']
										: 0}
								</td>
								<td>
									{teamleadersShiftsAvailability ? teamleadersShiftsAvailability.add : 0}
								</td>
							</tr>
							{needTlOption ? (
								<tr>
									<td>opcja</td>
									<td>{}</td>
									<td>{}</td>
									<td>{}</td>
									<td>{}</td>
								</tr>
							) : null}
						</tbody>
					</table>
					<div style={{ padding: '0.5rem' }}></div>
					<table>
						<thead>
							<tr>
								<td>pracownicy</td>
								<td>godziny</td>
								<td>zmiany 12h</td>
								<td>zmiany 8h</td>
								<td>niewykorzystane h</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>zapotrzebowanie</td>
								<td>{employeesShiftsDemandArray ? employeesShiftsDemandArray[1] : 0}</td>
								<td>{employeesShiftsDemandArray ? employeesShiftsDemandArray[0] : 0}</td>
								<td>x</td>
								<td>x</td>
							</tr>
							<tr>
								<td>dostępne</td>
								<td style={needEmpOption ? { color: '#c27' } : {}}>
									{employeesTotalHours}
								</td>
								<td style={needEmpOption ? { color: '#c27' } : {}}>
									{employeesShiftsAvailability ? employeesShiftsAvailability['12h'] : 0}
								</td>
								<td>
									{employeesShiftsAvailability ? employeesShiftsAvailability['8h'] : 0}
								</td>
								<td>
									{employeesShiftsAvailability ? employeesShiftsAvailability.add : 0}
								</td>
							</tr>
							{needEmpOption ? (
								<tr>
									<td>opcja</td>
									<td>{}</td>
									<td>{}</td>
									<td>{}</td>
									<td>{}</td>
								</tr>
							) : null}
						</tbody>
					</table>
				</div>
			</div>
			<div style={{ border: ' 4px solid white', margin: '1rem 0' }} />
			<div className="employees-container">
				<table>
					<thead>
						<tr>
							<td>Funkcja</td>
							<td>Zmiany 12h</td>
							<td>Zmiany 8h</td>
							<td>Nieprzydzielone</td>
							<td>godziny pracy</td>
						</tr>
					</thead>
					<tbody>
						{teamleadersArray.length > 0
							? teamleadersArray.map((teamleader) => (
									<tr key={teamleader.id}>
										<td>{teamleader.name}</td>
										<td>{teamleader.shifts['12h']}</td>
										<td>{teamleader.shifts['8h']}</td>
										<td>{teamleader.shifts.add + ' h'}</td>
										<td>
											<input
												className="employees-hours"
												defaultValue={teamleader.hours}
												onChange={(e) =>
													changeTeamleaderHours(teamleader.id, +e.target.value)
												}
											/>
										</td>
									</tr>
							  ))
							: null}
					</tbody>
				</table>
				<table>
					<thead>
						<tr>
							<td>Funkcja</td>
							<td>Zmiany 12h</td>
							<td>Zmiany 8h</td>
							<td>Nieprzydzielone</td>
							<td>godziny pracy</td>
						</tr>
					</thead>
					<tbody>
						{employeesArray.length > 0
							? employeesArray.map((employee) => (
									<tr key={employee.id}>
										<td>{employee.name}</td>
										<td>{employee.shifts['12h']}</td>
										<td>{employee.shifts['8h']}</td>
										<td>{employee.shifts.add + ' h'}</td>
										<td>
											<input
												className="employees-hours"
												defaultValue={employee.hours}
												onChange={(e) =>
													changeEmployeesHours(employee.id, +e.target.value)
												}
											/>
										</td>
									</tr>
							  ))
							: null}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default App;
