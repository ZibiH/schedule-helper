import { Employee, ShiftsData, EmployeesShiftsDemand, MonthData } from '../types/types';

// HOURS

export const getTotalHours = () => {
	return 0;
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
	let employeeArrayWith10hShifts = employees;
	while (numberOfLoopsNeeded > 0) {
		employeeArrayWith10hShifts = employeeArrayWith10hShifts.map((employee) => {
			if (numberOfShiftsToSet > 0) {
				numberOfShiftsToSet--;
				return {
					...employee,
					shifts: { ...employee.shifts, '8h': employee.shifts['8h'] + 1 },
				};
			}
			return employee;
		});
		numberOfLoopsNeeded--;
	}
	return employeeArrayWith10hShifts;
};

export const getShiftsAvailability = () => {
	return {
		'12h': 0,
		'10h': 0,
		'8h': 0,
		add: 0,
		leave: 0,
	};
};

export const getOptionalShiftsAvailability = () => {
	return {
		'12h': 0,
		'10h': 0,
		'8h': 0,
		add: 0,
		leave: 0,
	};
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
