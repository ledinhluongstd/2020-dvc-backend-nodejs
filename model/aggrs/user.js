// user.js
'use strict';

class UserAggr {
  constructor() { }

  notAdminAndActive(adminId, sort = 1) {
    return [
      { "$match": { "_id": { $ne: adminId } } },
      { "$match": { "isActive": true } }
    ];
  };

  countDashboard(){
    return [
      { "$match": { "isActive": true } },
      {
        "$group": {
          "_id": {
            "TrangThai": "$KichHoat",
          },
          "count": { $sum: 1 },
        }
      },
      {
        "$project": {
          "_id": 0,
          "TrangThai": "$_id.TrangThai",
          "count": 1
        }
      },
    ]
  }
};
var userAggr = new UserAggr();

module.exports = userAggr;