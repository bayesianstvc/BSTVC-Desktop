# BSTVC V1/V2 post-estimation experiments. Base R only; no model code or refitting.
# Run from this folder: Rscript --vanilla reproduce_analysis.R
# Or: Rscript --vanilla reproduce_analysis.R <folder-containing-data> <output-folder>
# Data contain exported posterior summaries, not source observations or posterior draws.
if (.Platform$OS.type == "windows") invisible(Sys.setlocale("LC_CTYPE", "English_United States.utf8"))
options(stringsAsFactors = FALSE, digits = 16)
args <- commandArgs(trailingOnly = TRUE)
script_arg <- grep("^--file=", commandArgs(FALSE), value = TRUE)
script_root <- if (length(script_arg)) dirname(normalizePath(sub("^--file=", "", script_arg[1]), winslash = "/")) else getwd()
input_root <- if (length(args)) args[1] else script_root
output_root <- if (length(args) >= 2L) args[2] else file.path(input_root, "results")
dir.create(output_root, recursive = TRUE, showWarnings = FALSE)
dir.create(file.path(output_root, "figures"), showWarnings = FALSE)
read_data <- function(f) read.csv(file.path(input_root, "data", f), fileEncoding = "UTF-8", check.names = FALSE, na.strings = "NA")
write_table <- function(d, f) write.csv(d, file.path(output_root, f), row.names = FALSE, na = "NA", fileEncoding = "UTF-8")
case_order <- c("c6", "c2", "c3")
case_title <- c(c6 = "HALE (12 covariates)", c2 = "COVID-19", c3 = "Hepatitis B")
checks <- list()
key <- function(d, cols) {
  stopifnot(all(cols %in% names(d)))
  vals <- lapply(d[cols], function(x) ifelse(is.na(x), "<NA>", as.character(x)))
  if (any(vapply(vals, function(x) any(grepl("\034", x, fixed = TRUE)), logical(1)))) stop("Forbidden key separator")
  do.call(paste, c(vals, sep = "\034"))
}
unique_keys <- function(d, cols, label) {
  k <- key(d, cols)
  if (anyDuplicated(k)) stop(label, ": duplicate keys, no averaging or many-to-many join allowed")
  k
}
pair_versions <- function(d, cols, measures, label) {
  if (!setequal(unique(d$version), c("V1", "V2"))) stop(label, ": versions must be V1 and V2")
  a <- d[d$version == "V1", c(cols, measures), drop = FALSE]
  b <- d[d$version == "V2", c(cols, measures), drop = FALSE]
  ka <- unique_keys(a, cols, paste(label, "V1")); kb <- unique_keys(b, cols, paste(label, "V2"))
  if (!setequal(ka, kb)) stop(label, ": unmatched V1/V2 keys")
  b <- b[match(ka, kb), , drop = FALSE]
  stopifnot(identical(ka, key(b, cols)))
  checks[[label]] <<- data.frame(check = label, v1_rows = nrow(a), v2_rows = nrow(b),
    matched = length(ka), duplicate_keys = 0L, unmatched_keys = 0L)
  ans <- a[cols]
  for (m in measures) { ans[[paste0(m, "_V1")]] <- a[[m]]; ans[[paste0(m, "_V2")]] <- b[[m]] }
  ans
}
assert_quantiles <- function(d, columns, label) {
  m <- as.matrix(d[columns])
  adjacent <- m[, -1, drop = FALSE] - m[, -ncol(m), drop = FALSE]
  if (any(adjacent < 0, na.rm = TRUE)) stop(label, ": quantiles out of order")
}
with_widths <- function(p, level) {
  lo <- if (level == 95) "q025" else "q25"; hi <- if (level == 95) "q975" else "q75"
  p$interval_level <- level
  for (ver in c("V1", "V2")) p[[paste0("width_", ver)]] <- p[[paste0(hi, "_", ver)]] - p[[paste0(lo, "_", ver)]]
  p$valid_ratio <- is.finite(p$width_V1) & is.finite(p$width_V2) & p$width_V1 > 0 & p$width_V2 > 0
  p$invalid_reason <- ifelse(is.na(p$width_V1) | is.na(p$width_V2), "missing width",
    ifelse(!is.finite(p$width_V1) | !is.finite(p$width_V2), "nonfinite width",
      ifelse(p$width_V1 <= 0 | p$width_V2 <= 0, "nonpositive width", "")))
  p$ratio <- NA_real_; p$ratio[p$valid_ratio] <- p$width_V2[p$valid_ratio] / p$width_V1[p$valid_ratio]
  p$narrowing_pct <- 100 * (1 - p$ratio)
  p
}
summarize_ratios <- function(d, group_cols) {
  groups <- split(seq_len(nrow(d)), key(d, group_cols))
  do.call(rbind, lapply(groups, function(ix) {
    x <- d[ix, , drop = FALSE]; r <- x$ratio[x$valid_ratio]
    qs <- if (length(r)) quantile(r, c(0, .05, .25, .5, .75, .95, 1), names = FALSE, type = 7) else rep(NA_real_, 7)
    data.frame(x[1, group_cols, drop = FALSE], n_all = nrow(x), n_valid = length(r), n_invalid = sum(!x$valid_ratio),
      ratio_min = qs[1], ratio_p05 = qs[2], ratio_p25 = qs[3], ratio_median = qs[4],
      ratio_p75 = qs[5], ratio_p95 = qs[6], ratio_max = qs[7],
      n_narrower = sum(r < 1), n_equal = sum(r == 1), n_wider = sum(r > 1),
      share_narrower = if (length(r)) mean(r < 1) else NA_real_,
      median_narrowing_pct = 100 * (1 - qs[4]), check.names = FALSE)
  }))
}

