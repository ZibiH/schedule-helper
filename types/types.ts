export type Shift = {
	'12h': number;
	'10h': number;
	'8h': number;
	add: number;
	leave: number;
	over: number;
};
export type Employee = {
	name: string;
	hours: number;
	availableHours: number;
	id: string;
	shifts: Shift;
};

export type ShiftsData = {
	d12: number;
	n12: number;
	d: number;
	d8: number;
	d10: number;
	k1: number;
	k2: number;
	k3: number;
	k5: number;
};

export interface MonthData extends ShiftsData {
	count: number;
	monthHours: number;
	monthDays: number;
}

export type EmployeesShiftsDemand = {
	total12hNeeded: number;
	totalHoursNeeded: number;
	total10hNeeded: number;
	total8hNeeded: number;
};

export type InitialEmployeeData = {
	name: string;
	count: number;
	monthHours: number;
	monthDays: number;
	d12: number;
	n12: number;
	d: number;
	d8: number;
	d10: number;
	k1: number;
	k2: number;
	k3: number;
	k5: number;
};
