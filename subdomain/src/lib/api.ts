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
}

export interface Project {
  id: number;
  slug?: string;
  investor_id?: number;
  perspective_image?: string | null;
  perspective_image_url?: string | null;
  status: string;
  translations: ProjectTranslation[];
  // Convenience fields from Translatable
  name?: string;
  short_description?: string | null;
  location?: string | null;
  product_types?: string | null;
  handover_time?: string | null;
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
  // Convenience fields
  title?: string;
  excerpt?: string | null;
}

export async function fetchPosts(categorySlug?: string, perPage = 4): Promise<Post[]> {
  try {
    const params = new URLSearchParams({ per_page: String(perPage) });
    if (categorySlug) params.set('category_slug', categorySlug);
    
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
export interface ProjectArticleTranslation {
  title: string;
  page_title?: string | null;
  summary?: string | null;
  html_content?: string | null;
}

export interface ProjectArticle {
  id: number;
  project_id: number;
  type: string;
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
