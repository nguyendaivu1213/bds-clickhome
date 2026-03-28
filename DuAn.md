# Các module/chuyên mục trong trang admin
## Quản lý chuyên mục
Phần này chính là sitemap của trang web, mỗi chuyên mục có thể có nhiều bài viết. Các chuyên mục có thể có nhiều chuyên mục con và nhiều cấp chuyên mục.
Cấu tạo database như sau:
- tên bảng: category
- danh sách field:
    Tiêu đề
    Tiêu đề phụ
    Page title
    Kiểu dữ liệu: (Tin tức, Giới thiệu,Khách hàng, Trang Bất động sản, Album ảnh, Trang video, Trang dự án, Trang chủ
Trang liên hệ, Logo - Liên kết web, Trang Đối tác - Khách hàng, Sitemap)
    Vị trí hiển thị : top, side, bottom, ...
    Nhóm cha
    Template name
    Ảnh menu
    Ảnh Icon
    Mô tả
    Nội dung
    Ảnh Slide: gồm nhiều ảnh, có tiêu đề, và số thứ tự
    Description
    Keywords
    Header tag
    Url
    Is Target blank
    Status

và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...


## Chủ đầu tư
Phần này chính là quản lý Chủ đầu tư, mỗi chủ đầu tư thường sẽ tạo 1 subdomain từ tên miền chính, có trường hợp đặt biệt sẽ tạo từ 1 tên miền mới hay 'Link website Chủ đầu tư'.
Mỗi bài viết Chủ đầu tư sẽ gồm các nội dung hoặc fields sau:
    - Tên Chủ đầu tư
    - Link website Chủ đầu tư
    - Subdomain
    - Logo Chủ đầu tư
    - Ảnh giới thiệu
    - Ảnh Footer
    - Mô tả ngắn    
    - Bài viết chi tiết
    - Trạng thái
    và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...

## Dự án
Phần này chính là quản lý Dự án của Chủ đầu tư, mỗi chủ đầu tư sẽ có nhiều dự án
Mỗi bài viết Dự án sẽ gồm các nội dung hoặc fields chính và các tab (field trong cùng bảng hoặc bảng con):
    Thông tin dự án
    - Tên Dự án    
    - Danh mục chính
    - Danh mục phụ /tag
    - Ảnh phối cảnh đẹp
    - Ảnh Footer
    - Slogan
    - Mô tả ngắn
    - Mô tả tổng quan
    - Ngày đăng
    - Url
    - Trạng thái
    - Thứ tự
    
    Tab SEO:
    - Page title
    - Description
    - Keywords
    - Header tag

    Tab Tổng quan dự án
    - Chủ đầu tư
    - Vị trí : ví dụ Vịnh Nam Chơn (Làng Vân), Phường Hòa Hiệp Bắc, Quận Liên Chiểu, TP. Đà Nẵng.
    - Quy mô : ví dụ 512,16 ha  
    - Loại hình sản phẩm: Biệt thự song lập, biệt thự đơn lập, liền kề, TMDV
    - Thiết kế: 4 tầng
    - Ảnh Slide: gồm nhiều ảnh, có tiêu đề, và số thứ tự
    - Nội dung HTML
    - Loại căn hộ
    - Diện tích
    - Thời gian bàn giao
    - Pháp lý

    Tab Vị trí
    - Bản đồ Google Map
    - Ảnh vị trí
    - Nội dung vị trí

    Tab 360 độ
    - Link 360 độ map (nhiều link)
    - 360° căn hộ mẫu
    - 360° phòng khách
    - 360° phòng ngủ
    - 360° ban công
    - 360° tiện ích

    Tab Mặt bằng & Layout căn hộ
    - Mặt bằng tổng thể : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - Quy hoạch toàn khu : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - Vị trí các tòa : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - Layout căn hộ : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - Studio : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - 1PN : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - 2PN : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - 3PN : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - Duplex : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự
    - Danh sách Mặt bằng khác : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự

    Tab Tiện ích
     - Danh sách tiện ích: gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự

    Tab Tiêu chuẩn bàn giao
    - Tiêu chuẩn bàn giao : gồm nhiều ảnh, có tiêu đề, miêu tả và số thứ tự

    Tab Hình ảnh và Video
     - Hình ảnh: gồm nhiều ảnh, có tiêu đề, và số thứ tự
     - Video: gồm nhiều link video, có tiêu đề, và số thứ tự

    Tab Giá bán & chính sách
    - Giá bán: Liên kết với mục sản phẩm BĐS
    - Chính sách: Bài viết chính sách

    Tab Tiến độ xây dựng
        - Hình ảnh tiến độ : gồm nhiều ảnh, có tiêu đề, miêu tả, Tháng năm, và số thứ tự
    
    Tab Hỏi – Đáp (FAQ)
        - Danh sách câu hỏi và trả lời: Liên kết với bảng faq
    
    Tab Liên hệ
        - Email nhận liên hệ
        - Phone nhận liên hệ  
    
    và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...