# Experiment 1: exact per-item component widths, two central credible levels.
co <- read_data("component_quantiles.csv")
assert_quantiles(co, c("q025", "q25", "q50", "q75", "q975"), "components")
stopifnot(!anyNA(co[c("case", "part", "version", "variable")]))
stopifnot(all(co$part %in% c("time", "space")))
stopifnot(all(!is.na(co$time_index[co$part == "time"])), all(nzchar(co$region[co$part == "space"])))
cp <- pair_versions(co, c("case", "part", "variable", "region", "time_index"),
  c("point", "q025", "q25", "q50", "q75", "q975"), "GUI_components")
expected_inventory <- data.frame(case = rep(case_order, each = 2), part = rep(c("time", "space"), 3), n = c(252, 2124, 72, 186, 48, 20))
for (i in seq_len(nrow(expected_inventory))) {
  e <- expected_inventory[i, ]; stopifnot(sum(cp$case == e$case & cp$part == e$part) == e$n)
}
cw <- rbind(with_widths(cp, 95), with_widths(cp, 50))
if (any(!cw$valid_ratio)) stop("Component interval missing, nonfinite, or nonpositive; inspect inputs")
write_table(cw, "component_interval_pairs.csv")
cs <- summarize_ratios(cw, c("case", "part", "interval_level"))
vs <- summarize_ratios(cw, c("case", "part", "variable", "interval_level"))
write_table(cs, "component_summary_by_case.csv"); write_table(vs, "component_summary_by_variable.csv")
exception <- cw[cw$ratio >= 1, ]; exception <- exception[order(-exception$ratio), ]
write_table(exception, "component_no_narrowing_items.csv")
extremes <- do.call(rbind, lapply(split(cw, key(cw, c("case", "part", "interval_level"))), function(x) {
  x[unique(c(which.min(x$ratio), which.max(x$ratio))), , drop = FALSE]
}))
write_table(extremes, "component_ratio_extremes.csv")
shape <- cp[c("case", "part", "variable", "region", "time_index")]
for (ver in c("V1", "V2")) shape[[paste0("width50_over_width95_", ver)]] <-
  (cp[[paste0("q75_", ver)]] - cp[[paste0("q25_", ver)]]) / (cp[[paste0("q975_", ver)]] - cp[[paste0("q025_", ver)]])
write_table(shape, "interval_shape_ratios.csv")

# Centering convention check: arithmetic average of each V2 time posterior mean.
# An exported near-zero average checks this convention; it is not convergence,
# effective-sample-size, coverage or accuracy evidence. No values are recentered.
v2_time <- co[co$version == "V2" & co$part == "time", ]
centering <- do.call(rbind, lapply(split(v2_time, key(v2_time, c("case", "variable"))), function(x) {
  finite <- is.finite(x$point)
  avg <- if (all(finite)) mean(x$point) else NA_real_
  scale <- if (all(finite)) max(abs(x$point)) else NA_real_
  data.frame(case = x$case[1], variable = x$variable[1], n_time = nrow(x), n_finite = sum(finite),
    arithmetic_mean_of_posterior_means = avg, sum_of_posterior_means = if (all(finite)) sum(x$point) else NA_real_,
    abs_arithmetic_mean = abs(avg), max_abs_time_posterior_mean = scale,
    numerical_tolerance = 1e-8, within_numerical_tolerance = if (is.finite(avg)) abs(avg) < 1e-8 else NA)
}))
center_vars <- read_data("variables.csv")
centering$variable_code <- center_vars$variable_code[match(key(centering, c("case", "variable")), key(center_vars, c("case", "variable")))]
centering <- centering[order(match(centering$case, case_order), centering$variable_code), ]
stopifnot(nrow(centering) == 22L, !anyNA(centering$variable_code))
write_table(centering, "v2_time_centering_check.csv")

# V2 zero exclusion is a descriptive interval property of that version's component.
# V1 and V2 component centering differs; do not interpret a sign transition as a test.
zero <- do.call(rbind, lapply(c(95L, 50L), function(level) {
  lo <- co[[if (level == 95) "q025" else "q25"]]; hi <- co[[if (level == 95) "q975" else "q75"]]
  d <- co[co$version == "V2", c("case", "part", "variable", "region", "time_index")]
  ix <- co$version == "V2"; l <- lo[ix]; h <- hi[ix]
  d$interval_level <- level; d$lo <- l; d$hi <- h
  d$interval_state <- ifelse(is.na(l) | is.na(h), "missing", ifelse(l > 0, "above_zero", ifelse(h < 0, "below_zero", "includes_zero")))
  d
}))
write_table(zero, "v2_zero_exclusion_items.csv")
zs <- do.call(rbind, lapply(split(zero, key(zero, c("case", "part", "variable", "interval_level"))), function(x) {
  data.frame(x[1, c("case", "part", "variable", "interval_level")], n_all = nrow(x),
    n_above = sum(x$interval_state == "above_zero"), n_below = sum(x$interval_state == "below_zero"),
    n_includes = sum(x$interval_state == "includes_zero"), n_missing = sum(x$interval_state == "missing"),
    share_excludes = mean(x$interval_state %in% c("above_zero", "below_zero")))
}))
write_table(zs, "v2_zero_exclusion_by_variable.csv")
zc <- do.call(rbind, lapply(split(zero, key(zero, c("case", "part", "interval_level"))), function(x) {
  data.frame(x[1, c("case", "part", "interval_level")], n_all = nrow(x),
    n_above = sum(x$interval_state == "above_zero"), n_below = sum(x$interval_state == "below_zero"),
    n_includes = sum(x$interval_state == "includes_zero"), n_missing = sum(x$interval_state == "missing"))
}))
write_table(zc, "v2_zero_exclusion_by_case.csv")

