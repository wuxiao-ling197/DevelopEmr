<template>
    <div class="app-container">
        <el-row :span="24">
            <el-col :span="8">
                <el-button @click="documentEditEvt" style="width: 100%">新增档案</el-button>
            </el-col>
        </el-row>
        <!-- 填写基本信息区域 -->
        <!-- 挂号选择科室和医生的区域 -->
        <!-- 确认按钮 -->
        
        <el-card>
            <template #header>
                <span>用户信息档案</span>
            </template>
            <el-table 
            ref="tableRef"
            row-key="date"
            :data="infoList" 
            height="450"
            style="width: 100%"
            @select="selectEvt"
            @selection-change="selectionChangeEvt"
            @row-click="rowClickEvt"
            >
                <el-table-column fixed type="selection" width="55" />
                <el-table-column 
                label="创建日期"
                height="250"
                show-overflow-tooltip
                width="200">
                    <template #default="scope">
                        {{ scope.row.createDate }}
                    </template>
                </el-table-column>
                <el-table-column 
                fixed="left"
                property="name" 
                label="姓名" 
                width="120"/>
                <el-table-column 
                property="oldName" 
                label="曾用名" 
                width="120" />
                <el-table-column 
                property="gender" 
                label="性别" 
                width="120" >
                    <template #default=scope>
                        <span>{{ scope.row.gender===1?"男":"女" }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                property="nation" 
                label="名族" 
                width="120" >
                    <template #default=scope>
                        <span>{{ scope.row.nation===1?"汉族":"少数民族" }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                property="card_type_code" 
                label="卡类别" 
                width="120">
                    <template #default=scope>
                        <span>{{ scope.row.card_type_code===1?"身份证":scope.row.card_type_code===2?"护照":"驾驶证" }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                property="disaRes" 
                label="残疾情况" 
                width="120" >
                </el-table-column>
                <el-table-column 
                property="dieLocation" 
                label="死亡地点" 
                width="120" />
                <el-table-column 
                property="schoolgrade" 
                label="文化水平" 
                width="120" />
                
                <el-table-column 
                property="addressDetail" 
                label="详细地址" 
                width="240" />
                <el-table-column 
                property="addressTypeCode" 
                label="地址类别代码" 
                width="120" />
                <el-table-column 
                property="countryId" 
                label="国家" 
                width="120" >
                    <template #default=scope>
                        <span>{{ scope.row.countryId===48?"中国":"其他国家" }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                property="stateId" 
                label="省(自治区、直辖市)" 
                width="120" />
                <el-table-column 
                property="cityId" 
                label="市(地区、州)" 
                width="120" />
                <el-table-column 
                property="areaId" 
                label="县(区)" 
                width="120" />
                <el-table-column 
                property="domicileStateId" 
                label="户籍地址-省(自治区、直辖市)" 
                width="120" />
                <el-table-column 
                property="domicileCityId" 
                label="户籍地址-市(地区、州)" 
                width="120" />
                <el-table-column 
                property="domicileAreaId" 
                label="户籍地址-县(区)" 
                width="120" />
                <el-table-column 
                property="insurance" 
                label="医疗保险类别代码" 
                width="120" />
                <el-table-column 
                property="marry" 
                label="婚姻状况代码" 
                width="120" />
                <el-table-column 
                property="career" 
                label="职业类别代码" 
                width="120" />
                <el-table-column 
                property="workSubjection" 
                label="单位隶属关系" 
                width="120" />
                
                <el-table-column 
                property="averageIncome" 
                label="家庭年人均收入" 
                width="120" />
                
                <el-table-column 
                property="createUid" 
                label="档案创建人" 
                width="120" />
                <el-table-column 
                property="writeUid" 
                label="档案修改人" 
                width="120" />
                <el-table-column 
                property="politicalface" 
                label="政治面貌" 
                width="120" />
                <el-table-column 
                property="citizenHealthCardCode" 
                label="居民健康卡号" 
                width="120" />
                <el-table-column 
                property="citizenHealthArchiveCode" 
                label="居民健康档案编号" 
                width="120" />
                <el-table-column 
                property="identityType" 
                label="证件类型" 
                width="120" />
                <el-table-column 
                property="identifyid" 
                label="身份证号码" 
                width="120" />
                <el-table-column 
                property="phonenumber" 
                label="预留电话号码" 
                width="120" />
                <el-table-column 
                property="disaLv" 
                label="残疾等级" 
                width="120" />
                <el-table-column 
                property="dieReason" 
                label="死亡原因" 
                width="120" />
                <el-table-column 
                property="unique" 
                label="唯一识别码" 
                width="120" />
                <el-table-column 
                property="fax" 
                label="传真" 
                width="120" />
                <el-table-column 
                property="mail" 
                label="邮箱" 
                width="120" />
                width="120" />
                width="120" />
                <el-table-column 
                property="workName" 
                label="工作单位名称" 
                width="120" />
                <el-table-column 
                property="workPhone" 
                label="工作单位电话号码" 
                width="120" />
                <el-table-column 
                property="mail_code" 
                label="邮政编码" 
                width="120" />
                <el-table-column 
                property="contactName" 
                label="联系人姓名" 
                width="120" />
                <el-table-column 
                property="contactPhone" 
                label="联系人电话号码" 
                width="120" />
                <el-table-column 
                property="contacCateg" 
                label="联系人关系" 
                width="120" />
                <el-table-column 
                property="remark" 
                label="备注" 
                width="120" />
                <el-table-column 
                property="army" 
                label="是否退役军人" 
                width="120" >
                    <template #default=scope>
                        <span>{{ scope.row.army==true?"是":"否" }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                property="disability" 
                label="是否残疾人" 
                width="120" >
                    <template #default=scope>
                        <span>{{ scope.row.disability==true?"是":"否" }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                property="die" 
                label="是否死亡" 
                width="120" >
                    <template #default=scope>
                        <span>{{ scope.row.die==true?"是":"否" }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                property="bornyear" 
                label="出生年" 
                width="120" />
                <el-table-column 
                property="createDate" 
                label="创建日期" 
                width="120" />
                <el-table-column 
                property="writeDate" 
                label="修改日期" 
                width="120" />
                
                <!-- <el-table-column 
                fixed="right" 
                label="操作" 
                min-width="120">
                    <template #default="scope">
                        <el-button
                        link type="primary"
                        size="small"
                        @click="handleCallNumberEvt(scope.row)">
                            叫号
                        </el-button>
                        <el-button 
                        link 
                        type="primary" 
                        size="small"
                        @click.prevent="handleSkipPatientEvt(scope.row)"
                        >跳过</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <!-- 分页组件 -->
            <el-pagination 
            background 
            :hide-on-single-page="value"
            :page-size="pagesize"
            :pager-count="11"
            current-change
            @update:current-page="updatePageEvt"
            layout="prev, pager, next" 
            :total="totalsize" 
            />
        </el-card>
    </div>
</template>
<script setup>
import Mock from "mockjs";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getDocumentListApi } from "@/api/medicalRecord/emrApi";
const now = new Date()
const router = useRouter()
const infoList = ref([])
const selectQuery = {page:1,size:20}
let totalsize = ref(100)
let pagesize = ref(20)
let currentpage = ref(1)

const mockInfoList = Mock.mock({
    'list|5':[{
        'id':1,
        //   : '名族' })
        'nation': 1,
        //   : '卡类别代码' })
        'card_type_code': 1,
        //   : '残疾情况' })
        'disaRes': 1,
        //   : '死亡地点' })
        'dieLocation': 1,
        //   : '文化水平' })
        'schoolgrade': 1,
        //   : '详细地址' })
        'addressDetail': 1,
        //   : '地址类别代码' })
        'addressTypeCode': 1,
        //   : '国家' })
        'countryId': 48,
        //   : '省(自治区、直辖市)' })
        'stateId': 1,
        //   : '市(地区、州)' })
        'cityId': 1,
        //   : '县(区)' })
        'areaId': 1,
        //   : '户籍地址-省(自治区、直辖市)' })
        'domicileStateId': 1,
        //   : '户籍地址-市(地区、州)' })
        'domicileCityId': 1,
        //   : '户籍地址-县(区)' })
        'domicileAreaId': 1,
        //   : '医疗保险类别代码' })
        'insurance': 1,
        //   : '婚姻状况代码' })
        'marry': 1,
        //   : '职业类别代码' })
        'career': 1,
        //   : '单位隶属关系' })
        'workSubjection': 1,
        //   : '家庭年人均收入' })
        'averageIncome|+500': 2000,
        //   : 'Created by' })
        'createUid': 1,
        //   : 'Last Updated by' })
        'writeUid': 1,
        //   : '姓名' })
        'name|1': ['张三','李华','刘希','罗菲菲','黎明','杨鑫','秦柳絮','骆生'],
        //   : '曾用名' })
        'oldName': '曾用名',
        //   : '性别代码' })
        'gender': '性别代码',
        //   : '政治面貌' })
        'politicalface': '政治面貌',
        //   : '居民健康卡号' })
        'citizenHealthCardCode': '居民健康卡号',
        //   : '居民健康档案编号' })
        'citizenHealthArchiveCode': '居民健康档案编号',
        //   : '证件类型' })
        'identityType': '证件类型',
        //   : '身份证号码' })
        'identifyid': '身份证号码',
        //  : '预留电话号码' })
        'phonenumber': '预留电话号码',
        //   : '残疾等级' })
        'disaLv': '残疾等级',
        //   : '死亡原因' })
        'dieReason': '死亡原因',
        //   '唯一识别码' })
        'unique': '唯一识别码',
        //  '传真' })
        'fax': '传真',
        //   : '邮箱' })
        'mail': '邮箱',
        //   : '工作单位名称' })
        'workName': '工作单位名称',
        //   @: '工作单位电话号码' })
        'workPhone': '工作单位电话号码',
        //   : '邮政编码' })
        'mail_code': '邮政编码',
        //   : '联系人姓名' })
        'contactName': '联系人姓名',
        //   : '联系人电话号码' })
        'contactPhone': '联系人电话号码',
        //   '联系人关系' })
        'contacCateg': '联系人关系',
        //   '备注'
        'remark|1-5': '备注',
        //   '退役军人'
        'army': false,
        //   '残疾人'
        'disability': false,
        //   : '死亡'
        'die': false,
        'bornyear|1': '2002-08-17',
        'createDate|1': '2024-12-30',
        'writeDate|1': '2025-01-06'
    }]
})

onMounted(async()=>{
    reloadPage()
})
// 切换分页事件
function updatePageEvt(p){
    console.log(p);
    // alert(p)
    currentpage.value = p
    reloadPage()
}
// 分页渲染页面
async function reloadPage(){
    console.log(selectQuery);
    // 更新一下selectQuery的page
    selectQuery.page = currentpage.value
    console.log(selectQuery);
    let res = await getDocumentListApi(selectQuery)
    console.log(res);
    if(res.code===200){
        console.log(res.data);
        infoList.value = res.data.list
        totalsize.value = res.data.count
    }
    console.log(totalsize.value);
    
}

function documentEditEvt(){
    router.push('/emrManage/registerAndCheckIn/patientDocumentEdit')
}

</script>
<style lang="scss" scoped>

</style>