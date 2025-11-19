# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, first_name, last_name,email,hashedPassword) VALUES ('gold', "Gold", "User", "gold@gold.ac.uk", "$2b$10$D4ONhx2EVH2/KoiTJ0JHte4REHA1Ft3QHDmVMnHXWU1OwQo3OSrce");