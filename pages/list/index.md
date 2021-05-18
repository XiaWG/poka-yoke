# list index 用法

  props : {
    columns: 列
    data: 数据源
    customSetting: 用户自定义设置
    selectable: 是否可选择
    expandable: 是否有展开项（目前仅支持按钮放在展开项内）
    multiple: 是否多选
    pagePlugin: 是否分页
    moreTitle: 分页时分页显示文本
  }

  columns: {
    key: 展示字段
    label: 标题
    width: 宽度
    type: 类型 1:文本展示多字段, 2:需转义的文本字段, 3:时间类型, 4: 输入框, 5: 弹框搜索类输入, 6: render
    fields: type为1时使用
    dataSource: type为2时使用,转义时所用的数据源,通过customSetting传入的dataSource对象
    defaultShowAllData: type为5时使用 是否默认查询所有数据
    linkAble: type为5时使用 判断弹框是否启用
    display: type为5时使用 选择数据后数据如何展示
    search: type为5时使用 定义搜索接口等
  }

  search: {
    url: 接口地址
    method: 接口方式 get post
    default_url: 本项目使用数据可能来自外部接口 true: 使用外部接口 false: 内部接口
    key: 键
    labelKey: 值
    params: 参数
    pagination: 是否分页 本项目分页和不分页取值有所区别
    multiple: 是否多选
    __type: 存在多个数据源时 以此区分
    panelTitle: 存在多个数据源时 显示的标题
    getDefaultSelection: 获取当前勾选记录 需提供_$id,sel__Name,__toDel,__type
  }

  customSetting: {
    operationPos: 按钮位置 expand - 在展开项中显示 row - 在当前行显示
    operation: 按钮列表
    dataSource: 数据源对象
  }

  operation: {
    label: 按钮名称
    action: 执行事件名称
    disable: 是否禁用 (row) => {}
    visiable: 是否可见 (row) => {}
    style: 内联样式
  }
