<template>
  <div>
    <div class="edit_container">
      <quillEditor
        class="editor"
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"/>
    </div>
  </div>
</template>

<script>
//自定义字体类型

/*富文本编辑图片上传配置*/
const uploadConfig = {
  action: '/api/oa/uploadFile',  // 必填参数 图片上传地址
  methods: 'POST',  // 必填参数 图片上传方式
  filename: 'img',  // 必填参数 文件的参数名
  size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{'header': 1}, {'header': 2}],
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],
  [{'indent': '-1'}, {'indent': '+1'}],
  [{'direction': 'rtl'}],
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'color': []}, {'background': []}],
  [{'font': []}],
  [{'align': []}],
  ['clean'],
  ['link', 'image']
];
const handlers = {
  image: function image() {
    var self = this;
    var fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput === null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      // 设置图片参数名
      if (uploadConfig.filename) {
        fileInput.setAttribute('name', uploadConfig.filename);
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept);
      fileInput.classList.add('ql-image');
      let name = ''
      // 监听选择文件
      fileInput.addEventListener('change', function () {
        // 创建formData
        var formData = new FormData();
        name = fileInput.files[0].name
        formData.append("filename", name);
        formData.append("file", fileInput.files[0]);
        formData.append("path", "advice");
        // 图片上传
        var xhr = new XMLHttpRequest();
        xhr.open(uploadConfig.methods, uploadConfig.action, true);
        // 上传数据成功，会触发
        xhr.onload = function (e) {
          if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            let length = self.quill.getSelection(true).index;
            //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
            let path = '/api/oa/loadFile?path=advice&filename=' + name
            self.quill.insertEmbed(length, 'image', path);
            self.quill.setSelection(length + 1)
          }
          fileInput.value = ''
        };
        // 开始上传数据
        xhr.upload.onloadstart = function (e) {
          fileInput.value = ''
        };
        // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
        xhr.upload.onerror = function (e) {
        };
        // 上传数据完成（成功或者失败）时会触发
        xhr.upload.onloadend = function (e) {
          // console.log('上传结束')
        };
        xhr.send(formData)
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  }
};

import {quillEditor} from 'vue-quill-editor'
import {ImageDrop} from 'quill-image-drop-module';
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 粘贴图片上传
import {ImageExtend} from 'quill-image-paste-module'

Quill.register('modules/ImageExtend', ImageExtend)

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

export default {
  components: {quillEditor},
  data() {
    return {
      fileName: '1',
      content: "",
      editorOption: {
        placeholder: '快来提建议吧，支持照片插入(点击照片可以缩放和放大)和拖拽上传哦，........',
        theme: 'snow',  // 主题
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候的自带样式
            matchers: [[Node.ELEMENT_NODE, this.HandleCustomMatcher]],
          },
          toolbar: {
            container: toolOptions,  // 工具栏选项
            handlers: handlers,  // 事件重写
          },
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageDrop: false,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white',
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          // 截屏上传
          ImageExtend: {
            loading: true,
            name: 'file',
            action: '/api/oa/uploadFile',
            change: (xhr, FormData) => {
              var uuid = "cms"+this.guid();
              FormData.append('path', "advice")
              FormData.append('filename', uuid)
              this.fileName = uuid
            },
            response: (res) => {
              console.log(res, 'response')
              return "/api/oa/loadFile?path=advice&filename="+this.fileName
            }
          }
        }
      }
    };
  },
  methods: {
    //用于生成uuid
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    guid() {
      return (this.S4() + this.S4() + "-" +this.S4());
    },
    HandleCustomMatcher(node, Delta) {
      // 文字、图片等，从别处复制而来，清除自带样式，转为纯文本
      let ops = []
      Delta.ops.forEach(op => {
        if (op.insert && typeof op.insert === 'string') {
          ops.push({
            insert: op.insert,
          })
        }
      })
      Delta.ops = ops
      return Delta
    },
    onEditorReady(editor) {
    }, // 准备编辑器

    onEditorBlur() {
    }, // 失去焦点事件

    onEditorFocus(val, editor) {
      console.log(val); // 富文本获得焦点时的内容
    }, // 获得焦点事件

    onEditorChange() {
    }, // 内容改变事件

    sendMsg(newval) {
      this.$emit("msgEvent", this.content)
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  watch: {
    content(val, newval) {
      this.sendMsg(newval)
    }
  }
};
</script>

<style lang="less">

.editor {
  line-height: normal !important;
  height: 500px !important;

}

.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:" !important;
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px !important;
  content: '保存' !important;
  padding-right: 0px !important;
}


.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体' !important;
}


</style>
