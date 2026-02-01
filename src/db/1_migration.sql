CREATE TABLE `Books` (
    `book_id` int NOT NULL,
    `title` varchar(255) NOT NULL,
    `author_fname` varchar(255) NOT NULL,
    `author_lname` varchar(255) NOT NULL,
    `released_year` int NOT NULL,
    `stock_quantity` int NOT NULL,
    `pages` int NOT NULL,
    PRIMARY KEY (`book_id`)
);

CREATE TABLE `User` (
    `Id` varchar(255) NOT NULL,
    `Username` varchar(255) NOT NULL,
    `Age` int NOT NULL,
    `IsAdmin` boolean NOT NULL,
    PRIMARY KEY (`Id`)
);