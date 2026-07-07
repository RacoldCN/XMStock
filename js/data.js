/**
 * 校园证券交易所 - 数据定义（静态版）
 * 从 Python 后端直接翻译为 JavaScript
 */

// ============ 学期信息 ============
function getSemesterInfo(day) {
    if (day <= 0) return { name: "准备阶段", year: "——", short: "准备" };
    const semIdx = Math.floor((day - 1) / 100);
    const weekInSem = Math.floor(((day - 1) % 100) / 5) + 1;
    const semesters = [
        { name: "高一上", year: "2025.9 - 2026.1", short: "高一上" },
        { name: "高一下", year: "2026.2 - 2026.7", short: "高一下" },
        { name: "高二上", year: "2026.9 - 2027.1", short: "高二上" },
        { name: "高二下", year: "2027.2 - 2027.7", short: "高二下" },
        { name: "高三上", year: "2027.9 - 2028.1", short: "高三上" },
        { name: "高三下", year: "2028.2 - 2028.6", short: "高三下" },
    ];
    if (semIdx >= semesters.length) return { name: "毕业", year: "游戏结束", short: "毕业" };
    return { ...semesters[semIdx], week_in_sem: weekInSem };
}

function getWeek(day) {
    return Math.floor((day - 1) / 5) + 1;
}

// ============ 股票定义 ============
const STOCKS = {
    "om-brain": { id: "om-brain", code: "xmst001", name: "头脑奥林匹克创新社", category: "hot_club", category_name: "热门社团", init_price: 78.0 },
    "basketball": { id: "basketball", code: "xmst002", name: "篮球社", category: "hot_club", category_name: "热门社团", init_price: 82.0 },
    "mayfly-band": { id: "mayfly-band", code: "xmst003", name: "蜉蝣天空乐队", category: "hot_club", category_name: "热门社团", init_price: 88.0 },
    "aero-model": { id: "aero-model", code: "xmst004", name: "航模社", category: "hot_club", category_name: "热门社团", init_price: 76.0 },
    "181-band": { id: "181-band", code: "xmst005", name: "181乐队", category: "hot_club", category_name: "热门社团", init_price: 85.0 },
    "reporter": { id: "reporter", code: "xmst006", name: "记者社", category: "normal_club", category_name: "普通社团", init_price: 60.0 },
    "mun": { id: "mun", code: "xmst007", name: "模联社", category: "normal_club", category_name: "普通社团", init_price: 62.0 },
    "football": { id: "football", code: "xmst008", name: "足球社", category: "normal_club", category_name: "普通社团", init_price: 56.0 },
    "debate": { id: "debate", code: "xmst011", name: "辩论社", category: "normal_club", category_name: "普通社团", init_price: 58.0 },
    "badminton": { id: "badminton", code: "xmst009", name: "羽毛球", category: "potential_club", category_name: "潜力社团", init_price: 48.0 },
    "super-sci": { id: "super-sci", code: "xmst010", name: "超科学社（智能小车社团）", category: "potential_club", category_name: "潜力社团", init_price: 45.0 },
    "robot": { id: "robot", code: "xmst012", name: "机器人社", category: "potential_club", category_name: "潜力社团", init_price: 37.0 },
    "xuanling": { id: "xuanling", code: "xmst013", name: "悬铃影社", category: "potential_club", category_name: "潜力社团", init_price: 41.0 },
    "computer": { id: "computer", code: "xmst014", name: "计算机社", category: "potential_club", category_name: "潜力社团", init_price: 22.0 },
    "shanghai": { id: "shanghai", code: "xmst015", name: "沪语社", category: "potential_club", category_name: "潜力社团", init_price: 18.0 },
    "percussion": { id: "percussion", code: "xmst016", name: "打击乐社", category: "potential_club", category_name: "潜力社团", init_price: 25.0 },
    "curling": { id: "curling", code: "xmst017", name: "冰壶社", category: "potential_club", category_name: "潜力社团", init_price: 20.0 },
};

const STOCK_ORDER = Object.keys(STOCKS);
const ALL_STOCKS = Object.keys(STOCKS);
const STOCKS_KEJI = ["om-brain", "computer", "super-sci", "aero-model", "robot"];
const STOCKS_WENYI = ["reporter", "xuanling", "mayfly-band", "181-band", "percussion", "shanghai"];
const STOCKS_SIBIAN = ["mun", "debate"];
const STOCKS_TIYU = ["basketball", "football", "badminton", "curling"];
const CLASS_STOCKS = []; // 班级股已删除

// ============ 游戏常量 ============
const TOTAL_DAYS = 600;
const DAYS_PER_SEMESTER = 100;
const DAYS_PER_WEEK = 5;
const CIRCUIT_BREAKER = 0.15;
const INITIAL_CASH = 1000.0;
const LEVERAGE_OPTIONS = [1, 2, 3, 5];

const BREAK_NAMES = {
    100: "寒假来啦！❄️",
    200: "暑假来啦！☀️",
    300: "寒假来啦！❄️",
    400: "暑假来啦！☀️",
    500: "寒假来啦！❄️（高考冲刺前的最后一个假期）",
};

function getDynamicCategory(currentPrice, baseCategory) {
    if (currentPrice > 75) return "热门社团";
    if (currentPrice > 55) return "普通社团";
    return "潜力社团";
}

// ============ 事件数据 ============

