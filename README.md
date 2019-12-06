# EasyAPI JSON 注释显示组件

## 组建命名

easyapi-json-view

## 组建描述

EasyAPI JSON 注释显示组件，主要作用就是美化显示 JSON 数据，在此基础上，多一个类型和注释（类型一般 JSON 显示组件也有）。

## 组建效果图

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

| Props       |              |
| ----------- | ------------ |
| jsonData    | json data    |
| commentData | comment data |

---

| commentData  |             |
| ------------ | ----------- |
| name         | key name    |
| remark       | 注释        |
| childParams? | childParams |

## Example

```
<el-json-view
    :jsonData="jsonData"
    :commentData="commentData"
></el-json-view>

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
