class ThongKeAggr {
  constructor() { }

  countCounterStatistics(LoaiThongKe, TuNgay, ToiNgay) {//COUNTER_STATISTICS
    let query = { LoaiThongKe: LoaiThongKe, "$and": [{ createdAt: { "$gt": Number(TuNgay) } }, { createdAt: { "$lt": Number(ToiNgay) } }] }
    return [
      { "$match": query },
      // {
      //   "$group": {
      //     "_id": {
      //       "Nhom": "$type",
      //       "TenNhom": "$type",
      //     },
      //     "count": { $sum: 1 },
      //   }
      // },
      // {
      //   "$project": {
      //     "_id": 0,
      //     "Nhom": "$_id.TenNhom",
      //     "count": 1
      //   }
      // },
    ]
  }
  countCategorySearchStatistics(LoaiThongKe, TuNgay, ToiNgay) {//CATEGORY_SEARCH_STATISTICS
    let query = { LoaiThongKe: LoaiThongKe, "$and": [{ createdAt: { "$gt": Number(TuNgay) } }, { createdAt: { "$lt": Number(ToiNgay) } }] }
    return [
      { "$match": query },
      // {
      //   "$group": {
      //     "_id": {
      //       "Nhom": "$type",
      //       "TenNhom": "$type",
      //     },
      //     "count": { $sum: 1 },
      //   }
      // },
      // {
      //   "$project": {
      //     "_id": 0,
      //     "Nhom": "$_id.TenNhom",
      //     "count": 1
      //   }
      // },
    ]
  }
  countPublicCategorySearchStatistics(LoaiThongKe, TuNgay, ToiNgay) {//PUBLIC_CATEGORY_SEARCH_STATISTICS
    let query = { LoaiThongKe: LoaiThongKe, "$and": [{ createdAt: { "$gt": Number(TuNgay) } }, { createdAt: { "$lt": Number(ToiNgay) } }] }
    return [
      { "$match": query },
      // {
      //   "$group": {
      //     "_id": {
      //       "Nhom": "$type",
      //       "TenNhom": "$type",
      //     },
      //     "count": { $sum: 1 },
      //   }
      // },
      // {
      //   "$project": {
      //     "_id": 0,
      //     "Nhom": "$_id.TenNhom",
      //     "count": 1
      //   }
      // },
    ]
  }
};
var thongKeAggr = new ThongKeAggr();

module.exports = thongKeAggr;