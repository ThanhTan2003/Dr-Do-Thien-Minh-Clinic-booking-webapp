import { TagResponse } from './tag-response.model';

export interface ZaloUserResponse {
  id: string;
  displayName: string;
  avatar: string;
  status: boolean;
  chatLink: string;
  tags: TagResponse[];
}