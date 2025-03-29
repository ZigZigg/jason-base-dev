export interface IRoute {
  breadcrumbName: string;
  key: string;
  path?: string;
  children?: IRoute[];
}


export const systemRoutes: IRoute[] = [
    {
        breadcrumbName: 'Search',
        key: 'search',
        path: '/search',
        children: [
        ],
      },
]