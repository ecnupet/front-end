import { useState } from "react";
import { PageQueryParams } from "../../services";

export function usePage(pageInfo: PageQueryParams) {
  const [page, setPage] = useState(pageInfo.page);
  const [pageSize, setPageSize] = useState(pageInfo.pageSize);
  const [count, setCount] = useState(0);
  const setPageInfo = ({
    page,
    pageSize,
    count,
  }: Partial<PageQueryParams & { count: number }>) => {
    page != null && setPage(page);
    pageSize != null && setPageSize(pageSize);
    count != null && setCount(count);
  };
  return [page, pageSize, count, setPageInfo] as const;
}
