import Layout from '@/layout'

const nurseRouter = {
    path: 'nurse',
    name: 'NurseDocument',
    meta: { title: '护士文书', icon: 'user' },
    children:[
        {
        path: 'page',
        component: () => import('@/views/medicalRecord/nurse/index'),
        name: 'nursePage',
        meta: { title: '护理首页', icon: 'user' },
        },
        {
        path: 'elMedicalRecord',
        component: () => import('@/views/medicalRecord/nurse/index'),
        name: 'BodyRecord',
        meta: { title: '体征记录', icon: 'user' },
        }
    ]
}
export default nurseRouter