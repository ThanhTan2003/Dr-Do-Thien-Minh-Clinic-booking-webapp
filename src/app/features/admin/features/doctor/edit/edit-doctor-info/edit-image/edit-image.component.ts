import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX, faPlus, faMinus, faUpload, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
})
export class EditImageComponent implements OnInit {
  @Input() initialImageSource: string = '';
  @Output() imageCropped = new EventEmitter<Blob>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  faX = faX;
  faPlus = faPlus;
  faMinus = faMinus;
  faUpload = faUpload;
  faPenToSquare = faPenToSquare;
  faCheck = faCheck;

  // Tỷ lệ khung hình (3:4)
  private readonly ASPECT_RATIO = 3 / 4; // chiều rộng / chiều cao

  // Canvas properties
  canvasWidth = 400;
  canvasHeight = 600;

  // Image properties
  private imageX = 0;
  private imageY = 0;
  imageScale = 1;
  baseScale = 1; // Scale ban đầu để fit ảnh vào canvas
  maxScale = 3;
  private originalImage: HTMLImageElement | null = null;
  private originalImageWidth = 0;
  private originalImageHeight = 0;

  // Mouse events
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  imageLoaded = false;

  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Component sẽ chờ user chọn ảnh
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // Kiểm tra định dạng ảnh
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Chỉ hỗ trợ các định dạng: JPEG, JPG, PNG, GIF, WebP', 'Lỗi định dạng');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.originalImage = img;
        this.originalImageWidth = img.width;
        this.originalImageHeight = img.height;
        this.calculateCanvasAndScale();
        this.imageLoaded = true;
        
        // Force change detection và đợi view update
        this.cdr.detectChanges();
        
        // Đảm bảo canvas đã được render trước khi vẽ
        setTimeout(() => {
          this.drawImage();
        }, 10);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private calculateCanvasAndScale(): void {
    const maxCanvasWidth = 500;
    const maxCanvasHeight = 750;

    if (this.originalImageWidth === 0 || this.originalImageHeight === 0) {
      this.canvasWidth = 400;
      this.canvasHeight = 600;
      return;
    }

    // Bước 1: Tính kích thước canvas dựa trên ảnh gốc
    let canvasWidth = this.originalImageWidth;
    let canvasHeight = this.originalImageHeight;

    // Scale canvas nếu quá lớn
    if (canvasWidth > maxCanvasWidth || canvasHeight > maxCanvasHeight) {
      const scaleX = maxCanvasWidth / canvasWidth;
      const scaleY = maxCanvasHeight / canvasHeight;
      const scale = Math.min(scaleX, scaleY);
      canvasWidth = canvasWidth * scale;
      canvasHeight = canvasHeight * scale;
    }

    // Áp dụng tỷ lệ khung hình (3:4)
    if (canvasWidth / canvasHeight > this.ASPECT_RATIO) {
      canvasWidth = canvasHeight * this.ASPECT_RATIO;
    } else {
      canvasHeight = canvasWidth / this.ASPECT_RATIO;
    }

    // Đảm bảo canvas không quá lớn
    if (canvasWidth > maxCanvasWidth) {
      canvasWidth = maxCanvasWidth;
      canvasHeight = maxCanvasWidth / this.ASPECT_RATIO;
    }
    if (canvasHeight > maxCanvasHeight) {
      canvasHeight = maxCanvasHeight;
      canvasWidth = maxCanvasHeight * this.ASPECT_RATIO;
    }

    this.canvasWidth = Math.round(canvasWidth);
    this.canvasHeight = Math.round(canvasHeight);

    // Bước 2: Tính scale để ảnh gốc fit vào canvas theo tỷ lệ khung hình
    // Tìm kích thước lớn nhất của ảnh theo tỷ lệ ASPECT_RATIO
    const imageAspectRatio = this.originalImageWidth / this.originalImageHeight;
    
    let targetWidth: number;
    let targetHeight: number;

    if (imageAspectRatio > this.ASPECT_RATIO) {
      // Ảnh rộng hơn -> dựa vào chiều cao
      targetHeight = this.originalImageHeight;
      targetWidth = targetHeight * this.ASPECT_RATIO;
    } else {
      // Ảnh cao hơn -> dựa vào chiều rộng
      targetWidth = this.originalImageWidth;
      targetHeight = targetWidth / this.ASPECT_RATIO;
    }

    // Tính scale để fit vùng target vào canvas
    const scaleX = this.canvasWidth / targetWidth;
    const scaleY = this.canvasHeight / targetHeight;
    this.baseScale = Math.min(scaleX, scaleY);
    
    // Set imageScale ban đầu bằng baseScale
    this.imageScale = this.baseScale;

    // Căn giữa ảnh
    const scaledWidth = this.originalImageWidth * this.imageScale;
    const scaledHeight = this.originalImageHeight * this.imageScale;
    this.imageX = (this.canvasWidth - scaledWidth) / 2;
    this.imageY = (this.canvasHeight - scaledHeight) / 2;
  }

