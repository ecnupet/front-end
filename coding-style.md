# Coding Style

## 基本要求

- 不使用默认导出（懒加载除外）
- 为每个文件夹提供`index`进行导出（如果是 TS 模块或组件）
- 无类型错误，非特殊情况不能禁止 TS 检查
- 无 lint 警告（commit hooks 会做修正）

## 项目要求

### 状态管理

- 全局状态通过`createStore`统一管理

### 业务逻辑

- 业务逻辑的方法放在同级目录独立的`service.ts`文件内
- `service`的实现可以是纯粹的函数，也可以是`Service`类，如果为类实现，需要在构造函数里调用`makeAutoObservable(this)`
- 使用`useService/createService`实例化`Service`类，得到绑定`this`的对象，尽量不要手动实例化

### 组件

- 函数组件和类组件均可
- 渲染相关的函数以`render`开头命名
- 事件处理、交互的函数以`handle`开头命名
- 类组件：除生命周期方法，类组件的方法必须为渲染相关方法，组件内部状态也托管于`service`
- 组件样式放在同级目录`style.module.css`文件里
- 全局样式放在`/src/index.css`文件里

## git 提交信息

格式：`<类型>: [内容描述]`

- feat: 完成新功能或模块
- init: 初始化
- chore: 杂务，脚本等
- style/refactor/code: 代码整理、重构等
- ui: 界面修改
- temp: 想不出来可以用，但尽量避免
- 其他类型: 可自定义，必须是英文，但定义的类型必须满足要求
