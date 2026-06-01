# Claude Implementation Brief - Phixora Website + AI Backend

## 0. Context

We already have a Phixora project with separate `frontend` and `backend` folders. The goal is to complete the **website version** of our AI photo editor, based on the uploaded PDF prototype/wireframes.

The PDF is the visual reference. Do not invent a totally different layout. Use the prototype as the source of truth and improve it into a polished, professional web product.

Reference PDF:
- `G10_prototypeAndWireframes Copy.pdf`

The PDF flow is:

1. Welcome
2. Sign Up
3. Login
4. Upload Image
5. Tools
6. Process
7. History
8. Before/After

The current website is missing or incomplete in some areas:
- Features page/section
- Tutorial page/section
- Contact page/section
- Proper AI tool pages
- Proper backend integration for AI tools
- Super Resolution backend using xinntao Real-ESRGAN
- Remove Noise backend
- Remove Background backend

Please inspect the current repo first, then implement according to the existing stack and folder structure.

---

## 1. GitHub Repositories / AI Libraries to Use

### 1.1 Super Resolution

Use xinntao Real-ESRGAN:

```txt
https://github.com/xinntao/Real-ESRGAN
```

Purpose:
- Super resolution
- Image upscaling
- General image restoration

Use this on the **backend side only**. The frontend must not run the model directly.

Recommended models:
- `RealESRGAN_x4plus` for high-quality 4x upscaling
- `RealESRGAN_x2plus` if 2x support is needed
- `realesr-general-x4v3` if a lighter/faster general restoration model is useful

Expected backend behavior:
1. Receive image upload.
2. Save original image into `uploads/`.
3. Call Real-ESRGAN inference.
4. Save result into `outputs/`.
5. Return processed image URL or file response to frontend.

Example inference command idea:

```bash
python inference_realesrgan.py \
  -n RealESRGAN_x4plus \
  -i uploads/input.png \
  -o outputs \
  --outscale 4
```

If backend is Node / Express / NestJS, call Real-ESRGAN through a child process.

If backend is FastAPI / Flask, integrate it directly or call the script internally.

---

### 1.2 Remove Background

Use `rembg` unless the project already has another background removal model:

```txt
https://github.com/danielgatis/rembg
```

Purpose:
- Remove image background automatically.
- Can be used as Python library, CLI, HTTP server, or Docker container.

Expected backend behavior:
1. Receive image upload.
2. Run background removal.
3. Return transparent PNG result.

Example Python usage idea:

```python
from rembg import remove
from PIL import Image

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
```

Keep this service modular:

```txt
backend/
  services/
    ai/
      removeBackgroundService
```

---

### 1.3 Remove Noise

For the first professional version, implement Remove Noise in the backend using OpenCV denoising.

Use OpenCV Non-local Means denoising:

```txt
cv2.fastNlMeansDenoisingColored()
```

This is a practical starting point for a website feature. Later, we can replace it with a dedicated AI denoising model if needed.

Expected backend behavior:
1. Receive image upload.
2. Apply denoising.
3. Save result.
4. Return processed image URL or file response.

Example Python idea:

```python
import cv2

img = cv2.imread(input_path)
denoised = cv2.fastNlMeansDenoisingColored(
    img,
    None,
    h=10,
    hColor=10,
    templateWindowSize=7,
    searchWindowSize=21
)
cv2.imwrite(output_path, denoised)
```

Optional:
- Add intensity values: low / medium / high.
- Use stronger values for noisy images, but avoid over-smoothing.

---

## 2. Visual Reference from PDF

### 2.1 Welcome Page

The PDF welcome screen contains:
- Top navigation with Phixora logo/brand
- Navigation links: Features, Tutorial, Results, Contact
- Login and Sign Up buttons
- Large hero headline similar to: `ALL THE BEST TOOLS WITH EASY USAGE`
- A short explanation text
- `How to use?` section
- `Results` section with three before/after preview cards:
  - Noise Reduction
  - Face Redefine / Face Enhancement
  - Background Removal

Implementation requirements:
- Create a clean landing page.
- Keep the same idea, but make it visually professional.
- Use modern spacing, cards, buttons, and responsive design.
- Add CTA buttons such as:
  - `Get Started`
  - `Try Tools`
- The results section should show before/after style preview cards.

Suggested route:

```txt
/
```

---

### 2.2 Sign Up Page

The PDF sign up screen contains:
- Centered account creation card
- Name input
- Email input
- Password input
- Confirm Password input
- Create Account button
- Divider with `or`
- Continue with Google
- Continue as Guest
- Link to Login

Implementation requirements:
- Create or improve the sign up page.
- Add form validation.
- Show loading and error states.
- Make the card centered with a clean background.
- Match the PDF structure but improve UI quality.

Suggested route:

```txt
/signup
```

---

### 2.3 Login Page

The PDF login screen contains:
- Centered login card
- Email input
- Password input
- Forgot password link
- Login button
- Divider with `or`
- Continue with Google
- Continue as Guest
- Link to Sign Up

