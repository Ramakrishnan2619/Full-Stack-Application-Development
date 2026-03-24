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

## How to Upload a Folder (with Files) to This Repository

Follow these steps to add a new folder with files using Git on your local machine.

### Prerequisites
- [Git](https://git-scm.com/downloads) installed on your computer.
- A GitHub account with write access to this repository.

---

### Step-by-step Commands

**1. Clone the repository** (skip if you already have a local copy)
```bash
git clone https://github.com/Ramakrishnan2619/Full-Stack-Application-Development.git
cd Full-Stack-Application-Development
```

**2. Create your new folder and add your files inside it**
```bash
mkdir MY_NEW_FOLDER
cp /path/to/your/file.txt MY_NEW_FOLDER/
```
*(Replace `MY_NEW_FOLDER` and the file path with your actual folder name and files.)*

**3. Stage all new files for commit**
```bash
git add MY_NEW_FOLDER/
```

**4. Commit the changes with a descriptive message**
```bash
git commit -m "Add MY_NEW_FOLDER with project files"
```

**5. Push to GitHub**
```bash
git push origin main
```

---

### Uploading to a Specific Branch

If you want to push to a different branch (e.g., `dev`):
```bash
git checkout -b dev          # create and switch to the branch
git add MY_NEW_FOLDER/
git commit -m "Add MY_NEW_FOLDER"
git push origin dev
```

---

### Quick Reference – All Commands at Once

```bash
git clone https://github.com/Ramakrishnan2619/Full-Stack-Application-Development.git
cd Full-Stack-Application-Development
mkdir MY_NEW_FOLDER
cp /path/to/your/files/* MY_NEW_FOLDER/
git add MY_NEW_FOLDER/
git commit -m "Add MY_NEW_FOLDER with files"
git push origin main
```

---

### Tips
- Use `git status` at any point to see which files are staged or unstaged.
- Use `git log --oneline` to view the commit history.
- To add **all** changed files at once use `git add .` instead of specifying a folder.
