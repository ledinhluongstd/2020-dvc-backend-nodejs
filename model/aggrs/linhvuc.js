class DanhMucAggr {
  constructor() { }

  countDashboard(){
    return [
      { "$match": { "isActive": true } },
      {
        "$group": {
          "_id": {
            "Nhom": "$DonViCha.Ma",
            "TenNhom": "$DonViCha.Ten",
          },
          "count": { $sum: 1 },
        }
      },
      {
        "$project": {
          "_id": 0,
          "Nhom": "$_id.TenNhom",
          "count": 1
        }
      },
    ]
  }
};
var danhMucAggr = new DanhMucAggr();

module.exports = danhMucAggr;