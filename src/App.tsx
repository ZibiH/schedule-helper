import { FormEvent, useRef, useState } from 'react';
import './App.css';

import {
	Employee,
	EmployeesShiftsDemand,
	InitialEmployeeData,
	ShiftsData,
} from '../types/types';
import {
	getTotalHours,
	getShiftsAvailability,
	getShifsDemand,
	createBoilerplateEmployeeArray,
	getOptionalEmployeesArray,
	// getMax12hShifts,
	// createEmployeeArray,
	// updateEmployeesArray,
	distributeShifts,
	checkIfShiftsAreCovered,
} from '../utils/calcs';

const TEAMLEADER = 'teamleader';
const REGULAR_EMPLOYEE = 'pracownik';

function App() {
	// FORM DATA
	const hoursRef = useRef<HTMLInputElement>(null);
	const daysRef = useRef<HTMLInputElement>(null);
	const teamleadersCountRef = useRef<HTMLInputElement>(null);
	const employeesCountRef = useRef<HTMLInputElement>(null);
	const tlD12Ref = useRef<HTMLInputElement>(null);
	const tlN12Ref = useRef<HTMLInputElement>(null);
	const tlK1Ref = useRef<HTMLInputElement>(null);
	const tlK2Ref = useRef<HTMLInputElement>(null);
	const tlK5Ref = useRef<HTMLInputElement>(null);
	const tlD8Ref = useRef<HTMLInputElement>(null);
	const empD12Ref = useRef<HTMLInputElement>(null);
	const empN12Ref = useRef<HTMLInputElement>(null);
	const empK1Ref = useRef<HTMLInputElement>(null);
	const empK2Ref = useRef<HTMLInputElement>(null);
	const empK5Ref = useRef<HTMLInputElement>(null);
	const empD8Ref = useRef<HTMLInputElement>(null);

	const [isDisabled, setIsDisabled] = useState(false);

	// TEAMLEADERS STATES AND DATA

	const [teamleadersArray, setTeamleadersArray] = useState<Employee[]>([]);
	const [optionalTeamleadersArray, setOptionalTeamleadersArray] = useState<Employee[]>(
		[],
	);
	const [teamleadersShiftsDemand, setTeamleadersShiftsDemand] =
		useState<EmployeesShiftsDemand>({
			total12hNeeded: 0,
			totalHoursNeeded: 0,
			total10hNeeded: 0,
			total8hNeeded: 0,
		});
	const [needTlOption, setNeedTlOption] = useState(false);

	const teamleadersTotalHoursNeeded = teamleadersShiftsDemand.totalHoursNeeded;
	let teamleaderslTotalAvailableHours = getTotalHours(teamleadersArray);
	let teamleadersOptionalAvailableHours = getTotalHours(optionalTeamleadersArray);
	const teamleadersShiftsAvailability = getShiftsAvailability(teamleadersArray);
	const teamleadersOptionalShiftsAvailability = getShiftsAvailability(
		optionalTeamleadersArray,
	);

	// OTHER EMPLOYEES STATES AND DATA

	const [employeesArray, setEmployeesArray] = useState<Employee[]>([]);
	const [optionalEmployeesArray, setOptionalEmployeesArray] = useState<Employee[]>([]);
	const [employeesShiftsDemand, setEmployeesShiftsDemand] =
		useState<EmployeesShiftsDemand>({
			total12hNeeded: 0,
			totalHoursNeeded: 0,
			total10hNeeded: 0,
			total8hNeeded: 0,
		});
	const [totalShiftsDemand, setTotalShiftsDemand] = useState<ShiftsData>({
		d12: 0,
		n12: 0,
		k1: 0,
		k2: 0,
		d8: 0,
		k5: 0,
	});
	const [needEmpOption, setNeedEmpOption] = useState(false);

	const employeesTotalHoursNeeded = employeesShiftsDemand.totalHoursNeeded;
	let employeesTotalAvailableHours = getTotalHours(employeesArray);
	let employeesOptionalAvailableHours = getTotalHours(optionalEmployeesArray);
	const employeesShiftsAvailability = getShiftsAvailability(employeesArray);
	const employeesOptionalShiftsAvailability =
		getShiftsAvailability(optionalEmployeesArray);

	// FORM HANDLING

	const handleShifts = (event: FormEvent) => {
		event.preventDefault();
		setIsDisabled(true);
		setNeedTlOption(false);
		setNeedEmpOption(false);

		if (!hoursRef.current?.value) return;
		if (!daysRef.current?.value) return;
		if (!teamleadersCountRef.current?.value) return;
		if (!employeesCountRef.current?.value) return;
		if (!tlD12Ref.current?.value) return;
		if (!tlN12Ref.current?.value) return;
		if (!tlK1Ref.current?.value) return;
		if (!tlK2Ref.current?.value) return;
		if (!tlK5Ref.current?.value) return;
		if (!tlD8Ref.current?.value) return;
		if (!empD12Ref.current?.value) return;
		if (!empN12Ref.current?.value) return;
		if (!empK1Ref.current?.value) return;
		if (!empK2Ref.current?.value) return;
		if (!empK5Ref.current?.value) return;
		if (!empD8Ref.current?.value) return;

		setTotalShiftsDemand({
			d12: +tlD12Ref.current.value + +empD12Ref.current.value,
			n12: +tlN12Ref.current.value + +empN12Ref.current.value,
			k1: +tlK1Ref.current.value + +empK1Ref.current.value,
			k2: +tlK2Ref.current.value + +empK2Ref.current.value,
			k5: +tlK5Ref.current.value + +empK5Ref.current.value,
			d8: +tlD8Ref.current.value + +empD8Ref.current.value,
		});

		// TEAMLEADERS DATA

		const tlShiftsData: InitialEmployeeData = {
			name: TEAMLEADER,
			count: +teamleadersCountRef.current.value,
			monthHours: +hoursRef.current.value,
			monthDays: +daysRef.current.value,
			d12: +tlD12Ref.current.value,
			n12: +tlN12Ref.current.value,
			k1: +tlK1Ref.current.value,
			k2: +tlK2Ref.current.value,
			k5: +tlK5Ref.current.value,
			d8: +tlD8Ref.current.value,
		};

		const teamleadersDemandData = getShifsDemand(tlShiftsData);
		setTeamleadersShiftsDemand(teamleadersDemandData);

		const bolierplateTeamleadersArray = createBoilerplateEmployeeArray(
			tlShiftsData.count,
			tlShiftsData.name,
			tlShiftsData.monthHours,
		);
		const teamleadersArrayWithShifts = distributeShifts(
			bolierplateTeamleadersArray,
			teamleadersDemandData,
		);
		setTeamleadersArray(teamleadersArrayWithShifts);

		const teamleadersShiftsAvailability = getShiftsAvailability(
			teamleadersArrayWithShifts,
		);

		const tlHours = getTotalHours(teamleadersArrayWithShifts);

		if (tlHours < teamleadersDemandData.totalHoursNeeded) {
			const { demand, availability, areShiftsCovered } = checkIfShiftsAreCovered(
				teamleadersDemandData,
				teamleadersShiftsAvailability,
			);

			if (!areShiftsCovered) {
				const updatedArray = getOptionalEmployeesArray(
					teamleadersArrayWithShifts,
					demand,
					availability,
				);
				setOptionalTeamleadersArray(updatedArray);
				setNeedTlOption(true);
			}
		}

		// EMPLOYEES DATA

		const empShiftsData: InitialEmployeeData = {
			name: REGULAR_EMPLOYEE,
			count: +employeesCountRef.current.value,
			monthHours: +hoursRef.current.value,
			monthDays: +daysRef.current.value,
			d12: +empD12Ref.current.value,
			n12: +empN12Ref.current.value,
			k1: +empK1Ref.current.value,
			k2: +empK2Ref.current.value,
			k5: +empK5Ref.current.value,
			d8: +empD8Ref.current.value,
		};

		const employeesDemandData = getShifsDemand(empShiftsData);
		setEmployeesShiftsDemand(employeesDemandData);

		const boilerplateEmployeesArray = createBoilerplateEmployeeArray(
			empShiftsData.count,
			empShiftsData.name,
			empShiftsData.monthHours,
		);
		const employeesArrayWithShifts = distributeShifts(
			boilerplateEmployeesArray,
			employeesDemandData,
		);
		setEmployeesArray(employeesArrayWithShifts);

		const employeesShiftsAvailability = getShiftsAvailability(employeesArrayWithShifts);

		const empHours = getTotalHours(employeesArrayWithShifts);

		if (empHours < employeesDemandData.totalHoursNeeded) {
			const { demand, availability, areShiftsCovered } = checkIfShiftsAreCovered(
				employeesDemandData,
				employeesShiftsAvailability,
			);

			if (!areShiftsCovered) {
				const updatedArray = getOptionalEmployeesArray(
					employeesArrayWithShifts,
					demand,
					availability,
				);
				setOptionalEmployeesArray(updatedArray);
				setNeedEmpOption(true);
			}
		}
	};

	const changeLeaveHours = (id: string, hours: number) => {
		const activeTeamleaders = needTlOption ? optionalTeamleadersArray : teamleadersArray;
		const activeEmployees = needEmpOption ? optionalEmployeesArray : employeesArray;

		const checkTeamleaders = activeTeamleaders.find((employee) => employee.id === id);
		const checkEmployees = activeEmployees.find((employee) => employee.id === id);

		const activeEmployeesArray = checkTeamleaders
			? activeTeamleaders
			: checkEmployees
			? activeEmployees
			: null;

		const activeShiftsDemand = checkTeamleaders
			? teamleadersShiftsDemand
			: employeesShiftsDemand;

		const activeShiftsAvailability = checkTeamleaders
			? teamleadersShiftsAvailability
			: employeesShiftsAvailability;

		if (!activeEmployeesArray) return;

		const monthHours = +hoursRef.current!.value;

		const newArray = activeEmployeesArray.map((employee) => {
			const overtime = employee.shifts.over;
			const leave = employee.shifts.leave;
			if (id === employee.id) {
				return {
					...employee,
					hours: monthHours - hours + overtime,
					availableHours: monthHours - hours + overtime,
					shifts: {
						...employee.shifts,
						leave: hours,
						'12h': 0,
						'10h': 0,
						'8h': 0,
						add: 0,
					},
				};
			}
			return {
				...employee,
				hours: monthHours - leave + overtime,
				availableHours: monthHours - leave + overtime,
				shifts: {
					...employee.shifts,
					'10h': 0,
					'12h': 0,
					'8h': 0,
					add: 0,
				},
			};
		});

		let updatedArray = distributeShifts(newArray, activeShiftsDemand);
		if (needTlOption || needEmpOption) {
			const { demand, availability } = checkIfShiftsAreCovered(
				activeShiftsDemand,
				activeShiftsAvailability,
			);
			updatedArray = getOptionalEmployeesArray(updatedArray, demand, availability);
		}
		checkTeamleaders
			? needTlOption
				? setOptionalTeamleadersArray(updatedArray)
				: setTeamleadersArray(updatedArray)
			: needEmpOption
			? setOptionalEmployeesArray(updatedArray)
			: setEmployeesArray(updatedArray);

		const totalHours = getTotalHours(updatedArray);
		checkTeamleaders
			? (teamleadersOptionalAvailableHours = totalHours)
			: (employeesOptionalAvailableHours = totalHours);
	};

	const changeOvertimeHours = (id: string, hours: number) => {
		const activeTeamleaders = needTlOption ? optionalTeamleadersArray : teamleadersArray;
		const activeEmployees = needEmpOption ? optionalEmployeesArray : employeesArray;

		const checkTeamleaders = activeTeamleaders.find((employee) => employee.id === id);
		const checkEmployees = activeEmployees.find((employee) => employee.id === id);

		const activeEmployeesArray = checkTeamleaders
			? activeTeamleaders
			: checkEmployees
			? activeEmployees
			: null;

		const activeShiftsDemand = checkTeamleaders
			? teamleadersShiftsDemand
			: employeesShiftsDemand;

		if (!activeEmployeesArray) return;

		const monthHours = +hoursRef.current!.value;

		const newArray = activeEmployeesArray.map((employee) => {
			const overtime = employee.shifts.over;
			const leave = employee.shifts.leave;
			if (id === employee.id) {
				return {
					...employee,
					hours: monthHours - leave + hours,
					availableHours: monthHours - leave + hours,
					shifts: {
						...employee.shifts,
						over: hours,
						'12h': 0,
						'10h': 0,
						'8h': 0,
						add: 0,
					},
				};
			}
			return {
				...employee,
				hours: monthHours - leave + overtime,
				availableHours: monthHours - leave + overtime,
				shifts: {
					...employee.shifts,
					'10h': 0,
					'12h': 0,
					'8h': 0,
					add: 0,
				},
			};
		});

		const updatedArray = distributeShifts(newArray, activeShiftsDemand);
		checkTeamleaders
			? needTlOption
				? setOptionalTeamleadersArray(updatedArray)
				: setTeamleadersArray(updatedArray)
			: needEmpOption
			? setOptionalEmployeesArray(updatedArray)
			: setEmployeesArray(updatedArray);
	};

	return (
		<div className="main">
			<div style={{ padding: '1rem' }}></div>
			<div className="data-container">
				<form className="form-container" onSubmit={handleShifts}>
					<div className="form-data">
						<div className="data-column">
							<p>dane:</p>
							<label htmlFor="hours">Godziny pracy:</label>
							<input
								type="number"
								id="hours"
								required
								ref={hoursRef}
								disabled={isDisabled}
							/>
							<label htmlFor="days">Dni w miesiącu:</label>
							<input type="number" id="days" required ref={daysRef} />
							<label htmlFor="teamleaders">Teamleaderzy:</label>
							<input
								type="number"
								id="teamleaders"
								required
								ref={teamleadersCountRef}
								max={99}
								maxLength={2}
							/>
							<label htmlFor="employees">Pozostali:</label>
							<input
								type="number"
								id="employees"
								required
								ref={employeesCountRef}
								max={99}
								maxLength={2}
							/>
						</div>
						<div className="data-column">
							<p>Teamleaderzy:</p>
							<label htmlFor="tlD12psary">D12</label>
							<input
								type="number"
								id="tlD12psary"
								min={0}
								defaultValue={1}
								required
								ref={tlD12Ref}
							/>
							<label htmlFor="tlN12psary">N12</label>
							<input
								type="number"
								id="tlN12psary"
								min={0}
								defaultValue={1}
								required
								ref={tlN12Ref}
							/>
							<label htmlFor="tlK1ktw">K1</label>
							<input
								type="number"
								id="tlK1ktw"
								min={0}
								defaultValue={1}
								required
								ref={tlK1Ref}
							/>
							<label htmlFor="tlK2ktw">K2</label>
							<input
								type="number"
								id="tlK2ktw"
								min={0}
								defaultValue={0}
								required
								ref={tlK2Ref}
							/>

							<label htmlFor="tlK5ktw">K5</label>
							<input
								type="number"
								id="tlK5ktw"
								min={0}
								defaultValue={0}
								required
								ref={tlK5Ref}
							/>

							<label htmlFor="tlD8ktw">D8</label>
							<input
								type="number"
								id="tlD8ktw"
								min={0}
								defaultValue={0}
								required
								ref={tlD8Ref}
							/>
						</div>
						<div className="data-column">
							<p>Pozostali:</p>
							<label htmlFor="empD12psary">D12</label>
							<input
								type="number"
								id="empD12psary"
								min={0}
								defaultValue={4}
								required
								ref={empD12Ref}
							/>
							<label htmlFor="empN12psary">N12</label>
							<input
								type="number"
								id="empN12psary"
								min={0}
								defaultValue={1}
								required
								ref={empN12Ref}
							/>
							<label htmlFor="empK1ktw">K1</label>
							<input
								type="number"
								id="empK1ktw"
								min={0}
								defaultValue={5}
								required
								ref={empK1Ref}
							/>
							<label htmlFor="empK2ktw">K2</label>
							<input
								type="number"
								id="empK2ktw"
								min={0}
								defaultValue={2}
								required
								ref={empK2Ref}
							/>
							<label htmlFor="empK5ktw">K5</label>
							<input
								type="number"
								id="empK5ktw"
								min={0}
								defaultValue={0}
								required
								ref={empK5Ref}
							/>
							<label htmlFor="empD8ktw">D8</label>
							<input
								type="number"
								id="empD8ktw"
								min={0}
								defaultValue={0}
								required
								ref={empD8Ref}
							/>
						</div>
						<div className="data-column">
							<p>total:</p>
							<p className="summary-title">d12</p>
							<p className="summary">{totalShiftsDemand.d12}</p>
							<p className="summary-title">n12</p>
							<p className="summary">{totalShiftsDemand.n12}</p>
							<p className="summary-title">k1</p>
							<p className="summary">{totalShiftsDemand.k1}</p>
							<p className="summary-title">k2</p>
							<p className="summary">{totalShiftsDemand.k2}</p>
							<p className="summary-title">k5</p>
							<p className="summary">{totalShiftsDemand.k5}</p>
							<p className="summary-title">d8</p>
							<p className="summary">{totalShiftsDemand.d8}</p>
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
								<td>12h</td>
								<td>10h</td>
								<td>8h</td>
								<td>reszta h</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>zapotrzebowanie</td>
								<td>{teamleadersTotalHoursNeeded}</td>
								<td>
									{teamleadersShiftsDemand ? teamleadersShiftsDemand.total12hNeeded : 0}
								</td>
								<td>
									{teamleadersShiftsDemand ? teamleadersShiftsDemand.total10hNeeded : 0}
								</td>
								<td>
									{teamleadersShiftsDemand ? teamleadersShiftsDemand.total8hNeeded : 0}
								</td>
								<td>x</td>
							</tr>
							<tr>
								<td>dostępne</td>
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleaderslTotalAvailableHours}
								</td>
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleadersShiftsAvailability
										? teamleadersShiftsAvailability['12h']
										: 0}
								</td>
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleadersShiftsAvailability
										? teamleadersShiftsAvailability['10h']
										: 0}
								</td>
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleadersShiftsAvailability
										? teamleadersShiftsAvailability['8h']
										: 0}
								</td>
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleadersShiftsAvailability ? teamleadersShiftsAvailability.add : 0}
								</td>
							</tr>
							{needTlOption ? (
								<tr>
									<td>opcja</td>
									<td className="solution">{teamleadersOptionalAvailableHours}</td>
									<td className="solution">
										{teamleadersOptionalShiftsAvailability
											? teamleadersOptionalShiftsAvailability['12h']
											: 0}
									</td>
									<td className="solution">
										{teamleadersOptionalShiftsAvailability
											? teamleadersOptionalShiftsAvailability['10h']
											: 0}
									</td>
									<td className="solution">
										{teamleadersOptionalShiftsAvailability
											? teamleadersOptionalShiftsAvailability['8h']
											: 0}
									</td>
									<td className="solution">
										{teamleadersOptionalShiftsAvailability
											? teamleadersOptionalShiftsAvailability.add
											: 0}
									</td>
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
								<td>12h</td>
								<td>10h</td>
								<td>8h</td>
								<td>reszta h</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>zapotrzebowanie</td>
								<td>{employeesTotalHoursNeeded}</td>
								<td>
									{employeesShiftsDemand ? employeesShiftsDemand.total12hNeeded : 0}
								</td>
								<td>
									{employeesShiftsDemand ? employeesShiftsDemand.total10hNeeded : 0}
								</td>
								<td>{employeesShiftsDemand ? employeesShiftsDemand.total8hNeeded : 0}</td>
								<td>x</td>
							</tr>
							<tr>
								<td>dostępne</td>
								<td style={needEmpOption ? { color: '#c27' } : {}}>
									{employeesTotalAvailableHours}
								</td>
								<td style={needEmpOption ? { color: '#c27' } : {}}>
									{employeesShiftsAvailability ? employeesShiftsAvailability['12h'] : 0}
								</td>
								<td style={needEmpOption ? { color: '#c27' } : {}}>
									{employeesShiftsAvailability ? employeesShiftsAvailability['10h'] : 0}
								</td>
								<td style={needEmpOption ? { color: '#c27' } : {}}>
									{employeesShiftsAvailability ? employeesShiftsAvailability['8h'] : 0}
								</td>
								<td style={needEmpOption ? { color: '#c27' } : {}}>
									{employeesShiftsAvailability ? employeesShiftsAvailability.add : 0}
								</td>
							</tr>
							{needEmpOption ? (
								<tr>
									<td>opcja</td>
									<td className="solution">{employeesOptionalAvailableHours}</td>
									<td className="solution">
										{employeesOptionalShiftsAvailability
											? employeesOptionalShiftsAvailability['12h']
											: 0}
									</td>
									<td className="solution">
										{employeesOptionalShiftsAvailability
											? employeesOptionalShiftsAvailability['10h']
											: 0}
									</td>
									<td className="solution">
										{employeesOptionalShiftsAvailability
											? employeesOptionalShiftsAvailability['8h']
											: 0}
									</td>
									<td className="solution">
										{employeesOptionalShiftsAvailability
											? employeesOptionalShiftsAvailability.add
											: 0}
									</td>
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
							<td>12h</td>
							<td>10h</td>
							<td>8h</td>
							<td>reszta</td>
							<td>dostępne</td>
							<td>wolne</td>
							<td>nadgodziny</td>
						</tr>
					</thead>
					<tbody>
						{needTlOption &&
						optionalTeamleadersArray &&
						optionalTeamleadersArray.length > 0
							? optionalTeamleadersArray.map((teamleader) => (
									<tr key={teamleader.id}>
										<td>{teamleader.name}</td>
										<td className="optional">{teamleader.shifts['12h']}</td>
										<td className="optional">{teamleader.shifts['10h']}</td>
										<td className="optional">{teamleader.shifts['8h']}</td>
										<td className="optional">{teamleader.shifts.add + ' h'}</td>
										<td>
											{teamleader.availableHours} ({teamleader.hours})
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={teamleader.shifts.leave}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) => changeLeaveHours(teamleader.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={teamleader.shifts.over}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) =>
													changeOvertimeHours(teamleader.id, +e.target.value)
												}
											/>
										</td>
									</tr>
							  ))
							: teamleadersArray && teamleadersArray.length > 0
							? teamleadersArray.map((teamleader) => (
									<tr key={teamleader.id}>
										<td>{teamleader.name}</td>
										<td>{teamleader.shifts['12h']}</td>
										<td>{teamleader.shifts['10h']}</td>
										<td>{teamleader.shifts['8h']}</td>
										<td>{teamleader.shifts.add}</td>
										<td>
											{teamleader.availableHours} ({teamleader.hours})
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={teamleader.shifts.leave}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) => changeLeaveHours(teamleader.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={teamleader.shifts.over}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) =>
													changeOvertimeHours(teamleader.id, +e.target.value)
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
							<td>12h</td>
							<td>10h</td>
							<td>8h</td>
							<td>reszta</td>
							<td>dostępne</td>
							<td>wolne</td>
							<td>nadgodziny</td>
						</tr>
					</thead>
					<tbody>
						{needEmpOption && optionalEmployeesArray && optionalEmployeesArray.length > 0
							? optionalEmployeesArray.map((employee) => (
									<tr key={employee.id}>
										<td>{employee.name}</td>
										<td className="optional">{employee.shifts['12h']}</td>
										<td className="optional">{employee.shifts['10h']}</td>
										<td className="optional">{employee.shifts['8h']}</td>
										<td className="optional">{employee.shifts.add}</td>
										<td>
											{employee.availableHours} ({employee.hours})
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.shifts.leave}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) => changeLeaveHours(employee.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.shifts.over}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) =>
													changeOvertimeHours(employee.id, +e.target.value)
												}
											/>
										</td>
									</tr>
							  ))
							: employeesArray && employeesArray.length > 0
							? employeesArray.map((employee) => (
									<tr key={employee.id}>
										<td>{employee.name}</td>
										<td>{employee.shifts['12h']}</td>
										<td>{employee.shifts['10h']}</td>
										<td>{employee.shifts['8h']}</td>
										<td>{employee.shifts.add}</td>
										<td>
											{employee.availableHours} ({employee.hours})
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.shifts.leave}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) => changeLeaveHours(employee.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.shifts.over}
												min={0}
												maxLength={3}
												max={999}
												step={1}
												onChange={(e) =>
													changeOvertimeHours(employee.id, +e.target.value)
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
