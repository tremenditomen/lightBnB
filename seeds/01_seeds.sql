--inserting into USERS
INSERT INTO users (name, email,password)
VALUES ('Eva Stanley', 'sebastianguerra@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer', 'jacksonrose@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks', 'victoriablackwell@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');



-- inserting into RESERVATIONS
INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

--insert into PROPERTIES
INSERT INTO properties (owner_id, title, description,thumbnail_photo_url,cover_photo_url,cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms,country,street,city,province,post_code,active)
VALUES (1,'speed lamp', 'desc', 'url', 'url',930,6,4,8,'Canada','536 highway','sotboske','quebec',28142,true ),
 (2,'blank corner', 'desc', 'url', 'url',730,2,1,3,'Canada','76 rd','calgary','alberta',34542,true ),
 (3,'bad habits', 'desc', 'url', 'url',530,6,4,8,'Canada','536 kensington rd','rotunif','bewfoundland and labrador',09644,true );

 --insert into PROPERTY REVIEWS
 INSERT INTO property_reviews(guest_id,property_id,reservation_id,rating,message)
VALUES (2,2,1,3,'mes'),
(1,4,1,4,'mess'),
(8,1,2,4,'message');