Implementation requirements:
- Create or improve login page.
- Add validation.
- Add loading and error states.
- Keep the layout consistent with sign up.

Suggested route:

```txt
/login
```

---

### 2.4 Upload Image Page

The PDF upload screen contains:
- Top navigation
- Left sidebar with tool/history navigation
- Large central upload area
- Drag and drop box
- Select file button
- Confirm button

Implementation requirements:
- Create a dedicated upload page.
- Add drag and drop upload.
- Add normal file select.
- Show selected file preview before confirming.
- Validate file type and size.
- After confirm, navigate to tools page or editor page.

Suggested route:

```txt
/upload
```

Expected file formats:
- PNG
- JPG / JPEG
- WEBP if backend supports it

---

### 2.5 Tools Page / Editor Page

The PDF tools screen contains:
- Top navigation
- Left sidebar
- Tool groups:
  - Super Resolution
  - Remove Noise
  - Remove Background
- Central image preview area
- Change image button
- Parameters section
- Super Resolution scale choices
- Intensity slider
- Apply button

Implementation requirements:
- Build an editor/tools page where uploaded image is shown in the center.
- Left sidebar should list available tools.
- User should be able to select a tool.
- Tool options should update depending on selected tool.
- Add `Apply` button.
- When user applies a tool, call the backend endpoint.

Suggested route:

```txt
/tools
```

or

```txt
/editor
```

Tool behavior:
- Super Resolution: show scale choices 2x / 4x.
- Remove Noise: show intensity slider or low / medium / high.
- Remove Background: no complex options needed initially.

---

### 2.6 Process Page

The PDF process screen contains:
- Processing state in center
- Selected tool name
- Circular progress indicator
- Percentage value
- Message such as `processing... please wait`

Implementation requirements:
- Create a polished processing/loading screen.
- Show selected tool name.
- Show progress animation.
- If real backend progress is unavailable, show an indeterminate loader or simulated progress.
- Do not leave user without feedback while backend is processing.

Suggested route:

```txt
/process
```

or implement it as an overlay/modal in the editor.

---

### 2.7 History Page

The PDF history screen contains:
- Left sidebar with previous processed items
- History items grouped by tool name
- Central preview area

Implementation requirements:
- Create a history page or history sidebar.
- Save processed results at least in frontend state/local storage for now.
- If backend database exists, store processing history properly.
- History item should include:
  - tool name
  - date/time
  - original image
  - processed image
  - result URL
- Clicking a history item opens preview.

Suggested route:

```txt
/history
```

---

### 2.8 Before / After Page

The PDF before/after screen contains:
- Central before/after comparison
- Slider divider
- Before label
- After label
- Export button
- Left sidebar item showing selected processed tool

Implementation requirements:
- Implement a before/after comparison viewer.
- Use slider comparison if possible.
- Add labels:
  - `Before`
  - `After`
- Add Export / Download button.
- This page should appear after successful processing.

Suggested route:

```txt
/result`
```

or

```txt
/before-after
```

---

## 3. Missing Website Pages

### 3.1 Features Page

Create a `Features` page if missing.

Suggested route:

```txt
/features
```

Content:
- Hero heading: `Powerful AI Photo Editing Tools`
- Short explanation
- Feature cards:
  - Super Resolution
  - Remove Noise
  - Remove Background
  - Object Remover if planned
  - Before / After Preview
  - History
  - Fast Export

Each feature card should include:
- Icon
- Title
- Short explanation
- `Try now` or `Learn more` button

The page should connect marketing content with actual tool routes.

---

### 3.2 Tutorial Page

Create a `Tutorial` page if missing.

Suggested route:

```txt
/tutorial
```

Content should explain the complete user flow from the PDF:

1. Create account or continue as guest.
2. Upload image.
3. Choose an AI tool.
4. Adjust parameters.
5. Process image.
6. Compare before/after.
7. Export result.
8. Reopen previous results from history.

Make this visually polished:
- Step cards
- Numbered sections
- Screenshots/placeholders
- CTA button at the end

---

### 3.3 Contact Page

Create a `Contact` page if missing.

Suggested route:

```txt
/contact
```

Content:
- Contact form
  - Name
  - Email
  - Subject
  - Message
- Submit button
- Validation
- Success message
- Error message
- Optional FAQ section

If backend email is not available:
- Implement frontend validation and mock success state.
- Or create a clean backend placeholder endpoint:

```txt
POST /api/contact
```

---

## 4. Frontend Architecture Requirements

Before coding:
1. Inspect `frontend/package.json`.
2. Identify whether the frontend is Next.js, Vite, React, etc.
3. Follow the existing project structure.
4. Do not create a separate frontend app inside the repo.

Recommended component structure:

```txt
frontend/
  src/
    components/
      layout/
        Navbar
        Footer
        Sidebar
      sections/
        HeroSection
        ResultsPreviewSection
        HowToUseSection
        FeatureGrid
      auth/
        LoginForm
        SignupForm
      tools/
        UploadBox
        ToolSidebar
        ToolOptionsPanel
        ProcessingOverlay
        BeforeAfterSlider
        HistoryList
    pages/ or app/
      index / page
      features
      tutorial
      contact
      login
      signup
      upload
      tools or editor
      history
      result
