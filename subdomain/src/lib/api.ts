const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface InvestorTranslation {
  name: string;
  short_description: string | null;
  content: string | null;
  language_id: number;
}

export interface Investor {
  id: number;
  subdomain: string | null;
  website_link: string | null;
  logo: string | null;
  logo_url: string | null;
  intro_image: string | null;
  intro_image_url: string | null;
  footer_image: string | null;
  footer_image_url: string | null;
  about_image: string | null;
  about_image_url: string | null;
  status: string;
  translations: InvestorTranslation[];
  // Convenience: first translation name
  name?: string;
  short_description?: string | null;
  content?: string | null;
  stats?: { number: string; label: string }[];
  benefits?: { icon: string; title: string; description: string }[];
}

export async function fetchInvestor(subdomain: string): Promise<Investor | null> {
  try {
    const params = subdomain ? `?subdomain=${encodeURIComponent(subdomain)}` : '';
    const res = await fetch(`${API_BASE}/public/investor${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface ProjectTranslation {
  name: string;
  short_description?: string | null;
  location?: string | null;
  product_types?: string | null;
  area?: string | null;
  handover_time?: string | null;
  scale?: string | null;
  handoff_time?: string | null;
  handoffTime?: string | null;
  legal?: string | null;
  map_360_links?: { category: string; title: string; link: string }[];
  master_plan?: { image: string; title: string; desc: string }[];
  other_layouts?: { type: string; title: string; area: string; image: string }[];
  construction_progress?: { image: string; title: string; desc: string; date: string }[];
}

export interface Project {
  id: number;
  slug?: string;
  investor_id?: number;
  banner_type?: string | null;
  perspective_image?: string | null;
  perspective_image_url?: string | null;
  google_map?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  status: string;
  translations: ProjectTranslation[];
  // Convenience fields from Translatable
  name?: string;
  slogan?: string;
  short_description?: string | null;
  overview_description?: string;
  location?: string | null;
  product_types?: string | null;
  handover_time?: string | null;
  scale?: string | null;
  handoff_time?: string | null;
  handoffTime?: string | null;
  legal?: string | null;
  youtube_link?: string | null;
  slide_images?: { image: string; title: string; image_url?: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
}

export async function fetchProjects(investorId?: number, perPage = 6): Promise<Project[]> {
  try {
    const params = new URLSearchParams({ per_page: String(perPage) });
    if (investorId) params.set('investor_id', String(investorId));
    const res = await fetch(`${API_BASE}/public/projects?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json: PaginatedResponse<Project> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export interface SiteSettings {
  logo?: string | null;
  site_name?: string | null;
  tagline?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  support_email?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  hotline?: string | null;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/public/settings`, {
      cache: 'no-store',
    });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}
export interface CategoryTranslation {
  title: string;
  slug?: string;
}

export interface Category {
  id: number;
  data_type: string;
  translations: CategoryTranslation[];
  children?: Category[];
  title?: string;
}

export async function fetchCategories(type?: string): Promise<Category[]> {
  try {
    const params = new URLSearchParams();
    if (type) params.set('type', type);

    const res = await fetch(`${API_BASE}/public/categories?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    
    // Category API might reply with array or paginated response
    const json = await res.json();
    if (json.data && Array.isArray(json.data)) {
      return json.data;
    }
    if (Array.isArray(json)) {
      return json;
    }
    return [];
  } catch {
    return [];
  }
}

export interface TagTranslation {
  name: string;
}

export interface Tag {
  id: number;
  translations: TagTranslation[];
  name?: string;
}

export interface PostTranslation {
  title: string;
  excerpt?: string | null;
  content?: string | null;
}

export interface Post {
  id: number;
  slug: string;
  featured_image?: string | null;
  featured_image_url?: string | null;
  published_at?: string | null;
  translations: PostTranslation[];
  tags?: Tag[];
  // Convenience fields
  title?: string;
  excerpt?: string | null;
}

export async function fetchPosts(
  categorySlug?: string, 
  perPage = 4, 
  investorId?: number, 
  type?: string,
  categoryId?: number | string
): Promise<Post[]> {
  try {
    const params = new URLSearchParams({ per_page: String(perPage) });
    if (categorySlug) params.set('category_slug', categorySlug);
    if (investorId) params.set('investor_id', String(investorId));
    if (type) params.set('type', type);
    if (categoryId) params.set('category_id', String(categoryId));

    const res = await fetch(`${API_BASE}/public/posts?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json: PaginatedResponse<Post> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchPost(idOrSlug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE}/public/posts/${idOrSlug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
export interface ProjectArticleTranslation {
  title: string;
  page_title?: string | null;
  summary?: string | null;
  html_content?: string | null;
  slide_images?: { image: string; title: string; image_url?: string }[];
}

export interface ProjectArticle {
  id: number;
  project_id: number;
  type: string;
  layout_type?: string | null;
  target_link?: string | null;
  banner_image?: string | null;
  banner_image_url?: string | null;
  status: string;
  display_order: number;
  translations: ProjectArticleTranslation[];
  // Convenience
  title?: string;
  summary?: string | null;
}

export async function fetchProjectArticles(investorId: number, perPage = 6): Promise<ProjectArticle[]> {
  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      investor_id: String(investorId)
    });

    const res = await fetch(`${API_BASE}/public/project-articles?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json: PaginatedResponse<ProjectArticle> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchArticlesForProject(projectId: number, type?: string, perPage = 20): Promise<ProjectArticle[]> {
  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      project_id: String(projectId)
    });
    if (type) params.append('type', type);

    const res = await fetch(`${API_BASE}/public/project-articles?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json: PaginatedResponse<ProjectArticle> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchProject(idOrSlug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE}/public/projects/${idOrSlug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface ProjectZoneTranslation {
  title: string;
  page_title?: string | null;
  slug?: string | null;
}

export interface ProjectZone {
  id: number;
  project_id: number;
  parent_id?: number | null;
  name?: string;
  status: string;
  display_order: number;
  translations: ProjectZoneTranslation[];
  // Convenience
  title?: string;
  slug?: string;
  page_title?: string | null;
  project?: Project;
}

export async function fetchProjectZones(projectId: number): Promise<ProjectZone[]> {
  try {
    const params = new URLSearchParams({ project_id: String(projectId) });
    const res = await fetch(`${API_BASE}/public/zones?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json: PaginatedResponse<ProjectZone> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchZone(idOrSlug: string): Promise<ProjectZone | null> {
  try {
    const res = await fetch(`${API_BASE}/public/zones/${idOrSlug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchZoneArticles(zoneId: number, type?: string, perPage = 20): Promise<ProjectArticle[]> {
  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      zone_id: String(zoneId)
    });
    if (type) params.append('type', type);

    const res = await fetch(`${API_BASE}/public/zone-articles?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    // ZoneArticles have the same structure as ProjectArticles for the frontend UI components
    const json: PaginatedResponse<ProjectArticle> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

// ======== PROPERTIES ========

export interface PropertyItem {
  id: number;
  product_code?: string | null;
  product_type?: string | null;
  floor?: string | null;
  area?: number | null;
  price?: number | null;
  main_image?: string | null;
  main_image_url?: string | null;
  status: string;
  // translated
  name?: string | null;
  summary?: string | null;
}

export async function fetchProjectProperties(projectId: number, perPage = 50): Promise<PropertyItem[]> {
  try {
    const params = new URLSearchParams({
      project_id: String(projectId),
      per_page: String(perPage),
    });
    const res = await fetch(`${API_BASE}/public/properties?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json: PaginatedResponse<PropertyItem> = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

