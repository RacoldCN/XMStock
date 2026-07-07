/**
 * 校园证券交易所 - 游戏引擎（静态版）
 * 使用 localStorage 持久化数据，替代 SQLite
 */

// ============ localStorage 键名 ============
const LS_PREFIX = 'stock_game_';
const LS_KEYS = {
    cash: LS_PREFIX + 'cash',
    day: LS_PREFIX + 'day',
    prices: LS_PREFIX + 'prices',        // JSON: { sid: { current: number, prev: number } }
    holdings: LS_PREFIX + 'holdings',    // JSON: { sid: { quantity, avg_price, leverage, margin } }
    kline: LS_PREFIX + 'kline',          // JSON: { sid: [{ day, open, high, low, close, volume }] }
    transactions: LS_PREFIX + 'txns',    // JSON: [{ stock_id, type, quantity, price, leverage, total_amount, day }]
    events: LS_PREFIX + 'events',        // JSON: [{ id, event_index, event_id, chain_id, title, description, trigger_day, effective_day, delay_days, stocks_affected, impact_type, impact_values, duration_days, status, announced_at_day }]
    quiz: LS_PREFIX + 'quiz',            // JSON: { score, best_score, total_attempts }
    running: LS_PREFIX + 'running',      // "true"/"false"
};

// ============ 数据版本（用于检测旧数据自动重置）============
const DATA_VERSION = 1;
const LS_KEY_VERSION = LS_PREFIX + 'version';

// ============ 初始化 / 重置 ============
function initGame() {
    try {
        var storedVersion = parseInt(localStorage.getItem(LS_KEY_VERSION) || '0');
        var needsReset = false;

        // 版本不匹配，强制重置
        if (storedVersion !== DATA_VERSION) {
            needsReset = true;
        }
        // 或缺少关键数据
        else if (localStorage.getItem(LS_KEYS.cash) === null) {
            needsReset = true;
        }
        // 或价格数据缺失
        else {
            var prices = loadJSON(LS_KEYS.prices, null);
            if (!prices || typeof prices !== 'object') {
                needsReset = true;
            } else {
                // 检查所有股票的价格是否都存在
                for (var i = 0; i < STOCK_ORDER.length; i++) {
                    var sid = STOCK_ORDER[i];
                    if (!prices[sid] || prices[sid].current === undefined) {
                        needsReset = true;
                        break;
                    }
                }
            }
        }

        if (needsReset) {
            resetGame();
        }
    } catch (e) {
        console.error('initGame 错误:', e);
        try { resetGame(); } catch (e2) {
            console.error('resetGame 也失败:', e2);
        }
    }
}

function resetGame() {
    // 标记数据版本
    localStorage.setItem(LS_KEY_VERSION, String(DATA_VERSION));

    // 现金
    localStorage.setItem(LS_KEYS.cash, String(INITIAL_CASH));
    localStorage.setItem(LS_KEYS.day, '0');
    localStorage.setItem(LS_KEYS.running, 'false');

    // 股价（初始价格）
    var prices = {};
    for (var i = 0; i < STOCK_ORDER.length; i++) {
        var sid = STOCK_ORDER[i];
        var p = STOCKS[sid].init_price;
        prices[sid] = { current: p, prev: p };
    }
    saveJSON(LS_KEYS.prices, prices);

    // 持仓
    saveJSON(LS_KEYS.holdings, {});

    // K线（Day 0 初始锚点）
    var kline = {};
    for (var i = 0; i < STOCK_ORDER.length; i++) {
        var sid2 = STOCK_ORDER[i];
        var p2 = STOCKS[sid2].init_price;
        kline[sid2] = [{ day: 0, open: p2, high: p2, low: p2, close: p2, volume: 1000 }];
    }
    saveJSON(LS_KEYS.kline, kline);

    // 交易记录
    saveJSON(LS_KEYS.transactions, []);

    // 事件日志
    saveJSON(LS_KEYS.events, []);

    // 答题
    saveJSON(LS_KEYS.quiz, { score: 0, best_score: 0, total_attempts: 0 });
}

