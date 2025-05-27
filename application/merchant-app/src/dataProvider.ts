import { DataProvider, GetOneParams, GetManyParams, CreateParams, UpdateParams, DeleteParams, DeleteManyParams } from 'react-admin';
import { apiClient } from 'e-punch-common-ui';
import { CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto } from 'e-punch-common-core';
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

  create: async (resource: string, params: CreateParams) => {
    const state = store.getState();
    const merchantId = state.auth.merchant?.id;
    
    if (!merchantId) {
      throw new Error('Merchant not authenticated. Please log in again.');
    }

    switch (resource) {
      case 'loyalty-programs':
        const createData: CreateLoyaltyProgramDto = {
          name: params.data.name,
          description: params.data.description || undefined,
          requiredPunches: params.data.requiredPunches,
          rewardDescription: params.data.rewardDescription,
          isActive: params.data.isActive ?? true,
        };
        const createdProgram = await apiClient.createLoyaltyProgram(merchantId, createData);
        return { 
          data: { 
            ...createdProgram, 
            id: createdProgram.id 
          } as any
        };
      
      default:
        throw new Error(`Create not implemented for resource: ${resource}`);
    }
  },

  update: async (resource: string, params: UpdateParams) => {
    const state = store.getState();
    const merchantId = state.auth.merchant?.id;
    
    if (!merchantId) {
      throw new Error('Merchant not authenticated');
    }

    switch (resource) {
      case 'loyalty-programs':
        const updateData: UpdateLoyaltyProgramDto = {};
        if (params.data.name !== undefined) updateData.name = params.data.name;
        if (params.data.description !== undefined) updateData.description = params.data.description;
        if (params.data.rewardDescription !== undefined) updateData.rewardDescription = params.data.rewardDescription;
        if (params.data.isActive !== undefined) updateData.isActive = params.data.isActive;
        
        const updatedProgram = await apiClient.updateLoyaltyProgram(merchantId, params.id as string, updateData);
        return { data: updatedProgram as any };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  updateMany: async () => {
    throw new Error('UpdateMany not implemented yet');
  },

  delete: async (resource: string, params: DeleteParams) => {
    const state = store.getState();
    const merchantId = state.auth.merchant?.id;
    
    if (!merchantId) {
      throw new Error('Merchant not authenticated');
    }

    switch (resource) {
      case 'loyalty-programs':
        await apiClient.deleteLoyaltyProgram(merchantId, params.id as string);
        return { data: { id: params.id } as any };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  deleteMany: async (resource: string, params: DeleteManyParams) => {
    const state = store.getState();
    const merchantId = state.auth.merchant?.id;
    
    if (!merchantId) {
      throw new Error('Merchant not authenticated');
    }

    switch (resource) {
      case 'loyalty-programs':
        const deletePromises = params.ids.map(id => 
          apiClient.deleteLoyaltyProgram(merchantId, id as string)
        );
        await Promise.all(deletePromises);
        return { data: params.ids };
      
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },
}; 