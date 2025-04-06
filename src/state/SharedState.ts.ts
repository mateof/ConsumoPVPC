import { BehaviorSubject } from 'rxjs';

// Inicializa el estado con un valor predeterminado (puede ser null)
export const consumptionSelectedDay$ = new BehaviorSubject<string | null>(null);
export const dailyGastoSelectedDay$ = new BehaviorSubject<string | null>(null);
export const monthlyConsumptionSelectedMonth$ = new BehaviorSubject<string | null>(null);
export const monthlyGastoSelectedMonth$ = new BehaviorSubject<string | null>(null);
export const monthlyHourlySelectedMonth$ = new BehaviorSubject<string | null>(null);
export const monthlyHourlyGastoSelectedMonth$ = new BehaviorSubject<string | null>(null);