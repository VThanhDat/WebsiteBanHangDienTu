from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Cấu hình CORS để frontend có thể truy cập vào API backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # URL của frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đảm bảo phục vụ các tệp tĩnh từ thư mục app/image
image_dir = "app/image"  # Đảm bảo đường dẫn chính xác
app.mount("/images", StaticFiles(directory=image_dir), name="images")

# Đăng ký các router API
app.include_router(api_router, prefix="/api")