# Experiment 2: software-exported fitted-quantity marginals, paired by region/time.
# Historical fitted_mean field/file names are retained. HALE exp(mu) is not
# generally E[Y]; no lognormal mean or observation-noise correction is inferred.
# These are not posterior predictive intervals for a future observation.
fi <- read_data("fitted_mean_quantiles.csv")
assert_quantiles(fi, c("q025", "q25", "q50", "q75", "q975"), "fitted means")
stopifnot(!anyNA(fi[c("case", "version", "region", "time_value")]))
fp <- pair_versions(fi, c("case", "region", "time_value", "scale"), c("observed_y_missing", "q025", "q25", "q50", "q75", "q975"), "GUI_fitted_means")
stopifnot(identical(fp$observed_y_missing_V1, fp$observed_y_missing_V2))
stopifnot(identical(as.integer(table(factor(fp$case, levels = case_order))), c(3717L, 372L, 60L)))
fw <- rbind(with_widths(fp, 95), with_widths(fp, 50))
write_table(fw, "fitted_mean_interval_pairs.csv")
write_table(fw[!fw$valid_ratio, ], "fitted_mean_invalid_pairs.csv")
fs <- summarize_ratios(fw, c("case", "interval_level", "scale"))
write_table(fs, "fitted_mean_summary.csv")
write_table(fw[order(-fw$ratio), ][seq_len(min(24L, nrow(fw))), ], "fitted_mean_largest_ratios.csv")
fd <- do.call(rbind, lapply(split(fw, key(fw, c("case", "interval_level"))), function(x) {
  data.frame(x[1, c("case", "interval_level")], n_all = nrow(x),
    observed_y_missing = sum(x$observed_y_missing_V1),
    invalid_with_missing_y = sum(!x$valid_ratio & x$observed_y_missing_V1),
    invalid_with_observed_y = sum(!x$valid_ratio & !x$observed_y_missing_V1),
    valid_with_missing_y = sum(x$valid_ratio & x$observed_y_missing_V1),
    width_v1_below_1e_minus8 = sum(x$width_V1 < 1e-8, na.rm = TRUE),
    ratio_above_2 = sum(x$ratio > 2, na.rm = TRUE))
}))
write_table(fd, "fitted_mean_quality_diagnostics.csv")

# Experiment 3: correctly supplied joint total coefficient via existing lincomb.
# Only the 95% marginal of each sum is available. Do not infer 50% from normality.
lc <- read_data("lincomb_quantiles.csv")
if (any(!is.finite(lc$lo) | !is.finite(lc$hi) | lc$hi <= lc$lo)) stop("Invalid lincomb interval")
lc$q025 <- lc$lo; lc$q975 <- lc$hi
lp <- pair_versions(lc, c("case", "variable", "region", "space_index", "time_index"), c("mean", "q025", "q975"), "existing_lincomb")
stopifnot(identical(as.integer(table(factor(lp$case, levels = case_order))), c(6372L, 2232L, 240L)))
stopifnot(setequal(unique(lp$time_index[lp$case == "c6"]), c(1, 11, 21)))
lw <- with_widths(lp, 95)
write_table(lw, "total_coefficient_interval_pairs.csv")
ls <- summarize_ratios(lw, c("case", "interval_level"))
write_table(ls, "total_coefficient_summary.csv")
write_table(summarize_ratios(lw, c("case", "variable", "interval_level")), "total_coefficient_summary_by_variable.csv")
write_table(summarize_ratios(lw, c("case", "region", "interval_level")), "total_coefficient_summary_by_region.csv")
write_table(lw[lw$case == "c2" & lw$region == "156460000", ], "hainan_total_coefficient_pairs.csv")

