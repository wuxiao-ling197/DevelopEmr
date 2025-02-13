import { getPatientListApi } from '@/api/medicalRecord/emrApi'
let storagePatient = {}
if (!!localStorage.getItem('current_patient')) {
    try {
        storagePatient = JSON.parse(localStorage.getItem('current_patient'))
    } catch (err) {
        storagePatient = {}
        console.error(err);
    }
}

const usePatientStore = defineStore(
    'patient',
    {
        state: () => ({
            patientList: [],
            currentPatient: storagePatient
        }),
        actions: {
            getPatientList() {
                // 获取患者列表
                return new Promise((resolve, reject) => {
                    getPatientListApi()
                        .then(res => {
                            if (res.code === 200 && res.data.length > 0) {
                                this.patientList = res.data
                            }
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
            },
            setCurrentPatient(patient) {
                this.currentPatient = patient;
                localStorage.setItem('current_patient', JSON.stringify(patient))
            },
            getCurrentPatient() {
                const cp = JSON.parse(localStorage.getItem('current_patient')) || {}
                return cp
            },
            removeCurrentPatient() {
                localStorage.removeItem('current_patient')
                this.currentPatient = {}
            }
        }
    })

export default usePatientStore
