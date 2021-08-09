# vue-print

## 原理

打印节点 + iframe + window.print()

## 使用方法

* 将 [print.js](src/plugs/print.js)插件放入项目
* 在main.js中引入插件

```javascript
import print from '@/plugs/print'

Vue.use(print)
```

* 调用方法

```javascript
this.$print(this.$ref.demo)

this.$print('.demo')

this.$print('#demo')

this.$print(document.getElementById('#demo'))

this.$print('#demo').then(() => {
    // 无论点击打印还是取消都是进入这里
    alert('after print')
})
```

### print.js
```javascript
/**
 * 打印类属性、方法定义
 * @param { HTMLElement | string }dom DOM节点或者选择器
 * @param options 选项参数
 * @param { string }options.noPrint 不打印节点选择器，默认.no-print
 * @returns {Promise<unknown>|Print}
 * @constructor
 */
const Print = function(dom, options = {}) {
        if (!(this instanceof Print)) {
            return new Print(dom, options)
        }

        return new Promise((resolve) => {
            this.options = this.extend({ 'noPrint': '.no-print' }, options)

            if ((typeof dom) === 'string') {
                this.dom = document.querySelector(dom)
            } else {
                this.dom = this.isDOM(dom) ? dom : dom.$el
            }
            this.init(resolve)
        })
    }
Print.prototype = {
    init: function(resolve) {
        const content = this.getStyle() + this.getHtml()
        this.writeIframe(content, resolve)
    },

    extend: function(obj, obj2) {
        if (obj2) {
            Object.keys(obj2).forEach(key => {
                obj[key] = obj2[key]
            })
        }
        return obj
    },

    getStyle: function() {
        let str = ''
        const styles = document.querySelectorAll('style,link')
        for (let i = 0; i < styles.length; i++) {
            str += styles[i].outerHTML
        }
        str += `<style>${this.options.noPrint || '.no-print'} {display:none;}</style>`

        // 去除页眉页脚分页符
        str += `<style>@page {size: auto; margin: 0;}</style>`

        return str
    },

    getHtml: function() {
        const inputs = document.querySelectorAll('input')
        const textarea = document.querySelectorAll('textarea')
        const selects = document.querySelectorAll('select')

        inputs.forEach((item) => {
            if (item.type === 'checkbox' || item.type === 'radio') {
                if (item.checked) {
                    item.setAttribute('checked', 'checked')
                } else {
                    item.removeAttribute('checked')
                }
            } else {
                item.setAttribute('value', item.value)
            }
        })

        textarea.forEach((item) => {
            if (item.type === 'textarea') {
                item.innerHTML = item.value
            }
        })

        selects.forEach((item) => {
            if (item.type === 'select-one') {
                const child = item.children
                for (const i in child) {
                    if (child[i].tagName === 'OPTION') {
                        if (child[i].selected) {
                            child[i].setAttribute('selected', 'selected')
                        } else {
                            child[i].removeAttribute('selected')
                        }
                    }
                }
            }
        })

        return this.dom.outerHTML
    },

    writeIframe: function(content, resolve) {
        const iframe = document.createElement('iframe')
        iframe.id = 'myIframe'
        iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;')
        const f = document.body.appendChild(iframe)
        const w = f.contentWindow || f.contentDocument
        const doc = f.contentDocument || f.contentWindow.document
        doc.open()
        doc.write(content)
        doc.close()
        iframe.onload = () => {
            this.toPrint(w, resolve)
            setTimeout(function() {
                document.body.removeChild(iframe)
            }, 100)
        }
    },

    toPrint: function(frameWindow, resolve) {
        try {
            setTimeout(function() {
                frameWindow.focus()
                try {
                    if (!frameWindow.document.execCommand('print', false, null)) {
                        frameWindow.print()
                    }
                } catch (e) {
                    frameWindow.print()
                }
                frameWindow.close()
                resolve(true)
            }, 10)
        } catch (err) {
            console.log('err', err)
        }
    },

    isDOM: function(obj) {
        return typeof HTMLElement === 'object' ? (obj instanceof HTMLElement) : (obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string')
    }
}

export default {
    install(Vue) {
        // 添加实例方法
        Vue.prototype.$print = Print
    }
}

```