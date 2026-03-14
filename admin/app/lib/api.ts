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
