Use moviego;
CREATE TABLE IF NOT EXISTS tbl_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);
DELIMITER //

CREATE PROCEDURE RegisterUser(
  IN uname VARCHAR(100),
  IN uemail VARCHAR(150),
  IN upass VARCHAR(255),
  IN uimg VARCHAR(255),
  IN cuser VARCHAR(150)
)
BEGIN
  INSERT INTO tbl_user(name, email, password, image, create_user)
  VALUES (uname, uemail, upass, uimg, cuser);
END //

CREATE PROCEDURE GetUserByEmail(IN uemail VARCHAR(150))
BEGIN
  SELECT * FROM tbl_user WHERE email = uemail;
END //



CREATE PROCEDURE ToggleUserStatus(IN uid INT)
BEGIN
  UPDATE tbl_user
  SET status = IF(status = 'Active', 'Inactive', 'Active')
  WHERE id = uid;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UpdateUser(
  IN uid INT,
  IN uname VARCHAR(100),
  IN uimg VARCHAR(255),
  IN uuser VARCHAR(100)
)
BEGIN
  UPDATE tbl_user
  SET 
    name = IFNULL(uname, name),
    image = IFNULL(uimg, image),
    update_user = uuser
  WHERE id = uid;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetUserById(IN uid INT)
BEGIN
  SELECT 
    id,
    name,
    email,
    image,
    status,
    create_user,
    created_at,
    update_user,
    updated_at
  FROM tbl_user
  WHERE id = uid;
END //

CREATE PROCEDURE GetAllUsers()
BEGIN
  SELECT 
    id,
    name,
    email,
    image,
    status,
    create_user,
    created_at,
    update_user,
    updated_at
  FROM tbl_user;
END //

DELIMITER ;
DELIMITER //

CREATE PROCEDURE ChangeUserPassword(
  IN uid INT,
  IN newpass VARCHAR(255),
  IN uuser VARCHAR(100)
)
BEGIN
  UPDATE tbl_user
  SET password = newpass, update_user = uuser, updated_at = CURRENT_TIMESTAMP
  WHERE id = uid;
END //

DELIMITER ;


CREATE INDEX idx_email ON tbl_user(email);
CREATE INDEX idx_status ON tbl_user(status);


DELIMITER //

CREATE PROCEDURE GetUserById(IN uid INT)
BEGIN
  SELECT id, name, email, password, image, status,create_user,
    created_at,
    update_user,
    updated_at
  FROM tbl_user
  WHERE id = uid;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS GetUserById;


SHOW PROCEDURE STATUS WHERE Db = 'movie_go';

CREATE TABLE IF NOT EXISTS tbl_movie (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    duration VARCHAR(20), -- Format like '3hr33m'
    rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
    synopsis TEXT,
    poster_image VARCHAR(255),
    background_image VARCHAR(255),
    release_date DATE,
    release_status ENUM('Now Playing', 'Upcoming') DEFAULT 'Upcoming',
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active' -- Overall movie status
);






DELIMITER //

-- ==================== Movie Management Procedures ====================

-- Admin: Add a new movie
CREATE PROCEDURE AddMovie(
    IN p_title VARCHAR(255),
    IN p_genre VARCHAR(255),
    IN p_duration VARCHAR(20),
    IN p_rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
    IN p_synopsis TEXT,
    IN p_poster_image VARCHAR(255),
    IN p_background_image VARCHAR(255),
    IN p_release_date DATE,
    IN p_release_status ENUM('Now Playing', 'Upcoming'),
    IN p_create_user VARCHAR(150)
)
BEGIN
    INSERT INTO tbl_movie (title, genre, duration, rating, synopsis, poster_image, background_image, release_date, release_status, create_user, created_at, status)
    VALUES (p_title, p_genre, p_duration, p_rating, p_synopsis, p_poster_image, p_background_image, p_release_date, p_release_status, p_create_user, CURRENT_TIMESTAMP, 'Active');
    SELECT LAST_INSERT_ID() AS movie_id; -- Return the new movie ID
END //

