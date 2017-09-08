# postcss-retina-border
![](https://img.shields.io/npm/v/postcss-retina-border.svg?style=flat-square)
![](https://img.shields.io/npm/dm/postcss-retina-border.svg?style=flat-square)

该postcss插件处理1px`border`问题。

该插件将检查`border`属性，如果包含`1px`或`1PX`设置，将添加[DPR 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)和`0.5PX`的border设置，使retina显示更细的border。

*该方式无法兼容android、 ios8以下设备。如果安卓机的DPR大于2，将会不显示border*


### 转换例子
```css
.border{
    display: block;
    width: 100px;
    height: 100px;
    border: 1px solid #333;
}
```
转换为：
```css
.border {
    display: block;
    width: 100px;
    height: 100px;
    border: 1px solid #333;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi)
{
    .border {
        border: 0.5PX solid #333;
    }
}
```

### 混合`border`设置
```css
.border {
    border: 1px solid #333;
    border-bottom: 0;
    border-left-width: 2px;
}
```
转换为：
```css
.border {
    border: 1px solid #333;
    border-bottom: 0;
    border-left-width: 2px;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi)
{
    .border {
        border: 0.5PX solid #333;
        border-bottom: 0;
        border-left-width: 2px;
    }
}
```

## 使用
### 安装
`npm i --save-dev postcss-retina-border`
### 使用
[参考](https://github.com/postcss/postcss#articles)