// ============ save / load ============
function saveJSON(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('saveJSON 失败:', key, e);
    }
}

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null || raw === undefined) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        console.error('loadJSON 失败:', key, e);
        return fallback;
    }
}

function getState() {
    return {
        cash: parseFloat(localStorage.getItem(LS_KEYS.cash) || INITIAL_CASH),
        day: parseInt(localStorage.getItem(LS_KEYS.day) || '0'),
        running: localStorage.getItem(LS_KEYS.running) === 'true',
        prices: loadJSON(LS_KEYS.prices, {}),
        holdings: loadJSON(LS_KEYS.holdings, {}),
        kline: loadJSON(LS_KEYS.kline, {}),
        transactions: loadJSON(LS_KEYS.transactions, []),
        events: loadJSON(LS_KEYS.events, []),
        quiz: loadJSON(LS_KEYS.quiz, { score: 0, best_score: 0, total_attempts: 0 }),
    };
}

// ============ 工具函数 ============
function random_uniform(min, max) {
    return min + Math.random() * (max - min);
}

function gauss_random(mean, stddev) {
    // Box-Muller 变换
    let u1 = Math.random();
    let u2 = Math.random();
    while (u1 === 0) u1 = Math.random();
    return mean + stddev * Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

function hashStr(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash + chr) | 0;
    }
    return Math.abs(hash) % 90000 + 10000;
}

// ============ 事件影响分散到每天 ============
function generateDailyImpacts(totalImpact, numDays) {
    if (numDays <= 0) return [];
    const weights = [];
    for (let i = 0; i < numDays; i++) {
        weights.push(Math.max(0.1, 1.0 - i * 0.15));
    }
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const impacts = weights.map(w => totalImpact * w / totalWeight);
    const noisy = impacts.map(v => v * random_uniform(0.8, 1.2));
    const noisySum = noisy.reduce((a, b) => a + b, 0);
    return noisy.map(v => v * totalImpact / noisySum);
}