-- Admin: Update existing movie details (supports partial updates)
CREATE PROCEDURE UpdateMovie(
    IN p_movie_id INT,
    IN p_title VARCHAR(255),
    IN p_genre VARCHAR(255),
    IN p_duration VARCHAR(20),
    IN p_rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
    IN p_synopsis TEXT,
    IN p_poster_image VARCHAR(255), -- NULL to keep existing, '' to clear
    IN p_background_image VARCHAR(255), -- NULL to keep existing, '' to clear
    IN p_release_date DATE,
    IN p_release_status ENUM('Now Playing', 'Upcoming'),
    IN p_update_user VARCHAR(100)
)
BEGIN
    UPDATE tbl_movie
    SET
        title = IFNULL(p_title, title),
        genre = IFNULL(p_genre, genre),
        duration = IFNULL(p_duration, duration),
        rating = IFNULL(p_rating, rating),
        synopsis = IFNULL(p_synopsis, synopsis),
        poster_image = CASE WHEN p_poster_image IS NULL THEN poster_image WHEN p_poster_image = '' THEN NULL ELSE p_poster_image END,
        background_image = CASE WHEN p_background_image IS NULL THEN background_image WHEN p_background_image = '' THEN NULL ELSE p_background_image END,
        release_date = IFNULL(p_release_date, release_date),
        release_status = IFNULL(p_release_status, release_status),
        update_user = p_update_user,
        updated_at = CURRENT_TIMESTAMP
    WHERE movie_id = p_movie_id;
END //

-- Admin: Delete a movie
CREATE PROCEDURE DeleteMovie(IN p_movie_id INT)
BEGIN
    DELETE FROM tbl_movie WHERE movie_id = p_movie_id;
END //

-- Admin: Toggle a movie's overall 'Active' or 'Inactive' status
CREATE PROCEDURE ToggleMovieStatus(IN p_movie_id INT)
BEGIN
    UPDATE tbl_movie
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE movie_id = p_movie_id;
END //

-- User/Public: Get all 'Now Playing' movies that are 'Active'
CREATE PROCEDURE GetActiveNowPlayingMovies()
BEGIN
    SELECT movie_id, title, genre, duration, rating, synopsis, poster_image, background_image, release_date, release_status
    FROM tbl_movie
    WHERE release_status = 'Now Playing' AND status = 'Active'
    ORDER BY release_date DESC;
END //

-- User/Public: Get all 'Upcoming' movies that are 'Active'
CREATE PROCEDURE GetActiveUpcomingMovies()
BEGIN
    SELECT movie_id, title, genre, duration, rating, synopsis, poster_image, background_image, release_date, release_status
    FROM tbl_movie
    WHERE release_status = 'Upcoming' AND status = 'Active'
    ORDER BY release_date ASC;
END //

-- User/Public: Get a specific movie by ID, only if it's 'Active'
CREATE PROCEDURE GetActiveMovieById(IN p_movie_id INT)
BEGIN
    SELECT movie_id, title, genre, duration, rating, synopsis, poster_image, background_image, release_date, release_status
    FROM tbl_movie
    WHERE movie_id = p_movie_id AND status = 'Active';
END //

-- Admin: Get a specific movie by ID, regardless of 'Active' or 'Inactive' status
CREATE PROCEDURE GetMovieByIdAdmin(IN p_movie_id INT)
BEGIN
    SELECT * FROM tbl_movie WHERE movie_id = p_movie_id;
END //

DELIMITER ;


CREATE INDEX idx_movie_release_status ON tbl_movie(release_status);
CREATE INDEX idx_movie_status ON tbl_movie(status);
CREATE INDEX idx_movie_release_date ON tbl_movie(release_date);


SHOW PROCEDURE STATUS WHERE Db = 'movie_go';





DELIMITER $$

CREATE PROCEDURE GetAllMovies()
BEGIN
    SELECT
        movie_id,
        title,
        genre,
        duration,
        rating,
        synopsis,
        poster_image,
        background_image,
        release_date,
        release_status,
        create_user,
        created_at,
        update_user,
        updated_at,
        status
    FROM
        tbl_movie;
END$$

DELIMITER ;

CREATE TABLE IF NOT EXISTS tbl_cinema (
    cinema_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    longitude DECIMAL(10, 7),
    latitude DECIMAL(10, 7),
    image VARCHAR(255),
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS tbl_cinema_review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    create_user VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100)  NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (cinema_id) REFERENCES tbl_cinema(cinema_id),
    FOREIGN KEY (user_id) REFERENCES tbl_user(id)
);






DELIMITER //

-- Cinema Management Procedures

-- Add Cinema
CREATE PROCEDURE AddCinema(
  IN p_name VARCHAR(255),
  IN p_address TEXT,
  IN p_city VARCHAR(100),
  IN p_state VARCHAR(100),
  IN p_zip_code VARCHAR(20),
  IN p_longitude DECIMAL(10,7),
  IN p_latitude DECIMAL(10,7),
  IN p_image VARCHAR(255),
  IN p_create_user VARCHAR(150)
)
BEGIN
  INSERT INTO tbl_cinema(name, address, city, state, zip_code, longitude, latitude, image, create_user)
  VALUES(p_name, p_address, p_city, p_state, p_zip_code, p_longitude, p_latitude, p_image, p_create_user);
