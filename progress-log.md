


LATEST:

✅ merchant analytics api design reviewed and approved - execute implementation

merchant-app:

analytics page is functional.
i'm satisfied with the main blocks that we have, their overall layout, and style.

next implementation plan:

1. ✅ create comprehensive analytics metrics summary and API design doc 
2. ✅ design reusable API structure with DTOs in common-core for future extensibility
3. implement analytics API in separate analytics controller (NO database changes, NO optimization strategies for now)
4. add 'demo' mode to analytics page so potential customers can use it when have no real data 
5. analytics page uses real API instead of mock data
6. dashboard page contains a block with basic info from analytics page + link to analytics page

scope limitations for current implementation:
- use existing database schema as-is (no new tables, indexes, or schema changes)
- implement basic queries without complex optimization (no caching, pre-aggregation, etc.)
- focus on functional API that works with current data structure
- optimization and performance enhancements will be separate future task