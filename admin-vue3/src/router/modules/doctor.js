import Layout from '@/layout'

const doctorRouter = {
    path: 'doctor',
    // component: () => import('@/views/medicalRecord/doctor/index'),
    name: 'Testtx01',
    meta: { title: '医生文书', icon: 'user' },
    children:[
        {
        path: 'page',
        component: () => import('@/views/medicalRecord/doctor/index'),
        name: 'DoctorPage',
        meta: { title: '病案首页', icon: 'dashboard' },
        },
        {
        path: 'elMedicalRecord',
        component: () => import('@/views/medicalRecord/doctor/index'),
        name: 'ElMedicalRecord',
        meta: { title: '病历', icon: 'document' },
        }
    ]
}
export default doctorRouter