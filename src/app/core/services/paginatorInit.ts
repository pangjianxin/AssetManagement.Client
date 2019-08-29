import { MatPaginatorIntl } from '@angular/material/paginator';
const getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) {
        return `无数据返回`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `第 ${startIndex + 1}-${endIndex} 条记录 共${length}条记录`;
};
export function myPaginator() {
    const p = new MatPaginatorIntl();
    p.getRangeLabel = getRangeLabel;
    p.itemsPerPageLabel = '当前页数';
    p.nextPageLabel = '下一页';
    p.previousPageLabel = '上一页';
    p.firstPageLabel = '第一页';
    p.lastPageLabel = '最后一页';
    return p;
}
