/* BSTVC English Homepage V1 — language layer and English-only download wiring */
(() => {
  "use strict";

  const exact = new Map([
    ["BSTVC｜时空可解释分析工具", "BSTVC | Spatiotemporal Interpretability Analysis Tool"],
    ["网页顶部", "PAGE TOP"],
    ["时空可解释", "SPATIOTEMPORAL INTERPRETABILITY"],
    ["方法范式", "Paradigm"],
    ["方法优势", "Advantages"],
    ["实证流程", "Workflow"],
    ["结果解读", "Outputs"],
    ["研究应用", "Applications"],
    ["辅助工具", "Auxiliary Tool"],
    ["免费下载", "Free Download"],
    ["把时空异质性，", "Turn spatiotemporal heterogeneity"],
    ["转化为可解释的证据。", "into interpretable evidence."],
    ["普通全局回归常以单一系数概括所有地点与时期，黑箱 GeoAI 则多在预测之后附加近似解释。BSTVC（贝叶斯时空变系数）把局部系数、不确定性、关键驱动与动态预测统一在贝叶斯白盒模型中，直接回答影响机制何时、何地、为何不同。", "Conventional global regression often summarizes all places and periods with a single coefficient, while black-box GeoAI usually adds approximate explanations after prediction. BSTVC (Bayesian Spatiotemporally Varying Coefficients) unifies local effects, uncertainty, key-driver identification, and dynamic prediction in an interpretable Bayesian framework—revealing when, where, and why relationships vary."],
    ["探索方法体系", "Explore the Framework"],
    ["下载中文桌面版", "Download English Desktop"],
    ["无需编程", "NO CODE"],
    ["可复现", "REPRODUCIBLE"],
    ["贝叶斯白盒", "BAYESIAN WHITE BOX"],
    ["全球首个时空可解释分析开源工具。", "The first open-source tool for spatiotemporal interpretability analysis."],
    ["目标变量", "RESPONSE TYPES"],
    ["连续 · 二分类 · 计数", "CONTINUOUS · BINARY · COUNT"],
    ["贝叶斯可信区间", "BAYESIAN CREDIBLE INTERVALS"],
    ["不确定性进入解释", "UNCERTAINTY-INFORMED INTERPRETATION"],
    ["官方研究案例", "EMPIRICAL STUDIES"],
    ["2018—至今 · 健康与医学地理学", "2018–PRESENT · HEALTH & MEDICAL GEOGRAPHY"],
    ["文件上传上限", "UPLOAD LIMIT"],
    ["适配大型面板与地图", "LARGE PANELS AND MAPS"],

    ["解释性，不止是", "Interpretability is more than"],
    ["一个重要性排序。", "an importance ranking."],
    ["全局回归用同一个系数描述所有地点与时期，可能形成“平稳性偏差”。BSTVC 让变量关系回到真实地理情境，并同时给出作用强度、方向与不确定性。", "A global regression uses one coefficient for every place and period, creating a potential stationarity bias. BSTVC returns relationships to their geographic context while quantifying effect magnitude, direction, and uncertainty."],
    ["同一因素为何在不同地点和时期产生不同影响？", "Why does the same factor have different effects across places and periods?"],
    ["进入 GeoAI 范式", "Explore the GeoAI Paradigm"],
    ["全局平稳假设", "Global Stationarity Assumption"],
    ["单一系数隐含全部地点与时期关系相同，可能掩盖局部健康—环境机制。", "A single coefficient assumes the same relationship everywhere and at all times, potentially obscuring local health–environment mechanisms."],
    ["时空非平稳关系", "Spatiotemporally Nonstationary Relationships"],
    ["同时识别空间异质性和时间异质性，保留局部关系的地理意义。", "Identify spatial and temporal heterogeneity simultaneously while preserving the geographic meaning of local relationships."],
    ["证据化解释", "Evidence-Based Interpretation"],
    ["以可信区间、模型评价与 STVPI 回答“作用多大、证据多稳、谁更关键”。", "Use credible intervals, model assessment, and STVPI to show effect magnitude, evidential stability, and the most important drivers."],

    ["从局部机制，到全局归因，", "From local mechanisms to global attribution,"],
    ["再到动态预测。", "then to dynamic prediction."],
    ["局部时空可解释性", "Local Spatiotemporal Interpretability"],
    ["利用 STVC / STIVC 分析影响因素在不同地点与时期的作用方向、强度和不确定性，回答“在哪里、何时、怎样影响”。", "Use STVC/STIVC to estimate the direction, magnitude, and uncertainty of covariate effects across places and periods—showing where, when, and how an effect operates."],
    ["TCs · SCs · 50/95% 可信区间", "TCs · SCs · 50/95% CREDIBLE INTERVALS"],
    ["全局时空可解释性", "Global Spatiotemporal Interpretability"],
    ["利用 STVPI 量化解释因素的相对时空贡献，识别关键驱动因素及空间、时间变异来源。", "Use STVPI to quantify each factor’s relative spatiotemporal contribution and identify key drivers and their spatial and temporal sources of variation."],
    ["STVPI · 相对贡献 · 时空归因", "STVPI · RELATIVE CONTRIBUTION · ATTRIBUTION"],
    ["时空动态预测", "Dynamic Spatiotemporal Prediction"],
    ["通过 STVI / STIVI 等模型开展缺失值填补、时空平滑与未来预测，构建连续可靠的时空数据。", "Use STVI/STIVI and related models for missing-value imputation, spatiotemporal smoothing, and forecasting to construct continuous, reliable spatiotemporal data."],
    ["预测 · 插补 · 时空平滑", "PREDICTION · IMPUTATION · SMOOTHING"],

    ["两条地理定律，", "Two geographic laws."],
    ["一个白盒解释框架。", "One white-box framework."],
    ["从“模型为什么这样预测”继续追问：这种关系发生在哪里、何时变化、证据有多稳定。", "Go beyond asking why a model predicted an outcome: determine where the relationship occurs, when it changes, and how stable the evidence is."],
    ["空间自相关", "Spatial Autocorrelation"],
    ["邻近事物往往具有更强联系。BSTVC 在数据、过程与参数层级中表达空间或时空相关结构。", "Nearby entities tend to be more closely related. BSTVC represents spatial or spatiotemporal dependence across data, process, and parameter levels."],
    ["空间异质性", "Spatial Heterogeneity"],
    ["研究现象及变量关系在不同地点并不相同。局部系数直接刻画这种空间和时空非平稳性。", "Phenomena and variable relationships differ across places. Local coefficients directly characterize this spatial and spatiotemporal nonstationarity."],
    ["结构内生解释", "Intrinsic Structural Interpretation"],
    ["时空自相关", "Spatiotemporal Autocorrelation"],
    ["关系异质性", "Relationship Heterogeneity"],
    ["局部作用机制", "Local Effect Mechanisms"],
    ["相对贡献归因", "Relative-Contribution Attribution"],
    ["先验可解释", "ANTE-HOC INTERPRETABILITY"],
    ["严格定义：", "Definition:"],
    ["解释变量、效应结构与证据输出在模型拟合前即被明确规定；解释直接来自模型参数及其后验分布，而非训练后的外部近似。", "Explanatory variables, effect structures, and evidence outputs are specified before model fitting. Interpretation follows directly from model parameters and their posterior distributions, not from an external approximation added after training."],
    ["观测数据 Y → 模型结构 Xβ(s,t) → 后验统计证据", "Observed data Y → model structure Xβ(s,t) → posterior evidence"],
    ["解释直接来自模型结构与参数，而不是训练完成后附加的外部近似。", "Interpretation comes directly from model structure and parameters, rather than an external approximation added after training."],
    ["模型结构本身就是解释", "The Model Structure Is the Explanation"],
    ["回归系数、可信区间和方差分割直接来自贝叶斯白盒模型；机制与预测位于同一统计框架。", "Regression coefficients, credible intervals, and variance partitioning all arise directly from the Bayesian white-box model; mechanisms and predictions share the same statistical framework."],
    ["BSTVC 核心范式", "BSTVC CORE PARADIGM"],
    ["事后解释", "POST-HOC EXPLANATION"],
    ["借助外部工具解释黑箱", "Explaining a Black Box with External Tools"],
    ["解释发生在模型训练之后，通常是模型行为的近似描述，不等同于统计结构中的内生机制。", "The explanation is produced after training and usually approximates model behavior; it is not equivalent to a mechanism intrinsic to the statistical structure."],
    ["外部解释工具", "EXTERNAL EXPLANATION TOOL"],
    ["三大研究任务", "Three Research Tasks"],
    ["解释性模型图谱", "Interpretability Landscape"],
    ["BSTVC 白盒框架", "BSTVC White-Box Framework"],
    ["从局部机制、全局归因到时空动态预测", "From Local Mechanisms and Global Attribution to Dynamic Prediction"],
    ["BSTVC 将三类研究任务组织为连续证据链：先读取影响因素在哪里、何时、怎样作用，再比较关键驱动的相对贡献，最后在同一贝叶斯框架中完成插补、平滑与预测。", "BSTVC organizes three research tasks into a continuous evidence chain: determine where, when, and how factors operate; compare the relative contributions of key drivers; then perform imputation, smoothing, and prediction within the same Bayesian framework."],
    ["定位每个地点与时期的作用方向、强度和不确定性。", "Locate effect direction, magnitude, and uncertainty for every place and period."],
    ["比较候选因素贡献，识别关键驱动及其时间—空间来源。", "Compare candidate-factor contributions and identify key drivers and their temporal–spatial sources."],
    ["在统一后验框架中完成缺失值插补、平滑与未来预测。", "Perform missing-value imputation, smoothing, and forecasting in one posterior framework."],
    ["全局重要性与局部解释同时进入研究设计", "Integrate Global Importance and Local Interpretation in the Study Design"],
    ["可解释性既包括总体层面的关键因素识别，也包括个体、地点与时间切片上的局部机制。BSTVC 把局部解释扩展为 β(s,t)，并继续连接全局归因与动态预测。", "Interpretability includes both population-level key-driver identification and local mechanisms for individuals, places, and time slices. BSTVC extends local interpretation to β(s,t) and connects it to global attribution and dynamic prediction."],
    ["谁在总体上更重要？", "Which factors matter most overall?"],
    ["何地、何时、怎样影响？", "Where, when, and how do effects vary?"],
    ["从数据层到参数层，解释机制内生于模型", "Interpretation Is Intrinsic from the Data Level to the Parameter Level"],
    ["BSTVC 在完整统一的贝叶斯层次框架中组织观测数据、时空过程、局部参数与后验不确定性；预测、系数和贡献度来自同一统计结构。", "BSTVC organizes observed data, spatiotemporal processes, local parameters, and posterior uncertainty in a unified Bayesian hierarchical framework; predictions, coefficients, and contributions arise from the same statistical structure."],
    ["所有局部单元在同一模型中拟合", "ALL LOCAL UNITS FIT IN ONE MODEL"],
    ["观测、解释变量与空间关系", "Observations, covariates, and spatial relationships"],
    ["时间、空间与时空交互过程", "Temporal, spatial, and space–time interaction processes"],
    ["局部参数与可信区间", "Local parameters and credible intervals"],
    ["解释、归因与预测", "Interpretation, attribution, and prediction"],

    ["一套体系，覆盖解释与预测。", "One System for Interpretation and Prediction."],
    ["从截距到系数、从独立变化到时空交互、从空间截面到时空面板，研究问题决定模型尺度。", "From intercepts to coefficients, independent variation to space–time interactions, and spatial cross-sections to spatiotemporal panels—the research question determines the model scale."],
    ["时空变截距", "Spatiotemporally Varying Intercept"],
    ["刻画目标变量自身的时空演变，用于缺失值填补、时空平滑与动态预测。", "Characterizes the response variable’s spatiotemporal evolution for missing-value imputation, smoothing, and dynamic prediction."],
    ["时空交互变截距", "Spatiotemporally Interacting Varying Intercept"],
    ["在变截距结构中加入时空交互，表达空间与时间耦合的动态变化。", "Adds space–time interaction to a varying-intercept structure to represent coupled spatial and temporal dynamics."],
    ["时空变系数", "Spatiotemporally Varying Coefficients"],
    ["拟合解释变量的局部时空系数，识别变量关系的时间与空间非平稳性。", "Fits local spatiotemporal coefficients for explanatory variables to identify temporal and spatial nonstationarity in their relationships."],
    ["时空交互变系数", "Spatiotemporally Interacting Varying Coefficients"],
    ["从时空交互假设出发，揭示更复杂的局部影响机制与演变模式。", "Uses a space–time interaction assumption to reveal more complex local effect mechanisms and evolutionary patterns."],
    ["贝叶斯空间变系数", "Bayesian Spatially Varying Coefficients"],
    ["面向单一时点或空间截面数据，识别空间异质性关系与局部驱动模式。", "Identifies spatially heterogeneous relationships and local driving patterns in single-time-point or spatial cross-sectional data."],
    ["时空方差分割指标", "Spatiotemporal Variance Partitioning Index"],
    ["把模型结果转化为相对贡献百分比，识别关键因素及其时间、空间来源。", "Transforms model results into relative contribution percentages to identify key factors and their temporal and spatial sources."],
    ["时空独立非平稳假设", "Space–Time Independent Nonstationarity"],
    ["同时量化 Y 与多个 X 之间的空间和时间异质关联，并纳入空间、时间自相关；适合解析结构化时空非平稳性。", "Simultaneously quantifies spatially and temporally heterogeneous associations between Y and multiple X variables while incorporating spatial and temporal autocorrelation."],
    ["时空交互非平稳假设", "Space–Time Interaction Nonstationarity"],
    ["通过空间分层异质性 SSH 或时间分层异质性 TSH 定义交互随机效应，适配县—省、日—月等两层耦合数据，并控制模型复杂度。", "Defines interaction random effects through spatial stratified heterogeneity (SSH) or temporal stratified heterogeneity (TSH), supporting two-level coupled data such as county–province or day–month structures while controlling model complexity."],
    ["时空相对重要性", "Relative Spatiotemporal Importance"],
    ["以方差分割把异质影响转化为可解释百分比，既可筛选关键因素，也可区分时间与空间贡献来源。", "Uses variance partitioning to express heterogeneous effects as interpretable percentages, screening key factors while distinguishing temporal and spatial sources of contribution."],

    ["BSTVC 的方法优势：可比较、可量化、可复现。", "BSTVC Advantages: Comparable, Quantifiable, Reproducible."],
    ["优势不只来自局部回归，而来自“全地图”统一建模、贝叶斯不确定性和完整结果链的组合。", "Its advantages arise not only from local regression, but from the combination of unified full-map modeling, Bayesian uncertainty, and a complete evidence chain."],
    ["“全地图”统一建模", "Unified Full-Map Modeling"],
    ["在一个完整的贝叶斯层次框架中拟合全部局部参数，避免把每个地图单元拆成互不关联的小模型。", "Fits all local parameters in one complete Bayesian hierarchical framework rather than separating map units into unrelated small models."],
    ["局部系数直接可比", "Directly Comparable Local Coefficients"],
    ["统一的数据层、过程层与参数层，使不同地点和时期的回归系数具有一致的统计口径。", "Unified data, process, and parameter levels make regression coefficients statistically comparable across places and periods."],
    ["不确定性显式表达", "Explicit Uncertainty Quantification"],
    ["局部预测、TCs 与 SCs 均可输出 50% 窄可信区间和 95% 宽可信区间。", "Local predictions, TCs, and SCs include 50% inner and 95% outer credible intervals."],
    ["局部—全局解释闭环", "Integrated Local–Global Interpretation"],
    ["从局部系数识别时空非平稳效应，再以 STVPI 比较因素的相对贡献百分比。", "Identify nonstationary spatiotemporal effects from local coefficients, then compare factor contributions using STVPI."],
    ["三类目标变量", "Three Response Types"],
    ["统一支持连续型（log-Gaussian）、二分类（logistic）与计数型（Poisson）响应。", "Supports continuous (log-Gaussian), binary (logistic), and count (Poisson) responses within one system."],
    ["零代码桌面工作流", "No-Code Desktop Workflow"],
    ["把数据转换、字段检查、空间顺序对齐、模型运行、结果下载和可视化说明连接起来。", "Connects data conversion, field checks, spatial-order alignment, model fitting, result export, and visualization guidance."],
    ["异质影响机制", "Heterogeneous Effect Mechanisms"],
    ["关键驱动识别", "Key-Driver Identification"],
    ["分析影响因素 → 识别关键驱动 → 动态预测", "Analyze Factors → Identify Key Drivers → Predict Dynamically"],
    ["从局部机制解释到全局关键驱动识别，再到动态预测，BSTVC 以一套连贯的方法体系贯通研究问题、统计证据与决策表达，让复杂时空分析更清晰、更可信、更易复现。", "From local mechanism interpretation and global key-driver identification to dynamic prediction, BSTVC connects research questions, statistical evidence, and decision-ready communication in one coherent methodology."],

    ["真实案例驱动的桌面建模流程。", "A Desktop Workflow Driven by Real Cases."],
    ["每种响应类型均使用用户手册中的真实软件界面。先完成数据读取与验证，再进行空间顺序检查、参数配置、运行与结果导出。", "Each response type is demonstrated with a real software interface. Import and validate data first, then check spatial order, configure parameters, run the model, and export results."],
    ["似然函数与链接函数应由响应变量的取值范围、分布特征和数据生成机制决定，而不是由研究者主观偏好选择。", "Choose the likelihood and link function from the response range, distributional properties, and data-generating mechanism—not researcher preference."],
    ["数据输入", "Data Input"],
    ["表格 + 完整地图", "Table + Complete Map"],
    ["检查对齐", "Validate Alignment"],
    ["字段 + 空间顺序", "Fields + Spatial Order"],
    ["参数设置", "Configure Parameters"],
    ["模型运行", "Run Models"],
    ["结果导出", "Export Results"],
    ["6 类 Excel 输出", "Six Excel Output Types"],
    ["连续型", "Continuous"],
    ["二分类", "Binary"],
    ["计数型", "Count"],
    ["放大预览", "Enlarge Preview"],
    ["真实界面截图 · 来源：BSTVC Desktop User Guide", "Real interface screenshot · Source: BSTVC Desktop User Guide"],
    ["全球健康调整寿命（HALE）", "Global Health-Adjusted Life Expectancy (HALE)"],
    ["2000—2020 · 177 个国家和地区", "2000–2020 · 177 COUNTRIES AND TERRITORIES"],
    ["适用问题", "SUITABLE FOR"],
    ["适合研究寿命、资源数量、浓度、率值等连续指标为何随地点与时期变化。", "Explaining why continuous indicators—such as life expectancy, resource quantities, concentrations, and rates—vary across places and periods."],
    ["COVID-19 是否发病 / 风险状态", "COVID-19 Occurrence / Risk Status"],
    ["月度时空面板 · 0/1 目标变量", "MONTHLY SPATIOTEMPORAL PANEL · 0/1 RESPONSE"],
    ["适合研究是否发病、是否达标或风险状态等 0/1 事件的时空决定因素。", "Studying spatiotemporal determinants of 0/1 events such as disease occurrence, target attainment, or risk status."],
    ["急性乙肝病例数", "Acute Hepatitis B Case Counts"],
    ["2012—2023 · 美国空间单元", "2012–2023 · U.S. SPATIAL UNITS"],
    ["适合研究病例数、事件数和设施数等非负计数结果的局部时空机制。", "Investigating local spatiotemporal mechanisms for non-negative count outcomes such as cases, events, or facilities."],
    ["查看数据与参数规范", "View Data and Parameter Specifications"],
    ["避免错误选择", "AVOID MIS-SPECIFICATION"],
    ["不要把明显偏态、过度离散的计数或只有 0/1 的结果直接当作连续变量；必要时先变换并检查分布。", "Do not treat strongly skewed or overdispersed counts, or 0/1 outcomes, as continuous variables. Transform data and inspect distributions when appropriate."],
    ["下载三类示例数据", "Download Three Example Datasets"],

    ["用真实图件读取时空证据链。", "Read the Spatiotemporal Evidence Chain through Real Figures."],
    ["不要孤立阅读一个系数。把 TCs、SCs、STVPI、局部预测、可信区间与模型评价组合起来，才能形成可解释结论。", "Do not interpret a coefficient in isolation. Combine TCs, SCs, STVPI, local predictions, credible intervals, and model assessment to build an interpretable conclusion."],
    ["SCs 空间系数", "SCs · Spatial Coefficients"],
    ["TCs 时间系数", "TCs · Temporal Coefficients"],
    ["STVPI 贡献度", "STVPI · Contributions"],
    ["局部预测", "Local Prediction"],
    ["模型总体评价", "Overall Model Assessment"],
    ["真实案例结果图 · 来源：BSTVC Desktop User Guide", "Real case result · Source: BSTVC Desktop User Guide"],
    ["把局部影响方向和强度放回地图", "Map Local Effect Direction and Magnitude"],
    ["空间回归系数按地图单元输出，可在 R、ArcGIS 或 ArcGIS Pro 中制图。对多变量地图应保持一致的分级、色带与空间范围。", "Spatial regression coefficients are exported by map unit for visualization in R, ArcGIS, ArcGIS Pro, or QGIS. Use consistent classes, color scales, and spatial extents across covariate maps."],
    ["推荐制图：ArcGIS Pro / QGIS / R sf", "RECOMMENDED: ArcGIS Pro / QGIS / R sf"],
    ["读取变量关系如何随时间改变", "Read How Relationships Change over Time"],
    ["均值曲线表示时间回归系数；深色带对应 50% 可信区间，浅色带对应 95% 可信区间。区间是否跨越 0 可辅助判断作用方向与证据稳定性。", "The mean curve represents the temporal regression coefficient; the darker band is the 50% credible interval and the lighter band is the 95% credible interval. Whether an interval crosses zero helps assess effect direction and evidential stability."],
    ["从绝对排序转向相对贡献百分比", "Move from Absolute Ranking to Relative Contributions"],
    ["STVPI 不仅比较总体贡献，还可区分时间与空间维度的贡献来源；同时保留贝叶斯不确定性，用于识别关键驱动因素。", "STVPI compares overall contributions and separates their temporal and spatial sources while retaining Bayesian uncertainty for key-driver identification."],
    ["同时交付预测值、填补值与不确定性", "Deliver Predictions, Imputations, and Uncertainty Together"],
    ["local.prediction 包含原始 y、缺失值填补后的 fill_y、模型预测 predict_y，以及 50% / 95% 可信区间；可进一步计算 R²、RMSE 或其他响应类型指标。", "local.prediction contains observed y, imputed fill_y, model-based predict_y, and 50%/95% credible intervals, enabling R², RMSE, and response-specific performance metrics."],
    ["二分类结果关注区分能力", "Evaluate Discrimination for Binary Outcomes"],
    ["ROC 曲线动态展示灵敏度与误报率之间的权衡，AUC 越大通常表示区分能力越强；同时应结合局部概率地图与不确定性阅读。", "The ROC curve shows the trade-off between sensitivity and false-positive rate. A larger AUC generally indicates stronger discrimination and should be interpreted with local probability maps and uncertainty."],
    ["综合判断模型拟合度、复杂度与预测精度", "Assess Fit, Complexity, and Predictive Accuracy Together"],
    ["模型拟合度", "Model Fit"],
    ["模型复杂度", "Model Complexity"],
    ["预测能力", "Predictive Performance"],
    ["局部关系", "Local Relationships"],
    ["方向 + 量级 + CrI", "DIRECTION + MAGNITUDE + CrI"],

    ["方法与应用的研究证据链。", "A Research Evidence Chain from Methods to Applications."],
    ["从方法提出到健康、社会与环境场景验证，代表性成果持续检验并扩展 BSTVC 系列模型的解释能力与应用边界。", "From methodological development to validation in health, social, and environmental settings, representative studies continue to test and extend the interpretive capabilities and application boundaries of the BSTVC model family."],
    ["查看完整模型主页", "View the Complete Model Homepage"],
    ["查看代表性 DOI", "View Representative DOIs"],
    ["复制 DOI", "Copy DOI"],
    ["十二项研究案例，连接真实世界问题。", "Twelve Research Cases Connected to Real-World Questions."],
    ["2018—至今", "2018–PRESENT"],
    ["手足口病与气候因素", "Hand, Foot, and Mouth Disease and Climate"],
    ["在四川 36 个月数据中将流行病学 OR 空间化，识别疾病—气候关系的局部季节趋势与空间热点。", "Spatialized epidemiological odds ratios across 36 months in Sichuan to identify local seasonal trends and hotspots in disease–climate relationships."],
    ["东北医疗资源与社会经济", "Healthcare Resources and Socioeconomic Conditions in Northeast China"],
    ["以十年县域数据验证通用 STVC 公式范式，比较医疗资源与社会经济条件的局部时空关系。", "Validated the general STVC formulation with ten years of county data and compared local spatiotemporal relationships between healthcare resources and socioeconomic conditions."],
    ["西南县域医院床位", "County-Level Hospital Beds in Southwest China"],
    ["揭示环境与社会经济因素对医疗资源不平等的局部影响，并形成连续县域医院床位地图序列。", "Revealed local environmental and socioeconomic effects on healthcare-resource inequality and produced a continuous county-level map series of hospital beds."],
    ["城市旅游多源驱动", "Multisource Drivers of Urban Tourism"],
    ["基于 343 个城市、30 个候选因素和 2008—2017 年数据，对比全局平稳与局部时空非平稳关系。", "Compared globally stationary and locally nonstationary relationships using 30 candidate factors across 343 cities from 2008 to 2017."],
    ["COVID-19 风险感知", "COVID-19 Risk Perception"],
    ["面向 366 个中国城市估计区域公众风险感知指数 PRPI，并开展聚类与异常值识别。", "Estimated the regional public risk perception index (PRPI) across 366 Chinese cities and performed cluster and outlier analysis."],
    ["全球人口老龄化归因", "Attribution of Global Population Ageing"],
    ["在 189 个国家和地区的二十年数据中，以 STVC 识别局部关联、以 STVPI 筛选关键驱动因素。", "Used STVC to identify local associations and STVPI to screen key drivers across 189 countries and territories over two decades."],
    ["中国县域医疗资源评估", "County-Level Healthcare Resources in China"],
    ["基于 2,308 个县域医院床位面板数据，联合揭示资源不平等、热点与时空决定因素。", "Combined resource inequality, hotspot detection, and spatiotemporal determinants using a panel of hospital beds across 2,308 counties."],
    ["县域孕产妇死亡率", "County-Level Maternal Mortality"],
    ["在小区域尺度描述 MMR 的长期时空格局，并探索多层级健康决定因素的异质影响。", "Characterized long-term MMR patterns at a small-area scale and examined heterogeneous effects of multilevel health determinants."],
    ["城市多类医疗资源", "Multiple Urban Healthcare Resources"],
    ["面向中国城市多项医疗资源指标，比较资源格局与社会经济因素作用的时空差异。", "Compared spatiotemporal differences in resource patterns and socioeconomic effects across multiple urban healthcare-resource indicators in China."],
    ["医疗资源配置效率", "Healthcare Resource Allocation Efficiency"],
    ["以四川县域面板数据开展小区域医疗资源配置效率的时空评价与影响因素分析。", "Evaluated small-area spatiotemporal patterns and determinants of healthcare-resource allocation efficiency using a Sichuan county panel."],
    ["手足口病再分析", "Reanalysis of Hand, Foot, and Mouth Disease"],
    ["以新的时空可解释模型扩展手足口病局部风险与驱动机制研究。", "Extended research on local HFMD risk and driving mechanisms using a new spatiotemporally interpretable model."],
    ["孕产妇与五岁以下儿童死亡", "Maternal and Under-Five Mortality"],
    ["联合刻画 MMR 与 U5MR 的时空变化，并连接妇幼健康指标的动态预测与解释。", "Jointly characterized spatiotemporal changes in MMR and U5MR and connected dynamic prediction with interpretation of maternal and child health indicators."],
    ["左右滑动浏览案例", "SWIPE HORIZONTALLY TO BROWSE CASES"],
    ["完整方法说明、案例原始图件与持续更新，请访问 BSTVC 模型官网", "For complete methods, original case figures, and updates, visit the BSTVC model homepage"],

    ["从桌面版到 R 包，建立完整研究工作台。", "Build a Complete Research Workbench from Desktop to R."],
    ["从数据准备、9 项参数、6 类输出和当前版本边界，到 R 包安装、文档与反馈生态，使用标签页快速定位关键要求。", "Use the tabs to navigate data preparation, nine parameters, six output types, current limitations, R-package installation, documentation, and support."],
    ["数据准备", "Data Preparation"],
    ["9 项参数", "9 Parameters"],
    ["6 类输出", "6 Output Types"],
    ["边界与 Q&A", "Limitations & Q&A"],
    ["R 包与生态", "R Package & Ecosystem"],
    ["把表格与地图组织成可验证的时空面板", "Organize Tables and Maps into a Verifiable Spatiotemporal Panel"],
    ["文件", "Files"],
    ["支持 CSV、XLSX、XLS；地图需导入完整 Shapefile 文件集合，不能只提供 .shp。", "Supports CSV, XLSX, and XLS. Import the complete Shapefile set rather than a standalone .shp file."],
    ["空间顺序", "Spatial Order"],
    ["每个时间截面的空间单元顺序应与地图一致；桌面版可自动比对、重排并导出检查后数据。", "The spatial-unit order in every time slice must match the map. The desktop app can compare, reorder, and export validated data automatically."],
    ["字段", "Fields"],
    ["表格与地图的空间唯一标识字段需名称、类型一致；缺失值统一用 NA 表示。", "The table and map must use spatial identifiers with matching names and types; represent missing values consistently as NA."],
    ["内置数据转换、字段转换和自定义空间矩阵，支持宽表转长表与字段数值化。", "Built-in data conversion, field conversion, and custom spatial matrices support wide-to-long reshaping and numeric field conversion."],
    ["建模参数应与研究设计逐项对应", "Align Every Modeling Parameter with the Study Design"],
    ["数据来源", "Data Source"],
    ["空间顺序未变化选“原始数据”；完成自动重排后选“检查后数据”。", "Choose Original Data if spatial order is unchanged; choose Validated Data after automatic reordering."],
    ["变量与索引", "Variables and Indices"],
    ["指定响应变量 Y、一个或多个解释变量 X、Time 字段与 Space 字段。", "Specify response Y, one or more explanatory variables X, the Time field, and the Space field."],
    ["响应类型", "Response Type"],
    ["根据数据特征选择 continuous、binary 或 count；不同类型对应不同似然。", "Choose continuous, binary, or count according to the data; each response type uses a different likelihood."],
    ["计算设置", "Computation Settings"],
    ["建议解释变量标准化；默认线程数为 6；空间权重可用默认 QUEEN-B 或自定义矩阵。", "Standardize explanatory variables where appropriate. The default is six threads; spatial weights can use QUEEN-B or a custom matrix."],
    ["一次运行形成完整的解释证据包", "Generate a Complete Interpretive Evidence Package in One Run"],
    ["在正式研究前先理解当前版本边界", "Understand the Current Version Boundaries before Formal Analysis"],
    ["数据规模", "Data Scale"],
    ["上传上限设置为 1GB；计算量随空间单元、时间点、解释变量、响应类型和线程设置增加。", "The upload limit is 1 GB. Computational demand increases with spatial units, time points, explanatory variables, response type, and thread settings."],
    ["空间矩阵", "Spatial Matrix"],
    ["点地图建议使用距离或 k 近邻；若 k 近邻矩阵出现 INLA 报错，可调整构建方式或更换矩阵类型。", "For point maps, use distance-based or k-nearest-neighbor matrices. If a kNN matrix triggers an INLA error, adjust its construction or use another matrix type."],
    ["当前二分类与计数模型未包含残差项，因此暂不能计算整体模型的解释百分比。", "The current binary and count models do not include a residual term, so an overall explained-percentage metric is not yet available."],
    ["非平稳假设", "Nonstationarity Assumption"],
    ["当前 BSTVC 默认全部解释变量具有时空非平稳性；更灵活的变量级设定属于后续扩展方向。", "BSTVC currently assumes spatiotemporal nonstationarity for all explanatory variables; more flexible variable-level settings are planned."],
    ["桌面版、R 包、文档与模型主页协同使用", "Use the Desktop App, R Package, Documentation, and Model Homepage Together"],
    ["安装与依赖", "Installation and Dependencies"],
    ["版本与许可", "Versions and License"],
    ["文档与协作", "Documentation and Collaboration"],

    ["BSTVC Process Monitor：", "BSTVC Process Monitor:"],
    ["为线程参数找到合适的工作点。", "Find the Right Thread Setting."],
    ["BSTVC 计算通常需要更高的 CPU 与内存资源。这个面向 Windows 的本地监视器，帮助用户观察真实的 INLA 进程，并选择更快、更稳的线程设置。", "BSTVC computation can be CPU- and memory-intensive. This local Windows monitor reveals real INLA resource use and helps users select faster, more stable thread settings."],
    ["线程数越高，", "More Threads"],
    ["不一定越快。", "Are Not Always Faster."],
    ["最佳参数取决于模型结构、数据规模、内存压力、处理器拓扑、散热和电源限制。监视器记录资源轨迹，帮助你在自己的电脑或工作站上比较线程设置。", "The best setting depends on model structure, data scale, memory pressure, processor topology, thermals, and power limits. The monitor records resource trajectories so you can compare thread settings on your own computer or workstation."],
    ["下载 Windows ZIP", "Download Windows ZIP"],
    ["查看 GitHub 源码", "View GitHub Source"],
    ["BSTVC 建议起点", "BSTVC RECOMMENDED START"],
    ["先从默认 6 线程开始，再结合监视结果和相近模型进行调整。", "Start with the default six threads, then adjust using monitor results from comparable models."],
    ["实时监测", "Live Monitoring"],
    ["参数比较", "Compare Settings"],
    ["本地输出", "Local Outputs"],
    ["看见 INLA 正在怎样使用你的电脑", "See How INLA Uses Your Computer"],
    ["监视一个或多个 inla.exe，持续记录整机 CPU、内存、线程、PID、运行时长和进程状态；主 CPU 曲线采用可直接对照 Windows 任务管理器的整机口径。", "Monitor one or more inla.exe processes and continuously record system-wide CPU, memory, threads, PID, runtime, and status. The main CPU series matches the system-wide metric shown by Windows Task Manager."],
    ["CPU mean / P95 / 高于阈值比例", "CPU mean / P95 / proportion above threshold"],
    ["当前与峰值线程数、内存占用", "Current and peak thread counts and memory use"],
    ["多个进程按 PID、开始时间和运行时长区分", "Distinguish multiple processes by PID, start time, and runtime"],
    ["用相近模型比较线程参数，而不是盲目加线程", "Compare Thread Settings with Similar Models—Do Not Add Threads Blindly"],
    ["线程数越高不一定越快。结合持续 CPU 活动、内存压力、波动程度和模型求解时间，寻找适合当前电脑或工作站的平衡点；默认线程参数仍为 6。", "More threads are not always faster. Balance sustained CPU activity, memory pressure, variability, and solve time for your computer or workstation; the default remains six threads."],
    ["过去一小时或全部采集数据时间窗", "Past-hour or full-recording time windows"],
    ["综合资源表现分用于相对比较", "Composite resource score for relative comparison"],
    ["已结束进程仍保留并明确标记", "Completed processes remain visible and clearly labeled"],
    ["资源记录留在本机，方便复盘与复现", "Keep Resource Records Local for Review and Reproducibility"],
    ["监视器通过 PowerShell 和浏览器本地运行，不需要云端服务，也不会上传进程数据；每次运行可保存 CSV、JSON 与本地 HTML 报告。", "The monitor runs locally through PowerShell and a browser, requires no cloud service, and uploads no process data. Each run can save CSV, JSON, and local HTML reports."],
    ["默认目录：%LOCALAPPDATA%\\INLA-Resource-Monitor\\runs", "Default directory: %LOCALAPPDATA%\\INLA-Resource-Monitor\\runs"],
    ["可自定义输出目录、采样间隔和阈值", "Customizable output directory, sampling interval, and thresholds"],
    ["无需管理员账户，不永久修改 PowerShell 执行策略", "No administrator account or permanent PowerShell policy changes required"],
    ["推荐起点", "Recommended Start"],
    ["一般桌面建模", "Typical Desktop Modeling"],
    ["进阶比较", "Advanced Comparison"],
    ["多核心工作站", "Many-Core Workstation"],
    ["谨慎测试", "Test with Caution"],
    ["关注内存与降频", "Watch Memory and Throttling"],
    ["线程更多不等于更快，请以相近模型实测为准。", "More threads do not guarantee faster runs; test with comparable models."],
    ["建议从默认 6 线程开始。", "Start with the default six threads."],
    ["内存充足且单次任务规模较大时再尝试 8 线程；12 线程仅建议用于高核心数、高内存设备，并用监视器确认系统仍有稳定余量。", "Try eight threads only when memory is sufficient and the task is large. Reserve 12 threads for many-core, high-memory systems and confirm stable headroom with the monitor."],

    ["联系我们，", "Contact Us"],
    ["让方法与软件持续改进。", "to Improve the Methods and Software."],
    ["请根据问题类型选择联系人。反馈运行问题时，建议附上系统版本、响应类型、使用步骤、错误截图或日志，以及已脱敏的最小复现数据。", "Choose the contact that matches your question. For runtime issues, include the operating system, response type, steps to reproduce, screenshots or logs, and a de-identified minimal example."],
    ["宋超", "Chao Song"],
    ["唐先腾", "Xianteng Tang"],
    ["个人主页", "Profile"],
    ["项目负责人、统计理论指导、版权持有人。", "Project lead, statistical-methodology advisor, and copyright holder."],
    ["项目开发人，负责系统程序设计与使用支持。", "Software developer responsible for system design and user support."],
    ["开源协作", "Open-Source Collaboration"],
    ["R 包使用可通过邮件或 GitHub Issues 反馈。", "For R-package support, contact us by email or GitHub Issues."],
    ["模型主页与更新", "Model Homepage and Updates"],
    ["单击放大观看", "Click to Enlarge"],
    ["方法、工具、案例与社区", "Methods, Tools, Cases, and Community"],
    ["形成同一知识入口", "in One Knowledge Gateway"],
    ["2018—至今 / 12 studies", "2018–PRESENT / 12 STUDIES"],
    ["医学地理信息与空间卫生统计", "Medical Geography and Spatial Health Statistics"],
    ["微信扫描二维码，关注课题组公众号，获取健康地理与空间卫生统计研究动态。", "Scan the QR code in WeChat to follow the group’s official account for updates in health geography and spatial health statistics."],
    ["欢迎报告问题、提出功能需求、提交代码变更，或分享新的实证案例。", "We welcome issue reports, feature requests, code contributions, and new empirical cases."],
    ["贝叶斯时空变系数 · 时空可解释分析工具", "Bayesian Spatiotemporally Varying Coefficients · Interpretability Analysis Tool"],
    ["为自然与社会科学地理时空研究", "Interpretable Bayesian white-box models"],
    ["提供可解释的贝叶斯白盒通用模型。", "for spatiotemporal research across the natural and social sciences."],
    ["免费下载桌面版", "Download Desktop Free"],
    ["联系与反馈", "Contact and Feedback"],
    ["回到顶部", "Back to Top"],

    ["重置", "Reset"],
    ["动态预测", "Dynamic Prediction"],
    ["交互预测", "Interaction-Aware Prediction"],
    ["空间截面", "Spatial Cross-Section"],
    ["全局归因", "Global Attribution"],
    ["成果转化", "Research Translation"],
    ["研究问题", "Research Question"],
    ["核心输出", "Core Outputs"],
    ["访问人数", "Visitors"],
    ["多领域拓展", "Cross-Domain Expansion"],
    ["时空证据链。", "the spatiotemporal evidence chain."],
    ["研究证据链。", "the research evidence chain."],
    ["健康地理专刊", "Health Geography Special Issue"],
    ["核心模型", "Core Model"],
    ["模型改进", "Model Extension"],
    ["桌面建模流程。", "desktop modeling workflow."],
    ["通用 STVC", "General STVC Framework"],
    ["R 包首发开源", "First Open-Source R Package Release"],
    ["2 项代表成果", "2 representative outputs"],
    ["4 项代表成果", "4 representative outputs"],
    ["8 项代表成果", "8 representative outputs"],
    ["5 项代表成果", "5 representative outputs"],
    ["覆盖解释与预测。", "for interpretation and prediction."],
    ["↓ 越小通常越优", "↓ LOWER IS GENERALLY BETTER"],
    ["贝叶斯 STVI", "Bayesian STVI"],
    ["贝叶斯 STVC", "Bayesian STVC"],
    ["访问 R 包", "Visit the R Package"],
    ["点击放大查看", "Click to Enlarge"],
    ["分层或交互时空面板", "Hierarchical or interaction-based spatiotemporal panel"],
    ["连接真实世界问题。", "to real-world questions."],
    ["中文版用户手册", "Chinese User Guide"],
    ["↔ 结合拟合共同判断", "↔ INTERPRET WITH MODEL FIT"],
    ["建立完整研究工作台。", "build a complete research workbench."],
    ["时空面板 Y(s,t)", "Spatiotemporal panel Y(s,t)"],
    ["局部系数 + 相对贡献", "Local coefficients + relative contributions"],
    ["时空趋势 + 动态预测", "Spatiotemporal trends + dynamic prediction"],
    ["INLA 安装说明", "INLA Installation Guide"],
    ["BSTVC 后验方差结果", "BSTVC posterior variance components"],
    ["可比较、可量化、可复现。", "Comparable, Quantifiable, Reproducible."],
    ["衡量有效参数与复杂程度。", "Quantifies effective parameters and model complexity."],
    ["数值越小通常表示拟合表现越好。", "Lower values generally indicate better fit."],
    ["按响应类型评价精度与区分能力。", "Evaluates accuracy and discrimination by response type."],
    ["分别读取时间与空间非平稳效应。", "Reads temporal and spatial nonstationary effects separately."],
    ["缺失值估计与疾病风险制图。", "Missing-value estimation and disease-risk mapping."],
    ["R 包示例与研究流程参考。", "R-package examples and reproducible workflows."],
    ["理论、方法演进与研究案例。", "Theory, methodological evolution, and research cases."],
    ["推荐汇总：Excel / R", "RECOMMENDED: Excel / R"],
    ["旅游、灾害与软件系统持续验证。", "Continued validation in tourism, disasters, and software systems."],
    ["方法进入专利与可视化建模系统。", "Methods translated into patents and visual modeling systems."],
    ["BSTVC 模型官网", "BSTVC Model Homepage"],
    ["数据、建模、结果输出与可视化。", "Data, modeling, outputs, and visualization."],
    ["监视 CPU、内存和线程参数。", "Monitor CPU, memory, and thread settings."],
    ["具有时空交互的面板 Y(s,t)", "Panel Y(s,t) with space–time interaction"],
    ["不估计时间变化，仅解释空间异质性", "Explains spatial heterogeneity without estimating temporal change"],
    ["局部效应、降尺度与地质灾害实证。", "Local effects, downscaling, and landslide applications."],
    ["时空交互与相对贡献进入统一体系。", "Space–time interactions and relative contributions unified."],
    ["TCs + SCs + 可信区间", "TCs + SCs + credible intervals"],
    ["大体量贝叶斯计算依赖与版本提示。", "Dependencies and version notes for large Bayesian computations."],
    ["运行记录留在本机，便于复盘与复现", "Keep run records local for review and reproducibility"],
    ["用于复杂动态预测，不替代变系数归因", "For complex dynamic prediction; not a substitute for varying-coefficient attribution"],
    ["单期空间截面 Y(s), X(s)", "Single-period spatial cross-section Y(s), X(s)"],
    ["PM2.5、温度及其他健康环境因素", "PM2.5, temperature, and other environmental health factors"],
    ["人口密度、未保险率、贫困率、降水等", "Population density, uninsured rate, poverty rate, precipitation, and related factors"],
    ["Y(s,t) + 多个 X(s,t)", "Y(s,t) + multiple X(s,t)"],
    ["用于相对贡献，不替代局部系数方向判断", "For relative contribution; not a substitute for interpreting local coefficient direction"],
    ["形成可推广的贝叶斯局部时空回归框架。", "Established a generalizable Bayesian local spatiotemporal regression framework."],
    ["R 包、桌面工具与知识生态协同开放。", "R package, desktop tool, and knowledge ecosystem opened together."],
    ["源码、版本、安装说明与 Issues。", "Source, releases, installation, and Issues."],
    ["关注目标变量变化，不解释 X 的局部效应", "Focuses on response dynamics; does not interpret local X effects"],
    ["需有明确的 SSH / TSH 交互假设", "Requires an explicit SSH/TSH interaction assumption"],
    ["看见 BSTVC 建模正在怎样使用你的电脑", "See How BSTVC Modeling Uses Your Computer"],
    ["用相近 BSTVC 模型比较线程参数", "Compare Thread Settings with Similar BSTVC Models"],
    ["推荐制图：R ggplot2 / Excel", "RECOMMENDED: R ggplot2 / Excel"],
    ["健康地理专题成果与大尺度县域健康服务研究深化。", "Expanded health-geography research and large-scale county healthcare studies."],
    ["计数预测 · TCs · SCs · 泊松偏差评价", "Count prediction · TCs · SCs · Poisson deviance"],
    ["解释变量的空间随机效应、时间随机效应与相应可信区间。", "Spatial and temporal random effects for explanatory variables, with corresponding credible intervals."],
    ["OFFLINE PREVIEW / 统计接口暂不可用", "OFFLINE PREVIEW / STATISTICS SERVICE UNAVAILABLE"],
    ["推荐制图：R / ArcGIS Pro / Excel", "RECOMMENDED: R / ArcGIS Pro / Excel"],
    ["高 BMI、卫生支出、自然环境、健康行为、PM2.5 等", "High BMI, health expenditure, natural environment, health behavior, PM2.5, and related covariates"],
    ["概率预测 · TCs · SCs · ROC / AUC", "Probability prediction · TCs · SCs · ROC/AUC"],
    ["推荐制图：R pROC / Python sklearn", "RECOMMENDED: R pROC / Python scikit-learn"],
    ["TCs · SCs · STVPI · 局部预测与可信区间", "TCs · SCs · STVPI · local predictions and credible intervals"],
    ["BSTVC-R 正式开源，多资源、妇幼健康与效率评价形成证据群。", "BSTVC-R released openly, alongside studies of multiple resources, maternal and child health, and efficiency."],
    ["局部预测、缺失值填补结果，以及 50% / 95% 贝叶斯可信区间。", "Local predictions, missing-value imputations, and 50%/95% Bayesian credible intervals."],
    ["Covid_Binary_Panel(1).xlsx + 省级完整地图", "Covid_Binary_Panel(1).xlsx + complete province-level map"],
    ["BSTVC Desktop · 数据准备、模型配置与结果导出工作台", "BSTVC Desktop · Data preparation, model configuration, and result export"],
    ["DIC、WAIC、eff、pd2、LS 等模型拟合、复杂度与预测评价。", "Model fit, complexity, and predictive assessment using DIC, WAIC, eff, pd2, and LS."],
    ["BSTVC_panel_converted.xlsx + us_a5 完整地图", "BSTVC_panel_converted.xlsx + complete us_a5 map"],
    ["先看方向与量级，再看宽窄可信区间；最后联动模型评价、地图分布和研究情境形成结论。", "Assess direction and magnitude first, then the inner and outer credible intervals; finally integrate model assessment, mapped patterns, and substantive context."],
    ["时间系数、空间系数与相对时空贡献百分比；可一次下载为多 Sheet Excel。", "Temporal coefficients, spatial coefficients, and relative spatiotemporal contribution percentages, downloadable as a multi-sheet Excel workbook."],
    ["贝叶斯可信区间表达参数后验不确定性，不能简单等同于频率学显著性检验或机械地转写为“显著／不显著”。", "Bayesian credible intervals express posterior parameter uncertainty and should not be mechanically equated with frequentist significance tests or reduced to significant/non-significant labels."],
    ["BSTVC Desktop 中文桌面版：将数据检查、模型运行、结果导出与使用支持整合为可视化工作流。", "BSTVC Desktop integrates data checking, model execution, result export, and user support in a visual workflow."],
    ["八年理论演进与多场景实证，沉淀为今天的开源方法体系。将鼠标移至年份，即可查看对应论文、专利与软件成果。", "Eight years of methodological development and multi-setting applications underpin today’s open-source system. Hover over a year to explore the associated papers, patents, and software."],
    ["TestData_Continuous.csv + TestMap_Continuous 完整 Shapefile", "TestData_Continuous.csv + complete TestMap_Continuous Shapefile set"],
    ["BSTVC-R 首次公开发布：将 STVC 系列模型、示例数据、安装说明与可复现分析流程整合为开放研究工具。", "First public release of BSTVC-R, integrating the STVC model family, example data, installation guidance, and reproducible workflows."],
    ["面向 BSTVC 桌面版的轻量资源监视器：观察模型计算期间的 CPU、内存与线程状态，帮助选择更快、更稳的参数。", "A lightweight resource monitor for BSTVC Desktop that tracks CPU, memory, and thread states during model computation to support faster, more stable settings."],
    ["bayesianstvc/BSTVC-R 以“full-map”框架统一支持连续型、二分类和计数型响应，输出局部机制、关键驱动与动态预测。", "bayesianstvc/BSTVC-R supports continuous, binary, and count responses within a full-map framework, producing local mechanisms, key-driver evidence, and dynamic predictions."],
    ["BSTVC-R、Desktop User Guide、案例数据、INLA Resource Monitor 与官方网站共同组成开放研究工具链。", "BSTVC-R, the Desktop User Guide, case data, the INLA Resource Monitor, and the official website form an open research toolchain."],
    ["仓库提供 GetStart.Rmd、英文/中文 PDF、数据预处理脚本与 GitHub Issues；桌面版适合零代码复现，R 包适合批量研究。", "The repository provides GetStart.Rmd, English and Chinese PDFs, preprocessing scripts, and GitHub Issues. Desktop supports no-code reproduction; the R package supports batch research."],
    ["页面端仅提交站点标识与匿名访问事件；前端不读取或展示原始 IP。统计接口不可用或设备离线时，仅保留地图底图与离线状态，不生成访问点。", "The page sends only a site identifier and anonymous visit event; it neither reads nor displays raw IP addresses. When the statistics service is unavailable or the device is offline, only the base map and offline state remain, with no visitor points generated."],
    ["不同数据规模、模型结构与电脑配置对应不同的资源工作点。建议先使用 BSTVC 默认 6 线程，再以相近模型的真实运行轨迹比较 8 或 12 线程。", "Different data scales, model structures, and hardware configurations have different resource sweet spots. Start with the BSTVC default of six threads, then compare eight or 12 using real trajectories from similar models."],
    ["DESCRIPTION 标注 R ≥ 4.4.0、INLA ≥ 24.06.27，采用 GPL-3 许可；模型评估覆盖 DIC、WAIC、pd 与 LS。", "DESCRIPTION specifies R ≥ 4.4.0 and INLA ≥ 24.06.27 under GPL-3; model assessment covers DIC, WAIC, pd, and LS."],
    ["README 当前示例使用 devtools::install_github(\"songbi123/BSTVC\") 或 remotes::install_github(\"songbi123/BSTVC\")；INLA 建议先按官方说明安装。", "The current README uses devtools::install_github(\"songbi123/BSTVC\") or remotes::install_github(\"songbi123/BSTVC\"); install INLA first according to its official instructions."],
    ["model.evaluation 汇总 DIC、WAIC、eff、pd2 与 LS。比较候选模型时，DIC 与 WAIC 越小通常表示拟合表现越好；eff 与 pd2 反映有效参数和模型复杂度；LS 越接近 0，预测精度通常越高。", "model.evaluation summarizes DIC, WAIC, eff, pd2, and LS. For candidate models, smaller DIC and WAIC usually indicate better fit; eff and pd2 reflect effective parameters and complexity; LS values closer to zero generally indicate better predictive accuracy."],
    ["模型", "Model"],
    ["个人主页 ↗", "Profile ↗"],
    ["回到顶部 ↑", "Back to Top ↑"],
    ["2 项代表成果", "2 representative outputs"],
    ["4 项代表成果", "4 representative outputs"],
    ["8 项代表成果", "8 representative outputs"],
    ["5 项代表成果", "5 representative outputs"],
    ["联系与反馈 ↗", "Contact and Feedback ↗"],
    ["访问 R 包 ↗", "Visit the R Package ↗"],
    ["模型主页与更新 ↗", "Model Homepage and Updates ↗"],
    ["免费下载桌面版 ↓", "Download Desktop Free ↓"],
    ["下载三类示例数据 ↓", "Download Three Example Datasets ↓"],
    ["查看完整模型主页 ↗", "View the Complete Model Homepage ↗"],
    ["查看代表性 DOI ↗", "View Representative DOIs ↗"],
    ["BSTVC 模型官网 ↗", "BSTVC Model Homepage ↗"],
    ["空间与时间效应相对独立变化", "Spatial and temporal effects vary independently"],
    ["方向 + 量级 + CrI", "DIRECTION + MAGNITUDE + CrI"],
    ["POST-HOC / 事后解释", "POST-HOC / EXTERNAL EXPLANATION"],
    ["ANTE-HOC / 先验可解释", "ANTE-HOC / INTRINSIC INTERPRETABILITY"],
    ["为模型运行找到合适的线程工作点。", "Find the Right Thread Setting for Model Runs."],
    ["VISITORS · 访问人数 —", "VISITORS · —"],
    ["查看 v0.5.7 Release ↗", "View v0.5.7 Release ↗"],
    ["Bayesian STVC 模型官网 ↗", "Bayesian STVC Model Homepage ↗"],
    ["TCs · SCs · 50/95% 可信区间", "TCs · SCs · 50/95% CREDIBLE INTERVALS"],
    ["OFFLINE PREVIEW / 统计接口暂不可用", "OFFLINE PREVIEW / STATISTICS SERVICE UNAVAILABLE"],
    ["十二项研究案例，", "Twelve Research Cases Connected"],
    ["真实案例驱动的", "A Real-Case-Driven"],
    ["方法与应用的", "A Methods-to-Applications"],
    ["完整方法说明、案例原始图件与持续更新，请访问 BSTVC 模型官网 ↗", "For complete methods, original case figures, and updates, visit the BSTVC Model Homepage ↗"],
    ["以可信区间、模型评价与 ", "Use credible intervals, model assessment, and "],
    [" 回答“作用多大、证据多稳、谁更关键”。", " to show effect magnitude, evidential stability, and the most important drivers."],
    ["一套体系，", "One System"],
    ["用真实图件读取", "Read"],
    ["从桌面版到 R 包，", "From Desktop to R:"],
    ["BSTVC 的方法优势：", "BSTVC Advantages:"],
    ["基于空间自相关的碳排放时空分析系统 V1.0；著作权人：唐先腾、唐章英、宋超；登记号：2024SR0857063。", "Spatiotemporal Carbon-Emission Analysis System Based on Spatial Autocorrelation V1.0; software copyright registration 2024SR0857063."],
    ["基于 R-Shiny 的中国区县孕产妇及 5 岁以下儿童死亡率时空数据可视化分析系统 V1.0；登记号：2025SR0096459。", "R-Shiny Spatiotemporal Visualization System for County-Level Maternal and Under-Five Mortality in China V1.0; registration 2025SR0096459."],
    ["基于 GA-SVM 的滑坡地质灾害易发性评价系统 V1.0；著作权人：唐章英、宋超、赵晓明、刘川；登记号：2021SR1447927。", "GA-SVM Landslide Susceptibility Assessment System V1.0; software copyright registration 2021SR1447927."],
    ["基于 STVCapp 模型的 R-Shiny Web 可视化建模系统 V1.0；著作权人：宋超、潘杰、唐章英；登记号：2023SR0879891。", "STVCapp-Based R-Shiny Web Visual Modeling System V1.0; software copyright registration 2023SR0879891."],
    ["页面端仅提交站点标识与匿名访问事件；前端不读取或展示原始 IP。统计接口不可用或设备离线时，仅保留地图底图与离线状态，不生成 diagram访问点。", "The page sends only a site identifier and an anonymous visit event; it neither reads nor displays raw IP addresses. When the statistics service is unavailable or the device is offline, only the base map and offline state remain, with no visitor points generated."],
    ["一种探测突发公卫事件区域公众风险感知时空差异的方法；发明人：宋超、潘杰、解铭宇；专利号：ZL 2022 1 0217055.2；授权公告日：2023-06-06。", "Method for Detecting Spatiotemporal Differences in Regional Public Risk Perception during Public-Health Emergencies; Chinese patent ZL 2022 1 0217055.2, granted 6 June 2023."],
    ["陈爰睿、薛锦、唐欣怡、解修峰、赵芃、唐章英、王秀丽、宋超：《顾及不公平、地理集聚与关键因素的中国孕产妇保健服务多指标联合时空评价》，《现代预防医学》 (2026)。", "Chen, A., Xue, J., Tang, X., et al. A Joint Multimetric Spatiotemporal Evaluation of Maternal Healthcare Services in China Considering Inequality, Geographic Clustering, and Key Factors. Modern Preventive Medicine (2026)."],
    ["项目由 bayesianstvc 发布；Windows 10/11、PowerShell 5.1 或 7、现代浏览器即可运行。查看 v0.5.7 Release ↗", "Published by bayesianstvc. Runs on Windows 10/11 with PowerShell 5.1 or 7 and a modern browser. View v0.5.7 Release ↗"],
    ["MODEL / HOMEPAGEBayesian STVC 模型官网 ↗Theory, methodological evolution, and research cases.", "MODEL / HOMEPAGE · Bayesian STVC Model Homepage ↗ · Theory, methodological evolution, and research cases."],
    ["罗雅玲、唐欣怡、解铭宇、严国强、唐先腾、唐章英、王秀丽、潘杰、宋超：《医疗资源配置效率的小区域时空评价：基于四川省县域面板数据的实证研究》，《中国卫生事业管理》42(3) (2025): 292–299。", "Luo, Y., Tang, X., Xie, M., et al. Small-Area Spatiotemporal Evaluation of Healthcare Resource Allocation Efficiency: Evidence from County-Level Panel Data in Sichuan Province. Chinese Health Service Management 42(3) (2025): 292–299."],
    ["唐欣怡、罗雅玲、严国强、穆星如、刘佳雪、杨安岚、萨琦拉、唐章英、王秀丽、宋超：《医疗卫生资源的多指标时空联合评价——2009—2022 年中国省域面板数据的实证分析》，《卫生经济研究》42(8) (2025): 12–16, 23。", "Tang, X., Luo, Y., Yan, G., et al. A Multimetric Joint Spatiotemporal Evaluation of Healthcare Resources: Evidence from Provincial Panel Data in China, 2009–2022. Health Economics Research 42(8) (2025): 12–16, 23."],
    ["以CREDIBLE INTERVALS、模型评价与", "Use credible intervals, model assessment, and"],
    ["只预测 Y 的时空变化？", "Predict only the spatiotemporal dynamics of Y?"],
    ["解释 X 的局部作用？", "Interpret local effects of X?"],
    ["比较因素相对贡献？", "Compare relative factor contributions?"],
    ["初次使用建议 · STVC", "RECOMMENDED FIRST MODEL · STVC"],
    ["中国省域面板", "Provincial panel, China"],
    ["社会经济统计插补", "Socioeconomic statistical imputation"],
    ["四川省县域", "Counties in Sichuan Province"],
    ["36个月", "36 months"],
    ["传染病与气候健康", "Infectious disease and climate–health"],
    ["中国县域面板", "County panel, China"],
    ["STVC 方法与验证", "STVC methods and validation"],
    ["366个中国城市", "366 Chinese cities"],
    ["COVID-19时期", "COVID-19 period"],
    ["公众风险感知", "Public risk perception"],
    ["189个国家和地区", "189 countries and territories"],
    ["20年", "20 years"],
    ["全球人口老龄化", "Global population ageing"],
    ["2,308个中国县域", "2,308 Chinese counties"],
    ["长期面板", "Long-term panel"],
    ["医疗资源公平", "Healthcare resource equity"],
    ["论文", "Article"],
    ["方法论文", "Methodological Article"],
    ["应用论文", "Applied Article"],
    ["软件著作权", "Software Copyright"],
    ["国家发明专利", "National Invention Patent"],
    ["综述", "Review"],
    ["开源 R 包", "Open-Source R Package"],
    ["用户指南", "User Guide"],
    ["数据论文", "Data Article"],
    ["开源工具", "Open-Source Tool"],
    ["方法生态", "Method Ecosystem"],
    ["匿名统计与离线提示", "Anonymous Statistics and Offline Notice"]
  ]);

  const partial = [
    ["项代表成果", "representative outputs"],
    ["方向 + 量级 + ", "DIRECTION + MAGNITUDE + "],
    ["Bayesian STVC 模型官网", "Bayesian STVC Model Homepage"],
    ["可信区间", "CREDIBLE INTERVALS"],
    ["以可信区间、模型评价与 ", "Use credible intervals, model assessment, and "],
    ["回答“作用多大、证据多稳、谁更关键”。", "show effect magnitude, evidential stability, and the most important drivers."],
    ["完整方法说明、案例原始图件与持续更新，请访问 ", "For complete methods, original case figures, and updates, visit the "],
    ["项目由 bayesianstvc 发布；Windows 10/11、PowerShell 5.1 或 7、现代浏览器即可运行。", "Published by bayesianstvc. Runs on Windows 10/11 with PowerShell 5.1 or 7 and a modern browser. "],
    ["MODEL / HOMEPAGEBayesian STVC 模型官网", "MODEL / HOMEPAGE · Bayesian STVC Model Homepage"],
    ["（年度最佳论文第一名；封面论文）", " (First Place, Annual Best Paper Award; Cover Article)"],
    ["（2019 年 ESI 高被引论文）", " (2019 ESI Highly Cited Paper)"],
    ["（", " ("], ["）", ")"],
    ["年至今", "–Present"],
    ["来源：", "Source: "],
    ["动态 Logo", "Animated Logo"],
    ["静态 Logo", "Static Logo"],
    ["课题组", "Research Group"],
    ["示意", " diagram"],
    ["页面模块进度", "Page section progress"],
    ["隐藏模块进度导航", "Hide section progress navigation"],
    ["回到网页顶部", "Back to page top"],
    ["打开导航", "Open navigation"],
    ["关闭导航", "Close navigation"]
  ];

  function translateString(value) {
    if (!value || !/[\u3400-\u9fff]/.test(value)) return value;
    const trimmed = value.trim();
    let translated = exact.get(trimmed);
    if (translated !== undefined) {
      const lead = value.match(/^\s*/)?.[0] || "";
      const trail = value.match(/\s*$/)?.[0] || "";
      return lead + translated + trail;
    }
    translated = value;
    for (const [from, to] of partial) translated = translated.split(from).join(to);
    return translated;
  }

  function translateTree(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentElement?.tagName;
        return tag && tag !== "SCRIPT" && tag !== "STYLE" && /[\u3400-\u9fff]/.test(node.nodeValue || "")
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => { node.nodeValue = translateString(node.nodeValue); });

    const attrs = ["aria-label", "title", "alt", "data-geo-title", "data-geo-route", "data-geo-copy", "data-logo-title"];
    root.querySelectorAll?.("*").forEach(el => attrs.forEach(attr => {
      if (el.hasAttribute(attr)) el.setAttribute(attr, translateString(el.getAttribute(attr)));
    }));
  }

  function wireEnglishDownload() {
    const section = document.querySelector("#download");
    if (!section) return;
    const title = section.querySelector("h2");
    if (title) title.innerHTML = 'Download BSTVC Desktop.<br><span>Start with a real case.</span>';
    const intro = section.querySelector(".download-copy > p:not(.section-kicker)");
    if (intro) intro.textContent = "English desktop release for Windows 10/11, with direct GitHub access to the installer, source repository, R package, and supporting tools.";

    const actions = section.querySelector(".download-actions");
    if (actions) actions.innerHTML = `
      <a class="download-resource-card download-resource-primary" data-resource="DOWNLOAD" href="https://github.com/bayesianstvc/BSTVC-Desktop/releases/download/v2026.8.1/BSTVC_desktop_EN_win_x64_26.08.01_setup.exe" target="_blank" rel="noreferrer">
        <span class="download-resource-meta"><i>01</i><b>ENGLISH DESKTOP</b><em>WIN</em></span>
        <strong>Download BSTVC Desktop</strong>
        <p>English installer · Windows x64 · Version 2026.8.1</p>
        <span class="download-resource-url">BSTVC_desktop_EN_win_x64_26.08.01_setup.exe</span>
        <span class="download-resource-action">Download from GitHub Release <i>↗</i></span>
      </a>
      <a class="download-resource-card" data-resource="DESKTOP REPOSITORY" href="https://github.com/bayesianstvc/BSTVC-Desktop" target="_blank" rel="noreferrer">
        <span class="download-resource-meta"><i>02</i><b>DESKTOP</b><em>GITHUB</em></span>
        <strong>BSTVC-Desktop Repository</strong>
        <p>Releases, source, issue tracking, and version history</p>
        <span class="download-resource-action">View GitHub Project <i>↗</i></span>
      </a>
      <div class="download-resource-card is-coming-soon" data-resource="ENGLISH GUIDE" role="status" aria-label="English user guide coming soon">
        <span class="download-resource-meta"><i>03</i><b>USER GUIDE</b><em>SOON</em></span>
        <strong>English User Guide</strong>
        <p>The module and integration point are reserved for the forthcoming English guide.</p>
        <span class="download-resource-action">Coming soon · Link reserved</span>
      </div>
      <a class="download-resource-card" data-resource="R PACKAGE" href="https://github.com/bayesianstvc/BSTVC-R" target="_blank" rel="noreferrer">
        <span class="download-resource-meta"><i>04</i><b>R PACKAGE</b><em>GITHUB</em></span>
        <strong>BSTVC-R</strong>
        <p>Reproducible research workflows and source code</p>
        <span class="download-resource-action">View GitHub Project <i>↗</i></span>
      </a>
      <a class="download-resource-card" data-resource="MONITOR" href="https://github.com/bayesianstvc/BSTVC-Monitor" target="_blank" rel="noreferrer">
        <span class="download-resource-meta"><i>05</i><b>AUXILIARY TOOL</b><em>WIN</em></span>
        <strong>BSTVC Process Monitor</strong>
        <p>Compare CPU, memory, and thread settings locally</p>
        <span class="download-resource-action">View GitHub Project <i>↗</i></span>
      </a>`;

    const packagePanel = section.querySelector(".download-package");
    if (packagePanel) {
      const image = packagePanel.querySelector("img");
      if (image) {
        image.src = "./assets/bstvc-desktop-home-screenshot-en.png";
        image.alt = "BSTVC Desktop English interface showing the overview, core features, and workflow";
      }
      const caption = packagePanel.querySelector("figcaption");
      if (caption) caption.textContent = "BSTVC Desktop · English interface · Data preparation, modeling, and results workflow";
      const label = packagePanel.querySelector(":scope > span");
      if (label) label.textContent = "ENGLISH RELEASE / 2026.8.1";
      const list = packagePanel.querySelector("ul");
      if (list) list.innerHTML = `
        <li><span>01</span> Windows x64 installer</li>
        <li><span>02</span> English user interface</li>
        <li><span>03</span> Continuous-response example</li>
        <li><span>04</span> Binary-response example</li>
        <li><span>05</span> Count-response example</li>
        <li><span>06</span> Data, maps, and visualization guidance</li>`;
      const note = packagePanel.querySelector("small");
      if (note) note.textContent = "The homepage works offline; external downloads and repositories require internet access.";
      packagePanel.querySelectorAll(".download-share-note").forEach(el => el.remove());
    }

    document.querySelectorAll("a[data-online-guide], a[href*='bstvc-user-guide.html']").forEach(link => {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.setAttribute("aria-disabled", "true");
      link.classList.add("is-coming-soon");
      link.innerHTML = "English User Guide <span>· Coming soon</span>";
    });
  }

  function applyEnglishLayer() {
    document.documentElement.lang = "en";
    document.title = "BSTVC | Bayesian Spatiotemporal Interpretability Analysis";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "BSTVC is an open-source Bayesian framework and desktop tool for local spatiotemporal interpretation, key-driver identification, and dynamic prediction.");
    wireEnglishDownload();
    const monitorTitle = document.querySelector("#monitor .monitor-heading h2");
    if (monitorTitle) monitorTitle.innerHTML = 'BSTVC Process Monitor:<br><span>Find the Right Thread Setting for Model Runs.</span>';
    translateTree(document.body);
  }

  function scheduleTranslationSweeps() {
    let pass = 0;
    const timer = setInterval(() => {
      translateTree(document.body);
      pass += 1;
      if (pass >= 16) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applyEnglishLayer();
      setTimeout(applyEnglishLayer, 160);
      setTimeout(applyEnglishLayer, 650);
      setTimeout(applyEnglishLayer, 1600);
      scheduleTranslationSweeps();
    }, { once: true });
  } else {
    applyEnglishLayer();
    setTimeout(applyEnglishLayer, 160);
    setTimeout(applyEnglishLayer, 650);
    setTimeout(applyEnglishLayer, 1600);
    scheduleTranslationSweeps();
  }
})();
