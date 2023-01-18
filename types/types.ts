export type Shift = {
	'12h': number;
	'10h': number;
	'8h': number;
	add: number;
	leave: number;
};
export type Employee = {
	name: string;
	hours: number;
	hoursFor12hShifts: number;
	id: string;
	shifts: Shift;
};

export type ShiftsData = {
	d12: number;
	n12: number;
	k1: number;
	k2: number;
	d8: number;
	k5: number;
};

export type EmployeesShiftsDemand = {
	total12hNeeded: number;
	totalHoursNeeded: number;
	total10hNeeded: number;
	total8hNeeded: number;
};
