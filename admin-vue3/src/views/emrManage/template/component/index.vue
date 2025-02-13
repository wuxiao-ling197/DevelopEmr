<template>
    <div class="app-container">
        <el-container>
            <!-- <el-header>Header</el-header> -->
            <el-container>
                <el-aside width="300px">
                    <el-input v-model="selectKey" @blur="selectEvt(selectKey)">

                    </el-input>
                    <div class='tree-title'>元素控件</div>
                    <el-tree
                        :data="data"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                    />
                </el-aside>
                <el-main>
                    <!-- form表单 -->
                    <el-form :model="config" label-width="auto">
                        <el-row>
                            <el-col :span="12">
                                <!-- parent: '',//上级元素 -->
                                <el-form-item label="上级元素">
                                    <el-select v-model="config.parent">
                                        <el-option v-for="opt in parentList"
                                        :key="opt"
                                        :label="opt.label" 
                                        :value="opt.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="元素名称">
                                    <el-input v-model="config.name" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <!-- type: '',//元素类型 -->
                                <el-form-item label="元素类型">
                                    <el-select v-model="config.type" placeholder="please select">
                                        <el-option label="字符串" value="String" />
                                        <el-option label="数字" value="Number" />
                                        <el-option label="对象" value="Object" />
                                        <el-option label="数组" value="Array" />
                                        <el-option label="布尔值" value="Boolean" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row>
                            <el-col :span="12">
                                <!-- symbol: '',//元素标识 -->
                                <el-form-item label="元素标识">
                                    <el-input v-model="config.symbol" />
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <!-- readOnly: false,//是否只读 -->
                                <el-form-item label="只读">
                                    <el-radio-group v-model="readOnlyRedio">
                                        <!-- <el-radio value="1" size="large">只读</el-radio>
                                        <el-radio value="2" size="large">编辑</el-radio> -->

                                        <!-- elementPlus版本<2.6.0，只能这么用 -->
                                        <el-radio label="Label1 & 1">是</el-radio>
                                        <el-radio label="Label2 & 2">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <!-- editable: true,//允许编辑 -->
                                <el-form-item label="允许编辑">
                                    <el-select v-model="config.editable" placeholder="please select your zone">
                                        <el-option label="允许" :value="true" />
                                        <el-option label="禁止" :value="false" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="格式">
                                    <el-input v-model="config.format" />
                                </el-form-item>                                    
                            </el-col>
                            <!-- <el-col :span="12">                    
                                <el-form-item label="背景文字">
                                    <el-input v-model="config.background" />
                                </el-form-item>
                            </el-col> -->
                        </el-row>

                        <el-row>
                            <el-col :span="12">                  
                                <el-form-item label="是否校验">
                                    <el-select v-model="config.ifValidate" placeholder="please select your zone">
                                        <el-option label="是" :value="true" />
                                        <el-option label="否" :value="false" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">       
                                <el-form-item label="校验规则">
                                    <el-input-tag
                                        v-model="rules"
                                        placeholder="Please input"
                                        aria-label="Please click the Enter key after input"
                                    />
                                    <el-input-tag v-model="config.rules" draggable placeholder="Please input" />
                                    <el-input v-model="config.rules" disabled >
                                        <template #append>
                                            <el-button @click="addValidateEvt" :disabled="!config.ifValidate">添加校验</el-button>
                                        </template>
                                    </el-input>
                                    
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="4">       
                                <el-button @click="addValidateEvt" :disabled="!config.ifValidate" >添加校验</el-button>
                            </el-col> -->
                        </el-row>


                        <!-- data: '',//数据源 -->
                        <el-form-item label="数据源">
                            <el-input v-model="config.data" />
                        </el-form-item>
        
                        <el-form-item label="时间">
                            <el-col :span="11">
                                <el-date-picker
                                v-model="config.date1"
                                type="date"
                                placeholder="Pick a date"
                                style="width: 100%"
                                />
                            </el-col>
                            <el-col :span="2" class="text-center">
                                <span class="text-gray-500">-</span>
                            </el-col>
                            <el-col :span="11">
                                <el-time-picker
                                v-model="config.date2"
                                placeholder="Pick a time"
                                style="width: 100%"
                                />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="是否启用">
                            <el-switch v-model="config.inUsing" />
                        </el-form-item>
                        <!-- 备注 -->
                        <el-form-item label="备注">
                            <el-input v-model="config.desc" type="textarea" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitEvt">保存配置</el-button>
                            <el-button @click="resetEvt">重置</el-button>
                            <el-button @click="creatComponent">创建基础控件</el-button>
                        </el-form-item>
                    </el-form>
                    <template #footer>Footer content</template>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
  <script setup>
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';


    /**tree的数据 */
    const handleNodeClick = (data) => {
        console.log(data)
        if(!!data.info){
            // form = {...data.info}
            console.log(data.info);
            
            Object.assign(config, data.info)
            readOnlyRedio.value = data.info.readOnly?'1':'2'
            // 暂存配置
            origConfig = Object.assign({},config)
            // console.log(config);
            // console.log(origConfig);
            
        }
    }

    // 搜索框value
    const selectKey = ref('');
    // 搜索事件
    const selectEvt = (value)=>{
        console.log(value);
        
    }
    
    // 主体配置表单config
    /**config的数据 */
    const config = reactive({
        name: '',//元素名称
        type: [],//元素类型
        parent: '',//上级元素
        // children: [],//子级元素
        symbol: '',//元素标识
        readOnly: false,//是否只读
        format: '',//格式
        editable: true,//允许编辑
        // background: '',//背景文字
        data: '',//数据源
        style: '',
        editStyle: '',
        date1: '',
        date2: '',
        inUsing: true,//是否启用
        resource: '',
        desc: '',//备注
        ifValidate: false,//是否设置校验
        rules:['tag1', 'tag2', 'tag3']//校验规则，暂定结构为{name:'name1',rule:[rule1,rule2,rule3...]}
    })

    let rules = ref()
    // 暂存初始配置
    let origConfig = {}
    const parentList = ref()
    onMounted(()=>{
        // 获取基础元素控件data
        parentList.value = data.map(element => {
            return{label:element.label,value:element.label}
        });
        console.log(parentList.value);
    })
    const readOnlyRedio = ref('1');
    const data = reactive([
    {
        label: '门诊病历通用元素',
        info: {
            name: '门诊病历通用元素',//元素名称
            type: 'Object',//元素类型
            parent: '',//上级元素
            desc: 'have a try',//备注
            symbol: '',//元素标识
            readOnly: true,//只读
            format: '',//格式
            editable: true,//允许编辑
            background: '',//背景文字
            data: '',//数据源
            style: '',
            editStyle: ''
        },
        children: [{
            label: '门诊病历通用元素 1-1',
            info: { 
                name: '门诊病历通用元素 1-1',//元素名称
                type: 'Object',//元素类型
                parent: '门诊病历通用元素',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
            children: [{
                label: '门诊病历通用元素 1-1-1',
                info: { 
                    name: '门诊病历通用元素 1-1-1',//元素名称
                    type: 'Object',//元素类型
                    parent: '门诊病历通用元素 1-1',//上级元素
                    desc: 'have a try',//备注
                    symbol: '',//元素标识
                    readOnly: true,//只读
                    format: '',//格式
                    editable: true,//允许编辑
                    background: '',//背景文字
                    data: '',//数据源
                    style: '',
                    editStyle: ''
                },
            }],
        }],
    },
    {
        label: '患者基础信息',
        info: { 
            name: '患者基础信息',//元素名称
            type: 'Object',//元素类型
            parent: '',//上级元素
            desc: 'have a try',//备注
            symbol: '',//元素标识
            readOnly: true,//只读
            format: '',//格式
            editable: true,//允许编辑
            background: '',//背景文字
            data: '',//数据源
            style: '',
            editStyle: ''
        },
        children: [{
            label: '患者基础信息 2-1',
            info: { 
                name: '患者基础信息 2-1',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
            children: [{
                label: '患者基础信息 2-1-1',
                info: { 
                    name: '患者基础信息 2-1-1',//元素名称
                    type: 'Object',//元素类型
                    parent: '',//上级元素
                    desc: 'have a try',//备注
                    symbol: '',//元素标识
                    readOnly: true,//只读
                    format: '',//格式
                    editable: true,//允许编辑
                    background: '',//背景文字
                    data: '',//数据源
                    style: '',
                    editStyle: ''
                },
            }],
        },{
            label: '患者基础信息 2-2',
            info: { 
                name: '患者基础信息 2-2',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        }],
    },
    {
        label: '未归类元素',
        info: { 
            name: '未归类元素',//元素名称
            type: 'Object',//元素类型
            parent: '',//上级元素
            desc: 'have a try',//备注
            symbol: '',//元素标识
            readOnly: true,//只读
            format: '',//格式
            editable: true,//允许编辑
            background: '',//背景文字
            data: '',//数据源
            style: '',
            editStyle: ''
        },
        children: [{
            label: '未归类元素 3-1',
            info: { 
                name: '未归类元素 3-1',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        },{
            label: '未归类元素 3-2',
            info: { 
                name: '未归类元素 3-2',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        },{
            label: '未归类元素 3-3',
            info: { 
                name: '未归类元素 3-3',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        },{
            label: '未归类元素 3-4',
            info: { 
                name: '未归类元素 3-4',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        }],
    },
    {
        label: '住院病历通用元素',
        info: { 
            name: '住院病历通用元素',//元素名称
            type: 'Object',//元素类型
            parent: '',//上级元素
            desc: 'have a try',//备注
            symbol: '',//元素标识
            readOnly: true,//只读
            format: '',//格式
            editable: true,//允许编辑
            background: '',//背景文字
            data: '',//数据源
            style: '',
            editStyle: ''
        },
        children: [{
            label: '住院病历通用元素 4-1',
            info: { 
                name: '住院病历通用元素 4-1',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        }],
    },
    {
        label: '护理记录元素',
        info: { 
            name: '护理记录元素',//元素名称
            type: 'Object',//元素类型
            parent: '',//上级元素
            desc: 'have a try',//备注
            symbol: '',//元素标识
            readOnly: true,//只读
            format: '',//格式
            editable: true,//允许编辑
            background: '',//背景文字
            data: '',//数据源
            style: '',
            editStyle: ''
        },
        children: [{
            label: '护理记录元素 5-1',
            info: { 
                name: '护理记录元素 5-1',//元素名称
                type: 'Object',//元素类型
                parent: '',//上级元素
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        }],
    },
    {
        label: '医嘱单打印元素',
        info: { 
            name: '医嘱单打印元素',//元素名称
            type: 'Object',//元素类型
            parent: '',//上级元素
            desc: 'have a try',//备注
            symbol: '',//元素标识
            readOnly: true,//只读
            format: '',//格式
            editable: true,//允许编辑
            background: '',//背景文字
            data: '',//数据源
            style: '',
            editStyle: ''
        },
        children: [{
            label: '医嘱单打印元素 6-1',
            info: { 
                name: '医嘱单打印元素 6-1',//元素名称
                type: 'Object',//元素类型
                parent: '医嘱单打印元素',//上级元素，关联标签
                desc: 'have a try',//备注
                symbol: '',//元素标识
                readOnly: true,//只读
                format: '',//格式
                editable: true,//允许编辑
                background: '',//背景文字
                data: '',//数据源
                style: '',
                editStyle: ''
            },
        }],
    },
    ])

    const defaultProps = {
        children: 'children',
        label: 'label',
    }

    // 添加校验按钮
    const addValidateEvt = ()=>{
        alert('add01')
    }
    // 提交按钮，保存新建或更改
    const submitEvt = async () => {
        console.log(config);
        let temp = 'id-001'
        let res = await updateTemplateConfigApi(temp,config)
        console.log(res);
        if(res.code===200){
            
            ElMessage({type:'success',message:res.msg})
        }else{
            ElMessage({type:'error',message:res.msg})
        }
    }
    async function updateTemplateConfigApi(temp,config) {
        return new Promise((resolve,reject)=>{
            if(config&&temp&&config.name){
                resolve({code:200,msg:'success!'})
            }else{
                resolve({code:500,msg:'error!'})
            }
        })
    }
    // 重置，恢复到未修改状态
    const resetEvt = ()=>{
        // 重新赋值为初始配置
        Object.assign(config,origConfig)
        
    }

    // 创建组件
    const creatComponent = ()=>{
        // payload
        // 弹出或者跳转

    }
    
  </script>
  
  <style lang="scss" scoped>
  body {
    margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
  }
  .el-aside{
    padding: 1px;
  }
  .tree-title{
    font-size: 16px;
    font-weight: 500;
    text-indent: 2rem;
  }
  ::v-deep .el-tree{
    .el-tree-node,
    .el-tree-node__content{
        // height: 50px;
        // padding-top: 10px;
        font-size: 14px;
        border-bottom: 1px #eee dashed;
    }
  }
  .main-container .form-des {
    margin-left: -210px;
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
        // overflow: hidden;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  </style>
  