
<h1 align="center">vue+element-ui实现富文本(含有图片粘贴拖拽上传)</h1>

<p align="center">Just For Share | 仅仅分享</p>

<p align="center">
    <img src="https://img-blog.csdnimg.cn/20200924112640236.png" alt="页面">
</p>

## 首先需要安装
   -  cnpm i vue-quill-editor -D  富文本编辑器
   -  cnpm install quill-image-resize-module --save 照片缩小放大
   -  cnpm install --save quill-image-drop-module  照片拖拽
   -  cnpm install --save quill-image-paste-module  照片拖拽  


## 特别注意会出现以下错误
  #### 安装好上述之后会出现下面错误
  Cannot read property 'imports' of undefined"
  ##### 解决
    找到webpack.base.conf.js，然后添加下面代码
    const webpack = require('webpack')
     plugins: [
    new webpack.ProvidePlugin({
      'window.Quill': 'quill/dist/quill.js',
      'Quill': 'quill/dist/quill.js'
    })
    ]
    
 <img src="https://img-blog.csdnimg.cn/20200924143405321.png" alt="代码截图">
 
 ## 整体代码 
  ### 包含以下的功能点  
  #### 中文展示  
           
    .editor {
      line-height: normal !important;
      height: 500px !important;

    }

    .ql-snow .ql-tooltip[data-mode=link]::before {
      content: "请输入链接地址:" !important;
    }

    .ql-snow .ql-tooltip  .ql-editing a.ql-action::after {
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
### 支持拖拽图片上传
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
### 支持粘贴图片上传
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

### 支持方法和缩小

  

### github地址是:https://github.com/lmx110522/nyist_python_secondmall.git
欢迎访问我的[个人博客](https://lmx110522.github.io/)。
上面的页面可能不太好看，我是一个写后端代码的小码农却喜欢做前台页面，我去努力进步的！，希望你的支持，谢谢花费时间看我的博客，万分感谢！

# 感谢   
- 感谢你的支持，麻烦点个star，辛苦

### 自我介绍
- 2016级南阳理工软件工程学生
- 2019-06～2019-12 水滴筹
- 2019-12~目前 同程旅行

寻找有梦想的你
</p>
