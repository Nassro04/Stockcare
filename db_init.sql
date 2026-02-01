--
-- PostgreSQL database dump
--

\restrict ghPUM3ugSkj2jvNBCxM1mAmWSWdlT1m3nEow7GMo52e5Jf418uM777oLstW15qm

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.stock_movements DROP CONSTRAINT IF EXISTS "FK_d7fedfd6ee0f4a06648c48631c6";
ALTER TABLE IF EXISTS ONLY public.batches DROP CONSTRAINT IF EXISTS "FK_cc20e5d1a22b2203e8c2d1557b6";
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS "FK_bd2726fd31b35443f2245b93ba0";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "FK_9a5f6868c96e0069e699f33e124";
ALTER TABLE IF EXISTS ONLY public.stock_movements DROP CONSTRAINT IF EXISTS "FK_64c67f927d872a7e19700ab6637";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "FK_0ec433c1e1d444962d592d86c86";
ALTER TABLE IF EXISTS ONLY public.batches DROP CONSTRAINT IF EXISTS "FK_07ad38527d0d87601f3b05a6a22";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "UQ_fe0bb3f6520ee0469504521e710";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "UQ_c44ac33a05b144dd0d9ddcf9327";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "UQ_adfc522baf9d9b19cd7d9461b7e";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "UQ_97672ac88f789774dd47f7c8be3";
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS "UQ_8b0be371d28245da6e4f4b61878";
ALTER TABLE IF EXISTS ONLY public.locations DROP CONSTRAINT IF EXISTS "UQ_227023051ab1fedef7a3b6c7e2a";
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS "PK_b70ac51766a9e3144f778cfe81e";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
ALTER TABLE IF EXISTS ONLY public.locations DROP CONSTRAINT IF EXISTS "PK_7cc1c9e3853b94816c094825e74";
ALTER TABLE IF EXISTS ONLY public.stock_movements DROP CONSTRAINT IF EXISTS "PK_57a26b190618550d8e65fb860e7";
ALTER TABLE IF EXISTS ONLY public.batches DROP CONSTRAINT IF EXISTS "PK_55e7ff646e969b61d37eea5be7a";
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS "PK_24dbc6126a28ff948da33e97d3b";
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS "PK_1bb179d048bbc581caa3b013439";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "PK_0806c755e0aca124e67c0cf6d7d";
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.suppliers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.stock_movements ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.locations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.batches ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_logs ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.suppliers_id_seq;
DROP TABLE IF EXISTS public.suppliers;
DROP SEQUENCE IF EXISTS public.stock_movements_id_seq;
DROP TABLE IF EXISTS public.stock_movements;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.locations_id_seq;
DROP TABLE IF EXISTS public.locations;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.batches_id_seq;
DROP TABLE IF EXISTS public.batches;
DROP SEQUENCE IF EXISTS public.audit_logs_id_seq;
DROP TABLE IF EXISTS public.audit_logs;
DROP TYPE IF EXISTS public.users_role_enum;
DROP TYPE IF EXISTS public.stock_movements_type_enum;
--
-- Name: stock_movements_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.stock_movements_type_enum AS ENUM (
    'IN',
    'OUT',
    'ADJUSTMENT'
);


ALTER TYPE public.stock_movements_type_enum OWNER TO admin;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.users_role_enum AS ENUM (
    'PHARMACIEN',
    'MAGASINIER',
    'ADMIN',
    'AUDITEUR',
    'ADMIN_IT'
);


ALTER TYPE public.users_role_enum OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    action_type character varying NOT NULL,
    entity_affected character varying,
    old_value jsonb,
    new_value jsonb,
    ip_address character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer
);


ALTER TABLE public.audit_logs OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_logs_id_seq OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: batches; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches (
    id integer NOT NULL,
    batch_number character varying(100) NOT NULL,
    quantity integer NOT NULL,
    expiration_date date NOT NULL,
    received_at timestamp without time zone DEFAULT now() NOT NULL,
    product_id integer NOT NULL,
    location_id integer
);


