/**
 * Centralized date utilities using dayjs
 * Unix timestamp in seconds is used for API/DTO
 */
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);

/** Format Unix timestamp (seconds) to YYYY-MM-DD */
export function formatDateYMD(timestamp: number): string {
    return dayjs.unix(timestamp).format('YYYY-MM-DD');
}

/** Format Unix timestamp to display string (MMMM DD, YYYY) */
export function formatDateLong(timestamp: number): string {
    return dayjs.unix(timestamp).format('MMMM DD, YYYY');
}

/** Format Unix timestamp to short display (MMM DD, YYYY) */
export function formatDateShort(timestamp: number): string {
    return dayjs.unix(timestamp).format('MMM DD, YYYY');
}

/** Format Unix timestamp to compact (DD MMM YYYY) */
export function formatDateCompact(timestamp: number): string {
    return dayjs.unix(timestamp).format('DD MMM YYYY');
}

/** Parse YYYY-MM-DD string to Unix timestamp (seconds) */
export function parseToTimestamp(dateStr: string): number {
    return dayjs(dateStr).startOf('day').unix();
}

/** Get today as YYYY-MM-DD */
export function todayYMD(): string {
    return dayjs().format('YYYY-MM-DD');
}

/** Get today as Unix timestamp (seconds) */
export function todayTimestamp(): number {
    return dayjs().startOf('day').unix();
}

/** Format timestamp for chart by range type (timestamp can be Unix seconds or date string) */
export function formatChartDate(value: number | string, rangeType: 'day' | 'month' | 'quarter'): string {
    const d = typeof value === 'number' ? dayjs.unix(value) : dayjs(value);
    switch (rangeType) {
        case 'day':
            return d.format('MMM DD');
        case 'month':
            return d.format('MMM YYYY');
        case 'quarter':
            return `Q${d.quarter()} ${d.format('YYYY')}`;
        default:
            return d.format('MMM DD');
    }
}

export { dayjs };
