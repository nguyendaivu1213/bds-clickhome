
# ClickHomes Platform

## Common goal
In this project:
- There is a main website for customers to view, search for real estate listings, apartment projects for sale, and read related news articles.
- There are multiple websites on subdomains, each subdomain dedicated to a specific developer. Each developer has many large construction projects, each project has many areas or building blocks, and within these areas, many articles are loaded onto the same page. In addition, each project has one or more articles about the building's location, transportation, amenities, etc.
- There is a content management page to manage articles, assign author permissions, and calculate author fees.
- There is a section for project management, staff management, calculating working hours, and calculating payment for articles on the website.
- The page can be switched to other languages.


## Overview

**ClickHomes** is a scalable multi-site real estate content platform designed to manage **multiple websites, large-scale content publishing, and SEO-driven traffic generation**.

The system allows administrators, editors, and writers to manage real estate content across many websites under the same infrastructure.

Key capabilities include:

* Multi-site architecture (10+ websites)
* SEO-optimized content delivery
* CMS for managing articles and projects
* Writer management and payment tracking
* Background job processing
* High-performance caching

---

# System Architecture

The platform follows a **modern decoupled architecture** separating frontend, backend API, and workers.

```
Internet
   │
   ▼
Nginx (Reverse Proxy)
   │
   ├── Frontend (NextJS)
   │
   ├── Admin CMS
   │
   └── Backend API (Laravel)
            │
            ├── MySQL Database
            ├── Redis Cache
            └── Queue Workers
```

---

# Technology Stack

## Backend

* PHP 8.2
* Laravel API

Responsibilities:

* Business logic
* Authentication & authorization
* CMS data management
* API for frontend applications
* Queue job processing

---

## Frontend

* NextJS
* React

Responsibilities:

* Public website interface
* SEO optimized page rendering
* Dynamic project pages
* Article content pages
* Many languages support (vi, en, cn, kr, jp) 

---

## Admin CMS

Admin panel used by:

* administrators
* editors
* writers

Features:

* content management
* website management
* writer management
* article approval workflow
* analytics and reports

---

## Database

MySQL is used as the primary relational database.

Core entities:

* users
* sites
* posts
* categories
* projects
* writer payments

---

## Cache and Queue

Redis is used for:

* caching frequently accessed content
* session storage
* queue processing
* performance optimization

---

## Server

Production server stack:

* Ubuntu 20.04
* Nginx
* PHP 8.2 (php-fpm-8.2)
* NodeJS (node-18)
* MySQL (mysql-8.0)
* Redis (redis-6.x)

---

# Project Structure

```
/project
│
├── backend
│   └── laravel-api
│
├── frontend
│   └── nextjs-app
│
├── admin
│   └── cms-admin
│
├── workers
│   └── queue-jobs
│
├── logs
│
└── scripts
```

---

# Multi-site Architecture

The platform supports multiple websites from the same backend.

Example domains:

```
clickhomes.vn
masteri.clickhomes.vn
vinhomes.clickhomes.vn
sungroup.clickhomes.vn
```

Each site is stored in the database.

Example table:

```
id
name
domain
slug
theme
status
created_at
updated_at
```

Requests are resolved dynamically based on the domain.

---

# Content Management

The CMS allows writers and editors to create and manage content.

Workflow:

```
Writer creates article
        │
        ▼
Editor reviews content
        │
        ▼
Publish article
        │
        ▼
Generate SEO page
        │
        ▼
Update sitemap
```

---

# SEO Optimization

The system is designed for large-scale SEO.

Capabilities include:

* static page generation
* dynamic SEO metadata
* sitemap auto generation
* internal linking
* category and project landing pages

Example URL structure:

```
/du-an/masteri-centre-point
/du-an/vinhomes-ocean-park
/tin-tuc/bat-dong-san
```

---

# Queue Workers

Queue workers process background tasks.

Examples:

* generate sitemap
* cache content
* calculate writer payments
* send notifications

Command example:

```
php artisan queue:work
```

---

# Caching Strategy

Redis caching is used to improve performance.

Cached data examples:

```
homepage
category pages
post pages
menus
site settings
```

Cache reduces database load and speeds up response times.

---

# Deployment

Typical deployment steps:

```
git pull
composer install
npm install
npm run build
php artisan migrate
php artisan queue:restart
```

---

# Server Requirements

Recommended production server:

```
CPU: 2 cores
RAM: 4GB
SSD: 100GB+
```

The system can scale to:

* 10+ websites
* 10k+ articles
* thousands of concurrent visitors

---

# Future Enhancements

Planned improvements may include:

* AI-assisted content generation
* automatic SEO landing pages
* advanced analytics
* search engine integration
* Elasticsearch-based search

---

# License

Internal project for ClickHomes platform.

All rights reserved.