# Experiment 4: demonstrate why adding marginal endpoints is not a valid 95% CI.
# Both components and total below come from the SAME existing reconstruction.
# No assumption of independence, no new covariance estimate, no new model fit.
rc <- read_data("refit_component_quantiles.csv")
assert_quantiles(rc, c("0.025quant", "0.975quant"), "refit components")
rk <- unique_keys(rc, c("case", "version", "part", "variable", "idx"), "refit components")
lookup_component <- function(part, index) {
  target <- data.frame(case = lc$case, version = lc$version, part = part, variable = lc$variable, idx = index)
  ix <- match(key(target, c("case", "version", "part", "variable", "idx")), rk)
  if (anyNA(ix)) stop("Unmatched refit component -> lincomb key")
  rc[ix, , drop = FALSE]
}
sp <- lookup_component("space", lc$space_index); tp <- lookup_component("time", lc$time_index)
ee <- lc[c("case", "version", "variable", "region", "space_index", "time_index")]
ee$component_mean_sum <- sp$mean + tp$mean; ee$lincomb_mean <- lc$mean
ee$mean_abs_error <- abs(ee$component_mean_sum - ee$lincomb_mean)
ee$component_space_width <- sp[["0.975quant"]] - sp[["0.025quant"]]
ee$component_time_width <- tp[["0.975quant"]] - tp[["0.025quant"]]
ee$endpoint_sum_width <- ee$component_space_width + ee$component_time_width
ee$lincomb_width <- lc$hi - lc$lo
ee$endpoint_sum_over_joint_width <- ee$endpoint_sum_width / ee$lincomb_width
if (any(!is.finite(ee$endpoint_sum_over_joint_width)) || any(ee$endpoint_sum_width <= 0)) stop("Invalid endpoint-addition diagnostic")
if (max(ee$mean_abs_error) >= 1e-9) stop("Mean identity failed: components do not reproduce supplied lincomb means")
write_table(ee, "endpoint_addition_diagnostic_items.csv")
es <- do.call(rbind, lapply(split(ee, key(ee, c("case", "version"))), function(x) {
  z <- quantile(x$endpoint_sum_over_joint_width, c(0, .05, .25, .5, .75, .95, 1), names = FALSE)
  data.frame(x[1, c("case", "version")], n = nrow(x), min = z[1], p05 = z[2], p25 = z[3],
    median = z[4], p75 = z[5], p95 = z[6], max = z[7], max_mean_abs_error = max(x$mean_abs_error))
}))
write_table(es, "endpoint_addition_diagnostic_summary.csv")
ge <- read_data("gui_evaluation.csv"); re <- read_data("refit_evaluation.csv")
gk <- unique_keys(ge, c("case", "version"), "GUI evaluation")
ek <- unique_keys(re, c("case", "version"), "existing reconstruction evaluation")
stopifnot(setequal(gk, ek)); re <- re[match(gk, ek), ]
ev <- ge[c("case", "version")]
for (m in c("DIC", "eff", "LS", "waic")) {
  ev[[paste0(m, "_GUI")]] <- ge[[m]]; ev[[paste0(m, "_reconstruction")]] <- re[[m]]
  ev[[paste0(m, "_difference")]] <- re[[m]] - ge[[m]]
}
write_table(ev, "gui_vs_existing_reconstruction_evaluation.csv")

# Existing-reference reconciliation is a numerical check, not new model evidence.
expected <- data.frame(case = rep(case_order, each = 2), part = rep(c("time", "space"), 3),
  reference_pct = c(98.55452, 37.73135, 93.63251, 86.66999, 98.99652, 97.87364))
# Use a direct match into the filtered table (do not rely on summary row order).
c95 <- cs[cs$interval_level == 95, ]
expected$recomputed_pct <- c95$median_narrowing_pct[match(key(expected, c("case", "part")), key(c95, c("case", "part")))]
expected$abs_difference_pct_points <- abs(expected$recomputed_pct - expected$reference_pct)
if (any(expected$abs_difference_pct_points > .00001)) stop("Reference comparison did not reconcile")
write_table(expected, "reference_reconciliation.csv")
write_table(do.call(rbind, checks), "pairing_checks.csv")

# Reproducible base-R research figures: all reviewed items, deterministic placement.
blue <- "#245C92"; gold <- "#B17813"; pink <- "#9F4D73"; gray <- "#5B626A"; ink <- "#182333"
save_figure <- function(name, width, height, draw) {
  for (ext in c("png", "pdf")) {
    path <- file.path(output_root, "figures", paste0(name, ".", ext))
    if (ext == "png") png(path, width = width, height = height, units = "in", res = 300, type = "cairo", bg = "white") else
      pdf(path, width = width, height = height, family = "Helvetica", useDingbats = FALSE)
    tryCatch(draw(), finally = dev.off())
  }
}
base_par <- function(...) par(family = "sans", col = ink, col.axis = ink, col.lab = ink,
  fg = ink, las = 1, cex = 1, lwd = .9, tcl = -.25, ...)
