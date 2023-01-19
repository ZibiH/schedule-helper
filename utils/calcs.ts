import { Employee, ShiftsData, EmployeesShiftsDemand, MonthData } from '../types/types';

// HOURS

export const getTotalHours = (employees: Employee[]) => {
	const totalHours = employees.reduce((total, nextPerson) => total + nextPerson.hours, 0);
	return totalHours;
};

// SHIFTS

export const getShifsDemand = (data: MonthData) => {
	const shiftsData = {
		total12hNeeded: (data.d12 + data.n12 + data.k1 + data.k2) * data.monthDays,
		total10hNeeded: data.k5 * data.monthDays,
		total8hNeeded: data.d8 * data.monthDays,
		totalHoursNeeded:
			(data.d12 + data.n12 + data.k1 + data.k2) * data.monthDays * 12 +
			data.k5 * data.monthDays * 10 +
			data.d8 * data.monthDays * 8,
	};
	return shiftsData;
};

export const setAll10hShifts = (employees: Employee[], shiftDemand: number) => {
	let numberOfShiftsToSet = shiftDemand;
	let numberOfLoopsNeeded = Math.ceil(shiftDemand / employees.length);
	let employeeArrayWith10hShifts = employees;
	while (numberOfLoopsNeeded > 0) {
		employeeArrayWith10hShifts = employeeArrayWith10hShifts.map((employee) => {
			if (numberOfShiftsToSet > 0) {
				numberOfShiftsToSet--;
				return {
					...employee,
					hoursFor12hShifts: employee.hoursFor12hShifts - 10,
					shifts: { ...employee.shifts, '10h': employee.shifts['10h'] + 1 },
				};
			}
			return employee;
		});
		numberOfLoopsNeeded--;
	}
	return employeeArrayWith10hShifts;
};

export const setAll8hShifts = (employees: Employee[], shiftDemand: number) => {
	let numberOfShiftsToSet = shiftDemand;
	let numberOfLoopsNeeded = Math.ceil(shiftDemand / employees.length);
	let employeeArrayWith8hShifts = employees;
	while (numberOfLoopsNeeded > 0) {
		employeeArrayWith8hShifts = employeeArrayWith8hShifts.map((employee) => {
			if (numberOfShiftsToSet > 0) {
				numberOfShiftsToSet--;
				return {
					...employee,
					hoursFor12hShifts: employee.hoursFor12hShifts - 8,
					shifts: { ...employee.shifts, '8h': employee.shifts['8h'] + 1 },
				};
			}
			return employee;
		});
		numberOfLoopsNeeded--;
	}
	return employeeArrayWith8hShifts;
};

export const calculate12hShifts = (employees: Employee[]) => {
	const calculatedShifts = employees.map((employee) => {
		const hoursFor12hShifts = employee.hoursFor12hShifts;
		const shifts = getMax12hShifs(hoursFor12hShifts);
		return {
			...employee,
			shifts: {
				...employee.shifts,
				'12h': employee.shifts['12h'] + shifts['12h'],
				'10h': employee.shifts['10h'] + shifts['10h'],
				'8h': employee.shifts['8h'] + shifts['8h'],
				add: employee.shifts.add + shifts.add,
			},
		};
	});
	return calculatedShifts;
};

function getMax12hShifs(hours: number) {
	const shifts = {
		'12h': 0,
		'10h': 0,
		'8h': 0,
		add: 0,
	};

	if (hours % 12 === 0) {
		shifts['12h'] = hours / 12;
	}

	if (hours % 12 === 2) {
		shifts['12h'] = Math.floor(hours / 12) - 1;
		shifts['10h'] = 1;
	}

	if (hours % 12 === 4) {
		shifts['12h'] = Math.floor(hours / 12) - 1;
		shifts['8h'] = 2;
	}

	if (hours % 12 === 6) {
		shifts['12h'] = Math.floor(hours / 12) - 1;
		shifts['10h'] = 1;
		shifts['8h'] = 1;
	}

	if (hours % 12 === 8) {
		shifts['12h'] = Math.floor(hours / 12);
		shifts['8h'] = 1;
	}

	if (hours % 12 === 10) {
		shifts['12h'] = Math.floor(hours / 12);
		shifts['10h'] = 1;
	}

	if (hours % 2 === 1) {
		const adjustedShifts = getMax12hShifs(hours - 1);
		shifts['12h'] = adjustedShifts['12h'];
		shifts['10h'] = adjustedShifts['10h'];
		shifts['8h'] = adjustedShifts['8h'];
		shifts.add = 1;
	}
	return shifts;
}

export const getShiftsAvailability = (employees: Employee[]) => {
	if (!employees.length)
		return {
			'12h': 0,
			'10h': 0,
			'8h': 0,
			add: 0,
			leave: 0,
		};

	const availableShifts = employees.reduce(
		(total, nextPerson) => {
			const shiftsSummary = {
				'12h': total['12h'] + nextPerson.shifts['12h'],
				'10h': total['10h'] + nextPerson.shifts['10h'],
				'8h': total['8h'] + nextPerson.shifts['8h'],
				add: total.add + nextPerson.shifts.add,
				leave: total.leave + nextPerson.shifts.leave,
			};
			return shiftsSummary;
		},
		{
			'12h': 0,
			'10h': 0,
			'8h': 0,
			add: 0,
			leave: 0,
		},
	);
	return availableShifts;
};

export const getOptionalEmployeesArray = (
	employees: Employee[],
	shiftsNeeded: number,
	shiftsAvailable: number,
) => {
	let numberOfShiftsToSet = shiftsNeeded - shiftsAvailable;
	let numberOfLoopsNeeded = Math.ceil(numberOfShiftsToSet / employees.length);
	let optionalEmployeesArray = employees;
	while (numberOfLoopsNeeded > 0) {
		optionalEmployeesArray = optionalEmployeesArray.map((employee) => {
			if (numberOfShiftsToSet > 0) {
				numberOfShiftsToSet--;
				return {
					...employee,
					shifts: {
						...employee.shifts,
						'12h': employee.shifts['12h'] - 2,
						'8h': employee.shifts['8h'] + 3,
					},
				};
			}
			return employee;
		});
		numberOfLoopsNeeded--;
	}
	return optionalEmployeesArray;
};

// EMPLOYEES ARRAY

export const createBoilerplateEmployeeArray = (
	numberOfEmployees: number,
	employeeType: string,
	hours: number,
) => {
	const employeeArray: Employee[] = [];
	for (let i = 0; i < numberOfEmployees; i++) {
		const person = {
			name: `${employeeType} ${i + 1}`,
			hours: hours,
			hoursFor12hShifts: hours,
			id: Math.random().toString(),
			shifts: {
				'12h': 0,
				'10h': 0,
				'8h': 0,
				add: 0,
				leave: 0,
				over: 0,
			},
		};
		employeeArray.push(person);
	}
	return employeeArray;
};