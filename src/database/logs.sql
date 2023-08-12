CREATE TABLE logs (
  `id` INT NOT NULL AUTO_INCREMENT,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clicks` INT(32) NOT NULL,
  `cpc` INT(32) NOT NULL,
  `messages` INT(32) NOT NULL,
  `cpr` INT(32) NOT NULL,
  `spend` INT(32) NOT NULL,
  `campaign_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user` (`campaign_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
)
