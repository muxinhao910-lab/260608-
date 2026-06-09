export type SourceType =
  | "exchange_report"
  | "ir_record"
  | "interactive_reply"
  | "broker_report"
  | "finance_media"
  | "social_media"
  | "forum_rumor";

export type ValidationStage = "送样" | "小批量" | "定点" | "量产";

export type ChainSegment =
  | "关节与减速器"
  | "丝杠与轴承"
  | "电机与执行器"
  | "力传感器"
  | "视觉感知"
  | "精密传动";

export type SourceEvidence = {
  type: SourceType;
  label: string;
  url: string;
  credibility: number;
};

export type TrackingMetric = {
  newCustomers: string;
  newOrders: string;
  robotRevenueShare: string;
  grossMarginChange: string;
  capacityExpansion: string;
  validationStage: ValidationStage;
  enteredTopCustomerSupplyChain: "已进入" | "验证中" | "未确认";
};

export type RobotMapPoint = {
  part: string;
  x: number;
  y: number;
  z: number;
  labelX: number;
  labelY: number;
};

export type RobotCompany = {
  code: string;
  name: string;
  shortName: string;
  chainSegment: ChainSegment;
  oneLineLogic: string;
  chainPosition: string;
  marketFocus: string;
  longTermMetrics: string[];
  latestInfoFlow: string[];
  riskTips: string[];
  tracking: TrackingMetric;
  mapPoint: RobotMapPoint;
  sources: SourceEvidence[];
};

export const sourceTypeLabels: Record<SourceType, string> = {
  exchange_report: "交易所公告 / 年报 / 季报",
  ir_record: "投资者关系活动记录",
  interactive_reply: "互动平台回复",
  broker_report: "券商研报",
  finance_media: "主流财经媒体",
  social_media: "自媒体 / X 博主",
  forum_rumor: "股吧 / 雪球传闻"
};

export const credibilityRules = [
  { type: "交易所公告 / 年报 / 季报", range: "95-100" },
  { type: "投资者关系活动记录", range: "85-95" },
  { type: "互动平台回复", range: "75-90" },
  { type: "券商研报", range: "70-85" },
  { type: "主流财经媒体", range: "65-85" },
  { type: "自媒体 / X 博主", range: "40-70" },
  { type: "股吧 / 雪球传闻", range: "20-60" }
];

export const industryModules = [
  {
    id: "01",
    title: "机器人板块",
    href: "#robot-radar",
    copy: "点击进入 3D 机器人产业链雷达，查看公司在身体部位中的位置。"
  },
  {
    id: "02",
    title: "半导体板块",
    href: "#sector-semiconductor",
    copy: "设备、材料、先进封装与国产替代链条，下一阶段接入。"
  },
  {
    id: "03",
    title: "AI板块",
    href: "#sector-ai",
    copy: "算力、模型、应用与数据基础设施，后续扩展。"
  },
  {
    id: "04",
    title: "能源板块",
    href: "#sector-energy",
    copy: "电力设备、储能、新能源运营与能源数字化，后续扩展。"
  }
];

const sseDisclosure = "https://www.sse.com.cn/disclosure/listedinfo/announcement/";
const sseInteractive = "https://sns.sseinfo.com/";
const cninfo = "https://www.cninfo.com.cn/new/disclosure/stock?stockCode=";
const irm = "https://irm.cninfo.com.cn/";

