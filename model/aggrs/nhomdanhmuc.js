class NhomDanhMucAggr {
  constructor() { }

  countDashboard(){
    return [
      { "$match": { "isActive": true } },
      {
        "$group": {
          "_id": {
            "Nhom": "$NhomDanhMucCha.Ma",
            "TenNhom": "$NhomDanhMucCha.Ten",
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
var nhomDanhMucAggr = new NhomDanhMucAggr();

module.exports = nhomDanhMucAggr;