PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS misiones (
    id_mision       INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo          TEXT NOT NULL UNIQUE,
    nombre          TEXT NOT NULL,
    destino         TEXT,
    fecha_inicio    TEXT,
    fecha_fin       TEXT,
    capacidad       INTEGER NOT NULL DEFAULT 8
                    CHECK (capacidad > 0),
    estado          TEXT NOT NULL DEFAULT 'Preparacion'
                    CHECK (estado IN ('Preparacion', 'Activa', 'Finalizada', 'Cancelada')),
    notas           TEXT,
    creado_en       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS astronautas (
    id_astronauta  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre         TEXT NOT NULL,
    sexo           TEXT CHECK (sexo IN ('F', 'M', 'Otro', 'No especificado')),
    fecha_nacimiento TEXT,
    nacionalidad   TEXT,
    fotografia     TEXT,
    observaciones  TEXT,
    creado_en      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tripulacion_mision (
    id_tripulacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_mision      INTEGER NOT NULL,
    id_astronauta  INTEGER NOT NULL,
    cargo          TEXT,
    estado_convocatoria TEXT NOT NULL DEFAULT 'Convocado'
                       CHECK (estado_convocatoria IN
                       ('Convocado', 'Confirmado', 'Reserva', 'Retirado')),
    fecha_alta     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_mision, id_astronauta),
    FOREIGN KEY (id_mision) REFERENCES misiones(id_mision)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_astronauta) REFERENCES astronautas(id_astronauta)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS parametros_vitales (
    id_parametro INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre       TEXT NOT NULL UNIQUE,
    unidad       TEXT NOT NULL,
    descripcion  TEXT,
    activo       INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);

CREATE TABLE IF NOT EXISTS lecturas_vitales (
    id_lectura    INTEGER PRIMARY KEY AUTOINCREMENT,
    id_mision     INTEGER NOT NULL,
    id_astronauta INTEGER NOT NULL,
    id_parametro  INTEGER NOT NULL,
    valor         REAL NOT NULL,
    fecha_hora    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado        TEXT NOT NULL DEFAULT 'Sin clasificar'
                  CHECK (estado IN
                  ('Estable', 'Advertencia', 'Fuera de rango', 'Crítico', 'Sin clasificar')),
    observaciones TEXT,
    FOREIGN KEY (id_mision, id_astronauta)
        REFERENCES tripulacion_mision(id_mision, id_astronauta)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_parametro) REFERENCES parametros_vitales(id_parametro)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tripulacion_mision
    ON tripulacion_mision(id_mision);
CREATE INDEX IF NOT EXISTS idx_tripulacion_astronauta
    ON tripulacion_mision(id_astronauta);
CREATE INDEX IF NOT EXISTS idx_lecturas_astronauta_fecha
    ON lecturas_vitales(id_astronauta, fecha_hora);