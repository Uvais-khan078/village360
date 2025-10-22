
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.projects import router as projects_router
from routes.villages import router as villages_router
from routes.dashboard import router as dashboard_router
from routes.health import router as health_router
from routes.admin import router as admin_router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],  # We'll use a regex to match allowed origins
    allow_origin_regex=r"https?://(localhost(:\d+)?|.*\.vercel\.app)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




app.include_router(auth_router, prefix="/api/auth")
app.include_router(projects_router, prefix="/api/projects")
app.include_router(villages_router, prefix="/api/villages")
app.include_router(dashboard_router, prefix="/api/dashboard")
app.include_router(health_router, prefix="/api")
app.include_router(admin_router, prefix="/api/admin")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))

