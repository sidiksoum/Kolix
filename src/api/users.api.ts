import { apiClient } from './client';
import { StandardApiResponse } from './auth.api';

export interface CollaboratorDto {
  id: string;
  shop_id?: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: 'Actif' | 'Suspendu' | 'Invitation envoyée';
  permissions: string[];
  is_owner?: boolean;
}

export interface CollaboratorCreateDto {
  name: string;
  phone: string;
  email: string;
  role: string;
  permissions: string[];
  password?: string;
}

export interface CollaboratorUpdateDto {
  name?: string;
  phone?: string;
  role?: string;
  status?: string;
  permissions?: string[];
  password?: string;
}

export const usersApi = {
  async getCollaborators(): Promise<CollaboratorDto[]> {
    try {
      const res = await apiClient.get<StandardApiResponse<CollaboratorDto[]>>('/api/v1/users/collaborators');
      return res.data || [];
    } catch (err) {
      console.warn('API getCollaborators failed, returning empty list or fallback', err);
      throw err;
    }
  },

  async addCollaborator(dto: CollaboratorCreateDto): Promise<CollaboratorDto> {
    const res = await apiClient.post<StandardApiResponse<CollaboratorDto>>('/api/v1/users/collaborators', dto);
    return res.data;
  },

  async updateCollaborator(id: string, dto: CollaboratorUpdateDto): Promise<CollaboratorDto> {
    const res = await apiClient.put<StandardApiResponse<CollaboratorDto>>(`/api/v1/users/collaborators/${id}`, dto);
    return res.data;
  },

  async deleteCollaborator(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/users/collaborators/${id}`);
  }
};

