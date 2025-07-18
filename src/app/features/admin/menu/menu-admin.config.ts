import {
    faHouse,
    faUserNurse,
    faCalendarDays,
    faUserDoctor,
    faBriefcaseMedical,
    faFileMedical,
    faHospital,
    faHospitalUser,
    faSearch,
    faUserGear,
    faCommentDots,
    faUsers,
    faBell,
    faLayerGroup,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
  
export const AdminMenuItems = [
    {
      id: 'TrangChu',
      label: 'Trang chủ',
      icon: faHouse,
      path: 'trang-chu'
    },

    {
      id: 'LichHenMoi',
      label: 'Lịch hẹn mới',
      icon: faCalendarAlt,
      path: 'lich-hen-moi'
    },

    {
      id: 'BacSi',
      label: 'Bác sĩ',
      icon: faUserNurse,
      path: 'bac-si',
      children: [
        { id: 'DanhSach', label: 'Danh sách', path: 'danh-sach', icon: faUsers },
        { id: 'LichKham', label: 'Lịch khám bệnh', path: 'lich-kham', icon: faCalendarDays },
        { id: 'NghiPhep', label: 'Nghỉ phép', path: 'nghi-phep', icon: faUserDoctor },
        { id: 'NghiLe', label: 'Nghỉ lễ', path: 'nghi-le', icon: faCalendarDays }
      ]
    },

    {
      id: 'YTe',
      label: 'Y tế',
      icon: faBriefcaseMedical,
      path: 'y-te',
      children: [
        // { id: 'PhongKham', label: 'Phòng khám', path: 'phong-kham', icon: faHospital },
        { id: 'DichVu', label: 'Dịch vụ', path: 'dich-vu', icon: faFileMedical },
        { id: 'NhomDichVu', label: 'Nhóm chuyên môn', path: 'nhom-dich-vu', icon: faLayerGroup }
        
        
      ]
    },
  
    {
      id: 'BenhNhan',
      label: 'Bệnh nhân',
      icon: faHospitalUser,
      path: 'benh-nhan',
      children: [
        { id: 'DanhSach', label: 'Danh sách', path: 'danh-sach', icon: faUsers },
        { id: 'LichHen', label: 'Lịch hẹn', path: 'lich-hen', icon: faCalendarDays }
      ]
    },

    {
      id: 'TaiKhoan',
      label: 'Tài khoản',
      icon: faUserGear,
      path: 'tai-khoan',
      children: [
        { id: 'DanhSach', label: 'Danh sách', path: 'danh-sach', icon: faUsers }
      ]
    },

    {
      id: 'ZaloOA',
      label: 'Zalo OA',
      icon: faCommentDots,
      path: 'zalo-oa',
      children: [
        { id: 'NguoiDung', label: 'Người dùng', path: 'nguoi-dung', icon: faUsers },
        { id: 'NhomNguoiDung', label: 'Nhóm người dùng', path: 'nhom-nguoi-dung', icon: faLayerGroup },
        { id: 'GuiThongBao', label: 'Gửi thông báo', path: 'thong-bao', icon: faBell }
      ]
    }
];