// ============ OHLC 生成 ============
function generateOHLC(prevClose, dailyChange) {
    const openPrice = prevClose;
    const closePrice = openPrice * (1 + dailyChange);
    const intradayVol = Math.abs(dailyChange) * 0.6 + 0.008;
    let low, high;

    if (dailyChange >= 0) {
        low = openPrice * (1 - Math.random() * intradayVol);
        high = closePrice * (1 + Math.random() * intradayVol * 0.5);
    } else {
        high = openPrice * (1 + Math.random() * intradayVol);
        low = closePrice * (1 - Math.random() * intradayVol * 0.5);
    }

    high = Math.max(high, openPrice, closePrice);
    low = Math.min(low, openPrice, closePrice);

    const baseVolume = Math.floor(Math.random() * 2800) + 200;
    const volumeMultiplier = 1.0 + Math.abs(dailyChange) * 5;
    const volume = Math.floor(baseVolume * volumeMultiplier);

    return {
        open: Math.round(openPrice * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(closePrice * 100) / 100,
        volume: volume,
    };
}

// ============ 计算日涨跌 ============
function calculateDailyChange(stockId, activeEvents, currentDay) {
    const baseVolatility = 0.006;
    let baseChange = gauss_random(0, baseVolatility);
    let eventImpact = 0.0;

    for (const event of activeEvents) {
        try {
            const stocksAffected = JSON.parse(event.stocks_affected);
            const impactValues = JSON.parse(event.impact_values);
            const duration = event.duration_days;
            const dayOffset = currentDay - event.effective_day;

            if (stocksAffected.includes(stockId) && stockId in impactValues) {
                const totalImpact = impactValues[stockId];
                const dailyImpacts = generateDailyImpacts(totalImpact, duration);
                if (dayOffset >= 0 && dayOffset < dailyImpacts.length) {
                    eventImpact += dailyImpacts[dayOffset];
                }
            }
        } catch (e) {
            continue;
        }
    }

    let totalChange = baseChange + eventImpact;
    totalChange = Math.max(-CIRCUIT_BREAKER, Math.min(CIRCUIT_BREAKER, totalChange));
    return totalChange;
}

// ============ 核心：推进一天 ============
function advanceDay() {
    const state = getState();
    const currentDay = state.day + 1;

    if (currentDay > TOTAL_DAYS) {
        return { game_over: true, day: currentDay };
    }

    const result = {
        day: currentDay,
        game_over: false,
        new_events: [],
        activated_events: [],
        prices: {},
        liquidated: [],
    };

    let events = state.events;
    let eventIdCounter = events.length > 0 ? Math.max(...events.map(e => e.id || 0)) + 1 : 1;

    // 确保每个事件有唯一ID
    for (const ev of events) {
        if (!ev.id) ev.id = eventIdCounter++;
    }

    const triggeredIndices = new Set(events.map(e => e.event_index));

    // 1. 固定时间线事件
    for (let idx = 0; idx < EVENTS.length; idx++) {
        const eventDef = EVENTS[idx];
        if (eventDef.trigger_day === currentDay && !triggeredIndices.has(idx)) {
            const delay = 1; // 延迟1天生效
            const effectiveDay = currentDay + delay;
            const duration = Math.floor(Math.random() * 3) + 1; // 1~3天
            const impactValues = {};
            for (const sid of eventDef.stocks_affected) {
                impactValues[sid] = random_uniform(eventDef.impact_min, eventDef.impact_max);
            }

            const ev = {
                id: eventIdCounter++,
                event_index: idx,
                event_id: '',
                chain_id: '',
                title: eventDef.title,
                description: eventDef.description,
                trigger_day: currentDay,
                delay_days: delay,
                effective_day: effectiveDay,
                stocks_affected: JSON.stringify(eventDef.stocks_affected),
                impact_type: eventDef.impact_type,
                impact_values: JSON.stringify(impactValues),
                duration_days: duration,
                status: 'announced',
                announced_at_day: currentDay,
            };
            events.push(ev);
            triggeredIndices.add(idx);
            result.new_events.push({
                title: eventDef.title,
                description: eventDef.description,
                trigger_day: currentDay,
                effective_day: effectiveDay,
                delay: delay,
            });
        }
    }

    // 2. 每日随机事件（25%概率触发1个，约3~5天一次）
    if (Math.random() < 0.25 && RANDOM_EVENT_POOL && RANDOM_EVENT_POOL.length > 0) {
        const triggeredEventIds = new Set(events.filter(e => e.event_id).map(e => e.event_id));
        const available = RANDOM_EVENT_POOL.filter(e => !triggeredEventIds.has(e.id));
        if (available.length > 0) {
            const randEv = available[Math.floor(Math.random() * available.length)];
            const delay = Math.floor(random_uniform(1, 4));
            const effectiveDay = currentDay + delay;
            const duration = Math.floor(random_uniform(randEv.duration_days || 2, (randEv.duration_days || 3) + 1));
            const impactValues = {};
            const stocksAffected = randEv.stocks_affected || [];
            for (const sid of stocksAffected) {
                impactValues[sid] = random_uniform(randEv.impact_min, randEv.impact_max);
            }
            const randIdx = 10000 + hashStr(randEv.id);
            triggeredIndices.add(randIdx);
            const ev = {
                id: eventIdCounter++,
                event_index: randIdx,
                event_id: randEv.id,
                chain_id: '',
                title: randEv.title,
                description: randEv.description,
                trigger_day: currentDay,
                delay_days: delay,
                effective_day: effectiveDay,
                stocks_affected: JSON.stringify(stocksAffected),
                impact_type: randEv.impact_type,
                impact_values: JSON.stringify(impactValues),
                duration_days: duration,
                status: 'announced',
                announced_at_day: currentDay,
            };
            events.push(ev);
            result.new_events.push({
                title: randEv.title,
                description: randEv.description,
                trigger_day: currentDay,
                effective_day: effectiveDay,
                delay: delay,
            });
        }
    }

    // 3. 因果链 - 检查pending事件（随机选分支结局）
    const pendingChains = events.filter(e => e.status === 'pending_chain' && e.effective_day <= currentDay);
    for (const pending of pendingChains) {
        const chainDef = CAUSE_CHAINS.find(c => c.id === pending.chain_id);
        if (chainDef) {
            // 根据权重随机选择一个分支结局
            const branches = chainDef.branches || [];
            let chosenBranch = null;
            if (branches.length === 0) continue;
            if (branches.length === 1) {
                chosenBranch = branches[0];
            } else {
                const totalWeight = branches.reduce((s, b) => s + b.weight, 0);
                let roll = Math.random() * totalWeight;
                for (const b of branches) {
                    roll -= b.weight;
                    if (roll <= 0) { chosenBranch = b; break; }
                }
                if (!chosenBranch) chosenBranch = branches[branches.length - 1];
            }
            const branchDuration = chosenBranch.duration_days || Math.floor(Math.random() * 3) + 1;
            const branchImpactValues = {};
            for (const sid of (chosenBranch.stocks_affected || [])) {
                branchImpactValues[sid] = random_uniform(chosenBranch.impact_min, chosenBranch.impact_max);
            }
            const processEv = {
                id: eventIdCounter++,
                event_index: -1,
                event_id: '',
                chain_id: chainDef.id,
                title: chosenBranch.title,
                description: chosenBranch.desc,
                trigger_day: currentDay,
                delay_days: 0,
                effective_day: currentDay,
                stocks_affected: JSON.stringify(chosenBranch.stocks_affected || []),
                impact_type: chosenBranch.impact_type,
                impact_values: JSON.stringify(branchImpactValues),
                duration_days: branchDuration,
                status: 'announced',
                announced_at_day: currentDay,
            };
            events.push(processEv);
            pending.status = 'chain_done';
            result.new_events.push({
                title: chosenBranch.title,
                description: chosenBranch.desc,
                trigger_day: currentDay,
                effective_day: currentDay,
                delay: 0,
            });
        }
    }

    // 4. 随机触发因果链起因 (10%概率)
    if (Math.random() < 0.10) {
        const triggeredChainIds = new Set(events.filter(e => e.chain_id).map(e => e.chain_id));
        const availableChains = CAUSE_CHAINS.filter(c => !triggeredChainIds.has(c.id));
        if (availableChains.length > 0) {
            const chain = availableChains[Math.floor(Math.random() * availableChains.length)];
            const delayAfter = Math.floor(random_uniform(chain.delay_min, chain.delay_max + 1));
            const effectiveDay = currentDay + delayAfter;

            // 起因事件
            const causeDuration = Math.floor(Math.random() * 3) + 1;
            const causeImpact = {};
            for (const sid of chain.stocks_affected_cause) {
                causeImpact[sid] = random_uniform(chain.impact_min_cause, chain.impact_max_cause);
            }
            const causeEv = {
                id: eventIdCounter++,
                event_index: -1,
                event_id: '',
                chain_id: chain.id,
                title: chain.title_cause,
                description: chain.desc_cause,
                trigger_day: currentDay,
                delay_days: 0,
                effective_day: currentDay,
                stocks_affected: JSON.stringify(chain.stocks_affected_cause),
                impact_type: chain.impact_cause,
                impact_values: JSON.stringify(causeImpact),
                duration_days: causeDuration,
                status: 'announced',
                announced_at_day: currentDay,
            };
            events.push(causeEv);

            // 待触发经过（分支结局在触发时随机决定）
            const pendingEv = {
                id: eventIdCounter++,
                event_index: -1,
                event_id: '',
                chain_id: chain.id,
                title: '【待触发】' + chain.title_cause,
                description: '因果链后续事件将在第' + effectiveDay + '天揭晓……',
                trigger_day: currentDay,
                delay_days: 0,
                effective_day: effectiveDay,
                stocks_affected: JSON.stringify([]),
                impact_type: 'mixed',
                impact_values: JSON.stringify({}),
                duration_days: 0,
                status: 'pending_chain',
                announced_at_day: currentDay,
            };
            events.push(pendingEv);

            result.new_events.push({
                title: chain.title_cause,
                description: chain.desc_cause,
                trigger_day: currentDay,
                effective_day: currentDay,
                delay: 0,
            });
        }
    }

    // 5. 激活到达生效日的事件
    for (const ev of events) {
        if (ev.status === 'announced' && ev.effective_day <= currentDay) {
            ev.status = 'active';
            result.activated_events.push(ev);
        }
    }

    // 6. 标记过期事件
    for (const ev of events) {
        if (ev.status === 'active' && ev.effective_day + ev.duration_days <= currentDay) {
            ev.status = 'expired';
        }
    }

    // 7. 获取当前活跃事件
    const activeEvents = events.filter(e =>
        e.effective_day <= currentDay &&
        e.effective_day + e.duration_days > currentDay &&
        e.status === 'active'
    );

    // 8. 计算新价格和K线
    const prices = loadJSON(LS_KEYS.prices, {});
    const kline = loadJSON(LS_KEYS.kline, {});

    for (const sid of STOCK_ORDER) {
        const prevClose = prices[sid] ? prices[sid].current : STOCKS[sid].init_price;
        const dailyChange = calculateDailyChange(sid, activeEvents, currentDay);
        const ohlc = generateOHLC(prevClose, dailyChange);

        // K线
        if (!kline[sid]) kline[sid] = [];
        kline[sid].push({
            day: currentDay,
            open: ohlc.open,
            high: ohlc.high,
            low: ohlc.low,
            close: ohlc.close,
            volume: ohlc.volume,
        });

        // 价格更新
        if (!prices[sid]) prices[sid] = { current: ohlc.close, prev: ohlc.close };
        prices[sid].prev = prices[sid].current;
        prices[sid].current = ohlc.close;

        result.prices[sid] = ohlc;
    }

    // 8. 检查强制平仓
    let holdings = loadJSON(LS_KEYS.holdings, {});
    let cash = parseFloat(localStorage.getItem(LS_KEYS.cash) || '1000');

    for (const [stockId, h] of Object.entries(holdings)) {
        if (h.leverage <= 1) continue; // 无杠杆不检查
        const currentPrice = prices[stockId] ? prices[stockId].current : 0;
        if (currentPrice <= 0) continue;

        const quantity = h.quantity;
        const margin = h.margin;
        const borrowed = quantity * h.avg_price - margin;

        if (currentPrice * quantity < borrowed * 1.2) {
            const sellAmount = currentPrice * quantity - borrowed;
            cash = Math.max(0, cash + sellAmount);

            // 记录交易
            const txns = loadJSON(LS_KEYS.transactions, []);
            txns.push({
                stock_id: stockId,
                type: 'sell',
                quantity: quantity,
                price: currentPrice,
                leverage: h.leverage,
                total_amount: sellAmount,
                day: currentDay,
                timestamp: new Date().toISOString(),
            });
            saveJSON(LS_KEYS.transactions, txns);

            delete holdings[stockId];
            result.liquidated.push({
                stock_id: stockId,
                quantity: quantity,
                price: currentPrice,
                amount: sellAmount,
            });
        }
    }

    // 9. 保存状态
    localStorage.setItem(LS_KEYS.cash, cash.toString());
    localStorage.setItem(LS_KEYS.day, currentDay.toString());
    localStorage.setItem(LS_KEYS.running, 'true');
    saveJSON(LS_KEYS.prices, prices);
    saveJSON(LS_KEYS.holdings, holdings);
    saveJSON(LS_KEYS.kline, kline);
    saveJSON(LS_KEYS.events, events);

    // 寒暑假检测
    let breakNotice = null;
    if (BREAK_NAMES[currentDay]) {
        breakNotice = BREAK_NAMES[currentDay];
        localStorage.setItem(LS_KEYS.running, 'false');
    }

    result.break_notice = breakNotice;
    result.cash = cash;
    result.prices_simple = {};
    for (const [sid, p] of Object.entries(prices)) {
        result.prices_simple[sid] = p.current;
    }
    result.active_event_count = activeEvents.length;

    // 新闻
    result.news = getNewsForUI();

    return result;
}

// ============ 交易操作 ============
function executeBuy(stockId, quantity, leverage) {
    if (!LEVERAGE_OPTIONS.includes(leverage)) {
        return { success: false, message: "无效的杠杆倍数，可选：1x, 2x, 3x, 5x" };
    }
    if (quantity <= 0) {
        return { success: false, message: "购买数量必须大于0" };
    }
    if (!STOCKS[stockId]) {
        return { success: false, message: "股票不存在" };
    }

    const prices = loadJSON(LS_KEYS.prices, {});
    const price = prices[stockId] ? prices[stockId].current : STOCKS[stockId].init_price;
    let cash = parseFloat(localStorage.getItem(LS_KEYS.cash) || '1000');
    let holdings = loadJSON(LS_KEYS.holdings, {});
    const currentDay = parseInt(localStorage.getItem(LS_KEYS.day) || '0');

    const totalValue = price * quantity;
    const margin = totalValue / leverage;

    if (cash < margin) {
        return { success: false, message: `保证金不足！需要 ${margin.toFixed(1)} 点，当前现金 ${cash.toFixed(1)} 点` };
    }

    cash -= margin;

    if (holdings[stockId]) {
        const h = holdings[stockId];
        const newQty = h.quantity + quantity;
        const newAvgPrice = (h.avg_price * h.quantity + price * quantity) / newQty;
        const newMargin = h.margin + margin;
        const newLeverage = (h.leverage * h.margin + leverage * margin) / newMargin;
        holdings[stockId] = {
            quantity: newQty,
            avg_price: newAvgPrice,
            leverage: newLeverage,
            margin: newMargin,
        };
    } else {
        holdings[stockId] = {
            quantity: quantity,
            avg_price: price,
            leverage: leverage,
            margin: margin,
        };
    }

    const txns = loadJSON(LS_KEYS.transactions, []);
    txns.push({
        stock_id: stockId,
        type: 'buy',
        quantity: quantity,
        price: price,
        leverage: leverage,
        total_amount: margin,
        day: currentDay,
        timestamp: new Date().toISOString(),
    });

    localStorage.setItem(LS_KEYS.cash, cash.toString());
    saveJSON(LS_KEYS.holdings, holdings);
    saveJSON(LS_KEYS.transactions, txns);

    return {
        success: true,
        message: `成功买入 ${quantity} 股 ${STOCKS[stockId].name}，保证金 ${margin.toFixed(1)} 点`,
        transaction: {
            stock_id: stockId,
            stock_name: STOCKS[stockId].name,
            quantity: quantity,
            price: price,
            leverage: leverage,
            margin: margin,
            cash_left: cash,
        }
    };
}

function executeSell(stockId, quantity) {
    if (quantity <= 0) {
        return { success: false, message: "卖出数量必须大于0" };
    }
    if (!STOCKS[stockId]) {
        return { success: false, message: "股票不存在" };
    }

    let holdings = loadJSON(LS_KEYS.holdings, {});
    const h = holdings[stockId];
    if (!h) {
        return { success: false, message: "你没有持有该股票" };
    }
    if (h.quantity < quantity) {
        return { success: false, message: `持仓不足！持有 ${h.quantity} 股` };
    }

    const prices = loadJSON(LS_KEYS.prices, {});
    const price = prices[stockId] ? prices[stockId].current : STOCKS[stockId].init_price;
    let cash = parseFloat(localStorage.getItem(LS_KEYS.cash) || '1000');
    const currentDay = parseInt(localStorage.getItem(LS_KEYS.day) || '0');

    const sellRatio = quantity / h.quantity;
    const sellMargin = h.margin * sellRatio;
    const totalSale = price * quantity;
    const borrowed = h.avg_price * quantity - sellMargin;
    const cashBack = totalSale - borrowed;
    const profit = cashBack - sellMargin;

    cash += cashBack;
    const remainingQty = h.quantity - quantity;

    if (remainingQty <= 0) {
        delete holdings[stockId];
    } else {
        holdings[stockId].quantity = remainingQty;
        holdings[stockId].margin = h.margin - sellMargin;
    }

    const txns = loadJSON(LS_KEYS.transactions, []);
    txns.push({
        stock_id: stockId,
        type: 'sell',
        quantity: quantity,
        price: price,
        leverage: h.leverage,
        total_amount: cashBack,
        day: currentDay,
        timestamp: new Date().toISOString(),
    });

    localStorage.setItem(LS_KEYS.cash, cash.toString());
    saveJSON(LS_KEYS.holdings, holdings);
    saveJSON(LS_KEYS.transactions, txns);

    return {
        success: true,
        message: `成功卖出 ${quantity} 股 ${STOCKS[stockId].name}，${profit >= 0 ? '盈利' : '亏损'} ${Math.abs(profit).toFixed(1)} 点`,
        transaction: {
            stock_id: stockId,
            stock_name: STOCKS[stockId].name,
            quantity: quantity,
            price: price,
            leverage: h.leverage,
            cash_back: cashBack,
            profit: profit,
            cash_left: cash,
        }
    };
}

// ============ 新闻 ============
function getNewsForUI() {
    const events = loadJSON(LS_KEYS.events, []);
    const news = [];
    for (const e of events) {
        if (e.status === 'expired' || e.status === 'chain_done' || e.status === 'pending_chain') continue;
        const statusMap = { announced: '📢 已发布', active: '🔥 生效中' };
        news.push({
            title: e.title,
            description: e.description,
            status: e.status,
            status_label: statusMap[e.status] || e.status,
            trigger_day: e.trigger_day,
        });
    }
    // 最新在前
    news.sort((a, b) => b.trigger_day - a.trigger_day);
    return news.slice(0, 20);
}

// ============ 答题 ============
function submitQuiz(answers) {
    let correct = 0;
    for (const q of QUIZ_QUESTIONS) {
        if (answers[q.id] === q.answer) correct++;
    }

    const record = loadJSON(LS_KEYS.quiz, { score: 0, best_score: 0, total_attempts: 0 });
    record.total_attempts++;

    let cashReward = 0;
    let isNewBest = false;
    let message = '';

    if (record.total_attempts === 1) {
        // 首次答题
        cashReward = correct * 5;
        record.best_score = correct;
        record.score = correct;
        isNewBest = true;
        message = `首次答题！答对 ${correct}/28，获得 ${cashReward} 点资金奖励！`;
    } else if (correct > record.best_score) {
        cashReward = (correct - record.best_score) * 5;
        record.best_score = correct;
        record.score = correct;
        isNewBest = true;
        message = `恭喜刷新最高分！答对 ${correct}/28，新增奖励 ${cashReward} 点资金！`;
    } else {
        record.score = correct;
        message = `答对 ${correct}/28，未超过历史最高 ${record.best_score}/28，无额外奖励。继续加油！`;
    }

    let cash = parseFloat(localStorage.getItem(LS_KEYS.cash) || '1000');
    cash += cashReward;
    localStorage.setItem(LS_KEYS.cash, cash.toString());
    saveJSON(LS_KEYS.quiz, record);

    return {
        success: true,
        score: correct,
        best_score: record.best_score,
        total_attempts: record.total_attempts,
        cash_reward: cashReward,
        new_cash: cash,
        is_new_best: isNewBest,
        message: message,
    };
}
