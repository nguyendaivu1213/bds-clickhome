// Utility helper for fetching from Laravel API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/public";

/**
 * Hàm lấy dữ liệu từ Backend Laravel chuyên dụng cho public web.
 * @param endpoint Ví dụ: '/projects', '/posts'
 * @param options Tùy chọn `fetch` Next.js (VD: "no-store", { revalidate: 60 })
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      ...options,
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi kết nối đến Laravel API:", error);
    return null;
  }
}
