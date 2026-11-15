PRAGMA foreign_keys = ON;

DROP VIEW  IF EXISTS v_resumen_categorias;
DROP VIEW  IF EXISTS v_resumen_signos;
DROP VIEW  IF EXISTS v_lecturas_clasificadas;
DROP TABLE IF EXISTS lecturas;
DROP TABLE IF EXISTS rangos;
DROP TABLE IF EXISTS signos;

CREATE TABLE signos (
    id      INTEGER PRIMARY KEY,
    clave   TEXT NOT NULL UNIQUE,
    nombre  TEXT NOT NULL,
    unidad  TEXT NOT NULL
);

CREATE TABLE rangos (
    id         INTEGER PRIMARY KEY,
    signo_id   INTEGER NOT NULL REFERENCES signos(id),
    categoria  TEXT NOT NULL,
    nivel      TEXT NOT NULL CHECK (nivel IN ('ok','alerta','malo')),
    min_valor  REAL,
    max_valor  REAL
);

CREATE TABLE lecturas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    signo_id   INTEGER NOT NULL REFERENCES signos(id),
    valor      REAL NOT NULL,
    fecha_hora TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE INDEX idx_lecturas_signo_fecha ON lecturas(signo_id, fecha_hora);

INSERT INTO signos (id, clave, nombre, unidad) VALUES
 (1,'oxigeno','Saturación de oxígeno','%'),
 (2,'mmhg',   'Presión sistólica',     'mmHg'),
 (3,'bpm',    'Frecuencia cardíaca',   'bpm'),
 (4,'rpm',    'Respiraciones',         'resp/min'),
 (5,'tc',     'Temperatura corporal',  '°C');

INSERT INTO rangos (signo_id, categoria, nivel, min_valor, max_valor) VALUES
 (1,'peligrosamente baja','malo',  NULL, 90),
 (1,'baja',               'alerta', 90,  93),
 (1,'preocupante',        'alerta', 93,  95),
 (1,'adecuada',           'ok',     95,  NULL),

 (2,'peligrosamente baja','malo',  NULL, 80),
 (2,'baja',               'alerta', 80,  90),
 (2,'estable',            'ok',     90, 121),
 (2,'preocupante',        'alerta',121, 140),
 (2,'peligrosamente alta','malo',  140, NULL),

 (3,'peligrosamente baja','malo',  NULL, 40),
 (3,'baja',               'alerta', 40,  60),
 (3,'estable',            'ok',     60, 101),
 (3,'preocupante',        'alerta',101, 121),
 (3,'peligrosamente alta','malo',  121, NULL),

 (4,'peligrosamente baja','malo',  NULL,  9),
 (4,'baja',               'alerta',  9,  12),
 (4,'estable',            'ok',     12,  21),
 (4,'preocupante',        'alerta', 21,  25),
 (4,'peligrosamente alta','malo',   25, NULL),

 (5,'peligrosamente baja','malo',  NULL, 35.0),
 (5,'baja',               'alerta', 35.0, 36.1),
 (5,'estable',            'ok',     36.1, 37.3),
 (5,'preocupante',        'alerta', 37.3, 38.9),
 (5,'peligrosamente alta','malo',   38.9, NULL);

CREATE VIEW v_lecturas_clasificadas AS
SELECT l.id, l.fecha_hora, s.clave, s.nombre, s.unidad, l.valor,
       r.categoria, r.nivel
FROM lecturas l
JOIN signos s  ON s.id = l.signo_id
JOIN rangos r  ON r.signo_id = l.signo_id
              AND (r.min_valor IS NULL OR l.valor >= r.min_valor)
              AND (r.max_valor IS NULL OR l.valor <  r.max_valor);

CREATE VIEW v_resumen_signos AS
SELECT clave, nombre, unidad, COUNT(*) AS n,
       MIN(valor) AS minimo, ROUND(AVG(valor),1) AS promedio, MAX(valor) AS maximo
FROM v_lecturas_clasificadas
GROUP BY clave, nombre, unidad;

CREATE VIEW v_resumen_categorias AS
SELECT clave, nombre, nivel, COUNT(*) AS total
FROM v_lecturas_clasificadas
GROUP BY clave, nombre, nivel;

INSERT INTO lecturas (signo_id, valor, fecha_hora) VALUES
 (1,98,'2026-11-14 00:00'),(1,97,'2026-11-14 02:00'),(1,96,'2026-11-14 04:00'),(1,95,'2026-11-14 06:00'),
 (1,94,'2026-11-14 08:00'),(1,92,'2026-11-14 10:00'),(1,89,'2026-11-14 12:00'),(1,93,'2026-11-14 14:00'),
 (1,96,'2026-11-14 16:00'),(1,98,'2026-11-14 18:00'),(1,97,'2026-11-14 20:00'),(1,98,'2026-11-14 22:00'),

 (2,112,'2026-11-14 00:00'),(2,108,'2026-11-14 02:00'),(2,104,'2026-11-14 04:00'),(2,110,'2026-11-14 06:00'),
 (2,118,'2026-11-14 08:00'),(2,125,'2026-11-14 10:00'),(2,132,'2026-11-14 12:00'),(2,141,'2026-11-14 14:00'),
 (2,128,'2026-11-14 16:00'),(2,119,'2026-11-14 18:00'),(2,115,'2026-11-14 20:00'),(2,86,'2026-11-14 22:00'),

 (3,58,'2026-11-14 00:00'),(3,55,'2026-11-14 02:00'),(3,52,'2026-11-14 04:00'),(3,64,'2026-11-14 06:00'),
 (3,78,'2026-11-14 08:00'),(3,92,'2026-11-14 10:00'),(3,108,'2026-11-14 12:00'),(3,118,'2026-11-14 14:00'),
 (3,96,'2026-11-14 16:00'),(3,84,'2026-11-14 18:00'),(3,72,'2026-11-14 20:00'),(3,66,'2026-11-14 22:00'),

 (4,14,'2026-11-14 00:00'),(4,13,'2026-11-14 02:00'),(4,12,'2026-11-14 04:00'),(4,15,'2026-11-14 06:00'),
 (4,16,'2026-11-14 08:00'),(4,19,'2026-11-14 10:00'),(4,23,'2026-11-14 12:00'),(4,26,'2026-11-14 14:00'),
 (4,20,'2026-11-14 16:00'),(4,17,'2026-11-14 18:00'),(4,15,'2026-11-14 20:00'),(4,10,'2026-11-14 22:00'),

 (5,36.4,'2026-11-14 00:00'),(5,36.2,'2026-11-14 02:00'),(5,36.0,'2026-11-14 04:00'),(5,36.5,'2026-11-14 06:00'),
 (5,36.9,'2026-11-14 08:00'),(5,37.4,'2026-11-14 10:00'),(5,38.2,'2026-11-14 12:00'),(5,39.0,'2026-11-14 14:00'),
 (5,37.8,'2026-11-14 16:00'),(5,37.1,'2026-11-14 18:00'),(5,36.8,'2026-11-14 20:00'),(5,36.6,'2026-11-14 22:00');
