CREATE TABLE fighters(
 id SERIAL PRIMARY KEY,
 first_name VARCHAR (50) NOT NULL,
 last_name VARCHAR (50)  NOT NULL,
 country_id INT NOT NULL,
 style VARCHAR (50) NOT NULL
);

INSERT INTO fighters (first_name, last_name, country_id, style) VALUES
    ('Bruce','Lee',10,'Jeet Kune Do'),
    ('Chuck','Norris',2,'Chun Kuk Do'),
    ('Jackie','Chan',11,'Kung-Fu'),
    ('Ip','Man',10,'Wing Chun'),
    ('Tony','Jaa',87,'Muay Thai'),
    ('Jean Claude','Van Damme',8,'Kickboxing'),
    ('Jet','Li', 10,'Wushu');
