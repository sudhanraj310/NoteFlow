# NoteFlow

NoteFlow is an installable notes Progressive Web App built with vanilla HTML/CSS/JavaScript and Spring Boot 3. The frontend and API are served from one origin, so the app works locally and after public deployment without any hard-coded `localhost` address.

## Run locally

The easiest way to run the complete app is Docker:

```powershell
docker compose up --build
```

Open `http://localhost:8080`. NoteFlow stores its local data in a named Docker volume.

For Maven-based development, run the backend from `backend` and open `http://localhost:8080`. Maven automatically packages the `frontend` folder into the Spring Boot application.

```powershell
cd backend
mvn spring-boot:run
```

The default database is a persistent local H2 file in `data/noteflow`. To use MySQL instead, set `MYSQL_URL`, `MYSQL_USERNAME`, and `MYSQL_PASSWORD` before starting the application.

## Install the app

When NoteFlow is delivered over HTTPS, supported browsers show an **Install app** button. On iPhone and iPad, use Safari’s **Share > Add to Home Screen**.

## Publish

See [DEPLOYMENT.md](DEPLOYMENT.md) for the included Render blueprint and deployment notes.

## API endpoints

- `GET /api/notes`
- `GET /api/notes/{id}`
- `POST /api/notes`
- `PUT /api/notes/{id}`
- `DELETE /api/notes/{id}`
- `GET /api/notes/search?keyword=java`
- `PUT /api/notes/{id}/pin`

Connection settings are in `backend/src/main/resources/application.properties`. Override `MYSQL_PASSWORD`, `MYSQL_USERNAME`, or `MYSQL_URL` through environment variables when needed.
