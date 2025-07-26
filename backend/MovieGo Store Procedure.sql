USE moviego;

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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetUserByEmail(IN uemail VARCHAR(150))
BEGIN
  SELECT * FROM tbl_user WHERE email = uemail;
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
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

DELIMITER //
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
    SELECT LAST_INSERT_ID() AS movie_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE UpdateMovie(
    IN p_movie_id INT,
    IN p_title VARCHAR(255),
    IN p_genre VARCHAR(255),
    IN p_duration VARCHAR(20),
    IN p_rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
    IN p_synopsis TEXT,
    IN p_poster_image VARCHAR(255),
    IN p_background_image VARCHAR(255),
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DeleteMovie(IN p_movie_id INT)
BEGIN
    DELETE FROM tbl_movie WHERE movie_id = p_movie_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ToggleMovieStatus(IN p_movie_id INT)
BEGIN
    UPDATE tbl_movie
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE movie_id = p_movie_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetActiveNowPlayingMovies()
BEGIN
    SELECT movie_id, title, genre, duration, rating, synopsis, poster_image, background_image, release_date, release_status
    FROM tbl_movie
    WHERE release_status = 'Now Playing' AND status = 'Active'
    ORDER BY release_date DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetActiveUpcomingMovies()
BEGIN
    SELECT movie_id, title, genre, duration, rating, synopsis, poster_image, background_image, release_date, release_status
    FROM tbl_movie
    WHERE release_status = 'Upcoming' AND status = 'Active'
    ORDER BY release_date ASC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetActiveMovieById(IN p_movie_id INT)
BEGIN
    SELECT movie_id, title, genre, duration, rating, synopsis, poster_image, background_image, release_date, release_status
    FROM tbl_movie
    WHERE movie_id = p_movie_id AND status = 'Active';
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetMovieByIdAdmin(IN p_movie_id INT)
BEGIN
    SELECT * FROM tbl_movie WHERE movie_id = p_movie_id;
END //
DELIMITER ;

DELIMITER //
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
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetAllCinemas()
BEGIN
  SELECT * FROM tbl_cinema;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetCinemaById(IN p_cinema_id INT)
BEGIN
  SELECT * FROM tbl_cinema WHERE cinema_id = p_cinema_id;
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DeleteCinema(IN p_cinema_id INT)
BEGIN
  DELETE FROM tbl_cinema WHERE cinema_id = p_cinema_id;
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DeleteCinemaReview(IN p_review_id INT)
BEGIN
    DELETE FROM tbl_cinema_review WHERE review_id = p_review_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetCinemaReviews(IN p_cinema_id INT)
BEGIN
    SELECT r.*, u.name AS user_name, u.email AS user_email, u.image AS user_image
    FROM tbl_cinema_review r
    JOIN tbl_user u ON r.user_id = u.id
    WHERE r.cinema_id = p_cinema_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetAllCinemaReviews()
BEGIN
    SELECT r.*, u.name AS user_name, u.email AS user_email, u.image AS user_image, c.name AS cinema_name
    FROM tbl_cinema_review r
    JOIN tbl_user u ON r.user_id = u.id
    JOIN tbl_cinema c ON r.cinema_id = c.cinema_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ToggleCinemaReviewStatus(IN p_review_id INT)
BEGIN
    UPDATE tbl_cinema_review
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE review_id = p_review_id;
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DeleteScreen(IN p_screen_id INT)
BEGIN
    DELETE FROM tbl_screen WHERE screen_id = p_screen_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetScreenById(IN p_screen_id INT)
BEGIN
    SELECT s.*, c.name AS cinema_name
    FROM tbl_screen s
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id
    WHERE s.screen_id = p_screen_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetAllScreens()
BEGIN
    SELECT s.*, c.name AS cinema_name
    FROM tbl_screen s
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ToggleScreenStatus(IN p_screen_id INT)
BEGIN
    UPDATE tbl_screen
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE screen_id = p_screen_id;
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DeleteSeatLayout(IN p_seat_id INT)
BEGIN
    DELETE FROM tbl_seat_layout WHERE seat_id = p_seat_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetSeatLayoutById(IN p_seat_id INT)
BEGIN
    SELECT sl.*, s.screen_name, c.name AS cinema_name
    FROM tbl_seat_layout sl
    JOIN tbl_screen s ON sl.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id
    WHERE sl.seat_id = p_seat_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetSeatsByScreenId(IN p_screen_id INT)
BEGIN
    SELECT * FROM tbl_seat_layout WHERE screen_id = p_screen_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetAllSeatLayouts()
BEGIN
    SELECT sl.*, s.screen_name, c.name AS cinema_name
    FROM tbl_seat_layout sl
    JOIN tbl_screen s ON sl.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ToggleSeatLayoutStatus(IN p_seat_id INT)
BEGIN
    UPDATE tbl_seat_layout
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE seat_id = p_seat_id;
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DeleteShowtime(IN p_showtime_id INT)
BEGIN
    DELETE FROM tbl_showtime WHERE showtime_id = p_showtime_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetShowtimeById(IN p_showtime_id INT)
BEGIN
    SELECT st.*, m.title AS movie_title, s.screen_name, c.name AS cinema_name
    FROM tbl_showtime st
    JOIN tbl_movie m ON st.movie_id = m.movie_id
    JOIN tbl_screen s ON st.screen_id = s.screen_id
    JOIN tbl_cinema c ON s.cinema_id = c.cinema_id
    WHERE st.showtime_id = p_showtime_id;
END //
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ToggleShowtimeStatus(IN p_showtime_id INT)
BEGIN
    UPDATE tbl_showtime
    SET status = IF(status = 'Active', 'Inactive', 'Active'), updated_at = CURRENT_TIMESTAMP
    WHERE showtime_id = p_showtime_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE AddBooking(
    IN p_user_id INT,
    IN p_showtime_id INT,
    IN p_seat_ids_json TEXT,
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
    START TRANSACTION;
    INSERT INTO tbl_booking (user_id, showtime_id, booking_status, create_user, status)
    VALUES (p_user_id, p_showtime_id, 'Booked', p_create_user, 'Active');
    SET v_booking_id = LAST_INSERT_ID();
    SET num_seats = JSON_LENGTH(p_seat_ids_json);
    WHILE i < num_seats DO
        SET v_seat_id = JSON_UNQUOTE(JSON_EXTRACT(p_seat_ids_json, CONCAT('$[', i, ']')));
        IF EXISTS (SELECT 1 FROM tbl_booking_seat WHERE showtime_id = p_showtime_id AND seat_id = v_seat_id AND is_cancelled = FALSE) THEN
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'One or more selected seats are already booked for this showtime.';
        END IF;
        INSERT INTO tbl_booking_seat (booking_id, seat_id, showtime_id)
        VALUES (v_booking_id, v_seat_id, p_showtime_id);
        SET i = i + 1;
    END WHILE;
    INSERT INTO tbl_order_summary (booking_id, payment_method, total_amount, discount, final_amount, create_user, status)
    VALUES (v_booking_id, p_payment_method, p_total_amount, p_discount, p_final_amount, p_create_user, 'Active');
    COMMIT;
    SELECT v_booking_id AS booking_id;
END //
DELIMITER ;

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

DELIMITER //
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
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CancelBooking(
    IN p_booking_id INT,
    IN p_update_user VARCHAR(100)
)
BEGIN
    UPDATE tbl_booking
    SET
        booking_status = 'Cancelled',
        status = 'Inactive',
        update_user = p_update_user,
        updated_at = CURRENT_TIMESTAMP
    WHERE booking_id = p_booking_id;
    UPDATE tbl_booking_seat
    SET
        is_cancelled = TRUE
    WHERE booking_id = p_booking_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetAvailableSeatsForShowtime(IN p_showtime_id INT)
BEGIN
    SELECT
        sl.seat_id,
        sl.seat_label,
        sl.status
    FROM tbl_seat_layout sl
    JOIN tbl_screen s ON sl.screen_id = s.screen_id
    JOIN tbl_showtime st ON s.screen_id = st.screen_id
    WHERE st.showtime_id = p_showtime_id
    AND sl.status = 'Active'
    AND NOT EXISTS (
        SELECT 1
        FROM tbl_booking_seat bs
        WHERE bs.showtime_id = p_showtime_id
        AND bs.seat_id = sl.seat_id
        AND bs.is_cancelled = FALSE
    );
END //
DELIMITER ;

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

DELIMITER //
CREATE PROCEDURE GetAllNews()
BEGIN
    SELECT * FROM tbl_news ORDER BY created_at DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetNewsById(IN p_news_id INT)
BEGIN
    SELECT * FROM tbl_news WHERE news_id = p_news_id;
END //
DELIMITER ;

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

DELIMITER //
CREATE PROCEDURE DeleteNews(IN p_news_id INT)
BEGIN
    DELETE FROM tbl_news WHERE news_id = p_news_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ToggleNewsStatus(IN p_news_id INT)
BEGIN
    UPDATE tbl_news
    SET status = IF(status = 'Active', 'Inactive', 'Active')
    WHERE news_id = p_news_id;
END //
DELIMITER ;

DELIMITER //
-- Recalculate and update cinema ratings
CREATE PROCEDURE UpdateCinemaRatings(IN p_cinema_id INT)
BEGIN
    DECLARE avg_rating_value DECIMAL(3,2);
    DECLARE total_review_count INT;

    SELECT 
        IFNULL(AVG(rating), 0),
        COUNT(*) 
    INTO avg_rating_value, total_review_count
    FROM tbl_cinema_review
    WHERE cinema_id = p_cinema_id AND status = 'Active';

    UPDATE tbl_cinema
    SET avg_rating = avg_rating_value,
        total_reviews = total_review_count
    WHERE cinema_id = p_cinema_id;
END //
DELIMITER;