import { Employee, Shift, EmployeesShiftsDemand, MonthData } from '../types/types';

// HOURS

export const getTotalHours = (employees: Employee[]) => {
	const totalHours = employees.reduce((total, nextPerson) => total + nextPerson.hours, 0);
	return totalHours;
};

// SHIFTS

export const getShifsDemand = (data: MonthData) => {
	const shiftsData = {
		total12hNeeded: (data.d12 + data.n12 + data.k1 + data.k2) * data.monthDays,
		total10hNeeded: (data.k5 + data.d10) * data.monthDays,
		total8hNeeded: (data.d8 + data.d + data.k3) * data.monthDays,
		totalHoursNeeded:
			(data.d12 + data.n12 + data.k1 + data.k2) * data.monthDays * 12 +
			(data.k5 + data.d10) * data.monthDays * 10 +
			(data.d8 + data.d + data.k3) * data.monthDays * 8,
	};
	return shiftsData;
};

export const checkIfShiftsAreCovered = (
	shiftsNeeded: EmployeesShiftsDemand,
	shiftsAvailable: Shift,
) => {
	const demand =
		shiftsNeeded.total12hNeeded +
		shiftsNeeded.total10hNeeded +
		shiftsNeeded.total8hNeeded;
	const availability =
		shiftsAvailable['12h'] + shiftsAvailable['10h'] + shiftsAvailable['8h'];
	const areShiftsCovered = availability >= demand;
	return { demand, availability, areShiftsCovered };
};

export function getMax12hShifts(hours: number) {
	const shifts = {
		'12h': 0,
		'10h': 0,
		'8h': 0,
		add: 0,
	};

	if (hours < 8) {
		shifts.add = hours;
		return shifts;
	}

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
		const adjustedShifts = getMax12hShifts(hours - 1);
		shifts['12h'] = adjustedShifts['12h'];
		shifts['10h'] = adjustedShifts['10h'];
		shifts['8h'] = adjustedShifts['8h'];
		shifts.add = 1;
	}

	if (shifts.add > 1) {
		const adjustedShifts = getMax12hShifts(shifts.add);
		shifts['12h'] = adjustedShifts['12h'] + shifts['12h'];
		shifts['10h'] = adjustedShifts['10h'] + shifts['10h'];
		shifts['8h'] = adjustedShifts['8h'] + shifts['8h'];
		shifts.add = adjustedShifts.add;
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
			over: 0,
		};

	const availableShifts = employees.reduce(
		(total, nextPerson) => {
			const shiftsSummary = {
				'12h': total['12h'] + nextPerson.shifts['12h'],
				'10h': total['10h'] + nextPerson.shifts['10h'],
				'8h': total['8h'] + nextPerson.shifts['8h'],
				add: total.add + nextPerson.availableHours,
				leave: total.leave + nextPerson.shifts.leave,
				over: total.over + nextPerson.shifts.over,
			};
			return shiftsSummary;
		},
		{
			'12h': 0,
			'10h': 0,
			'8h': 0,
			add: 0,
			leave: 0,
			over: 0,
		},
	);
	return availableShifts;
};

// EMPLOYEES

export const getOptionalEmployeesArray = (
	employees: Employee[],
	shiftsNeeded: number,
	shiftsAvailable: number,
) => {
	let numberOfShiftsToSet = shiftsNeeded - shiftsAvailable;
	let numberOfLoopsNeeded = Math.ceil(numberOfShiftsToSet / employees.length);
	let optionalEmployeesArray = employees.sort((a, b) => {
		return a.shifts['8h'] - b.shifts['8h'];
	});
	while (numberOfLoopsNeeded > 0) {
		optionalEmployeesArray = optionalEmployeesArray.map((employee) => {
			if (numberOfShiftsToSet > 0 && employee.shifts['12h'] > 1) {
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
	return optionalEmployeesArray.sort((a, b) => {
		return +a.name.split(' ')[1] - +b.name.split(' ')[1];
	});
};

function distributeMaximumHours(employee: Employee) {
	const availableHours = employee.availableHours;
	const max12hShifts = getMax12hShifts(availableHours);
	return max12hShifts;
}

function distribute8hShifts(employeesArray: Employee[], numberOfShifts: number) {
	let numberOfShiftsToAssign = numberOfShifts;
	let numberOfLoopsNeeded = Math.ceil(numberOfShifts / employeesArray.length);
	let newArray = employeesArray;
	while (numberOfLoopsNeeded > 0) {
		newArray = newArray.map((employee) => {
			if (numberOfShiftsToAssign > 0 && employee.availableHours >= 8) {
				numberOfShiftsToAssign--;
				return {
					...employee,
					availableHours: employee.availableHours - 8,
					shifts: { ...employee.shifts, '8h': employee.shifts['8h'] + 1 },
				};
			}
			return employee;
		});
		numberOfLoopsNeeded--;
	}

	return newArray;
}

function distribute10hShifts(employeesArray: Employee[], numberOfShifts: number) {
	let numberOfShiftsToAssign = numberOfShifts;
	let numberOfLoopsNeeded = Math.ceil(numberOfShifts / employeesArray.length);
	let newArray = employeesArray;
	while (numberOfLoopsNeeded > 0) {
		newArray = newArray.map((employee) => {
			if (numberOfShiftsToAssign > 0 && employee.availableHours >= 10) {
				numberOfShiftsToAssign--;
				return {
					...employee,
					availableHours: employee.availableHours - 10,
					shifts: { ...employee.shifts, '10h': employee.shifts['10h'] + 1 },
				};
			}
			return employee;
		});
		numberOfLoopsNeeded--;
	}

	return newArray;
}

function distribute12hShifts(employeesArray: Employee[]) {
	const newArray = employeesArray.map((employee) => {
		const additionalShifts = distributeMaximumHours(employee);

		return {
			...employee,
			availableHours: additionalShifts.add,
			shifts: {
				...employee.shifts,
				'12h': additionalShifts['12h'],
				'10h': employee.shifts['10h'] + additionalShifts['10h'],
				'8h': employee.shifts['8h'] + additionalShifts['8h'],
			},
		};
	});
	return newArray;
}

export function distributeShifts(
	employeesArray: Employee[],
	shiftDemand: EmployeesShiftsDemand,
) {
	const arrayWith8hShiftsDistributed = distribute8hShifts(
		employeesArray,
		shiftDemand.total8hNeeded,
	);
	const arrayWith10hShiftsDistributed = distribute10hShifts(
		arrayWith8hShiftsDistributed,
		shiftDemand.total10hNeeded,
	);
	const arrayWith12hShiftsDistributed = distribute12hShifts(
		arrayWith10hShiftsDistributed,
	);

	return arrayWith12hShiftsDistributed;
}

export function createBoilerplateEmployeeArray(
	numberOfEmployees: number,
	employeeType: string,
	hours: number,
) {
	const employeeArray: Employee[] = [];
	for (let i = 0; i < numberOfEmployees; i++) {
		const person = {
			name: `${employeeType} ${i + 1}`,
			hours: hours,
			availableHours: hours,
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
}
