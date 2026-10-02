# BSTVC Desktop: optional English visualization companion.
# Use exported workbooks, not raw case input tables. No model fitting occurs here.
# Install packages once if needed:
# install.packages(c("readxl", "ggplot2", "dplyr", "tidyr", "sf", "scales", "pROC"))
# Select continuous, binary, or count; retain the settings matching your own run.
case_type <- "count"
settings <- switch(case_type,
 continuous = list(id = "ISO_A3", time = "Year", first = 2000, ntime = 21),
 binary = list(id = "gb", time = "Month", first = 1, ntime = 12),
 count = list(id = "GEOID", time = "YEAR", first = 2012, ntime = 12),
 stop("Choose continuous, binary, or count."))
library(readxl)
library(ggplot2)
library(dplyr)
library(tidyr)
library(sf)
require_fields <- function(data, fields, label) {
 missing <- setdiff(fields, names(data))
 if (length(missing)) stop(label, ": missing fields: ", paste(missing, collapse = ", "))
}
cat("Select your exported BSTVC result workbook.\n")
workbook <- file.choose()
sheet_names <- excel_sheets(workbook)
expected_sheets <- c("model.evaluation", "local.prediction", "time.coefficients", "space.coefficients", "STVPI")
if (!all(expected_sheets %in% sheet_names)) stop("Select a full exported result workbook containing the expected sheets.")
read_sheet <- function(name) as.data.frame(read_excel(workbook, sheet = name))
evaluation <- read_sheet("model.evaluation")
prediction <- read_sheet("local.prediction")
temporal <- read_sheet("time.coefficients")
spatial <- read_sheet("space.coefficients")
contribution <- read_sheet("STVPI")
print(evaluation)
str(prediction)
output_folder <- file.path(dirname(workbook), paste0("BSTVC-figures-", case_type))
dir.create(output_folder, showWarnings = FALSE)
save_plot <- function(p, name, width = 12, height = 8) {
 print(p)
 ggsave(file.path(output_folder, name), p, width = width, height = height, dpi = 300, bg = "white")
}
# 1. Temporal coefficients with posterior credible intervals.
require_fields(temporal, c("time_index", "explain_variable", "mean", "0.025quant", "0.975quant", "0.25quant", "0.75quant"), "time.coefficients")
if (anyNA(temporal$time_index) || any(!temporal$time_index %in% seq_len(settings$ntime))) stop("Check time_index and the selected case configuration.")
temporal$Period <- settings$first + temporal$time_index - 1
temporal$explain_variable <- sub("^time\\.", "", temporal$explain_variable)
temporal <- arrange(temporal, explain_variable, Period)
coefficient_label <- switch(case_type, binary = "Temporal coefficient (log-odds scale)", count = "Temporal coefficient (log-mean scale)", "Temporal coefficient (log-response scale)")
p_time <- ggplot(temporal, aes(Period, mean, fill = explain_variable, colour = explain_variable)) +
 geom_ribbon(aes(ymin = .data[["0.025quant"]], ymax = .data[["0.975quant"]]), alpha = .12, colour = NA) +
 geom_ribbon(aes(ymin = .data[["0.25quant"]], ymax = .data[["0.75quant"]]), alpha = .35, colour = NA) +
 geom_line() + geom_point(size = 1) + facet_wrap(~explain_variable, scales = "free_y", ncol = 3) +
 labs(x = settings$time, y = coefficient_label, title = "Temporal associations and posterior uncertainty") +
 theme_minimal(base_size = 12) + theme(legend.position = "none")
save_plot(p_time, "01-temporal-credible-intervals.png")
# Optional display smoother. It does not replace posterior means or credible intervals.
p_smooth <- ggplot(temporal, aes(Period, mean, colour = explain_variable)) +
 geom_point(size = 1.5) + geom_smooth(method = "loess", se = FALSE, span = 1) +
 labs(x = settings$time, y = coefficient_label, colour = "Predictor", title = "Annual estimates with a descriptive smoother") + theme_minimal(base_size = 12)
save_plot(p_smooth, "02-temporal-display-smoother.png")
# 2. Relative spatiotemporal contribution. Column order follows the supplied manual.
if (ncol(contribution) != 7) stop("STVPI schema differs from the seven-column source example; inspect names before mapping columns.")
names(contribution) <- c("id", "q025", "q25", "mean", "q75", "q975", "effect_name")
for (v in c("q025", "q25", "mean", "q75", "q975")) {
 if (!is.numeric(contribution[[v]])) stop("STVPI quantiles must be numeric; inspect the workbook.")
}
# Source STVPI exports are proportions. Do not divide these values by 100 again.
if (any(contribution$mean < 0 | contribution$mean > 1, na.rm = TRUE)) stop("STVPI scale differs from the source proportion scale; verify before plotting.")
p_stvpi <- ggplot(contribution, aes(mean, reorder(effect_name, mean))) +
 geom_segment(aes(x = q025, xend = q975, yend = effect_name), linewidth = .7, colour = "#b1cfc9") +
 geom_segment(aes(x = q25, xend = q75, yend = effect_name), linewidth = 2, colour = "#087f79") +
 geom_point(size = 2, colour = "#15343c") + scale_x_continuous(labels = scales::label_percent()) +
 labs(x = "Relative contribution", y = "Modeled component", title = "Spatiotemporal contribution with posterior uncertainty") + theme_minimal(base_size = 12)
