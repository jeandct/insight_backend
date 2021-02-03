CREATE SCHEMA IF NOT EXISTS `checkpoint_4` DEFAULT CHARACTER SET utf8;
USE `checkpoint_4`;
-- -----------------------------------------------------
-- Table `checkpoint_4`.`company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `checkpoint_4`.`company` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `company` VARCHAR(45) NOT NULL,
  `encrypted_password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `checkpoint_4`.`candidate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `checkpoint_4`.`candidate` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `encrypted_password` VARCHAR(255) NOT NULL,
  `cv` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `checkpoint_4`.`offer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `checkpoint_4`.`offer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `company_id` INT NOT NULL,
  `completed` TINYINT NOT NULL DEFAULT 0,
  `text` TEXT(1000) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_offres_companies_idx` (`company_id` ASC) VISIBLE,
  CONSTRAINT `fk_offres_companies` FOREIGN KEY (`company_id`) REFERENCES `checkpoint_4`.`company` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `checkpoint_4`.`offer_has_candidate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `checkpoint_4`.`offer_has_candidate` (
  `offer_id` INT NOT NULL,
  `candidate_id` INT NOT NULL,
  `meeting_date` DATETIME NULL,
  PRIMARY KEY (`offer_id`, `candidate_id`),
  INDEX `fk_offer_has_candidate_candidate1_idx` (`candidate_id` ASC) VISIBLE,
  INDEX `fk_offer_has_candidate_offer1_idx` (`offer_id` ASC) VISIBLE,
  CONSTRAINT `fk_offer_has_candidate_offer1` FOREIGN KEY (`offer_id`) REFERENCES `checkpoint_4`.`offer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_offer_has_candidate_candidate1` FOREIGN KEY (`candidate_id`) REFERENCES `checkpoint_4`.`candidate` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;