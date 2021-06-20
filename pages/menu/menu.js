export default [
	{
		id: 1,
		title: "功能区",
		children: [
			{
				id: 1,
				title: "信息采集",
				icon: "xxcj",
				url: "/pages/views/info/materailStationForm",
			},
			// {
			// 	id: 2,
			// 	title: "系统参数",
			// 	icon: "xtcs",
			// 	url: "/pages/center/center",
			// },
			{
				id: 3,
				title: "料站表",
				icon: "lzb",
				url: "/pages/views/lzb/index",
			},
		],
	},
  {
		id: 2,
		title: "工作区",
		children: [
			{
				id: 1,
				title: "生产防错",
				icon: "scfc",
				url: "/pages/views/ext/index",
			},
			{
				id: 2,
				title: "IPQC巡检",
				icon: "xj",
				url: "/pages/views/Ipxj/index",
			},
			{
				id: 3,
				title: "产量信息",
				icon: "clxx",
				url: "/pages/views/output/index",
			},
      {
				id: 4,
				title: "上料记录",
				icon: "sljl",
				url: "/pages/views/report/pdaScanHistoryList",
			},
			{
				id: 5,
				title: "巡检记录",
				icon: "xjjl",
				url: "/pages/views/report/IpqcList",
			},
			{
				id: 6,
				title: "错误记录",
				icon: "cwjl",
				url: "/pages/views/report/errorList",
				desktopId: 176,
				configValue: "assemble"
			},
		],
	},
	{
		id: 3,
		title: "拓展区",
		children: [
			{
				id: 1,
				title: "回收站",
				icon: "xxcj",
				url: "/pages/views/del/index",
			},
		],
	},
]
