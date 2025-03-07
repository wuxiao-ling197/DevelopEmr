<template>
    <div class="app-container">
        <!-- <switch-roles @change="handleRolesChange" /> -->
        <!-- 其实无论编辑还是新增模板，进来都是designer，只有查看才是render。并且disabled，模板没有formData -->
        <!-- 公式工具栏 -->
        <div class="formula-toolbar">
            <button @click="insertSymbol('∑')">∑</button>
            <button @click="openFormulaWizard">公式向导</button>
            <button @click="insertMatrix">矩阵模板</button>
        </div>
        <div class='form-des' :key="key" style="margin-top:30px;">
            <!-- 编辑器容器 -->
            <v-md-editor 
                ref="editor"
                :includes="editorIncludes"
                v-model="content"
                height="500px">
            </v-md-editor>
        </div>  
        <!-- 公式向导弹窗 -->
        <FormulaWizard 
        v-if="showWizard"
        @insert="handleFormulaInsert"
        @close="showWizard = false"/>
    </div>
</template>
<script setup>
const content = ref(`$$\\dose = \\frac{体重(kg) \\times 剂量率(mg/kg)}{生物利用度}$$`)
const tryText = ref(`
### 标题1
$$Z_5$$
文字 $Z_3$
`)
// 自定义工具栏扩展
const editorIncludes = [
  {
    name: 'formula-toolbar',
    toolbar: {
      title: '公式工具',
      icon: 'icon-math',
      action(editor) {
        editor.insert(() => '\\[ 公式位置 \\]');
      }
    }
  }
];

// 公式快捷键绑定
const KEYMAP = {
  'Ctrl-Alt-E': (editor) => {
    editor.insert('\\[ 在此输入公式 \\]');
  },
  'Ctrl-Shift-M': (editor) => {
    openMatrixTemplateSelector();
  }
};

// 上下文感知补全
const provideEditorSuggestions = (text, line) => {
  if (text.startsWith('\\')) {
    return [
      { label: '\\alpha', detail: '希腊字母α' },
      { label: '\\frac{}{}', detail: '分数模板' },
      { label: '\\dose', detail: '自定义剂量符号' }
    ];
  }
};

// 预置医疗公式模板
const MEDICAL_TEMPLATES = [
  {
    name: '药物剂量计算',
    latex: '\\dose = \\frac{体重(kg) \\times 剂量率(mg/kg)}{生物利用度}'
  },
  {
    name: 'BMI指数', 
    latex: 'BMI = \\frac{体重(kg)}{身高(m)^2}'
  },
  {
    name: '肌酐清除率',
    latex: 'Ccr = \\frac{(140 - 年龄) \\times 体重(kg)}{72 \\times Scr(mg/dL)}'
  }
];

// 语音输入转换
// const transcribeVoiceToFormula = (voiceText) => {
//   const mapping = {
//     '阿尔法': '\\alpha',
//     '西格玛': '\\sum',
//     '分数': '\\frac{}{}'
//   };
//   return voiceText.replace(/[\u4e00-\u9fa5]+/g, m => mapping[m] || m);
// };

// 手写识别集成
// const handleHandwriting = (strokes) => {
//   const recognized = handwritingSDK.recognize(strokes);
//   return convertSymbolsToLatex(recognized);
// };

function validateMedicalFormula(latex) {
  const dangerousPatterns = [
    /\\frac\s*{\s*[\d.]+}\s*{\s*0\s*}/, // 除零错误
    /\\sqrt\s*{\s*-?\d+}/ // 虚数检查
  ];
  return !dangerousPatterns.some(p => p.test(latex));
}

// PDF导出时替换为高分辨率公式
// function replaceForPrint(content) {
//   return content.replace(/\$\$(.*?)\$\$/g, (_, formula) => {
//     return katex.renderToString(formula, { output: 'mathml' });
//   });
// }

// let katexLoader;
// function loadKatexWhenNeeded(content) {
//   if (/\$\$?[^$]+\$?\$/.test(content) && !katexLoader) {
//     katexLoader = import('katex').then(() => {
//       initMedicalMacros();
//     });
//   }
//   return katexLoader;
// }

// const formulaCache = new LRU({
//   max: 500,
//   ttl: 3600000 // 1小时缓存
// });

// function renderCached(formula) {
//   const hash = md5(formula);
//   return formulaCache.get(hash) || 
//     katex.renderToString(formula, { displayMode: true });
// }
</script>

<style>
/* 医疗公式高亮规则 */
.katex .dose {
  color: #2e7d32;
  font-weight: bold;
}

/* 危险值警示 */
.katex .warning {
  border-bottom: 2px solid #c62828;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>