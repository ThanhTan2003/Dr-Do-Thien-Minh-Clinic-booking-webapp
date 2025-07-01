import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faCaretDown, faHome } from '@fortawesome/free-solid-svg-icons';
import { ModalDetailComponent } from '../../../shared/components/modal-detail.component';
import { ServiceCategoryService } from '../../../shared/services/medical/service-category.service';
import { ServiceCategory } from '../../../models/responses/medical/service-category.model';

@Component({
  selector: 'app-service-category',
  templateUrl: './service-category.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalDetailComponent, FontAwesomeModule, RouterOutlet]
})
export class ServiceCategoryComponent implements OnInit, OnDestroy {
  serviceCategories: ServiceCategory[] = [];
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;
  keyword = '';
  loading = false;
  serviceCategoryId: string | null = null;

  isModalOpen = false;
  modalContent = { title: '', content: '' };

  faMagnifyingGlass = faMagnifyingGlass;
  faCaretDown = faCaretDown;
  faHome = faHome;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.serviceCategoryId = params.get('serviceCategoryId');
      this.currentPage = 1;
      this.serviceCategories = [];
      this.fetchServiceCategories();
      this.cdr.detectChanges();
    });
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.fetchServiceCategories();
      });
  }

  fetchServiceCategories(): void {
    this.loading = true;
    this.serviceCategoryService
      .searchByCustomer(this.keyword, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.totalPages = res.totalPages || 1;
          this.serviceCategories = this.currentPage === 1 ? res.data : [...this.serviceCategories, ...res.data];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching service categories:', err);
          this.loading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.keyword);
  }

  getShortenedDescription(description: string, maxLength: number): string {
    if (!description || description.length <= maxLength) {
      return description || '';
    }

    let shortened = description.substring(0, maxLength);
    const lastSpaceIndex = shortened.lastIndexOf(' ');

    if (lastSpaceIndex !== -1) {
      shortened = shortened.substring(0, lastSpaceIndex);
    }

    return `${shortened}...`;
  }

  openModal(category: ServiceCategory): void {
    this.modalContent = {
      title: category.categoryName.toUpperCase(),
      content: category.description || 'Không có mô tả.',
    };
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchServiceCategories();
    }
  }

  goToService(categoryId: string): void {
    this.serviceCategoryId = categoryId;
    this.router.navigate([categoryId], { relativeTo: this.route });
  }

  getCategoryImage(category: ServiceCategory): string {
    return category.image || 'https://cdn-icons-png.flaticon.com/512/1976/1976945.png';
  }

  goToHome(): void {
    this.router.navigate(['/booking']);
  }
} 