ALTER TABLE public.batches OWNER TO admin;

--
-- Name: batches_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.batches_id_seq OWNER TO admin;

--
-- Name: batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.batches_id_seq OWNED BY public.batches.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.categories OWNER TO admin;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO admin;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.locations OWNER TO admin;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locations_id_seq OWNER TO admin;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    sku character varying(100),
    barcode character varying(255),
    min_threshold integer DEFAULT 10 NOT NULL,
    max_threshold integer,
    datamatrix_code character varying(255),
    is_prescription_needed boolean DEFAULT false NOT NULL,
    price numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    category_id integer,
    supplier_id integer
);


ALTER TABLE public.products OWNER TO admin;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO admin;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    type public.stock_movements_type_enum NOT NULL,
    quantity_change integer NOT NULL,
    reason text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    batch_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.stock_movements OWNER TO admin;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_movements_id_seq OWNER TO admin;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    contact_person character varying(255),
    contact_email character varying(255),
    contact_phone character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.suppliers OWNER TO admin;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suppliers_id_seq OWNER TO admin;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    role public.users_role_enum DEFAULT 'MAGASINIER'::public.users_role_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: batches id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches ALTER COLUMN id SET DEFAULT nextval('public.batches_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.audit_logs (id, action_type, entity_affected, old_value, new_value, ip_address, created_at, user_id) FROM stdin;
1	STOCK_ENTRY	Batch LOT-125	{"quantity": 0}	{"quantity": 1}	\N	2025-12-08 15:36:28.212536	1
2	STOCK_DISPATCH	Product 22	\N	{"dispatched": [{"deducted": 1, "remaining": 0, "batchNumber": "LOT-125"}]}	\N	2025-12-08 15:39:56.89979	1
3	STOCK_ENTRY	Batch LOT-125	{"quantity": 0}	{"quantity": 3}	\N	2025-12-08 15:42:27.194306	1
4	STOCK_ENTRY	Batch LOT-125	{"quantity": 0}	{"quantity": 3}	\N	2025-12-09 15:33:27.403411	3
5	STOCK_ENTRY	Batch LOT-125	{"quantity": 3}	{"quantity": 8}	\N	2025-12-09 15:33:48.019216	3
6	STOCK_DISPATCH	Product 9	\N	{"dispatched": [{"deducted": 1, "remaining": 7, "batchNumber": "DIST-9-1-793"}]}	\N	2025-12-09 16:06:07.525751	1
7	STOCK_DISPATCH	Product 10	\N	{"dispatched": [{"deducted": 2, "remaining": 7, "batchNumber": "DIST-10-1-523"}]}	\N	2025-12-09 16:12:30.572878	1
8	STOCK_DISPATCH	Product 20	\N	{"dispatched": [{"deducted": 2, "remaining": 6, "batchNumber": "LOT-125"}]}	\N	2025-12-11 13:47:44.97318	1
9	STOCK_DISPATCH	Product 7	\N	{"dispatched": [{"deducted": 5, "remaining": 8, "batchNumber": "DIST-7-1-358"}]}	\N	2025-12-11 13:54:02.649235	1
10	STOCK_DISPATCH	Product 12	\N	{"dispatched": [{"deducted": 4, "remaining": 8, "batchNumber": "DIST-12-1-259"}]}	\N	2025-12-11 16:09:03.610904	1
11	STOCK_DISPATCH	Product 11	\N	{"dispatched": [{"deducted": 1, "remaining": 11, "batchNumber": "DIST-11-1-788"}]}	\N	2025-12-12 07:54:22.381421	1
12	STOCK_DISPATCH	Product 20	\N	{"dispatched": [{"deducted": 1, "remaining": 5, "batchNumber": "LOT-125"}]}	\N	2025-12-12 07:54:54.289118	1
13	STOCK_DISPATCH	Product 11	\N	{"dispatched": [{"deducted": 1, "remaining": 10, "batchNumber": "DIST-11-1-788"}]}	\N	2025-12-17 09:53:28.160179	1
14	STOCK_ENTRY	Batch LOT-125	{"quantity": 5}	{"quantity": 9}	\N	2025-12-19 12:01:48.682643	1
15	STOCK_ENTRY	Batch 126	{"quantity": 0}	{"quantity": 12}	\N	2025-12-19 12:03:16.742657	1
16	STOCK_DISPATCH	Product 5	\N	{"dispatched": [{"deducted": 4, "remaining": 5, "batchNumber": "DIST-5-1-830"}]}	\N	2025-12-19 12:04:02.871657	1
17	STOCK_ENTRY	Batch LOT-125	{"quantity": 0}	{"quantity": 9}	\N	2025-12-24 08:03:09.577873	1
18	STOCK_ENTRY	Batch 126	{"quantity": 0}	{"quantity": 4}	\N	2025-12-24 08:03:36.153835	1
19	STOCK_ENTRY	Batch LOT-125	{"quantity": 0}	{"quantity": 1}	\N	2026-01-30 03:49:31.25769	1
20	STOCK_DISPATCH	Product 11	\N	{"dispatched": [{"deducted": 2, "remaining": 10, "batchNumber": "126"}]}	\N	2026-01-30 03:54:19.695289	1
\.


--
-- Data for Name: batches; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.batches (id, batch_number, quantity, expiration_date, received_at, product_id, location_id) FROM stdin;
2	LOT-EXP-LATER	50	2026-03-18	2025-12-08 14:51:37.369237	2	1
4	LOT-125	0	2025-12-12	2025-12-08 15:36:28.187955	22	1
5	LOT-125	3	2025-12-18	2025-12-08 15:42:27.182025	27	2
6	DIST-20-1-369	13	2026-06-01	2025-12-09 10:16:54.382884	20	1
7	DIST-20-2-559	11	2026-06-01	2025-12-09 10:16:54.402352	20	2
8	DIST-20-3-819	13	2026-06-01	2025-12-09 10:16:54.409451	20	3
9	DIST-20-4-201	11	2026-06-01	2025-12-09 10:16:54.416277	20	4
10	DIST-19-1-487	6	2026-06-01	2025-12-09 10:16:54.423149	19	1
11	DIST-19-2-815	14	2026-06-01	2025-12-09 10:16:54.42836	19	2
12	DIST-19-3-351	12	2026-06-01	2025-12-09 10:16:54.440788	19	3
13	DIST-19-4-903	6	2026-06-01	2025-12-09 10:16:54.446191	19	4
14	DIST-18-1-460	5	2026-06-01	2025-12-09 10:16:54.450668	18	1
15	DIST-18-2-781	7	2026-06-01	2025-12-09 10:16:54.456731	18	2
16	DIST-18-3-607	9	2026-06-01	2025-12-09 10:16:54.461416	18	3
17	DIST-18-4-221	6	2026-06-01	2025-12-09 10:16:54.466201	18	4
18	DIST-17-1-367	7	2026-06-01	2025-12-09 10:16:54.470958	17	1
19	DIST-17-2-239	12	2026-06-01	2025-12-09 10:16:54.47587	17	2
20	DIST-17-3-760	13	2026-06-01	2025-12-09 10:16:54.480562	17	3
21	DIST-17-4-352	5	2026-06-01	2025-12-09 10:16:54.485885	17	4
22	DIST-16-1-971	11	2026-06-01	2025-12-09 10:16:54.490482	16	1
23	DIST-16-2-407	13	2026-06-01	2025-12-09 10:16:54.494996	16	2
24	DIST-16-3-562	5	2026-06-01	2025-12-09 10:16:54.49907	16	3
25	DIST-16-4-846	12	2026-06-01	2025-12-09 10:16:54.503944	16	4
26	DIST-15-1-392	12	2026-06-01	2025-12-09 10:16:54.509766	15	1
27	DIST-15-2-788	5	2026-06-01	2025-12-09 10:16:54.514048	15	2
28	DIST-15-3-863	12	2026-06-01	2025-12-09 10:16:54.518266	15	3
29	DIST-15-4-399	8	2026-06-01	2025-12-09 10:16:54.523243	15	4
30	DIST-14-1-104	8	2026-06-01	2025-12-09 10:16:54.527084	14	1
31	DIST-14-2-874	6	2026-06-01	2025-12-09 10:16:54.531274	14	2
32	DIST-14-3-176	9	2026-06-01	2025-12-09 10:16:54.534902	14	3
33	DIST-14-4-594	12	2026-06-01	2025-12-09 10:16:54.540159	14	4
34	DIST-13-1-401	11	2026-06-01	2025-12-09 10:16:54.555078	13	1
35	DIST-13-2-558	8	2026-06-01	2025-12-09 10:16:54.561326	13	2
36	DIST-13-3-260	13	2026-06-01	2025-12-09 10:16:54.567046	13	3
37	DIST-13-4-922	7	2026-06-01	2025-12-09 10:16:54.574259	13	4
39	DIST-12-2-757	5	2026-06-01	2025-12-09 10:16:54.585827	12	2
40	DIST-12-3-552	5	2026-06-01	2025-12-09 10:16:54.590939	12	3
41	DIST-12-4-280	14	2026-06-01	2025-12-09 10:16:54.59939	12	4
43	DIST-11-2-790	11	2026-06-01	2025-12-09 10:16:54.61346	11	2
44	DIST-11-3-760	10	2026-06-01	2025-12-09 10:16:54.618433	11	3
45	DIST-11-4-978	7	2026-06-01	2025-12-09 10:16:54.624475	11	4
47	DIST-10-2-709	13	2026-06-01	2025-12-09 10:16:54.638099	10	2
48	DIST-10-3-508	9	2026-06-01	2025-12-09 10:16:54.64571	10	3
49	DIST-10-4-834	8	2026-06-01	2025-12-09 10:16:54.650793	10	4
51	DIST-9-2-246	13	2026-06-01	2025-12-09 10:16:54.661121	9	2
52	DIST-9-3-983	6	2026-06-01	2025-12-09 10:16:54.669175	9	3
53	DIST-9-4-434	8	2026-06-01	2025-12-09 10:16:54.673901	9	4
54	DIST-8-1-669	6	2026-06-01	2025-12-09 10:16:54.678358	8	1
55	DIST-8-2-472	7	2026-06-01	2025-12-09 10:16:54.684156	8	2
56	DIST-8-3-903	11	2026-06-01	2025-12-09 10:16:54.68861	8	3
57	DIST-8-4-83	12	2026-06-01	2025-12-09 10:16:54.69346	8	4
59	DIST-7-2-216	14	2026-06-01	2025-12-09 10:16:54.704311	7	2
60	DIST-7-3-631	6	2026-06-01	2025-12-09 10:16:54.708784	7	3
61	DIST-7-4-433	7	2026-06-01	2025-12-09 10:16:54.712636	7	4
62	DIST-6-1-676	5	2026-06-01	2025-12-09 10:16:54.716394	6	1
63	DIST-6-2-922	8	2026-06-01	2025-12-09 10:16:54.720592	6	2
64	DIST-6-3-520	10	2026-06-01	2025-12-09 10:16:54.724816	6	3
65	DIST-6-4-666	10	2026-06-01	2025-12-09 10:16:54.729194	6	4
67	DIST-5-2-93	14	2026-06-01	2025-12-09 10:16:54.738941	5	2
68	DIST-5-3-942	14	2026-06-01	2025-12-09 10:16:54.743001	5	3
69	DIST-5-4-216	10	2026-06-01	2025-12-09 10:16:54.746806	5	4
70	DIST-4-1-112	9	2026-06-01	2025-12-09 10:16:54.750711	4	1
71	DIST-4-2-834	11	2026-06-01	2025-12-09 10:16:54.7555	4	2
72	DIST-4-3-473	9	2026-06-01	2025-12-09 10:16:54.759359	4	3
73	DIST-4-4-583	12	2026-06-01	2025-12-09 10:16:54.763662	4	4
74	DIST-3-1-667	14	2026-06-01	2025-12-09 10:16:54.767159	3	1
75	DIST-3-2-11	5	2026-06-01	2025-12-09 10:16:54.771054	3	2
76	DIST-3-3-939	7	2026-06-01	2025-12-09 10:16:54.774733	3	3
77	DIST-3-4-476	9	2026-06-01	2025-12-09 10:16:54.77848	3	4
1	LOT-EXP-SOON	55	2025-12-18	2025-12-08 14:51:37.356527	2	1
78	DIST-2-2-197	14	2026-06-01	2025-12-09 10:16:54.799927	2	2
79	DIST-2-3-191	8	2026-06-01	2025-12-09 10:16:54.804116	2	3
80	DIST-2-4-235	5	2026-06-01	2025-12-09 10:16:54.808225	2	4
81	DIST-1-1-439	5	2026-06-01	2025-12-09 10:16:54.812331	1	1
82	DIST-1-2-31	5	2026-06-01	2025-12-09 10:16:54.816152	1	2
83	DIST-1-3-328	6	2026-06-01	2025-12-09 10:16:54.819888	1	3
84	DIST-1-4-578	10	2026-06-01	2025-12-09 10:16:54.823585	1	4
87	LOT-125	9	2025-12-26	2025-12-24 08:03:09.559181	6	1
50	DIST-9-1-793	7	2026-06-01	2025-12-09 10:16:54.65606	9	1
46	DIST-10-1-523	7	2026-06-01	2025-12-09 10:16:54.629961	10	1
88	126	4	2025-12-28	2025-12-24 08:03:36.145754	3	\N
58	DIST-7-1-358	8	2026-06-01	2025-12-09 10:16:54.699335	7	1
38	DIST-12-1-259	8	2026-06-01	2025-12-09 10:16:54.579825	12	1
89	LOT-125	1	2026-02-01	2026-01-30 03:49:31.220386	9	\N
86	126	10	2025-12-23	2025-12-19 12:03:16.719654	11	\N
42	DIST-11-1-788	10	2026-06-01	2025-12-09 10:16:54.606363	11	1
85	LOT-125	9	2025-12-10	2025-12-09 15:33:27.373464	20	2
66	DIST-5-1-830	5	2026-06-01	2025-12-09 10:16:54.733977	5	1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.categories (id, name) FROM stdin;
1	Antibiotiques
5	Antalgiques & Anti-inflammatoires
6	Premiers Secours
7	Vitamines & Compléments
8	Protection & Hygiène
9	Matériel Médical
10	Urgences & Réanimation
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.locations (id, name, description) FROM stdin;
1	Pharmacie Centrale	Zone de stockage
2	Bloc Opératoire	Zone de stockage
3	Urgences	Zone de stockage
4	Réserve Sous-sol	Zone de stockage
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.products (id, name, description, sku, barcode, min_threshold, max_threshold, datamatrix_code, is_prescription_needed, price, created_at, updated_at, category_id, supplier_id) FROM stdin;
14	Soluté Glucosé 5%	Sac 500ml	GLUC500	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.368757	2025-12-08 15:32:03.368757	\N	\N
15	Soluté Salé 0.9%	Sac 500ml	SAL500	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.374189	2025-12-08 15:32:03.374189	\N	\N
16	Cathéter 18G	Boîte de 50	CT18G50	\N	15	\N	\N	f	0.00	2025-12-08 15:32:03.379105	2025-12-08 15:32:03.379105	\N	\N
17	Cathéter 20G	Boîte de 50	CT20G50	\N	15	\N	\N	f	0.00	2025-12-08 15:32:03.383433	2025-12-08 15:32:03.383433	\N	\N
18	Perfuseur Standard	Boîte de 25	PERF25	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.387915	2025-12-08 15:32:03.387915	\N	\N
19	Set de Suture 3/0	Kit complet	SUT30K	\N	5	\N	\N	f	0.00	2025-12-08 15:32:03.391935	2025-12-08 15:32:03.391935	\N	\N
22	Tubes EDTA	Boîte de 200	TEDTA200	\N	30	\N	\N	f	0.00	2025-12-08 15:32:03.404828	2025-12-08 15:32:03.404828	\N	\N
23	Tubes Citrate	Boîte de 200	TCIT200	\N	30	\N	\N	f	0.00	2025-12-08 15:32:03.409024	2025-12-08 15:32:03.409024	\N	\N
25	Thermomètre Digital	Unité	THERMDIG	\N	5	\N	\N	f	0.00	2025-12-08 15:32:03.418188	2025-12-08 15:32:03.418188	\N	\N
26	Défibrillateur Électrodes	Paire d'électrodes	DEFEL	\N	5	\N	\N	f	0.00	2025-12-08 15:32:03.422461	2025-12-08 15:32:03.422461	\N	\N
27	Draps d’Examen	Rouleau de 100 DR	DRAP100	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.42628	2025-12-08 15:32:03.42628	\N	\N
28	Champs Stériles	Lot de 20	CHST20	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.435148	2025-12-08 15:32:03.435148	\N	\N
29	Champ Opératoire Adhésif	Unité	CHOPAD	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.438986	2025-12-08 15:32:03.438986	\N	\N
6	Amoxicilline 500mg	Boîte de 12 gélules	AMOX500	\N	15	\N	\N	t	0.00	2025-12-08 15:32:03.326782	2025-12-09 10:50:59.6603	1	\N
2	Amoxicilline 500mg	\N	AMX-500	\N	50	\N	\N	t	5.90	2025-12-08 14:51:37.335918	2025-12-09 10:50:59.679152	1	\N
4	Serum Phy Utils	\N	SER-PHY	\N	200	\N	\N	f	1.50	2025-12-08 14:51:37.348805	2025-12-09 10:56:20.431151	6	\N
8	Serum Physiologique 0.9%	Flacon 500ml	SERUM500	\N	20	\N	\N	f	0.00	2025-12-08 15:32:03.339036	2025-12-09 10:56:20.438869	6	\N
13	Compresses Stériles 10x10	Paquet de 50	CPS1010	\N	20	\N	\N	f	0.00	2025-12-08 15:32:03.363688	2025-12-09 10:56:20.443057	6	\N
1	Doliprane 1000mg	\N	DOL-1000	\N	100	\N	\N	f	2.50	2025-12-08 14:51:37.32818	2025-12-09 10:56:20.44899	5	\N
3	Morphine Injectable	\N	MOR-INJ	\N	10	\N	\N	t	15.00	2025-12-08 14:51:37.341706	2025-12-09 10:56:20.454952	5	\N
5	Doliprane 1000mg	Boîte de 8 comprimés	DOLI1000	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.311223	2025-12-09 10:56:20.460022	5	\N
7	Morphine Injectable 10mg	Flacon 10ml	MORPH10	\N	5	\N	\N	t	0.00	2025-12-08 15:32:03.333348	2025-12-09 10:56:20.465999	5	\N
24	Gels Ultrasons 250ml	Flacon 250ml	GELUS250	\N	10	\N	\N	f	0.00	2025-12-08 15:32:03.413261	2025-12-09 10:56:20.470981	8	\N
21	Aiguilles 23G	Boîte de 100	AIG23G100	\N	20	\N	\N	f	0.00	2025-12-08 15:32:03.400427	2025-12-09 10:56:20.47526	9	\N
20	Aiguilles 21G	Boîte de 100	AIG21G100	\N	20	\N	\N	f	0.00	2025-12-08 15:32:03.395966	2025-12-09 10:56:20.48381	9	\N
12	Masques Chirurgicaux	Boîte de 50 unités	MSK50	\N	50	\N	\N	f	0.00	2025-12-08 15:32:03.358604	2025-12-09 10:56:20.487532	8	\N
11	Masques FFP2	Boîte de 20 unités	FFP2-20	\N	40	\N	\N	f	0.00	2025-12-08 15:32:03.35398	2025-12-09 10:56:20.491105	8	\N
10	Gants Latex Taille L	Boîte de 100 unités	GNTL100	\N	25	\N	\N	f	0.00	2025-12-08 15:32:03.349411	2025-12-09 10:56:20.495398	8	\N
9	Gants Nitrile Taille M	Boîte de 100 unités	GNTM100	\N	30	\N	\N	f	0.00	2025-12-08 15:32:03.344407	2025-12-09 10:56:20.499864	8	\N
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.stock_movements (id, type, quantity_change, reason, created_at, batch_id, user_id) FROM stdin;
1	IN	50	Initial Seeding	2025-12-08 14:51:37.362451	1	1
2	IN	50	Initial Seeding	2025-12-08 14:51:37.374321	2	1
4	IN	1	Réception fournisseur	2025-12-08 15:36:28.187955	4	1
5	OUT	-1	Dispensation patient	2025-12-08 15:39:56.88715	4	1
6	IN	3	Réception fournisseur	2025-12-08 15:42:27.182025	5	1
7	IN	3	Réception fournisseur	2025-12-09 15:33:27.373464	85	3
8	IN	5	Réception fournisseur	2025-12-09 15:33:48.000446	85	3
9	OUT	-1	Dispensation patient	2025-12-09 16:06:07.503407	50	1
10	OUT	-2	Dispensation patient	2025-12-09 16:12:30.561592	46	1
11	OUT	-2	Dispensation patient	2025-12-11 13:47:44.953574	85	1
12	OUT	-5	Dispensation patient	2025-12-11 13:54:02.637592	58	1
13	OUT	-4	Dispensation patient	2025-12-11 16:09:03.571474	38	1
14	OUT	-1	Dispensation patient	2025-12-12 07:54:22.361267	42	1
15	OUT	-1	Dispensation patient	2025-12-12 07:54:54.281075	85	1
16	OUT	-1	Dispensation patient	2025-12-17 09:53:28.060164	42	1
17	IN	4	Réception fournisseur	2025-12-19 12:01:48.658932	85	1
18	IN	12	Réception fournisseur	2025-12-19 12:03:16.719654	86	1
19	OUT	-4	Dispensation patient	2025-12-19 12:04:02.85656	66	1
20	IN	9	Réception fournisseur	2025-12-24 08:03:09.559181	87	1
21	IN	4	Réception fournisseur	2025-12-24 08:03:36.145754	88	1
22	IN	1	Réception fournisseur	2026-01-30 03:49:31.220386	89	1
23	OUT	-2	Dispensation patient	2026-01-30 03:54:19.673241	86	1
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.suppliers (id, name, contact_person, contact_email, contact_phone, created_at) FROM stdin;
1	pfizer	nassrellah	nasserallahnaji@gmail.com	0687328230	2025-12-08 15:21:09.220193
2	Sanofi	marouane Youlakou	youlakou@gmail.com	0601020304	2025-12-09 14:52:22.927893
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password_hash, is_active, role, created_at, updated_at) FROM stdin;
1	admin	admin@stockcare.hospital	$2b$10$scE2xz.mC/2Pw8epCf6icesR8OC2H7RKcck2P6v0ksP2QbHgCo1TK	t	ADMIN	2025-12-08 14:51:37.254866	2025-12-08 14:51:37.254866
2	pharmacien	pharmacien@stockcare.hospital	$2b$10$scE2xz.mC/2Pw8epCf6icesR8OC2H7RKcck2P6v0ksP2QbHgCo1TK	t	PHARMACIEN	2025-12-08 14:51:37.268081	2025-12-08 14:51:37.268081
3	magasinier	magasinier@stockcare.hospital	$2b$10$scE2xz.mC/2Pw8epCf6icesR8OC2H7RKcck2P6v0ksP2QbHgCo1TK	t	MAGASINIER	2025-12-08 14:51:37.274621	2025-12-08 14:51:37.274621
4	auditeur	auditeur@stockcare.hospital	$2b$10$scE2xz.mC/2Pw8epCf6icesR8OC2H7RKcck2P6v0ksP2QbHgCo1TK	t	AUDITEUR	2025-12-08 14:51:37.28126	2025-12-08 14:51:37.28126
5	admin_it	admin_it@stockcare.hospital	$2b$10$scE2xz.mC/2Pw8epCf6icesR8OC2H7RKcck2P6v0ksP2QbHgCo1TK	t	ADMIN_IT	2025-12-08 14:51:37.287456	2025-12-08 14:51:37.287456
6	nassrellahnaji	nassro@gmail.com	$2b$10$sr7otndZJdwkhhaOr73dy.4KLU9vnkK1On7ZpaURA.Fm68ulfqBpi	t	PHARMACIEN	2025-12-09 15:55:42.843478	2025-12-09 15:55:42.843478
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 20, true);


