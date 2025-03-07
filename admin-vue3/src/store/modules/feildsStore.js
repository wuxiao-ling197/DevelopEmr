import { getHospitalMetadataCategoryApi } from '@/api/medicalRecord/formCreate'
import { selectMedicalRecordApi, getEMRModulesListApi } from '@/api/medicalRecord/emrApi'

const useFieldsStore = defineStore(
    'selected-Fields',
    {
        state: () => ({
            selectedFields: []
        }),
        actions: {
            // 获取已选择的字段
            getSelectedFields() {
                let FieldsString = localStorage.getItem('selected_Fields')
                // 尝试解析 JSON 字符串
                try {
                    let Fields = JSON.parse(FieldsString);
                    // 检查解析后的结果是否为数组
                    if (Array.isArray(Fields)) {
                        this.selectedFields = Fields;
                    } else {
                        // 如果不是数组，设置为空数组
                        console.error('Stored Fields are not an array!');
                        this.selectedFields = [];
                    }
                } catch (error) {
                    // 如果解析失败，设置为空数组或其他默认值
                    console.error('Failed to parse JSON:', error);
                    this.selectedFields = [];
                }
            },

            setSelectedFields(list) {
                this.selectedFields = list
                try {
                    localStorage.setItem('selected_Fields', JSON.stringify(list))
                } catch (err) {
                    console.error(err);
                }
            },

            removeMedicalRecord() {
                localStorage.removeItem('selected_Fields')
                this.selectedFields = []
            },

        }
    })

export default useFieldsStore
