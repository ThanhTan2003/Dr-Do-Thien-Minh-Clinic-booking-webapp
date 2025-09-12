import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../shared/services/patient/patient.service';
import { PatientTagService } from '../../../../shared/services/patient/patient-tag.service';
import { Patient } from '../../../../models/responses/patient/patient.model';
import { PageResponse } from '../../../../models/responses/page-response.model';
import { ZaloUserResponse } from '../../../../models/responses/zalo_oa/user/zalo-user-response.model';
import { PageSizeSelectorComponent } from '../../../shared/components/page-size-selector/page-size-selector.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faRotate, faPenToSquare, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {getBirthYear, formatNationalId} from '../../../../shared/util/format.util';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-patient-crud',
  templateUrl: './list-patient-crud.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, PageSizeSelectorComponent, PaginationComponent, RouterModule]
})
export class ListPatientCrudComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;
  faRotate = faRotate;
  faPenToSquare = faPenToSquare;
  faCircleQuestion = faCircleQuestion;

  patients: Patient[] = [];
  tags: string[] = [];
  selectedTag: string = '';
  keyword: string = '';
  loading: boolean = false;

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  totalElements: number = 0;

  constructor(
    private patientService: PatientService,
    private patientTagService: PatientTagService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Chỉ cập nhật các giá trị nếu chúng thực sự thay đổi
      const newPage = +params['page'] || 1;
      const newSize = +params['size'] || 10;
      const newKeyword = params['keyword'] || '';
      const newTag = params['tag'] || '';
      
      // Kiểm tra xem có cần cập nhật không
      if (newPage !== this.currentPage || 
          newSize !== this.pageSize || 
          newKeyword !== this.keyword || 
          newTag !== this.selectedTag) {
        
        this.currentPage = newPage;
        this.pageSize = newSize;
        this.keyword = newKeyword;
        this.selectedTag = newTag;
        
        this.loadTags();
        this.loadPatients();
      }
    });
    
    this.loadTags();
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt về đầu trang
  }

  loadTags(): void {
    this.patientTagService.getAllDistinctTags().subscribe({
      next: (tags: string[]) => {
        this.tags = tags;
      },
      error: (err) => {
        console.error('Error loading tags:', err);
      }
    });
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.searchPatients(
      this.keyword,
      this.selectedTag,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (res: PageResponse<Patient>) => {
        this.patients = res.data;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading patients:', err);
      }
    });
  }

  updateQueryParams() {
    const queryParams: any = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword
    };
    
    // Chỉ thêm tag nếu có giá trị
    if (this.selectedTag && this.selectedTag.trim() !== '') {
      queryParams.tag = this.selectedTag;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true // Sử dụng replaceUrl thay vì merge
    });
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadPatients();
  }
  
  handleTagChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadPatients();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.loadPatients();
  }
  
  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadPatients();
  }

  handleRefresh(): void {
    this.keyword = '';
    this.selectedTag = '';
    this.currentPage = 1;
    this.loadPatients();
  }

  goToProcess(patientId: string, zaloUid: string): void {
    // Lưu các tham số tìm kiếm vào localStorage trước khi chuyển trang
    const searchParams = {
      page: this.currentPage,
      size: this.pageSize,
      keyword: this.keyword,
      tag: this.selectedTag
    };
    localStorage.setItem('patientListSearchParams', JSON.stringify(searchParams));
    
    // Chuyển đến detail page
    this.router.navigate([patientId, zaloUid], { relativeTo: this.route });
  }

  getBirthYear(day: string): string{
      return getBirthYear(day);
  }

  formatNationalId(insuranceId: string): string{
    return formatNationalId(insuranceId);
  }
}
 