import { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';

import { Employee, Shift, EmployeesShiftsDemand } from '../types/types';
import {
	getMax12hShifts,
	createEmployeesArray,
	getTotalHours,
	calculateShiftsDemand,
	calculateShiftsAvailability,
	getTotalNumberOfShifts,
	adjustShifts,
	calculateAvailableHoursFor12hShiftsOnly,
} from '../utils/calcs';

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

	const [optionalTeamleadersArray, setOptionalTeamleadersArray] = useState<Employee[]>();
	const [optionalEmployeesArray, setOptionalEmployeesArray] = useState<Employee[]>();

	const [totalShiftsDemand, setTotalShiftsDemand] = useState<{
		d12: number;
		n12: number;
		k1: number;
		k2: number;
		k5: number;
		d8: number;
	}>({ d12: 0, n12: 0, k1: 0, k2: 0, k5: 0, d8: 0 });

	const tlD12Ref = useRef<HTMLInputElement>(null);
	const tlN12Ref = useRef<HTMLInputElement>(null);
	const tlK5Ref = useRef<HTMLInputElement>(null);
	const tlD8Ref = useRef<HTMLInputElement>(null);
	const tlK1Ref = useRef<HTMLInputElement>(null);
	const tlK2Ref = useRef<HTMLInputElement>(null);
	const empD12Ref = useRef<HTMLInputElement>(null);
	const empN12Ref = useRef<HTMLInputElement>(null);
	const empK5Ref = useRef<HTMLInputElement>(null);
	const empD8Ref = useRef<HTMLInputElement>(null);
	const empK1Ref = useRef<HTMLInputElement>(null);
	const empK2Ref = useRef<HTMLInputElement>(null);

	const [employeesShiftsDemandArray, setEmployeesShiftsDemandArray] =
		useState<EmployeesShiftsDemand>();
	const [teamleadersShiftsDemandArray, setTeamleadersShiftsDemandArray] =
		useState<EmployeesShiftsDemand>();

	const [teamleadersShiftsAvailability, setTeamleadersShiftsAvailability] =
		useState<Shift>();
	const [
		teamleadersOptionalShiftsAvailability,
		setTeamleadersOptionalShiftsAvailability,
	] = useState<Shift>();
	const [employeesShiftsAvailability, setEmployeesShiftsAvailability] = useState<Shift>();

	const [employeesOptionalShiftsAvailability, setEmployeesOptionalShiftsAvailability] =
		useState<Shift>();

	useEffect(() => {
		if (!teamleadersShiftsDemandArray || !teamleadersShiftsAvailability) return;
		const teamleaderShiftsDemand = teamleadersShiftsDemandArray.total12hNeeded;
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
		if (!tlK5Ref.current?.value) return;
		if (!tlD8Ref.current?.value) return;
		if (!empD12Ref.current?.value) return;
		if (!empN12Ref.current?.value) return;
		if (!empK1Ref.current?.value) return;
		if (!empK2Ref.current?.value) return;
		if (!empK5Ref.current?.value) return;
		if (!empD8Ref.current?.value) return;
		if (!daysRef.current?.value) return;

		const hours = +hoursRef.current.value;
		const numberOfTeamleaders = +teamleadersCountRef.current.value;
		const numberOfEmployees = +employeesCountRef.current.value;

		// TEAMLEADERS DATA:

		setNeedTlOption(false);

		const teamleaders = createEmployeesArray(
			'teamleader',
			hours,
			hours,
			numberOfTeamleaders,
		);
		setTeamleadersArray(teamleaders);

		const tlShiftsAvailability = calculateShiftsAvailability(teamleaders);
		setTeamleadersShiftsAvailability(tlShiftsAvailability);
		setTeamleadersTotalHours(getTotalHours(teamleaders));

		const teamleadersShiftsData = {
			d12: +tlD12Ref.current.value,
			n12: +tlN12Ref.current.value,
			k1: +tlK1Ref.current.value,
			k2: +tlK2Ref.current.value,
			k5: +tlK5Ref.current.value,
			d8: +tlD8Ref.current.value,
		};

		const teamleadersShiftsDemand = calculateShiftsDemand(
			teamleadersShiftsData,
			+daysRef.current.value,
		);

		setTeamleadersShiftsDemandArray(teamleadersShiftsDemand);

		if (tlShiftsAvailability['12h'] < teamleadersShiftsDemand.total12hNeeded) {
			setNeedTlOption(true);
			const optionalShifts = adjustShifts(
				teamleadersShiftsDemand.total12hNeeded,
				teamleaders,
			);
			const optionalShiftsTotal = getTotalNumberOfShifts(optionalShifts);
			setTeamleadersOptionalShiftsAvailability(optionalShiftsTotal);
			setOptionalTeamleadersArray(optionalShifts);
		}

		// EMPLOYEES DATA:
		setNeedEmpOption(false);

		const employees = createEmployeesArray('pracownik', hours, hours, numberOfEmployees);
		setEmployeesArray(employees);

		const employeesShiftsData = {
			d12: +empD12Ref.current.value,
			n12: +empN12Ref.current.value,
			k1: +empK1Ref.current.value,
			k2: +empK2Ref.current.value,
			k5: +empK5Ref.current.value,
			d8: +empD8Ref.current.value,
		};

		const employeesShiftsDemand = calculateShiftsDemand(
			employeesShiftsData,
			+daysRef.current.value,
		);

		const adjustEmployeesHoursSubtractingNon12hShifts =
			calculateAvailableHoursFor12hShiftsOnly(employees, employeesShiftsDemand);

		setEmployeesArray(adjustEmployeesHoursSubtractingNon12hShifts);

		console.log(adjustEmployeesHoursSubtractingNon12hShifts);

		const empShiftsAvailability = calculateShiftsAvailability(
			adjustEmployeesHoursSubtractingNon12hShifts,
		);
		setEmployeesShiftsAvailability(empShiftsAvailability);
		setEmployeesTotalHours(getTotalHours(adjustEmployeesHoursSubtractingNon12hShifts));

		setTotalShiftsDemand({
			d12: teamleadersShiftsData.d12 + employeesShiftsData.d12,
			n12: teamleadersShiftsData.n12 + employeesShiftsData.n12,
			k1: teamleadersShiftsData.k1 + employeesShiftsData.k1,
			k2: teamleadersShiftsData.k2 + employeesShiftsData.k2,
			k5: teamleadersShiftsData.k5 + employeesShiftsData.k5,
			d8: teamleadersShiftsData.d8 + employeesShiftsData.d8,
		});

		setEmployeesShiftsDemandArray(employeesShiftsDemand);

		if (empShiftsAvailability['12h'] < employeesShiftsDemand.total12hNeeded) {
			setNeedEmpOption(true);
			const optionalShifts = adjustShifts(
				employeesShiftsDemand.total12hNeeded,
				adjustEmployeesHoursSubtractingNon12hShifts,
			);
			const optionalShiftsTotal = getTotalNumberOfShifts(optionalShifts);
			setEmployeesOptionalShiftsAvailability(optionalShiftsTotal);
			setOptionalEmployeesArray(optionalShifts);
		}
	};

	const handleShifts = (e: FormEvent) => {
		e.preventDefault();
		setOptionalEmployeesArray([]);
		setOptionalTeamleadersArray([]);
		calculateAndSetTeamleadersData();
	};

	const changeEmployeesHours = (id: string, hours: number) => {
		const newEmployeesArray = employeesArray.map((employee) => {
			if (employee.id !== id) return employee;
			const changeValue = hours;
			return {
				...employee,
				hours: changeValue,
				hoursFor12hShifts: employee.hoursFor12hShifts,
				shifts: getMax12hShifts(employee.hoursFor12hShifts, employee),
			};
		});
		setEmployeesArray(newEmployeesArray);
		setEmployeesTotalHours(getTotalHours(newEmployeesArray));

		const newShiftsAvailability = calculateShiftsAvailability(newEmployeesArray);
		setEmployeesShiftsAvailability(newShiftsAvailability);

		const shiftsDemand = employeesShiftsDemandArray!.total12hNeeded;

		if (newShiftsAvailability['12h'] < shiftsDemand) {
			setNeedEmpOption(true);
			const optionalShifts = adjustShifts(shiftsDemand, newEmployeesArray);
			const optionalShiftsTotal = getTotalNumberOfShifts(optionalShifts);
			setOptionalEmployeesArray(optionalShifts);
			setEmployeesOptionalShiftsAvailability(optionalShiftsTotal);
			return;
		}
		setNeedEmpOption(false);
		setOptionalEmployeesArray([]);
	};

	const changeTeamleaderHours = (id: string, hours: number) => {
		const newTeamleadersArray = teamleadersArray.map((teamleader) => {
			const newShifts = getMax12hShifts(teamleader.hoursFor12hShifts, teamleader);

			if (teamleader.id !== id) return teamleader;
			return { ...teamleader, hours: hours, shifts: newShifts };
		});
		setTeamleadersArray(newTeamleadersArray);
		setTeamleadersTotalHours(getTotalHours(newTeamleadersArray));

		const newShiftsAvailability = calculateShiftsAvailability(newTeamleadersArray);
		setTeamleadersShiftsAvailability(newShiftsAvailability);

		const shiftsDemand = teamleadersShiftsDemandArray!.total12hNeeded;

		if (newShiftsAvailability['12h'] < shiftsDemand) {
			setNeedTlOption(true);
			const optionalShifts = adjustShifts(shiftsDemand, newTeamleadersArray);
			const optionalShiftsTotal = getTotalNumberOfShifts(optionalShifts);
			setOptionalTeamleadersArray(optionalShifts);
			setTeamleadersOptionalShiftsAvailability(optionalShiftsTotal);
			return;
		}
		setNeedTlOption(false);
		setOptionalTeamleadersArray([]);
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

							<label htmlFor="tlK5ktw">K5</label>
							<input type="number" id="tlK5ktw" defaultValue={0} required ref={tlK5Ref} />

							<label htmlFor="tlD8ktw">D8</label>
							<input type="number" id="tlD8ktw" defaultValue={0} required ref={tlD8Ref} />
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
							<label htmlFor="empK5ktw">K5</label>
							<input
								type="number"
								id="empK5ktw"
								defaultValue={0}
								required
								ref={empK5Ref}
							/>
							<label htmlFor="empD8ktw">D8</label>
							<input
								type="number"
								id="empD8ktw"
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
								<td>niewykorzystane h</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>zapotrzebowanie</td>
								<td>
									{teamleadersShiftsDemandArray
										? teamleadersShiftsDemandArray.totalHoursNeeded
										: 0}
								</td>
								<td>
									{teamleadersShiftsDemandArray
										? teamleadersShiftsDemandArray.total12hNeeded
										: 0}
								</td>
								<td>
									{teamleadersShiftsDemandArray
										? teamleadersShiftsDemandArray.total10hNeeded
										: 0}
								</td>
								<td>
									{teamleadersShiftsDemandArray
										? teamleadersShiftsDemandArray.total8hNeeded
										: 0}
								</td>
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
								<td style={needTlOption ? { color: '#c27' } : {}}>
									{teamleadersShiftsAvailability
										? teamleadersShiftsAvailability['10h']
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
									<td className="solution">{teamleadersTotalHours}</td>
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
								<td>niewykorzystane h</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>zapotrzebowanie</td>
								<td>
									{employeesShiftsDemandArray
										? employeesShiftsDemandArray.totalHoursNeeded
										: 0}
								</td>
								<td>
									{employeesShiftsDemandArray
										? employeesShiftsDemandArray.total12hNeeded
										: 0}
								</td>
								<td>
									{employeesShiftsDemandArray
										? employeesShiftsDemandArray.total10hNeeded
										: 0}
								</td>
								<td>
									{employeesShiftsDemandArray
										? employeesShiftsDemandArray.total8hNeeded
										: 0}
								</td>
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
									{employeesShiftsAvailability ? employeesShiftsAvailability['10h'] : 0}
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
									<td className="solution">{employeesTotalHours}</td>
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
							<td>Nieprzydzielone</td>
							<td>godziny pracy</td>
						</tr>
					</thead>
					<tbody>
						{optionalTeamleadersArray && optionalTeamleadersArray.length > 0
							? optionalTeamleadersArray.map((teamleader) => (
									<tr key={teamleader.id}>
										<td>{teamleader.name}</td>
										<td className="optional">{teamleader.shifts['12h']}</td>
										<td className="optional">{teamleader.shifts['10h']}</td>
										<td className="optional">{teamleader.shifts['8h']}</td>
										<td className="optional">{teamleader.shifts.add + ' h'}</td>
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
							: teamleadersArray.length > 0
							? teamleadersArray.map((teamleader) => (
									<tr key={teamleader.id}>
										<td>{teamleader.name}</td>
										<td>{teamleader.shifts['12h']}</td>
										<td>{teamleader.shifts['10h']}</td>
										<td>{teamleader.shifts['8h']}</td>
										<td>{teamleader.shifts.add}</td>
										<td>
											<input
												type="number"
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
							<td>12h</td>
							<td>10h</td>
							<td>8h</td>
							<td>Nieprzydzielone</td>
							<td>godziny pracy</td>
						</tr>
					</thead>
					<tbody>
						{optionalEmployeesArray && optionalEmployeesArray.length > 0
							? optionalEmployeesArray.map((employee) => (
									<tr key={employee.id}>
										<td>{employee.name}</td>
										<td className="optional">{employee.shifts['12h']}</td>
										<td className="optional">{employee.shifts['10h']}</td>
										<td className="optional">{employee.shifts['8h']}</td>
										<td className="optional">{employee.shifts.add}</td>
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
							: employeesArray.length > 0
							? employeesArray.map((employee) => (
									<tr key={employee.id}>
										<td>{employee.name}</td>
										<td>{employee.shifts['12h']}</td>
										<td>{employee.shifts['10h']}</td>
										<td>{employee.shifts['8h']}</td>
										<td>{employee.shifts.add}</td>
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
