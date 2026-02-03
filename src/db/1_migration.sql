CREATE TABLE `Books` (
    `book_id` varchar(255) NOT NULL,
    `title` varchar(255) NOT NULL,
    `author_fname` varchar(255) NOT NULL,
    `author_lname` varchar(255) NOT NULL,
    `released_year` int NOT NULL,
    `stock_quantity` int NOT NULL,
    `pages` int NOT NULL,
    PRIMARY KEY (`book_id`)
);

CREATE TABLE `User` (
    `User_Id` int NOT NULL,
    `Id` int NOT NULL,
    `Username` varchar(255) NOT NULL,
    `Age` varchar(255) NOT NULL,
    `IsAdmin` boolean NOT NULL,
    PRIMARY KEY (`User_Id`)
);