// components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t text-sm text-gray-700 py-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* Cột 1: Thông tin công ty */}
        <div>
          <img src="/logo.png" alt="EGA Food" className="w-32 mb-2" />
          <p className="font-semibold mb-2">EGA Food</p>
          <p>
            Chuỗi cửa hàng đồ ăn nhanh với thực đơn đa dạng, phục vụ nhanh
            chóng, tiện lợi, phù hợp cho mọi lứa tuổi.
          </p>
          <p className="mt-2">Mã số thuế: 12345678910</p>
          <div className="mt-2">
            <p>
              📍{" "}
              <span className="font-bold">
                70 Lu Gia, District 11, Ho Chi Minh City
              </span>
            </p>
            <p>
              📞 Hotline:{" "}
              <span className="text-red-600 font-bold">19006750</span>
            </p>
            <p>
              📧 Email: <span className="font-bold">support@sapo.vn</span>
            </p>
          </div>
        </div>

        {/* Cột 2: Hỗ trợ khách hàng */}
        <div>
          <p className="font-semibold mb-2">Hỗ trợ khách hàng</p>
          <ul className="space-y-1">
            <li>• Câu hỏi thường gặp</li>
            <li>• Hệ thống cửa hàng</li>
            <li>• Tìm kiếm</li>
            <li>• Giới thiệu</li>
            <li>• Liên hệ</li>
            <li>• Chương trình cộng tác viên</li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div>
          <p className="font-semibold mb-2">Chính sách</p>
          <ul className="space-y-1">
            <li>• Chính sách đổi trả</li>
            <li>• Chính sách bảo mật</li>
            <li>• Điều khoản dịch vụ</li>
          </ul>
          <p className="font-semibold mt-4 mb-2">Tổng đài hỗ trợ</p>
          <ul className="space-y-1">
            <li>• Gọi mua hàng: 0999999999 (8h-20h)</li>
            <li>• Gọi bảo hành: 19009999 (8h-20h)</li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận ưu đãi */}
        <div>
          <p className="font-semibold mb-2">Đăng ký nhận ưu đãi</p>
          <p className="mb-4">
            Bạn muốn nhận khuyến mãi đặc biệt? Đăng kí tham gia ngay cộng đồng
            hơn 68.000+ người theo dõi để cập nhật khuyến mãi ngay lập tức
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold">
              Đăng ký
            </button>
          </div>
          <p className="mt-6 font-semibold">PHƯƠNG THỨC THANH TOÁN</p>
          <div className="flex items-center space-x-2 mt-2">
            <img src="/visa.png" alt="Visa" className="h-8" />
            <img src="/mastercard.png" alt="MasterCard" className="h-8" />
            <img src="/momo.png" alt="Momo" className="h-8" />
            <img src="/zalopay.png" alt="ZaloPay" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
}
