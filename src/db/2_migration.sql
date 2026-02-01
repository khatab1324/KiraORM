CREATE TABLE `Users` (
    `Id` varchar(255) NOT NULL,
    `Username` varchar(255) NOT NULL,
    `Age` int NOT NULL,
    `IsAdmin` boolean NOT NULL,
    PRIMARY KEY (`Id`)
);

DROP TABLE `User`;