save_plot(p_stvpi, "03-spatiotemporal-contribution.png", height = max(8, nrow(contribution) * .25))
# 3. Prediction accuracy on the exported response scale.
require_fields(prediction, c("y", "predict_y", settings$id, settings$time), "local.prediction")
if (!is.numeric(prediction$y) || !is.numeric(prediction$predict_y)) stop("Observed and predicted values must be numeric.")
observed <- prediction[is.finite(prediction$y) & is.finite(prediction$predict_y), , drop = FALSE]
if (!nrow(observed)) stop("No observed/predicted pairs are available for evaluation.")
y <- observed$y
mu <- observed$predict_y
if (case_type == "binary") {
 if (any(!y %in% c(0, 1)) || any(mu < 0 | mu > 1)) stop("Binary y must be 0/1 and predict_y must contain probabilities.")
 if (length(unique(y)) != 2) stop("ROC/AUC needs both response classes.")
 roc_result <- pROC::roc(y, mu, levels = c(0, 1), direction = "<", quiet = TRUE)
 print(pROC::auc(roc_result))
 roc_data <- data.frame(FPR = 1 - roc_result$specificities, TPR = roc_result$sensitivities)
 p_accuracy <- ggplot(roc_data, aes(FPR, TPR)) + geom_path(colour = "#087f79") +
  geom_abline(slope = 1, intercept = 0, linetype = "dashed", colour = "grey60") + coord_equal() +
  labs(x = "False-positive rate", y = "Sensitivity", title = "ROC curve: positive class = 1") + theme_minimal(base_size = 12)
} else {
 if (case_type == "continuous") {
  sst <- sum((y - mean(y))^2)
  metrics <- c(RMSE = sqrt(mean((y - mu)^2)), R_squared = if (sst > 0) 1 - sum((y - mu)^2) / sst else NA_real_)
 } else {
  if (any(y < 0 | y != floor(y)) || any(mu <= 0)) stop("Count metrics require non-negative integer observations and strictly positive response-scale mean predictions.")
  deviance_terms <- mu - y
  positive <- y > 0
  deviance_terms[positive] <- y[positive] * log(y[positive] / mu[positive]) - (y[positive] - mu[positive])
  mean_deviance <- mean(2 * deviance_terms)
  null_mu <- mean(y)
  null_deviance <- if (null_mu > 0) {
   null_terms <- null_mu - y
   null_terms[positive] <- y[positive] * log(y[positive] / null_mu) - (y[positive] - null_mu)
   mean(2 * null_terms)
  } else 0
  metrics <- c(MAE = mean(abs(y - mu)), Mean_Poisson_Deviance = mean_deviance,
   Deviance_pseudo_R_squared = if (null_deviance > 0) 1 - mean_deviance / null_deviance else NA_real_)
 }
 print(metrics)
 p_accuracy <- ggplot(observed, aes(y, predict_y)) + geom_point(alpha = .55, colour = "#087f79") +
  geom_abline(slope = 1, intercept = 0, linetype = "dashed", colour = "grey60") +
  labs(x = "Observed response", y = "Predicted response", title = "Observed and predicted values") + theme_minimal(base_size = 12)
}
save_plot(p_accuracy, "04-prediction-accuracy.png")
cat("These metrics describe the selected workbook. Independent validation requires a suitable held-out design.\n")
# 4. Geographic joins must use shared IDs, never row position.
cat("Select the matching .shp file. Keep all companion files beside it.\n")
map <- st_read(file.choose(), quiet = TRUE)
require_fields(map, settings$id, "map")
require_fields(spatial, settings$id, "space.coefficients")
map[[settings$id]] <- as.character(map[[settings$id]])
spatial[[settings$id]] <- as.character(spatial[[settings$id]])
prediction[[settings$id]] <- as.character(prediction[[settings$id]])
if (anyDuplicated(map[[settings$id]]) || anyDuplicated(spatial[[settings$id]])) stop("Map and spatial coefficient identifiers must each be unique.")
if (!setequal(map[[settings$id]], spatial[[settings$id]]) || !setequal(map[[settings$id]], prediction[[settings$id]])) stop("Map and result identifiers do not match.")
means <- grep("_mean$", names(spatial), value = TRUE)
if (!length(means)) stop("No predictor_mean spatial columns found; inspect your output schema.")
mapped_coefficients <- left_join(map, spatial, by = settings$id)
mapped_coefficients <- pivot_longer(mapped_coefficients, cols = all_of(means), names_to = "Predictor", values_to = "Coefficient")
mapped_coefficients$Predictor <- sub("_mean$", "", mapped_coefficients$Predictor)
p_space <- ggplot(mapped_coefficients) + geom_sf(aes(fill = Coefficient), colour = "white", linewidth = .1) +
 facet_wrap(~Predictor, ncol = 3) + scale_fill_viridis_c(na.value = "grey90") +
 labs(title = "Spatial associations", x = NULL, y = NULL) + theme_minimal(base_size = 12)
save_plot(p_space, "05-spatial-coefficient-maps.png", width = 14, height = 10)
if (anyDuplicated(prediction[c(settings$id, settings$time)])) stop("Prediction rows must have unique location-time keys.")
mapped_prediction <- left_join(map, prediction, by = settings$id)
p_prediction <- ggplot(mapped_prediction) + geom_sf(aes(fill = predict_y), colour = "white", linewidth = .1) +
 facet_wrap(stats::reformulate(settings$time), ncol = 4) +
 labs(title = "Predicted response across time", x = NULL, y = NULL, fill = "Predicted response") + theme_minimal(base_size = 12)
if (case_type == "binary") {
 p_prediction <- p_prediction + scale_fill_viridis_c(limits = c(0, 1), na.value = "grey90")
} else {
 p_prediction <- p_prediction + scale_fill_viridis_c(na.value = "grey90")
}
save_plot(p_prediction, "06-predicted-response-maps.png", width = 14, height = 10)
cat("Figures saved in: ", output_folder, "\n", sep = "")
