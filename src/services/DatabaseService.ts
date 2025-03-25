import Dexie from 'dexie';
import { fetchPVPCData } from './Esios';
import { PvpcDataHelper } from '../models/PvpcData';

interface PvpcData {
  date: string;
  data: any;
}

class MyDatabase extends Dexie {
  pvpcData: Dexie.Table<PvpcData, string>;

  constructor() {
    super('PVPCDatabase');
    this.version(1).stores({
      pvpcData: 'date', // 'date' es la clave primaria
    });
    this.pvpcData = this.table('pvpcData');
  }
}

const db = new MyDatabase();

export const getPvpcData = async (date: string): Promise<any> => {
  try {
    // Verifica si los datos ya existen en la base de datos
    const existingData = await db.pvpcData.get(date);
    if (existingData && existingData.data.PVPC.length > 23) {
      return existingData.data;
    }

    // Si no existen, busca los datos usando fetchPVPCData
    const pvpcData = await fetchPVPCData(date);

    // Guarda los datos en la base de datos
    await db.pvpcData.put({ date, data: pvpcData });

    return pvpcData;
  } catch (error) {
    console.error(`Error fetching or saving PVPC data for ${date}:`, error);
    throw error;
  }
};