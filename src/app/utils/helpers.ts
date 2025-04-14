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
    {
        breadcrumbName: 'Subjects',
        key: 'subjects',
        path: '/subjects',
        children: [
            {
                breadcrumbName: 'Details',
                key: 'details',
                path: '/subjects/details',
                children: [
                    {
                        breadcrumbName: 'Math',
                        key: '1',
                        path: '/subjects/details/1',
                    },
                    {
                        breadcrumbName: 'Science',
                        key: '2',
                        path: '/subjects/details/2',
                    },
                    {
                        breadcrumbName: 'English',
                        key: '3',
                        path: '/subjects/details/3',
                    },
                    {
                        breadcrumbName: 'Social Studies',
                        key: '4',
                        path: '/subjects/details/4',
                    },
                ],
            },
        ],
    },
]