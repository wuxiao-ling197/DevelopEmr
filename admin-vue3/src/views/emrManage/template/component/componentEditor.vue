<template>
    <div class="app-container">
      <!-- <switch-roles @change="handleRolesChange" /> -->
       <!-- 其实无论编辑还是新增模板，进来都是designer，只有查看才是render。并且disabled，模板没有formData -->
      <!-- 公式工具栏 -->
       <el-row :span="24">
        <el-col :span="6" v-if="!isRender" class="formula-toolbar">
          <el-button type="text" @click="insertSymbol('∑')">∑</el-button>
          <el-button @click="openFormulaWizard">公式向导</el-button>
          <el-button @click="insertMatrix">矩阵模板</el-button>
          <el-button @click="reLocation">返回</el-button>
          
        </el-col>
        <el-col :span="6" v-if="!isRender">
          <!-- <el-input
          v-model="fieldCategory"
          class="icon-search"
          clearable
          placeholder="请输入数据源名称"
          @input="searchDataSourceCategory"
          @change="searchDataSourceCategory"
          ></el-input> -->
          <el-select clearable v-model="fieldCategory" placeholder="可多选">
              <el-option v-for="item in categoryList" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button @click="resetDataSource(1)">category数据源</el-button>
        </el-col>
        <el-col :span="6" v-if="!isRender">
          <el-select clearable v-model="fieldEntity" placeholder="可多选">
              <el-option v-for="item in entitiesFieldList" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button @click="resetDataSource(2)">entity数据源</el-button>
        </el-col>
       </el-row>
      
       <div class='form-des' v-if="showDesigner" style="margin-top:30px;">
        <v-form-render
        aria-disabled="true"
         v-if="isRender && !isMD"
         ref="vfRenderRef" 
         :form-json="formJson" 
         :form-data="formData" 
         :option-data="optionData">
        </v-form-render>
        <v-form-designer
          v-if="!isRender && !isMD"
          :field-list-api="getFieldopt"
          ref="vfDesignerRef"
          @field-change="handleFieldChange"
          :designerConfig="designerConfig"
          :banned-widgets="bannedWidgets">
        </v-form-designer>

        <!-- md模板，如果是查看的话只能预览 -->
        <!-- <v-md-editor 
          v-if="isRender && isMD"
          ref="vmPreviewRef"
          mode="preview"
          v-model="mdTemplate" 
          height="400px"></v-md-editor> -->
        <!-- 如果是编辑或者新增就是编辑器模式 -->
        <v-md-editor 
          v-if="!isRender && isMD"
          ref="vmEditorRef"
          v-model="mdTemplate" 
          :include-level="[3, 4]"
          ></v-md-editor>
        <div 
        class="previewBox"
        v-if="isRender && isMD" 
        >
          <div class="previewIndexs">
            <div
              class="previewIndex"
              v-for="anchor in titles"
              :key="anchor.indent"
              :style="{ padding: `10px 0 10px ${anchor.indent * 20}px` }"
              @click="handleAnchorClick(anchor)"
            >
              <a style="cursor: pointer">{{ anchor.title }}</a>
            </div>
          </div>
          <v-md-preview 
          :text="mdTemplate" 
          ref="vmPreviewRef" 
          height="400px" 
          :include-level="[3, 4]"/>
        </div>
      </div>
      <el-row :span="24">
        <el-col :span="24">
          <el-button v-if="showSubmitButton" style="width: 100%" @click="submitTemplateEvt">
            保存模板
          </el-button>
        </el-col>
      </el-row>
      

      <!-- 弹窗配置组件 -->
      <!-- <ConfigForm v-if="isShow" ref="templateFormRef" :formConf='templateObj'></ConfigForm> -->
      <MyDialog ref="templateConfigRef" 
        :click_confirm="myDialogConfirmEvt"
        :click_cancel="myDialogCancelEvt">
        <!-- <template #content>
          <ConfigForm 
          @update:formConf="formConfUpdate"
           :formConf='templateObj'></ConfigForm>
        </template> -->
      </MyDialog>
    </div>
  </template>
  
  <script>
    import { createTemplateApi,selectTemplateApi } from '@/api/medicalRecord/emrApi';
    import { getEntitiesMetaDataApi,getHospitalMetadataCategoryApi, getDynamicOptionsApi } from '@/api/medicalRecord/formCreate';
    
    import { vFormConfigJson as formJson } from '@/config/common.cfg.js'
    import { getToken } from '@/utils/auth'
    import useUserStore from '@/store/modules/user';
    import { nextTick, ref } from 'vue';
    import useMedicalRecordStore from '@/store/modules/medicalRecord';

    // 引入自定义组件
    import MyDialog from '@/components/MyDialog'

    export default {
    name: 'BasicInfo',
    components: { MyDialog },
    setup(){
      let vfDesignerKey = ref(0);  // 初始化 编辑器的key
      const token = 'Bearer ' + getToken();
      // 数据源类型
      let fieldCategory = ref('人口学及社会经济学特征');
      // 如果是来自实体的数据源，实体名
      let fieldEntity = ref('')

      let showDesigner = ref(true)
      // 卫生信息数据源类型列表
      const categoryList = ref([]);
      // 数据库表数据源实体列表
      let entitiesFieldList = ref([])
      // v-form编辑器初始数据源
      let getFieldopt = ref({
        URL: `http://localhost:8888/dev-api/emrManage/Metadata/fieldList?category=${fieldCategory.value}&categoryCode=123&_=${Date.now()}`,
        nameKey: 'fieldName',
        labelKey: 'fieldLabel',
        headers: {
          Authorization: token,
          'Cache-Control': 'no-cache'
        }
      })
      let categoryIndex = ref(0)
      // 重新设置数据源类型
      const setCategory = (category)=>{
        showDesigner.value = false
        // 从数据源大类列表中切换当前数据源类别
        console.log(category);
        console.log(fieldCategory.value);
        // 修改数据源对象请求接口
        getFieldopt.value = {
          URL: `http://localhost:8888/dev-api/emrManage/Metadata/fieldList?category=${category}&categoryCode=123&_=${Date.now()}`,
          nameKey: 'fieldName',
          labelKey: 'fieldLabel',
          headers: {
            Authorization: token,
          }
        }
      }
      // 重新设置数据源实体
      const setEntities = (entity)=>{
        showDesigner.value = false
        // 从数据源大类列表中切换当前数据源类别
        console.log(entity);
        console.log(fieldEntity.value);
        // 修改数据源对象请求接口
        getFieldopt.value = {
          URL: `http://localhost:8888/dev-api/emrManage/Metadata/hospitalPatientMetadata?entityName=${entity}&entityCode=123&_=${Date.now()}`,
          nameKey: 'fieldName',
          labelKey: 'fieldLabel',
          headers: {
            Authorization: token,
          }
        }
      }
    
      const currentUser = JSON.parse(useUserStore().currentUser);
      const medicalRecordStore = useMedicalRecordStore();
      const currentTemplate = medicalRecordStore.currentModule;

      const isRender = ref(true)
      const isMD = ref(currentTemplate?.payload?.type === '2')
      let mdTemplate = currentTemplate?.payload?.template || '## isEmpty'
      const tempType = ref(null)
      // 在点击保存或者进入创建编辑页面时弹出框，表单，绑定templateObj
      // 等于上一个页面传递过来的配置    
      let templateObj = ref({})

      // md预览模式的标题锚点
      let titles = ref([])

      // 显示配置表格
      const isShow = true
      // 打开配置弹窗
      function showConfDialogEvt(){
        console.log('showConfDialog'); 
        // 打开模板配置弹窗
        
      };
      // 获取卫生信息数据源类别（模板大类）
      async function getCategory(){
        const res = await getHospitalMetadataCategoryApi()
        // console.log(res.data);
        
        if(res.code===200){
          res.data.list.forEach(item=>{
            categoryList.value.push(item.category)
          })
        }
        // console.log('医院相关的卫生信息数据原值域-------');
        // console.log(categoryList.value);
      };
      // 获取数据库实体数据源实体（实体名列表）
      async function getEntities(){
        // 获取后端所有实体
        let res = await getEntitiesMetaDataApi()
        // console.log(res);
        if(res.code===200){
          res.data.list.forEach(item=>{
            // 将所有实体的元数据添加到一个fieldList中，即所有的数据源
            // 最好将每一个item的fields[]都解构再合并成一个数组（或者concat），但不同的实体可能有重名的字段，（比如每个实体都有id）需要处理解决）
            entitiesFieldList.value.push(item.comment)
            // entitiesFieldList.value.push(item.tableName)
          })
        }
        // console.log('数据库的实体的数据原值域-------');
        // console.log(entitiesFieldList.value);
      };
      return {
        showDesigner,
        currentUser,
        currentTemplate,
        categoryList,
        entitiesFieldList,
        getCategory,
        getEntities,
        setCategory,
        setEntities,
        categoryIndex,
        isRender,
        isMD,
        titles,
        templateObj,
        medicalRecordStore,
        isShow,
        showConfDialogEvt,
        fieldCategory,
        fieldEntity,
        getFieldopt,
        tempType,
      }
    },
    computed: {
      templateId() {
        return this.$route.query.id;
      }
    },
    watch: {
      '$route'(to, from) {
        console.log(to.query);
        // 检查新的路由对象中的查询参数是否包含 'id' 并且与之前的不同
        if (to.query.id !== from.query.id) {
          console.log(`from ${from.query.id} change to ${to.query.id}`);
          // 执行重新加载页面方法或其他操作
          this.reloadPage(to.query.id);
          // alert('111')
        }
      }
    },
    data() {
      return {
        formJson,
        showSubmitButton: true,
        isScrolling: false,
      }
    },
    beforeMount(){
      console.log('on beforemount-------');
      // console.log('this.templateId:',this.templateId);
      this.reloadPage(this.templateId)
    },

    async mounted (){
      
      // await this.getDynamicOptions()
      // 获取实体的元数据
      await this.getFieldOfEntity()
      // 获取医院的数据源值域和大类
      await this.getCategory()
      // 获取数据库实体列表
      await this.getEntities()
      
      if(this.$refs.vfDesignerRef){
        let dataSource = {
          dataSourceId: '1x2y3z98765', //确保表单内唯一不重复
          uniqueName: '',
          requestURL: '',
          requestURLType: 'String',
          description: '',
          headers: [
          ],
          params: [
          ],
          data: [
          ],
          requestMethod: 'get',
          configHandlerCode: '  return config',
          dataHandlerCode: '  return result.data.data;',
          errorHandlerCode: '  $message.error(error.message);',
          dataSetEnabled: false,  // 是否开启多数据集
          dataSets: [
          ],
        };
        // console.log(this.$refs.vfDesignerRef);
        // 这个只有pro版支持，基础版本没有addDataSource
        // this.$refs.vfDesignerRef.addDataSource(dataSource)

      }

      // md文档浏览状态下锚点定位方法
      if(this.$refs.vmPreviewRef){
        this.locationIndex()
      }
      
    },
    methods: {
      // 锚点定位方法
      locationIndex(){
        // console.log(this.$refs.vmPreviewRef);
        // 预览模式下的锚点跳转
        const anchors = this.$refs.vmPreviewRef.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
        const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
        if (!titles.length) {
          this.titles = [];
          return;
        }
        const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
        this.titles = titles.map((el) => ({
          title: el.innerText,
          lineIndex: el.getAttribute('data-v-md-line'),
          indent: hTags.indexOf(el.tagName),
        }));
      },
      // 数学公式输入图形化界面相关
      // 输入求和符号$\sum$
      insertSymbol(symbol='sum'){
        alert('$\\sum$')
        console.log(this.mdTemplate);
        this.addMDText(symbol)
      },
      addMDText(symbol){
        let text = `
        $\\${symbol}$
        `
        this.mdTemplate += text
        console.log(this.mdTemplate);
      },
      // 公式向导
      openFormulaWizard(){},
      // 矩阵模板
      insertMatrix(){},
      // 重新设置form编辑状态下数据源
      resetDataSource(type){
        // 点击按钮
        // 判断是否重设哪类数据源
        if(type===1) this.setCategory(this.fieldCategory);
        else this.setEntities(this.fieldEntity);
        // 重新加载编辑器，发送请求
        this.$nextTick(() => {
          console.log(this.getFieldopt.URL);
          this.showDesigner = true
          console.log(this.showDesigner);
        })
      },
      // 返回基础模板
      reLocation(){
        this.$router.push('/emrManage/template/templateConfig')
      },
  
      // 获取选框组件选项
      async getDynamicOptions(code='TP0102'){
        let query = {code}
        let res = await getDynamicOptionsApi(query)
        console.log(res);
        return res.data
      },
      
      // 加载表单选项的方法
      // 在编辑器组件挂载后调用？
      setOptions(){
        // 获取需要设置选项的选框组件（fieldName）ref
        let selectBoxRefs = getWidgetRef(widgetName, true)
        // 获取对应fieldName的（value-valueMean）options
        selectBoxRefs.forEach(item=>{
          // getOptions
          let options = this.getDynamicOptions(item.fieldName)
          item.loadOptions(options)
        })
      },

      async getFieldOfEntity(){
        // 获取后端所有实体
        let res = await getEntitiesMetaDataApi()
        // console.log(res);
        if(res.code===200){
          let patientInfofield = []
          let entytiesFieldList = []
          res.data.list.forEach(item=>{
            if(item.comment === '病人信息表'){
              patientInfofield = item.fields
            }
            entytiesFieldList.push(item.fields)
          })
        }
      },

      // 判断当前模板类型并赋值
      determineAndAssignmentEvt(template){
        // console.log('templatetemplatetemplatetemplate');
        // console.log(template);
        
        if(template.payload.type==='1'){
          this.formJson = template.payload.template;
          // console.log(this.formJson);
        }else if(template.payload.type==='2'){
          this.mdTemplate = template.payload.template;
          // console.log(this.mdTemplate);
        }
      },
      // 新增和编辑模板好像全都是designer
      async reloadPage(id){
        if(!id){
          return
        }
        if(id==='add'){
          // 说明是新增
          this.isRender = false;
          this.showSubmitButton = true;
          // 从store里获取配置，修改templateObj
          if(this.medicalRecordStore.templateObj){
            try{
              this.templateObj = this.medicalRecordStore.templateObj
              this.tempType = this.$route.query.tempType
            }catch(err){
              console.error(err);
            }
          }
          // console.log(this.tempType);
          this.isMD = this.tempType==='1'? false : true
          if(this.tempType==='1'){
            nextTick(()=>{
              // 如果是form编辑器，新增模式先清空画板
              this.$refs.vfDesignerRef.clearDesigner()
            })
          }          
        }else if(id==='edit'){
          // 说明是编辑
          Object.assign(this.templateObj,this.currentTemplate);
          // console.log(this.templateObj);
          this.isRender = false;
          this.showSubmitButton = true;
          this.tempType = this.currentTemplate.payload.type
          this.isMD = this.tempType==='1'? false : true
          // 把当前模板的内容赋值给当前编辑器或者渲染器
          this.determineAndAssignmentEvt(this.currentTemplate)
          if(this.tempType==='1'){
            nextTick(()=>{
              this.$refs.vfDesignerRef.setFormJson(this.formJson)
            })
          }
        }else if(id==='detail'){
          // 查看，不需要设计表单，只需要拿到currentTemplate然后渲染
          this.isRender = true;
          this.showSubmitButton = false;
          // console.log(this.currentTemplate);
          this.tempType = this.currentTemplate.payload.type
          this.isMD = this.tempType==='1'? false : true
          // 判断类型并赋值
          this.determineAndAssignmentEvt(this.currentTemplate)
          if(this.tempType==='1'){
            nextTick(async()=>{
              await this.$refs.vfRenderRef.setFormJson(this.formJson)
              // 表单禁用编辑
              this.$refs.vfRenderRef.disableForm()
            })
          }
        }
      },

      // 新增相关的问题
      setDesignerFormJson(){
        this.$refs.vfDesignerRef.serFormJson(this.formJson)
      },
      // 发送请求的方法
      async selectTemplate(id){
        return await selectTemplateApi(id)
      },
      async createTemplate(data){
        return await createTemplateApi(data)
      },

      // 监听子组件传递的事件
      formConfUpdate(val){
          console.log(val);
          this.templateObj = val;
      },
      // 提交数据，新增模板
      async submitTemplateEvt(){
        this.formJson = this.tempType==='1' ? this.$refs.vfDesignerRef.getFormJson() : this.$refs.vmEditorRef.getValue()
        console.log(this.formJson);
        
        // 打开配置弹窗
        try{
          this.showConfDialogEvt();
          // 处理数据
        }catch(err){
          console.log(err);
          return
        }
      },
      async myDialogConfirmEvt(){
        // 点击确定后拿到templateObj，处理后才调用报错模板方法
        console.log(this.templateObj);
        this.templateObj.payload = {
          template:this.formJson,
          type:this.tempType
        }
        // 发送请求，保存模板/创建模板
        let res = await this.createTemplate(this.templateObj)
        if(res.code===200){
          this.$message.success('模板已保存！')
          this.$router.push('/emrManage/template/templateConfig')
        }else{
          this.$message.error('模板保存失败')
        }
      },
      // 点击md锚点标题
      handleAnchorClick(anchor) {
        // if (this.isScrolling) {
        //   console.log('scrolling...');
        //   return; // 如果正在滚动，则不执行任何操作
        // }
  
        this.isScrolling = true; // 设置标志位为正在滚动
        console.log(anchor);
        const scrollContainer = document.querySelector('.form-des');
        const { vmPreviewRef } = this.$refs;
        const { lineIndex } = anchor;
        const heading = vmPreviewRef.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);
        // v-md-editor自带的锚点定位方法
        if (heading) {
          // 注意：如果你使用的是编辑组件的预览模式,则这里的方法名改为 previewScrollToTarget
          vmPreviewRef.scrollToTarget({
            target: heading,
            scrollContainer: scrollContainer,
            top: 60,
          });
        }
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  body {
    margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
  }
  .app-container {
    height: 100%;
    .form-des{
      height: calc(100% - 32px);
      overflow: auto;
      .v-md-editor{
        height: 100%;
      }
      
    }
  }
  .main-container .form-des {
    margin-top: 0px !important;
    ::v-deep .el-header.main-header{
      // v-form的表头，改不了只能隐藏了
      display: none;
    }
    ::v-deep .el-header.toolbar-header{
      // v-form的 右半行工具栏，不能和左半行工具出现在同一行显示，使用定位强制限制在同一行
      position: relative;
      .right-toolbar {
        // float: right;
        position: absolute;
        top: 0;
        right: 0;
        text-align: right;
        width: 350px !important;
        display: flex;
        justify-content: flex-end;
      }
    }
    
    ::v-deep .el-container.full-height {
        margin-left: 0px!important;
      .el-container {
        height: 100%;
        .el-main.form-widget-main .el-scrollbar {
            height: 100%!important;
            .el-scrollbar__wrap,
            .el-scrollbar__view {
              height: 100%;
              .form-widget-container[data-v-28ec7276] {
                height: 100%;
                  .el-form.full-height-width[data-v-28ec7276] {
                    height: 100%;
                  .form-widget-list[data-v-28ec7276] {
                      min-height: 100%;
                      padding: 0px;
                  }
                }
              }
           }
        }
        .el-tabs.el-tabs--top{
          height: 100%;
        }
        .el-tabs__content {
            height: 90%;
            #pane-1,#pane-2{
              height: 100%;
              .el-scrollbar.setting-scrollbar{
                height: 100%!important;
              }
            }
        }
      }
    }
  }
  .previewBox{
    display: flex;
    position: relative;
    .previewIndexs{
      width: 10vw;
      position: fixed;
      height: 100%;
      overflow: scroll;
      // top: 0;
      box-shadow: 2px 0px 3px 0px #eee;
    }
    .v-md-editor-preview{
      position: absolute;
      left: 10vw;
    }
  }
  </style>