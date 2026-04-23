from sqlalchemy import create_engine, Column, Float, String, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "postgresql://postgres:password@localhost/wind_turbine_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    site = Column(String)
    timestamp = Column(DateTime, default=datetime.now)
    wind_speed = Column(Float)
    energy_output = Column(Float)
    rpm = Column(Integer)
    temperature = Column(Float)

Base.metadata.create_all(bind=engine)
print("PostgreSQL connected! Tables created.")