// 固定时间线事件
const SCHEDULED_EVENTS = [
    { trigger_day: 1, title: "🏫 新学期开学 · 社团招新大战", description: "新学期伊始！各大社团使出浑身解数招揽新生，热门社团展位前排起长龙。这是每个社团一年中最重要的招新时刻！", stocks_affected: ALL_STOCKS, impact_type: "bullish", impact_min: 0.03, impact_max: 0.12, duration_days: 5 },
    { trigger_day: 5, title: "📋 社团招新结果公布", description: "各大社团招新名单正式公布！有的社团招得新生爆满，有的门可罗雀。新生分配结果直接影响社团未来一年的发展。", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN, ...STOCKS_TIYU], impact_type: "mixed", impact_min: -0.08, impact_max: 0.18, duration_days: 4 },
    { trigger_day: 20, title: "🏆 首次流动红旗评选", description: "本学期首次流动红旗评选结果出炉！获奖班级士气大振，未获奖的班级也在暗中追赶。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.08, impact_max: 0.20, duration_days: 4 },
    { trigger_day: 30, title: "🏃 秋季运动会开幕", description: "一年一度的秋季运动会正式开幕！运动员们在赛场上奋力拼搏，体育类社团和各班迎来高光时刻。", stocks_affected: [...STOCKS_TIYU, ...CLASS_STOCKS], impact_type: "mixed", impact_min: -0.05, impact_max: 0.22, duration_days: 4 },
    { trigger_day: 40, title: "🏆 第二次流动红旗评选", description: "月度流动红旗结果公布！获奖班级继续保持领先，竞争进入白热化。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.06, impact_max: 0.18, duration_days: 3 },
    { trigger_day: 45, title: "📝 期中考试周", description: "期中考试来临，同学们埋头复习。社团活动暂停，市场交易情绪较为低迷。部分社团受影响明显。", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN, ...STOCKS_TIYU], impact_type: "bearish", impact_min: -0.10, impact_max: -0.02, duration_days: 5 },
    { trigger_day: 55, title: "📊 期中成绩公布 · 学风评比", description: "期中考试成绩出炉，各班排名牵动人心。成绩优异的班级士气大振，学风评比结果同步发布。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.12, impact_max: 0.22, duration_days: 4 },
    { trigger_day: 60, title: "🏆 第三次流动红旗评选", description: "本月流动红旗揭晓。累计获奖次数最多的班级开始领跑，竞争愈发激烈。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.06, impact_max: 0.16, duration_days: 3 },
    { trigger_day: 75, title: "🎄 校园艺术节", description: "校园艺术节盛大举办！音乐、舞蹈、戏剧轮番上演，文艺类社团成为全场焦点。", stocks_affected: STOCKS_WENYI, impact_type: "bullish", impact_min: 0.08, impact_max: 0.25, duration_days: 5 },
    { trigger_day: 85, title: "🏆 学期末流动红旗总评", description: "本学期最后一次流动红旗评选！谁将成为学期最佳班级？荣誉之战进入最终回合！", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.10, impact_max: 0.25, duration_days: 5 },
    { trigger_day: 90, title: "📚 期末考试周", description: "期末考试全面展开，所有社团活动暂停。考试成绩将直接影响班级股价格走势。", stocks_affected: ALL_STOCKS, impact_type: "bearish", impact_min: -0.08, impact_max: -0.02, duration_days: 5 },
    { trigger_day: 106, title: "🌸 新学期开学回暖 · 社团春季招新", description: "寒假归来，校园重新充满活力。社团春季补充招新开始，上学期表现优异的社团吸引了更多关注。", stocks_affected: ALL_STOCKS, impact_type: "bullish", impact_min: 0.03, impact_max: 0.10, duration_days: 3 },
    { trigger_day: 120, title: "🏆 流动红旗评选（高一下·第一次）", description: "新学期首次流动红旗评选，经过一个学期的磨合，各班差距逐渐拉大。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.08, impact_max: 0.20, duration_days: 4 },
    { trigger_day: 130, title: "🧪 科技节开幕", description: "校园科技节拉开帷幕！机器人社、超科学社、计算机社的展品吸引了众多目光。", stocks_affected: STOCKS_KEJI, impact_type: "bullish", impact_min: 0.08, impact_max: 0.22, duration_days: 5 },
    { trigger_day: 140, title: "🏆 流动红旗评选（高一下·第二次）", description: "月度流动红旗评比继续，优秀班级持续领跑。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.06, impact_max: 0.16, duration_days: 3 },
    { trigger_day: 145, title: "📝 下学期期中考试", description: "高一下学期期中考试！课程难度加大，同学们面临新的挑战。", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN, ...STOCKS_TIYU], impact_type: "bearish", impact_min: -0.12, impact_max: -0.03, duration_days: 5 },
    { trigger_day: 160, title: "🎤 校园歌手大赛", description: "校园歌手大赛火热进行中！两大乐队蜉蝣天空和181的成员纷纷参赛，现场气氛热烈。", stocks_affected: ["mayfly-band", "181-band", "percussion"], impact_type: "bullish", impact_min: 0.10, impact_max: 0.28, duration_days: 4 },
    { trigger_day: 175, title: "🏆 学期末流动红旗总评（高一下）", description: "高一下学期流动红旗最终排名揭晓，各班级荣誉感爆棚！", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.10, impact_max: 0.25, duration_days: 5 },
    { trigger_day: 185, title: "🎓 高三毕业季 · 社团换届", description: "高三学长学姐即将毕业，社团迎来换届。新任社长即将产生，各社团未来走向充满变数。", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN], impact_type: "mixed", impact_min: -0.15, impact_max: 0.25, duration_days: 6 },
    { trigger_day: 190, title: "📚 下学期期末考试", description: "高一学年最后一次考试！成绩将影响分班和社团资格。", stocks_affected: ALL_STOCKS, impact_type: "bearish", impact_min: -0.08, impact_max: -0.02, duration_days: 5 },
    { trigger_day: 201, title: "🏫 高二开学 · 社团新社长上任", description: "高二开始！各大社团新社长走马上任。有的锐意改革，有的稳扎稳打。新社长将为社团带来怎样的变化？", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN, ...STOCKS_TIYU], impact_type: "mixed", impact_min: -0.12, impact_max: 0.15, duration_days: 6 },
    { trigger_day: 220, title: "🏆 流动红旗评选（高二上·第一次）", description: "新学期流动红旗重新洗牌！上一学年的积累在高二开始体现。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.08, impact_max: 0.20, duration_days: 4 },
    { trigger_day: 230, title: "🏃 秋季运动会（高二主场）", description: "高二年级成为运动会主力军！各班为了荣誉全力拼搏，体育社团再次迎来爆发期。", stocks_affected: [...STOCKS_TIYU, ...CLASS_STOCKS], impact_type: "mixed", impact_min: -0.03, impact_max: 0.22, duration_days: 4 },
    { trigger_day: 245, title: "📝 高二上期中考试 · 会考预演", description: "高二期中考试难度提升，同时是明年会考的预演。学业压力开始影响社团活动。", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN, ...STOCKS_TIYU], impact_type: "bearish", impact_min: -0.14, impact_max: -0.04, duration_days: 5 },
    { trigger_day: 280, title: "🏆 学期流动红旗总评（高二上）", description: "累计本学期流动红旗获得次数，综合评选最佳班级。荣誉之战进入白热化！", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.10, impact_max: 0.25, duration_days: 5 },
    { trigger_day: 306, title: "🌸 高二下开学 · 学业压力初现", description: "高二下是承上启下的关键学期。学业压力和社团活动开始出现平衡难题，但社团活力不减。", stocks_affected: ALL_STOCKS, impact_type: "mixed", impact_min: -0.05, impact_max: 0.08, duration_days: 3 },
    { trigger_day: 320, title: "🏆 流动红旗评选（高二下·第一次）", description: "本学期首轮流动红旗。经过一年多的竞争，强弱格局逐渐明朗。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.06, impact_max: 0.18, duration_days: 4 },
    { trigger_day: 330, title: "📚 学业水平考试（会考）", description: "高二会考来临！紧张氛围笼罩校园。大多数股票承压，社团活动大幅缩减。", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN, ...STOCKS_TIYU], impact_type: "bearish", impact_min: -0.15, impact_max: -0.05, duration_days: 6 },
    { trigger_day: 345, title: "📊 会考成绩公布", description: "会考成绩出炉！各班级通过率成为新焦点，大家开始认真思考高考方向。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.15, impact_max: 0.25, duration_days: 5 },
    { trigger_day: 360, title: "🎭 校园戏剧节", description: "校园戏剧节精彩纷呈！悬铃影社大放异彩，各班精心准备的剧目轮番上演。", stocks_affected: ["xuanling", "shanghai", ...CLASS_STOCKS], impact_type: "bullish", impact_min: 0.05, impact_max: 0.22, duration_days: 5 },
    { trigger_day: 405, title: "📖 高三誓师大会", description: "高三年级誓师大会隆重举行！全体高三学子宣誓冲刺高考，班级凝聚力达到顶峰。", stocks_affected: CLASS_STOCKS, impact_type: "bullish", impact_min: 0.10, impact_max: 0.25, duration_days: 4 },
    { trigger_day: 425, title: "🏆 流动红旗最终评选（高三）", description: "高三年级最后一次流动红旗评选。三年来的班级荣誉之争即将画上句号。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.12, impact_max: 0.28, duration_days: 5 },
    { trigger_day: 440, title: "📝 高三第一次模考", description: "首次模拟考试成绩公布！各班级表现不一，成绩优异的班级士气大振。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.20, impact_max: 0.25, duration_days: 5 },
    { trigger_day: 470, title: "🏃 最后一次运动会（高三）", description: "高三学生最后一次参加运动会，不留遗憾！体育社团和各班倾尽全力，赛场气氛达到三年顶峰。", stocks_affected: [...STOCKS_TIYU, ...CLASS_STOCKS], impact_type: "mixed", impact_min: -0.05, impact_max: 0.25, duration_days: 4 },
    { trigger_day: 490, title: "📊 高三第二次模考", description: "第二次模考！距离高考越来越近，成绩波动牵动每一位学生和家长的心。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.18, impact_max: 0.22, duration_days: 5 },
    { trigger_day: 510, title: "📊 区一模成绩公布", description: "全区统一一模成绩出炉，各班级排名牵动人心。成绩优异的班级股票飙升！", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.25, impact_max: 0.30, duration_days: 5 },
    { trigger_day: 530, title: "📝 高三二模考试", description: "第二次全区模考，这是高考前最后一次大型练兵机会。", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.15, impact_max: 0.20, duration_days: 4 },
    { trigger_day: 540, title: "💯 百日誓师", description: "距离高考100天！整个高三年级进入冲刺阶段，班级凝聚力空前高涨。", stocks_affected: CLASS_STOCKS, impact_type: "bullish", impact_min: 0.05, impact_max: 0.15, duration_days: 3 },
    { trigger_day: 570, title: "🎯 高考冲刺 · 社团停摆", description: "高考进入最后冲刺，所有社团活动全面暂停。社团类股票缺乏交易催化剂。", stocks_affected: [...STOCKS_KEJI, ...STOCKS_WENYI, ...STOCKS_SIBIAN, ...STOCKS_TIYU], impact_type: "bearish", impact_min: -0.10, impact_max: -0.02, duration_days: 10 },
    { trigger_day: 590, title: "🎓 高考放榜！", description: "三年磨一剑，高考成绩终于公布！各班级表现天差地别，股票价格剧烈震荡！这是最后的狂欢！", stocks_affected: CLASS_STOCKS, impact_type: "mixed", impact_min: -0.30, impact_max: 0.45, duration_days: 5 },
    { trigger_day: 598, title: "🎉 毕业典礼 · 游戏即将结束", description: "毕业典礼盛大举行，三年的校园证券交易所之旅即将画上句号。感谢你的参与！", stocks_affected: ALL_STOCKS, impact_type: "mixed", impact_min: -0.20, impact_max: 0.30, duration_days: 2 },
];

// 随机事件池（80条，取自原版 events.py，平均3~5天触发一次）
const RANDOM_EVENT_POOL = [
    // ========== 科创智造板块 ==========
    { id: "keji_001", title: "🏆 OM社区域创新大赛获专项奖金", description: "黄浦区教育局加码科创赛事扶持，OM社作为种子队伍获得万元团体奖金，扩招20名新生，购入大量搭建耗材。", stocks_affected: ["om-brain"], impact_type: "bullish", impact_min: 0.15, impact_max: 0.25, duration_days: 5 },
    { id: "keji_002", title: "⚠️ 机器人社VEX芯片供应链延迟", description: "海外芯片物流拥堵，V5主控设备延迟交付，机器人社自动程序训练被迫停滞。航模社暂时分流部分实验室场地。", stocks_affected: ["robot","aero-model"], impact_type: "mixed", impact_min: -0.16, impact_max: 0.07, duration_days: 4 },
    { id: "keji_003", title: "🚗 超科学社获独立实训车间", description: "教育局发布智能驾驶培育政策，向明获批专项基建资金，超科学社拥有专属调试车间，增设智能小车挑战赛。", stocks_affected: ["super-sci",...STOCKS_KEJI], impact_type: "bullish", impact_min: 0.05, impact_max: 0.30, duration_days: 5 },
    { id: "keji_004", title: "⚠️ 计算机社竞赛指导老师调离", description: "计算机社金牌竞赛指导老师工作调动，奥赛训练暂停两周，报名人数减半，核心社员流失。", stocks_affected: ["computer","om-brain","robot"], impact_type: "mixed", impact_min: -0.21, impact_max: 0.06, duration_days: 5 },
    { id: "keji_005", title: "🏆 航模社全国锦标赛团体金奖", description: "全国航模锦标赛，向明航模社自主改装滑翔机获高中组团体金奖！器材采购翻倍，新生报名人数翻倍。", stocks_affected: ["aero-model",...STOCKS_KEJI], impact_type: "bullish", impact_min: 0.08, impact_max: 0.35, duration_days: 5 },
    { id: "keji_006", title: "⚠️ 线下科创赛事全部取消改为线上", description: "全市校园活动管控，线下搭建类赛事全部取消。OM、航模、机器人社实操备赛作废，仅计算机社线上竞赛不受影响。", stocks_affected: ["computer","om-brain","robot","aero-model","super-sci"], impact_type: "mixed", impact_min: -0.15, impact_max: 0.13, duration_days: 5 },
    { id: "keji_009", title: "🤖 机器人社与交大实验室达成共建", description: "上海交大机器人实验室与向明机器人社达成合作协议，共享研发设备，提供大学生指导。", stocks_affected: ["robot",...STOCKS_KEJI], impact_type: "bullish", impact_min: 0.10, impact_max: 0.32, duration_days: 5 },
    { id: "keji_016", title: "⚠️ 科创经费整体缩减30%", description: "学校年度预算调整，科创板块经费整体缩减30%，五大科创社团设备采购和赛事出行全面受限。", stocks_affected: STOCKS_KEJI, impact_type: "bearish", impact_min: -0.12, impact_max: -0.07, duration_days: 5 },
    { id: "keji_018", title: "⚠️ 超科学社市级初赛传感器故障淘汰", description: "超科学社市级智能驾驶初赛因激光雷达传感器故障冲出赛道被淘汰，社费无法报销维修费用。", stocks_affected: ["super-sci"], impact_type: "bearish", impact_min: -0.25, impact_max: -0.15, duration_days: 5 },
    { id: "keji_021", title: "🏆 计算机社信息奥赛全员晋级省赛", description: "计算机社在全国信息学奥赛初赛中全员晋级省赛选拔，其中3人获满分成绩。", stocks_affected: ["computer"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.31, duration_days: 5 },
    { id: "keji_025", title: "🎪 科创五大社团联合成果展", description: "五大科创社团在体育馆联合举办年度成果展，吸引全校师生及家长参观，科创板块全面走强。", stocks_affected: STOCKS_KEJI, impact_type: "bullish", impact_min: 0.08, impact_max: 0.18, duration_days: 5 },
    { id: "keji_033", title: "⚠️ 校外赛事全部禁止外出参赛", description: "因安全管理升级，所有校外科创赛事禁止外出参赛，改为远程提交作品。实操型社团备赛计划全毁。", stocks_affected: STOCKS_KEJI, impact_type: "bearish", impact_min: -0.20, impact_max: -0.09, duration_days: 6 },
    { id: "keji_034", title: "🏆 机器人社VEX国赛斩获全能设计大奖", description: "机器人社在全国VEX锦标赛中斩获全能设计大奖和团队协作冠军双料大奖！", stocks_affected: ["robot"], impact_type: "bullish", impact_min: 0.25, impact_max: 0.36, duration_days: 5 },
    { id: "keji_044", title: "💻 计算机社赛事报名系统获多校采购", description: "计算机社自主开发的校际赛事报名管理系统被5所兄弟中学采购，社费收入大幅增加。", stocks_affected: ["computer"], impact_type: "bullish", impact_min: 0.18, impact_max: 0.28, duration_days: 5 },
    { id: "keji_045", title: "🏆 超科学社区级赛事三连冠", description: "超科学社区级智能车赛事达成三连冠壮举，成为向明科创标杆社团。", stocks_affected: ["super-sci"], impact_type: "bullish", impact_min: 0.22, impact_max: 0.33, duration_days: 5 },
    { id: "keji_046", title: "⚠️ 机器人社内部训练资源分配冲突", description: "机器人社VEX和FIRST两支队伍争夺唯一训练场地，内部矛盾公开化，高年级社员提出分流。", stocks_affected: ["robot","om-brain"], impact_type: "mixed", impact_min: -0.24, impact_max: 0.08, duration_days: 5 },
    { id: "keji_049", title: "🌟 OM社全市美育科创巡回展演", description: "OM社受邀在全市中小学进行美育科创巡回展演，获区教育局专项宣传经费，品牌影响力大增。", stocks_affected: ["om-brain"], impact_type: "bullish", impact_min: 0.18, impact_max: 0.26, duration_days: 5 },
    { id: "keji_050", title: "⚠️ 科创实验楼全面断电检修3天", description: "科创实验楼因配电系统老化全面断电检修，五大科创社团训练全部暂停。", stocks_affected: STOCKS_KEJI, impact_type: "bearish", impact_min: -0.13, impact_max: -0.06, duration_days: 3 },
    // ========== 文艺传媒板块 ==========
    { id: "wenyi_001", title: "🥁 打击乐社承办全国青少年打击乐展演", description: "打击乐社成功承办全国青少年打击乐艺术展演上海站，全场爆满，报名打击乐社的新生排到下学期。", stocks_affected: ["percussion",...STOCKS_WENYI], impact_type: "bullish", impact_min: 0.08, impact_max: 0.34, duration_days: 5 },
    { id: "wenyi_002", title: "🎵 蜉蝣天空乐队原创歌曲获最佳作曲奖", description: "蜉蝣天空乐队原创歌曲获全市中学生原创音乐大赛最佳作曲奖，音乐平台播放量破10万。181乐队粉丝被分流。", stocks_affected: ["mayfly-band","181-band"], impact_type: "mixed", impact_min: -0.03, impact_max: 0.27, duration_days: 4 },
    { id: "wenyi_004", title: "📰 记者社承接全校官方图文采编", description: "记者社被校办指定为全校官方活动指定采编团队，负责校园公众号和校刊采写。", stocks_affected: ["reporter"], impact_type: "bullish", impact_min: 0.15, impact_max: 0.22, duration_days: 4 },
    { id: "wenyi_005", title: "🗣️ 沪语社承办全市中学生沪语诵读大赛", description: "沪语社成功承办全市中学生沪语诵读大赛，获市语委办专项经费支持，沪语文化传承获广泛关注。", stocks_affected: ["shanghai"], impact_type: "bullish", impact_min: 0.18, impact_max: 0.29, duration_days: 5 },
    { id: "wenyi_006", title: "⚠️ 181乐队演出设备故障表演中断", description: "181乐队在艺术节压轴演出时功放设备短路，表演被迫中断30分钟，舆论发酵。蜉蝣天空临时救场。", stocks_affected: ["181-band","mayfly-band"], impact_type: "mixed", impact_min: -0.21, impact_max: 0.06, duration_days: 4 },
    { id: "wenyi_009", title: "⚠️ 打击乐社马林巴琴搬运损坏", description: "打击乐社在搬运途中一台价值8万元的马林巴琴严重损坏，维修费用高昂，社费赤字。", stocks_affected: ["percussion"], impact_type: "bearish", impact_min: -0.18, impact_max: -0.12, duration_days: 4 },
    { id: "wenyi_013", title: "🎸 181乐队原创摇滚单曲校内爆火", description: "181乐队原创摇滚单曲《操场黄昏》在校园广播站首发后迅速登上校媒热榜，蜉蝣天空粉丝开始转向。", stocks_affected: ["181-band","mayfly-band"], impact_type: "mixed", impact_min: -0.04, impact_max: 0.26, duration_days: 4 },
    { id: "wenyi_015", title: "🏆 打击乐社全国展演斩获团体金奖", description: "打击乐社在全国青少年打击乐展演中斩获高中组团体金奖和最佳原创作品双奖！", stocks_affected: ["percussion",...STOCKS_WENYI], impact_type: "bullish", impact_min: 0.06, impact_max: 0.31, duration_days: 5 },
    { id: "wenyi_020", title: "⚠️ 校外文艺演出禁令", description: "教育局临时发布校外演出安全管理规定，所有文艺社团暂停校外商业演出和展演活动。", stocks_affected: ["reporter","xuanling","mayfly-band","181-band","percussion"], impact_type: "mixed", impact_min: -0.19, impact_max: 0.06, duration_days: 5 },
    { id: "wenyi_023", title: "🎬 悬铃影社获区级美育宣传片制作经费", description: "悬铃影社成功竞标区级美育宣传片制作项目，获得专项制作经费和4K专业设备升级。", stocks_affected: ["xuanling"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.30, duration_days: 5 },
    { id: "wenyi_034", title: "🎂 181乐队为校庆创作主题曲", description: "181乐队被校方指定为校庆创作主题曲，将在全校升旗仪式首演，曝光度空前。", stocks_affected: ["181-band"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.29, duration_days: 5 },
    { id: "wenyi_037", title: "🎪 五大文娱社团联合承办艺术节", description: "五大文娱社团联合承办校园文化艺术节，规模创历届之最。文艺板块全面走强！", stocks_affected: STOCKS_WENYI, impact_type: "bullish", impact_min: 0.07, impact_max: 0.18, duration_days: 5 },
    { id: "wenyi_042", title: "⚠️ 全校美育经费削减25%", description: "学校年度预算调整中，美育专项经费被削减25%，文娱社团活动规模被迫压缩。", stocks_affected: STOCKS_WENYI, impact_type: "bearish", impact_min: -0.16, impact_max: -0.06, duration_days: 5 },
    { id: "wenyi_043", title: "🎥 悬铃影社三件作品入选全市展映片单", description: "悬铃影社三件原创短片作品全部入选市级中学生影视展映片单，创向明影社历史最佳成绩。", stocks_affected: ["xuanling"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.28, duration_days: 5 },
    { id: "wenyi_045", title: "🎵 蜉蝣天空专场门票一小时售罄", description: "蜉蝣天空乐队学期专场演出门票开售后一小时全部售罄，黄牛票价炒到原价3倍！", stocks_affected: ["mayfly-band"], impact_type: "bullish", impact_min: 0.22, impact_max: 0.32, duration_days: 5 },
    { id: "wenyi_048", title: "🎭 沪语社承办全市中学生沪语戏剧节", description: "沪语社首次承办全市中学生沪语戏剧节，获市文旅局和文化馆联合支持，声势浩大。", stocks_affected: ["shanghai"], impact_type: "bullish", impact_min: 0.18, impact_max: 0.27, duration_days: 5 },
    { id: "wenyi_007", title: "⚠️ 艺术节削减器乐节目名额", description: "本次艺术节因场地限制大幅削减器乐类节目名额，打击乐社和沪语社名额减半。", stocks_affected: ["xuanling","shanghai","mayfly-band","181-band","percussion"], impact_type: "mixed", impact_min: -0.17, impact_max: 0.08, duration_days: 4 },
    // ========== 思辨学术板块 ==========
    { id: "sibian_001", title: "🏛️ 模联社承办黄浦区模联大会", description: "模联社成功申办黄浦区中学生模拟联合国大会，全区20所中学代表队齐聚向明。辩论社获邀设置观察席。", stocks_affected: ["mun","debate"], impact_type: "mixed", impact_min: -0.04, impact_max: 0.33, duration_days: 5 },
    { id: "sibian_002", title: "🏆 辩论社拿下全市华语辩论团体冠军", description: "辩论社在全市中学生华语辩论锦标赛中拿下团体冠军，最佳辩手由向明选手获得。模联关注度暂时被分流。", stocks_affected: ["debate","mun"], impact_type: "mixed", impact_min: -0.03, impact_max: 0.29, duration_days: 5 },
    { id: "sibian_005", title: "🌍 模联社获全国模联总决赛直通名额", description: "模联社凭借区赛最佳代表团成绩获得全国模联总决赛直通名额，无需经过市赛选拔。", stocks_affected: ["mun"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.28, duration_days: 5 },
    { id: "sibian_008", title: "⚠️ 模联社英文指导教师调离", description: "模联社英文委员会核心指导老师因工作调动离开，英文议题备赛陷入停滞。", stocks_affected: ["mun"], impact_type: "bearish", impact_min: -0.19, impact_max: -0.13, duration_days: 5 },
    { id: "sibian_010", title: "⚠️ 全国模联禁止跨市外出参会", description: "教育主管部门发布安全通知，禁止中学生跨市参加模联会议，全国总决赛改为线上。", stocks_affected: ["mun","debate"], impact_type: "mixed", impact_min: -0.24, impact_max: 0.05, duration_days: 5 },
    { id: "sibian_011", title: "🏆 模联社全国总决赛最佳代表团双奖", description: "模联社在全国模联总决赛中以零失误表现斩获最佳代表团和杰出代表双料大奖！", stocks_affected: ["mun"], impact_type: "bullish", impact_min: 0.25, impact_max: 0.36, duration_days: 5 },
    { id: "sibian_013", title: "🏛️ 模联社新增独立模联会议室配全套设备", description: "学校为模联社配备独立模联会议室，配电子表决器、同声传译设备。新生报名人数创新高。", stocks_affected: ["mun"], impact_type: "bullish", impact_min: 0.16, impact_max: 0.23, duration_days: 4 },
    { id: "sibian_014", title: "⚠️ 综评加分规则调整辩论加分超模联", description: "教育局调整综评加分规则，辩论赛事加分权重超越模联。辩论社报名人数激增，模联小幅流失。", stocks_affected: ["debate","mun"], impact_type: "mixed", impact_min: -0.05, impact_max: 0.20, duration_days: 5 },
    { id: "sibian_019", title: "⚠️ 辩论社外聘专业教练合同到期离校", description: "辩论社聘请的市级辩论队专业教练合同到期不再续约，高水平训练指导出现断层。", stocks_affected: ["debate"], impact_type: "bearish", impact_min: -0.18, impact_max: -0.12, duration_days: 5 },
    { id: "sibian_020", title: "⚠️ 人文类社团经费统一缩减30%", description: "学校将经费向理工科倾斜，人文类社团（模联、辩论）年度预算统一缩减30%。", stocks_affected: ["mun","debate"], impact_type: "bearish", impact_min: -0.14, impact_max: -0.08, duration_days: 5 },
    { id: "sibian_021", title: "🏫 模联社与高校国关学院达成共建", description: "模联社与复旦大学国际关系学院达成共建协议，教授定期到校开设国际关系讲座。", stocks_affected: ["mun"], impact_type: "bullish", impact_min: 0.18, impact_max: 0.27, duration_days: 5 },
    { id: "sibian_022", title: "⚠️ 辩论社市级初赛发挥失常止步小组赛", description: "辩论社在市级辩论赛初赛中因准备不足发挥失常，止步小组赛，创近年最差战绩。", stocks_affected: ["debate"], impact_type: "bearish", impact_min: -0.26, impact_max: -0.18, duration_days: 5 },
    { id: "sibian_024", title: "📖 辩论社原创辩题库获多所中学采购", description: "辩论社汇编的150道原创辩题及解析获5所中学辩论队采购，社费创收。", stocks_affected: ["debate"], impact_type: "bullish", impact_min: 0.15, impact_max: 0.22, duration_days: 4 },
    { id: "sibian_028", title: "🏆 辩论社校内思辨杯增设综评加分奖", description: "辩论社主办校内思辨杯获校级认证，优胜者可在综合素质评价中获得加分。报名人数翻倍。", stocks_affected: ["debate"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.31, duration_days: 5 },
    // ========== 校园体育板块 ==========
    { id: "tiyu_001", title: "🏆 篮球社全国U18三人篮球女子组冠军", description: "篮球社女子三人篮球队在全国U18锦标赛中勇夺冠军！卢湾校区篮球氛围沸腾。", stocks_affected: ["basketball",...STOCKS_TIYU], impact_type: "bullish", impact_min: 0.06, impact_max: 0.38, duration_days: 5 },
    { id: "tiyu_002", title: "🏆 冰壶社市陆地冰壶锦标赛包揽金银双奖", description: "冰壶社在全市陆地冰壶锦标赛中包揽高中组金银双奖！证明冰壶社是向明最具统治力的体育社团。", stocks_affected: ["curling"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.30, duration_days: 5 },
    { id: "tiyu_003", title: "⚠️ 足球场翻新封闭4个月训练暂停", description: "卢湾校区足球场因地基沉降翻新，封闭4个月。足球社无训练场地，篮球/羽毛球/冰壶场地临时压缩。", stocks_affected: ["basketball","badminton","curling","football"], impact_type: "mixed", impact_min: -0.22, impact_max: 0.06, duration_days: 6 },
    { id: "tiyu_005", title: "⚠️ 篮球社主力前锋脚踝重伤赛季报销", description: "篮球社女子队主力前锋在训练中脚踝韧带撕裂，赛季报销。球队攻防体系面临重组。", stocks_affected: ["basketball"], impact_type: "bearish", impact_min: -0.19, impact_max: -0.13, duration_days: 5 },
    { id: "tiyu_006", title: "⚠️ 体育专项经费缩减28%", description: "学校年度预算中体育专项经费被砍28%，四大体育社团装备采购和外出比赛均受冲击。", stocks_affected: STOCKS_TIYU, impact_type: "bearish", impact_min: -0.18, impact_max: -0.07, duration_days: 5 },
    { id: "tiyu_010", title: "🎪 四大体育社团联合体育嘉年华", description: "篮球、足球、羽毛球、冰壶四大社团联合举办体育嘉年华，设趣味挑战赛和明星赛，场面火爆。", stocks_affected: STOCKS_TIYU, impact_type: "bullish", impact_min: 0.08, impact_max: 0.20, duration_days: 4 },
    { id: "tiyu_011", title: "🏀 篮球社新增两片室内标准半场", description: "体育馆改造项目中新增两片室内标准半场，篮球社训练条件大幅提升。", stocks_affected: ["basketball"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.29, duration_days: 4 },
    { id: "tiyu_013", title: "🥌 冰壶社新建六条标准陆地冰壶赛道", description: "学校体育馆新增六条标准陆地冰壶赛道，冰壶社训练和比赛条件全校最佳。", stocks_affected: ["curling"], impact_type: "bullish", impact_min: 0.18, impact_max: 0.25, duration_days: 4 },
    { id: "tiyu_015", title: "🏀 篮球社受邀全国C8联盟邀请赛", description: "篮球社女队受邀参加全国C8高中联盟邀请赛，与全国顶级高中篮球队同场竞技！", stocks_affected: ["basketball"], impact_type: "bullish", impact_min: 0.22, impact_max: 0.32, duration_days: 5 },
    { id: "tiyu_016", title: "⚠️ 校外体育赛事全部禁止外出", description: "教育局发布外出比赛安全禁令，所有体育社团禁止外出参加市级以上赛事，改为校际友谊赛。", stocks_affected: STOCKS_TIYU, impact_type: "bearish", impact_min: -0.21, impact_max: -0.09, duration_days: 5 },
    { id: "tiyu_018", title: "⚠️ 冰壶社锦标赛决赛失误错失冠军", description: "冰壶社在全市锦标赛决赛最后一壶出现致命失误，以1分之差错失冠军，全队士气严重受挫。", stocks_affected: ["curling"], impact_type: "bearish", impact_min: -0.23, impact_max: -0.16, duration_days: 5 },
    { id: "tiyu_025", title: "🏀 女篮冠军纪录片循环展播新生激增", description: "篮球社冠军纪录片在校内大屏幕循环展播，新生报名人数激增150%。", stocks_affected: ["basketball"], impact_type: "bullish", impact_min: 0.16, impact_max: 0.24, duration_days: 4 },
    { id: "tiyu_031", title: "🥌 冰壶社承办全市中小学公开赛", description: "冰壶社首次承办全市中小学陆地冰壶公开赛，向明冰壶品牌走向全市。", stocks_affected: ["curling"], impact_type: "bullish", impact_min: 0.20, impact_max: 0.31, duration_days: 5 },
    { id: "tiyu_032", title: "⚠️ 足球社区联赛主力集体感冒缺赛", description: "足球社主力阵容多人集体感冒，关键社区联赛被迫用替补阵容出战，连败两场。", stocks_affected: ["football"], impact_type: "bearish", impact_min: -0.24, impact_max: -0.17, duration_days: 5 },
    { id: "tiyu_037", title: "🏸 羽毛球社新增4片专业羽毛球场地", description: "体育馆改造增加4片专业羽毛球场地配减震地板和LED照明，羽毛球社训练量翻倍。", stocks_affected: ["badminton"], impact_type: "bullish", impact_min: 0.22, impact_max: 0.30, duration_days: 5 },
    { id: "tiyu_038", title: "⚠️ 篮球社高三主力队员集体退队", description: "篮球社高三6名主力队员因高考备考集体申请退队，球队青黄不接。", stocks_affected: ["basketball"], impact_type: "bearish", impact_min: -0.21, impact_max: -0.15, duration_days: 5 },
    // ========== 通用宏观事件 ==========
    { id: "macro_001", title: "🌧️ 台风红色预警全校停课3天", description: "超强台风正面登陆，全市中小学停课3天，所有社团活动和训练全部暂停。", stocks_affected: [...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type: "bearish", impact_min: -0.08, impact_max: -0.03, duration_days: 3 },
    { id: "macro_002", title: "📰 向明中学获评市级示范校", description: "向明中学获评上海市示范性高中A类，综合办学实力获官方认可。全校社团关注度提升！", stocks_affected: ALL_STOCKS, impact_type: "bullish", impact_min: 0.03, impact_max: 0.08, duration_days: 5 },
    { id: "macro_003", title: "🎪 全校社团文化节盛大开幕", description: "一年一度的全校社团文化节在操场盛大开幕，50+社团展位吸引校内外数千人参观。", stocks_affected: [...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type: "bullish", impact_min: 0.05, impact_max: 0.12, duration_days: 4 },
    { id: "macro_004", title: "⚠️ 校园流感大规模爆发停课一周", description: "全校流感大规模爆发，三个年级轮流停课，社团活动及交易活跃度大幅下降。", stocks_affected: ALL_STOCKS, impact_type: "bearish", impact_min: -0.10, impact_max: -0.04, duration_days: 5 },
    { id: "macro_005", title: "📱 校园论坛推出社团人气排行榜", description: "校园论坛上线社团人气实时排行榜，各社团的曝光度和讨论度直接影响新生报名热度。", stocks_affected: [...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type: "mixed", impact_min: -0.06, impact_max: 0.10, duration_days: 5 },
    { id: "macro_006", title: "🏆 向明获评全国百强社团培育校", description: "向明中学获教育部评选为全国百强社团培育校，社团专项经费额外增加30%。", stocks_affected: ALL_STOCKS, impact_type: "bullish", impact_min: 0.06, impact_max: 0.14, duration_days: 5 },
    { id: "macro_007", title: "⚠️ 区级安全检查社团场地限期整改", description: "区教育局开展校园安全检查，多个社团活动场所被要求限期整改，活动暂停两周。", stocks_affected: [...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type: "bearish", impact_min: -0.12, impact_max: -0.05, duration_days: 4 },
    { id: "macro_008", title: "🎊 向明建校120周年系列庆祝活动", description: "向明中学迎来建校120周年，系列庆祝活动持续一周。校史展览、校友返校、庆典晚会轮番上演！", stocks_affected: ALL_STOCKS, impact_type: "bullish", impact_min: 0.08, impact_max: 0.18, duration_days: 5 },
];

// 因果链（支持分支结局：起因 → 随机从branches中选一个结局）
// branches 中每项有 weight 权重，决定随机概率
const CAUSE_CHAINS = [
    // ========== 科创智造 ==========
    {
        id: "chain_001", title_cause: "📰 匿名帖爆料：科创社团经费报销存疑",
        desc_cause: "校园论坛突然出现一则匿名帖子，矛头直指五大科创社团的经费报销流程「暗箱操作」。校方连夜发表声明称将成立专项调查组。",
        stocks_affected_cause: STOCKS_KEJI, impact_cause: "bearish", impact_min_cause: -0.08, impact_max_cause: -0.03, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:50, title:"✅ 调查结果：不存在违规，社团获表彰", desc:"校方调查组公布结果：科创社团经费使用完全合规，且有多项成果物超所值。学校额外追加科创激励奖金！", stocks_affected:STOCKS_KEJI, impact_type:"bullish", impact_min:0.12, impact_max:0.20, duration_days:5 },
            { weight:50, title:"⚠️ 调查结果：部分报销违规，涉事社团整顿", desc:"调查组发现两个社团存在发票不规范问题，要求退回虚报款项并停用社团经费账户一个月，相关社长被通报批评。", stocks_affected:STOCKS_KEJI, impact_type:"bearish", impact_min:-0.18, impact_max:-0.08, duration_days:5 },
        ],
    },
    {
        id: "chain_002", title_cause: "🤖 机器人社核心零件深夜不知去向",
        desc_cause: "机器人社备战VEX大赛前夕，一组价值上万元的核心电机和传感器套件从实验室不翼而飞！社团紧急上报保卫科，全校议论纷纷。",
        stocks_affected_cause: ["robot"], impact_cause: "bearish", impact_min_cause: -0.15, impact_max_cause: -0.08, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:45, title:"😅 虚惊一场！友社借用后忘记归还", desc:"原来是航模社临时借用后忘记登记归还。航模社道歉并赔偿全新电池组件，两社合作反而更加紧密。", stocks_affected:["robot","aero-model"], impact_type:"bullish", impact_min:0.10, impact_max:0.18, duration_days:4 },
            { weight:55, title:"😱 监控揭晓：被竞争对手恶意藏匿", desc:"保卫科调监控发现，零件被其他学校交流生刻意藏到储物间角落。虽找回零件但已错过训练窗口。学校加强外来人员管理。", stocks_affected:["robot"], impact_type:"bearish", impact_min:-0.20, impact_max:-0.10, duration_days:5 },
        ],
    },
    {
        id: "chain_003", title_cause: "💻 计算机社服务器流量异常暴增",
        desc_cause: "计算机社托管的全校社团报名系统突然流量暴涨十倍，服务器濒临崩溃。技术组紧急排查，怀疑遭外部攻击。",
        stocks_affected_cause: ["computer"], impact_cause: "bearish", impact_min_cause: -0.10, impact_max_cause: -0.04, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:50, title:"🎉 原来是报名太火爆！系统升级扩容", desc:"排查发现并非攻击，而是计算机社开发的「社团活动小程序」在友校意外走红！服务器紧急扩容后稳定运行，获校领导表扬。", stocks_affected:["computer","om-brain"], impact_type:"bullish", impact_min:0.15, impact_max:0.25, duration_days:5 },
            { weight:50, title:"🛡️ 确认遭校外黑客攻击，连夜修复", desc:"确认是校外人员利用系统漏洞发起DDoS攻击。计算机社通宵修复并加固安全，虽然疲惫但积累了宝贵的网络安全实战经验。", stocks_affected:["computer"], impact_type:"mixed", impact_min:-0.12, impact_max:0.05, duration_days:4 },
        ],
    },
    {
        id: "chain_004", title_cause: "🛩️ 航模社社长保送传闻四起",
        desc_cause: "航模社社长连续斩获多项全国大奖，传闻已经被多所顶尖高校锁定保送名额。全社上下既兴奋又担忧——如果他去外省，谁来掌舵？",
        stocks_affected_cause: ["aero-model"], impact_cause: "mixed", impact_min_cause: -0.03, impact_max_cause: 0.08, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:50, title:"🏫 保送上海本地名校，留校继续指导", desc:"社长确被保送交大，但他承诺大学期间每周回校指导。航模社不仅未受冲击，反而多了大学生导师资源！", stocks_affected:["aero-model"], impact_type:"bullish", impact_min:0.12, impact_max:0.20, duration_days:5 },
            { weight:50, title:"✈️ 保送北航远赴北京，社团青黄不接", desc:"社长保送至北京航空航天大学，开学后难以兼顾。航模社核心力量断档，新社长还在磨合中，短期承压。", stocks_affected:["aero-model"], impact_type:"bearish", impact_min:-0.16, impact_max:-0.08, duration_days:5 },
        ],
    },
    {
        id: "chain_005", title_cause: "🚗 超科学社被指与隔壁学校「撞设计」",
        desc_cause: "超科学社即将参赛的智能小车设计方案被隔壁学校社团公开指控「高度相似」，对方声称是原创并被抄袭。双方社团群内激烈对峙。",
        stocks_affected_cause: ["super-sci"], impact_cause: "bearish", impact_min_cause: -0.14, impact_max_cause: -0.06, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:50, title:"🤝 握手言和！两校宣布联合研发参赛", desc:"校方介入斡旋后，两个社团签订了联合研发协议，整合双方设计优势，以「联队」名义参赛！创意碰撞出更好方案。", stocks_affected:["super-sci","computer"], impact_type:"bullish", impact_min:0.14, impact_max:0.24, duration_days:5 },
            { weight:50, title:"📋 仲裁结果：各执一词，双方均受处罚", desc:"赛事组委会调查后认定双方设计存在交叉抄袭嫌疑，虽未取消资格但各扣20%参赛分。超科学社士气受挫。", stocks_affected:["super-sci"], impact_type:"bearish", impact_min:-0.20, impact_max:-0.10, duration_days:5 },
        ],
    },
    // ========== 文艺传媒 ==========
    {
        id: "chain_006", title_cause: "🎵 两大乐队宣布联合举办大型专场",
        desc_cause: "蜉蝣天空与181乐队罕见地联合官宣：将在学校大礼堂举办「双声」联合专场！消息一出全校沸腾，两个乐队的粉丝群都炸了。",
        stocks_affected_cause: ["mayfly-band","181-band"], impact_cause: "bullish", impact_min_cause: 0.05, impact_max_cause: 0.10, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:55, title:"🎫 门票一小时售罄！追加第二场", desc:"联合专场门票开售即被抢空，学校破例批准加开第二场。两支乐队人气双双创新高，周边T恤也卖断货！", stocks_affected:["mayfly-band","181-band","percussion"], impact_type:"bullish", impact_min:0.14, impact_max:0.22, duration_days:5 },
            { weight:45, title:"⚡ 演出当天礼堂跳闸，被迫改期", desc:"联合专场当天，学校礼堂电路老毛病复发导致大跳闸，演出紧急延期。退票风波和粉丝不满情绪蔓延，士气受打击。", stocks_affected:["mayfly-band","181-band"], impact_type:"bearish", impact_min:-0.15, impact_max:-0.07, duration_days:4 },
        ],
    },
    {
        id: "chain_007", title_cause: "📸 记者社收到一份神秘匿名爆料材料",
        desc_cause: "记者社邮箱收到一份来源不明的加密压缩包，内含大量关于某热门社团内部管理的「猛料」。社长紧急召集团队分析真伪。",
        stocks_affected_cause: ["reporter"], impact_cause: "mixed", impact_min_cause: -0.02, impact_max_cause: 0.06, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:50, title:"🗞️ 独家报道引爆全校话题！销量破纪录", desc:"经多方核实，材料基本属实。记者社推出独家深度报道，校刊加印三次仍供不应求，记者社专业声誉飙升。", stocks_affected:["reporter"], impact_type:"bullish", impact_min:0.16, impact_max:0.26, duration_days:5 },
            { weight:50, title:"💔 爆料被证实造假，记者社公开道歉", desc:"深入调查后发现材料多处伪造，系上次被淘汰的前社员恶意投递。记者社名誉受损，校方要求完善新闻审核流程。", stocks_affected:["reporter"], impact_type:"bearish", impact_min:-0.20, impact_max:-0.12, duration_days:4 },
        ],
    },
    {
        id: "chain_008", title_cause: "🎬 悬铃影社宣布投稿全国中学生微电影节",
        desc_cause: "悬铃影社将首次以社团名义投稿全国中学生微电影节，参赛作品是一部关于沪语方言保护的纪录短片，由影社和沪语社联合制作。",
        stocks_affected_cause: ["xuanling","shanghai"], impact_cause: "bullish", impact_min_cause: 0.04, impact_max_cause: 0.09, duration_cause: 1,
        delay_min: 2, delay_max: 4,
        branches: [
            { weight:50, title:"🏆 入围决赛获最佳纪录片奖！全校轰动", desc:"悬铃影社的纪录短片成功入围全国决赛并斩获「最佳纪录片」大奖！校领导在升旗仪式上全校表扬，影社招新爆满。", stocks_affected:["xuanling","shanghai","reporter"], impact_type:"bullish", impact_min:0.16, impact_max:0.28, duration_days:5 },
            { weight:50, title:"📧 作品被举报使用未授权配乐取消资格", desc:"短片因使用了一段未购买版权的背景音乐被匿名举报，组委会取消参赛资格。悬铃影社痛定思痛，开始系统学习版权知识。", stocks_affected:["xuanling","shanghai"], impact_type:"bearish", impact_min:-0.18, impact_max:-0.08, duration_days:5 },
        ],
    },
    {
        id: "chain_009", title_cause: "🗣️ 沪语社元老社员被海外名校录取",
        desc_cause: "沪语社创办元老之一被哥伦比亚大学全额奖学金录取，成为向明中学今年海外升学的最佳案例。但他的离开也让沪语社面临传承危机。",
        stocks_affected_cause: ["shanghai"], impact_cause: "mixed", impact_min_cause: -0.03, impact_max_cause: 0.06, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:50, title:"🌍 在纽约成立「向明沪语角」传为佳话", desc:"该社员在哥大创办了「向明沪语文化角」，每周为留学生普及沪语。新闻传回国内，沪语社获市语委表扬，影响力大增！", stocks_affected:["shanghai"], impact_type:"bullish", impact_min:0.14, impact_max:0.22, duration_days:5 },
            { weight:50, title:"😞 走了一位核心，沪语社运营捉襟见肘", desc:"元老离校后，沪语社日常活动和节目排练受到明显影响。新任骨干还在适应中，短时间出现成员活跃度下降。", stocks_affected:["shanghai"], impact_type:"bearish", impact_min:-0.16, impact_max:-0.08, duration_days:5 },
        ],
    },
    {
        id: "chain_010", title_cause: "🥁 打击乐社排练被周边居民投诉噪音",
        desc_cause: "打击乐社为备战全国展演增加训练强度，但连续多日的重低音排练引发了学校周边小区居民的集体投诉。教务处约谈社长。",
        stocks_affected_cause: ["percussion"], impact_cause: "bearish", impact_min_cause: -0.10, impact_max_cause: -0.04, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:50, title:"🎧 学校特批资金改造隔音排练室", desc:"校领导实地了解后，认为打击乐社是学校艺术名片，特批10万元改造专业隔音排练室！问题彻底解决，训练强度不降反升。", stocks_affected:["percussion"], impact_type:"bullish", impact_min:0.16, impact_max:0.24, duration_days:5 },
            { weight:50, title:"⏱️ 排练时间被严格压缩至每周两小时", desc:"教务处决定：打击乐社每日排练限时1小时，下午5点后禁止使用音量大的乐器。训练效果大幅打折，展演准备压力山大。", stocks_affected:["percussion"], impact_type:"bearish", impact_min:-0.18, impact_max:-0.10, duration_days:5 },
        ],
    },
    // ========== 思辨学术 ==========
    {
        id: "chain_011", title_cause: "🌐 模联社收到哈佛大学模联大会邀请函",
        desc_cause: "模联社凭借近年优异表现，破格收到哈佛大学全美模联大会（HMUN）的正式邀请函！这是向明模联史上第一次收到国际顶级邀请。",
        stocks_affected_cause: ["mun"], impact_cause: "bullish", impact_min_cause: 0.06, impact_max_cause: 0.12, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:45, title:"✈️ 企业全额赞助！6名代表远征波士顿", desc:"一家知名教育机构主动联系全额赞助往返机票和住宿费用！向明代表团在哈佛模联表现出色，社长获「杰出代表」奖。", stocks_affected:["mun"], impact_type:"bullish", impact_min:0.20, impact_max:0.32, duration_days:5 },
            { weight:55, title:"🛂 签证被拒！6人团队集体无法成行", desc:"因签证材料问题，6名代表的赴美签证全部被拒。模联社错过千载难逢的机会，转为线上观摩但体感大打折扣。", stocks_affected:["mun"], impact_type:"bearish", impact_min:-0.18, impact_max:-0.08, duration_days:4 },
        ],
    },
    {
        id: "chain_012", title_cause: "🗣️ 辩论社市级大赛抽签遇上卫冕冠军",
        desc_cause: "市级中学生辩论赛抽签结果公布，向明辩论社首轮即遭遇三连冠的卫冕冠军队伍。全校都在关注这场「大卫对歌利亚」之战。",
        stocks_affected_cause: ["debate"], impact_cause: "mixed", impact_min_cause: -0.03, impact_max_cause: 0.05, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:40, title:"🎉 惊天逆转！向明击败卫冕冠军闯入八强", desc:"辩论社准备了一套出人意料的论点框架，在自由辩论环节精准反击对方的逻辑漏洞，最终以3:2险胜！全校震动！", stocks_affected:["debate"], impact_type:"bullish", impact_min:0.18, impact_max:0.30, duration_days:5 },
            { weight:60, title:"😔 技不如人，被卫冕冠军5:0碾压淘汰", desc:"尽管准备充分，但卫冕冠军的经验和配合实在太强。辩论社以0:5惨败首轮出局。虽败犹荣，评委仍称赞向明有巨大潜力。", stocks_affected:["debate"], impact_type:"bearish", impact_min:-0.14, impact_max:-0.05, duration_days:4 },
        ],
    },
    {
        id: "chain_013", title_cause: "🏛️ 校方拟合并辩论社与模联社的经费账户",
        desc_cause: "财务处为提高效率，提出将辩论社与模联社的活动经费合并为一个「人文类社团共享账户」，由两社共同申请使用。消息一出争议极大。",
        stocks_affected_cause: ["mun","debate"], impact_cause: "bearish", impact_min_cause: -0.08, impact_max_cause: -0.03, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:50, title:"🤝 双社达成战略合作：联合办赛共赢", desc:"两社经过多轮协商，非但没有被经费合并压倒，反而联合推出了「向明思辨周」品牌活动，合办模联辩论双赛，影响力翻倍！", stocks_affected:["mun","debate"], impact_type:"bullish", impact_min:0.10, impact_max:0.18, duration_days:5 },
            { weight:50, title:"💔 合并方案通过，两社因分配不均闹翻", desc:"经费合并方案最终落地，但第一次分配就因「谁用得多」爆发激烈争执。两社关系降至冰点，双双受影响。", stocks_affected:["mun","debate"], impact_type:"bearish", impact_min:-0.16, impact_max:-0.06, duration_days:5 },
        ],
    },
    // ========== 校园体育 ==========
    {
        id: "chain_014", title_cause: "🏀 篮球社女篮收到一笔神秘大额匿名赞助",
        desc_cause: "篮球社女篮的公开账户突然收到一笔5万元的匿名赞助，汇款人备注「支持热爱篮球的女孩子们」。没有人知道是谁捐的，全校都在猜。",
        stocks_affected_cause: ["basketball"], impact_cause: "bullish", impact_min_cause: 0.05, impact_max_cause: 0.10, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:50, title:"🌟 神秘赞助人是旅美校友！又追加10万", desc:"捐款人身份揭晓：是一位曾在向明女篮效力、现为硅谷工程师的校友。她看到女篮成绩优异，又追加捐款10万设立「女篮奖学金」！", stocks_affected:["basketball"], impact_type:"bullish", impact_min:0.18, impact_max:0.28, duration_days:5 },
            { weight:50, title:"⚠️ 赞助牵涉商业纠纷被银行冻结追回", desc:"银行调查发现该汇款涉及一桩商业合同纠纷，资金被冻结并追回。虽然篮球社无过错，但舆论压力不小。", stocks_affected:["basketball"], impact_type:"bearish", impact_min:-0.12, impact_max:-0.06, duration_days:4 },
        ],
    },
    {
        id: "chain_015", title_cause: "⚽ 足球社重金约好的友谊赛对手临时爽约",
        desc_cause: "足球社为准备区级联赛，花了一笔社费约了全市排名前三的实验中学足球队踢友谊赛。但对方在赛前一天突然以「场地冲突」为由爽约。",
        stocks_affected_cause: ["football"], impact_cause: "bearish", impact_min_cause: -0.08, impact_max_cause: -0.03, duration_cause: 1,
        delay_min: 1, delay_max: 1,
        branches: [
            { weight:50, title:"🔄 紧急联系更高级别对手！锻炼价值翻倍", desc:"社长连夜公关，竟然联系到了某体育学院青年队愿意应邀！虽然输了比赛，但高强度对抗让全队收获极大，教练直呼「值了」。", stocks_affected:["football"], impact_type:"bullish", impact_min:0.10, impact_max:0.18, duration_days:4 },
            { weight:50, title:"💸 社费打了水漂，全队士气跌入谷底", desc:"所有备赛训练白费，社费无法追回。足球社一度陷入消沉，多名边缘队员对社团管理产生质疑。", stocks_affected:["football"], impact_type:"bearish", impact_min:-0.16, impact_max:-0.08, duration_days:5 },
        ],
    },
    {
        id: "chain_016", title_cause: "🥌 冰壶社赛道面临市体育局标准化验收",
        desc_cause: "市体育局宣布将对全市中小学陆地冰壶赛道进行标准化抽查。冰壶社自建的赛道用的是社团自筹资金，如果验收不合格，可能影响比赛资格。",
        stocks_affected_cause: ["curling"], impact_cause: "mixed", impact_min_cause: -0.05, impact_max_cause: 0.05, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:50, title:"✅ 赛道获评「市级标准赛道」！可承办赛事", desc:"检查结果远超预期！赛道尺寸和材质均达到市级比赛标准，获颁「市级标准赛道」认证。向明冰壶社拿下承办权。", stocks_affected:["curling"], impact_type:"bullish", impact_min:0.16, impact_max:0.26, duration_days:5 },
            { weight:50, title:"📏 赛道3项指标未达标，限期两个月整改", desc:"检查发现赛道偏差和摩擦系数不达标，需重新铺设。整改费用预估3万元，冰壶社短期内面临场地封停。", stocks_affected:["curling"], impact_type:"bearish", impact_min:-0.18, impact_max:-0.10, duration_days:5 },
        ],
    },
    {
        id: "chain_017", title_cause: "🏸 羽毛球社训练场地发现地板裂缝隐患",
        desc_cause: "羽毛球社队员在训练中注意到体育馆木地板有两处明显裂缝，且靠近边线区域。社长立即上报总务处，要求检查。",
        stocks_affected_cause: ["badminton"], impact_cause: "mixed", impact_min_cause: -0.02, impact_max_cause: 0.02, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:55, title:"🔧 及时全面检修！场地条件反而升级", desc:"总务处高度重视，对体育馆进行全面排查并更换了老旧地板。翻新后的场地条件比原来更好，队员反馈非常舒适！", stocks_affected:["badminton"], impact_type:"bullish", impact_min:0.12, impact_max:0.20, duration_days:4 },
            { weight:45, title:"🩹 一名队员在裂缝处扭伤脚踝引发风波", desc:"就在等待检修期间，一名主力队员在训练中恰好踩到裂缝处，脚踝扭伤需休养两周。家长投诉学校安全管理，训练暂停。", stocks_affected:["badminton"], impact_type:"bearish", impact_min:-0.18, impact_max:-0.10, duration_days:5 },
        ],
    },
    {
        id: "chain_018", title_cause: "🏀 女篮队长被省青年队正式征召试训",
        desc_cause: "篮球社女篮队长收到了省青年队的正式征召函！如果试训通过，她将在高二结束后直接进入专业队训练体系。全校都为她骄傲。",
        stocks_affected_cause: ["basketball"], impact_cause: "bullish", impact_min_cause: 0.05, impact_max_cause: 0.12, duration_cause: 1,
        delay_min: 2, delay_max: 4,
        branches: [
            { weight:40, title:"🏅 试训通过！获「省队兼向明双身份」资格", desc:"队长顺利通过试训，省队特别批准她保留向明学籍并每周回校带训一次。向明篮球社从此拥有省队级别的训练资源！", stocks_affected:["basketball"], impact_type:"bullish", impact_min:0.20, impact_max:0.30, duration_days:5 },
            { weight:60, title:"👋 试训落选但直接转学至专业体校", desc:"试训未通过省队标准，但队长被某专业体校看中并转学过去。篮球社痛失核心领袖，球队攻防体系需要重新搭建。", stocks_affected:["basketball"], impact_type:"bearish", impact_min:-0.22, impact_max:-0.12, duration_days:5 },
        ],
    },
    // ========== 跨板块通用 ==========
    {
        id: "chain_019", title_cause: "🏛️ 校方召开「社团与学业平衡」专题座谈会",
        desc_cause: "期中考试后部分班级成绩下滑，有家长联名要求限制社团占用学习时间。校长亲自召开座谈会，邀请社团代表和家长代表共同讨论。",
        stocks_affected_cause: ALL_STOCKS, impact_cause: "bearish", impact_min_cause: -0.05, impact_max_cause: -0.01, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:50, title:"🎯 座谈会成果：社团经费增加15%", desc:"校长在听取发言后表态：「社团是向明的特色，不能削，只能强！」宣布社团总预算增加15%并建立社团与学业互助制度。全板块沸腾！", stocks_affected:ALL_STOCKS, impact_type:"bullish", impact_min:0.06, impact_max:0.14, duration_days:5 },
            { weight:50, title:"📜 政策收紧：考试期间社团全部停摆", desc:"校方决定：期中期末考前三周所有社团活动暂停，期间需提交自习签到。体育类社团受影响最大，许多训练计划被迫中断。", stocks_affected:ALL_STOCKS, impact_type:"bearish", impact_min:-0.12, impact_max:-0.04, duration_days:5 },
        ],
    },
    {
        id: "chain_020", title_cause: "🌟 知名校友神秘预告「即将重返母校」",
        desc_cause: "一位向明杰出校友在社交媒体上发布了一条神秘动态：「下周回母校看看，有重要事情宣布。」很快被扒出是某上市公司创始人，身价数十亿。",
        stocks_affected_cause: ALL_STOCKS, impact_cause: "bullish", impact_min_cause: 0.03, impact_max_cause: 0.07, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:45, title:"💰 校友宣布捐资200万设立社团发展基金", desc:"校友在返校演讲中宣布：个人捐资200万元设立「向明社团发展基金」！所有社团均可申请项目资助，科创和体育板块受益最大！", stocks_affected:ALL_STOCKS, impact_type:"bullish", impact_min:0.08, impact_max:0.18, duration_days:6 },
            { weight:55, title:"📢 校友演讲批评社团水平「不如我们当年」", desc:"校友在座谈中直言不讳地批评了多个社团的比赛成绩和作品水平。虽然言辞诚恳，但舆论发酵后变成「大佬看不起我们」，各社团士气受挫。", stocks_affected:[...STOCKS_KEJI,"debate","mun"], impact_type:"bearish", impact_min:-0.14, impact_max:-0.06, duration_days:5 },
        ],
    },
    {
        id: "chain_021", title_cause: "📱 校园论坛发起「年度十佳社团」全校公投",
        desc_cause: "校园论坛版主突发奇想发起「你心中的年度十佳社团」全校公开投票。一小时内参与人数突破2000，各社团粉丝疯狂拉票，竞争白热化。",
        stocks_affected_cause:[...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_cause: "mixed", impact_min_cause: -0.03, impact_max_cause: 0.08, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:55, title:"🏆 投票揭晓热闹非凡！所有社团热度大涨", desc:"投票结果引发全校大讨论，上榜社团获得巨大曝光，未上榜的也因话题度而获得关注。全校社团生态活跃度达历史高峰！", stocks_affected:[...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type:"bullish", impact_min:0.05, impact_max:0.12, duration_days:5 },
            { weight:45, title:"😤 拉票演变为粉丝骂战，论坛被迫关闭投票", desc:"各社团粉丝团在评论区互相攻击、灌票，论坛管理员被迫提前关闭投票。校方介入批评「恶性竞争有损社团精神」。", stocks_affected:[...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type:"bearish", impact_min:-0.10, impact_max:-0.03, duration_days:4 },
        ],
    },
    {
        id: "chain_022", title_cause: "📋 寒/暑假社团特训营招募令发布",
        desc_cause: "社团联合会发布假期特训营招募令：凡在假期组织集中训练的社团，可申请额外假期训练津贴。各社团摩拳擦掌。",
        stocks_affected_cause:[...STOCKS_KEJI,...STOCKS_TIYU], impact_cause: "mixed", impact_min_cause: -0.02, impact_max_cause: 0.06, duration_cause: 1,
        delay_min: 2, delay_max: 3,
        branches: [
            { weight:50, title:"📈 特训成果显著！多社团技术实现飞跃", desc:"假期集中训练效果惊人——机器人社完成新一代底盘设计、篮球社磨合出新战术、计算机社写完竞赛级算法。各社团新学期虎虎生威！", stocks_affected:[...STOCKS_KEJI,...STOCKS_TIYU], impact_type:"bullish", impact_min:0.08, impact_max:0.18, duration_days:5 },
            { weight:50, title:"😴 假期分散各地，特训出勤率不足四成", desc:"假期里大部分社员回老家或旅游，特训营冷冷清清。只有少数骨干坚持训练但难成气候，特训津贴也没有全额发放。", stocks_affected:[...STOCKS_KEJI,...STOCKS_TIYU], impact_type:"bearish", impact_min:-0.10, impact_max:-0.04, duration_days:4 },
        ],
    },
    {
        id: "chain_023", title_cause: "🤝 隔壁名校提议建立「校际社团结对互助」",
        desc_cause: "某兄弟名校的社团联合会发来正式提议：建立校际社团「一对一结对」，共享师资、设备和赛事经验。这是一个巨大的发展机遇，但也可能带来竞争。",
        stocks_affected_cause:[...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_cause: "mixed", impact_min_cause: -0.02, impact_max_cause: 0.06, duration_cause: 1,
        delay_min: 1, delay_max: 3,
        branches: [
            { weight:50, title:"🎯 结对成功！获区教育局专项扶持资金", desc:"两校社团成功结对，区教育局为此设立「校际社团合作专项资金」，每对结对社团可申领5万元活动经费。强强联合效果翻倍！", stocks_affected:[...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type:"bullish", impact_min:0.06, impact_max:0.15, duration_days:5 },
            { weight:50, title:"📜 协议暴露暗坑：对方学校绑定排他条款", desc:"结对协议细节被曝光，其中隐藏着「优先将赛事名额让给对方」「不得单独申请区级经费」等排他条款。各社团纷纷要求重新谈判或退出。", stocks_affected:[...STOCKS_KEJI,...STOCKS_WENYI,...STOCKS_SIBIAN,...STOCKS_TIYU], impact_type:"bearish", impact_min:-0.12, impact_max:-0.05, duration_days:5 },
        ],
    },
    {
        id: "chain_024", title_cause: "🎤 校园广播站突然被校办接管引发恐慌",
        desc_cause: "校办突然宣布「因管理需要」临时接管校园广播站的管理权，原本由各文艺社团轮值播放的节目被统一替换为校园新闻。蜉蝣天空的固定节目《午间Live》被砍。",
        stocks_affected_cause:["mayfly-band","181-band","reporter","shanghai"], impact_cause: "bearish", impact_min_cause: -0.10, impact_max_cause: -0.04, duration_cause: 1,
        delay_min: 1, delay_max: 2,
        branches: [
            { weight:45, title:"📡 改革方案出炉：社团节目保留且升级设备", desc:"接管后校方并非要取消社团节目，而是升级广播站设备并建立规范的节目审核轮播制度。节目质量反而大幅提升！", stocks_affected:["mayfly-band","181-band","reporter","shanghai"], impact_type:"bullish", impact_min:0.10, impact_max:0.18, duration_days:5 },
            { weight:55, title:"🔇 广播站沦为校办官宣喇叭，文艺社失声", desc:"接管后广播站彻底变为「校务通知专用频道」，所有社团自制节目被永久取消。文艺社团失去最重要的校内宣传渠道，愤懑不已。", stocks_affected:["mayfly-band","181-band","reporter","shanghai"], impact_type:"bearish", impact_min:-0.16, impact_max:-0.07, duration_days:5 },
        ],
    },
];

const EVENTS = [...SCHEDULED_EVENTS];

// ============ 知识答题题库 ============
const QUIZ_QUESTIONS = [
    { id: 1, question: "模拟证券交易中，稳定赚钱的唯一核心逻辑是？", options: ["A. 一直持有不卖出", "B. 低买高卖", "C. 跟着所有人跟风买入", "D. 加杠杆满仓交易"], answer: "B", explanation: "股票盈利来自差价，低买高卖是唯一正确逻辑。" },
    { id: 2, question: "你持有的股票持续下跌、利空不断，最合理的操作是？", options: ["A. 继续加仓赌反弹", "B. 及时止损卖出，控制亏损", "C. 不管不问，坐等回本", "D. 加杠杆摊低成本"], answer: "B", explanation: "利空持续发酵会导致亏损扩大，及时止损是规范交易习惯。" },
    { id: 3, question: "以下哪一项属于【重大利好消息】？", options: ["A. 公司年度利润大幅上涨", "B. 公司产品出现大规模质量问题", "C. 公司财务造假被处罚", "D. 核心高管集体离职"], answer: "A", explanation: "业绩上涨提升公司价值，属于利好；其余三项均为重大利空。" },
    { id: 4, question: "以下哪一项属于【重大利空消息】？", options: ["A. 国家出台行业补贴政策", "B. 企业拿下超大合作订单", "C. 公司连续两年大额亏损", "D. 公司推出爆款新产品"], answer: "C", explanation: "持续亏损会导致股价下跌，甚至触发退市风险，属于严重利空。" },
    { id: 5, question: "社团模拟股市单日股票最大涨跌幅限制为？", options: ["A. 5%", "B. 10%", "C. 15%", "D. 无限制"], answer: "C", explanation: "本次社团模拟统一规则：单日涨跌停幅度均为 15%。" },
    { id: 6, question: "某股票突发重大利好，直接涨停，此时最常见的情况是？", options: ["A. 随便低价买入", "B. 想买也很难买入", "C. 当天还能继续上涨", "D. 股价会立刻下跌"], answer: "B", explanation: "涨停后价格封顶、买盘拥挤，普通投资者很难成交买入。" },
    { id: 7, question: "股票触发跌停板时，最大的风险是？", options: ["A. 可以随时低价加仓", "B. 想卖出却卖不出去，无法止损", "C. 股价会立刻反弹", "D. 当天禁止交易"], answer: "B", explanation: "跌停流动性枯竭，无人接盘，是最常见的被套风险。" },
    { id: 8, question: "关于杠杆交易，以下说法正确的是？", options: ["A. 杠杆只会放大收益，不会放大亏损", "B. 杠杆收益和风险会同步放大", "C. 新手可以无脑加杠杆", "D. 杠杆交易绝对不会亏损"], answer: "B", explanation: "杠杆是双刃剑，赚钱翻倍、亏钱也翻倍，风险极高。" },
    { id: 9, question: '杠杆交易中"爆仓（强制平仓）"指的是？', options: ["A. 自己主动卖出股票止盈", "B. 亏损达标，系统自动清空所有持仓、亏光本金", "C. 股票涨停无法买入", "D. 股票退市自动销户"], answer: "B", explanation: "爆仓是杠杆最大风险，无需本人操作，系统强制平仓，本金清零。" },
    { id: 10, question: "股票被标注*ST，代表什么意思？", options: ["A. 股票即将大涨", "B. 股票存在退市风险（风险警示）", "C. 可以免费分红", "D. 股票取消涨跌停限制"], answer: "B", explanation: "*ST是退市风险警示，代表公司经营严重异常，随时可能退市。" },
    { id: 11, question: "以下哪种情况最容易触发公司退市？", options: ["A. 单天小幅下跌", "B. 连续两年巨额亏损、财务不达标", "C. 单天涨停", "D. 短期小幅盈利"], answer: "B", explanation: "连续亏损是最常见的财务退市原因。" },
    { id: 12, question: "股票进入退市整理期后，最典型的特征是？", options: ["A. 持续大涨、收益极高", "B. 大概率连续跌停、亏损惨重", "C. 停止一切交易", "D. 公司直接补发分红"], answer: "B", explanation: "退市整理期是最后离场机会，市场恐慌抛售，几乎都是连续跌停。" },
    { id: 13, question: "社团模拟交易中，新手最安全的做法是？", options: ["A. 满仓追涨停、频繁交易", "B. 远离杠杆、远离ST退市股、理性交易", "C. 利空死扛，赌反弹回本", "D. 亏损后加倍加仓"], answer: "B", explanation: "稳健交易、规避高风险规则是模拟社团的核心学习目标。" },
    { id: 14, question: '"利好落地即下跌"是模拟交易中常见现象，主要原因是？', options: ["A. 利好消息全部是假消息", "B. 消息提前被预判，大家提前买入炒作，正式公布后无人接盘", "C. 股市规则强制下跌", "D. 所有利好都会被市场反向解读"], answer: "B", explanation: "多数利好会被提前炒作，正式公告发布后，没有新增买入资金，股价容易回落下跌。" },
    { id: 15, question: "以下哪种操作属于理性止盈交易？", options: ["A. 股票大涨后，达到预期收益主动卖出锁定利润", "B. 股票刚涨一点就立刻加仓", "C. 股票涨停后无脑追高买入", "D. 持仓盈利后一直持有，从不卖出"], answer: "A", explanation: "止盈是盈利后主动落袋为安，是规范的交易思维。" },
    { id: 16, question: "连续多个交易日涨停的股票，最大隐患是？", options: ["A. 没有任何风险，只会一直涨", "B. 炒作热度过高，后续极易快速回调大跌", "C. 一定会触发退市", "D. 会被禁止交易"], answer: "B", explanation: "短期暴涨的股票多为资金炒作，没有业绩支撑，热度褪去后会快速回落亏损。" },
    { id: 17, question: "关于杠杆和跌停的组合风险，说法正确的是？", options: ["A. 跌停时加杠杆可以摊薄成本，稳赚不赔", "B. 跌停无法卖出，杠杆亏损持续累积，极易爆仓", "C. 杠杆可以抵消跌停的亏损", "D. 跌停股票可以随意使用杠杆加仓"], answer: "B", explanation: "股票跌停无法止损，杠杆会成倍放大亏损，持续下跌会直接触发强制平仓。" },
    { id: 18, question: "被标记*ST的风险股票，社团交易中最正确的做法是？", options: ["A. 低价抄底，赌它反弹回本", "B. 少量试仓，博取高收益", "C. 坚决规避，不参与炒作", "D. 加杠杆重仓买入"], answer: "C", explanation: "*ST股票存在极高退市风险，大概率持续下跌，是模拟交易中重点规避的标的。" },
    { id: 19, question: "公司发布新品研发失败公告，该消息属于？", options: ["A. 重大利好", "B. 重大利空", "C. 中性消息，无影响", "D. 保本消息"], answer: "B", explanation: "新品研发失败会影响公司未来盈利和发展，属于利空消息。" },
    { id: 20, question: '模拟交易中"满仓操作"的最大风险是？', options: ["A. 交易速度变慢", "B. 没有剩余资金应对亏损，遇到利空、跌停无法补救", "C. 会被强制限制交易", "D. 只能盈利不会亏损"], answer: "B", explanation: "满仓没有备用资金，遭遇股价下跌、利空突袭时，无法补仓或灵活调仓。" },
    { id: 21, question: "以下哪项属于企业长期利好，能稳定支撑股价？", options: ["A. 单次短期股价涨停", "B. 公司持续稳定盈利、逐年分红", "C. 短期资金疯狂炒作", "D. 临时发布无关公告"], answer: "B", explanation: "持续盈利、稳定分红是公司实力的核心体现。" },
    { id: 22, question: "退市整理期的股票，涨跌停规则是？", options: ["A. 取消涨跌停限制", "B. 依旧保持涨跌停限制，且极易连续跌停", "C. 只能涨不能跌", "D. 只能跌不能涨"], answer: "B", explanation: "退市整理期股票仍遵守涨跌停规则，市场恐慌情绪严重。" },
    { id: 23, question: "关于杠杆使用，社团明确的核心准则是？", options: ["A. 盈利时用，亏损时也可以用", "B. 新手禁止使用，仅极少数体验、不常规交易", "C. 每次交易都必须加杠杆", "D. 杠杆可以弥补所有亏损"], answer: "B", explanation: "杠杆风险极高，社团仅用于风险认知体验。" },
    { id: 24, question: "股票小幅正常波动、无任何消息影响，属于？", options: ["A. 利好行情", "B. 利空行情", "C. 正常市场波动", "D. 退市预警行情"], answer: "C", explanation: "股价日常小幅涨跌是市场正常现象，无需过度操作。" },
    { id: 25, question: "投资者持仓股票遭遇连续跌停，正确心态和操作是？", options: ["A. 死扛到底，一定能回本", "B. 认清风险，后续规避同类高危股票", "C. 立刻加杠杆加仓摊低成本", "D. 跟风恐慌盲目割肉"], answer: "B", explanation: "连续跌停多为重大利空或退市风险，需正视亏损、总结经验。" },
    { id: 26, question: "以下哪种行为属于社团禁止的高风险交易行为？", options: ["A. 分批理性买入优质股票", "B. 根据消息合理止盈止损", "C. 追高涨停股、重仓ST股、频繁加杠杆", "D. 轻仓长期稳健持仓"], answer: "C", explanation: "追高、炒作风险股、滥用杠杆是模拟交易中亏损的主要原因。" },
    { id: 27, question: "公司获得国家专项政策扶持、长期免税补贴，该利好会让公司？", options: ["A. 经营成本降低，盈利能力提升，股价易上涨", "B. 立刻退市", "C. 股价持续跌停", "D. 无任何变化"], answer: "A", explanation: "政策扶持、免税补贴能降低企业成本，提升长期盈利能力。" },
    { id: 28, question: "爆仓发生后，交易者的最终结果是？", options: ["A. 本金小幅亏损，持仓保留", "B. 系统强制清仓，自有模拟本金全部亏空", "C. 自动获得补偿金币", "D. 杠杆额度自动翻倍"], answer: "B", explanation: "爆仓是杠杆交易的终极风险，系统会强制清空全部持仓。" },
];

console.log('[data.js] 加载完成：' + Object.keys(STOCKS).length + '支股票, ' + QUIZ_QUESTIONS.length + '道题目, ' + EVENTS.length + '个事件');

