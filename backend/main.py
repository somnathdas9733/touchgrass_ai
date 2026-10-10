import json
import re
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(title="TouchGrass AI Backend", version="1.0.0")

# Enable CORS for localhost frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "gemma4:latest"

class PlanRequest(BaseModel):
    duration: str
    location: str
    mood: str
    preference: str

class PlanStep(BaseModel):
    step: int
    title: str
    durationMinutes: int
    description: str
    sensoryFocus: Optional[str] = None

class PlanResponse(BaseModel):
    title: str
    tagline: str
    totalMinutes: int
    steps: List[PlanStep]
    screenFreePledge: str
    groundingAdvice: str
    modelUsed: str

@app.get("/api/health")
async def health_check():
    """Check Ollama connectivity and whether Gemma 4 is installed."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name") for m in data.get("models", [])]
                has_gemma = any("gemma" in m.lower() for m in models)
                preferred_model = DEFAULT_MODEL if DEFAULT_MODEL in models else (models[0] if models else DEFAULT_MODEL)
                return {
                    "status": "healthy",
                    "ollama_connected": True,
                    "available_models": models,
                    "active_model": preferred_model,
                    "has_gemma": has_gemma
                }
    except Exception as e:
        return {
            "status": "offline_warning",
            "ollama_connected": False,
            "error": str(e),
            "available_models": [],
            "active_model": DEFAULT_MODEL,
            "has_gemma": False
        }

def parse_duration_to_minutes(dur_str: str) -> int:
    dur_lower = dur_str.lower()
    match = re.search(r"(\d+)", dur_lower)
    val = int(match.group(1)) if match else 30
    if "hour" in dur_lower or "hr" in dur_lower:
        return val * 60
    return val

def generate_fallback_plan(req: PlanRequest) -> PlanResponse:
    total_mins = parse_duration_to_minutes(req.duration)
    step1_mins = max(3, int(total_mins * 0.2))
    step2_mins = max(5, int(total_mins * 0.5))
    step3_mins = max(2, total_mins - step1_mins - step2_mins)

    return PlanResponse(
        title=f"{total_mins}-Minute Phone-Free {req.preference.title()} Plan",
        tagline=f"Step away from screens around {req.location} and engage your senses.",
        totalMinutes=total_mins,
        steps=[
            PlanStep(
                step=1,
                title="Pocket the Phone & Step Outside",
                durationMinutes=step1_mins,
                description=f"Set your phone to 'Do Not Disturb', slide it deep into your pocket or bag. Walk out into {req.location} and leave the digital screen behind.",
                sensoryFocus="Notice the shift in temperature and the feeling of real air on your face."
            ),
            PlanStep(
                step=2,
                title=f"Mindful {req.preference.title()}",
                durationMinutes=step2_mins,
                description=f"Engage in a calm, intentional {req.preference.lower()} tailored to feeling {req.mood.lower()}. Keep your gaze outward toward people, trees, or architecture.",
                sensoryFocus="Count 3 distinct sounds in your surroundings that you would normally ignore with earphones in."
            ),
            PlanStep(
                step=3,
                title="Grounding & Stillness",
                durationMinutes=step3_mins,
                description="Find a bench, stone wall, or patch of grass. Sit quietly or stand tall, letting your eyes relax into the distance without any screen glare.",
                sensoryFocus="Place your hands on a natural surface (wood, stone, or grass) and take 5 slow, grounding breaths."
            ),
        ],
        screenFreePledge=f"Pledge: Keep your phone untouched for the entire {total_mins} minutes.",
        groundingAdvice="When the impulse strikes to reach into your pocket, take three slow breaths and look up at the sky or leaves instead.",
        modelUsed="TouchGrass Local Engine"
    )

@app.post("/api/plan", response_model=PlanResponse)
async def create_plan(req: PlanRequest):
    """Generate a phone-free plan using local Gemma 4 model via Ollama."""
    total_mins = parse_duration_to_minutes(req.duration)

    prompt = f"""You are TouchGrass AI. Your mission is to get people off their screens and into the physical world.
Create a practical, step-by-step PHONE-FREE plan for someone with:
- Free Time: {req.duration} ({total_mins} minutes total)
- Location: {req.location}
- Mood: {req.mood}
- Activity Preference: {req.preference}

Rules:
1. Every step must be 100% offline and phone-free.
2. Provide exactly 3 clear chronological steps whose duration minutes add up to {total_mins}.
3. Return ONLY a single valid JSON object. No explanation, no markdown ticks.

Format:
{{
  "title": "{total_mins}-Minute Phone-Free Plan",
  "tagline": "A brief uplifting motto to disconnect and touch grass",
  "totalMinutes": {total_mins},
  "steps": [
    {{
      "step": 1,
      "title": "Action title",
      "durationMinutes": 5,
      "description": "Clear practical instruction",
      "sensoryFocus": "A physical sensory cue to notice"
    }},
    {{
      "step": 2,
      "title": "Main activity title",
      "durationMinutes": 15,
      "description": "Clear practical instruction",
      "sensoryFocus": "A sight or sound to focus on"
    }},
    {{
      "step": 3,
      "title": "Grounding pause",
      "durationMinutes": 10,
      "description": "Ending stillness or quiet observation",
      "sensoryFocus": "A tactile feeling or deep breath"
    }}
  ],
  "screenFreePledge": "Phone stays tucked away for {total_mins} minutes.",
  "groundingAdvice": "Tip for overcoming the reflex to check notifications."
}}"""

    # Call local Ollama
    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            ollama_payload = {
                "model": DEFAULT_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "top_p": 0.85,
                    "num_predict": 380,
                }
            }
            res = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=ollama_payload)
            if res.status_code == 200:
                raw_response = res.json().get("response", "")
                
                # Extract JSON
                json_str = raw_response.strip()
                match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_response, re.DOTALL)
                if match:
                    json_str = match.group(1)
                else:
                    first_brace = raw_response.find("{")
                    last_brace = raw_response.rfind("}")
                    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
                        json_str = raw_response[first_brace : last_brace + 1]

                parsed = json.loads(json_str)

                # Validate steps
                steps_data = []
                for idx, s in enumerate(parsed.get("steps", [])):
                    dur = int(s.get("durationMinutes", 5))
                    steps_data.append(
                        PlanStep(
                            step=s.get("step", idx + 1),
                            title=s.get("title", f"Step {idx + 1}"),
                            durationMinutes=dur,
                            description=s.get("description", "Take a mindful break away from the screen."),
                            sensoryFocus=s.get("sensoryFocus", "Focus on your immediate natural surroundings.")
                        )
                    )

                if steps_data:
                    return PlanResponse(
                        title=parsed.get("title", f"{total_mins}-Minute Phone-Free Plan"),
                        tagline=parsed.get("tagline", "Unplug from the screen, touch grass, and feel the world."),
                        totalMinutes=total_mins,
                        steps=steps_data,
                        screenFreePledge=parsed.get("screenFreePledge", f"Keep phone away for {total_mins} minutes."),
                        groundingAdvice=parsed.get("groundingAdvice", "When tempted to reach for your phone, gaze at the trees and clouds."),
                        modelUsed="Gemma 4 (Local Ollama)"
                    )
    except Exception as err:
        import traceback
        print(f"[TouchGrass AI] Ollama call error or parse issue: {repr(err)}")
        traceback.print_exc()

    return generate_fallback_plan(req)
