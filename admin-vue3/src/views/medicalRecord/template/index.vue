<template>
    <div class="temp-list-container">
        <el-row>
            <el-col :span="24"><div class="grid-content ep-bg-purple-dark" /></el-col>
        </el-row>
        <el-button @click="resetDateFilter">reset date filter</el-button>
        <el-button @click="clearFilter">reset all filters</el-button>
        <el-table 
         ref="tableRef"
         row-key="date"
        :data="tableData" 
        style="width: 100%"
        >
            <el-table-column fixed type="selection" width="55" />
            <el-table-column 
            label="创建日期"
            height="250"
            width="180"
            sortable
            column-key="date"
            :filters="[
                { text: '2016-05-01', value: '2016-05-01' },
                { text: '2016-05-02', value: '2016-05-02' },
                { text: '2016-05-03', value: '2016-05-03' },
                { text: '2016-05-04', value: '2016-05-04' },
            ]"
            :filter-method="filterHandler">
                <template #default="scope">
                    {{ scope.row.date }}
                </template>
            </el-table-column>
            <el-table-column 
            property="name" 
            label="模板名称" 
            width="120" />
            <el-table-column
            property="address"
            width="240"
            label="地址" 
            />
            <el-table-column 
            property="address" 
            label="use show-overflow-tooltip"
            show-overflow-tooltip/>
            <el-table-column
            prop="tag"
            label="Tag"
            width="100"
            :filters="[
                { text: 'Home', value: 'Home' },
                { text: 'Office', value: 'Office' },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
            >
                <template #default="scope">
                    <el-tag
                    :type="scope.row.tag === 'Home' ? 'primary' : 'success'"
                    disable-transitions
                    >{{ scope.row.tag }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column 
            fixed="right" 
            label="Operations" 
            min-width="120">
                <template #default="scope">
                    <el-button
                     link type="primary"
                     size="small"
                     @click="handleClick">
                        Edit
                    </el-button>
                    <el-button 
                    link 
                    type="primary" 
                    size="small"
                    @click.prevent="deleteRow(scope.$index)"
                    >Detail</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button class="mt-4" style="width: 100%" @click="onAddItem">
            Add Item
        </el-button>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue';
    import dayjs from 'dayjs';
    const tableRef = ref();

    const resetDateFilter = () => {
    tableRef.value!.clearFilter(['date'])
    }
    const clearFilter = () => {
    tableRef.value!.clearFilter()
    }
    const formatter = (row, column) => {
        return row.address
    }
    const filterTag = (value, row) => {
        return row.tag === value
    }
    const filterHandler = (value,row,column) => {
        const property = column['property']
        return row[property] === value
    }
    const now = new Date()
    const tableData = ref([
        {
            name: '模板名称',
            tempType: '模板类型',
            workType: '业务类型',
            inUsing: true,
            createName: 'admin',
            date: '2016-05-04',
            address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
            tag: 'Home',
        },
        {
            date: '2016-05-03',
            name: 'Helen Jacobi',
            address: '760 A Street, South Frankfield, Illinois',
            tag: 'Office',
        },
        {
            date: '2016-05-02',
            name: 'Brandon Deckert',
            address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
            tag: 'Home',
        },
        {
            date: '2016-05-01',
            name: 'Margie Smith',
            address: '23618 Windsor Drive, West Ricardoview, Idaho',
            tag: 'Office',
        },
    ]);
    const handleClick = ()=>{
        alert('edit')
    };
    const deleteRow = (index: number) => {
        tableData.value.splice(index, 1)
    };

    const onAddItem = () => {
        now.setDate(now.getDate() + 1)
        tableData.value.push({
            date: dayjs(now).format('YYYY-MM-DD'),
            name: 'Brandon Deckert',
            address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
            tag: 'Home',
        })
    }
</script>