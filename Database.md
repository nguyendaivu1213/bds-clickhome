# ClickHomes Database Architecture (Multi-Site + Multi-Language)

## Overview

Database được thiết kế cho hệ thống **multi-site bất động sản** của ClickHomes với khả năng **đa ngôn ngữ (i18n)**.

Mục tiêu:

* Hỗ trợ **100+ website**
* Hỗ trợ **đa ngôn ngữ (vi, en, zh, ... )**
* Quản lý **100.000+ bài viết**
* Tối ưu **SEO**
* Sử dụng **1 database duy nhất**
* Mỗi nội dung có thể có **nhiều bản dịch**

Stack backend dự kiến:

* Laravel API
* MySQL
* Redis (cache)
* Nginx

---

# 1. Sites

Quản lý các website trong hệ thống.

```
sites
-----
id
name
domain
slug
theme
default_language
status
created_at
updated_at
```

Ví dụ:

| id | name       | domain                | default_language |
| -- | ---------- | --------------------- | ---------------- |
| 1  | ClickHomes | clickhomes.vn         | vi               |
| 2  | Masteri    | masteri.clickhomes.vn | vi               |

---

# 2. Languages

Danh sách ngôn ngữ hệ thống.

```
languages
---------
id
code
name
is_default
status
created_at
```

Ví dụ:

| id | code | name       |
| -- | ---- | ---------- |
| 1  | vi   | Vietnamese |
| 2  | en   | English    |
| 3  | zh   | Chinese    |

---

# 3. Site Languages

Mỗi website có thể bật nhiều ngôn ngữ.

```
site_languages
--------------
id
site_id
language_id
is_default
```

Ví dụ:

| site_id | language |
| ------- | -------- |
| 1       | vi       |
| 1       | en       |

---

# 4. Users

Tài khoản CMS.

```
users
-----
id
name
email
password
role
status
created_at
updated_at
```

Role:

```
admin
editor
writer
seo
```

---

# 5. Categories

Danh mục nội dung (không chứa text đa ngôn ngữ).

```
categories
----------
id
site_id
parent_id
slug
created_at
updated_at
```

---

# 6. Category Translations

Tên danh mục theo từng ngôn ngữ.

```
category_translations
---------------------
id
category_id
language_id
name
description
```

Ví dụ:

| category_id | lang | name     |
| ----------- | ---- | -------- |
| 10          | vi   | Dự án    |
| 10          | en   | Projects |

---

# 7. Posts

Bảng chính lưu thông tin bài viết.

```
posts
-----
id
site_id
category_id
author_id
slug
status
featured_image
published_at
created_at
updated_at
```

Status:

```
draft
pending
published
archived
```

Slug ở đây là **slug gốc** để liên kết các bản dịch.

---

# 8. Post Translations

Toàn bộ nội dung đa ngôn ngữ.

```
post_translations
-----------------
id
post_id
language_id
title
excerpt
content
seo_title
seo_description
seo_keywords
canonical_url
```

Ví dụ:

| post_id | lang | title                        |
| ------- | ---- | ---------------------------- |
| 100     | vi   | Dự án Masteri Centre Point   |
| 100     | en   | Masteri Centre Point Project |

---

# 9. Tags

```
tags
----
id
slug
created_at
```

---

# 10. Tag Translations

```
tag_translations
----------------
id
tag_id
language_id
name
```

---

# 11. Post Tags

```
post_tags
---------
post_id
tag_id
```

---

# 12. Media Library

```
media
-----
id
site_id
user_id
file_name
file_path
file_type
size
created_at
```

---

# 13. Projects (Real Estate Projects)

Thông tin dự án.

```
projects
--------
id
site_id
slug
developer
location
price_from
price_to
status
created_at
updated_at
```

---

# 14. Project Translations

```
project_translations
--------------------
id
project_id
language_id
name
description
```

---

# 15. Project Images

```
project_images
--------------
id
project_id
image_url
sort_order
```

---

# 16. Writer Payments

Quản lý chi phí viết bài.

```
writer_payments
---------------
id
post_id
user_id
word_count
price
status
created_at
```

Status:

```
pending
paid
cancelled
```

---

# 17. Post Views

Thống kê lượt xem theo ngày.

```
post_views
----------
id
post_id
views
date
```

---

# 18. Site Settings

Cấu hình riêng cho từng site.

```
site_settings
-------------
id
site_id
key
value
```

Ví dụ:

```
logo
contact_phone
seo_default_title
google_analytics_id
```

---

# 19. Menus

```
menus
-----
id
site_id
name
location
```

---

# 20. Menu Items

```
menu_items
----------
id
menu_id
parent_id
url
sort_order
```

---

# 21. Menu Item Translations

```
menu_item_translations
----------------------
id
menu_item_id
language_id
title
```

---

# 22. Sitemap Tracking

```
sitemaps
--------
id
site_id
language_id
url
last_generated
```

---

# 23. Laravel Queue Tables

Laravel sử dụng các bảng:

```
jobs
failed_jobs
```

---

# 24. Database Relationship (Simplified)

```
sites
 ├── site_languages
 │
 ├── categories
 │     └── category_translations
 │
 ├── posts
 │     └── post_translations
 │
 ├── projects
 │     └── project_translations
 │
 ├── menus
 │     └── menu_items
 │           └── menu_item_translations
 │
 └── media
```

---

# 25. Performance Index

Các index quan trọng:

```
posts.site_id
posts.slug
post_translations.language_id
categories.site_id
projects.site_id
```

Ví dụ:

```
CREATE INDEX idx_posts_site ON posts(site_id);
CREATE INDEX idx_post_translations_lang ON post_translations(language_id);
```

---

# 26. URL Structure (SEO + Language)

Ví dụ URL:

```
https://clickhomes.vn/du-an/masteri-centre-point
https://clickhomes.vn/en/project/masteri-centre-point
```

Pattern:

```
/{language}/{slug}
```

Language mặc định có thể **không hiển thị prefix**.

---

# 27. Redis Cache Strategy

Cache key gợi ý:

```
site:{id}:lang:{lang}:homepage
site:{id}:lang:{lang}:post:{slug}
site:{id}:lang:{lang}:posts:latest
```

Ví dụ:

```
site:1:lang:vi:post:masteri-centre-point
```

---

# 28. System Capacity

Thiết kế database này có thể phục vụ:

* 100+ websites
* 5+ ngôn ngữ
* 100.000+ posts
* hàng triệu page views

Chỉ cần:

```
MySQL + Redis cache
```

---

# 29. Future Extensions

Có thể mở rộng thêm:

```
landing_pages
internal_links
seo_keywords
ai_generated_posts
```

Để:

* tự động tạo **SEO landing pages**
* tự động **internal linking**
* hỗ trợ **AI viết bài**

---

# 30. Full Table List

```
sites
languages
site_languages
users
categories
category_translations
posts
post_translations
tags
tag_translations
post_tags
media
projects
project_translations
project_images
writer_payments
post_views
site_settings
menus
menu_items
menu_item_translations
sitemaps
jobs
failed_jobs
```

---

# Conclusion

Kiến trúc database này:

* hỗ trợ **multi-site**
* hỗ trợ **đa ngôn ngữ**
* tối ưu **SEO**
* mở rộng tốt cho **100k+ bài viết**
* phù hợp cho hệ thống **ClickHomes**
