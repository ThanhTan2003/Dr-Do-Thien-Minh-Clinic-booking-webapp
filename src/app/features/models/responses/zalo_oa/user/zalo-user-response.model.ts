import { TagResponse } from './tag-response.model';

export interface ZaloUserResponse {
  id: string;
  displayName: string;
  userAlias: string;
  avatar: string;
  phone: string;
  nameSharedInfo: string;
  address: string;
  status: boolean;
  userLastInteractionDate: string; // hoặc Date nếu bạn sẽ parse về kiểu `Date`
  chatLink: string;
  numberOfPatient: number;
  numberOfAppointment: number;
  tags: TagResponse[];
}