--
-- Name: batches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.batches_id_seq', 89, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.locations_id_seq', 4, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.products_id_seq', 29, true);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 23, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: batches PK_55e7ff646e969b61d37eea5be7a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT "PK_55e7ff646e969b61d37eea5be7a" PRIMARY KEY (id);


--
-- Name: stock_movements PK_57a26b190618550d8e65fb860e7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT "PK_57a26b190618550d8e65fb860e7" PRIMARY KEY (id);


--
-- Name: locations PK_7cc1c9e3853b94816c094825e74; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: suppliers PK_b70ac51766a9e3144f778cfe81e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY (id);


--
-- Name: locations UQ_227023051ab1fedef7a3b6c7e2a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT "UQ_227023051ab1fedef7a3b6c7e2a" UNIQUE (name);


--
-- Name: categories UQ_8b0be371d28245da6e4f4b61878; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: products UQ_adfc522baf9d9b19cd7d9461b7e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e" UNIQUE (barcode);


--
-- Name: products UQ_c44ac33a05b144dd0d9ddcf9327; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE (sku);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: batches FK_07ad38527d0d87601f3b05a6a22; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT "FK_07ad38527d0d87601f3b05a6a22" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products FK_0ec433c1e1d444962d592d86c86; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_0ec433c1e1d444962d592d86c86" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: stock_movements FK_64c67f927d872a7e19700ab6637; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT "FK_64c67f927d872a7e19700ab6637" FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: products FK_9a5f6868c96e0069e699f33e124; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: audit_logs FK_bd2726fd31b35443f2245b93ba0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: batches FK_cc20e5d1a22b2203e8c2d1557b6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT "FK_cc20e5d1a22b2203e8c2d1557b6" FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: stock_movements FK_d7fedfd6ee0f4a06648c48631c6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT "FK_d7fedfd6ee0f4a06648c48631c6" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO powerbi;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.audit_logs TO powerbi;


--
-- Name: TABLE batches; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.batches TO powerbi;


--
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.categories TO powerbi;


--
-- Name: TABLE locations; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.locations TO powerbi;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.products TO powerbi;


--
-- Name: TABLE stock_movements; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.stock_movements TO powerbi;


--
-- Name: TABLE suppliers; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.suppliers TO powerbi;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT ON TABLE public.users TO powerbi;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT SELECT ON TABLES  TO powerbi;


--
-- PostgreSQL database dump complete
--

\unrestrict ghPUM3ugSkj2jvNBCxM1mAmWSWdlT1m3nEow7GMo52e5Jf418uM777oLstW15qm

