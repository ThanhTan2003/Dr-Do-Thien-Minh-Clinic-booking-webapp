export interface FileResponse {
    // Tên gốc của tệp khi người dùng tải lên
    originalFileName: string;

    // Tên tệp đã được lưu trên hệ thống (sau khi xử lý hoặc đổi tên)
    fileName: string;

    // Kích thước tệp (byte)
    size: number;

    // Đường dẫn URL truy cập tệp
    url: string;
}  