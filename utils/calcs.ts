import { Employee, ShiftsData, EmployeesShiftsDemand } from '../types/types';

export const getMax12hShifts = (hours: number, employee: Employee) => {
	const full12hShiftsNumber = hours / 12;
	if (hours < 8)
		return {
			'12h': 0,
			'10h': employee.shifts['10h'],
			'8h': employee.shifts['8h'],
			add: hours,
		};
	if (hours % 12 === 8)
		return {
			'12h': Math.floor(full12hShiftsNumber),
			'10h': employee.shifts['10h'],
			'8h': 1 + employee.shifts['8h'],
			add: 0,
		};
	if (hours % 12 === 4)
		return {
			'12h': Math.floor(full12hShiftsNumber) - 1,
			'10h': employee.shifts['10h'],
			'8h': 2 + employee.shifts['8h'],
			add: 0,
		};
	if (hours % 12 === 0)
		return {
			'12h': Math.floor(full12hShiftsNumber),
			'10h': employee.shifts['10h'],
			'8h': employee.shifts['8h'],
			add: 0,
		};
	if (hours % 12 > 8) {
		return {
			'12h': Math.floor(full12hShiftsNumber),
			'10h': employee.shifts['10h'],
			'8h': 1 + employee.shifts['8h'],
			add: (hours % 12) - 8,
		};
	}
	return {
		'12h': Math.floor(full12hShiftsNumber),
		'10h': employee.shifts['10h'],
		'8h': employee.shifts['8h'],
		add: hours % 12,
	};
};

export const createEmployeesArray = (
	name: string,
	hours: number,
	hoursFor12hShifts: number,
	count: number,
) => {
	const array: Employee[] = [];
	for (let i = 0; i < count; i++) {
		const shifts = {
			'12h': 0,
			'10h': 0,
			'8h': 0,
			add: 0,
		};
		const person = {
			name: name,
			hours: hours,
			hoursFor12hShifts: hoursFor12hShifts,
			id: Math.random().toString(),
			shifts,
		};
		person.shifts = getMax12hShifts(hours, person);
		array.push(person);
	}
	return array;
};

export const getTotalHours = (array: Employee[]) => {
	return array.reduce((total, employee) => {
		return total + employee.hours;
	}, 0);
};

export const calculateShiftsDemand = (shifts: ShiftsData, days: number) => {
	const numberOf10hShiftsNeeded = shifts.k5 * days;
	const numberOf8hShiftsNeeded = shifts.d8 * days;

	const numberOf12hShiftsNeeded =
		(shifts.d12 + shifts.k1 + shifts.k2 + shifts.n12) * days;
	const hoursNeeded = numberOf12hShiftsNeeded * 12;

	return {
		total12hNeeded: numberOf12hShiftsNeeded,
		totalHoursNeeded: hoursNeeded,
		total10hNeeded: numberOf10hShiftsNeeded,
		total8hNeeded: numberOf8hShiftsNeeded,
	};
};

export const calculateShiftsAvailability = (shiftsArray: Employee[]) => {
	const shiftsAvailability = shiftsArray.reduce(
		(total, nextPerson) => {
			const shifts = getMax12hShifts(nextPerson.hoursFor12hShifts, nextPerson);
			return {
				'12h': total['12h'] + shifts['12h'],
				'10h': total['10h'] + shifts['10h'],
				'8h': total['8h'] + shifts['8h'],
				add: shifts.add + total.add,
			};
		},
		{ '12h': 0, '10h': 0, '8h': 0, add: 0 },
	);
	return shiftsAvailability;
};

export const getTotalNumberOfShifts = (shiftsArray: Employee[]) => {
	const shiftsAvailability = shiftsArray.reduce(
		(total, nextPerson) => {
			return {
				'12h': total['12h'] + nextPerson.shifts['12h'],
				'10h': total['10h'] + nextPerson.shifts['10h'],
				'8h': total['8h'] + nextPerson.shifts['8h'],
				add: nextPerson.shifts.add + total.add,
			};
		},
		{ '12h': 0, '10h': 0, '8h': 0, add: 0 },
	);
	return shiftsAvailability;
};

