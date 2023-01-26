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
	getOptionalEmployeesArray,
	updateEmployeeShifts,
	createEmployeeArray,
} from '../utils/calcs';

const TEAMLEADER = 'teamleader';
const REGULAR_EMPLOYEE = 'pracownik';

function App() {
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

	const [teamleadersArray, setTeamleadersArray] = useState<Employee[]>([]);
	const [optionalTeamleadersArray, setOptionalTeamleadersArray] = useState<Employee[]>(
		[],
	);
	const [employeesArray, setEmployeesArray] = useState<Employee[]>([]);
	const [optionalEmployeesArray, setOptionalEmployeesArray] = useState<Employee[]>([]);

	const [totalShiftsDemand, setTotalShiftsDemand] = useState<ShiftsData>({
		d12: 0,
		n12: 0,
		k1: 0,
		k2: 0,
		d8: 0,
		k5: 0,
	});
	const [teamleadersShiftsDemand, setTeamleadersShiftsDemand] =
		useState<EmployeesShiftsDemand>({
			total12hNeeded: 0,
			totalHoursNeeded: 0,
			total10hNeeded: 0,
			total8hNeeded: 0,
		});
	const [employeesShiftsDemand, setEmployeesShiftsDemand] =
		useState<EmployeesShiftsDemand>({
			total12hNeeded: 0,
			totalHoursNeeded: 0,
			total10hNeeded: 0,
			total8hNeeded: 0,
		});
	const [isDisabled, setIsDisabled] = useState(false);
	const [needTlOption, setNeedTlOption] = useState(false);
	const [needEmpOption, setNeedEmpOption] = useState(false);

	const teamleadersTotalHoursNeeded = teamleadersShiftsDemand.totalHoursNeeded;
	const employeesTotalHoursNeeded = employeesShiftsDemand.totalHoursNeeded;

	const teamleadersTotalShiftsNeeded =
		teamleadersShiftsDemand.total12hNeeded +
		teamleadersShiftsDemand.total10hNeeded +
		teamleadersShiftsDemand.total8hNeeded;
	const employeesTotalShiftsNeeded =
		employeesShiftsDemand.total12hNeeded +
		employeesShiftsDemand.total10hNeeded +
		employeesShiftsDemand.total8hNeeded;

	const manageDisabled = () => {};

	const tlTotalHours = getTotalHours(teamleadersArray);

	const teamleadersShiftsAvailability = getShiftsAvailability(teamleadersArray);
	const teamleadersOptionalShiftsAvailability = getShiftsAvailability(
		optionalTeamleadersArray,
	);

	const empTotalHours = getTotalHours(employeesArray);

	const employeesShiftsAvailability = getShiftsAvailability(employeesArray);
	const employeesOptionalShiftsAvailability =
		getShiftsAvailability(optionalEmployeesArray);

	const teamleadersTotalShiftsAvailable =
		teamleadersShiftsDemand.total12hNeeded +
		teamleadersShiftsDemand.total10hNeeded +
		teamleadersShiftsDemand.total8hNeeded;
	const employeesTotalShiftsAvailable =
		employeesShiftsDemand.total12hNeeded +
		employeesShiftsDemand.total10hNeeded +
		employeesShiftsDemand.total8hNeeded;

	const handleShifts = (event: FormEvent) => {
		event.preventDefault();

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

		const tlDemandData = getShifsDemand(tlShiftsData);
		setTeamleadersShiftsDemand(tlDemandData);

		const teamleadersWithAllShifts = createEmployeeArray(tlShiftsData, tlDemandData);
		setTeamleadersArray(teamleadersWithAllShifts);

		const tlShiftsAvailability = getShiftsAvailability(teamleadersWithAllShifts);
		setNeedTlOption(false);

		if (tlDemandData.totalHoursNeeded > tlTotalHours) {
			const numberOfTotalShiftsNeeded =
				tlDemandData.total12hNeeded +
				tlDemandData.total10hNeeded +
				tlDemandData.total8hNeeded;
			const numberOfTotalShiftsAvailable =
				tlShiftsAvailability['12h'] +
				tlShiftsAvailability['10h'] +
				tlShiftsAvailability['8h'];
			const isOptionalCalculationNeeded =
				numberOfTotalShiftsNeeded > numberOfTotalShiftsAvailable;

			const optionalTeamleadersArray = getOptionalEmployeesArray(
				teamleadersWithAllShifts,
				numberOfTotalShiftsNeeded,
				numberOfTotalShiftsAvailable,
			);

			isOptionalCalculationNeeded &&
				setOptionalTeamleadersArray(optionalTeamleadersArray);
			isOptionalCalculationNeeded && setNeedTlOption(true);
		}

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

		const empDemandData = getShifsDemand(empShiftsData);
		setEmployeesShiftsDemand(empDemandData);

		const employeesArrayWithAllShifts = createEmployeeArray(empShiftsData, empDemandData);

		setEmployeesArray(employeesArrayWithAllShifts);
		const employeesTotalHours = getTotalHours(employeesArrayWithAllShifts);
		const emplShiftsAvailability = getShiftsAvailability(employeesArrayWithAllShifts);
		setNeedEmpOption(false);

		if (empDemandData.totalHoursNeeded > employeesTotalHours) {
			const numberOfTotalShiftsNeeded =
				empDemandData.total12hNeeded +
				empDemandData.total10hNeeded +
				empDemandData.total8hNeeded;
			const numberOfTotalShiftsAvailable =
				emplShiftsAvailability['12h'] +
				emplShiftsAvailability['10h'] +
				emplShiftsAvailability['8h'];
			const isOptionalCalculationNeeded =
				numberOfTotalShiftsNeeded > numberOfTotalShiftsAvailable;

			const optionalEmployeesArray = getOptionalEmployeesArray(
				employeesArrayWithAllShifts,
				numberOfTotalShiftsNeeded,
				numberOfTotalShiftsAvailable,
			);

			isOptionalCalculationNeeded && setOptionalEmployeesArray(optionalEmployeesArray);
			isOptionalCalculationNeeded && setNeedEmpOption(true);
		}

		setTotalShiftsDemand({
			d12: +tlD12Ref.current.value + +empD12Ref.current.value,
			n12: +tlN12Ref.current.value + +empN12Ref.current.value,
			k1: +tlK1Ref.current.value + +empK1Ref.current.value,
			k2: +tlK2Ref.current.value + +empK2Ref.current.value,
			k5: +tlK5Ref.current.value + +empK5Ref.current.value,
			d8: +tlD8Ref.current.value + +empD8Ref.current.value,
		});
	};

	const changeHours = (id: string, hours: number) => {
		const activeTeamleaders = needTlOption ? optionalTeamleadersArray : teamleadersArray;
		const activeEmployees = needEmpOption ? optionalEmployeesArray : employeesArray;

		const checkTeamleaders = activeTeamleaders.find((employee) => employee.id === id);
		if (checkTeamleaders) {
			const updatedArray = activeTeamleaders.map((teamleader) => {
				if (teamleader.id === id) {
					return {
						...teamleader,
						hours: hours,
						hoursFor12hShifts: hours - teamleader.hours + teamleader.hoursFor12hShifts,
					};
				}
				return teamleader;
			});

			needTlOption
				? setOptionalTeamleadersArray(updatedArray)
				: setTeamleadersArray(updatedArray);
			console.log(updatedArray);
			return;
		}

		const checkEmployees = activeEmployees.find((employee) => employee.id === id);
		if (checkEmployees) {
			const updatedArray = activeEmployees.map((employee) => {
				if (employee.id === id) {
					console.log(employee.shifts);
					const updatedShifts = updateEmployeeShifts(employee.shifts, hours);
					console.log(updatedShifts);
					return {
						...employee,
						hours: hours,
						shifts: updatedShifts,
					};
				}
				return employee;
			});

			const newShiftsAvailability = getShiftsAvailability(updatedArray);
			const sumOfAvailableShifts =
				newShiftsAvailability['12h'] +
				newShiftsAvailability['10h'] +
				newShiftsAvailability['8h'];
			const sumOfShiftsDemand =
				employeesShiftsDemand.total12hNeeded +
				employeesShiftsDemand.total12hNeeded +
				employeesShiftsDemand.total8hNeeded;
			// if (sumOfAvailableShifts < sumOfShiftsDemand) {
			// 	const adjustedUpdatedArray = setAllShifts(
			// 		updatedArray,
			// 		employeesShiftsDemand.total10hNeeded,
			// 		employeesShiftsDemand.total8hNeeded,
			// 	);
			// 	needEmpOption
			// 		? setOptionalEmployeesArray(adjustedUpdatedArray)
			// 		: setEmployeesArray(adjustedUpdatedArray);
			// 	return;
			// }

			needEmpOption
				? setOptionalEmployeesArray(updatedArray)
				: setEmployeesArray(updatedArray);
			return;
		}
	};

	const changeLeaveHours = (id: string, hours: number) => {};

	const changeOvertimeHours = (id: string, hours: number) => {};

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
								<td style={needTlOption ? { color: '#c27' } : {}}>{tlTotalHours}</td>
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
									<td className="solution">{tlTotalHours}</td>
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
								<td style={needEmpOption ? { color: '#c27' } : {}}>{empTotalHours}</td>
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
									<td className="solution">{empTotalHours}</td>
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
							<td>godziny</td>
							<td>urlop</td>
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
											<input
												className="employees-hours"
												type="number"
												defaultValue={teamleader.hours}
												min={0}
												step={1}
												onChange={(e) => changeHours(teamleader.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={teamleader.shifts.leave}
												min={0}
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
											<input
												type="number"
												className="employees-hours"
												defaultValue={teamleader.hours}
												min={0}
												step={1}
												onChange={(e) => changeHours(teamleader.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={teamleader.shifts.leave}
												min={0}
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
							<td>godziny</td>
							<td>urlop</td>
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
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.hours}
												min={0}
												step={1}
												onChange={(e) => changeHours(employee.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.shifts.leave}
												min={0}
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
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.hours}
												min={0}
												step={1}
												onChange={(e) => changeHours(employee.id, +e.target.value)}
											/>
										</td>
										<td>
											<input
												className="employees-hours"
												type="number"
												defaultValue={employee.shifts.leave}
												min={0}
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
