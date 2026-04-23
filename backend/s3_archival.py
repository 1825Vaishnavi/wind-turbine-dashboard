import json
import os
from datetime import datetime

ARCHIVE_DIR = "local_archive"
os.makedirs(ARCHIVE_DIR, exist_ok=True)

def archive_to_s3(readings: list):
    filename = f"{ARCHIVE_DIR}/readings_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w') as f:
        json.dump(readings, f, indent=2)
    print(f"Archived {len(readings)} readings → {filename}")
    return filename