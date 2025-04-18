export interface PvpcData {
  Dia: string;           // Fecha en formato DD/MM/YYYY
  Hora: string;          // Rango horario en formato HH-HH
  PCB: string;           // Precio final PCB en €/MWh
  CYM: string;           // Precio final CYM en €/MWh
  COF2TD: string;        // Coeficiente de pérdidas
  PMHPCB: string;        // Precio del mercado horario PCB en €/MWh
  PMHCYM: string;        // Precio del mercado horario CYM en €/MWh
  SAHPCB: string;        // Servicios de ajuste PCB en €/MWh
  SAHCYM: string;        // Servicios de ajuste CYM en €/MWh
  FOMPCB: string;        // Financiación OM PCB en €/MWh
  FOMCYM: string;        // Financiación OM CYM en €/MWh
  FOSPCB: string;        // Financiación OS PCB en €/MWh
  FOSCYM: string;        // Financiación OS CYM en €/MWh
  INTPCB: string;        // Servicio de interrumpibilidad PCB en €/MWh
  INTCYM: string;        // Servicio de interrumpibilidad CYM en €/MWh
  PCAPPCB: string;       // Pago por capacidad PCB en €/MWh
  PCAPCYM: string;       // Pago por capacidad CYM en €/MWh
  TEUPCB: string;        // Tasa ENRESA PCB en €/MWh
  TEUCYM: string;        // Tasa ENRESA CYM en €/MWh
  CCVPCB: string;        // Coste de comercialización variable PCB en €/MWh
  CCVCYM: string;        // Coste de comercialización variable CYM en €/MWh
  EDSRPCB: string;       // Excedente o déficit PCB en €/MWh
  EDSRCYM: string;       // Excedente o déficit CYM en €/MWh
  TAHPCB: string;        // Término de ajuste horario PCB en €/MWh
  TAHCYM: string;        // Término de ajuste horario CYM en €/MWh
}

// Función auxiliar para convertir strings con coma a números
export const parseSpanishNumber = (value: string): number => {
  return parseFloat(value.replace(',', '.'));
};

// Clase helper para manejar los datos de PVPC
export class PvpcDataHelper {
  static getPriceFromPvpcData(data: PvpcData): number {
    return parseSpanishNumber(data.PCB);
  }

  static getPriceFromPvpcDataKwH(data: PvpcData): number {
    return parseSpanishNumber(data.PCB) / 1000;
  }

  static getPriceFromPvpcDataKwHCeutaYMelilla(data: PvpcData): number {
    return parseSpanishNumber(data.CYM) / 1000;
  }

  static getHourRange(data: PvpcData): { start: number; end: number } {
    const [start, end] = data.Hora.split('-').map(Number);
    return { start, end };
  }

  static getDate(data: PvpcData): Date {
    const [day, month, year] = data.Dia.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  static englishToSpanishDate(date: String): string {
    const [year, month, day] = date.split('/').map(Number);
    return `${day}/${month}/${year}`;
  }
}