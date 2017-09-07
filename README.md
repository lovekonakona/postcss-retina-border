# postcss-retina-border
![](https://img.shields.io/npm/v/postcss-retina-border.svg?style=flat-square)
![](https://img.shields.io/npm/dm/postcss-retina-border.svg?style=flat-square)

该postcss插件处理1px`border`问题。

使用`@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi)`和`0.5PX`使retina显示更细的border。

参考资料：
* [Media_queries](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)

*该方式无法兼容android、 ios8以下设备。如果安卓机的DPR大于2，将会不显示border*

## 使用
### 安装
`npm i --save-dev postcss-retina-border`
### 使用
[参考](https://github.com/postcss/postcss#articles)

