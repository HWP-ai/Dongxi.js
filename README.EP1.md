
![dongxi](resources/title.png)

# Dongxi.js Extension Package 1

## 概述

这个扩展包添加了 "environment" 筑构单元，以建立**一种非常高性能的事件处理机制**，提高事件交互能力。

## 安装

导入 Dongxi.js 文件：

```html
<script src="EP1/Dongxi.EP1.js"></script>
```

## API: builder.make('environment', info)

builder.make('environment', info) 可以构筑一个 "environment" 筑构单元。

### 基本概念： "environment" 的机制，组件节点，组件事件，应用函数

一切属性带有 "component" 的节点称为 "组件节点"。这可以通过 types 属性指定，例如：

```javascript
builder.make('button', {
	types: ["component"]
	...
})
```

以组件节点为目标的事件称为“组件事件”，即 event.target == thatNode 。此时也可称为组件节点的组件事件。

"environment" 会收听其文档树中后代节中的所有组件节点的未被阻止的组件事件，并且对这些事件（event）应用一个函数：

```javaScript
f(event, component, node)
```

其中 event 即该组件事件，component即该组件节点，node即这个 "environment" 。

**这个机制非常快而且非常灵活。**

### 清单： info 的域


info 的域及效果如下：

| 域                              |  效果                                                                           |
|---------------------------------|---------------------------------------------------------------------------------|
| 类别无关筑构信息域              |  非 "environment" 特有的域。参考 [README.md](./README.md) 。                    |
| info.events :: ["s"...]         |  指定收听的事件。例如 \['click', 'keypress'\] 。                                  |
| info.ports :: ainfos            |  类似于 connection 节点的 ports 域，用于创建子端节点。                          |
| info.onComponentEvent(e,c,n)    |  应用到组件事件上的函数。e是组件节点，c是组件事件，n是这个 "environment" 节点。 |

### 实例

这个例子将会建立两个文本为 "click1" 和 "click2" 的节点，当他们被点击的时候，会弹出一个对话框，分别显示 "click1" 和 "click2" 。

```javaScript

var builder = Dongxi.builder('main');
var units = builder.units;

units['testA'] = function(info){
	var node = this.make('environment', {
		
		events: "click",
		
		ports: [
		
		{
			sort: "text",
			info: {
				text: "click1",
				types: ["component", "click1"]
			}
		},
		
		{
			sort: "text",
			info: {
				text: "click2",
				types: ["component", "click2"]
			}
		},
		
		],
		
		onComponentEvent: function(event, component, node){
			if(component.hasAttribute("click1")){
				alert("click1");
				event.preventDefault();
			} else if(component.hasAttribute("click2")){
				alert("click2");
				event.preventDefault();
			}
		}
		
	});
	return node;
}

Dongxi.manage.run = function(){
	var stage = builder.make('stage', {});
	var testA = builder.make('testA');
	stage.appendChild(testA);
	window.document.body.prepend(stage);
}
```

# 更多信息

 * [README.md](./README.md)
 
