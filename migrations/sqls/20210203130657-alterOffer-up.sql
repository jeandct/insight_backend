ALTER TABLE
  `offer`
ADD
  COLUMN `title` VARCHAR(45) NOT NULL
AFTER
  `text`,
ADD
  COLUMN `location` VARCHAR(45) NOT NULL
AFTER
  `title`;