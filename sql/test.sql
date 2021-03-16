--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: to_yyyy_char(timestamp with time zone); Type: FUNCTION; Schema: public; Owner: bracketclub-test
--

CREATE FUNCTION to_yyyy_char(some_time timestamp with time zone) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $_$
    select to_char($1, 'yyyy');
$_$;


ALTER FUNCTION public.to_yyyy_char(some_time timestamp with time zone) OWNER TO "bracketclub-test";

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: entries; Type: TABLE; Schema: public; Owner: bracketclub-test
--

CREATE TABLE entries (
    id text NOT NULL,
    bracket text NOT NULL,
    "user" text NOT NULL,
    created timestamp with time zone NOT NULL,
    sport text NOT NULL
);


ALTER TABLE entries OWNER TO "bracketclub-test";

--
-- Name: masters; Type: TABLE; Schema: public; Owner: bracketclub-test
--

CREATE TABLE masters (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    bracket text NOT NULL,
    sport text NOT NULL
);


ALTER TABLE masters OWNER TO "bracketclub-test";

--
-- Name: masters_id_seq; Type: SEQUENCE; Schema: public; Owner: bracketclub-test
--

CREATE SEQUENCE masters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE masters_id_seq OWNER TO "bracketclub-test";

--
-- Name: masters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bracketclub-test
--

ALTER SEQUENCE masters_id_seq OWNED BY masters.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: bracketclub-test
--

CREATE TABLE users (
    id text NOT NULL,
    username text NOT NULL,
    name text,
    profile_pic text
);


ALTER TABLE users OWNER TO "bracketclub-test";

--
-- Name: masters id; Type: DEFAULT; Schema: public; Owner: bracketclub-test
--

ALTER TABLE ONLY masters ALTER COLUMN id SET DEFAULT nextval('masters_id_seq'::regclass);


--
-- Data for Name: entries; Type: TABLE DATA; Schema: public; Owner: bracketclub-test
--

COPY entries (id, bracket, "user", created, sport) FROM stdin;
\.


--
-- Data for Name: masters; Type: TABLE DATA; Schema: public; Owner: bracketclub-test
--

COPY masters (id, created, bracket, sport) FROM stdin;
\.


--
-- Name: masters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bracketclub-test
--

SELECT pg_catalog.setval('masters_id_seq', 1, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bracketclub-test
--

COPY users (id, username, name, profile_pic) FROM stdin;
\.


--
-- Name: entries entries_pkey; Type: CONSTRAINT; Schema: public; Owner: bracketclub-test
--

ALTER TABLE ONLY entries
    ADD CONSTRAINT entries_pkey PRIMARY KEY (id);


--
-- Name: masters masters_pkey; Type: CONSTRAINT; Schema: public; Owner: bracketclub-test
--

ALTER TABLE ONLY masters
    ADD CONSTRAINT masters_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: bracketclub-test
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: masters_bracket_to_yyyy_char_idx; Type: INDEX; Schema: public; Owner: bracketclub-test
--

CREATE UNIQUE INDEX masters_bracket_to_yyyy_char_idx ON masters USING btree (bracket, sport, to_yyyy_char(created));


--
-- Name: entries entries_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bracketclub-test
--

ALTER TABLE ONLY entries
    ADD CONSTRAINT entries_user_fkey FOREIGN KEY ("user") REFERENCES users(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: bracketclub-test
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO "bracketclub-test";


--
-- PostgreSQL database dump complete
--

