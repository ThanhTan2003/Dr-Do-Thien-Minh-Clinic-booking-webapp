import { ServiceCategory } from './service-category.model';

export interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: string;
  serviceCategoryId: string;
  status: boolean;
  image: string;
  serviceCategoryResponse: ServiceCategory;
}
