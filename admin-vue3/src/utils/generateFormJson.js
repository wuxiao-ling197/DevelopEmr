import { generateTemplateApi } from '@/api/medicalRecord/formCreate';
// vform表单相关配置
import { vFormWidgets, vFormConfigJson as formJson } from '@/config/common.cfg.js'

// 定义表单创建后的方法
function onFormMounted() {

}
// 尝试动态生成表单widget
async function generateTemplate(key) {
    // 初始化一下
    // this.formJson.widgetList = []
    console.log(key);

    const inputWidget = vFormWidgets.inputWidget
    const numberWidget = vFormWidgets.numberWidget
    const selectWidget = vFormWidgets.selectWidget
    let widgetList = []
    let res = await generateTemplateApi(key)
    // console.log(res);
    if (res.code === 200) {
        res.data.forEach(el => {
            let newWidget = {}
            switch (el.type) {
                case 'input':
                    newWidget = JSON.parse(JSON.stringify(inputWidget));
                    newWidget.options.name = el.name
                    newWidget.options.label = el.label
                    newWidget.id = el.id
                    widgetList.push(newWidget)
                    break;
                case 'number':
                    newWidget = JSON.parse(JSON.stringify(numberWidget));
                    newWidget.options.name = el.name
                    newWidget.options.label = el.label
                    newWidget.id = el.id
                    widgetList.push(newWidget)
                    break;
                case 'select':
                    newWidget = JSON.parse(JSON.stringify(selectWidget));
                    newWidget.options.name = el.name
                    newWidget.options.label = el.label
                    newWidget.options.optionItems = el.optionItems
                    newWidget.id = el.id
                    widgetList.push(newWidget)
                    break;
                default:
                    return;
            }
        })
    }
    return widgetList;
};

export default generateTemplate;