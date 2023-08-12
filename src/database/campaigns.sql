CREATE TABLE campaigns (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    daily_budget INT(32) NOT NULL,
    clicks_goal INT(32) NOT NULL DEFAULT 115,
    cpc_goal INT(32) GENERATED ALWAYS AS (daily_budget / clicks_goal) VIRTUAL NOT NULL
)