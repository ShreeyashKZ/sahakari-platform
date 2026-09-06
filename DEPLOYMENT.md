# 🚀 Deploying "Sahakari" Online to the Cloud (Step-by-Step)

Your project now has both a **production React Frontend** and an **Express + MongoDB Backend API** ready to be hosted online with public URLs.

Follow these 3 free steps to launch it live on the internet for your hackathon presentation:

---

## Step 1: Push Your Code to GitHub

Open PowerShell in this project folder:
```powershell
git init
git add .
git commit -m "feat: complete Sahakari cooperative platform with fullstack API and MongoDB support"
```

Create a new repository on [GitHub.com](https://github.com/new) named `sahakari-platform`, then link and push:
```powershell
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/sahakari-platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up MongoDB Atlas (Free Cloud Database)

1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a **Shared Cluster (M0 Free)**.
3. In **Database Access**, create a database user (e.g. `sahakari_admin` with password `coop_pass_2026`).
4. In **Network Access**, click **Add IP Address** → choose **Allow Access From Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** → **Drivers** → Copy your connection URI string:
   ```
   mongodb+srv://sahakari_admin:<password>@cluster0.mongodb.net/sahakari_db?retryWrites=true&w=majority
   ```

---

## Step 3: Deploy Backend to Render.com (Free)

1. Log in to [Render.com](https://render.com) with GitHub.
2. Click **New +** → **Web Service**.
3. Select your `sahakari-platform` repository.
4. Fill in the settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `MONGO_URI` = *(Paste your connection string from Step 2)*
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
6. Click **Create Web Service**. 
   Render will deploy your backend in ~2 minutes and provide a public URL like:
   👉 `https://sahakari-backend-xxxx.onrender.com`

---

## Step 4: Deploy Frontend to Vercel (Free)

1. Log in to [Vercel.com](https://vercel.com) with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `sahakari-platform` repository.
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://sahakari-backend-xxxx.onrender.com` *(your live Render backend URL from Step 3)*
5. Click **Deploy**.
6. In ~45 seconds, your website is live worldwide with a public HTTPS link:
   👉 **`https://sahakari-platform.vercel.app`**

---

## 🛠️ Local Fullstack Testing (Already Running Now)

Both components are already working locally on your PC:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **API Workers Feed**: [http://localhost:5000/api/workers](http://localhost:5000/api/workers)
- **API Bookings Feed**: [http://localhost:5000/api/bookings](http://localhost:5000/api/bookings)