END //

-- Get All Cinemas
CREATE PROCEDURE GetAllCinemas()
BEGIN
  SELECT * FROM tbl_cinema;
END //

-- Get Cinema By ID
CREATE PROCEDURE GetCinemaById(IN p_cinema_id INT)
BEGIN
  SELECT * FROM tbl_cinema WHERE cinema_id = p_cinema_id;
END //

-- Update Cinema
CREATE PROCEDURE UpdateCinema(
  IN p_cinema_id INT,
  IN p_name VARCHAR(255),
  IN p_address TEXT,
  IN p_city VARCHAR(100),
  IN p_state VARCHAR(100),
  IN p_zip_code VARCHAR(20),
  IN p_longitude DECIMAL(10,7),
  IN p_latitude DECIMAL(10,7),
  IN p_image VARCHAR(255),
  IN p_update_user VARCHAR(100)
)
BEGIN
  UPDATE tbl_cinema SET
    name = COALESCE(p_name, name),
    address = COALESCE(p_address, address),
    city = COALESCE(p_city, city),
    state = COALESCE(p_state, state),
    zip_code = COALESCE(p_zip_code, zip_code),
    longitude = COALESCE(p_longitude, longitude),
    latitude = COALESCE(p_latitude, latitude),
    image = COALESCE(p_image, image),
    update_user = p_update_user,
    updated_at = CURRENT_TIMESTAMP
  WHERE cinema_id = p_cinema_id;
END //

-- Delete Cinema
CREATE PROCEDURE DeleteCinema(IN p_cinema_id INT)
BEGIN
  DELETE FROM tbl_cinema WHERE cinema_id = p_cinema_id;
END //

-- Cinema Review Management Procedures

-- Add Cinema Review
CREATE PROCEDURE AddCinemaReview(
    IN p_cinema_id INT,
    IN p_user_id INT,
    IN p_rating INT,
    IN p_comment TEXT,
    IN p_create_user VARCHAR(150),
    IN p_update_user VARCHAR(100)
)
BEGIN
    INSERT INTO tbl_cinema_review (
        cinema_id, user_id, rating, comment, create_user, update_user, status
    ) VALUES (
        p_cinema_id, p_user_id, p_rating, p_comment, p_create_user, p_update_user, 'Active'
    );
END //

-- Update Cinema Review
CREATE PROCEDURE UpdateCinemaReview(
    IN p_review_id INT,
    IN p_rating INT,
    IN p_comment TEXT,
    IN p_update_user VARCHAR(100)
)
BEGIN
    UPDATE tbl_cinema_review
    SET rating = p_rating,
        comment = p_comment,
        update_user = p_update_user,
        updated_at = CURRENT_TIMESTAMP
    WHERE review_id = p_review_id;
END //

-- Delete Cinema Review
CREATE PROCEDURE DeleteCinemaReview(IN p_review_id INT)
BEGIN
    DELETE FROM tbl_cinema_review WHERE review_id = p_review_id;
END //

-- Get Cinema Reviews
CREATE PROCEDURE GetCinemaReviews(IN p_cinema_id INT)
BEGIN
    SELECT r.*, u.name AS user_name, u.email AS user_email, u.image AS user_image
    FROM tbl_cinema_review r
    JOIN tbl_user u ON r.user_id = u.id
    WHERE r.cinema_id = p_cinema_id;
END //

-- Get All Cinema Reviews
CREATE PROCEDURE GetAllCinemaReviews()
BEGIN
    SELECT r.*, u.name AS user_name, u.email AS user_email, u.image AS user_image, c.name AS cinema_name
    FROM tbl_cinema_review r
    JOIN tbl_user u ON r.user_id = u.id
    JOIN tbl_cinema c ON r.cinema_id = c.cinema_id;
END //

-- Toggle Cinema Review Status
CREATE PROCEDURE ToggleCinemaReviewStatus(IN p_review_id INT)
BEGIN
    UPDATE tbl_cinema_review
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE review_id = p_review_id;
END //

DELIMITER ;








DELIMITER //

-- Create Screen Table
CREATE TABLE IF NOT EXISTS tbl_screen (
    screen_id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT NOT NULL,
    screen_name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    screen_type VARCHAR(50), -- Keeping this as per your schema, but it can be removed if truly not needed.
                             -- If you want it removed entirely, replace this line with just a comma for the next field.
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (cinema_id) REFERENCES tbl_cinema(cinema_id)
);

