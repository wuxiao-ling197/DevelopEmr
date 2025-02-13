import { getHospitalMetadataCategoryApi } from '@/api/medicalRecord/formCreate'
import { selectMedicalRecordApi, getEMRModulesListApi } from '@/api/medicalRecord/emrApi'

const useMedicalRecordStore = defineStore(
    'medical-record',
    {
        state: () => ({
            modules: JSON.parse(localStorage.getItem('record_modules')) || [],
            currentModule: JSON.parse(localStorage.getItem('current_module')) || {},
            medicalRecord: JSON.parse(localStorage.getItem('medical_record')) || [],
            currentMR: JSON.parse(localStorage.getItem('current_medical_record')) || {},
            metadata: JSON.parse(localStorage.getItem('metadata')) || [],// 常用病和模板最好放在本地
            type: [{ code: 'name' }],//把病历元数据大类放在本地
            range: [{ code: 'name' }],
            value: [{ code: 'name' }],
            emrType: localStorage.getItem('emr_type') || '1'//创建病历类型，1为form格式，2为markdowm格式
        }),
        actions: {
            // 获取病历模板
            getEMRModulesList() {
                return new Promise((resolve, reject) => {
                    getEMRModulesListApi()
                        .then(res => {
                            if (res.code === 200 && res.data.length > 0) {
                                this.modules = res.data
                            }
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                    localStorage.setItem('record_modules', JSON.stringify(res.data))
                })
            },
            // 获取病历？
            getMedicalRecord(query) {
                return new Promise((resolve, reject) => {
                    selectMedicalRecordApi(query)
                        .then(res => {
                            if (res.code === 200 && res.data.length > 0) {
                                this.medicalRecord = res.data
                            }
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                    localStorage.setItem('medical_record', JSON.stringify(res.data))
                })
            },
            // 获取元数据
            getMetadata(params) {
                // params指定查询条件，分页查询多少条第几页等等
                return new Promise((resolve, reject) => {
                    getHospitalMetadataCategoryApi(params).then(res => {
                        if (res.code === 200 && res.deta.length > 0) {
                            this.metadata = res.data;
                            localStorage.setItem('metadata', JSON.stringify(res.data))
                        }
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            setCurrentModule(temp) {
                this.currentModule = temp
                localStorage.setItem('current_module', JSON.stringify(temp))
            },
            setCurrentMR(MR) {
                this.currentMR = MR
                localStorage.setItem('current_medical_record', JSON.stringify(MR))
            },
            removeMetadata() {
                localStorage.removeItem('metadata')
                this.metadata = []
            },
            removeEMRModules() {
                localStorage.removeItem('record_modules')
                this.modules = []
            },
            removeMedicalRecord() {
                localStorage.removeItem('medical_record')
                this.medicalRecord = []
            },
            removeCurrentModule() {
                this.currentModule = {}
                localStorage.removeItem('current_module')
            },
            removeCurrentMR() {
                this.currentMR = {}
                localStorage.removeItem('current_medical_record')
            },
            // 
            setEmrType(type) {
                this.emrType = type
                localStorage.setItem('emr_type', type)
            },
            removeEmrType() {
                this.emrType = ''
                localStorage.setItem('emr_type')
            }
        }
    })

export default useMedicalRecordStore