  drawImage(): void {
    if (!this.canvas || !this.originalImage) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Xóa canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Vẽ ảnh
    ctx.save();
    ctx.translate(this.imageX, this.imageY);
    ctx.scale(this.imageScale, this.imageScale);
    ctx.drawImage(this.originalImage, 0, 0);
    ctx.restore();

    // Vẽ khung chọn (vùng hiển thị)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.setLineDash([]);

    // Vẽ corner guides
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    const cornerSize = 15;
    const corners = [
      [0, 0],
      [this.canvasWidth - cornerSize, 0],
      [0, this.canvasHeight - cornerSize],
      [this.canvasWidth - cornerSize, this.canvasHeight - cornerSize]
    ];
    corners.forEach(([x, y]) => {
      ctx.strokeRect(x, y, cornerSize, cornerSize);
    });
  }

  onCanvasMouseDown(e: MouseEvent): void {
    if (!this.originalImage) return;

    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
  }

  onCanvasMouseMove(e: MouseEvent): void {
    if (!this.isDragging || !this.originalImage) return;

    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;

    this.imageX += deltaX;
    this.imageY += deltaY;

    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;

    this.constrainImagePosition();
    this.drawImage();
  }

  onCanvasMouseUp(): void {
    this.isDragging = false;
  }

  onCanvasMouseLeave(): void {
    this.isDragging = false;
  }

  onZoomIn(): void {
    const oldScale = this.imageScale;
    this.imageScale = Math.min(this.imageScale + 0.1, this.maxScale);
    this.adjustPositionAfterZoom(oldScale, this.imageScale);
    this.drawImage();
  }

  onZoomOut(): void {
    const oldScale = this.imageScale;
    this.imageScale = Math.max(this.imageScale - 0.1, this.baseScale);
    this.adjustPositionAfterZoom(oldScale, this.imageScale);
    this.drawImage();
  }

  onZoomChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const oldScale = this.imageScale;
    this.imageScale = parseFloat(input.value);
    this.adjustPositionAfterZoom(oldScale, this.imageScale);
    this.drawImage();
  }

  private adjustPositionAfterZoom(oldScale: number, newScale: number): void {
    // Zoom từ center của canvas
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    // Điểm center tương đối với ảnh
    const relativeCenterX = (centerX - this.imageX) / oldScale;
    const relativeCenterY = (centerY - this.imageY) / oldScale;

    // Cập nhật vị trí để giữ center point
    this.imageX = centerX - relativeCenterX * newScale;
    this.imageY = centerY - relativeCenterY * newScale;

    this.constrainImagePosition();
  }

  private constrainImagePosition(): void {
    if (!this.originalImage) return;

    const scaledImageWidth = this.originalImageWidth * this.imageScale;
    const scaledImageHeight = this.originalImageHeight * this.imageScale;

    // Giữ ảnh trong canvas (không để lộ viền trắng)
    this.imageX = Math.max(
      this.canvasWidth - scaledImageWidth,
      Math.min(0, this.imageX)
    );
    this.imageY = Math.max(
      this.canvasHeight - scaledImageHeight,
      Math.min(0, this.imageY)
    );
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement?.click();
  }

  cropImage(): void {
    if (!this.canvas || !this.originalImage) return;

    // Tính toán vùng crop trên ảnh gốc (theo tỷ lệ)
    // Tỷ lệ giữa kích thước thực và kích thước hiển thị
    const displayToOriginalRatio = 1 / this.imageScale;

    // Tính toán vùng crop trong tọa độ ảnh gốc
    const cropX = -this.imageX * displayToOriginalRatio;
    const cropY = -this.imageY * displayToOriginalRatio;
    const cropWidth = this.canvasWidth * displayToOriginalRatio;
    const cropHeight = this.canvasHeight * displayToOriginalRatio;

    // Giới hạn vùng crop trong phạm vi ảnh gốc
    const finalCropX = Math.max(0, Math.min(cropX, this.originalImageWidth));
    const finalCropY = Math.max(0, Math.min(cropY, this.originalImageHeight));
    const finalCropWidth = Math.min(cropWidth, this.originalImageWidth - finalCropX);
    const finalCropHeight = Math.min(cropHeight, this.originalImageHeight - finalCropY);

    // Tạo canvas với kích thước theo tỷ lệ khung hình nhưng giữ độ phân giải cao
    const croppedCanvas = document.createElement('canvas');
    
    // Tính kích thước output dựa trên vùng crop thực tế
    const outputWidth = Math.round(finalCropWidth);
    const outputHeight = Math.round(finalCropHeight);
    
    croppedCanvas.width = outputWidth;
    croppedCanvas.height = outputHeight;
    
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;

    // Vẽ vùng crop từ ảnh gốc
    croppedCtx.drawImage(
      this.originalImage,
      finalCropX, finalCropY, finalCropWidth, finalCropHeight, // source
      0, 0, outputWidth, outputHeight // destination
    );

    // Convert canvas to blob với chất lượng cao
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        this.imageCropped.emit(blob);
        this.close();
      }
    }, 'image/jpeg', 0.95);
  }

  getZoomPercentage(): number {
    return Math.round((this.imageScale / this.baseScale) * 100);
  }

  close(): void {
    this.closed.emit();
  }
}