ecdf_line <- function(x, col, lty = 1, lwd = 1.8) {
  e <- ecdf(x); xx <- sort(unique(x)); lines(xx, e(xx), type = "s", col = col, lty = lty, lwd = lwd)
}
axis_log <- function(ticks) axis(1, at = ticks, labels = format(ticks, scientific = FALSE, trim = TRUE), cex.axis = .85)
ratio_lim <- c(0.0005, 2)
ratio_ticks <- c(.001, .01, .1, 1, 2)
save_figure("fig01_component_width_ecdf", 11.6, 5.2, function() {
  base_par(mfrow = c(1, 3), mar = c(4.9, 4.2, 3.2, 1), oma = c(1.7, 0, 1.5, 0))
  for (c in case_order) {
    x <- cw[cw$case == c, ]; plot(NA, xlim = ratio_lim, ylim = c(0, 1), log = "x", xaxt = "n",
      xlab = "V2 / V1 interval width (log scale)", ylab = if (c == "c6") "Cumulative share of paired items" else "", main = case_title[c], bty = "l")
    abline(h = c(.25, .5, .75, 1), col = "#E7E9EC", lwd = .7); abline(v = 1, lty = 3, col = gray)
    for (p in c("time", "space")) for (lev in c(95, 50)) ecdf_line(x$ratio[x$part == p & x$interval_level == lev],
      if (p == "time") blue else gold, if (lev == 95) 1 else 2)
    axis_log(ratio_ticks)
    legend("topleft", legend = c("Time 95%", "Time 50%", "Space 95%", "Space 50%"),
      col = c(blue, blue, gold, gold), lty = c(1, 2, 1, 2), bty = "n", cex = .78, lwd = 1.6)
  }
  mtext("Central marginal credible intervals of exported components", outer = TRUE, side = 3, line = .2, cex = 1.1, font = 2)
  mtext("Every paired item is retained; the 50% and 95% curves nearly coincide. Narrower components do not establish accuracy or coverage.",
    outer = TRUE, side = 1, line = .25, cex = .83)
})
save_figure("fig02_component_total_fitted_widths", 11.6, 6.1, function() {
  base_par(mfrow = c(1, 3), mar = c(5.1, 6.8, 4, .8), oma = c(3, 0, 1.6, 0))
  for (c in case_order) {
    groups <- list(cw$ratio[cw$case == c & cw$part == "time" & cw$interval_level == 95],
      cw$ratio[cw$case == c & cw$part == "space" & cw$interval_level == 95], lw$ratio[lw$case == c],
      fw$ratio[fw$case == c & fw$interval_level == 95 & fw$valid_ratio])
    labs <- c("Time component", "Space component", "Joint total (lincomb)", "Fitted mean")
    plot(NA, xlim = ratio_lim, ylim = c(.4, 4.6), log = "x", xaxt = "n", yaxt = "n", bty = "l",
      xlab = "V2 / V1 95% width (log scale)", ylab = "", main = case_title[c])
    abline(v = 1, lty = 3, col = gray); axis_log(ratio_ticks)
    for (j in 1:4) {
      v <- groups[[j]]; yy <- 5 - j; col <- c(blue, gold, pink, gray)[j]
      in_range <- v >= ratio_lim[1] & v <= ratio_lim[2]
      points(v[in_range], yy + .105 * sin(which(in_range) * 2.399963), pch = 16, col = adjustcolor(col, alpha.f = .18), cex = .45)
      if (any(!in_range)) {
        points(ratio_lim[2], yy, pch = 24, bg = col, col = col, cex = .9)
        text(.9 * ratio_lim[2], yy + .27, paste0(sum(!in_range), " > 2"), pos = 2, cex = .7, col = col)
      }
      qs <- quantile(v, c(.05, .25, .5, .75, .95)); segments(qs[1], yy, qs[5], yy, col = ink, lwd = .7)
      segments(qs[2], yy, qs[4], yy, col = ink, lwd = 2); points(qs[3], yy, pch = 23, bg = "white", col = ink, cex = 1)
      axis(2, at = yy, labels = paste0(labs[j], "\n(n=", length(v), ")"), tick = FALSE, cex.axis = .8)
    }
    mtext(if (c == "c6") "Total: 3 selected years; fitted: 253 zero widths" else "Total: all supplied region-time combinations", side = 3, line = .5, cex = .68)
  }
  mtext("Different uncertainty objects respond differently (95%)", outer = TRUE, side = 3, line = .2, cex = 1.1, font = 2)
  mtext("Dots: valid pairs; triangle: values above display window. IQR and 5th-95th item percentiles summarize spread, not posterior uncertainty.",
    outer = TRUE, side = 1, line = .15, cex = .76)
  mtext("Window: 0.0005-2. Complete fitted-mean ratios, including the extreme tail, appear in Fig. 5 and the downloadable CSV.",
    outer = TRUE, side = 1, line = 1.15, cex = .76)
})
sum_lim <- range(ee$endpoint_sum_over_joint_width)
sum_lim <- c(min(.9, sum_lim[1]), 10^ceiling(log10(sum_lim[2])))
save_figure("fig03_endpoint_addition_error", 11.6, 5.2, function() {
  base_par(mfrow = c(1, 3), mar = c(5, 4.2, 3.1, 1), oma = c(1.7, 0, 1.7, 0))
  for (c in case_order) {
    x <- ee[ee$case == c, ]; plot(NA, xlim = sum_lim, ylim = c(0, 1), log = "x", xaxt = "n", bty = "l",
      xlab = "Endpoint-sum width / joint width (log)", ylab = if (c == "c6") "Cumulative share of supplied totals" else "", main = case_title[c])
    abline(h = c(.25, .5, .75, 1), col = "#E7E9EC", lwd = .7); abline(v = 1, col = gray, lty = 3)
    axis_log(c(1, 2, 5, 10, 20, 50, 100, 200, 500)[c(1, 2, 5, 10, 20, 50, 100, 200, 500) <= sum_lim[2]])
    for (ver in c("V1", "V2")) ecdf_line(x$endpoint_sum_over_joint_width[x$version == ver], if (ver == "V1") gold else blue, if (ver == "V1") 2 else 1)
    q <- es[es$case == c, ]; q <- q[match(c("V1", "V2"), q$version), ]
    legend("topleft", legend = sprintf("%s median: %.3f x", q$version, q$median), col = c(gold, blue), lty = c(2, 1), bty = "n", lwd = 1.8, cex = .85)
  }
  mtext("Adding marginal endpoints does not give a 95% interval for the sum", outer = TRUE, side = 3, line = .2, cex = 1.1, font = 2)
  mtext("Numerator: width(space marginal) + width(time marginal). Denominator: supplied joint lincomb width. HALE totals cover 3 years only.",
    outer = TRUE, side = 1, line = .25, cex = .8)
})
vmap <- read_data("variables.csv")
vmap <- vmap[order(match(vmap$case, case_order), vmap$variable_code), ]
vmap$english <- c("Maternal mortality", "High alcohol use", "High BMI", "Vitamin A deficiency", "Female employment", "Urban population",
  "National income/person", "Health spending/GDP", "Physicians per 1,000", "High-temperature exposure", "Vegetation index", "Annual PM2.5",
  "PM2.5", "Mean temperature", "Vegetation index", "Nighttime lights", "In-migration", "Out-migration",
  "Population density", "Uninsured rate", "Poverty rate", "Annual precipitation")
