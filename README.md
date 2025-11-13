# Student Progress Tracker (Full - MySQL + Auth)

Tech stack:
- Frontend: React (Vite) + Bootstrap + Axios
- Backend: Spring Boot (Maven) + Spring Security + JPA + MySQL
- Auth: JWT (JSON Web Tokens)

## Quick start

1. Start MySQL and create the database using `sql/create_tables.sql` in Workbench.
2. Edit `backend/src/main/resources/application.properties` with your DB username/password.
3. Run backend:
   ```
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
4. Run frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

Backend: http://localhost:8080/api  
Frontend: http://localhost:5173

