<template>
    <div class="app-container">
        <el-row :span="24">
            <el-col :span="8">
                <el-button style="width: 100%">按钮</el-button>
            </el-col>
        </el-row>
        <el-card>
            <template #header>
                <span>挂号单</span>
            </template>

            <div class="qr-content" ref="regisPaperRef">
                <div class="code">签到码：{{ checkCode }}</div>
                <!-- 用于显示二维码的容器 -->
                <div ref="qrcode" class="qrcode">
                    <img :src="qrImage" alt="QR Code" />
                </div>
                <canvas ref="qrcodeCanvas" id="qrcode"></canvas>
            </div>
        </el-card>
        <el-row :span="24">
            <el-col :span="24">
                <el-button @click="handlePrint" style="width: 100%;">打印挂号单</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
    import { nextTick, onMounted, ref } from "vue";
    import { getEMRModulesListApi,selectTemplateApi } from "@/api/medicalRecord/emrApi";
    import usePatientStore from '@/store/modules/patient';
    import { ElMessage,ElMessageBox } from "element-plus";
    import { registerApi } from "@/api/medicalRecord/emrApi";
    import { useRouter,useRoute } from "vue-router";
    // import QRCode from 'qrcodejs2';
    import * as QRCode from 'qrcode';
    
    const router = useRouter()
    // const route = useRoute()
    const qrcode = ref(null)

    const canvas = document.getElementById('qrcode');  // 获取 canvas 元素
    const qrcodeCanvas = ref(null);  // 获取 canvas 元素

    // 签到码
    let checkCode = ref('-1817763829')
    let qrImage = ref('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKkSURBVO3BQW7kQAwEwSxC//9yro88NSBI4/UQjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEk/CaVLgmdSpeETqVLQqfSJeE3qTxRrFGKNUqxRrl4mcqbknCicqLSJaFTuUPlTUl4U7FGKdYoxRrl4sOScIfKE0noVE6S0KnckYQ7VD6pWKMUa5RijXLx5ZLQqXRJOFGZpFijFGuUYo1yMUwSOpWTJHQq36xYoxRrlGKNcvFhKr9JpUvCicoTKn9JsUYp1ijFGuXiZUn4y1S6JHQqJ0n4y4o1SrFGKdYo8QdfLAlvUvlmxRqlWKMUa5SLh5LQqdyRhE6lS8IdKidJ6FS6JLxJ5SQJncoTxRqlWKMUa5T4gxcl4QmVkyR8ksqbknCi8qZijVKsUYo1ysXLVLokdCpdEk6S0Kl0SXhC5SQJT6j8pmKNUqxRijXKxX+mcqLSJeEJlZMk3KHyRBI6lSeKNUqxRinWKBcvS8JJEk5UuiR0KidJuCMJd6icJOF/KtYoxRqlWKPEH3yxJHQqdyThCZWTJHQqXRI6lSeKNUqxRinWKBcPJeE3qdyRhE7lDpUnVLokfFKxRinWKMUa5eJlKm9KwolKl4ROpUvCiconqXxSsUYp1ijFGuXiw5Jwh8odSThJwonKSRLuUDlJwonKE8UapVijFGuUiy+n0iWhU+mS0CWhU+lUTpLwlxRrlGKNUqxRLoZR6ZJwonKShCeS0Kl8UrFGKdYoxRrl4sNU/ieVO5LwRBLuSEKn8kSxRinWKMUa5eJlSfhNSThROUnCEyonSeiS8EnFGqVYoxRrlPiDNUaxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFH+AUoC+O5I/j4uAAAAAElFTkSuQmCC')

    const regisPaperRef = ref(null)
    // 获取单据票面html
    let receiptHtml = '';
    onMounted(async()=>{
        await nextTick()
        receiptHtml = regisPaperRef.value.innerHTML; // 获取 .qr-content 元素的内部 HTML

        // 从store或者路由参数里拿到签到码重新赋值
        checkCode.value = '-2085982197';
        
        // 生成二维码
        generateQRCode({content:qrcodeCanvas.value,text:checkCode.value})
    })
    // 点击打印按钮
    async function handlePrint(){
        ElMessageBox({
            title: '挂号单',
            message:  `<div style="max-width: 600px; overflow: auto; margin: auto">${receiptHtml}</div>`, 
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            callback: async(action) => {
                // 确认打印回调
                if (action === 'confirm') {
                    await printAndShowMessage()
                }else if (action === 'cancel') {
                    // 点击取消按钮
                    // console.log('打印取消');
                    ElMessage({
                        type: 'info',
                        message: '打印已取消。',
                    });
                }
            }, 
        })
    }
    // 生成二维码
    function generateQRCode({content,text,type='canvas'}) {
        if(type==='canvas'){
             // 确保 content 是一个 canvas DOM 元素
            if (!(content instanceof HTMLCanvasElement)) {
                throw new Error('For canvas type, content must be an HTMLCanvasElement');
            }
            QRCode.toCanvas(content, text, { errorCorrectionLevel: 'H' }, function(error) {
                if (error) {
                    console.error(error);
                } else {
                    console.log("QR Code successfully generated!");
                }
            });
        }else if(type==='img'){
            // 确保 content 是一个 img DOM 元素
            if (!(content instanceof HTMLImageElement)) {
                throw new Error('For img type, content must be an HTMLImageElement');
            }
            QRCode.toDataURL(text, { errorCorrectionLevel: 'H' }, function(error, url) {
                if (error) {
                    console.error(error);
                } else {
                    content.src = url;  // 将二维码图像显示在 img 元素中
                    console.log("QR Code image successfully generated!");
                }
            });
        }
    }
    async function printAndShowMessage(params) {
        try{
            // 调用打印方法
            await printPaper()
            ElMessage({
                type: 'success',
                message: `打印完成`
            })
            router.push('/emrManage/registerAndCheckIn/PatientCheckIn')
        }catch(err){
            console.error(err);
            ElMessage({
                type: 'error',
                message: '打印失败，请重试。'
            });
        }
    }
    // 打印方法
    async function printPaper(content){
        console.log(content);
        
    }
        
    // 打印相关
    // 对话框状态
    const dialogVisible = ref(false);
    
    // 对话框内容
    const dialogContent = ref('这是要打印的内容');
    
    // 图片路径
    const profileImageUrl = 'https://via.placeholder.com/150';
    
    // 对话框引用
    const dialogRef = ref(null);
    
    // 打印区域引用
    const printArea = ref(null);
    
    // 图片是否已加载完成
    const imageLoaded = ref(false);
    
    // 显示对话框
    const showDialog = () => {
    dialogVisible.value = true;
    };
    
    // 图片加载完成事件
    const onImageLoad = () => {
    imageLoaded.value = true;
    };
    
    // 打印对话框内容
    const printDialogContent = () => {
        if (dialogVisible.value && dialogRef.value && printArea.value) {
            const printElement = printArea.value;
        
            if (!imageLoaded.value) {
            console.warn('图片尚未加载完成，请稍后重试。');
            return;
            }
        
            const createPrintWindow = () => {
                const newWindow = window.open('', '_blank'); // 创建一个新的空白窗口
                if (newWindow) {
                    setTimeout(() => {
                    newWindow.document.write('<html><head><title>打印内容</title></head><body>');
                    newWindow.document.write(printElement.innerHTML);
                    newWindow.document.write('</body></html>');
                    newWindow.document.close();
            
                    // 触发打印
                    newWindow.print();
            
                    // 关闭窗口
                    newWindow.close();
                    }, 100); // 延迟100毫秒执行
                } else {
                    console.error('无法打开新窗口');
                }
            };
        
            createPrintWindow();
        }
        
    };
</script>
<style lang="scss" scoped>
.qr-content{
    width: 100%;
    height: 300px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.qrcode{
    width: 200px;
    height: 200px;
    border: 1px solid gray;
    img{
        width: 190px;
        height: 190px;
        display: block;
        margin: auto;
    }
}
</style>