stopifnot(nrow(vmap) == 22)
write_table(vmap, "variable_dictionary.csv")
vmap$figure_label <- c("Maternal mortality", "Alcohol use", "High BMI", "Vitamin A deficiency", "Female employment", "Urban population",
  "Income per person", "Health spending/GDP", "Physicians/1,000", "Heat exposure", "Vegetation index", "Annual PM2.5",
  "PM2.5", "Temperature", "Vegetation index", "Nighttime lights", "In-migration", "Out-migration",
  "Population density", "Uninsured rate", "Poverty rate", "Precipitation")
save_figure("fig04_v2_zero_exclusion", 13.6, 7, function() {
  base_par(mfrow = c(1, 3), mar = c(5.1, 9.4, 3.2, .7), oma = c(2, 0, 1.6, 0))
  for (c in case_order) {
    vm <- vmap[vmap$case == c, ]; nv <- nrow(vm)
    plot(NA, xlim = c(0, 100), ylim = c(.4, nv + 1.7), xaxt = "n", yaxt = "n", bty = "l",
      xlab = "V2 intervals excluding zero (%)", ylab = "", main = case_title[c])
    axis(1, at = seq(0, 100, 25)); abline(v = seq(0, 100, 25), col = "#E7E9EC", lwd = .7)
    axis(2, at = nv:1, labels = paste(vm$variable_code, vm$figure_label), tick = FALSE, cex.axis = .7)
    for (p in c("time", "space")) for (lev in c(95, 50)) {
      z <- zs[zs$case == c & zs$part == p & zs$interval_level == lev, ]; z <- z[match(vm$variable, z$variable), ]
      points(100 * z$share_excludes, nv:1 + (if (p == "time") .16 else -.16),
        pch = if (lev == 95) 16 else 1, col = if (p == "time") blue else gold, cex = if (lev == 95) .9 else 1.15)
    }
    legend("top", inset = -.005, legend = c("Time 95% / 50%", "Space 95% / 50%"), col = c(blue, gold), pch = c(16, 16), bty = "n", cex = .73)
  }
  mtext("V2 component intervals: exclusion of zero", outer = TRUE, side = 3, line = .2, cex = 1.1, font = 2)
  mtext("Filled: 95%; open: 50%. This is descriptive, without multiplicity adjustment. Changed centering prevents a V1/V2 significance interpretation.",
    outer = TRUE, side = 1, line = .25, cex = .79)
})
save_figure("fig05_fitted_mean_full_distribution", 11.6, 5.9, function() {
  base_par(mfrow = c(1, 3), mar = c(5, 4.2, 3.7, 1), oma = c(3, 0, 1.7, 0))
  full_lim <- c(.1, 1e12)
  for (c in case_order) {
    x <- fw[fw$case == c & fw$valid_ratio, ]; plot(NA, xlim = full_lim, ylim = c(0, 1), log = "x", xaxt = "n", bty = "l",
      xlab = "V2 / V1 fitted-mean width (log scale)", ylab = if (c == "c6") "Cumulative share of valid pairs" else "", main = case_title[c])
    abline(h = c(.25, .5, .75, 1), col = "#E7E9EC", lwd = .7); abline(v = 1, col = gray, lty = 3)
    axis(1, at = 10^c(-1, 0, 3, 6, 9, 12), labels = c("0.1", "1", "1e3", "1e6", "1e9", "1e12"), cex.axis = .8)
    for (lev in c(95, 50)) ecdf_line(x$ratio[x$interval_level == lev], if (lev == 95) blue else gold, if (lev == 95) 1 else 2)
    legend("topleft", legend = c("95%", "50%"), col = c(blue, gold), lty = c(1, 2), bty = "n", lwd = 1.8, cex = .85)
    mtext(if (c == "c6") "3464 valid / 3717; 253 zero widths" else if (c == "c2") "372 valid; extreme tail retained" else "60 valid / 60", side = 3, line = .5, cex = .72)
  }
  mtext("Fitted-mean width ratios: complete dynamic range", outer = TRUE, side = 3, line = .2, cex = 1.1, font = 2)
  mtext("COVID-19 / Hainan / month 12: 95% width rises from 7.659e-11 to 0.5391 (ratio 7.039e9). A small denominator drives the ratio.",
    outer = TRUE, side = 1, line = .15, cex = .8)
  mtext("These intervals describe fitted-mean marginals, not uncertainty for a future observation.", outer = TRUE, side = 1, line = 1.2, cex = .8)
})

