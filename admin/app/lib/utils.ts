/**
 * Converts a Vietnamese string into a URL-friendly slug.
 */
export function slugify(text: string): string {
    let slug = text.toLowerCase();

    // Replace Vietnamese characters with their non-accented counterparts
    slug = slug.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a');
    slug = slug.replace(/[éèẻẽẹêếềểễệ]/g, 'e');
    slug = slug.replace(/[iíìỉĩị]/g, 'i');
    slug = slug.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o');
    slug = slug.replace(/[úùủũụưứừửữự]/g, 'u');
    slug = slug.replace(/[ýỳỷỹỵ]/g, 'y');
    slug = slug.replace(/đ/g, 'd');

    // Remove special characters
    slug = slug.replace(/([^0-9a-z-\s])/g, '');

    // Replace spaces with hyphens
    slug = slug.replace(/(\s+)/g, '-');

    // Remove multiple hyphens
    slug = slug.replace(/-+/g, '-');

    // Remove leading and trailing hyphens
    slug = slug.trim().replace(/^-+|-+$/g, '');

    return slug;
}
