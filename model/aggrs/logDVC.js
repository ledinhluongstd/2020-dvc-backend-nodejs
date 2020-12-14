class LogDVCAggr {
  constructor() { }

  countSuccessOrErrorByTime(fromDate, toDate) {
    let query = {}
    if (!fromDate || !toDate) {

    } else {
      query = { "$and": [{ createdAt: { "$gte": Number(fromDate) } }, { createdAt: { "$lte": Number(toDate) } }] }
    }
    return [
      { "$match": query },
      {
        "$project": {
          "KQ": { "$cond": [{ "$and": [{ "$gte": ["$response.status", 200] }, { "$lt": ["$response.status", 300] }] }, "SUCCESS", "ERROR"] }
        }
      },
      {
        "$group": {
          "_id": {
            "KQ": "$KQ"
          },
          "count": { "$sum": 1 }
        }
      },
      {
        "$project": {
          "KQ": "$_id.KQ",
          "count": 1,
          "_id": 0
        }
      },
    ]
  }

  countTopSuccessSerrvice() {
    return [
      {
        "$match": {
          "response.status": { "$gte": 200 },
          "response.status": { "$lt": 300 }
        }
      },
      {
        "$group": {
          "_id": {
            "Url": "$service.Url"
          },
          "count": { "$sum": 1 }
        }
      },
      {
        "$project": {
          "Url": "$_id.Url",
          "count": 1,
          "_id": 0
        }
      },
    ]
  }

  countTopSuccessUnit() {
    return [
      {
        "$match": {
          "response.status": { "$gte": 200 },
          "response.status": { "$lt": 300 }
        }
      },
      {
        "$group": {
          "_id": {
            "Unit": "$unit.Ma"
          },
          "count": { "$sum": 1 }
        }
      },
      {
        "$project": {
          "Unit": "$_id.Unit",
          "count": 1,
          "_id": 0
        }
      },
    ]
  }

  statisticalSuccessOrErrorServiceByTime(url, fromDate, toDate) {
    let query = {}
    if (!url || !fromDate || !toDate) {

    } else {
      query = { "$and": [{ "service.Url": url.toString() }, { createdAt: { "$gte": Number(fromDate) } }, { createdAt: { "$lte": Number(toDate) } }] }
    }
    return [
      { "$match": query },
      {
        "$project": {
          "KQ": { "$cond": [{ "$and": [{ "$gte": ["$response.status", 200] }, { "$lt": ["$response.status", 300] }] }, "SUCCESS", "ERROR"] }
        }
      },
      {
        "$group": {
          "_id": {
            "KQ": "$KQ"
          },
          "count": { "$sum": 1 }
        }
      },
      {
        "$project": {
          "KQ": "$_id.KQ",
          "count": 1,
          "_id": 0
        }
      },
    ]
  }

  statisticalSuccessOrErrorUnitByTime(code, fromDate, toDate) {
    let query = {}
    if (!code || !fromDate || !toDate) {

    } else {
      query = { "$and": [{ "unit.code": code.toString() }, { createdAt: { "$gte": Number(fromDate) } }, { createdAt: { "$lte": Number(toDate) } }] }
    }
    return [
      { "$match": query },
      {
        "$project": {
          "KQ": { "$cond": [{ "$and": [{ "$gte": ["$response.status", 200] }, { "$lt": ["$response.status", 300] }] }, "SUCCESS", "ERROR"] }
        }
      },
      {
        "$group": {
          "_id": {
            "KQ": "$KQ"
          },
          "count": { "$sum": 1 }
        }
      },
      {
        "$project": {
          "KQ": "$_id.KQ",
          "count": 1,
          "_id": 0
        }
      },
    ]
  }
  
  statisticalSuccessOrErrorDVUngDungByTime(code, fromDate, toDate) {
    let query = {}
    if (!code || !fromDate || !toDate) {

    } else {
      query = { "$and": [{ "dvud.code": code.toString() }, { createdAt: { "$gte": Number(fromDate) } }, { createdAt: { "$lte": Number(toDate) } }] }
    }
    return [
      { "$match": query },
      {
        "$project": {
          "KQ": { "$cond": [{ "$and": [{ "$gte": ["$response.status", 200] }, { "$lt": ["$response.status", 300] }] }, "SUCCESS", "ERROR"] }
        }
      },
      {
        "$group": {
          "_id": {
            "KQ": "$KQ"
          },
          "count": { "$sum": 1 }
        }
      },
      {
        "$project": {
          "KQ": "$_id.KQ",
          "count": 1,
          "_id": 0
        }
      },
    ]
  }
};


var logDVCAggr = new LogDVCAggr();

module.exports = logDVCAggr;