# Portable JSON summary without an additional package dependency.
json <- function(x) {
  if (is.null(x)) return("null")
  if (is.data.frame(x)) return(paste0("[", paste(vapply(seq_len(nrow(x)), function(i) json(as.list(x[i, , drop = FALSE])), ""), collapse = ","), "]"))
  if (is.list(x)) {
    z <- vapply(x, json, "")
    if (!is.null(names(x))) z <- paste0(vapply(names(x), function(n) encodeString(n, quote = '"'), ""), ":", z)
    return(paste0(if (is.null(names(x))) "[" else "{", paste(z, collapse = ","), if (is.null(names(x))) "]" else "}"))
  }
  if (length(x) != 1L) return(paste0("[", paste(vapply(as.list(x), json, ""), collapse = ","), "]"))
  if (is.na(x)) return("null")
  if (is.character(x)) return(encodeString(x, quote = '"'))
  if (is.logical(x)) return(if (x) "true" else "false")
  if (!is.finite(x)) return("null")
  format(x, digits = 17, scientific = FALSE, trim = TRUE)
}
summary <- list(scope = "Post-estimation only; existing Chinese V03 12X/20-thread reference and V2 GUI outputs",
  not_evidence_for = c("coverage calibration", "convergence", "parameter recovery", "out-of-sample prediction", "overall accuracy"),
  component_summary = cs, v2_time_centering = centering,
  v2_time_centering_max_abs_mean = max(centering$abs_arithmetic_mean),
  v2_time_centering_interpretation = "Arithmetic averages of exported V2 time posterior means; tolerance 1e-8 is a numerical convention check, not convergence evidence",
  exported_fitted_quantity_terminology = "Historical fitted_mean labels are retained; HALE exp(mu) must not generally be identified with E[Y]. Exported quantile bounds are used unchanged.",
  fitted_mean_summary = fs, fitted_mean_quality = fd, total_coefficient_summary = ls,
  endpoint_addition_summary = es, v2_zero_exclusion = zc, pairing_checks = do.call(rbind, checks),
  gui_vs_existing_reconstruction = ev,
  maximum_mean_identity_error = max(ee$mean_abs_error), reference_reconciliation = expected,
  limitations = c("V1 and V2 component centering differs", "lincomb results are from an existing independent reconstruction, not the GUI fit",
    "HALE total coefficients cover only first, middle and last years", "Total coefficient 50% intervals were not supplied",
    "Exported fitted-quantity marginals are not posterior predictive intervals", "Invalid exported fitted-quantity widths are retained and enumerated"))
writeLines(json(summary), file.path(output_root, "summary.json"), useBytes = TRUE)
html_escape <- function(x) {
  x <- gsub("&", "&amp;", as.character(x), fixed = TRUE)
  x <- gsub("<", "&lt;", x, fixed = TRUE); gsub(">", "&gt;", x, fixed = TRUE)
}
html_table <- function(d) {
  head <- paste0("<thead><tr>", paste0("<th>", html_escape(names(d)), "</th>", collapse = ""), "</tr></thead>")
  rows <- vapply(seq_len(nrow(d)), function(i) paste0("<tr>", paste0("<td>", html_escape(unlist(d[i, ], use.names = FALSE)), "</td>", collapse = ""), "</tr>"), "")
  paste0("<div class=\"table-scroll\"><table>", head, "<tbody>", paste(rows, collapse = ""), "</tbody></table></div>")
}
zh_case <- c(c6 = "全球健康预期寿命（12X）", c2 = "中国 COVID-19", c3 = "美国乙肝")
tab <- c95[match(key(expected, c("case", "part")), key(c95, c("case", "part"))), ]
tab <- data.frame(案例 = zh_case[tab$case], 分量 = ifelse(tab$part == "time", "时间", "空间"), 配对项 = tab$n_all,
  中位收窄百分比 = sprintf("%.5f%%", tab$median_narrowing_pct), 变窄项 = tab$n_narrower, 变宽项 = tab$n_wider,
  最小宽度比 = sprintf("%.6g", tab$ratio_min), 最大宽度比 = sprintf("%.6g", tab$ratio_max), check.names = FALSE)
et <- es[order(match(es$case, case_order), es$version), ]
et <- data.frame(案例 = zh_case[et$case], 版本 = et$version, 总系数项 = et$n,
  端点相加宽度除以正确总系数宽度_中位倍数 = sprintf("%.5f", et$median), check.names = FALSE)
st <- ls[match(case_order, ls$case), ]
ft <- fs[fs$interval_level == 95, ]; ft <- ft[match(case_order, ft$case), ]
st <- data.frame(案例 = zh_case[st$case], 重建总系数配对项 = st$n_all, 重建总系数95宽度中位比 = sprintf("%.6f", st$ratio_median),
  GUI导出拟合量有效项 = paste0(ft$n_valid, "/", ft$n_all), GUI导出拟合量95宽度中位比 = sprintf("%.6f", ft$ratio_median), check.names = FALSE)
fig_names <- c("fig01_component_width_ecdf", "fig02_component_total_fitted_widths", "fig03_endpoint_addition_error", "fig04_v2_zero_exclusion", "fig05_fitted_mean_full_distribution")
fig_captions <- c("时间与空间分量：每一配对项的95%及50%区间宽度比分布。两级曲线几乎重合，不能把它们视作两次独立的准确性证明。",
  "分量、总系数和软件导出的拟合量属于不同对象。显示窗口为0.0005至2，COVID拟合量超界18项以三角形标出；完整尾部见图5。线段表示跨条目的分布，不是后验可信区间。",
  "端点相加错误示范：两个边际区间宽度之和除以既有lincomb总系数区间宽度。这个分子不构成总系数的95%可信区间。",
  "仅描述V2：实心为95%区间，空心为50%区间。蓝色为时间分量，金色为空间分量。未做多重比较调整；不能解释为V1/V2显著性变化。",
  "软件导出的拟合量后验区间宽度比的完整动态范围。海南第12月95%宽度从7.659×10⁻¹¹变为0.5391，中位数不能代表所有地区月份。")
