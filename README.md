# **Math Note Website** 

This project is a web application that allows users to take notes and perform various math-related functions. It consists of a **frontend** built using Vite, React, and Tailwind CSS, and a **backend** built using FastAPI. 

## **Table of Contents** 

### 1. Frontend Setup 
   1. Install Dependencies 
   2. Start Development Server

### 2. Backend Setup 
- Install Dependencies 
- Configure Environment Variables 
- Start Backend Server 

# **Prerequisites** 

- **Node.js** (for the frontend) 
- **Python 3.9+** (for the backend) 
- **npm or yarn** (for the frontend dependencies) 
- **pip** (for Python dependencies) 

# **Frontend Setup** 

### 1. **Navigate to the math-note Folder** 

First, navigate to the frontend folder: 

```
cd math-note
```

### 2. **Install Frontend Dependencies** 

To install the necessary dependencies for the frontend, run: 

```
npm install 
```

The following key dependencies are used in the frontend: 

- react-router-dom: For routing between pages 
- postcss: For processing CSS 
- postcss-preset-mantine: For styling components 
- postcss-simple-vars: For managing CSS variables 
### 3. **Start the Development Server** 

Once all dependencies are installed, start the frontend development server: 

```
npm run dev 
```

# **Backend Setup** 

### 1. **Navigate to the math-bk Folder** 

Navigate to the backend folder: 

```
cd math-bk 
```

### 2. **Create a Python Virtual Environment** 

It is recommended to create a virtual environment to manage Python dependencies: 

```  
python -m venv venv 
```

Activate the virtual environment: 

- On Windows: 

  ```
  .\venv\Scripts\activate 
  ```

- On MacOS/Linux: 

  ```  
  source venv/bin/activate 
  ```
  
### 3. **Install Backend Dependencies** 

Install the required dependencies by running the following command: 

```  
pip install -r requirements.txt 
```

If a requirements.txt file isn't available, you can manually install the dependencies: 

```  
pip install fastapi Pillow pydantic uvicorn google.generativeai python-dotenv 
```

These are the key dependencies for the backend: 

- **FastAPI**: For building the API endpoints. 
- **Pillow**: For image processing. 
- **Pydantic**: For data validation. 
- **Uvicorn**: For running the ASGI server. 
- **google.generativeai**: For integration with Google’s Gemini API. 
- **python-dotenv**: For managing environment variables. 
### 4. **Configure the Environment Variables** 

Before starting the backend, make sure to configure the .env file with the correct **Gemini API Key**. 

Create a .env file in the math-bk folder and add the following content: makefile 

```  
GEMINI\_API\_KEY=your-gemini-api-key-here 
```

Replace your-gemini-api-key-here with your actual Gemini API key. 

### 5. **Start the Backend Server** 

Run the backend server with Uvicorn: 

```
python main.py ![](Aspose.Words.4b46aaf5-ec65-4982-ad59-ac072c7632d8.002.png)
```

# **Running the Full Stack Application** 

## 1. **Backend**: Start the backend server in the math-bk folder. 

   ```  
   cd math-bk python main.py 
  ```

## 2. **Frontend**: Start the frontend server in the math-note folder. 

   ```
cd math-note npm run dev
  ```
