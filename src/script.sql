DROP TABLE IF EXISTS checked_out_book;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS book_copy;
DROP TABLE IF EXISTS book;

CREATE TABLE IF NOT EXISTS book (
    id serial primary key,
    title varchar(255) not null,
    author varchar(255) not null,
    quantity int
);

CREATE TABLE IF NOT EXISTS book_copy (
    id serial primary key,
    book_id int REFERENCES book(id)
);

CREATE TABLE IF NOT EXISTS member (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255)
);

CREATE TABLE IF NOT EXISTS checked_out_book (
    id serial primary key,
    copy_id int REFERENCES book_copy(id),
    member_id int REFERENCES member(id),
    check_out_date date,
    return_date date  
);
ALTER TABLE book ADD COLUMN deleted boolean not null default false;

INSERT INTO book(title, author, quantity) 
VALUES ('A Silent Death', 'Peter May', 3),
('What Mummy Makes', 'Rebecca Wilson', 2),
('The institute', 'Stephen King', 3),
('The Boy, The Mole, The Fox and The Horse', 'Charlie Mackesy', 1),
('Where the Crawdads Sing', 'Delia Owens', 3),
('The Last Window', 'Karin Slaughter', 2),
('Girl, Woman, Other', 'Bernardine Evaristo', 3),
('The Body', 'Bill Bryson', 1),
('The Giver of Stars', 'Jojo Moyes', 2),
('Midnight Sun', 'Stephenie Meyer', 2);

INSERT INTO book_copy(book_id)
VALUES (1),
(1),
(1),
(2),
(2),
(3),
(3),
(3),
(4),
(5),
(5),
(5),
(6),
(6),
(7),
(7),
(7),
(8),
(9),
(9),
(10),
(10);

INSERT INTO member(name, email)
VALUES ('Omar Conley', 'omar.conley@gmail.com'),
('Laura Kumar', 'laura.kumar@gmail.com'),
('Marsha Romero', 'marsha.romero@gmail.com'),
('Vernon Osborn', 'vernon.osborn@gmail.com'),
('Suzannah Doherty', 'suzannah.doherty@gmail.com'),
('Arwen Bowman', 'arwen.bowman@gmail.com'),
('Emilio Brookins', 'emilio.brookins@gamil.com'),
('Efe Thompson', 'efe.thompson@gmail.com'),
('Bronte Rocha', 'bronte.rocha@gmail.com'),
('Sommer Vang', 'sommer.vang@gmail.com');

INSERT INTO checked_out_book(copy_id, member_id, check_out_date, return_date)
VALUES 
(1, 3, '2020-05-12', '2020-05-31'),
(2, 7, '2020-05-19', '2020-06-08'),
(4, 1, '2020-06-10', '2020-06-24'),
(7, 2, '2020-06-06', '2020-06-20'),
(8, 5, '2020-07-19', '2020-07-30'),
(10, 2, '2020-08-17', '2020-08-29'),
(11, 8, '2020-08-24', '2020-09-09'),
(13, 6, '2020-07-04', '2020-07-18'),
(16, 1, '2020-07-07', '2020-07-21'),
(17, 9, '2020-08-16', '2020-08-30'),
(18, 7, '2020-08-13', '2020-08-27'),
(20, 10, '2020-08-09', '2020-08-22'),
(22, 4, '2020-07-22', '2020-08-06');




--Use psql -U postgres book_database command to get the psql terminal for book_database
-- In there you can look at your tables within the database (\dt) and use SELECT to check the data within the table
-- \q to get out of the database and into just the src file, then you can use 
-- psql -U postgres -d book_database  -f script.sql to run the script file and use psql -U postgres book_database
-- to get back in 