# Full Stack Application Development

A repository for Full Stack Application Development coursework, containing HTML, Java, SQL, and Spring Boot projects organised by week.

## Repository Structure

```
Full-Stack-Application-Development/
├── HTML/          # HTML assignments and projects
├── JAVA/          # Java source files
├── SQL/           # MySQL notes and PDFs
├── Week_4/        # Week 4 – Spring Boot project
├── WEEK-5/        # Week 5 – materials and assignments
└── demo-1/        # Spring Boot demo application
```

---

## Step 1 – Install Git on Your Laptop

> Skip this step if Git is already installed.

| OS | Instructions |
|----|--------------|
| **Windows** | Download and install from <https://git-scm.com/download/win>. Accept all defaults. |
| **macOS** | Open Terminal and run `xcode-select --install`, **or** install from <https://git-scm.com/download/mac>. |
| **Linux** | Run `sudo apt install git` (Ubuntu/Debian) or `sudo dnf install git` (Fedora). |

After installing, confirm it works:
```bash
git --version
# e.g.  git version 2.44.0
```

Then set your name and email (one-time setup):
```bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
```

---

## Step 2 – Clone the Repository to Your Laptop

Cloning downloads the entire repository into a folder on your laptop.

```bash
git clone https://github.com/Ramakrishnan2619/Full-Stack-Application-Development.git
```

This creates a folder called `Full-Stack-Application-Development` in your **current directory**.  
Move into it:

```bash
cd Full-Stack-Application-Development
```

You now have a complete local copy of the repo. ✅

---

## Step 3 – Add Your Folder / Files

Copy your folder or files into the repo folder.

**Option A – Copy from another location on your laptop**
```bash
# Windows (Command Prompt)
xcopy C:\Users\YourName\MyProject  WEEK-5\MyProject  /E /I

# macOS / Linux
cp -r ~/MyProject  WEEK-5/MyProject
```

**Option B – Create a new folder and add files directly**
```bash
mkdir WEEK-5/MyProject
# Then move your files into WEEK-5/MyProject using File Explorer / Finder
```

---

## Step 4 – Save Changes Back to GitHub (Commit & Push)

After adding your files, run these three commands in order:

```bash
# 1. Stage everything you added or changed
git add .

# 2. Save a snapshot with a short description
git commit -m "Add Week 5 project files"

# 3. Upload to GitHub so it's saved online
git push origin main
```

GitHub will ask for your **username** and **password / personal-access token** on the first push.  
> 💡 To avoid typing credentials every time, use [GitHub CLI](https://cli.github.com/) (`gh auth login`) or [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

---

## Full Workflow – All Commands at Once

```bash
# 1. Clone the repo to your laptop
git clone https://github.com/Ramakrishnan2619/Full-Stack-Application-Development.git
cd Full-Stack-Application-Development

# 2. Copy your folder into the repo (macOS/Linux example)
cp -r ~/path/to/your/folder  WEEK-5/

# 3. Stage, commit, and push
git add .
git commit -m "Add my Week 5 files"
git push origin main
```

Your files are now saved on GitHub. 🎉

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `git status` | Shows which files are new, changed, or staged |
| `git log --oneline` | Lists recent commits |
| `git add .` | Stages **all** changes in the current folder |
| `git add folder/` | Stages only a specific folder |
| `git commit -m "message"` | Saves a snapshot locally |
| `git push origin main` | Uploads commits to GitHub |
| `git pull origin main` | Downloads the latest changes from GitHub |