-- Create Seat Layout Table (seat_type removed as per your instruction)
CREATE TABLE IF NOT EXISTS tbl_seat_layout (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    screen_id INT NOT NULL,
    seat_label VARCHAR(10) NOT NULL, -- example a1, b2 like these
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (screen_id) REFERENCES tbl_screen(screen_id)
);

-- Create Showtime Table
CREATE TABLE IF NOT EXISTS tbl_showtime (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    screen_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (movie_id) REFERENCES tbl_movie(movie_id),
    FOREIGN KEY (screen_id) REFERENCES tbl_screen(screen_id)
);

-- Create Booking Table
CREATE TABLE IF NOT EXISTS tbl_booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    booking_status ENUM('Booked', 'Cancelled') DEFAULT 'Booked',
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active', -- This 'status' column mirrors booking_status somewhat but can be used for admin soft-deletion.
    FOREIGN KEY (user_id) REFERENCES tbl_user(id),
    FOREIGN KEY (showtime_id) REFERENCES tbl_showtime(showtime_id)
);

-- Create Booking Seat Table
CREATE TABLE IF NOT EXISTS tbl_booking_seat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    showtime_id INT NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (booking_id) REFERENCES tbl_booking(booking_id),
    FOREIGN KEY (seat_id) REFERENCES tbl_seat_layout(seat_id),
    FOREIGN KEY (showtime_id) REFERENCES tbl_showtime(showtime_id)
);

-- Create Order Summary Table
CREATE TABLE IF NOT EXISTS tbl_order_summary (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_method ENUM('Cash', 'Card', 'UPI') NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    create_user VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (booking_id) REFERENCES tbl_booking(booking_id)
);
DELIMITER //

-- Stored Procedures for Screen Management
CREATE PROCEDURE AddScreen(
    IN p_cinema_id INT,
    IN p_screen_name VARCHAR(100),
    IN p_total_seats INT,
    IN p_screen_type VARCHAR(50),
    IN p_create_user VARCHAR(150)
)
BEGIN
    INSERT INTO tbl_screen(cinema_id, screen_name, total_seats, screen_type, create_user)
    VALUES(p_cinema_id, p_screen_name, p_total_seats, p_screen_type, p_create_user);
    SELECT LAST_INSERT_ID() AS screen_id;
END //

CREATE PROCEDURE UpdateScreen(
    IN p_screen_id INT,
    IN p_cinema_id INT,
    IN p_screen_name VARCHAR(100),
    IN p_total_seats INT,
    IN p_screen_type VARCHAR(50),
    IN p_update_user VARCHAR(100)
)
BEGIN
    UPDATE tbl_screen SET
        cinema_id = COALESCE(p_cinema_id, cinema_id),
        screen_name = COALESCE(p_screen_name, screen_name),
        total_seats = COALESCE(p_total_seats, total_seats),
        screen_type = COALESCE(p_screen_type, screen_type),
        update_user = p_update_user,
        updated_at = CURRENT_TIMESTAMP
    WHERE screen_id = p_screen_id;
END //

CREATE PROCEDURE DeleteScreen(IN p_screen_id INT)
BEGIN
    DELETE FROM tbl_screen WHERE screen_id = p_screen_id;
END //

CREATE PROCEDURE GetScreenById(IN p_screen_id INT)
BEGIN
    SELECT s.*, c.name AS cinema_name
    FROM tbl_screen s
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id
    WHERE s.screen_id = p_screen_id;
END //

CREATE PROCEDURE GetAllScreens()
BEGIN
    SELECT s.*, c.name AS cinema_name
    FROM tbl_screen s
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id;
END //

CREATE PROCEDURE ToggleScreenStatus(IN p_screen_id INT)
BEGIN
    UPDATE tbl_screen
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE screen_id = p_screen_id;
END //

-- Stored Procedures for Seat Layout Management
CREATE PROCEDURE AddSeatLayout(
    IN p_screen_id INT,
    IN p_seat_label VARCHAR(10),
    IN p_create_user VARCHAR(150)
)
BEGIN
    INSERT INTO tbl_seat_layout(screen_id, seat_label, create_user)
    VALUES(p_screen_id, p_seat_label, p_create_user);
    SELECT LAST_INSERT_ID() AS seat_id;
END //