```

Use the actual folder system of the current framework.

UI requirements:
- Responsive design
- Clean SaaS style
- Consistent navbar/footer
- Consistent button styling
- Clean empty states
- Loading states
- Error states
- Mobile-friendly layout
- No broken navigation links

---

## 5. Backend Architecture Requirements

Before coding:
1. Inspect `backend/package.json` or backend framework files.
2. Identify backend framework.
3. Follow the existing backend structure.
4. Do not rewrite the entire backend from scratch.

Recommended backend structure:

```txt
backend/
  src/
    routes/ or controllers/
      tools
      contact
    services/
      ai/
        superResolutionService
        removeNoiseService
        removeBackgroundService
    middleware/
      uploadMiddleware
    utils/
      fileUtils
  uploads/
  outputs/
  ai/
    Real-ESRGAN/
    scripts/
      super_resolution.py
      remove_noise.py
      remove_background.py
```

---

## 6. AI API Endpoints

Implement these backend endpoints:

```txt
POST /api/tools/super-resolution
POST /api/tools/remove-noise
POST /api/tools/remove-background
```

Optional future endpoint:

```txt
POST /api/tools/object-remover
```

All image endpoints should accept multipart form data:

```txt
image: File
```

Additional fields:

For Super Resolution:

```txt
scale: 2 | 4
model: RealESRGAN_x4plus | RealESRGAN_x2plus | realesr-general-x4v3
```

For Remove Noise:

```txt
intensity: low | medium | high
```

Expected success response:

```json
{
  "success": true,
  "tool": "super-resolution",
  "originalImageUrl": "/uploads/input.png",
  "processedImageUrl": "/outputs/result.png",
  "message": "Image processed successfully"
}
```

Expected error response:

```json
{
  "success": false,
  "message": "Failed to process image"
}
```

---

## 7. Backend File Handling

Implement safe file handling.

Requirements:
- Validate file type.
- Limit file size.
- Generate unique file names.
- Store uploads in `uploads/`.
- Store processed results in `outputs/`.
- Serve output files statically or return file response.
- Avoid hardcoded absolute Windows paths.
- Use environment variables.

Example `.env`:

```env
PORT=3000
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs
REALESRGAN_PATH=./ai/Real-ESRGAN
MAX_UPLOAD_MB=10
```

---

## 8. Frontend API Integration

Use environment variable for API base URL.

If Next.js:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

If Vite:

```env
VITE_API_URL=http://localhost:3000
```

Do not hardcode API URLs inside components.

Create a clean API client:

```txt
frontend/src/lib/api.ts
```

Functions:
- `processSuperResolution(file, options)`
- `processRemoveNoise(file, options)`
- `processRemoveBackground(file)`
- `submitContactForm(data)`

---

## 9. User Flow

Implement this flow:

```txt
Welcome page
  -> Sign up / Login / Continue as Guest
  -> Upload image
  -> Tools / Editor
  -> Select tool
  -> Adjust options
  -> Apply
  -> Processing screen
  -> Before/After result page
  -> Export / Download
  -> History
```

This should match the PDF prototype flow.

---

## 10. Professional Quality Checklist

Before finalizing, verify:

- All navbar links work.
- Features page exists.
- Tutorial page exists.
- Contact page exists.
- Login page exists.
- Sign up page exists.
- Upload page exists.
- Tools/editor page exists.
- Processing state exists.
- History page or history sidebar exists.
- Before/after result viewer exists.
- Super Resolution backend endpoint works.
- Remove Noise backend endpoint works.
- Remove Background backend endpoint works or has a clean placeholder if dependencies are not installed yet.
- Frontend calls backend correctly.
- Errors are displayed clearly.
- Loading states are visible.
- No hardcoded local paths like `C:\Users\samet\...`.
- No unused duplicated pages.
- Design follows the PDF layout but looks more polished.

---

## 11. Development Commands

Inspect the repo first, then use the correct commands from `package.json`.

Possible frontend:

```bash
cd frontend
npm install
npm run dev
```

Possible backend:

```bash
cd backend
npm install
npm run build
npm run start
```

If backend uses Python scripts for AI processing:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

For Real-ESRGAN:

```bash
cd backend/ai
git clone https://github.com/xinntao/Real-ESRGAN.git
cd Real-ESRGAN
pip install -r requirements.txt
python setup.py develop
```

For rembg and OpenCV:

```bash
pip install rembg opencv-python pillow
```

---

## 12. Important Final Instruction

Do not only create static UI.

The website must be structured as a real AI photo editor web app:

- Marketing pages: Home, Features, Tutorial, Contact
- Auth pages: Login, Sign Up
- App pages: Upload, Tools/Editor, Processing, Result, History
- Backend AI endpoints: Super Resolution, Remove Noise, Remove Background

First inspect the existing project. Then implement missing pieces in the same architecture.
