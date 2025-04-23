export function parseBlogQuery(query) {
    let {
      page = "1",
      limit = "10",
      status,
      favorite,
      search,
      orderBy,
      categoryId,
      createdAt
    } = query;
  
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    
    const parsedLimit = Math.max(parseInt(limit) || 10, 1);
    
    let orderByParams = [];
    if (orderBy) {
      orderByParams = String(orderBy)
        .split(",")
        .map((order) => {
          const [field, dir] = order.split(":");
          return { [field]: dir === "desc" ? "desc" : "asc" };
        });
    }
   
    return {
      page: parsedPage,
      limit: parsedLimit,
      status: status ?? undefined,
      favorite,
      search: search ?? undefined,
      orderBy: orderByParams.length > 0 ? orderByParams : undefined,
      categoryId: categoryId ?? undefined,
      createdAt : createdAt ?? undefined
    };
  }
  