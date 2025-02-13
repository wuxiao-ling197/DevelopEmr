<template>
    <el-card>
        <template #header>
            My Tree Component
        </template>
        <div class="select-template-box">
            <div class="left">
            <el-input
                v-model="filterText"
                style="width: 240px"
                placeholder="Filter keyword"
            />
            <el-tree
                ref="treeRef"
                style="max-width: 600px"
                class="filter-tree"
                :data="props.data"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
            />
            </div>
            <div class="right">
            <h1>当前模板</h1>
            <p>text content</p>
            预览模板
            </div>
        </div>
    </el-card>
</template>
<script setup>
    import { onMounted } from 'vue';

    const props = defineProps({
        data:{type: Object,default:()=>treeData}
    })
    onMounted(()=>{
        console.log(props.data);
    })

    // 输入框检索关键字
    const filterText = ref('')
    const treeRef = ref()

    const defaultProps = {
        children: 'children',
        label: 'label',
    }
    watch(filterText, (val) => {
        treeRef.value.filter(val)
    })
    // 树节点默认数据
    const treeData = [
        {
            id: 1,
            label: 'Level one 1',
            children: [
            {
                id: 4,
                label: 'Level two 1-1',
            },
            ],
        }
    ]
    // 过滤节点数据的方法
    const filterNode = (value, data) => {
        if (!value) return true
        return data.label.includes(value)
    }
</script>
<style lang="scss" scoped>
    .select-template-box{
        display: flex;
        .left{
            width: 30%;
        }
        .right{
            width: 70%;
            box-shadow: inset 2px 2px 3px #eee;
        }
    }
</style>