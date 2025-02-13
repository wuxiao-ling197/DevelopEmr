<template>
    <!-- <el-table
      :data="visibleData"
      height="500"
      @scroll="handleScroll"
      style="width: 100%"
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
    </el-table> -->
    <!-- 使用vue-virtual-scroller -->
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
            <div class="label">
                <span>addressDetail</span>
                <span>gender</span>
                <span>writeDate</span>
                <span>identityType</span>
                <span>identifyid</span>
                <span>inpatient_flag</span>
                <span>name</span>
                <span>unique</span>
            </div>
            <RecycleScroller
            class="scroller"
            :items="visibleData"
            :item-size="50"
            key-field="id"
            @scroll="handleScroll"
            >
            <template v-slot="{ item }">
                <div class="item">
                <span>{{ item.addressDetail }}</span>
                <span>{{ item.gender }}</span>
                <span>{{ item.writeDate }}</span>
                <span>{{ item.identityType }}</span>
                <span>{{ item.identifyid }}</span>
                <span>{{ item.inpatient_flag }}</span>
                <span>{{ item.name }}</span>
                <span>{{ item.unique }}</span>
                </div>
            </template>
            </RecycleScroller>
        </el-card>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import VueVirtualScroller from "vue-virtual-scroller"
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
  
  import { getAllDocumentListApi } from "@/api/medicalRecord/emrApi";

  export default {
    components: {
      RecycleScroller,
    },
    setup() {
      const allData = ref([]);
      const visibleData = ref([]);
      const startIndex = ref(0);
      const endIndex = ref(20);
  
      const fetchData = async () => {
        let res = await getAllDocumentListApi()
        console.log(res);
        let data = [];
        if(res.code===200){
            console.log(res.data.list);
            data = res.data.list
            console.log(data);
            
            allData.value = data
            visibleData.value = data.slice(startIndex.value, endIndex.value);
        }
        // for (let i = 0; i < 10000; i++) {
        //   data.push({ id: i + 1, name: `Item ${i + 1}`, value: `Value ${i + 1}` });
        // }
        // allData.value = data;
        // visibleData.value = data.slice(startIndex.value, endIndex.value);
      };
  
      // 处理滚动事件
      const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
          // 加载更多数据
          startIndex.value = endIndex.value;
          endIndex.value += 20;
          visibleData.value = visibleData.value.concat(allData.value.slice(startIndex.value, endIndex.value));
        }
      };
  
      onMounted(() => {
        fetchData();
      });
  
      return {
        visibleData,
        handleScroll,
      };
    },
  };
  
  </script>
  
  <style lang="scss">
  .scroller {
    height: 500px;
    overflow-y: auto;
  }
  .item,
  .label {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
    span{
        width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  }
  </style>