CREATE PROCEDURE UpdateSeatLayout(
    IN p_seat_id INT,
    IN p_screen_id INT,
    IN p_seat_label VARCHAR(10),
    IN p_update_user VARCHAR(100)
)
BEGIN
    UPDATE tbl_seat_layout SET
        screen_id = COALESCE(p_screen_id, screen_id),
        seat_label = COALESCE(p_seat_label, seat_label),
        update_user = p_update_user,
        updated_at = CURRENT_TIMESTAMP
    WHERE seat_id = p_seat_id;
END //

CREATE PROCEDURE DeleteSeatLayout(IN p_seat_id INT)
BEGIN
    DELETE FROM tbl_seat_layout WHERE seat_id = p_seat_id;
END //

CREATE PROCEDURE GetSeatLayoutById(IN p_seat_id INT)
BEGIN
    SELECT sl.*, s.screen_name, c.name AS cinema_name
    FROM tbl_seat_layout sl
    JOIN tbl_screen s ON sl.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id
    WHERE sl.seat_id = p_seat_id;
END //

CREATE PROCEDURE GetSeatsByScreenId(IN p_screen_id INT)
BEGIN
    SELECT * FROM tbl_seat_layout WHERE screen_id = p_screen_id;
END //

CREATE PROCEDURE GetAllSeatLayouts()
BEGIN
    SELECT sl.*, s.screen_name, c.name AS cinema_name
    FROM tbl_seat_layout sl
    JOIN tbl_screen s ON sl.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id;
END //

CREATE PROCEDURE ToggleSeatLayoutStatus(IN p_seat_id INT)
BEGIN
    UPDATE tbl_seat_layout
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE seat_id = p_seat_id;
END //

-- Stored Procedures for Showtime Management
CREATE PROCEDURE AddShowtime(
    IN p_movie_id INT,
    IN p_screen_id INT,
    IN p_show_date DATE,
    IN p_show_time TIME,
    IN p_price DECIMAL(10,2),
    IN p_create_user VARCHAR(150)
)
BEGIN
    INSERT INTO tbl_showtime(movie_id, screen_id, show_date, show_time, price, create_user)
    VALUES(p_movie_id, p_screen_id, p_show_date, p_show_time, p_price, p_create_user);
    SELECT LAST_INSERT_ID() AS showtime_id;
END //

CREATE PROCEDURE UpdateShowtime(
    IN p_showtime_id INT,
    IN p_movie_id INT,
    IN p_screen_id INT,
    IN p_show_date DATE,
    IN p_show_time TIME,
    IN p_price DECIMAL(10,2),
    IN p_update_user VARCHAR(100)
)
BEGIN
    UPDATE tbl_showtime SET
        movie_id = COALESCE(p_movie_id, movie_id),
        screen_id = COALESCE(p_screen_id, screen_id),
        show_date = COALESCE(p_show_date, show_date),
        show_time = COALESCE(p_show_time, show_time),
        price = COALESCE(p_price, price),
        update_user = p_update_user,
        updated_at = CURRENT_TIMESTAMP
    WHERE showtime_id = p_showtime_id;
END //

CREATE PROCEDURE DeleteShowtime(IN p_showtime_id INT)
BEGIN
    DELETE FROM tbl_showtime WHERE showtime_id = p_showtime_id;
END //

CREATE PROCEDURE GetShowtimeById(IN p_showtime_id INT)
BEGIN
    SELECT st.*, m.title AS movie_title, s.screen_name, c.name AS cinema_name
    FROM tbl_showtime st
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen s ON st.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id
    WHERE st.showtime_id = p_showtime_id;
END //

CREATE PROCEDURE GetShowtimesByMovieAndCinema(
    IN p_movie_id INT,
    IN p_cinema_id INT,
    IN p_show_date DATE
)
BEGIN
    SELECT
        st.showtime_id,
        st.show_date,
        st.show_time,
        st.price,
        s.screen_id,
        s.screen_name,
        c.cinema_id,
        c.name AS cinema_name,
        m.title AS movie_title
    FROM tbl_showtime st
    JOIN tbl_screen s ON st.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    WHERE st.movie_id = p_movie_id
    AND s.cinema_id = p_cinema_id
    AND st.show_date = p_show_date
    AND st.status = 'Active'
    ORDER BY st.show_time ASC;
END //


CREATE PROCEDURE GetAllShowtimes()
BEGIN
    SELECT
        st.showtime_id,
        st.show_date,
        st.show_time,
        st.price,
        st.status,
        st.create_user,
        st.created_at,
        st.update_user,
        st.updated_at,
        m.title AS movie_title,
        s.screen_name,
        c.name AS cinema_name
    FROM tbl_showtime st
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen s ON st.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id;
END //

