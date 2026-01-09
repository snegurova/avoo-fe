import {
  BaseResponse,
  MasterWithRelationsEntityResponse,
  CreateMasterRequest,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const GET_MASTERS_ENDPOINT = '/masters';
const CREATE_MASTER_ENDPOINT = '/masters';
const UPDATE_MASTER_ENDPOINT = '/masters';


const mastersEndpoints = {
  all: () => GET_MASTERS_ENDPOINT,
  create: () => CREATE_MASTER_ENDPOINT,
  update: (id: number) => `${UPDATE_MASTER_ENDPOINT}/${id}`,
  delete: (id: number) => `${UPDATE_MASTER_ENDPOINT}/${id}`,
};

export const masterApi = {
  async getMastersInfo() {
    const response =
      await apiClient.get<BaseResponse<MasterWithRelationsEntityResponse[]>>(
        mastersEndpoints.all(),
      );
    return response.data;
  },
  async createMaster(data: CreateMasterRequest) {
    const response = await apiClient.post<BaseResponse<MasterWithRelationsEntityResponse>>(
      mastersEndpoints.create(),
      data,
    );
    return response.data;
  },
  async updateMaster(id: number, data: CreateMasterRequest) {
    const response = await apiClient.put<BaseResponse<MasterWithRelationsEntityResponse>>(
      mastersEndpoints.update(id),
      data,
    );
    return response.data;
  },
  async deleteMaster(id: number) {
    const response = await apiClient.delete<BaseResponse<void>>(mastersEndpoints.delete(id));
    return response.data;
  },
};
