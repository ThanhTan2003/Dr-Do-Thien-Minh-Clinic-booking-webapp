import {
    faHouse,
    faUserNurse,
    faCalendarDays,
    faUserDoctor,
    faBriefcaseMedical,
    faFileMedical,
    faHospital,
    faHospitalUser,
    faUsers,
    faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
  
export const StaffMenuItems = [
    {
      id: 'TrangChu',
      label: 'Trang chủ',
      icon: faHouse,
      path: 'dashboard'
    },

    {
      id: 'BacSi',
      label: 'Bác sĩ',
      icon: faUserNurse,
      path: 'doctors',
      children: [
        { label: 'Danh sách', path: 'danh-sach', icon: faUsers },
        { label: 'Lịch khám bệnh', path: 'lich-kham', icon: faCalendarDays },
      ]
    },
    {
      id: 'YTe',
      label: 'Y tế',
      icon: faBriefcaseMedical,
      path: 'medical',
      children: [
        { label: 'Loại dịch vụ', path: 'loai-dich-vu', icon: faLayerGroup },
        { label: 'Dịch vụ', path: 'dich-vu', icon: faFileMedical },
        { label: 'Phòng khám', path: 'phong-kham', icon: faHospital }
      ]
    },
    {
      id: 'BenhNhan',
      label: 'Bệnh nhân',
      icon: faHospitalUser,
      path: 'patient',
      children: [
        { label: 'Danh sách', path: 'danh-sach', icon: faUsers },
        { label: 'Lịch hẹn', path: 'lich-hen', icon: faCalendarDays },
      ]
    }
];