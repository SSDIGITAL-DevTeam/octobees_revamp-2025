/**
 * Parse blog query parameters from request query string
 */
export const parseBlogQuery = (query) => {
  const {
    page,
    limit,
    status,
    orderBy,
    search,
    favorite,
    categoryId,
    createdAt,
    excludeId,
  } = query;

  const parsed = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
  };

  if (status) parsed.status = status;
  if (search) parsed.search = search;
  if (favorite !== undefined) parsed.favorite = favorite;
  if (categoryId) parsed.categoryId = categoryId;
  if (createdAt) parsed.createdAt = createdAt;
  if (excludeId) parsed.excludeId = excludeId;

  // Parse orderBy - format: "field:direction" e.g., "createdAt:desc"
  if (orderBy) {
    const orderArray = Array.isArray(orderBy) ? orderBy : [orderBy];
    parsed.orderBy = orderArray
      .map((item) => {
        if (typeof item !== 'string') return null;
        const [field, direction = 'asc'] = item.split(':');
        return { [field]: direction.toLowerCase() === 'desc' ? 'desc' : 'asc' };
      })
      .filter(Boolean);
  }

  return parsed;
};