## Khu vực dự án
Phần này chính là quản lý Khu vực dự án, mỗi dự án có nhiều khu vực dự án, mỗi khu vực dự án sẽ có nhiều Bài viết dự án.
Mỗi bài viết Khu vực dự án sẽ gồm các nội dung hoặc fields sau:
    - Tên Khu vực dự án
    - Dự án
    - Page title
    - Ảnh giới thiệu
    - Slug (URL)
    - Là trang Tổng quan? (Trang sẽ load mặc định khi vào subdomain)
    - Trạng thái
    - Thứ tự
    và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...

## Bài viết khu vực
Phần này chính là quản lý Bài viết khu vực, mỗi dự án có nhiều khu vực dự án, mỗi khu vực dự án sẽ có nhiều Bài viết dự án, các bài viết này sẽ ghép với nhau để tạo thành 1 trang tổng hợp trong Khu vực đó.
Mỗi bài viết Khu vực dự án sẽ gồm các nội dung hoặc fields sau:
    - Tên Khu vực dự án
    - Loại nội dung (Type) (Xác định cách hiển thị trên giao diện)
    - Tiêu đề
    - Page title
    - Ảnh (Banner/Section Image)
    - Nội dung HTML    
    - Ảnh Slide: gồm nhiều ảnh, có tiêu đề, và số thứ tự
    - Trạng thái
    - Thứ tự
    và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...

## Bài viết dự án
Các bài viết liên kết đến 1 dự án cụ thể và có phân loại, gồm có fields sau:
    - Loại nội dung (Type) (Xác định cách hiển thị trên giao diện)
    - Tiêu đề
    - Page title
    - Ảnh (Banner/Section Image)
    - Tóm tắt
    - Nội dung HTML    
    - Ảnh Slide: gồm nhiều ảnh, có tiêu đề, và số thứ tự
    - Trạng thái
    - Thứ tự
    và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...

## Sản phẩm BĐS
Mỗi sản phẩm BĐS liên kết đến 1 dự án cụ thể và có phân loại, gồm có fields sau:
    - Loại hình sản phẩm ( Căn hộ studio, 1PN, 2PN, 3PN, Duplex)
    - Dự án
    - Khu vực dự án (block hay tòa nhà)
    - Tầng
    - Diện tích
    - Giá
    - Ảnh chính
    - Ảnh Slide: gồm nhiều ảnh, có tiêu đề, và số thứ tự
    - Tóm tắt
    - Nội dung HTML    
    - Trạng thái
    - Thứ tự
    và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...

## Đa phương tiện
Quản lý thư mục, hình và các file đa phương tiện. Gồm 2 bảng folder và media
    Bảng Folder gồm các fields sau:
        - Tên
        - Trạng thái
        - Thư mục cha
        và các field ẩn liên quan như id, language, created_at, updated_at, created_by, updated_by ...

    Bảng Media gồm các fields sau:
        - Tên
        - Trạng thái
        - Thư mục cha
        - File gốc  
        - Loại file (Hình ảnh, Video, File) /ext
        - File thumbnail
        - File preview
        - File size
        và các field ẩn liên quan như id, language, created_at, updated_at, created_by, updated_by ...



## Hỏi đáp FAQ
    - Câu hỏi
    - Trả lời
    - Trạng thái
    và các field ẩn liên quan như language, created_at, updated_at, created_by, updated_by ...





Các mục cần có trong trang dự án
1. Banner / Hero dự án
Ảnh phối cảnh đẹp
Tên dự án
Slogan
Nút Nhận bảng giá / Đăng ký tư vấn
2. Tổng quan dự án
Chủ đầu tư
Vị trí
Quy mô
Số tòa – số căn
Loại căn hộ
Diện tích
Thời gian bàn giao
Pháp lý
3. Vị trí dự án
Bản đồ Google Map
Kết nối giao thông
Các tiện ích xung quanh
4. Mặt bằng & Layout căn hộ
Gồm:
Mặt bằng tổng thể
Quy hoạch toàn khu
Vị trí các tòa
Layout căn hộ
Studio
1PN
2PN
3PN
Duplex
👉 Mỗi loại căn nên có:
Layout
Ảnh chi tiết căn hộ
5. Tiện ích dự án
Hồ bơi
Công viên
Gym
Khu vui chơi trẻ em
Trung tâm thương mại
6. Tiêu chuẩn bàn giao
Chi tiết nội thất bàn giao:
Sàn
Trần tường
Điều hòa
Tủ bếp
Bếp từ
Thiết bị vệ sinh
Ban công
7. Ảnh 360° / Tour 360°
360° căn hộ mẫu
360° phòng khách
360° phòng ngủ
360° ban công
360° tiện ích
8. Hình ảnh & Video dự án
Phối cảnh
Nội thất căn hộ
Video flycam
Video giới thiệu
9. Giá bán & chính sách
Giá từng loại căn
Tiến độ thanh toán
Hỗ trợ vay ngân hàng
Ưu đãi
10. Tiến độ xây dựng
Hình ảnh công trường
Cập nhật tiến độ
11. Hỏi – Đáp (FAQ)
Ví dụ:
Giá bao nhiêu
Có vay ngân hàng không
Khi nào bàn giao
Có sổ hồng không
Có nhà mẫu không
12. Đăng ký nhận thông tin / Liên hệ
Form đăng ký
Hotline
Zalo
Nút gọi nhanh