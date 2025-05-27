import { DataProvider, GetOneParams, GetManyParams } from 'react-admin';
import { apiClient } from 'e-punch-common-ui';
import { store } from './store/store';

export const dataProvider: DataProvider = {
  getList: async (resource: string) => {
    const state = store.getState();
    const merchantId = state.auth.merchant?.id;
    
    if (!merchantId) {
      return {
        data: [],
        total: 0,
      };
    }

    switch (resource) {
      case 'loyalty-programs':
        const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
        return {
          data: programs.map(program => ({ ...program, id: program.id })) as any,
          total: programs.length,
        };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const state = store.getState();
    const merchantId = state.auth.merchant?.id;
    
    if (!merchantId) {
      throw new Error('Merchant not authenticated');
    }

    switch (resource) {
      case 'loyalty-programs':
        const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
        const program = programs.find(p => p.id === params.id);
        if (!program) throw new Error('Program not found');
        return { data: program as any };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const state = store.getState();
    const merchantId = state.auth.merchant?.id;
    
    if (!merchantId) {
      return { data: [] };
    }

    const { ids } = params;
    
    switch (resource) {
      case 'loyalty-programs':
        const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
        const filteredPrograms = programs.filter(p => ids.includes(p.id));
        return { data: filteredPrograms as any };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getManyReference: async () => {
    return { data: [], total: 0 };
  },

  create: async () => {
    throw new Error('Create not implemented yet');
  },

  update: async () => {
    throw new Error('Update not implemented yet');
  },

  updateMany: async () => {
    throw new Error('UpdateMany not implemented yet');
  },

  delete: async () => {
    throw new Error('Delete not implemented yet');
  },

  deleteMany: async () => {
    throw new Error('DeleteMany not implemented yet');
  },
}; 