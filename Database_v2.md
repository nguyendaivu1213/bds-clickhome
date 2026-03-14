# ClickHomes Database Architecture V2 (Multi-Site + Multi-Language)

## Tổng Quan Kiến Trúc (Architecture Overview)
Cơ sở dữ liệu được thiết kế lại để phục vụ hệ sinh thái CMS Bất Động Sản lớn, có khả năng mở rộng mạnh mẽ theo các yêu cầu thực tế trong file `DuAn.md`. Hệ thống sử dụng mô hình **dịch thuật tách bảng (Translation Tables)** chuẩn `Astrotomic/laravel-translatable` để hỗ trợ đa ngôn ngữ tối ưu cho SEO và linh hoạt trong truy vấn.

Mọi bảng (ngoại trừ bảng hệ thống lõi) đều tự động có các trường ẩn: `created_at`, `updated_at`, `created_by`, `updated_by`.

---

## PHẦN 1: HỆ THỐNG LÕI (CORE SYSTEM)

### 1. `sites` (Quản lý Website)
- `id`
- `name` (Tên website)
- `domain` (Tên miền)
- `slug`
- `theme`
- `default_language` (vi, en...)
- `status`

### 2. `languages` (Cấu hình Ngôn ngữ)
- `id`
- `code` (vi, en, zh...)
- `name` (Vietnamese, English...)
- `is_default`
- `status`

### 3. `users` (Tài khoản Quản trị)
- `id`
- `name`
- `email`
- `password`
- `role` (admin, editor, writer, seo)
- `status`

### 4. `site_settings` (Cấu hình riêng theo Site)
- `id`
- `site_id`
- `key` (Ví dụ: logo, contact_phone, seo_default_title...)
- `value`

---

## PHẦN 2: QUẢN LÝ CHUYÊN MỤC (SITEMAP & ROUTING)

### 5. `categories`
- `id`
- `site_id`
- `parent_id` (Danh mục cha)
- `data_type` (Tin tức, Giới thiệu, Khách hàng, Bất động sản, V.v)
- `display_position` (Enum: top, side, bottom...)
- `template_name` (Giao diện hiển thị)
- `menu_image`
- `icon_image`
- `is_target_blank` (boolean)
- `status`

### 6. `category_translations`
- `id`
- `category_id`
- `locale` (vi, en, zh...)
- `title`
- `subtitle`
- `page_title`
- `description`
- `content` (HTML)
- `slide_images` (JSON: [{image, title, order}])
- `meta_description`
- `meta_keywords`
- `header_tag`
- `url` (Slug ngôn ngữ đích)

---

## PHẦN 3: ĐỐI TÁC & CHỦ ĐẦU TƯ

### 7. `investors`
- `id`
- `website_link`
- `subdomain`
- `logo`
- `intro_image`
- `footer_image`
- `status`

### 8. `investor_translations`
- `id`, `investor_id`, `locale`
- `name`
- `short_description`
- `content` (HTML)

---

## PHẦN 4: DỰ ÁN BẤT ĐỘNG SẢN (PROJECTS)
Trung tâm của hệ thống với rất nhiều dữ liệu, được chia module hợp lý. Tab đa phương tiện lưu bằng kiểu JSON.

### 9. `projects`
- `id`
- `site_id`
- `investor_id` (Link tới chủ đầu tư)
- `primary_category_id`
- `perspective_image` (Ảnh phối cảnh)
- `footer_image`
- `publish_date`
- `google_map` (Link iframe)
- `location_image`
- `sample_apartment_360` (Link)
- `living_room_360`, `bedroom_360`, `balcony_360`, `amenities_360`
- `contact_email`
- `contact_phone`
- `status`
- `display_order`

### 10. `project_translations`
- `id`, `project_id`, `locale`
- `name`
- `slogan`
- `short_description`
- `overview_description`
- `url` (Slug)
- `page_title`
- `meta_description`, `meta_keywords`, `header_tag`
- `location` (Text địa chỉ)
- `scale` (Quy mô, VD: 512 ha)
- `product_types` (Biệt thự song lập, liền kề...)
- `design` (Text: 4 tầng...)
- `apartment_types`, `area`, `handover_time`, `legal_status`
- `html_content` (Nội dung tổng quan)
- `location_content` (Nội dung vị trí)
- `slide_images`, `map_360_links` (JSON)
- `master_plan`, `zone_planning`, `building_locations` (JSON images)
- `studio_layouts`, `1br_layouts`, `2br_layouts`, `3br_layouts`, `duplex_layouts`, `other_layouts` (JSON images)
- `amenities` (JSON: Danh sách tiện ích)
- `handover_standards` (JSON: Tiêu chuẩn bàn giao)
- `images`, `videos` (JSON: Hình ảnh, Video dự án)
- `construction_progress` (JSON: Tiến độ xây dựng [{image, title, desc, date, order}])

### 11. `project_category` (Pivot Table)
Phục vụ Danh mục phụ / Tag.
- `project_id`, `category_id`

### 12. `project_faqs` (Pivot Table)
Liên kết Dự án và Câu hỏi thường gặp.
- `project_id`, `faq_id`

---

## PHẦN 5: CẤU TRÚC KHU VỰC VÀ BÀI VIẾT

### 13. `project_zones` (Khu vực dự án / Tòa nhà / Block)
- `id`, `project_id`
- `intro_image`
- `is_overview_page`
- `status`, `display_order`

### 14. `project_zone_translations`
- `id`, `project_zone_id`, `locale`
- `name` (Tên khu vực)
- `page_title`
- `slug`

### 15. `zone_articles` (Bài viết thuộc khu vực)
- `id`, `zone_id`, `type` (Loại hiển thị)
- `banner_image`
- `status`, `display_order`

### 16. `zone_article_translations`
- `id`, `zone_article_id`, `locale`
- `title`, `page_title`
- `html_content`
- `slide_images` (JSON)

### 17. `project_articles` (Bài viết thuộc Dự án chung)
- `id`, `project_id`, `type`
- `banner_image`
- `status`, `display_order`

### 18. `project_article_translations`
- `id`, `project_article_id`, `locale`
- `title`, `page_title`, `summary`
- `html_content`
- `slide_images` (JSON)

---

## PHẦN 6: SẢN PHẨM BẤT ĐỘNG SẢN (CĂN HỘ/SẢN PHẨM)

### 19. `properties`
- `id`
- `project_id`
- `zone_id` (Tùy chọn thuộc tòa/block nào)
- `product_type` (Enum: Studio, 1PN, 2PN, 3PN, Duplex)
- `floor`
- `area` (Ví dụ: 65,5 m2)
- `price` (Kiểu Decimal)
- `main_image`
- `status`, `display_order`

### 20. `property_translations`
- `id`, `property_id`, `locale`
- `summary`
- `html_content`
- `slide_images` (JSON)

---

## PHẦN 7: MANAGEMENT (TÀI NGUYÊN & TIỆN ÍCH)

### 21. `faqs` (Hỏi Đáp Chung)
- `id`, `status`

### 22. `faq_translations`
- `id`, `faq_id`, `locale`
- `question`, `answer`

### 23. `folders` (Thư mục đa phương tiện)
- `id`, `parent_id` (Đệ quy)
- `name`
- `status`

### 24. `media` (Files đa phương tiện)
- `id`
- `folder_id`
- `name`
- `original_file`
- `file_type` (ext)
- `thumbnail_file`
- `preview_file`
- `file_size`
- `status`
