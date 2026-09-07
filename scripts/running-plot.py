import os
import logging
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectTooManyRequestsError,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def initialize_garmin_client() -> Garmin:
    token_store = Path.home() / ".garminconnect"

    try:
        logger.info(f"Attempting to login using stored tokens from {token_store}...")
        client = Garmin()
        client.login(token_store)
        return client
    except Exception:
        logger.info("Stored tokens invalid or not found. Falling back to environment variables...")

    email = os.getenv("GARMIN_EMAIL")
    password = os.getenv("GARMIN_PASSWORD")

    if not email or not password:
        raise ValueError("Missing GARMIN_EMAIL or GARMIN_PASSWORD environment variables.")

    client = Garmin(email=email, password=password)
    client.login(token_store)
    return client

def get_combined_trail_runs_dataset() -> pd.DataFrame:
    client = initialize_garmin_client()

    logger.info("Fetching activity list from Garmin Connect...")
    activities = []
    start, limit = 0, 1000

    while True:
        batch = client.get_activities(start, limit)
        if not batch:
            break
        activities.extend(batch)
        if len(batch) < limit:
            break
        start += limit

    trail_runs = [
        act for act in activities 
        if act.get("activityType", {}).get("typeKey", "").lower() == "trail_running"
    ]

    all_laps = []
    column_mapping = {
        "lapIndex": "lap_id",
        "avgGradeAdjustedSpeed": "grade_adjusted_speed",
        "averageHR": "averageHr",
        "distance": "distance",
    }

    for act in trail_runs:
        activity_id = act["activityId"]
        start_time_local = act.get("startTimeLocal", "")

        try:
            splits_data = client.get_activity_splits(activity_id)
            splits_list = []
            if isinstance(splits_data, dict):
                for key in ["lapDTOs", "splits", "splitSummaries"]:
                    if key in splits_data:
                        splits_list = splits_data[key]
                        break
                if not splits_list:
                    splits_list = [splits_data]
            elif isinstance(splits_data, list):
                splits_list = splits_data

            if splits_list:
                df_laps = pd.DataFrame(splits_list)
                df_laps["run_id"] = activity_id
                df_laps["startTimeLocal"] = start_time_local

                existing_cols = [col for col in column_mapping.keys() if col in df_laps.columns]
                selected_df = df_laps[["run_id", "startTimeLocal"] + existing_cols].copy()
                selected_df.rename(columns=column_mapping, inplace=True)
                all_laps.append(selected_df)

        except Exception as e:
            logger.error(f"Failed to fetch splits for activity {activity_id}: {e}")

    if all_laps:
        combined_df = pd.concat(all_laps, ignore_index=True)
        final_cols = ["run_id", "startTimeLocal", "lap_id", "grade_adjusted_speed", "averageHr", "distance"]
        existing_final_cols = [c for c in final_cols if c in combined_df.columns]
        return combined_df[existing_final_cols]
    
    return pd.DataFrame()

def generate_and_save_plot(df: pd.DataFrame, output_path: Path):
    """Generates a scatter plot of Average HR vs Grade Adjusted Speed and saves it."""
    # Drop missing values to prevent plotting errors
    clean_df = df.dropna(subset=["averageHr", "grade_adjusted_speed"])

    if clean_df.empty:
        logger.warning("No valid data available to generate plot.")
        return

    # Ensure target folder exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(10, 6))
    plt.scatter(clean_df["grade_adjusted_speed"], clean_df["averageHr"], alpha=0.6, edgecolors="none")
    
    plt.title("Trail Run Laps: Average Heart Rate vs. Grade Adjusted Speed")
    plt.xlabel("Grade Adjusted Speed")
    plt.ylabel("Average Heart Rate (bpm)")
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()

    plt.savefig(output_path, dpi=300)
    plt.close()
    logger.info(f"Plot saved successfully to {output_path}")

if __name__ == "__main__":
    combined_trail_df = get_combined_trail_runs_dataset()
    
    if not combined_trail_df.empty:
        plot_output = Path("docs/public/images/running-plot-auto.png")
        generate_and_save_plot(combined_trail_df, plot_output)
    else:
        logger.warning("No trail running data found.")