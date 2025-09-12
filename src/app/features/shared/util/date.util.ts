/**
 * Utility functions for date operations
 */

/**
 * Chuyển đổi Date object sang chuỗi định dạng dd/MM/yyyy
 * @param date - Date object
 * @returns Chuỗi ngày định dạng dd/MM/yyyy
 */
export function formatDateToString(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Lấy năm sinh từ ngày sinh và trả về dưới dạng chuỗi
 * @param date - Ngày sinh (Date object)
 * @returns Năm sinh dưới dạng chuỗi
 */
export function getBirthYearAsString(date: Date): string {
    const birthYear = date.getFullYear();
    return birthYear.toString();  // Trả về năm sinh dưới dạng chuỗi
}

/**
 * Lấy tên ngày trong tuần bằng tiếng Việt
 * @param date - Ngày cần lấy tên
 * @returns Tên ngày trong tuần bằng tiếng Việt
 */
export function getVietnameseDayName(date: Date): string {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
}

/**
 * Lấy tên ngày trong tuần ngắn gọn
 * @param date - Ngày cần lấy tên
 * @returns Tên ngày ngắn gọn (CN, T2, T3, ...)
 */
export function getShortVietnameseDayName(date: string | Date): string {
    if (!date) return '';
    
    const dateObj = new Date(date);
    const shortDayNames = [
        'CN',
        'T2', 
        'T3',
        'T4',
        'T5',
        'T6',
        'T7'
    ];
    
    return shortDayNames[dateObj.getDay()];
}

/**
 * Lấy tên tháng bằng tiếng Việt
 * @param date - Ngày cần lấy tên tháng
 * @returns Tên tháng (Tháng 1, Tháng 2, ...)
 */
export function getVietnameseMonthName(date: string | Date): string {
    if (!date) return '';
    
    const dateObj = new Date(date);
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
        'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    
    return monthNames[dateObj.getMonth()];
}

/**
 * Kiểm tra xem ngày có phải là hôm nay không
 * @param date - Ngày cần kiểm tra
 * @returns true nếu là hôm nay, false nếu không
 */
export function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

/**
 * Kiểm tra xem ngày có phải là quá khứ không
 * @param date - Ngày cần kiểm tra
 * @returns true nếu là quá khứ, false nếu không
 */
export function isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

/**
 * Kiểm tra xem ngày có phải là tương lai không
 * @param date - Ngày cần kiểm tra
 * @returns true nếu là tương lai, false nếu không
 */
export function isFutureDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
}

/**
 * Kiểm tra xem ngày có hợp lệ không (tồn tại trong lịch)
 * @param day - Ngày (1-31)
 * @param month - Tháng (1-12)
 * @param year - Năm
 * @returns true nếu ngày hợp lệ, false nếu không
 */
export function isValidDate(day: number, month: number, year: number): boolean {
    // Kiểm tra các giá trị cơ bản
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
        return false;
    }

    // Tạo Date object để kiểm tra
    const date = new Date(year, month - 1, day);
    
    // Kiểm tra xem ngày có đúng không (Date object sẽ tự động điều chỉnh nếu ngày không hợp lệ)
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
}

/**
 * Kiểm tra xem chuỗi ngày có đúng định dạng dd/MM/yyyy không
 * @param dateString - Chuỗi ngày cần kiểm tra
 * @returns true nếu đúng định dạng, false nếu không
 */
export function isValidDateFormat(dateString: string): boolean {
    // Regex để kiểm tra định dạng dd/MM/yyyy
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
        return false;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    return isValidDate(day, month, year);
}

/**
 * Chuyển đổi chuỗi ngày từ định dạng dd/MM/yyyy sang Date object
 * @param dateString - Chuỗi ngày định dạng dd/MM/yyyy
 * @returns Date object hoặc null nếu không hợp lệ
 */
export function parseDateFromString(dateString: string): Date | null {
    if (!isValidDateFormat(dateString)) {
        return null;
    }

    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    return new Date(year, month - 1, day);
}

/**
 * Chuyển đổi chuỗi ngày từ định dạng dd/MM/yyyy sang định dạng yyyy-MM-dd cho input type="date"
 * @param dateString - Chuỗi ngày định dạng dd/MM/yyyy
 * @returns Chuỗi ngày định dạng yyyy-MM-dd hoặc chuỗi rỗng nếu không hợp lệ
 */
export function convertToDateInputFormat(dateString: string): string {
    const date = parseDateFromString(dateString);
    if (!date) {
        return '';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * Chuyển đổi từ định dạng yyyy-MM-dd sang dd/MM/yyyy
 * @param dateString - Chuỗi ngày định dạng yyyy-MM-dd
 * @returns Chuỗi ngày định dạng dd/MM/yyyy hoặc chuỗi rỗng nếu không hợp lệ
 */
export function convertFromDateInputFormat(dateString: string): string {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '';
    }

    return formatDateToString(date);
}

/**
 * Kiểm tra xem ngày sinh có hợp lệ cho bệnh nhân không
 * @param dateString - Chuỗi ngày sinh định dạng dd/MM/yyyy
 * @returns object chứa kết quả kiểm tra và thông báo lỗi
 */
export function validateBirthDate(dateString: string): { isValid: boolean; errorMessage: string } {
    if (!dateString) {
        return { isValid: false, errorMessage: 'Ngày sinh không được để trống' };
    }

    if (!isValidDateFormat(dateString)) {
        return { isValid: false, errorMessage: 'Ngày sinh không đúng định dạng dd/MM/yyyy' };
    }

    const date = parseDateFromString(dateString);
    if (!date) {
        return { isValid: false, errorMessage: 'Ngày sinh không hợp lệ' };
    }

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    // Điều chỉnh tuổi nếu chưa đến sinh nhật trong năm nay
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
    }

    if (age < 0) {
        return { isValid: false, errorMessage: 'Ngày sinh không thể là tương lai' };
    }

    if (age > 120) {
        return { isValid: false, errorMessage: 'Ngày sinh không hợp lệ (tuổi quá cao)' };
    }

    return { isValid: true, errorMessage: '' };
}

/**
 * Lấy số ngày giữa hai ngày
 * @param startDate - Ngày bắt đầu
 * @param endDate - Ngày kết thúc
 * @returns Số ngày giữa hai ngày
 */
export function getDaysBetween(startDate: string | Date, endDate: string | Date): number {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Thêm số ngày vào một ngày
 * @param date - Ngày gốc
 * @param days - Số ngày cần thêm
 * @returns Ngày mới
 */
export function addDays(date: string | Date, days: number): Date {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
}

/**
 * Trừ số ngày từ một ngày
 * @param date - Ngày gốc
 * @param days - Số ngày cần trừ
 * @returns Ngày mới
 */
export function subtractDays(date: string | Date, days: number): Date {
    return addDays(date, -days);
} 