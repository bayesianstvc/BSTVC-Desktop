<div align="center">

<img src="https://raw.githubusercontent.com/bayesianstvc/BSTVC-Desktop/main/README-assets/bstvc-logo-motion.gif?v=20260802" alt="Animated BSTVC Desktop logo" width="150" />

# BSTVC Desktop

### Bayesian spatiotemporal interpretability—without a coding-first workflow

**A visual research environment for local spatiotemporal interpretability, global attribution, and dynamic prediction within a unified Bayesian full-map framework.**

[![Release](https://img.shields.io/github/v/release/bayesianstvc/BSTVC-Desktop?display_name=tag&sort=semver&style=flat-square&color=2457d6)](https://github.com/bayesianstvc/BSTVC-Desktop/releases/tag/v2026.8.1)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-1674ea?style=flat-square)](https://github.com/bayesianstvc/BSTVC-Desktop/releases/download/v2026.8.1/BSTVC_desktop_EN_win_x64_26.08.01_setup.exe)
[![Interface](https://img.shields.io/badge/interface-English%20%7C%20中文-7c4dff?style=flat-square)](https://bayesianstvc.github.io/BSTVC-Desktop)

[![Download BSTVC Desktop](https://img.shields.io/badge/DOWNLOAD-BSTVC%20Desktop%20EN%20v2026.8.1-0878d1?style=for-the-badge&logo=windows11&logoColor=white)](https://github.com/bayesianstvc/BSTVC-Desktop/releases/download/v2026.8.1/BSTVC_desktop_EN_win_x64_26.08.01_setup.exe)

**[English website](https://bayesianstvc.github.io/BSTVC-Desktop)** · **[中文网站](https://bayesianstvc.github.io/BSTVC-Desktop/zh/)**

</div>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/bayesianstvc/BSTVC-Desktop/main/README-assets/bstvc-desktop-en-overview.png?v=20260802-2" alt="BSTVC Desktop English overview interface" width="100%" />
</p>

<p align="center"><em>The official English desktop interface: prepare data, verify spatial order, fit BSTVC/BSVC models, and export interpretable results in one guided environment.</em></p>

## Download and official resources

| Resource | Recommended for | Access |
|:--|:--|:--|
| **BSTVC Desktop — English installer** | Windows 10/11 users who want the complete English graphical workflow | **[Download `setup.exe`](https://github.com/bayesianstvc/BSTVC-Desktop/releases/download/v2026.8.1/BSTVC_desktop_EN_win_x64_26.08.01_setup.exe)** |
| **Release v2026.8.1** | Version notes, installer assets, and release history | [Open the GitHub Release](https://github.com/bayesianstvc/BSTVC-Desktop/releases/tag/v2026.8.1) |
| **English official website** | Product overview, methods, workflow, outputs, and download guidance | [bayesianstvc.github.io/BSTVC-Desktop](https://bayesianstvc.github.io/BSTVC-Desktop) |
| **中文官方网站** | 中文方法介绍、案例、下载与使用支持 | [bayesianstvc.github.io/BSTVC-Desktop/zh/](https://bayesianstvc.github.io/BSTVC-Desktop/zh/) |
| **中文下载资源** | 中文界面安装包、离线帮助文档和实例数据 | [百度网盘](https://pan.baidu.com/s/5h7zSPjXEvBINShxLVLjirA) |
| **中文在线用户手册** | 中文操作流程、参数说明、结果输出与当前版本边界 | [打开在线帮助文档](https://bayesianstvc.github.io/BSTVC-Desktop/zh/assets/bstvc-user-guide.html) |

> **Recommended starting point:** Download the English installer, open **Overview**, then follow the three-step path: **Upload Data and Map → Run Data Order Check → Run Models and Export Result Tables**.

## Why BSTVC Desktop?

Many research questions require more than a single average regression coefficient:

> **Why does the same factor have different effects across locations and periods?**

BSTVC Desktop provides an **ante-hoc interpretable Bayesian workflow**. Interpretation is built into model parameters rather than added after fitting an opaque prediction model. Researchers can examine where and when associations vary, identify globally important drivers, retain posterior uncertainty, and connect mechanism-oriented inference with dynamic prediction.

- **Visual and guided:** complete standard analyses without writing an R script.
- **Scientifically transparent:** inspect coefficients, credible intervals, variance contribution, model diagnostics, and predictive outputs.
- **Spatially explicit:** validate map-unit order and construct or import spatial structures before modeling.
- **Research-ready:** export tables and figures for reproducible checking, mapping, and reporting.
- **Local-first:** modeling and data processing run on the user's computer.

## Three research tasks in one full-map framework

<p align="center">
  <img src="https://raw.githubusercontent.com/bayesianstvc/BSTVC-Desktop/main/README-assets/bstvc-full-map-framework.webp?v=20260802-2" alt="BSTVC full-map framework" width="100%" />
</p>

| Research task | Core question | Main model/output |
|:--|:--|:--|
| **Local spatiotemporal interpretability** | Where, when, and how does an explanatory variable affect the outcome? | STVC/STIVC; spatial coefficients (SCs), temporal coefficients (TCs), and posterior credible intervals |
| **Global spatiotemporal interpretability** | Which candidate factors contribute most to overall spatiotemporal variation? | STVPI and explainable-percentage assessment |
| **Dynamic prediction** | How may the outcome change as spatiotemporal conditions evolve? | Smoothing, missing-value imputation, and forecasting |

## Supported response types

Choose the response family according to the distribution of the outcome—not researcher preference.

| Response | Desktop workflow | Typical research outcome |
|:--|:--|:--|
| **Continuous** | Log-Gaussian regression | Rates, indices, measurements, or appropriately transformed continuous outcomes |
| **Binary** | Logistic regression | Event occurrence, status, presence/absence, or two-category outcomes |
| **Count** | Poisson regression | Non-negative event counts observed by spatial unit and time |

## From data to evidence

```text
Spatial map + panel data
          ↓
Data preprocessing and order validation
          ↓
Model selection, priors, and computing parameters
          ↓
Bayesian model fitting with INLA
          ↓
SCs / TCs / STVPI / prediction / model evaluation
          ↓
Maps, tables, uncertainty-aware conclusions, and reproducible reporting
```

### Core desktop modules

1. **Overview** — product orientation, core features, and the recommended three-step workflow.
2. **Data Input** — import the map and spatiotemporal panel data.
3. **Data Check** — verify fields, missingness, map-unit identity, and record order.
4. **BSTVC modeling** — estimate spatiotemporally varying relationships for panel data.
5. **BSVC modeling** — analyze spatially varying relationships for cross-sectional data.
6. **Data Conversion** — reshape spatial wide tables into model-ready panel form.
7. **Field Conversion** — prepare and standardize modeling fields.
8. **Custom Spatial Matrix** — construct or import a spatial neighborhood matrix.

## Read the outputs

BSTVC Desktop organizes model output around a transparent evidence chain:

- **Local effects:** spatial coefficients (SCs) and temporal coefficients (TCs).
- **Uncertainty:** Bayesian credible intervals (CrIs), which should not be reduced to a conventional significance-test label.
- **Global attribution:** STVPI and factor-specific explainable percentages.
- **Prediction:** fitted values, smoothing, missing-value estimates, and future projections.
- **Model evaluation:** DIC and WAIC for fit/complexity balance, effective parameters (`pD`), and logarithmic score (`LS`) for predictive accuracy.

## Quick start

1. **Install** the English Windows x64 release.
2. **Prepare** a spatial map and model-ready spatiotemporal panel table.
3. **Validate** map-unit identifiers and observation order in **Data Check**.
4. **Start with STVC** for a first local spatiotemporal analysis, then extend to STIVC or STVPI when the research question requires interaction or global attribution.
5. **Read estimates with uncertainty** and compare candidate models using multiple evaluation criteria.
6. **Export** result tables for mapping, interpretation, and reproducible reporting.

For detailed Chinese instructions, see the **[online BSTVC Desktop User Guide](https://bayesianstvc.github.io/BSTVC-Desktop/zh/assets/bstvc-user-guide.html)**.

## Desktop or R package?

| Choose | Best when you need |
|:--|:--|
| **BSTVC Desktop** | A graphical, guided workflow; lower setup cost; teaching; applied analysis; rapid inspection and export |
| **[BSTVC-R](https://github.com/bayesianstvc/BSTVC-R)** | Scripted automation, customized analysis pipelines, reproducible batch processing, and advanced R integration |

Both interfaces belong to the same BSTVC research ecosystem. The desktop edition is the recommended entry point for most new users; the R package remains available for programmable workflows.

## Companion performance monitor

[BSTVC Process Monitor](https://github.com/bayesianstvc/inla-monitor) helps Windows users observe CPU and memory use during model fitting and compare thread settings. Start from the desktop default of **6 threads**, then adjust only after monitoring a comparable model run; more threads do not always produce a faster or more stable fit.

## Scientific scope

BSTVC is designed for spatiotemporal panel and areal research in GIScience, spatial statistics, public health, health and medical geography, environmental health, health services research, and broader natural–social science applications. Appropriate model specification, data quality assessment, sensitivity analysis, and domain interpretation remain the responsibility of the researcher.

## Project status and support

- **Status:** actively developed and maintained.
- **Bug reports and feature requests:** [BSTVC-Desktop Issues](https://github.com/bayesianstvc/BSTVC-Desktop/issues)
- **Statistical framework:** [Bayesian STVC model homepage](https://chaosong.blog/bayesian-stvc/)
- **R package:** [bayesianstvc/BSTVC-R](https://github.com/bayesianstvc/BSTVC-R)
- **Desktop development and usage support:** [Xianteng Tang](https://tangxxxxt.github.io/)
- **Project leadership and statistical methodology:** [Chao Song](https://chaosong.blog/)

We welcome reproducible bug reports, feature proposals, documentation improvements, code contributions, and new empirical applications.

## Methodological references

1. Song, C., Shi, X., & Wang, J. (2020). Spatiotemporally varying coefficients (STVC) model: a Bayesian local regression to detect spatial and temporal nonstationarity in variable relationships. *Annals of GIS, 26*(3), 277–291.
2. Song, C., Yin, H., Shi, X., et al. (2022). Spatiotemporal disparities in regional public risk perception of COVID-19 using Bayesian spatiotemporally varying coefficients (STVC) series models across Chinese cities. *International Journal of Disaster Risk Reduction, 77*, 103078.
3. Wan, Q., Tang, Z., Pan, J., et al. (2022). Spatiotemporal heterogeneity in associations of national population ageing with socioeconomic and environmental factors at the global scale. *Journal of Cleaner Production, 373*, 133781.
4. Song, C., Shi, X., Bo, Y., Wang, J., Wang, Y., & Huang, D. (2019). Exploring spatiotemporal nonstationary effects of climate factors on hand, foot, and mouth disease using a Bayesian spatiotemporally varying coefficients (STVC) model in Sichuan, China. *Science of the Total Environment, 648*, 550–560.

For an extended publication and application record, visit the **[BSTVC model homepage](https://chaosong.blog/bayesian-stvc/)**.

---

<div align="center">

**BSTVC Desktop — turning spatiotemporal heterogeneity into interpretable Bayesian evidence.**

HEOA–West China Health & Medical Geography Group

[English website](https://bayesianstvc.github.io/BSTVC-Desktop) · [中文网站](https://bayesianstvc.github.io/BSTVC-Desktop/zh/) · [Download](https://github.com/bayesianstvc/BSTVC-Desktop/releases/tag/v2026.8.1) · [User guide](https://bayesianstvc.github.io/BSTVC-Desktop/zh/assets/bstvc-user-guide.html)

</div>