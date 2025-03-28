
# Popcorn Palace – NestJS Backend

**Popcorn Palace** is a movie booking booking system built with [NestJS](https://docs.nestjs.com/) and TypeScript.

### **Movie Management**
- Create, read, update, and delete movies.  

### **Showtime Management**
- Create, read, update, and delete showtimes.
- ensuring no overlapping showtimes in the same theater.  

### **Booking Booking**
- Book bookings for specific showtimes
- Ensure seats aren’t double-booked.

## Setup

1. **Clone** - clone github repository into a local repository using GitHub desktop / cmd  
   ```bash
   git clone <repo-url>
   ```
2. **Install Dependencies** - go to root directory and install needed dependacies :
    ```bash
   npm install
   ```
      
3. **Docker** - spin up a PostgreSQL container for local development : 
   ```bash
   docker-compose up -d
   ```
   

## Run

- **Development** - run in watch mode for auto-restart on code changes :
  ```bash
  npm run start:dev
  ```
  
- **Production** - compile to the `dist/` folder and run via Node.
  ```bash
  npm run build
  npm run start:prod
  ```
  

## Testing

- **All Tests**  
  ```bash
  npm run test
  ```
- **Watch Mode**  
  ```bash
  npm run test:watch
  ```
- **Coverage Report**  
  ```bash
  npm run test:cov
  ```
- **End-to-End Tests**  
  ```bash
  npm run test:e2e
  ```

# Popcorn Palace API Endpoints

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| POST   | /movies                              | create new movie          |
| GET    | /movies/all                          | list all movies           |
| POST   | /movies/update/:movieTitle           | update movie by title     |
| DELETE | /movies/:movieTitle                  | delete movie by title     |
| GET    | /showtimes/:showtimeId               | get showtime by id        |
| POST   | /showtimes                           | create new showtime       |
| POST   | /showtimes/update/:showtimeId        | update showtime by id     |
| DELETE | /showtimes/:showtimeId               | delete showtime by id     |
| POST   | /bookings                            | create new booking        |

