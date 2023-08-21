CREATE TABLE campaigns (
    id CHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    clicks INT(32) DEFAULT 0,
    spend INT(32) DEFAULT 0,
    cpc INT(32) DEFAULT 0
)