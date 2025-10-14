/**
 * Utility functions for status operations
 */

/**
 * Interface định nghĩa cấu trúc status mapping
 */
export interface StatusMapping {
    [key: string]: string;
}

/**
 * Mảng trạng thái và màu sắc tương ứng cho danh sách (list view)
 */
export const STATUS_COLOR_MAP_LIST: StatusMapping = {
    "Chờ xác nhận": "bg-orange-50 text-orange-600 border border-orange-600",
    "Chờ khám": "bg-blue-50 text-blue-600 border border-blue-600", 
    "Đã huỷ": "bg-red-50 text-red-600 border border-red-600",
    "Đã khám": "bg-green-50 text-green-600 border border-green-600",
    "Đã xác nhận": "bg-purple-50 text-purple-600 border border-purple-600"
};

/**
 * Mảng trạng thái và màu sắc tương ứng cho form (form view)
 */
export const STATUS_COLOR_MAP_FORM: StatusMapping = {
    "Chờ xác nhận": "text-orange-700",
    "Chờ khám": "text-green-700",
    "Đã huỷ": "text-red-700", 
    "Đã khám": "text-blue-700",
    "Đã xác nhận": "text-purple-700"
};

/**
 * Mảng trạng thái và màu sắc tương ứng cho badge
 */
export const STATUS_COLOR_MAP_BADGE: StatusMapping = {
    "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
    "Chờ khám": "bg-blue-100 text-blue-800",
    "Đã huỷ": "bg-red-100 text-red-800",
    "Đã khám": "bg-green-100 text-green-800",
    "Đã xác nhận": "bg-purple-100 text-purple-800"
};

/**
 * Danh sách các trạng thái có thể cập nhật
 */
export const UPDATABLE_STATUSES: string[] = [
    'Đã khám', 
    'Chờ khám', 
    'Đã huỷ'
];

/**
 * Danh sách tất cả các trạng thái
 */
export const ALL_STATUSES: string[] = [
    'Chờ xác nhận',
    'Đã xác nhận', 
    'Chờ khám',
    'Đã khám',
    'Đã huỷ'
];

/**
 * Hàm trả về màu sắc cho danh sách, nếu không có trong danh sách thì trả về màu xám
 * @param status - Trạng thái cần lấy màu
 * @returns CSS classes cho màu sắc
 */
export function getStatusClassForList(status: string): string {
    return STATUS_COLOR_MAP_LIST[status] || 'bg-gray-50 text-gray-600 border border-gray-600';
}

/**
 * Hàm trả về màu sắc cho form, nếu không có trong danh sách thì trả về màu xám
 * @param status - Trạng thái cần lấy màu
 * @returns CSS classes cho màu sắc
 */
export function getStatusClassForForm(status: string): string {
    return STATUS_COLOR_MAP_FORM[status] || 'text-gray-700';
}

/**
 * Hàm trả về màu sắc cho badge, nếu không có trong danh sách thì trả về màu xám
 * @param status - Trạng thái cần lấy màu
 * @returns CSS classes cho màu sắc
 */
export function getStatusClassForBadge(status: string): string {
    return STATUS_COLOR_MAP_BADGE[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Kiểm tra xem trạng thái có thể cập nhật được không
 * @param status - Trạng thái cần kiểm tra
 * @returns true nếu có thể cập nhật, false nếu không
 */
export function isStatusUpdatable(status: string): boolean {
    return UPDATABLE_STATUSES.includes(status);
}

/**
 * Lấy danh sách trạng thái có thể cập nhật
 * @returns Mảng các trạng thái có thể cập nhật
 */
export function getUpdatableStatuses(): string[] {
    return [...UPDATABLE_STATUSES];
}

/**
 * Lấy danh sách tất cả trạng thái
 * @returns Mảng tất cả các trạng thái
 */
export function getAllStatuses(): string[] {
    return [...ALL_STATUSES];
}

/**
 * Kiểm tra xem trạng thái có hợp lệ không
 * @param status - Trạng thái cần kiểm tra
 * @returns true nếu hợp lệ, false nếu không
 */
export function isValidStatus(status: string): boolean {
    return ALL_STATUSES.includes(status);
}

/**
 * Lấy trạng thái mặc định
 * @returns Trạng thái mặc định
 */
export function getDefaultStatus(): string {
    return 'Chờ xác nhận';
}

/**
 * Lấy trạng thái tiếp theo có thể chuyển đổi từ trạng thái hiện tại
 * @param currentStatus - Trạng thái hiện tại
 * @returns Mảng các trạng thái có thể chuyển đổi
 */
export function getNextPossibleStatuses(currentStatus: string): string[] {
    const statusFlow: { [key: string]: string[] } = {
        'Chờ xác nhận': ['Đã xác nhận', 'Đã huỷ'],
        'Đã xác nhận': ['Chờ khám', 'Đã huỷ'],
        'Chờ khám': ['Đã khám', 'Đã huỷ'],
        'Đã khám': [], // Không thể chuyển đổi từ trạng thái này
        'Đã huỷ': [] // Không thể chuyển đổi từ trạng thái này
    };
    
    return statusFlow[currentStatus] || [];
}

/**
 * Mảng trạng thái bác sĩ gợi ý (ServiceDoctorSuggestionStatus) và màu chữ tương ứng
 * Key: code (từ BE)
 */
export const SUGGESTED_DOCTOR_STATUS_COLOR_MAP: StatusMapping = {
    "00": "text-gray-700",      // Tất cả
    "01": "text-green-700",     // Chưa có lịch khám
    "02": "text-orange-700",    // Đã có lịch khám
    "03": "text-sky-700",     // Nhận đăng ký khám
    "04": "text-orange-600",    // Không nhận đăng ký khám
    "05": "text-red-700",       // Đã ngừng khám dịch vụ
    "06": "text-purple-700",    // Nghỉ phép
    "07": "text-gray-500"       // Ngừng làm việc
};

/**
 * Hàm trả về màu sắc cho trạng thái bác sĩ gợi ý theo code
 * @param code - Mã trạng thái từ BE
 * @returns CSS class màu chữ
 */
export function getDoctorSuggestionStatusClass(code: string): string {
    return SUGGESTED_DOCTOR_STATUS_COLOR_MAP[code] || "text-gray-700";
}