CREATE PROCEDURE ToggleShowtimeStatus(IN p_showtime_id INT)
BEGIN
    UPDATE tbl_showtime
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE showtime_id = p_showtime_id;
END //

-- Stored Procedures for Booking Management
CREATE PROCEDURE AddBooking(
    IN p_user_id INT,
    IN p_showtime_id INT,
    IN p_seat_ids_json TEXT, -- JSON array of seat IDs
    IN p_payment_method ENUM('Cash', 'Card', 'UPI'),
    IN p_total_amount DECIMAL(10,2),
    IN p_discount DECIMAL(10,2),
    IN p_final_amount DECIMAL(10,2),
    IN p_create_user VARCHAR(150)
)
BEGIN
    DECLARE v_booking_id INT;
    DECLARE v_seat_id INT;
    DECLARE i INT DEFAULT 0;
    DECLARE num_seats INT;

    -- Start Transaction
    START TRANSACTION;

    -- Insert into tbl_booking
    INSERT INTO tbl_booking (user_id, showtime_id, booking_status, create_user, status)
    VALUES (p_user_id, p_showtime_id, 'Booked', p_create_user, 'Active');

    SET v_booking_id = LAST_INSERT_ID();

    -- Insert into tbl_booking_seat for each seat
    -- Check seat availability before inserting. If any seat is already booked, rollback.
    SET num_seats = JSON_LENGTH(p_seat_ids_json);
    WHILE i < num_seats DO
        SET v_seat_id = JSON_UNQUOTE(JSON_EXTRACT(p_seat_ids_json, CONCAT('$[', i, ']')));

        -- Check if seat is already booked for this showtime
        IF EXISTS (SELECT 1 FROM tbl_booking_seat WHERE showtime_id = p_showtime_id AND seat_id = v_seat_id AND is_cancelled = FALSE) THEN
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'One or more selected seats are already booked for this showtime.';
        END IF;

        INSERT INTO tbl_booking_seat (booking_id, seat_id, showtime_id)
        VALUES (v_booking_id, v_seat_id, p_showtime_id);
        SET i = i + 1;
    END WHILE;

    -- Insert into tbl_order_summary
    INSERT INTO tbl_order_summary (booking_id, payment_method, total_amount, discount, final_amount, create_user, status)
    VALUES (v_booking_id, p_payment_method, p_total_amount, p_discount, p_final_amount, p_create_user, 'Active');

    -- Commit Transaction
    COMMIT;

    SELECT v_booking_id AS booking_id;
END //

CREATE PROCEDURE GetBookingById(IN p_booking_id INT)
BEGIN
    SELECT
        b.booking_id,
        b.booking_status,
        b.created_at,
        b.update_user,
        b.updated_at,
        b.status,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        st.showtime_id,
        st.show_date,
        st.show_time,
        st.price AS showtime_price,
        m.movie_id,
        m.title AS movie_title,
        m.poster_image,
        scr.screen_id,
        scr.screen_name,
        cin.cinema_id,
        cin.name AS cinema_name,
        os.order_id,
        os.payment_method,
        os.total_amount,
        os.discount,
        os.final_amount,
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'seat_id', bseat.seat_id,
                    'seat_label', sl.seat_label,
                    'is_cancelled', bseat.is_cancelled
                )
            )
            FROM tbl_booking_seat bseat
            JOIN tbl_seat_layout sl ON bseat.seat_id = sl.seat_id
            WHERE bseat.booking_id = b.booking_id
        ) AS booked_seats_details
    FROM tbl_booking b
    JOIN tbl_user u ON b.user_id = u.id
    JOIN tbl_showtime st ON b.showtime_id = st.showtime_id
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen scr ON st.screen_id = scr.screen_id
    JOIN tbl_cinema cin ON scr.cinema_id = cin.cinema_id
    LEFT JOIN tbl_order_summary os ON b.booking_id = os.booking_id
    WHERE b.booking_id = p_booking_id;
END //

CREATE PROCEDURE GetBookingsByUserId(IN p_user_id INT)
BEGIN
    SELECT
        b.booking_id,
        b.booking_status,
        b.created_at,
        st.showtime_id,
        st.show_date,
        st.show_time,
        st.price AS showtime_price,
        m.movie_id,
        m.title AS movie_title,
        m.poster_image,
        scr.screen_name,
        cin.name AS cinema_name,
        os.final_amount,
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'seat_id', bseat.seat_id,
                    'seat_label', sl.seat_label,
                    'is_cancelled', bseat.is_cancelled
                )
            )
            FROM tbl_booking_seat bseat
            JOIN tbl_seat_layout sl ON bseat.seat_id = sl.seat_id
            WHERE bseat.booking_id = b.booking_id
        ) AS booked_seats_details
    FROM tbl_booking b
    JOIN tbl_showtime st ON b.showtime_id = st.showtime_id
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen scr ON st.screen_id = scr.screen_id
    JOIN tbl_cinema cin ON scr.cinema_id = cin.cinema_id
    LEFT JOIN tbl_order_summary os ON b.booking_id = os.booking_id
    WHERE b.user_id = p_user_id
    ORDER BY b.created_at DESC;
