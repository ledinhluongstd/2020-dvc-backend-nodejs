class DonViAggr {
  constructor() { }

  countDashboard(){
    return [
      { "$match": { "isActive": true } },
      {
        "$group": {
          "_id": {
            "Khoi": "$KhoiDonVi.Ma",
            "TenKhoi": "$KhoiDonVi.Ten",
          },
          "count": { $sum: 1 },
          // "name": { $addhToSet: "$name" }
        }
      },
      {
        "$project": {
          "_id": 0,
          "Khoi": "$_id.TenKhoi",
          "count": 1
        }
      },
      // { "$sort": { "ThoiGian": sort } }
    ]
  }
};
var donViAggr = new DonViAggr();

module.exports = donViAggr;