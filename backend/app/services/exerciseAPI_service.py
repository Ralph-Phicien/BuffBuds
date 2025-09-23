import os
import requests
from dotenv import load_dotenv

load_dotenv()

URL = "https://api.api-ninjas.com/v1/exercises?muscle={muscle_group}"
KEY = os.getenv("API_NINJAS_KEY")

headers = {
    'X-Api-Key': f'{KEY}'
}