export const robotCompanies: RobotCompany[] = [
  {
    code: "688017",
    name: "绿的谐波",
    shortName: "绿的谐波",
    chainSegment: "关节与减速器",
    oneLineLogic: "谐波减速器是机器人关节的核心精密传动件，绿的谐波是 A 股该环节的代表性公司。",
    chainPosition: "机器人肩、肘、腕等旋转关节中的谐波减速器。",
    marketFocus: "人形机器人关节用谐波减速器的客户验证、批量节奏、价格竞争与扩产兑现。",
    longTermMetrics: ["机器人用谐波减速器出货量", "核心客户验证阶段", "高端型号毛利率", "扩产项目爬坡速度"],
    latestInfoFlow: ["待接入：交易所公告与定期报告", "待接入：投资者关系活动记录", "待接入：客户量产/定点公告"],
    riskTips: ["机器人量产节奏低于预期", "减速器价格竞争加剧", "扩产爬坡或良率不及预期"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从年报业务拆分口径提取",
      grossMarginChange: "跟踪精密传动产品毛利率与产品结构变化",
      capacityExpansion: "跟踪定期报告披露的产能建设和在建工程",
      validationStage: "小批量",
      enteredTopCustomerSupplyChain: "未确认"
    },
    mapPoint: { part: "肘关节", x: -0.95, y: 0.75, z: 0, labelX: 7, labelY: 21 },
    sources: [
      { type: "exchange_report", label: "上交所上市公司公告检索", url: sseDisclosure, credibility: 96 },
      { type: "ir_record", label: "上证 e 互动 / 投资者关系入口", url: sseInteractive, credibility: 88 }
    ]
  },
  {
    code: "603667",
    name: "五洲新春",
    shortName: "五洲新春",
    chainSegment: "丝杠与轴承",
    oneLineLogic: "丝杠和轴承决定线性执行器精度与寿命，是人形机器人运动系统的重要潜在增量环节。",
    chainPosition: "机器人膝、踝等线性执行器中的丝杠、轴承和精密零部件。",
    marketFocus: "滚珠丝杠 / 行星滚柱丝杠的客户验证、产能良率和是否取得头部客户定点。",
    longTermMetrics: ["丝杠样件验证进度", "定点客户数量", "精密轴承收入占比", "产线良率与单位成本"],
    latestInfoFlow: ["待接入：上交所公告", "待接入：IR 记录", "待接入：券商产业链跟踪，仅作辅助"],
    riskTips: ["丝杠技术路线切换", "高精度产能爬坡慢", "客户认证周期长"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从定期报告或 IR 口径提取",
      grossMarginChange: "跟踪高精度产品占比变化",
      capacityExpansion: "跟踪丝杠、轴承相关产能披露",
      validationStage: "送样",
      enteredTopCustomerSupplyChain: "验证中"
    },
    mapPoint: { part: "膝部线性执行器", x: -0.45, y: -1.2, z: 0, labelX: 6, labelY: 59 },
    sources: [
      { type: "exchange_report", label: "上交所上市公司公告检索", url: sseDisclosure, credibility: 96 },
      { type: "broker_report", label: "券商研报仅作二级线索", url: "https://www.sse.com.cn/", credibility: 76 }
    ]
  },
  {
    code: "603728",
    name: "鸣志电器",
    shortName: "鸣志电器",
    chainSegment: "电机与执行器",
    oneLineLogic: "电机、驱动和运动控制能力对应机器人关节驱动与灵巧手执行器。",
    chainPosition: "机器人手部、腕部和小型关节中的电机、驱动与控制单元。",
    marketFocus: "空心杯电机、关节驱动系统、灵巧手客户验证和产品结构升级。",
    longTermMetrics: ["空心杯电机验证进度", "机器人客户收入口径", "驱控一体化能力", "海外与国内客户认证"],
    latestInfoFlow: ["待接入：上交所公告", "待接入：上证 e 互动", "上交所年报综述曾提及其拓展机器人关节驱动系统"],
    riskTips: ["灵巧手方案变化", "高端电机竞争加剧", "机器人业务占比不达预期"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从公告或 IR 口径提取",
      grossMarginChange: "跟踪高端电机型号和驱控产品毛利变化",
      capacityExpansion: "跟踪电机组件和驱控一体化产能",
      validationStage: "小批量",
      enteredTopCustomerSupplyChain: "未确认"
    },
    mapPoint: { part: "灵巧手 / 腕部", x: 1.08, y: 0.42, z: 0, labelX: 68, labelY: 30 },
    sources: [
      { type: "exchange_report", label: "上交所上市公司公告检索", url: sseDisclosure, credibility: 96 },
      { type: "finance_media", label: "上交所沪市主板年报综述", url: "https://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20250430_10778300.shtml", credibility: 78 }
    ]
  },
  {
    code: "003021",
    name: "兆威机电",
    shortName: "兆威机电",
    chainSegment: "电机与执行器",
    oneLineLogic: "微型传动系统和精密驱动模组适合机器人小型关节、灵巧手和服务机器人场景。",
    chainPosition: "机器人手指、末端执行器和小型运动模组。",
    marketFocus: "微型驱动模组在机器人场景的客户导入、项目制向平台化产品转换。",
    longTermMetrics: ["微型传动模组订单", "机器人应用客户数量", "项目毛利率", "平台化产品占比"],
    latestInfoFlow: ["待接入：巨潮资讯公告", "待接入：深交所互动易", "待接入：定期报告业务拆分"],
    riskTips: ["客户项目制波动", "机器人占比仍早期", "消费电子和汽车业务周期影响"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从年报或投资者关系口径提取",
      grossMarginChange: "跟踪定制项目和平台产品毛利差",
      capacityExpansion: "跟踪精密传动和自动化装配能力",
      validationStage: "送样",
      enteredTopCustomerSupplyChain: "未确认"
    },
    mapPoint: { part: "手指微型传动", x: 1.28, y: 0.18, z: 0, labelX: 70, labelY: 45 },
    sources: [
      { type: "exchange_report", label: "巨潮资讯公告检索", url: `${cninfo}003021`, credibility: 96 },
      { type: "interactive_reply", label: "深交所互动易", url: irm, credibility: 82 }
    ]
  },
  {
    code: "603662",
    name: "柯力传感",
    shortName: "柯力传感",
    chainSegment: "力传感器",
    oneLineLogic: "力传感器让机器人感知接触和负载，是力控、末端执行器和灵巧操作的关键环节。",
    chainPosition: "机器人腕部、手爪和末端执行器的力感知模块。",
    marketFocus: "六维力传感器、末端执行器力控方案、客户验证和高端产品占比。",
    longTermMetrics: ["力传感器验证阶段", "高端传感器收入占比", "标定能力", "机器人客户导入"],
    latestInfoFlow: ["待接入：上交所公告", "待接入：IR 活动记录", "待接入：互动平台回复"],
    riskTips: ["六维力传感器竞争加剧", "客户认证慢", "机器人端需求释放不确定"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从定期报告或 IR 口径提取",
      grossMarginChange: "跟踪高端力传感产品占比",
      capacityExpansion: "跟踪传感器芯体、标定和自动化产线",
      validationStage: "送样",
      enteredTopCustomerSupplyChain: "验证中"
    },
    mapPoint: { part: "腕部力控", x: 0.95, y: 0.58, z: 0, labelX: 68, labelY: 20 },
    sources: [
      { type: "exchange_report", label: "上交所上市公司公告检索", url: sseDisclosure, credibility: 96 },
      { type: "ir_record", label: "投资者关系活动记录入口", url: sseDisclosure, credibility: 88 }
    ]
  },
  {
    code: "688322",
    name: "奥比中光",
    shortName: "奥比中光",
    chainSegment: "视觉感知",
    oneLineLogic: "3D 视觉让机器人看见空间，适用于识别、避障、导航和人机交互。",
    chainPosition: "机器人头部、眼部和环境感知模组。",
    marketFocus: "3D 相机模组、视觉算法、机器人客户导入和模组毛利率。",
    longTermMetrics: ["机器人视觉客户数量", "3D 相机模组出货", "算法与方案收入", "模组毛利率"],
    latestInfoFlow: ["待接入：科创板公告", "待接入：投资者关系记录", "待接入：产品应用案例"],
    riskTips: ["模组价格竞争", "应用场景落地慢", "研发投入压力"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从定期报告业务口径提取",
      grossMarginChange: "跟踪模组与算法服务结构变化",
      capacityExpansion: "跟踪 3D 相机模组交付和算法平台能力",
      validationStage: "小批量",
      enteredTopCustomerSupplyChain: "未确认"
    },
    mapPoint: { part: "头部视觉", x: 0, y: 1.85, z: 0, labelX: 48, labelY: 9 },
    sources: [
      { type: "exchange_report", label: "上交所科创板公告检索", url: sseDisclosure, credibility: 96 },
      { type: "ir_record", label: "投资者关系活动记录入口", url: sseDisclosure, credibility: 88 }
    ]
  },
  {
    code: "002896",
    name: "中大力德",
    shortName: "中大力德",
    chainSegment: "关节与减速器",
    oneLineLogic: "减速器、电机、驱动器一体化能力可对应机器人关节模组和智能执行单元。",
    chainPosition: "机器人关节模组、智能执行单元和减速器。",
    marketFocus: "一体化关节模组、机器人客户导入、批量订单和产品结构升级。",
    longTermMetrics: ["一体化关节模组订单", "减速器收入结构", "客户验证阶段", "扩产与良率"],
    latestInfoFlow: ["待接入：巨潮资讯公告", "待接入：互动易", "待接入：定期报告"],
    riskTips: ["减速器竞争加剧", "一体化模组认证慢", "客户量产节奏不确定"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从年报或 IR 口径提取",
      grossMarginChange: "跟踪减速器和模组产品结构",
      capacityExpansion: "跟踪智能执行单元产线扩充",
      validationStage: "小批量",
      enteredTopCustomerSupplyChain: "验证中"
    },
    mapPoint: { part: "肩关节模组", x: -0.78, y: 1.02, z: 0, labelX: 8, labelY: 36 },
    sources: [
      { type: "exchange_report", label: "巨潮资讯公告检索", url: `${cninfo}002896`, credibility: 96 },
      { type: "interactive_reply", label: "深交所互动易", url: irm, credibility: 82 }
    ]
  },
  {
    code: "002472",
    name: "双环传动",
    shortName: "双环传动",
    chainSegment: "精密传动",
    oneLineLogic: "精密齿轮和传动系统制造能力可延展到机器人精密传动和执行器零部件。",
    chainPosition: "机器人躯干、关节和执行器中的精密齿轮与传动件。",
    marketFocus: "机器人精密传动客户认证、齿轮加工能力和汽车主业外的第二曲线。",
    longTermMetrics: ["精密传动订单", "机器人客户验证", "高精度齿轮良率", "非汽车收入占比"],
    latestInfoFlow: ["待接入：巨潮资讯公告", "待接入：深交所互动易", "待接入：券商跟踪仅作辅助"],
    riskTips: ["汽车主业周期影响", "机器人业务占比早期", "精密传动认证周期长"],
    tracking: {
      newCustomers: "待公告/IR确认",
      newOrders: "待公告/IR确认",
      robotRevenueShare: "待从定期报告或 IR 口径提取",
      grossMarginChange: "跟踪高精度产品占比",
      capacityExpansion: "跟踪精密齿轮加工和海外交付能力",
      validationStage: "送样",
      enteredTopCustomerSupplyChain: "未确认"
    },
    mapPoint: { part: "躯干传动", x: 0, y: 0.55, z: 0, labelX: 45, labelY: 64 },
    sources: [
      { type: "exchange_report", label: "巨潮资讯公告检索", url: `${cninfo}002472`, credibility: 96 },
      { type: "broker_report", label: "券商机器人产业链跟踪仅作辅助", url: "https://www.cninfo.com.cn/", credibility: 74 }
    ]
  }
];

export const robotSegments = Array.from(new Set(robotCompanies.map((company) => company.chainSegment)));

