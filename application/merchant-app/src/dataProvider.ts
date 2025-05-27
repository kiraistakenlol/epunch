import { DataProvider, GetListParams, GetOneParams, GetManyParams } from 'react-admin';
import { apiClient } from 'e-punch-common-ui';

const HARDCODED_MERCHANT_ID = '251dc2f0-f969-455f-aa7d-959a551eae67';

export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    switch (resource) {
      case 'loyalty-programs':
        const programs = await apiClient.getMerchantLoyaltyPrograms(HARDCODED_MERCHANT_ID);
        return {
          data: programs.map(program => ({ ...program, id: program.id })) as any,
          total: programs.length,
        };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getOne: async (resource: string, params: GetOneParams) => {
    switch (resource) {
      case 'loyalty-programs':
        const programs = await apiClient.getMerchantLoyaltyPrograms(HARDCODED_MERCHANT_ID);
        const program = programs.find(p => p.id === params.id);
        if (!program) throw new Error('Program not found');
        return { data: program as any };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const { ids } = params;
    
    switch (resource) {
      case 'loyalty-programs':
        const programs = await apiClient.getMerchantLoyaltyPrograms(HARDCODED_MERCHANT_ID);
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