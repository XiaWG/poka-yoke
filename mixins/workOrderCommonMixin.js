import { workOrderStateMachine } from "@/api/remote.js"

const workOrderCommonMixin = {
  data() {
    return {
      
    }
  },
  computed: {
    statusList() {
      return this.$store.state.stateMachineList
    },
    //工单状态颜色
    statusColor() {
      return function (status) {
        let color = '#ccc'
        switch (status) {
          case 'created':
            color = '#00BCD4'
            break
          case 'estimate':
            color = '#9c27b0'
            break
          case 'scheduling':
            color = 'orange'
            break
          case 'issue':
            color = '#ff4d4f'
            break
          case 'confirm':
            color = '#52c41a'
            break
          case 'processing':
            color = '#1890ff'
            break
          case 'finished':
            color = '#000000'
            break
          case 'closed':
            color = '#999'
            break
        }
        return {
          color
        }
      }
    },
  },
  methods: {
    //获取工单状态机
    getWorkOrderStatusList() {
      return workOrderStateMachine().then(res => {
        this.statusList = res.data
      })
    },
    //获取某一状态前的所有状态
    getOperableStatusList(status) {
      const operableStatus = []
      let newStatusList = JSON.parse(JSON.stringify(this.statusList))
      const fuc = sourceList => {
        let item = []
        for (let i = 0; i < newStatusList.length; i++) {
          if (sourceList.includes(newStatusList[i].target)) {
            item.push(newStatusList[i])
            newStatusList.splice(i, 1)
            i--
          }
        }
        if (item.length) {
          const newSourceList = [...new Set(item.map(i => i.source))]
          operableStatus.push(...newSourceList)
          fuc(newSourceList)
        }
      }
      fuc([status])
      return [...new Set(operableStatus)]
    },
    //获取某一状态后的所有状态
    getOperableStatusListAfter(status) {
      const operableStatus = []
      let newStatusList = JSON.parse(JSON.stringify(this.statusList))
      const fuc = sourceList => {
        let item = []
        for (let i = 0; i < newStatusList.length; i++) {
          if (sourceList.includes(newStatusList[i].source)) {
            item.push(newStatusList[i])
            newStatusList.splice(i, 1)
            i--
          }
        }
        if (item.length) {
          const targetList = [...new Set(item.map(i => i.target))]
          operableStatus.push(...targetList)
          fuc(targetList)
        }
      }
      fuc([status])
      return [...new Set(operableStatus)]
    },
  },
}
export default workOrderCommonMixin