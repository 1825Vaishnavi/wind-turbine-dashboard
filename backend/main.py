from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, SensorReading
import random
from datetime import datetime

app = FastAPI(title="Wind Turbine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SITES = ["boston", "worcester", "springfield"]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_reading(site: str):
    return {
        "site": site,
        "timestamp": datetime.now().isoformat(),
        "wind_speed": round(random.uniform(5, 20), 1),
        "energy_output": round(random.uniform(20, 100), 1),
        "rpm": random.randint(10, 30),
        "temperature": round(random.uniform(15, 25), 1),
    }

@app.get("/")
def root():
    return {"message": "Wind Turbine Operations API", "version": "1.0"}

@app.get("/api/readings")
def get_all_readings(db: Session = Depends(get_db)):
    readings = [generate_reading(s) for s in SITES]
    for r in readings:
        db_reading = SensorReading(
            site=r["site"],
            wind_speed=r["wind_speed"],
            energy_output=r["energy_output"],
            rpm=r["rpm"],
            temperature=r["temperature"]
        )
        db.add(db_reading)
    db.commit()
    return {
        "timestamp": datetime.now().isoformat(),
        "readings": readings,
        "total_readings_today": db.query(SensorReading).count()
    }

@app.get("/api/readings/{site}")
def get_site_reading(site: str, db: Session = Depends(get_db)):
    return generate_reading(site)

@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = []
    for site in SITES:
        r = generate_reading(site)
        if r["wind_speed"] > 18:
            alerts.append({"site": site, "type": "HIGH_WIND", "value": r["wind_speed"]})
        if r["temperature"] > 22:
            alerts.append({"site": site, "type": "HIGH_TEMP", "value": r["temperature"]})
    return {"alerts": alerts, "count": len(alerts)}

@app.get("/api/stats/{site}")
def get_stats(site: str, db: Session = Depends(get_db)):
    readings = db.query(SensorReading).filter(SensorReading.site == site).all()
    if not readings:
        return {"site": site, "message": "No data yet"}
    winds = [r.wind_speed for r in readings]
    energy = [r.energy_output for r in readings]
    return {
        "site": site,
        "total_readings": len(readings),
        "avg_wind_speed": round(sum(winds)/len(winds), 1),
        "max_wind_speed": round(max(winds), 1),
        "avg_energy_output": round(sum(energy)/len(energy), 1),
        "total_energy": round(sum(energy), 1),
    }

@app.get("/api/db/count")
def get_db_count(db: Session = Depends(get_db)):
    count = db.query(SensorReading).count()
    return {"total_readings_stored": count, "message": f"{count} sensor readings in PostgreSQL"}