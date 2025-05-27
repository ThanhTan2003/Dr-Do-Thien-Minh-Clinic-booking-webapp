import {
    faHouse,
    faCommentDots,
    faUsers,
    faBell,
    faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
  
export const MarketingMenuItems = [
    {
      id: 'TrangChu',
      label: 'Trang chủ',
      icon: faHouse,
      path: 'dashboard'
    },
    {
      id: 'ZaloOA',
      label: 'Zalo OA',
      icon: faCommentDots,
      path: 'zalo-oa',
      children: [
        { label: 'Người dùng', path: 'nguoi-dung', icon: faUsers },
        { label: 'Nhóm người dùng', path: 'nhom-nguoi-dung', icon: faLayerGroup },
        { label: 'Gửi thông báo', path: 'gui-thong-bao', icon: faBell }
      ]
    }
];