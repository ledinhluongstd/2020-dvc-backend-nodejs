// test.js
'use strict';

class TestAggr {
  constructor() { }

  aggrA(time, sort = 1) {
    return [
      { "$match": { "ThoiGian": { $gt: time } } },
      { "$sort": { "ThoiGian": sort } },
    ];
  }

  aggrCountByDay(sort = 1) {
    return [
      // { "$match": { "ThoiGian": { $gt: time } } },
      {
        "$group": {
          "_id": {
            "ThoiGian": "$ThoiGian"
          },
          "count": { $sum: 1 },
          "name": { $addhToSet: "$name" }
        }
      },
      {
        "$project": {
          "_id": 0,
          "ThoiGian": "$_id.ThoiGian",
          "name": 1,
          "count": 1
        }
      },
      { "$sort": { "ThoiGian": sort } }
    ];
  }
};
var testAggr = new TestAggr();

module.exports = testAggr;