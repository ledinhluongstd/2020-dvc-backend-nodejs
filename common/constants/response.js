module.exports = Object.freeze({

   RESPONSE_ERR_BADREQUEST: {
      status: 400,
      body: {
         message: 'Yêu cầu không hợp lệ'
      }
   },
   RESPONSE_ERR_NOTFOUND: {
      status: 404,
      body: {
         message: 'Không tìm thấy tài nguyên'
      }
   },
   RESPONSE_ERR_TOO_MANY_REQUEST: {
      status: 429,
      body: {
         message: 'Số lượng yêu cầu vượt quá giới hạn'
      }
   },
   RESPONSE_ERR_DATABASE: {
      status: 500,
      body: {
         message: 'Lỗi kết nối CSDL'
      }
   },
   RESPONSE_ERR_SIGNIN: {
      status: 400,
      body: {
         message: 'Tài khoản hoặc mật khẩu không chính xác'
      }
   },
   RESPONSE_ERR_NO_PERMISSION_SIGNIN: {
      status: 400,
      body: {
         message: 'Tài khoản chưa được cấp quyền thao tác hệ thống'
      }
   },
   RESPONSE_ERR_SIGNIN_ACTIVE: {
      status: 400,
      body: {
         message: 'Tài khoản chưa được kích hoạt'
      }
   },
   RESPONSE_ERR_NOTAUTHORIZED: {
      status: 401,
      body: {
         message: 'Lỗi xác thực tài khoản'
      }
   },
   RESPONSE_ERR_UNIT_NOTAUTHORIZED: {
      status: 401,
      body: {
         message: 'Mã xác thực không tồn tại hoặc hết hạn'
      }
   },
   RESPONSE_ERR_SERVICE: {
      status: 500,
      body: {
         message: 'Lỗi kết nối dịch vụ'
      }
   },
   RESPONSE_ERR_FORMAT_JSON: {
      status: 415,
      body: {
         message: "Dữ liệu không phù hợp (Unsupported media type if request doesn't have JSON body)"
      }
   },
   RESPONSE_ERR_PERMISTION: {
      status: 405,
      body: {
         message: "Tài khoản không có quyền thực hiện thao tác này"
      }
   },
   RESPONSE_ERR_CODE_EXITSTED: {
      status: 400,
      body: {
         message: "Dữ liệu có Mã tương ứng đã tồn tại"
      }
   },
   RESPONSE_ERR_SETTING_NO_ACTIVE: {
      status: 400,
      body: {
         message: "Dữ liệu cấu hình không được kích hoạt hoặc không tồn tại"
      }
   },
   RESPONSE_ERR_UNIT_NO_ACTIVE: {
      status: 400,
      body: {
         message: "Dữ liệu đơn vị không được kích hoạt"
      }
   },
   RESPONSE_ERR_CSDL_HTTT_NO_ACTIVE: {
      status: 400,
      body: {
         message: "Dữ liệu CSDL/HTTT không được kích hoạt"
      }
   },
   // PAXH_PROCESS_STATES: {
   //    NEW: 0,
   //    CANCELED: 1,
   //    REJECTED: 30,
   //    ACCEPTED: 10,
   //    PROCESSING: 11,
   //    FINISHED: 20
   // },

   // ROLES:{
   //    USERS: "users",
   //    GOV_RECEPTIONISTS: "gov-receptionists",
   //    GOV_PROCESS: "gov-process"
   // }
});