--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- User schema --
DROP TABLE IF EXISTS emailuser;
CREATE TABLE emailuser(email VARCHAR(64), name VARCHAR(64), password VARCHAR(164), avatarurl VARCHAR(164));
-- Mailbox schema --
DROP TABLE IF EXISTS mailbox;
CREATE TABLE mailbox(owner VARCHAR(64), name VARCHAR(64));
-- Mail schema --
DROP TABLE IF EXISTS mail;
CREATE TABLE mail(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), mailbox VARCHAR(64), mail jsonb);