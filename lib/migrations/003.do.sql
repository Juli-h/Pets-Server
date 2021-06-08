ALTER TABLE pets 
ADD COLUMN pet_type VARCHAR(50),
ADD COLUMN adoption_status ENUM ('Adopted', 'Fostered', 'Available')  NOT NULL, 
ADD COLUMN picture_url VARCHAR(500),
ADD COLUMN pet_height INT,
ADD COLUMN pet_weight INT,
ADD COLUMN color VARCHAR(50),
ADD COLUMN bio VARCHAR(500),
ADD COLUMN hypoallergenic TINYINT(0),
ADD COLUMN dietary_restrictions VARCHAR(500), 
ADD COLUMN breed VARCHAR(50);