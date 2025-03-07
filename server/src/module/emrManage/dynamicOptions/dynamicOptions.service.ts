import { Repository, In, Not } from 'typeorm';
import { Injectable, BadRequestException, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/module/redis/redis.service';

// 导入其他地方的实体，比如部门（department），医生（职员employee）
// import { DynamicOptionsEntity } from './entities/emr-medical-record.entity';
import { AxiosService } from 'src/module/axios/axios.service';
import { HrDeptService } from 'src/module/share/hrdept/hrdept.service';
import { DynamicOptionsDto, SelectDoctorDto, WidgetJsonDto, TreeNode, FeildTypeEnum } from './dto';
import { ResultData } from 'src/common/utils/result';

// 引入部门职员实体
import { HrDeptEntity } from 'src/module/share/hrdept/entities/hrdept.entity';
import { HrEmpEntity } from 'src/module/share/resuser/entities/hremp.entity';
import { MetadataEntity } from 'src/module/emrManage/metadata/entities/emr-metadata.entity';

import { ListHrDeptDto } from 'src/module/share/hrdept/dto';
import { MetadataService } from '../metadata/metadata.service';

// import { generateJobId } from 'src/common/utils/generator';

@Injectable()
export class DynamicOptionsService {
    constructor(
        @InjectRepository(HrDeptEntity, 'odoo18-2')
        private readonly hrDeptEntityRep: Repository<HrDeptEntity>,
        @InjectRepository(HrEmpEntity, 'odoo18-2')
        private readonly employeeEntityRep: Repository<HrEmpEntity>,
        @InjectRepository(MetadataEntity, 'odoo18-2')
        private readonly MetadataRepo: Repository<MetadataEntity>,

        private readonly metadataService: MetadataService,
        private readonly deptService: HrDeptService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        // private readonly configService: ConfigService,
        private readonly axiosService: AxiosService,
    ) { }

    // 获取部门选框选项列表
    async getDeptOptions() {
        // let list:DynamicOptionsDto[] = []
        let list: Array<DynamicOptionsDto> = []
        const entity = this.hrDeptEntityRep.createQueryBuilder('entity');
        // 数据库里available全是f和null……先屏蔽这个条件
        // parentid为9，核算科室，可挂号的科室
        entity.where('entity.parentId = 9');
        entity.select(['entity.completeName', 'entity.name', 'entity.id', 'entity.code'])
        const res = await entity.getMany();
        console.log('deptlist');
        list = res.map(item => {
            // pop，修改原数组，删除并返回数组的最后一个
            let deptName = item.completeName.split('/').pop()
            return {
                value: item.id + '',
                label: deptName
            }
        })
        console.log(list);
        return ResultData.ok(list);
    }

    // 获取医生选框选项列表
    async getDocterOptions(query: SelectDoctorDto) {
        let list: Array<DynamicOptionsDto> = []
        let deptID = query.deptID
        // 其实应该是先从排班表里面查符合条件的排班信息，得到ID列表，然后从职工表里面查是否为医生
        const entity = this.employeeEntityRep.createQueryBuilder('entity');
        entity.where('entity.departmentId = :deptID AND entity.performanceRank LIKE :type', { deptID, type: `%医师%` });
        // 添加条件，用户选择时间段，或者用户选择医生
        // if(query.regisDate && query.bookTime){
        //     scheduleEntity.andWhere('schedule.')
        // }
        // if(query.docterID){
        //     scheduleEntity.andWhere('schedule.codterId = :docterID',{docterID:query.docterID})
        // }

        entity.select(['entity.id', 'entity.name', 'entity.performanceRank', 'entity.departmentId'])
        const res = await entity.getMany();
        console.log('deptlist');
        console.log(res);

        list = res.map(item => {
            return {
                value: item.id + '',
                label: item.name
            }
        })
        return ResultData.ok(list);
    }

    // 动态生成模板所需字段
    async generateTemplate(query: any) {
        console.log(query);

        if (typeof query === 'string') {
            // 根据categoryCode查询一类的field
        }
        else if (Array.isArray(query)) {
            // 根据{code和codeName}list查所有的field
        }
        // 查询逻辑：根据category(_code)->code(_name)->no/value/value_mean
        let widgetListPromises = [];
        // 以TP04为例
        let { categoryCode, category } = query
        if (categoryCode && categoryCode !== 'TP33' && categoryCode !== 'TP34') {

            if (categoryCode === 'TP98') {
                // 自定义编码
            }
            else if (categoryCode === 'TP99') {
                // 其他编码
            }
            else { }
            let codeList = await this.metadataService.getFieldList({ categoryCode });
            console.log(codeList);
            if (Array.isArray(codeList)) {
                widgetListPromises = codeList.map(codeItem => {
                    return new Promise(async (resolve) => {
                        let code = codeItem.fieldName;
                        let codeName = codeItem.fieldLabel;
                        let widgetJson: WidgetJsonDto = {
                            "type": "input",
                            "name": code,
                            "label": codeName,
                            "id": code,
                            "optionItems": []
                        };

                        let options = await this.getOptions(code);
                        console.log('options-------------');
                        console.log(options);

                        let objType = Object.prototype.toString.call(options); // 更简洁的写法
                        console.log(objType);

                        if (objType === '[object Array]' && options.length > 0) {
                            console.log('111111111');

                            widgetJson.type = "select";
                            widgetJson.optionItems = options;
                        }

                        console.log(widgetJson);
                        resolve(widgetJson); // 解析 Promise
                    });
                });
            }
        } else if (categoryCode === 'TP33') {
            // ICD10疾病编码
            // 诊断编码和形态学编码

        } else if (categoryCode === 'TP34') {
            // ICD9手术编码
            // 只有手术编码

        }
        // 等待所有 Promise 完成，并收集结果
        let widgetList = await Promise.all(widgetListPromises);
        return ResultData.ok(widgetList);
    }

    async getOptions(code: string) {
        let valueList = [];
        let res = await this.metadataService.findValueListByCode(code);
        if (res.code === 200) {
            console.log(res.data)
            valueList = [...res.data]
        }
        return valueList
    }

    async getAllFeild(query: any) {
        // 获取常用category（这里暂时获取第一个category）的feilds（[{code,codeName}])
        console.log(query);
        let feilds: TreeNode[] = []
        // 获取标准库字段
        try {
            let standardFeilds = await this.getStandardLibrary()
            feilds.push({
                level: 1,
                label: '标准编码库',
                code: 'standard',
                name: '标准编码库',
                type: FeildTypeEnum.LIBRARY,
                children: standardFeilds
            })
        } catch (err) {
            console.log(err);
            throw new Error('err')
        }
        // 获取实体相关字段
        try {
            let entitiesFeilds = await this.getEntitiesFeilds()
            feilds.push({
                level: 1,
                code: 'entities',
                name: '实体字段',
                label: '实体字段库',
                type: FeildTypeEnum.LIBRARY,
                children: entitiesFeilds
            })
        } catch (err) {
            console.log(err);

        }
        return ResultData.ok(feilds)
    }
    async getStandardLibrary() {
        console.log('============查询标准库=============');
        // 获取所有category
        let categoryList = []
        let cates = []
        let codes = []
        let res = await this.metadataService.findCategory()
        console.log(res);
        if (res.code === 200) {
            categoryList = res.data.list
            res.data.list.forEach(cate => {
                codes.push(cate.categoryCode)
                cates.push(cate.category)
            })
        }
        let treeData: TreeNode[] = []
        let Lists = []
        let codeList = codes.slice(0, 3)
        try {
            Lists = await this.metadataService.findCodeByCategoryCode(codeList)
            if (!Array.isArray(Lists)) {
                throw new Error('Invalid response format');
            }
            // 构建树数据
            const categoryMap = new Map<string, TreeNode>();

            // 所有category都加载treeItem
            categoryList.forEach(cate => {
                // [{code,cate},{code,cate},...]==>{code,cate}==>cate
                let treeItem: TreeNode = {
                    level: 2,
                    type: FeildTypeEnum.CATEGORY,
                    code: cate.categoryCode,
                    name: cate.category,
                    parent: 'standard',
                    children: [],
                    label: cate.category
                }
                treeData.push(treeItem)
                // 将每个category的categoryCode映射到对应的TreeNode
                // 在后面修改时可以通过Map找到对应categoryCode，修改对应节点引用，实现修改treeData的效果
                categoryMap.set(cate.categoryCode, treeItem);
            })
            // 只有预加载的三个常用categoryCode加载children
            Lists.forEach(item => {
                // code,codename,category
                const treeItem = categoryMap.get(item.categoryCode);
                if (treeItem) {
                    item.label = item.codeName;
                    item.level = 3;
                    item.parent = item.categoryCode;
                    item.name = item.codeName;
                    item.type = FeildTypeEnum.FIELD;
                    treeItem.children.push(item);
                }
            })
        } catch (err) {
            console.log(err);
        }
        return treeData
    }
    async getEntitiesFeilds() {
        // 获取所有实体
        return []
    }
    translateTree(parent: { string: any }[], child: Array<any>) {

    }
}