END //

CREATE PROCEDURE GetAllBookings()
BEGIN
    SELECT
        b.booking_id,
        b.booking_status,
        b.created_at,
        b.status AS booking_overall_status,
        u.name AS user_name,
        u.email AS user_email,
        st.show_date,
        st.show_time,
        m.title AS movie_title,
        scr.screen_name,
        cin.name AS cinema_name,
        os.final_amount
    FROM tbl_booking b
    JOIN tbl_user u ON b.user_id = u.id
    JOIN tbl_showtime st ON b.showtime_id = st.showtime_id
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen scr ON st.screen_id = scr.screen_id
    JOIN tbl_cinema cin ON scr.cinema_id = cin.cinema_id
    LEFT JOIN tbl_order_summary os ON b.booking_id = os.booking_id
    ORDER BY b.created_at DESC;
END //

-- This procedure will "cancel" a booking by changing its status
CREATE PROCEDURE CancelBooking(
    IN p_booking_id INT,
    IN p_update_user VARCHAR(100)
)
BEGIN
    -- Update booking status to 'Cancelled' and overall status to 'Inactive'
    UPDATE tbl_booking
    SET
        booking_status = 'Cancelled',
        status = 'Inactive', -- Mark overall status as inactive for admin view
        update_user = p_update_user,
        updated_at = CURRENT_TIMESTAMP
    WHERE booking_id = p_booking_id;

    -- Mark all associated seats as cancelled
    UPDATE tbl_booking_seat
    SET
        is_cancelled = TRUE
    WHERE booking_id = p_booking_id;
END //

-- Procedure to get available seats for a specific showtime
CREATE PROCEDURE GetAvailableSeatsForShowtime(IN p_showtime_id INT)
BEGIN
    SELECT
        sl.seat_id,
        sl.seat_label,
        sl.status -- Seat layout status (Active/Inactive)
    FROM tbl_seat_layout sl
    JOIN tbl_screen s ON sl.screen_id = s.screen_id
    JOIN tbl_showtime st ON s.screen_id = st.screen_id
    WHERE st.showtime_id = p_showtime_id
    AND sl.status = 'Active' -- Only consider active seats
    AND NOT EXISTS (
        SELECT 1
        FROM tbl_booking_seat bs
        WHERE bs.showtime_id = p_showtime_id
        AND bs.seat_id = sl.seat_id
        AND bs.is_cancelled = FALSE -- Seat is not cancelled
    );
END //


DELIMITER ;





CREATE INDEX idx_screen_cinema_id ON tbl_screen(cinema_id);
CREATE INDEX idx_seat_layout_screen_id ON tbl_seat_layout(screen_id);
CREATE INDEX idx_showtime_movie_id ON tbl_showtime(movie_id);
CREATE INDEX idx_showtime_screen_id ON tbl_showtime(screen_id);
CREATE INDEX idx_showtime_date_time ON tbl_showtime(show_date, show_time);
CREATE INDEX idx_booking_user_id ON tbl_booking(user_id);
CREATE INDEX idx_booking_showtime_id ON tbl_booking(showtime_id);
CREATE INDEX idx_booking_seat_booking_id ON tbl_booking_seat(booking_id);
CREATE INDEX idx_booking_seat_seat_id ON tbl_booking_seat(seat_id);
CREATE INDEX idx_booking_seat_showtime_id ON tbl_booking_seat(showtime_id);
CREATE INDEX idx_order_summary_booking_id ON tbl_order_summary(booking_id);




DELIMITER //

