CREATE TABLE IF NOT EXISTS pamm_index(
	
	id	 		INTEGER PRIMARY KEY AUTOINCREMENT,
	name 		TEXT,
	url 		TEXT, 
	start_date 	TEXT,
	profit		REAL
	
);


CREATE TABLE IF NOT EXISTS pamm_index_details (
	
	id 			INTEGER,
	index_id	INTEGER,
	pamm_id		INTEGER,
	share		REAL,
	
	FOREIGN KEY(index_id) REFERENCES pamm_index(id)
	
);