fig_html <- vapply(seq_along(fig_names), function(i) paste0("<figure><img loading=\"lazy\" src=\"assets/guide-v2/", fig_names[i], ".png\" alt=\"新增实验图", i, "\"><figcaption>图", i, "　", fig_captions[i], " <a href=\"assets/guide-v2/", fig_names[i], ".pdf\">PDF</a></figcaption></figure>"), "")
fragment <- c('<section id="v2-postestimation-research">', '<h2>新版区间解释：五项可复现后估计实验</h2>',
  '<p>这些实验重新读取中文版V03的三个参考案例及新版GUI导出表，按唯一键逐项配对并独立复算。HALE采用12个协变量的20线程基线；代码只分析既有结果，不运行模型拟合、抽样或私有算法。</p>',
  '<p><strong>解释边界：</strong>两版分量的中心化定义不同。区间收窄描述的是所导出的分量边际不确定性，不能单凭收窄推出准确率、收敛、覆盖率、因果识别或样本外预测的全面提升。</p>',
  sprintf('<p><strong>时间中心化核查：</strong>22个变量各自的V2时间分量posterior mean在全部时间点上的算术平均，最大绝对值为%.6g；22项均小于本次明示数值容差10⁻⁸。这验证所导出均值的中心化口径相容，不是收敛、覆盖率或准确性证据，也没有重新中心化任何数值。</p>', max(centering$abs_arithmetic_mean)),
  '<p><strong>拟合量术语：</strong>本节沿用图表和文件中的历史fitted_mean标识，实际计算对象是软件导出的拟合量后验区间。HALE的exp(mu)一般不能直接解释为E[Y]，本次未补入对数正态均值修正或观测误差；这些区间也不是未来观测的预测区间。</p>',
  '<h3>1. 中位收窄与逐项例外</h3>', html_table(tab),
  '<p>95%与50%区间分别由原始导出分位数计算；六组中位收窄百分比与参考报告一致。HALE空间分量中有76/2124项变宽，最大宽度比约1.01648，故“每一个区间都更窄”不成立。完整分变量与例外表见复现结果。</p>', fig_html[1],
  '<h3>2. 分量收窄不等同于总系数或导出拟合量同幅收窄</h3>', html_table(st),
  '<p>总系数取自既有独立重建模型的lincomb结果，是辅助核查；HALE仅覆盖2000、2010、2020三个年份。它与GUI原拟合不是数值完全相同的对象：例如HALE V1重建DIC比GUI高2.10268，且HALE重建LS未提供。因此不能把该辅助核查称为GUI原拟合的完整复现。</p>',
  '<p>海南的总系数72项全部变窄，中位宽度比0.131108；与之同时，海南第12月导出拟合量95%区间宽度比高达7.039×10⁹。两个结果描述不同统计对象，不能互相替代。</p>', fig_html[2],
  '<h3>3. 为什么不能把边际区间端点直接相加</h3>', html_table(et),
  '<p>同一既有重建中，分量均值相加与lincomb均值的最大绝对差为9.144×10⁻¹³，支持索引配对的内部一致性；但边际区间端点相加忽略联合相关结构。宽度倍数从约1.05到82.07的中位差异说明，两种算法不能混用。现有总系数CSV未提供50%分位数，本次没有据正态近似补造。</p>', fig_html[3],
  '<h3>4. V2区间是否跨零，应按其自身定义读取</h3>',
  '<p>输出逐项的高于零、低于零、包含零状态及变量汇总。这里的区间排除零只是一项描述性后验区间性质；没有多重比较调整，也不构成两版“显著性改变”的检验。</p>', fig_html[4],
  '<h3>5. 导出拟合量的异常分母与无效宽度</h3>',
  '<p>HALE 3717个地区年份中，3464项有正区间宽度；253项两版所有导出分位数均为1、宽度为0，均对应原导出Y缺失，因此宽度比保留为NA。全部273项Y缺失中另有20项仍有正宽度，不能机械地删除全部缺失Y行。</p>',
  '<p>COVID的372项均可计算宽度比，但95%中有18项大于2；第12月海南的极大比值来自极小V1分母。HALE、COVID与HBV的导出拟合量区间中位比接近1，仍不能代表极端项。这里的输出属于软件导出的拟合量后验区间，不能称未来观测的预测区间。</p>', fig_html[5],
  '<p><a download href="assets/guide-v2/bstvc-v2-postestimation-reproducible.zip">下载R脚本与最少复现数据</a> · <a href="assets/guide-v2/postestimation-summary.json">机器可读汇总</a></p>', '</section>')
writeLines(fragment, file.path(output_root, "summary-fragment.html"), useBytes = TRUE)
writeLines(capture.output(sessionInfo()), file.path(output_root, "sessionInfo.txt"))
cat("Complete: post-estimation checks, tables and five PNG/PDF figures.\n")
print(cs); print(fs); print(ls); print(es)
cat("Maximum mean-identity error:", max(ee$mean_abs_error), "\n")
