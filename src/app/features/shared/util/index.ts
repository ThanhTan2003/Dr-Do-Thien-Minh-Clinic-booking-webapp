/**
 * Index file for all utility functions
 * Import all utilities from this file for easier management
 */

// Format utilities
export {
    formatDate,
    formatDateTime,
    formatPhone,
    getBirthYear,
    formatInsuranceId,
    formatNationalId
} from './format.util';

// Date utilities
export {
    getVietnameseDayName,
    getShortVietnameseDayName,
    getVietnameseMonthName,
    isToday,
    isPastDate,
    isFutureDate,
    isValidDate,
    isValidDateFormat,
    parseDateFromString,
    formatDateToString,
    convertToDateInputFormat,
    convertFromDateInputFormat,
    validateBirthDate,
    getDaysBetween,
    addDays,
    subtractDays
} from './date.util';

// Status utilities
export type { StatusMapping } from './status.util';
export {
    STATUS_COLOR_MAP_LIST,
    STATUS_COLOR_MAP_FORM,
    STATUS_COLOR_MAP_BADGE,
    UPDATABLE_STATUSES,
    ALL_STATUSES,
    getStatusClassForList,
    getStatusClassForForm,
    getStatusClassForBadge,
    isStatusUpdatable,
    getUpdatableStatuses,
    getAllStatuses,
    isValidStatus,
    getDefaultStatus,
    getNextPossibleStatuses
} from './status.util'; 