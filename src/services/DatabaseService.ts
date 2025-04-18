import Dexie from 'dexie';
import { fetchPVPCData } from './Esios';
import { PvpcDataHelper } from '../models/PvpcData';

export interface PvpcData {
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

export const getAllPvpcData = async (): Promise<PvpcData[]> => {
  try {
    return await db.pvpcData.toArray();
  } catch (error) {
    console.error('Error fetching all PVPC data:', error);
    throw error;
  }
};

export const clearPvpcData = async (): Promise<void> => {
  try {
    await db.pvpcData.clear();
    console.log('Todos los datos de pvpcData han sido eliminados.');
  } catch (error) {
    console.error('Error al eliminar todos los datos de pvpcData:', error);
    throw error;
  }
};

export const deletePvpcDataByDate = async (date: string): Promise<void> => {
  try {
    const deleted = await db.pvpcData.delete(date);
    console.log(`El dato con la fecha ${date} ha sido eliminado.`);
  } catch (error) {
    console.error(`Error al eliminar el dato con la fecha ${date}:`, error);
    throw error;
  }
};