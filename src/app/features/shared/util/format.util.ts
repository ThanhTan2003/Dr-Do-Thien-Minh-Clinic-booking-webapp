export function formatDate(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('vi-VN');
}

export function formatDateTime(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatPhone(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    const match = digits.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
}

export function getBirthYear(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.getFullYear().toString();
}

// Định dạng thẻ BHYT: XX X XX XXX XXX XXXX
export function formatInsuranceId(insuranceId: string): string {
    if (!insuranceId) return '';
    const digits = insuranceId.replace(/\D/g, '');
    const match = digits.match(/^(\d{2})(\d{1})(\d{2})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]}`;
    }
    return insuranceId;
}

// Định dạng số Căn cước công dân: XXXX XXXX XXXX
export function formatNationalId(nationalId: string): string {
    if (!nationalId) return '';
    const digits = nationalId.replace(/\D/g, '');
    const match = digits.match(/^(\d{4})(\d{4})(\d{4})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return nationalId;
}
