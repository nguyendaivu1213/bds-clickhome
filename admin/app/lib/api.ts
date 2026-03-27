// Utility helper for fetching from Laravel API dành cho Admin
export const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin";

/**
 * Hàm lấy dữ liệu từ Backend Laravel Admin.
 * @param endpoint Ví dụ: '/projects', '/posts'
 * @param token Custom Bearer Token nếu có sử dụng Sanctum
 * @param options Tùy chọn fetch
 */
export async function fetchAdminApi(endpoint: string, token?: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${ADMIN_API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi kết nối đến Laravel Admin API:", error);
    return null;
  }
}

// ============== CÁC INTERFACE & HÀM FETCH CHO PROPERTIES ==============

export interface PropertyTranslation {
  summary?: string | null;
  html_content?: string | null;
  slide_images?: any;
}

export interface Property {
  id: number;
  project_id: number;
  zone_id?: number | null;
  product_code?: string | null;
  product_type?: string | null;
  floor?: string | null;
  area?: number | null;
  price?: number | null;
  main_image?: string | null;
  video_url?: string | null;
  status: string;
  display_order: number;
  translations?: PropertyTranslation[];
  project?: {
    id: number;
    name: string;
  };
  zone?: {
    id: number;
    name: string;
    translations?: { title: string }[];
  };
}

export async function fetchProperties(params?: Record<string, any>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const res = await fetch(`${ADMIN_API_BASE_URL}/properties${query}`, {
    cache: "no-store",
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

export async function fetchPropertyById(id: string | number) {
  const res = await fetch(`${ADMIN_API_BASE_URL}/properties/${id}`, {
    cache: "no-store",
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json();
}

export async function createProperty(data: any) {
  const res = await fetch(`${ADMIN_API_BASE_URL}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create property");
  }
  return res.json();
}

export async function updateProperty(id: string | number, data: any) {
  const res = await fetch(`${ADMIN_API_BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update property");
  }
  return res.json();
}

export async function deleteProperty(id: string | number) {
  const res = await fetch(`${ADMIN_API_BASE_URL}/properties/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete property");
  }
  return res.json();
}
