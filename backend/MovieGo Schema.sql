-- MovieGo Schema

USE moviego;

-- Create tbl_user Table
CREATE TABLE tbl_user (
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

-- Create tbl_cinema Table
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

-- Create tbl_cinema_review Table
CREATE TABLE IF NOT EXISTS tbl_cinema_review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    create_user VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_user VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    avg_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    FOREIGN KEY (cinema_id) REFERENCES tbl_cinema(cinema_id),
    FOREIGN KEY (user_id) REFERENCES tbl_user(id)
);

ALTER TABLE tbl_cinema_review
MODIFY COLUMN update_user VARCHAR(100) NULL;

-- Create tbl_movie Table
CREATE TABLE IF NOT EXISTS tbl_movie (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    duration VARCHAR(20),
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
    status ENUM('Active', 'Inactive') DEFAULT 'Active'
);

-- Indexes for performance
CREATE INDEX idx_email ON tbl_user(email);
CREATE INDEX idx_status ON tbl_user(status);
CREATE INDEX idx_movie_release_status ON tbl_movie(release_status);
CREATE INDEX idx_movie_status ON tbl_movie(status);
CREATE INDEX idx_movie_release_date ON tbl_movie(release_date);