export const changeEmployeeShift = (employee: Employee) => {
	const newEmployee = {
		...employee,
		shifts: {
			'12h': employee.shifts['12h'] - 2,
			'10h': employee.shifts['10h'],
			'8h': employee.shifts['8h'] + 3,
			add: employee.shifts.add,
		},
	};

	if (newEmployee.shifts.add < 4) {
		return newEmployee;
	}
	const adjustedEmployee = {
		...newEmployee,
		shifts: {
			'12h': newEmployee.shifts['12h'] + 1,
			'10h': employee.shifts['10h'],
			'8h': newEmployee.shifts['8h'] - 1,
			add: newEmployee.shifts.add - 4,
		},
	};

	return adjustedEmployee;
};

export const adjustShifts = (
	numberOfShiftsNeeded: number,
	currentEmployeesArray: Employee[],
) => {
	const currentShiftsAvailability = calculateShiftsAvailability(currentEmployeesArray);
	const availableShifts =
		currentShiftsAvailability['12h'] + currentShiftsAvailability['8h'];

	if (numberOfShiftsNeeded <= availableShifts) return currentEmployeesArray;

	let insufficientShfitsNumber = numberOfShiftsNeeded - availableShifts;

	const newEmployeesArray = currentEmployeesArray.map((employee) => {
		if (insufficientShfitsNumber > 0) {
			insufficientShfitsNumber--;
			return changeEmployeeShift(employee);
		} else {
			return employee;
		}
	});

	if (insufficientShfitsNumber === 0) {
		return newEmployeesArray;
	} else {
		const newArray = newEmployeesArray.map((employee) => {
			if (insufficientShfitsNumber > 0) {
				insufficientShfitsNumber--;
				return changeEmployeeShift(employee);
			} else {
				return employee;
			}
		});
		return newArray;
	}
};

const TEN_HOURS_SHIFT = '10h';
const EIGHT_HOURS_SHIFT = '8h';

const adjustNon12hShifts = (employee: Employee, shift: string) => {
	if (shift === TEN_HOURS_SHIFT) {
		const newEmployee = {
			...employee,
			hoursFor12hShifts: employee.hoursFor12hShifts - 10,
			shifts: { ...employee.shifts, '10h': employee.shifts['10h'] + 1 },
		};
		return newEmployee;
	}

	if (shift === EIGHT_HOURS_SHIFT) {
		const newEmployee = {
			...employee,
			hoursFor12hShifts: employee.hoursFor12hShifts - 8,
			shifts: { ...employee.shifts, '8h': employee.shifts['8h'] + 1 },
		};
		return newEmployee;
	}

	return employee;
};

export const calculateAvailableHoursFor12hShiftsOnly = (
	employees: Employee[],
	shiftsDemand: EmployeesShiftsDemand,
) => {
	let numberOf10hShiftsNeeded = shiftsDemand.total10hNeeded;
	let numberOf8hShiftsNeeded = shiftsDemand.total8hNeeded;
	let adjustedEmployeesArray = employees;
	while (numberOf10hShiftsNeeded > 0) {
		adjustedEmployeesArray = adjustedEmployeesArray.map((employee) => {
			if (numberOf10hShiftsNeeded === 0) return employee;
			let newEmployee = employee;
			if (numberOf10hShiftsNeeded > 0) {
				newEmployee = adjustNon12hShifts(employee, TEN_HOURS_SHIFT);
				numberOf10hShiftsNeeded--;
			}
			return newEmployee;
		});
	}
	while (numberOf8hShiftsNeeded > 0) {
		adjustedEmployeesArray = adjustedEmployeesArray.map((employee) => {
			if (numberOf8hShiftsNeeded === 0) return employee;
			let newEmployee = employee;
			if (numberOf8hShiftsNeeded > 0) {
				newEmployee = adjustNon12hShifts(employee, EIGHT_HOURS_SHIFT);
				numberOf8hShiftsNeeded--;
			}
			return newEmployee;
		});
	}
	return adjustedEmployeesArray;
};
