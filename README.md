# EasyAPI注释显示组件

## 组件命名

easyapi-data-view

## 组件描述

EasyAPI注释显示组件，主要作用就是美化显示 JSON、XML 数据，在此基础上，多一个类型和注释。

## 组件效果图

![image](https://qiniu.easyapi.com/easyapi-json-view.png)

> 颜色说明：注释 背景底色 字体颜色，类型

## 2 个数据格式

传入数据包括 2 个 JSON 数据对象

_1、标准 JSON 数据_

> 用来显示 JSON 的基础数据，使用 pre 标签，风格采用
> _2、JSON 注释数据_
> 默认勾选数据类型、数据注释，如图所示显示数据类型与数据注释，

## 方法说明

_1、showType 显示数据类型（字段类型）_

_2、showDescription 显示数据注释（字段描述）_

## 更多

_数据类型（字段类型）_

> string, number, boolean, integer, float, double, object, array

## Props

| Props       |  中文         |
| ----------- | ------------ |
| jsonData    | json data    |
| commentData | comment data |

---

| commentData  |  中文        |
| ------------ | ----------- |
| name         | key name    |
| remark       | 注释        |
| childParams? | childParams |

## Example

```
<easyapi-data-view :jsonData="jsonData" :commentData="commentData"></easyapi-data-view>

<script>

export default {
  name: "app",
  data: function() {
    return {
      commentData: [
        {
          name: "dddd",
          remark: "232"
        },
        {
          name: "fff",
          remark: null,
          childParams: [
            {
              name: "fasd",
              remark: "22"
            },
            {
              name: "vvv",
              remark: "fff"
            }
          ]
        },
        {
          name: "vvv",
          remark: "123"
        }
      ],
      jsonData: {
        dddd: 1234,
        fff: {
          fasd: "213",
          vvv: "12312"
        },
        vvv: "ass"
      }
    };
  },
  mounted: function() {}
};
</script>


```

## 目录结构

```
├── dist                      打包后产物
├── example                   运行用例
├── plugins                   插件
├── src                       源码
│   ├── utils                 工具包
│   ├── index.vue             组件源码
│   └── index.js
├── webpack.base.js           webpack配置基础
├── webpack.build.js          webpack配置prod
└── webpack.config.js         webpack配置dev
```