CREATE PROCEDURE GetBookingById(IN p_booking_id INT)
BEGIN
    SELECT
        b.booking_id,
        b.booking_status,
        b.created_at,
        b.update_user,
        b.updated_at,
        b.status,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        st.showtime_id,
        st.show_date,
        st.show_time,
        st.price AS showtime_price,
        m.movie_id,
        m.title AS movie_title,
        m.poster_image,
        scr.screen_id,
        scr.screen_name,
        cin.cinema_id,
        cin.name AS cinema_name,
        os.order_id,
        os.payment_method,
        os.total_amount,
        os.discount,
        os.final_amount,
        (
            SELECT CONCAT('[', GROUP_CONCAT(
                CONCAT(
                    '{',
                    '"seat_id":', bseat.seat_id, ',',
                    '"seat_label":"', sl.seat_label, '",',
                    '"is_cancelled":', IF(bseat.is_cancelled, 'true', 'false'),
                    '}'
                ) SEPARATOR ','
            ), ']')
            FROM tbl_booking_seat bseat
            JOIN tbl_seat_layout sl ON bseat.seat_id = sl.seat_id
            WHERE bseat.booking_id = b.booking_id
        ) AS booked_seats_details
    FROM tbl_booking b
    JOIN tbl_user u ON b.user_id = u.id
    JOIN tbl_showtime st ON b.showtime_id = st.showtime_id
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen scr ON st.screen_id = scr.screen_id
    JOIN tbl_cinema cin ON scr.cinema_id = cin.cinema_id
    LEFT JOIN tbl_order_summary os ON b.booking_id = os.booking_id
    WHERE b.booking_id = p_booking_id;
END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE GetBookingsByUserId(IN p_user_id INT)
BEGIN
    SELECT
        b.booking_id,
        b.booking_status,
        b.created_at,
        st.showtime_id,
        st.show_date,
        st.show_time,
        st.price AS showtime_price,
        m.movie_id,
        m.title AS movie_title,
        m.poster_image,
        scr.screen_name,
        cin.name AS cinema_name,
        os.final_amount,
        (
            SELECT CONCAT('[', GROUP_CONCAT(
                CONCAT(
                    '{',
                    '"seat_id":', bseat.seat_id, ',',
                    '"seat_label":"', sl.seat_label, '",',
                    '"is_cancelled":', IF(bseat.is_cancelled, 'true', 'false'),
                    '}'
                ) SEPARATOR ','
            ), ']')
            FROM tbl_booking_seat bseat
            JOIN tbl_seat_layout sl ON bseat.seat_id = sl.seat_id
            WHERE bseat.booking_id = b.booking_id
        ) AS booked_seats_details
    FROM tbl_booking b
    JOIN tbl_showtime st ON b.showtime_id = st.showtime_id
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen scr ON st.screen_id = scr.screen_id
    JOIN tbl_cinema cin ON scr.cinema_id = cin.cinema_id
    LEFT JOIN tbl_order_summary os ON b.booking_id = os.booking_id
    WHERE b.user_id = p_user_id
    ORDER BY b.created_at DESC;
END //

DELIMITER ;

CREATE TABLE tbl_news (
    news_id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    create_user VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100),
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive') DEFAULT 'Active'
);


-- Add News
DELIMITER //
CREATE PROCEDURE AddNews(
    IN p_image VARCHAR(255),
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_create_user VARCHAR(150)
)
BEGIN
    INSERT INTO tbl_news (image, title, description, create_user)
    VALUES (p_image, p_title, p_description, p_create_user);
END //
DELIMITER ;

-- Get All News
DELIMITER //
CREATE PROCEDURE GetAllNews()
BEGIN
    SELECT * FROM tbl_news ORDER BY created_at DESC;
END //
DELIMITER ;

-- Get News by ID
DELIMITER //
CREATE PROCEDURE GetNewsById(IN p_news_id INT)
BEGIN
    SELECT * FROM tbl_news WHERE news_id = p_news_id;
END //
DELIMITER ;

-- Update News
DELIMITER //
CREATE PROCEDURE UpdateNews(
    IN p_news_id INT,
    IN p_image VARCHAR(255),
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_update_user VARCHAR(100)
)
BEGIN
    UPDATE tbl_news
    SET image = IFNULL(p_image, image),
        title = IFNULL(p_title, title),
        description = IFNULL(p_description, description),
        update_user = p_update_user
    WHERE news_id = p_news_id;
END //
DELIMITER ;

-- Delete News
DELIMITER //
CREATE PROCEDURE DeleteNews(IN p_news_id INT)
BEGIN
    DELETE FROM tbl_news WHERE news_id = p_news_id;
END //
DELIMITER ;

-- Toggle Status
DELIMITER //
CREATE PROCEDURE ToggleNewsStatus(IN p_news_id INT)
BEGIN
    UPDATE tbl_news
    SET status = IF(status = 'Active', 'Inactive', 'Active')
    WHERE news_id = p_news_id;
END //
DELIMITER ;

